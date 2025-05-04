import React from "react";
import { Redirect, Stack } from "expo-router";
import useAuthStore from "@/src/store/authStore";

const AuthLayout = () => {
    const { isAuthenticated } = useAuthStore();

    if (isAuthenticated) {
      return <Redirect href="/(main)/(tabs)" />
    }

  return <Stack screenOptions={{ headerShown: false }} />
};

export default AuthLayout;
