import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { authService } from '../services/auth'
import { useAuthStore } from '../stores/authStore'
import { LoginCredentials, RegisterCredentials, PasswordChangeRequest } from '../types/auth'
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
    clearError,
    isTokenExpired
  } = useAuthStore()

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: authService.login,
    onMutate: () => {
      setLoading(true)
      clearError()
    },
    onSuccess: (data) => {
      storeLogin({
        user: data.user,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        expiresAt: Date.now() + data.expiresIn * 1000,
        isAuthenticated: true
      })
      router.push('/dashboard')
    },
    onError: (error) => {
      setError(handleApiError(error))
    },
    onSettled: () => {
      setLoading(false)
    }
  })

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: authService.register,
    onMutate: () => {
      setLoading(true)
      clearError()
    },
    onSuccess: (data) => {
      storeLogin({
        user: data.user,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        expiresAt: Date.now() + data.expiresIn * 1000,
        isAuthenticated: true
      })
      router.push('/dashboard')
    },
    onError: (error) => {
      setError(handleApiError(error))
    },
    onSettled: () => {
      setLoading(false)
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

  // Current user query
  const currentUserQuery = useQuery({
    queryKey: ['auth', 'user'],
    queryFn: authService.getCurrentUser,
    enabled: isAuthenticated && !isTokenExpired(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
    onError: () => {
      storeLogout()
      router.push('/login')
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
    isLoading: storeLoading || loginMutation.isPending || registerMutation.isPending || logoutMutation.isPending,
    error: storeError,
    
    // Actions
    login: (credentials: LoginCredentials) => loginMutation.mutate(credentials),
    register: (credentials: RegisterCredentials) => registerMutation.mutate(credentials),
    logout: () => logoutMutation.mutate(),
    changePassword: (data: PasswordChangeRequest) => changePasswordMutation.mutate(data),
    forgotPassword: (email: string) => forgotPasswordMutation.mutate({ email }),
    updateProfile: (profileData: Partial<typeof user>) => updateProfileMutation.mutate(profileData),
    clearError,
    
    // Mutations state
    isLoginLoading: loginMutation.isPending,
    isRegisterLoading: registerMutation.isPending,
    isLogoutLoading: logoutMutation.isPending,
    isChangePasswordLoading: changePasswordMutation.isPending,
    isForgotPasswordLoading: forgotPasswordMutation.isPending,
    isUpdateProfileLoading: updateProfileMutation.isPending,
    
    // Query state
    isUserLoading: currentUserQuery.isLoading,
    userError: currentUserQuery.error
  }
} 