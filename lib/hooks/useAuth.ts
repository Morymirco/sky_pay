import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { authService } from '../services/auth'
import { useAuthStore } from '../stores/authStore'
import { LoginCredentials, LoginResponse, OTPVerificationRequest, PasswordChangeRequest } from '../types/auth'
import { handleApiError } from '../utils/api'

export function useAuth() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const {
    user,
    isAuthenticated,
    isLoading: storeLoading,
    error: storeError,
    login: storeLogin,
    logout: storeLogout,
    setLoading,
    setError,
    clearError
  } = useAuthStore()

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: authService.login,
    onMutate: () => {
      console.log('🔐 Starting login process...')
      setLoading(true)
      clearError()
    },
    onSuccess: (data: LoginResponse) => {
      console.log('✅ Login response:', data)
      
      // L'API force l'OTP pour tous les utilisateurs
      // Stocker les données temporaires pour l'OTP
      console.log('📱 OTP always required, storing temp data')
      localStorage.setItem('temp_auth_data', JSON.stringify(data.data))
      // Ne pas connecter l'utilisateur maintenant, attendre la vérification OTP
    },
    onError: (error) => {
      console.error('❌ Login error:', error)
      setError(handleApiError(error))
    },
    onSettled: () => {
      console.log('🏁 Login process finished')
      setLoading(false)
    }
  })

  // OTP verification mutation
  const verifyOTPMutation = useMutation({
    mutationFn: authService.verifyOTP,
    onMutate: () => {
      console.log('🔢 Starting OTP verification...')
      setLoading(true)
      clearError()
    },
    onSuccess: (data) => {
      console.log('✅ OTP verification successful:', data)
      console.log('🔍 OTP response structure:', {
        hasToken: !!data.token,
        hasData: !!data.data,
        tokenInData: !!data.data?.token,
        responseKeys: Object.keys(data)
      })
      
      // Récupérer les données temporaires
      const tempData = localStorage.getItem('temp_auth_data')
      if (tempData) {
        const authData = JSON.parse(tempData)
        console.log('👤 Auth data from temp storage:', authData)
        
        // Le token peut être dans data.token ou data.data.token
        const finalToken = data.token || data.data?.token
        
        if (finalToken) {
          storeLogin({
            user: authData.user,
            token: finalToken,
            isAuthenticated: true
          })
          localStorage.removeItem('temp_auth_data')
          console.log('🎉 Full authentication completed with token:', finalToken.substring(0, 20) + '...')
          router.push('/dashboard')
        } else {
          console.error('❌ No token found in OTP response')
          setError('Token non trouvé dans la réponse OTP')
        }
      } else {
        console.error('❌ No temp auth data found')
        setError('Données d\'authentification temporaires non trouvées')
      }
    },
    onError: (error) => {
      console.error('❌ OTP verification error:', error)
      setError(handleApiError(error))
    },
    onSettled: () => {
      console.log('🏁 OTP verification finished')
      setLoading(false)
    }
  })

  // Resend OTP mutation
  const resendOTPMutation = useMutation({
    mutationFn: (email: string) => authService.resendOTP(email),
    onError: (error) => {
      setError(handleApiError(error))
    }
  })

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      storeLogout()
      queryClient.clear()
      router.push('/login')
    },
    onError: () => {
      // Même en cas d'erreur, on déconnecte localement
      storeLogout()
      queryClient.clear()
      router.push('/login')
    }
  })

  // Current user query - Désactivée temporairement pour éviter les boucles
  const currentUserQuery = useQuery({
    queryKey: ['auth', 'user'],
    queryFn: authService.getCurrentUser,
    enabled: false, // Désactivée pour l'instant
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false, // Pas de retry automatique
    onError: (error) => {
      console.error('❌ Current user query failed:', error)
      // Éviter la boucle infinie en vérifiant si on est déjà en train de se déconnecter
      if (isAuthenticated) {
        console.log('🔄 Logging out due to auth error')
        storeLogout()
        queryClient.clear()
        router.push('/login')
      }
    }
  })

  // Change password mutation
  const changePasswordMutation = useMutation({
    mutationFn: authService.changePassword,
    onSuccess: () => {
      // Optionnel: afficher un message de succès
    },
    onError: (error) => {
      setError(handleApiError(error))
    }
  })

  // Forgot password mutation
  const forgotPasswordMutation = useMutation({
    mutationFn: authService.forgotPassword,
    onError: (error) => {
      setError(handleApiError(error))
    }
  })

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: authService.updateProfile,
    onSuccess: (updatedUser) => {
      useAuthStore.getState().setUser(updatedUser)
      queryClient.invalidateQueries({ queryKey: ['auth', 'user'] })
    },
    onError: (error) => {
      setError(handleApiError(error))
    }
  })

  return {
    // State
    user,
    isAuthenticated,
    isLoading: storeLoading || loginMutation.isPending || verifyOTPMutation.isPending || logoutMutation.isPending,
    error: storeError,
    
    // Actions
    login: async (credentials: LoginCredentials) => {
      console.log('🔐 Calling login mutation...')
      const result = await loginMutation.mutateAsync(credentials)
      console.log('🔐 Login mutation result:', result)
      return result
    },
    verifyOTP: (otpRequest: OTPVerificationRequest) => verifyOTPMutation.mutate(otpRequest),
    resendOTP: (email: string) => resendOTPMutation.mutate(email),
    logout: () => logoutMutation.mutate(),
    changePassword: (data: PasswordChangeRequest) => changePasswordMutation.mutate(data),
    forgotPassword: (email: string) => forgotPasswordMutation.mutate({ email }),
    updateProfile: (profileData: Partial<typeof user>) => updateProfileMutation.mutate(profileData),
    clearError,
    
    // Mutations state
    isLoginLoading: loginMutation.isPending,
    isOTPVerifying: verifyOTPMutation.isPending,
    isResendingOTP: resendOTPMutation.isPending,
    isLogoutLoading: logoutMutation.isPending,
    isChangePasswordLoading: changePasswordMutation.isPending,
    isForgotPasswordLoading: forgotPasswordMutation.isPending,
    isUpdateProfileLoading: updateProfileMutation.isPending,
    
    // Query state
    isUserLoading: currentUserQuery.isLoading,
    userError: currentUserQuery.error
  }
} 