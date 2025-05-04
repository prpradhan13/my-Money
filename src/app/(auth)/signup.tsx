import {
  errorToast,
  infoToast,
  successToast,
} from "@/src/utils/helperFunction";
import { supabase } from "@/src/utils/lib/supabase";
import { signUpSchema, SignUpSchemaTypes } from "@/src/validations/auth";
import Feather from "@expo/vector-icons/Feather";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
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

const SignUpScreen = () => {
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(true);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpSchemaTypes>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      full_name: "",
      username: "",
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

  const onSubmit = async (data: SignUpSchemaTypes) => {
    try {
      const {
        data: { session },
        error,
      } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.full_name,
            username: data.username,
          },
        },
      });

      if (error) {
        errorToast(error.message || "Sign up Failed");
      } else if (!session) {
        infoToast("Please check your inbox for email verification!");
      } else {
        router.replace("/(main)/(tabs)");
        successToast("Sign up successful");
      }
    } catch (err: unknown) {
      errorToast("Internal server error");
      throw new Error(err instanceof Error ? err.message : String(err));
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
          <Text style={styles.title}>Create an account</Text>
          <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Full name</Text>
              <View style={styles.inputWrapper}>
                <Feather name="user" size={20} color="#c2c2c2" />
                <Controller
                  control={control}
                  name="full_name"
                  render={({ field: { value, onChange } }) => (
                    <TextInput
                      placeholder="Enter your name"
                      placeholderTextColor={"#c2c2c2"}
                      value={value}
                      onChangeText={onChange}
                      style={styles.input}
                    />
                  )}
                />
              </View>
              {errors.full_name && (
                <Text style={styles.errorText}>{errors.full_name.message}</Text>
              )}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Username</Text>
              <View style={styles.inputWrapper}>
                <Feather name="user" size={20} color="#c2c2c2" />
                <Controller
                  control={control}
                  name="username"
                  render={({ field: { value, onChange } }) => (
                    <TextInput
                      placeholder="Enter your username"
                      placeholderTextColor={"#c2c2c2"}
                      value={value}
                      onChangeText={onChange}
                      style={styles.input}
                    />
                  )}
                />
              </View>
              {errors.username && (
                <Text style={styles.errorText}>{errors.username.message}</Text>
              )}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email</Text>
              <View style={styles.inputWrapper}>
                <Feather name="mail" size={20} color="#c2c2c2" />
                <Controller
                  control={control}
                  name="email"
                  render={({ field: { value, onChange } }) => (
                    <TextInput
                      autoCapitalize="none"
                      placeholder="Enter your email"
                      placeholderTextColor={"#c2c2c2"}
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

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.passwordInputWrapper}>
                <View style={styles.passwordInputContainer}>
                  <Feather name="lock" size={20} color="#c2c2c2" />
                  <Controller
                    control={control}
                    name="password"
                    render={({ field: { value, onChange } }) => (
                      <TextInput
                        secureTextEntry={passwordVisible}
                        placeholder="Enter your password"
                        placeholderTextColor={"#c2c2c2"}
                        value={value}
                        onChangeText={onChange}
                        style={styles.input}
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
              disabled={loading}
              onPress={handleSubmit(onSubmit)}
              style={styles.submitButton}
            >
              {loading ? (
                <ActivityIndicator color={"#000"} size={24} />
              ) : (
                <Text style={styles.submitButtonText}>Sign up</Text>
              )}
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default SignUpScreen;

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
  title: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "600",
  },
  formContainer: {
    width: "100%",
    gap: 16,
    marginTop: 40,
  },
  inputContainer: {
    marginBottom: 4,
  },
  label: {
    color: "#fff",
    marginBottom: 4,
  },
  inputWrapper: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#9ca3af",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  input: {
    color: "#fff",
    fontSize: 18,
    flex: 1,
  },
  errorText: {
    color: "#ef4444",
    marginTop: 4,
  },
  passwordInputWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: "#9ca3af",
    borderRadius: 12,
    overflow: "hidden",
  },
  passwordInputContainer: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    flex: 1,
  },
  submitButton: {
    backgroundColor: "#eee",
    padding: 12,
    borderRadius: 12,
    marginTop: 8,
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: "500",
    textAlign: "center",
  },
});
