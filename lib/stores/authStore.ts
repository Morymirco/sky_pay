import { create } from 'zustand'
import { persist, subscribeWithSelector } from 'zustand/middleware'
import { AuthSession, User } from '../types/auth'
import { clearLastReceivedToken, compareTokens, resetFirstUsersMeRequest } from '../utils/api'

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
            tokenLength: session.token ? session.token.length : 0,
            isFirstLogin: session.isFirstLogin
          })
          
          // Réinitialiser les variables de rotation pour une nouvelle session
          console.log('🔄 Resetting rotation variables for new session')
          clearLastReceivedToken()
          resetFirstUsersMeRequest()
          
          // Note: first_auth_me sera stocké lors du premier appel /api/users/me
          // Ne pas le supprimer ici car il sera utilisé pour la rotation des tokens
          
          // Debug: Vérifier localStorage avant la mise à jour
          if (typeof window !== 'undefined') {
            const beforeState = JSON.parse(localStorage.getItem('auth-storage') || '{}')
            console.log('🔍 localStorage before login:', {
              hasExistingState: !!beforeState.state,
              existingToken: beforeState.state?.token ? `${beforeState.state.token.substring(0, 10)}...` : 'none'
            })
          }
          
          set({
            user: session.user,
            token: session.token,
            isAuthenticated: true,
            isFirstLogin: session.isFirstLogin || false,
            error: null
          })
          
          // Debug: Vérifier localStorage après la mise à jour
          setTimeout(() => {
            if (typeof window !== 'undefined') {
              const afterState = JSON.parse(localStorage.getItem('auth-storage') || '{}')
              console.log('🔍 localStorage after login:', {
                hasState: !!afterState.state,
                storedToken: afterState.state?.token ? `${afterState.state.token.substring(0, 10)}...` : 'none',
                tokenLength: afterState.state?.token ? afterState.state.token.length : 0,
                isAuthenticated: afterState.state?.isAuthenticated,
                userEmail: afterState.state?.user?.email
              })
            }
          }, 100)
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
          
          // Nettoyer le token temporaire et réinitialiser l'état
          clearLastReceivedToken()
          resetFirstUsersMeRequest()
          compareTokens(null) // Reset token comparison state
          
          // Nettoyer first_auth_me lors de la déconnexion
          if (typeof window !== 'undefined') {
            localStorage.removeItem('first_auth_me')
            console.log('🧹 Cleared first_auth_me on logout')
          }
        },

        setUser: (user) => set({ user }),

        setToken: (token) => {
          console.log('🔑 Updating token in store:', {
            tokenPreview: token ? `${token.substring(0, 20)}...` : 'none',
            tokenLength: token ? token.length : 0
          })
          
          // Debug: Vérifier localStorage avant la mise à jour
          if (typeof window !== 'undefined') {
            const beforeState = JSON.parse(localStorage.getItem('auth-storage') || '{}')
            console.log('🔍 localStorage before setToken:', {
              hasExistingState: !!beforeState.state,
              existingToken: beforeState.state?.token ? `${beforeState.state.token.substring(0, 10)}...` : 'none'
            })
          }
          
          set({ token })
          
          // S'assurer que le token est persisté immédiatement
          if (typeof window !== 'undefined') {
            const currentState = JSON.parse(localStorage.getItem('auth-storage') || '{}')
            const updatedState = {
              ...currentState,
              state: {
                ...currentState.state,
                token: token
              }
            }
            localStorage.setItem('auth-storage', JSON.stringify(updatedState))
            console.log('💾 Token persisted to localStorage')
            
            // Debug: Vérifier localStorage après la mise à jour
            setTimeout(() => {
              const afterState = JSON.parse(localStorage.getItem('auth-storage') || '{}')
              console.log('🔍 localStorage after setToken:', {
                hasState: !!afterState.state,
                storedToken: afterState.state?.token ? `${afterState.state.token.substring(0, 10)}...` : 'none',
                tokenLength: afterState.state?.token ? afterState.state.token.length : 0,
                tokensMatch: afterState.state?.token === token
              })
            }, 50)
          }
        },

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