import useAuthStore from "@/src/store/authStore"
import { useMutation, useQuery } from "@tanstack/react-query"
import { supabase } from "../lib/supabase";
import { errorToast } from "../helperFunction";
import { UserBalance } from "@/src/types/user.type";
import { TEnterBalanceSchema } from "@/src/validations/form";

export const useGetUserAllAddedMoney = () => {
    const { user } = useAuthStore();
    const userId = user?.id

    return useQuery<UserBalance[]>({
        queryKey: ["addedMoney", userId],
        queryFn: async () => {
            if (!userId) throw new Error("User id no found!");

            const { data, error } = await supabase
                .from("added_money")
                .select("*")
                .eq("user_id", userId);

            if (error) {
                errorToast(error.message || "Can not get added money details");
                return [];
            }

            return data ?? [];
        },
        enabled: !!userId
    })
}

export const useEnterBalance = () => {
    const { user } = useAuthStore();
    const userId = user?.id;
    
    return useMutation({
        mutationFn: async (formData: TEnterBalanceSchema) => {
            if(!userId) throw new Error("User id not found!");

            const { balance, created_at } = formData;

            const { error } = await supabase
                .from("added_money")
                .insert({
                    user_id: userId,
                    balance,
                    created_at
                })
            
            if (error) {
                errorToast(error.message)
                throw new Error(error.message);
            }
        }
    })
}