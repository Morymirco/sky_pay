import axios from 'axios'
import {
  AuthResponse,
  LoginCredentials,
  LoginResponse,
  OTPVerificationRequest,
  OTPVerificationResponse,
  PasswordChangeRequest,
  RefreshTokenResponse,
  User
} from '../types/auth'
import { apiClient } from '../utils/api'

export const authService = {
  // Login avec OTP
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const { data } = await apiClient.post('/api/auth/login', credentials)
    console.log(data)
    return data
  },

  // Vérification OTP
  async verifyOTP(otpRequest: OTPVerificationRequest): Promise<OTPVerificationResponse> {
    // Récupérer le token temporaire stocké
    const tempData = localStorage.getItem('temp_auth_data')
    if (!tempData) {
      throw new Error('No temporary auth data found')
    }
    
    const authData = JSON.parse(tempData)
    const tempToken = authData.token
    
    console.log('🔢 Verifying OTP with temp token:', tempToken ? `${tempToken.substring(0, 20)}...` : 'none')
    
    // Créer une nouvelle instance axios avec le token temporaire
    const otpApiClient = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL || "https://corporate.eazykash.com",
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        'authorization': `Bearer ${tempToken}`
      }
    })
    
    console.log('🔢 Sending OTP verification request:', {
      url: '/api/auth/verify-otp',
      otp: otpRequest.otp,
      hasToken: !!tempToken,
      headers: otpApiClient.defaults.headers
    })
    
    const { data } = await otpApiClient.post('/api/auth/verify-otp', otpRequest)
    console.log('🔢 OTP verification response:', data)
    return data
  },

  // Renvoyer OTP
  async resendOTP(email: string): Promise<AuthResponse> {
    // Récupérer le token temporaire stocké
    const tempData = localStorage.getItem('temp_auth_data')
    if (!tempData) {
      throw new Error('No temporary auth data found')
    }
    
    const authData = JSON.parse(tempData)
    const tempToken = authData.token
    
    console.log('📧 Resending OTP with temp token:', tempToken ? `${tempToken.substring(0, 20)}...` : 'none')
    
    // Créer une nouvelle instance axios avec le token temporaire
    const otpApiClient = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL || "https://corporate.eazykash.com",
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        'authorization': `Bearer ${tempToken}`
      }
    })
    
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

  // Get current user
  async getCurrentUser(): Promise<User> {
    const { data } = await apiClient.get('/api/users/me')
    return data.data
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
    const { data } = await apiClient.put('/api/auth/profile', profileData)
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
  async verifyResetOTP(email: string, otp: string): Promise<{ message: string }> {
    // Récupérer le token temporaire stocké
    const tempData = localStorage.getItem('temp_reset_data')
    if (!tempData) {
      throw new Error('No temporary reset data found')
    }
    
    const resetData = JSON.parse(tempData)
    const tempToken = resetData.token
    
    console.log('🔢 Verifying reset OTP with temp token:', tempToken ? `${tempToken.substring(0, 20)}...` : 'none')
    
    // Créer une nouvelle instance axios avec le token temporaire
    const otpApiClient = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL || "https://corporate.eazykash.com",
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        'authorization': `Bearer ${tempToken}`
      }
    })
    
    console.log('🔢 Sending reset OTP verification request:', {
      url: '/api/auth/verify-otp',
      otp,
      hasToken: !!tempToken,
      headers: otpApiClient.defaults.headers
    })
    
    const { data } = await otpApiClient.post('/api/auth/verify-otp', { otp })
    console.log('🔢 Reset OTP verification response:', data)
    return data
  },

  // Reset password with token (after OTP verification)
  async resetPasswordWithOTP(email: string, otp: string, newPassword: string): Promise<{ message: string }> {
    // Récupérer le token temporaire stocké
    const tempData = localStorage.getItem('temp_reset_data')
    if (!tempData) {
      throw new Error('No temporary reset data found')
    }
    
    const resetData = JSON.parse(tempData)
    const tempToken = resetData.token
    
    console.log('🔑 Resetting password with token:', tempToken ? `${tempToken.substring(0, 20)}...` : 'none')
    
    // Créer une nouvelle instance axios avec le token temporaire
    const resetApiClient = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL || "https://corporate.eazykash.com",
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        'authorization': `Bearer ${tempToken}`
      }
    })
    
    console.log('🔑 Sending password reset request:', {
      url: '/api/auth/forgot-password_change',
      newPassword: '***',
      hasToken: !!tempToken,
      headers: resetApiClient.defaults.headers
    })
    
    const { data } = await resetApiClient.post('/api/auth/forgot-password_change', {
      newPassword
    })
    console.log('🔑 Password reset response:', data)
    return data
  }
} 