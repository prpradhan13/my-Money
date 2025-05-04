import useAuthStore from "@/src/store/authStore"
import { useMutation, useQuery } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";
import { errorToast } from "../helperFunction";
import { PurchaseDetailsType } from "@/src/types/purchase.type";
import { TCreatePurchaseSchema } from "@/src/validations/form";


export const useGetUserAllPurchases = () => {
    const { user } = useAuthStore();
    const userId = user?.id;

    return useQuery<PurchaseDetailsType[]>({
        queryKey: ["userAllPurchase", userId],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("purchase_details")
                .select("*")
                .eq("user_id", userId);

            if (error) {
                errorToast(error.message || "Can not get purchase details!")
                return []; 
            }

            return data ?? [];
        },
        enabled: !!userId
    })
};

export const useCreatePurchase = () => {
    const { user } = useAuthStore();
    const userId = user?.id;

    return useMutation({
        mutationFn: async (formData: TCreatePurchaseSchema[]) => {
            if (!userId) throw new Error ("User id not found!");

            const purchasesWithUserId = formData.map((item) => ({
                ...item,
                user_id: userId,
            }));

            const { data, error } = await supabase
                .from("purchase_details")
                .insert(purchasesWithUserId)
                .select("*");
            
            if (error) {
                errorToast(error.message);
                throw new Error(error.message);
            };

            return data;
        }
    })
}