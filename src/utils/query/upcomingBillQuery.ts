import useAuthStore from "@/src/store/authStore";
import { PurchaseDetailsType } from "@/src/types/purchase.type";
import { AllCreatedBillsType, UpcomingBillType } from "@/src/types/upcomingBill.type";
import { TCreateUpcomingBillSchema } from "@/src/validations/form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
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
        .select("id, title, amount, due_date, status, bill_templates(id, category, is_recurring)")
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

export const useMarkBillAsPaid = () => {
  const { user } = useAuthStore();
  const userId = user?.id;
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (billId: string) => {
      const { data: billData, error: billError } = await supabase
        .from("bill_instances")
        .update({ status: "paid" })
        .eq("id", billId)
        .select("*, bill_templates(id, category)")
        .single();

      if (billError) {
        errorToast(billError.message);
        throw new Error(billError.message);
      }

      const bill = billData as UpcomingBillType;

      const { data: purchaseData, error: purchaseError } = await supabase
        .from("purchase_details")
        .insert({
          user_id: userId,
          category: bill.bill_templates.category,
          item_name: bill.title,
          quantity: 1,
          total: bill.amount,
          price: bill.amount,
        })
        .select("*")
        .single();

      if (purchaseError) {
        errorToast(purchaseError.message);
        throw new Error(purchaseError.message);
      }

      return purchaseData;
    },
    onSuccess: (returnedData) => {
      queryClient.invalidateQueries({ queryKey: ["upcomingBills", userId] });
      queryClient.invalidateQueries({ queryKey: ["allCreatedBills", userId] });
      queryClient.invalidateQueries({ queryKey: ["user_balances", userId] });
      queryClient.setQueryData(
        ["userAllPurchase", userId],
        (old: PurchaseDetailsType[]) => {
          if (!old && returnedData) return [returnedData];
          if (returnedData) return [returnedData, ...old];
          return old;
        }
      );

      router.replace("/(main)/(tabs)");
      successToast("Bill marked as paid");
    },
    onError: (error) => {
      errorToast("Failed to mark bill as paid");
      console.log("error", error);
    },
  });
};

export const useStopBillRecurring = () => {
  const { user } = useAuthStore();
  const userId = user?.id;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (billId: string) => {
      const { error } = await supabase
      .from('bill_templates')
      .update({ is_recurring: false })
      .eq('user_id', userId)
      .eq('id', billId);

      if (error) {
        errorToast(error.message);
        throw new Error(error.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["upcomingBills", userId] });
      queryClient.invalidateQueries({ queryKey: ["allCreatedBills", userId] });
      successToast("Bill stopped");
    },
    onError: (error) => {
      errorToast("Failed to stop bill");
      console.log("error", error);
    },
  });
};

export const useGetAllCreatedBills = () => {
  const { user } = useAuthStore();
  const userId = user?.id;

  return useQuery<AllCreatedBillsType[]>({
    queryKey: ["allCreatedBills", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bill_templates")
        .select("*")
        .eq("user_id", userId);

      if (error) {
        errorToast(error.message);
        throw new Error(error.message);
      }
      
      return data;
    },
    enabled: !!userId,
  });
};

export const useCreateUpcomingBill = () => {
  const { user } = useAuthStore();
  const userId = user?.id;

  return useMutation({
    mutationFn: async (billData: TCreateUpcomingBillSchema) => {
      const { data, error } = await supabase
        .from("bill_templates")
        .insert({
          user_id: userId,
          ...billData,
        })
        .select("*")
        .single();

      if (error) {
        errorToast(error.message);
        throw new Error(error.message);
      }

      const { error: generateError } = await supabase.functions.invoke("generate-monthly-bills");

      if (generateError) {
        errorToast(generateError.message);
        throw new Error(generateError.message);
      }

      return data as UpcomingBillType;
    },
    onError: (error) => {
      errorToast("Failed to create bill");
      console.log("error", error);
    },
  });
};

export const useDeleteBill = () => {
  const { user } = useAuthStore();
  const userId = user?.id;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (billId: string) => {
      const { error } = await supabase
        .from("bill_templates")
        .delete()
        .eq("id", billId)
        .eq("user_id", userId);

      if (error) {
        errorToast(error.message);
        throw new Error(error.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allCreatedBills", userId] });
      successToast("Bill deleted successfully");
    },
    onError: () => {
      errorToast("Failed to delete bill");
    },
  });
};