import { z } from "zod";

export const signUpSchema = z.object({
    full_name: z.string().min(3, "Name must be at least 3 characters").trim(),
    username: z.string().min(3, "Username must be at least 3 characters").trim(),
    email: z.string().email().trim(),
    password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    // .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    // .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    // .regex(/\d/, "Password must contain at least one digit")
    // .regex(/[@$#!%*?&]/, "Password must contain at least one special character (@, $, !, %, *, ?, &)")
});

export type SignUpSchemaTypes = z.infer<typeof signUpSchema>;

export const loginSchema = z.object({
    email: z.string().email().trim(),
    password: z.string().min(6, "Password must be at least 6 characters")
});

export type LoginSchemaTypes = z.infer<typeof loginSchema>;

export const profileUpdateSchema = z.object({
    full_name: z.string().min(3, "Name must be at least 5 characters").trim(),
    username: z.string().min(3, "Username must be at least 3 characters").trim(),
    bio: z.string().optional(),
    avatar_url: z.any().optional(),
});

export type ProfileUpdateType = z.infer<typeof profileUpdateSchema>;

export const ForgotPasswordSchema = z.object({
    email: z.string().email().trim(),
});

export type TForgotPasswordSchema = z.infer<typeof ForgotPasswordSchema>;

export const UpdatePasswordSchema = z.object({
    email: z.string().email().trim(),
    newPassword: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    // .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    // .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    // .regex(/\d/, "Password must contain at least one digit")
    // .regex(/[@$#!%*?&]/, "Password must contain at least one special character (@, $, !, %, *, ?, &)")
});

export type TUpdatePasswordSchema = z.infer<typeof UpdatePasswordSchema>;