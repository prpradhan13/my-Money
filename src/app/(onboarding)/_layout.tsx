import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, Stack } from "expo-router";
import { useEffect } from "react";

const OnboardingLayout = () => {
  useEffect(() => {
    const checkOnboarding = async () => {
      const isOnboarded = await AsyncStorage.getItem("isOnboarded");
      if (isOnboarded) {
        router.replace("/(auth)/login");
      }
    };
    checkOnboarding();
  }, []);

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
};

export default OnboardingLayout;
