import {
  LoginCredentials,
  LoginResponse,
  OTPVerificationRequest,
  OTPVerificationResponse,
  PasswordChangeRequest,
  RefreshTokenResponse,
  Role,
  User
} from '../types/auth'
import { apiClient, createOTPApiClient, createResetApiClient } from '../utils/api'

export const authService = {
  // Login avec OTP
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const { data } = await apiClient.post('/api/auth/login', credentials)
    console.log(data)
    return data
  },

  // Vérification OTP
  async verifyOTP(otpRequest: OTPVerificationRequest): Promise<OTPVerificationResponse> {
    const otpApiClient = createOTPApiClient()
    
    console.log('🔢 Sending OTP verification request:', {
      url: '/api/auth/verify-otp',
      otp: otpRequest.otp
    })
    
    const { data } = await otpApiClient.post('/api/auth/verify-otp', otpRequest)
    console.log('🔢 OTP verification response:', data)
    return data
  },

  // Renvoyer OTP
  async resendOTP(email: string): Promise<{ message: string }> {
    const otpApiClient = createOTPApiClient()
    
    console.log('📧 Resending OTP')
    
    const { data } = await otpApiClient.post('/api/auth/resend-otp', { email })
    return data
  },

  // Logout
  async logout(): Promise<void> {
    await apiClient.post('/api/auth/logout')
  },

  // Refresh token
  async refreshToken(refreshToken: string): Promise<RefreshTokenResponse> {
    const { data } = await apiClient.post('/api/auth/refresh', { refreshToken })
    return data
  },

  // Get current user with company data
  async getCurrentUser(): Promise<{
    success: boolean
    message: string
    user: User
    company: {
      id: number
      name: string
      address: string
      phone: string
      email: string
      logo: string
      is_active: boolean
      solde: number
      createdAt: string
      updatedAt: string
    }
    role: Role
    newToken?: string
  }> {
    const { data } = await apiClient.get('/api/users/me')
    console.log('📊 Raw API response from /api/users/me:', data)
    return data
  },

  // Change password
  async changePassword(passwordData: PasswordChangeRequest): Promise<void> {
    await apiClient.put('/api/auth/change-password', passwordData)
  },

  // Verify email
  async verifyEmail(token: string): Promise<void> {
    await apiClient.post('/api/auth/verify-email', { token })
  },

  // Resend verification email
  async resendVerificationEmail(email: string): Promise<void> {
    await apiClient.post('/api/auth/resend-verification', { email })
  },

  // Update profile
  async updateProfile(profileData: Partial<User>): Promise<User> {
    const { data } = await apiClient.put('/api/users/profile', profileData)
    return data
  },

  // Delete account
  async deleteAccount(password: string): Promise<void> {
    await apiClient.delete('/api/auth/account', { data: { password } })
  },

  // Request password reset with OTP
  async requestPasswordResetOTP(email: string): Promise<{ message: string; token?: string }> {
    const { data } = await apiClient.post('/api/auth/send-otp-forgot-password', { email })
    return data
  },

  // Verify OTP for password reset (with token)
  async verifyResetOTP(email: string, otp: string): Promise<{ message: string; token?: string }> {
    const resetApiClient = createResetApiClient()
    
    console.log('🔢 Sending reset OTP verification request:', {
      url: '/api/auth/verify-otp',
      otp
    })
    
    const { data } = await resetApiClient.post('/api/auth/verify-otp', { otp })
    console.log('🔢 Reset OTP verification response:', data)
    return data
  },

  // Reset password with token (after OTP verification)
  async resetPasswordWithOTP(email: string, otp: string, newPassword: string): Promise<{ message: string }> {
    const resetApiClient = createResetApiClient()
    
    console.log('🔑 Sending password reset request:', {
      url: '/api/auth/forgot-password_change',
      newPassword: '***'
    })
    
    const { data } = await resetApiClient.put('/api/auth/forgot-password_change', {
      newPassword
    })
    console.log('🔑 Password reset response:', data)
    return data
  },

  // Get company users
  async getCompanyUsers(): Promise<{
    success: boolean
    message: string
    data: Array<{
      id: number
      username: string
      email: string
      first_name: string
      last_name: string
      roleId: number
      is_active: boolean
      is_first_login: boolean
      secret_otp: string
      companyId: number
      createdAt: string
      updatedAt: string
      Role: {
        id: number
        name: string
        description: string
        permissions: any
      }
    }>
    newToken?: string
  }> {
    const { data } = await apiClient.get('/api/users/company-users')
    console.log('👥 Company users response:', data)
    return data
  }
} 