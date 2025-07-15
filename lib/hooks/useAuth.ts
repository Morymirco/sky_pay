import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { authService } from '../services/auth'
import { useAuthStore } from '../stores/authStore'
import { LoginCredentials, LoginResponse, OTPVerificationRequest, PasswordChangeRequest, User } from '../types/auth'
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
        responseKeys: Object.keys(data),
        isFirstLogin: data.first_login
      })
      
      // Récupérer les données temporaires
      const tempData = localStorage.getItem('temp_auth_data')
      if (tempData) {
        const authData = JSON.parse(tempData)
        console.log('👤 Auth data from temp storage:', authData)
        
        // Le token peut être dans data.token ou data.data.token
        const finalToken = data.token || data.data?.token
        const isFirstLogin = data.first_login || false
        
        if (finalToken) {
          console.log('🔐 About to call storeLogin with:', {
            userEmail: authData.user?.email,
            tokenLength: finalToken.length,
            tokenPreview: finalToken.substring(0, 20) + '...',
            isFirstLogin: isFirstLogin
          })
          
          storeLogin({
            user: authData.user,
            token: finalToken,
            isAuthenticated: true,
            isFirstLogin: isFirstLogin
          })
          
          localStorage.removeItem('temp_auth_data')
          console.log('🎉 Full authentication completed with token:', finalToken.substring(0, 20) + '...')
          console.log('🎉 First login:', isFirstLogin)
          
          // Debug: Vérifier localStorage après storeLogin
          setTimeout(() => {
            const persistedState = JSON.parse(localStorage.getItem('auth-storage') || '{}')
            console.log('🔍 localStorage after storeLogin:', {
              hasState: !!persistedState.state,
              storedToken: persistedState.state?.token ? `${persistedState.state.token.substring(0, 10)}...` : 'none',
              tokenLength: persistedState.state?.token ? persistedState.state.token.length : 0,
              isAuthenticated: persistedState.state?.isAuthenticated,
              userEmail: persistedState.state?.user?.email
            })
          }, 200)
          
          // Faire un appel explicite à /api/users/me pour récupérer les données complètes et le newToken
          console.log('📊 Making explicit call to /api/users/me to get complete user data and newToken...')
          
          // Utiliser apiClient pour bénéficier des intercepteurs
          import('../utils/api').then(({ apiClient }) => {
            apiClient.get('/api/users/me')
              .then((response) => {
                const userData = response.data
                console.log('✅ Complete user data loaded after login:', {
                  hasUser: !!userData.user,
                  hasRole: !!userData.role,
                  hasPermissions: !!userData.role?.permissions,
                  hasNewToken: !!userData.newToken,
                  accueilPermissions: userData.role?.permissions?.accueil?.permissions
                })
                
                // Mettre à jour le store avec les données complètes
                useAuthStore.getState().setUser(userData.user)
                useAuthStore.getState().setRole(userData.role)
                useAuthStore.getState().setPermissions(userData.role?.permissions)
                
                console.log('💾 Store updated with complete user data after login')
                
                // Redirection vers le dashboard
                console.log('🚀 Redirecting to dashboard with complete user data')
                router.push('/dashboard')
              })
              .catch((error) => {
                console.error('❌ Failed to load complete user data after login:', error)
                // Rediriger quand même vers le dashboard, les données seront chargées par useAuthCheck
                console.log('🚀 Redirecting to dashboard anyway, user data will be loaded by useAuthCheck')
                router.push('/dashboard')
              })
          })
        } else {
          console.error('❌ No token found in OTP response')
          setError('Token non trouvé dans la réponse OTP')
          // Pas de redirection si pas de token
        }
      } else {
        console.error('❌ No temp auth data found')
        setError('Données d\'authentification temporaires non trouvées')
        // Pas de redirection si pas de données temporaires
      }
    },
    onError: (error) => {
      console.error('❌ OTP verification error:', error)
      setError(handleApiError(error))
      // Pas de redirection en cas d'erreur - l'utilisateur reste sur la page OTP
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
    retry: false // Pas de retry automatique
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

  // Request password reset OTP mutation
  const requestPasswordResetOTPMutation = useMutation({
    mutationFn: authService.requestPasswordResetOTP,
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
    requestPasswordResetOTP: (email: string) => requestPasswordResetOTPMutation.mutate(email),
    updateProfile: (profileData: Partial<User>) => updateProfileMutation.mutate(profileData),
    clearError,
    
    // Mutations state
    isLoginLoading: loginMutation.isPending,
    isOTPVerifying: verifyOTPMutation.isPending,
    isResendingOTP: resendOTPMutation.isPending,
    isLogoutLoading: logoutMutation.isPending,
    isChangePasswordLoading: changePasswordMutation.isPending,
    isRequestPasswordResetOTPLoading: requestPasswordResetOTPMutation.isPending,
    isUpdateProfileLoading: updateProfileMutation.isPending,
    
    // Query state
    isUserLoading: currentUserQuery.isLoading,
    userError: currentUserQuery.error
  }
} 