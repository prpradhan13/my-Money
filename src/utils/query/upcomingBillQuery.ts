import useAuthStore from "@/src/store/authStore";
import { UpcomingBillType } from "@/src/types/upcomingBill.type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { errorToast, successToast } from "../helperFunction";
import { supabase } from "../lib/supabase";

export const useGetUpcomingBills = () => {
  const { user } = useAuthStore();
  const userId = user?.id;

  const today = new Date();
  const future = new Date();
  future.setDate(today.getDate() + 5);

  return useQuery({
    queryKey: ["upcomingBills", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bill_instances")
        .select("id, title, amount, due_date, status, bill_templates(id, category)")
        .eq("user_id", userId)
        .neq("status", "paid")
        .gte("due_date", today.toISOString().split("T")[0])
        .lte('due_date', future.toISOString().split('T')[0])
        .order("due_date", { ascending: true });

      if (error) {
        errorToast(error.message);
        throw new Error(error.message);
      }

      return data as unknown as UpcomingBillType[];
    },
  });
};

export const useStopRecurringBill = () => {
  const { user } = useAuthStore();
  const userId = user?.id;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (templateId: string) => {
      const { data, error } = await supabase
        .from("bill_templates")
        .update({ is_recurring: false })
        .eq("user_id", userId)
        .eq("template_id", templateId);

      if (error) {
        errorToast(error.message);
        throw new Error(error.message);
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["upcomingBills", userId] });
      successToast("Bill stopped");
    },
    onError: () => {
      errorToast("Failed to stop bill");
    },
  });
};

export const useMarkBillAsPaid = () => {
  const { user } = useAuthStore();
  const userId = user?.id;
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (billId: string) => {
      const { error } = await supabase
        .from("bill_instances")
        .update({ status: "paid" })
        .eq("id", billId);

      if (error) {
        errorToast(error.message);
        throw new Error(error.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["upcomingBills", userId] });
      successToast("Bill marked as paid");
    },
    onError: () => {
      errorToast("Failed to mark bill as paid");
    },
  });
};
