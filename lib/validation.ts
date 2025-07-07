import { z } from "zod"

// Auth validation schemas
export const signUpSchema = z.object({
  email: z
    .string()
    .email("Please enter a valid email address")
    .refine((email: string) => email.endsWith("@g.ucla.edu"), {
      message: "Please use a valid UCLA email address (@g.ucla.edu)",
    }),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
      message: "Password must contain at least one uppercase letter, one lowercase letter, and one number",
    }),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters long")
    .max(20, "Username must be no more than 20 characters long")
    .regex(/^[a-zA-Z0-9_]+$/, {
      message: "Username can only contain letters, numbers, and underscores",
    }),
  fullName: z
    .string()
    .min(1, "Full name is required")
    .max(100, "Full name must be no more than 100 characters long")
    .regex(/^[a-zA-Z\s]+$/, {
      message: "Full name can only contain letters and spaces",
    }),
})

export const signInSchema = z.object({
  email: z
    .string()
    .email("Please enter a valid email address")
    .refine((email: string) => email.endsWith("@g.ucla.edu"), {
      message: "Please use a valid UCLA email address (@g.ucla.edu)",
    }),
  password: z.string().min(1, "Password is required"),
})

export const updateProfileSchema = z.object({
  full_name: z
    .string()
    .min(1, "Full name is required")
    .max(100, "Full name must be no more than 100 characters long")
    .regex(/^[a-zA-Z\s]+$/, {
      message: "Full name can only contain letters and spaces",
    })
    .optional(),
  avatar_url: z.string().url("Please enter a valid URL").optional(),
})

// Password reset schema
export const passwordResetSchema = z.object({
  email: z
    .string()
    .email("Please enter a valid email address")
    .refine((email: string) => email.endsWith("@g.ucla.edu"), {
      message: "Please use a valid UCLA email address (@g.ucla.edu)",
    }),
})

// Change password schema
export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
      message: "Password must contain at least one uppercase letter, one lowercase letter, and one number",
    }),
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data: { newPassword: string; confirmPassword: string }) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
}) 