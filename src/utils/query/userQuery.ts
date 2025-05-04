import useAuthStore from "@/src/store/authStore"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "../lib/supabase";
import Toast from "react-native-toast-message";
import { UserProfileType } from "@/src/types/user.type";

export const useGetUserDetails = () => {
    const { user } = useAuthStore();
    const userId = user?.id;

    return useQuery<UserProfileType>({
        queryKey: ["user", userId],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("profiles")
                .select("*")
                .eq("id", userId)
                .single();

            if (error) {
                Toast.show({
                    type: "error",
                    text1: error.message ?? "User details can not found",
                    position: "bottom"
                })

                return;
            }

            return data;
        },
        enabled: !!userId
    })
}