import { apiClient } from '../utils/api'
import { 
  LoginCredentials, 
  LoginResponse,
  OTPVerificationRequest,
  OTPVerificationResponse,
  AuthResponse, 
  RefreshTokenResponse,
  User,
  PasswordChangeRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest
} from '../types/auth'

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
    
    // Créer une instance axios temporaire avec le token temporaire
    const tempApiClient = apiClient.create()
    tempApiClient.interceptors.request.use((config) => {
      if (tempToken) {
        config.headers.Authorization = `Bearer ${tempToken}`
        console.log('🔢 Request headers:', config.headers)
      }
      return config
    })
    
    console.log('🔢 Sending OTP verification request:', {
      url: '/api/auth/verify-otp',
      otp: otpRequest.otp,
      hasToken: !!tempToken
    })
    
    const { data } = await tempApiClient.post('/api/auth/verify-otp', otpRequest)
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
    
    // Créer une instance axios temporaire avec le token temporaire
    const tempApiClient = apiClient.create()
    tempApiClient.interceptors.request.use((config) => {
      if (tempToken) {
        config.headers.Authorization = `Bearer ${tempToken}`
      }
      return config
    })
    
    const { data } = await tempApiClient.post('/api/auth/resend-otp', { email })
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

  // Forgot password
  async forgotPassword(emailData: ForgotPasswordRequest): Promise<void> {
    await apiClient.post('/api/auth/forgot-password', emailData)
  },

  // Reset password
  async resetPassword(resetData: ResetPasswordRequest): Promise<void> {
    await apiClient.post('/api/auth/reset-password', resetData)
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
  }
} 