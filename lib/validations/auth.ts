import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
  rememberMe: z.boolean().optional()
})

export const otpVerificationSchema = z.object({
  otp: z.string()
    .min(6, 'Le code OTP doit contenir exactement 6 chiffres')
    .max(6, 'Le code OTP doit contenir exactement 6 chiffres')
    .regex(/^\d{6}$/, 'Le code OTP doit contenir uniquement 6 chiffres')
})

export const registerSchema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères').max(50, 'Le nom ne peut pas dépasser 50 caractères'),
  email: z.string().email('Email invalide'),
  password: z.string()
    .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Le mot de passe doit contenir au moins une minuscule, une majuscule et un chiffre'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"]
})

export const passwordChangeSchema = z.object({
  currentPassword: z.string().min(1, 'Mot de passe actuel requis'),
  newPassword: z.string()
    .min(8, 'Le nouveau mot de passe doit contenir au moins 8 caractères')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Le mot de passe doit contenir au moins une minuscule, une majuscule et un chiffre'),
  confirmNewPassword: z.string()
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: "Les nouveaux mots de passe ne correspondent pas",
  path: ["confirmNewPassword"]
})

export const forgotPasswordSchema = z.object({
  email: z.string().email('Email invalide')
})

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token requis'),
  newPassword: z.string()
    .min(8, 'Le nouveau mot de passe doit contenir au moins 8 caractères')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Le mot de passe doit contenir au moins une minuscule, une majuscule et un chiffre'),
  confirmNewPassword: z.string()
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: "Les nouveaux mots de passe ne correspondent pas",
  path: ["confirmNewPassword"]
})

export type LoginFormData = z.infer<typeof loginSchema>
export type OTPVerificationFormData = z.infer<typeof otpVerificationSchema>
export type RegisterFormData = z.infer<typeof registerSchema>
export type PasswordChangeFormData = z.infer<typeof passwordChangeSchema>
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema> 