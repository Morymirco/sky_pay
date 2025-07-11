import { create } from 'zustand'
import { persist, subscribeWithSelector } from 'zustand/middleware'
import { AuthSession, User } from '../types/auth'

interface AuthState {
  // State
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  isFirstLogin: boolean
  
  // Actions
  login: (session: AuthSession) => void
  logout: () => void
  setUser: (user: User) => void
  setToken: (token: string) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  setFirstLogin: (isFirstLogin: boolean) => void
  clearSession: () => void
  clearError: () => void
  
  // Computed
  hasRole: (role: string) => boolean
}

export const useAuthStore = create<AuthState>()(
  subscribeWithSelector(
    persist(
      (set, get) => ({
        // Initial state
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
        isFirstLogin: false,

        // Actions
        login: (session) => {
          console.log('🔐 Storing auth session:', {
            user: session.user.email,
            hasToken: !!session.token,
            tokenPreview: session.token ? `${session.token.substring(0, 10)}...` : 'none',
            isFirstLogin: session.isFirstLogin
          })
          set({
            user: session.user,
            token: session.token,
            isAuthenticated: true,
            isFirstLogin: session.isFirstLogin || false,
            error: null
          })
        },

        logout: () => {
          console.log('🚪 Logging out user')
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isFirstLogin: false,
            error: null
          })
        },

        setUser: (user) => set({ user }),

        setToken: (token) => set({ token }),

        setLoading: (isLoading) => set({ isLoading }),

        setError: (error) => set({ error }),

        setFirstLogin: (isFirstLogin) => set({ isFirstLogin }),

        clearSession: () => set({
          user: null,
          token: null,
          isAuthenticated: false,
          isFirstLogin: false,
          error: null
        }),

        clearError: () => set({ error: null }),

        // Computed
        hasRole: (role) => {
          const { user } = get()
          return user?.role === role
        }
      }),
      {
        name: 'auth-storage',
        partialize: (state) => ({
          user: state.user,
          token: state.token,
          isAuthenticated: state.isAuthenticated,
          isFirstLogin: state.isFirstLogin
        }),
        onRehydrateStorage: () => (state) => {
          // Nettoyer les données temporaires au rechargement
          localStorage.removeItem('temp_auth_data')
        }
      }
    )
  )
) 