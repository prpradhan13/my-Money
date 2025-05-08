import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

console.log("Hello from Functions!");

async function sendPushNotification(
  expoPushToken: string,
  title: string,
  body: string
) {
  const message = {
    to: expoPushToken,
    sound: "default",
    title,
    body,
    data: { someData: "goes here" },
  };

  await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Accept-encoding": "gzip, deflate",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message),
  });
}

Deno.serve(async (req) => {
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const { data: templates, error: templatesError } = await supabase
    .from("bill_templates")
    .select("*")
    .eq("is_recurring", true);

  if (templatesError) {
    console.error("Failed to fetch templates:", templatesError);
    return new Response(
      JSON.stringify({ success: false, error: templatesError.message }),
      { status: 500 }
    );
  }

  const today = new Date();
  const normalizedToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const year = today.getFullYear();
  const month = today.getMonth();

  for (const template of templates ?? []) {
    let dueDate = new Date(year, month, template.day_of_month);

    if (dueDate < normalizedToday) {
      const nextMonth = month + 1;
      const nextMonthYear = nextMonth > 11 ? year + 1 : year;
      const nextMonthIndex = nextMonth % 12;
      const daysInNextMonth = new Date(nextMonthYear, nextMonthIndex + 1, 0).getDate();
      const clampedDay = Math.min(template.day_of_month, daysInNextMonth);
      dueDate = new Date(nextMonthYear, nextMonthIndex, clampedDay);
    }

    const { data: existing } = await supabase
      .from("bill_instances")
      .select("id")
      .eq("template_id", template.id)
      .gte("due_date", new Date(year, month, 1).toISOString())
      .lte("due_date", new Date(year, month + 1, 0).toISOString());

    if (!existing || existing.length === 0) {
      // Create new bill instance
      const { error } = await supabase
        .from("bill_instances")
        .insert({
          template_id: template.id,
          user_id: template.user_id,
          title: template.title,
          amount: template.amount,
          due_date: dueDate.toISOString(),
          status: "pending",
        })
        .select()
        .single();

      if (error) {
        console.error(
          `Failed to create bill for template ${template.id}`,
          error.message
        );
        continue;
      }
    }

    // 3. Send push notification only on correct reminder day
    const reminderDays = template.remind_before_days || 5;
    const reminderDate = new Date(dueDate);
    reminderDate.setDate(dueDate.getDate() - reminderDays);

    const isToday =
      today.getFullYear() === reminderDate.getFullYear() &&
      today.getMonth() === reminderDate.getMonth() &&
      today.getDate() === reminderDate.getDate();

    if (isToday) {
      const { error: notificationError } = await supabase
        .from("notifications")
        .insert({
          user_id: template.user_id,
          title: "Bill Reminder",
          description: `Your payment of ₹${template.amount} for ${
            template.title
          } is due on ${dueDate.toLocaleDateString("en-IN", {
            day: "numeric",
            month: "long",
          })}. Please ensure timely payment to avoid any late fees.`,
          type: "info",
        });

      if (notificationError) {
        console.error(
          `Error creating notification for ${template.user_id}:`,
          notificationError
        );
        continue;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("push_token")
        .eq("id", template.user_id)
        .single();

      if (profile?.push_token) {
        await sendPushNotification(
          profile.push_token,
          `Bill Reminder: ${template.title}`,
          `Your payment of ₹${template.amount} for ${
            template.title
          } is due on ${dueDate.toLocaleDateString("en-IN", {
            day: "numeric",
            month: "long",
          })}. Please ensure timely payment to avoid any late fees.`
        );
        console.log(`Push sent to ${template.user_id} for ${template.title}`);
      } else {
        console.warn(`No push token found for user ${template.user_id}`);
      }
    }
  }

  return new Response(JSON.stringify({ success: true }));
});
