import React from "react";
import { Redirect, Stack } from "expo-router";
import useAuthStore from "@/src/store/authStore";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

const MainLayout = () => {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="allTransactions"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="allBalanceAdded"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="allCreatedBills"
          options={{ title: "All Created Bills" }}
        />
        <Stack.Screen
          name="createExpenseModal"
          options={{
            headerShown: false,
            presentation: "modal",
            animation: "fade_from_bottom",
          }}
        />
      </Stack>
    </QueryClientProvider>
  );
};

export default MainLayout;
