export interface User {
  id: number
  first_name: string
  last_name: string
  email: string
  username?: string
  role: 'user' | 'admin' | 'super_admin' | 'add' | 'delete_and_add_edit' | 'init_paiement' | 'confirm_paiement' | 'verify_paiement'
  phone?: string
  is_active: boolean
  companyId: number
  company?: {
    id: number
    name: string
  }
  is_first_login?: boolean
  createdAt: string
  updatedAt: string
}

export interface AuthSession {
  user: User
  token: string
  isAuthenticated: boolean
  isFirstLogin?: boolean
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface LoginResponse {
  success: boolean
  message: string
  data: {
    token: string
    user: User
    requiresOTP: boolean
  }
}

export interface OTPVerificationRequest {
  otp: string
}

export interface OTPVerificationResponse {
  success: boolean
  message: string
  token: string
}

export interface ChangePasswordRequest {
  current_password: string
  new_password: string
}

export interface AuthResponse {
  success: boolean
  message: string
  data?: any
}

export interface RefreshTokenResponse {
  success: boolean
  accessToken: string
  expiresIn: number
}

export interface PasswordChangeRequest {
  current_password: string
  new_password: string
}



export interface RequestPasswordResetOTPRequest {
  email: string
}

export interface ResetPasswordOTPRequest {
  email: string
  otp: string
  new_password: string
}

export interface RequestPasswordResetOTPResponse {
  message: string
}

export interface ResetPasswordOTPResponse {
  message: string
} 