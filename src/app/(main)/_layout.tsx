import React from "react";
import { Redirect, Stack } from "expo-router";
import useAuthStore from "@/src/store/authStore";

const MainLayout = () => {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }
  
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
};

export default MainLayout;
