export interface User {
  id: string
  email: string
  name: string
  role: 'admin' | 'user' | 'manager'
  permissions: string[]
  lastLogin?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface AuthSession {
  user: User
  accessToken: string
  refreshToken: string
  expiresAt: number
  isAuthenticated: boolean
}

export interface LoginCredentials {
  email: string
  password: string
  rememberMe?: boolean
}

export interface RegisterCredentials {
  name: string
  email: string
  password: string
  confirmPassword: string
}

export interface AuthResponse {
  success: boolean
  user: User
  accessToken: string
  refreshToken: string
  expiresIn: number
  message?: string
}

export interface RefreshTokenResponse {
  success: boolean
  accessToken: string
  expiresIn: number
}

export interface PasswordChangeRequest {
  currentPassword: string
  newPassword: string
  confirmNewPassword: string
}

export interface ForgotPasswordRequest {
  email: string
}

export interface ResetPasswordRequest {
  token: string
  newPassword: string
  confirmNewPassword: string
} 