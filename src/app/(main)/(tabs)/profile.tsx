import CreateUpcomingBill from "@/src/components/modal/CreateUpcomingBill";
import useAuthStore from "@/src/store/authStore";
import { UserProfileType } from "@/src/types/user.type";
import {
  errorToast,
  getInitialLetter,
  successToast,
} from "@/src/utils/helperFunction";
import { supabase } from "@/src/utils/lib/supabase";
import { Ionicons } from "@expo/vector-icons";
import { useQueryClient } from "@tanstack/react-query";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import React, { useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const ProfileScreen = () => {
  const [isCreateUpcomingBillVisible, setIsCreateUpcomingBillVisible] =
    useState(false);
  const { logout, user } = useAuthStore();
  const queryClient = useQueryClient();
  const [isUploading, setIsUploading] = useState(false);

  const userData = queryClient.getQueryData<UserProfileType>([
    "user",
    user?.id,
  ]);

  const initialLetter = getInitialLetter(userData?.full_name);

  const handleLogOut = async () => {
    try {
      await logout();
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    }
  };

  const pickImage = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        errorToast("Permission denied");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });

      if (!result.canceled) {
        await uploadImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error picking image:", error);
      errorToast("Failed to pick image");
    }
  };

  const uploadImage = async (uri: string) => {
    try {
      setIsUploading(true);

      const response = await fetch(uri);
      const blob = await response.blob();

      const fileExt = uri.split(".").pop();
      const fileName = `${user?.id}-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, blob, {
          contentType: `image/${fileExt}`,
          upsert: true,
        });

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("avatars").getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from("profiles")
        .update({ avatar_url: publicUrl })
        .eq("id", user?.id);

      if (updateError) throw updateError;

      queryClient.invalidateQueries({ queryKey: ["user", user?.id] });

      successToast("Profile picture updated successfully");
    } catch (error) {
      console.error("Error uploading image:", error);
      errorToast("Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  if (!userData)
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: "#fff" }}>No user data found</Text>
      </View>
    );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.profileImageContainer}>
          {userData?.avatar_url ? (
            <Image
              source={{ uri: userData?.avatar_url }}
              style={styles.profileImage}
            />
          ) : (
            <Text style={styles.initialLetter}>{initialLetter}</Text>
          )}

          <TouchableOpacity
            style={styles.cameraButton}
            onPress={pickImage}
            disabled={isUploading}
          >
            <Ionicons name="camera" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
        <Text style={styles.userName}>
          {user?.user_metadata?.full_name || "User"}
        </Text>
        <Text style={styles.userEmail}>{user?.email}</Text>
      </View>

      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => router.push("/createExpenseModal")}
        >
          <Ionicons name="add-circle-outline" size={24} color="#fff" />
          <Text style={styles.actionButtonText}>Add Expense</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => setIsCreateUpcomingBillVisible(true)}
        >
          <Ionicons name="calendar-outline" size={24} color="#fff" />
          <Text style={styles.actionButtonText}>Set Upcoming Bill</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.logoutButton]}
          onPress={handleLogOut}
        >
          <Ionicons name="log-out-outline" size={24} color="#fff" />
          <Text style={styles.actionButtonText}>Log out</Text>
        </TouchableOpacity>
      </View>

      <CreateUpcomingBill
        isVisible={isCreateUpcomingBillVisible}
        setIsVisible={setIsCreateUpcomingBillVisible}
      />
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a1a",
  },
  header: {
    alignItems: "center",
    paddingVertical: 32,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  profileImageContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#333",
    marginBottom: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  profileImage: {
    width: "100%",
    height: "100%",
  },
  initialLetter: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
  cameraButton: {
    position: "absolute",
    bottom: -2,
    right: -2,
    backgroundColor: "#007AFF",
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#1a1a1a",
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: "#888",
  },
  actionsContainer: {
    padding: 20,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2a2a2a",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 12,
  },
  logoutButton: {
    backgroundColor: "#ff4444",
    marginTop: 8,
  },
});
