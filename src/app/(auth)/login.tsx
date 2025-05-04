import { errorToast, successToast } from "@/src/utils/helperFunction";
import { supabase } from "@/src/utils/lib/supabase";
import { loginSchema, LoginSchemaTypes } from "@/src/validations/auth";
import Feather from "@expo/vector-icons/Feather";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  AppState,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { z } from "zod";

const LoginScreen = () => {
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(true);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchemaTypes>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active") {
        supabase.auth.startAutoRefresh();
      } else {
        supabase.auth.stopAutoRefresh();
      }
    });
  
    return () => subscription.remove();
  }, []);

  const onSubmit = async (data: LoginSchemaTypes) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) {
        errorToast(`Login Failed: ${error.message}`);
      } else {
        router.replace("/(main)/(tabs)");
        successToast("Login successful");
      }
    } catch (error: unknown) {
      if (error instanceof z.ZodError) {
        errorToast(error.errors[0].message || "Validation Error");
      } else if (error instanceof Error) {
        errorToast(
          error.message || "An unexpected error occurred. Please try again."
        );
      } else {
        errorToast("An unknown error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.keyboardAvoidingView}
    >
      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          <Text style={styles.heading}>Welcome Back!</Text>
          <View style={styles.formContainer}>
            <View>
              <Text style={styles.label}>Email</Text>
              <View style={styles.inputWrapper}>
                <Feather name="mail" size={20} color="#c2c2c2" />
                <Controller
                  control={control}
                  name="email"
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      placeholder="Enter your email"
                      placeholderTextColor={"#c2c2c2"}
                      autoCapitalize="none"
                      value={value}
                      onChangeText={onChange}
                      style={styles.input}
                    />
                  )}
                />
              </View>
              {errors.email && (
                <Text style={styles.errorText}>{errors.email.message}</Text>
              )}
            </View>

            <View>
              <Text style={styles.label}>Password</Text>
              <View style={styles.passwordWrapper}>
                <View style={styles.passwordInputGroup}>
                  <Feather name="lock" size={20} color="#c2c2c2" />
                  <Controller
                    control={control}
                    name="password"
                    render={({ field: { onChange, value } }) => (
                      <TextInput
                        placeholder="Enter your password"
                        placeholderTextColor={"#c2c2c2"}
                        secureTextEntry={passwordVisible}
                        value={value}
                        onChangeText={onChange}
                        style={styles.passwordInput}
                      />
                    )}
                  />
                </View>
                <Pressable onPress={() => setPasswordVisible((prev) => !prev)}>
                  {passwordVisible ? (
                    <Feather name="eye" size={20} color="#fff" />
                  ) : (
                    <Feather name="eye-off" size={20} color="#fff" />
                  )}
                </Pressable>
              </View>
              {errors.password && (
                <Text style={styles.errorText}>{errors.password.message}</Text>
              )}
            </View>

            <Pressable
              onPress={handleSubmit(onSubmit)}
              disabled={loading}
              style={[
                styles.submitButton,
                loading && styles.submitButtonDisabled,
              ]}
            >
              {loading ? (
                <ActivityIndicator color={"#000"} size={24} />
              ) : (
                <Text style={styles.submitText}>Log in</Text>
              )}
            </Pressable>
          </View>

          <Link href={"/(auth)/signup"} style={styles.link}>
            Create an account?
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  heading: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "600",
  },
  formContainer: {
    width: "100%",
    gap: 16,
    marginTop: 40,
  },
  label: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "500",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#d1d5db",
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 8,
    marginTop: 4,
  },
  input: {
    color: "#fff",
    fontSize: 18,
    flex: 1,
  },
  passwordWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderColor: "#d1d5db",
    borderWidth: 1,
    borderRadius: 12,
    overflow: "hidden",
    marginTop: 4,
  },
  passwordInputGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  passwordInput: {
    width: "80%",
    color: "#fff",
    fontSize: 18,
  },
  errorText: {
    color: "#ef4444", // red-500
    marginTop: 4,
  },
  submitButton: {
    padding: 12,
    borderRadius: 12,
    marginTop: 8,
    backgroundColor: "#eee",
  },
  submitButtonDisabled: {
    backgroundColor: "rgba(255,255,255,0.7)",
  },
  submitText: {
    fontSize: 18,
    fontWeight: "500",
    textAlign: "center",
  },
  link: {
    color: "#3b82f6", // blue-500
    marginTop: 16,
    fontWeight: "500",
    fontSize: 18,
  },
});
