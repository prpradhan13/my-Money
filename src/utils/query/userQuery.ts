import useAuthStore from "@/src/store/authStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";
import Toast from "react-native-toast-message";
import { UserBalanceViewType, UserProfileType } from "@/src/types/user.type";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { decode } from "base64-arraybuffer";

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
          position: "bottom",
        });

        return;
      }

      return data;
    },
    enabled: !!userId,
  });
};

export const useUserAvatraUpdate = () => {
  const { user } = useAuthStore();
  const userId = user?.id;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (avatarUrl: ImagePicker.ImagePickerResult) => {
      const { uri, fileName, type } = avatarUrl.assets?.[0] ?? {};

      if (!uri) {
        throw new Error("Image URI is required");
      }

      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: "base64",
      });

      const fName = `${userId}/${new Date().getTime()}_${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(fName, decode(base64), {
          contentType: type,
        });

      if (uploadError) {
        alert("Error: " + uploadError.message);
        throw new Error(`Image upload failed: ${uploadError.message}`);
      }

      const publicUrl = supabase.storage.from("avatars").getPublicUrl(fName)
        .data.publicUrl;

      const { data, error } = await supabase
        .from("profiles")
        .update({ avatar_url: publicUrl })
        .eq("id", userId)
        .select("*")
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
    onSuccess: (returnedData) => {
      queryClient.invalidateQueries({ queryKey: ["user", userId] });
      queryClient.setQueryData(["user", userId], (oldData: UserProfileType) => {
        return {
          ...oldData,
          avatar_url: returnedData.avatar_url,
        };
      });
      alert("Profile Picture Update");
    },
  });
};

export const useRemovePushToken = () => {
  const { user, logout } = useAuthStore();
  const userId = user?.id;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("profiles")
        .update({ push_token: null })
        .eq("id", userId);

      if (error) {
        throw new Error(error.message);
      }

      await logout();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", userId] });
    },
    onError: (error) => {
      console.log(error);
    },
  });
};

export const useGetUserBalanceFromView = () => {
  const { user } = useAuthStore();
  const userId = user?.id;
  
  return useQuery<UserBalanceViewType>({
    queryKey: ["user_balances", userId],
    queryFn: async () => {
      const { data: user_balances, error } = await supabase
        .from("user_balances")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return user_balances;
    },
    enabled: !!userId,
  });
};
