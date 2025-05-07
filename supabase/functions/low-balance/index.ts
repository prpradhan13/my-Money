import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";
import { sendPushNotification } from "../_shared/sendNotification.ts";

console.log("Hello from Functions!");

interface UserBalance {
  user_id: string;
  total_added_money: number;
  total_purchase_amount: number;
  rest_balance: number;
  push_token: string | null;
}

Deno.serve(async (req) => {
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? ""
  );

  const LOW_BALANCE_THRESHOLD = 1000;

  const { data: userBalances, error: userBalancesError } = await supabase
    .from('user_balances')
    .select('*')
    .lte('rest_balance', LOW_BALANCE_THRESHOLD);

  if (userBalancesError) {
    console.error("Error fetching user balances:", userBalancesError);
    return new Response(JSON.stringify({ error: userBalancesError.message }), {
      status: 500,
    });
  }

  for (const userBalance of userBalances as UserBalance[]) {
    const { error: notificationError } = await supabase.from("notifications").insert({
      user_id: userBalance.user_id,
      title: "Low Balance Alert",
      description: `Your current balance is ₹${userBalance.rest_balance.toLocaleString()}. Please add more money to maintain a minimum balance of ₹${LOW_BALANCE_THRESHOLD.toLocaleString()}.`,
      type: "warning",
    });

    if (notificationError) {
      console.error(`Error creating notification for ${userBalance.user_id}:`, notificationError);
      continue;
    }

    if (userBalance.push_token) {
      await sendPushNotification(
        userBalance.push_token,
        "⚠️ Low Balance Alert",
        `Your current balance is ₹${userBalance.rest_balance.toLocaleString()}. Please add more money to maintain a minimum balance of ₹${LOW_BALANCE_THRESHOLD.toLocaleString()}.`
      );
    } else {
      console.warn(`No push token found for user ${userBalance.user_id}`);
    }
  }

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
  });
});
