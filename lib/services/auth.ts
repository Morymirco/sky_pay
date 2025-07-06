import { apiClient } from '../utils/api'
import { 
  LoginCredentials, 
  RegisterCredentials, 
  AuthResponse, 
  RefreshTokenResponse,
  User,
  PasswordChangeRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest
} from '../types/auth'

export const authService = {
  // Login
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const { data } = await apiClient.post('/auth/login', credentials)
    return data
  },

  // Register
  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    const { data } = await apiClient.post('/auth/register', credentials)
    return data
  },

  // Logout
  async logout(): Promise<void> {
    await apiClient.post('/auth/logout')
  },

  // Refresh token
  async refreshToken(refreshToken: string): Promise<RefreshTokenResponse> {
    const { data } = await apiClient.post('/auth/refresh', { refreshToken })
    return data
  },

  // Get current user
  async getCurrentUser(): Promise<User> {
    const { data } = await apiClient.get('/auth/me')
    return data
  },

  // Change password
  async changePassword(passwordData: PasswordChangeRequest): Promise<void> {
    await apiClient.put('/auth/change-password', passwordData)
  },

  // Forgot password
  async forgotPassword(emailData: ForgotPasswordRequest): Promise<void> {
    await apiClient.post('/auth/forgot-password', emailData)
  },

  // Reset password
  async resetPassword(resetData: ResetPasswordRequest): Promise<void> {
    await apiClient.post('/auth/reset-password', resetData)
  },

  // Verify email
  async verifyEmail(token: string): Promise<void> {
    await apiClient.post('/auth/verify-email', { token })
  },

  // Resend verification email
  async resendVerificationEmail(email: string): Promise<void> {
    await apiClient.post('/auth/resend-verification', { email })
  },

  // Update profile
  async updateProfile(profileData: Partial<User>): Promise<User> {
    const { data } = await apiClient.put('/auth/profile', profileData)
    return data
  },

  // Delete account
  async deleteAccount(password: string): Promise<void> {
    await apiClient.delete('/auth/account', { data: { password } })
  }
} 