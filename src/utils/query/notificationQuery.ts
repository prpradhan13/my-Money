import useAuthStore from "@/src/store/authStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";
import { errorToast, successToast } from "../helperFunction";
import { NotificationsType } from "@/src/types/notification.type";

export const useGetAllNotifications = () => {
  const { user } = useAuthStore();

  return useQuery<NotificationsType[]>({
    queryKey: ["notifications", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false })
        .limit(10);

      if (error) {
        errorToast(error.message);
        return [];
      }

      return data;
    },
    enabled: !!user?.id,
  });
};

export const useGetAllUnreadNotifications = () => {
  const { user } = useAuthStore();

  return useQuery<NotificationsType[]>({
    queryKey: ["notifications", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user?.id)
        .eq("read", false)
        .order("created_at", { ascending: false });
        
      if (error) {
        errorToast(error.message);
        return [];
      }

      return data;
    },
    enabled: !!user?.id,
  });
};


export const useMarkAllNotificationsAsRead = () => {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("notifications")
        .update({ read: true })
        .eq("user_id", user?.id)
        .eq("read", false)
        .select();

      if (error) {
        errorToast(error.message);
        return [];
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications", user?.id] });
      successToast("All notifications marked as read");
    },
    onError: (error) => {
      errorToast(error.message);
      console.log(error);
    },
  });
};

export const useMarkNotificationAsRead = () => {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (notificationId: string) => {
      const { error } = await supabase
        .from("notifications")
        .update({ read: true })
        .eq("id", notificationId)
        .eq("user_id", user?.id);

      if (error) {
        errorToast(error.message);
        return [];
      }
      
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications", user?.id] });
      successToast("Notification marked as read");
    },
    onError: (error) => {
      errorToast(error.message);
      console.log(error);
    },
  });
};
