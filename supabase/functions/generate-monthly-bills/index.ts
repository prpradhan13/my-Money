import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

console.log("Hello from Functions!");

Deno.serve(async (req) => {
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const { data: templates } = await supabase
    .from("bill_templates")
    .select("*")
    .eq("is_recurring", true);

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();

  for (const template of templates ?? []) {
    const dueDate = new Date(year, month, template.day_of_month);

    const { data: existing } = await supabase
      .from('bill_instances')
      .select('id')
      .eq('template_id', template.id)
      .gte('due_date', new Date(year, month, 1).toISOString())
      .lte('due_date', new Date(year, month + 1, 0).toISOString());

    if (!existing || existing.length === 0) {
      await supabase.from('bill_instances').insert({
        template_id: template.id,
        user_id: template.user_id,
        title: template.title,
        amount: template.amount,
        due_date: dueDate.toISOString(),
        status: 'pending'
      });
    }
  }

  return new Response(JSON.stringify({ success: true }));
});
