import React, { useEffect } from "react";
import { router, Stack } from "expo-router";
import useAuthStore from "@/src/store/authStore";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AuthLayout = () => {
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    const checkOnboarding = async () => {
      const isOnboarded = await AsyncStorage.getItem("isOnboarded");
      if (!isOnboarded) {
        router.replace("/(onboarding)");
      } else if (isAuthenticated) {
        router.replace("/(main)/(tabs)");
      } else {
        router.replace("/(auth)/login");
      }
    };
    checkOnboarding();
  }, [isAuthenticated]);

  return <Stack screenOptions={{ headerShown: false }} />;
};

export default AuthLayout;
