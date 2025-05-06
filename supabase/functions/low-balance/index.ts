import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";
import { sendPushNotification } from "../_shared/sendNotification.ts";

console.log("Hello from Functions!");

interface TPurchaseDetail {
  total: number;
}

interface TAddedMoney {
  balance: number;
}

Deno.serve(async (req) => {
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? ""
  );

  const LOW_BALANCE_THRESHOLD = 500;

  const { data: users, error: userError } = await supabase
    .from("profiles")
    .select("id, push_token");

  if (userError) {
    console.error("Error fetching users:", userError);
    return new Response(JSON.stringify({ error: userError.message }), {
      status: 500,
    });
  }

  for (const user of users) {
    const userId = user.id;

    const { data: purchases, error: purchaseError } = await supabase
      .from("purchase_details")
      .select("total")
      .eq("user_id", userId);

    if (purchaseError) {
      console.error(`Error fetching purchases for ${userId}:`, purchaseError);
      continue;
    }

    const totalPurchaseAmount = (purchases ?? []).reduce(
      (acc: number, item: TPurchaseDetail) => acc + item.total,
      0
    );

    const { data: addedMoneyData, error: addedMoneyError } = await supabase
      .from("added_money")
      .select("balance")
      .eq("user_id", userId);

    if (addedMoneyError) {
      console.error(
        `Error fetching added money for ${userId}:`,
        addedMoneyError
      );
      continue;
    }

    const totalAddedMoney = (addedMoneyData ?? []).reduce(
      (acc: number, item: TAddedMoney) => acc + item.balance,
      0
    );

    const restBalance = totalAddedMoney - totalPurchaseAmount;

    if (restBalance < LOW_BALANCE_THRESHOLD) {
      const { error: notificationError } = await supabase.from("notifications").insert({
        user_id: userId,
        title: "⚠️ Low Balance Alert",
        description: `Your current balance is ₹${restBalance.toLocaleString()}. Please add more money to maintain a minimum balance of ₹${LOW_BALANCE_THRESHOLD.toLocaleString()}.`,
      });

      if (notificationError) {
        console.error(`Error creating notification for ${userId}:`, notificationError);
        continue;
      }

      if (user.push_token) {
        await sendPushNotification(
          user.push_token,
          "⚠️ Low Balance Alert",
          `Your current balance is ₹${restBalance.toLocaleString()}. Please add more money to maintain a minimum balance of ₹${LOW_BALANCE_THRESHOLD.toLocaleString()}.`
        );
      } else {
        console.warn(`No push token found for user ${userId}`);
      }
    }
  }

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
  });
});
