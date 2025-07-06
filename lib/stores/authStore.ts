import { create } from 'zustand'
import { persist, subscribeWithSelector } from 'zustand/middleware'
import { AuthSession, User } from '../types/auth'

interface AuthState {
  // State
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  expiresAt: number | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  
  // Actions
  login: (session: AuthSession) => void
  logout: () => void
  setUser: (user: User) => void
  updateToken: (accessToken: string, expiresIn: number) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  clearSession: () => void
  clearError: () => void
  
  // Computed
  isTokenExpired: () => boolean
  hasPermission: (permission: string) => boolean
  hasRole: (role: string) => boolean
  canAccess: (requiredPermissions: string[]) => boolean
}

export const useAuthStore = create<AuthState>()(
  subscribeWithSelector(
    persist(
      (set, get) => ({
        // Initial state
        user: null,
        accessToken: null,
        refreshToken: null,
        expiresAt: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,

        // Actions
        login: (session) => set({
          user: session.user,
          accessToken: session.accessToken,
          refreshToken: session.refreshToken,
          expiresAt: session.expiresAt,
          isAuthenticated: true,
          error: null
        }),

        logout: () => set({
          user: null,
          accessToken: null,
          refreshToken: null,
          expiresAt: null,
          isAuthenticated: false,
          error: null
        }),

        setUser: (user) => set({ user }),

        updateToken: (accessToken, expiresIn) => set({
          accessToken,
          expiresAt: Date.now() + expiresIn * 1000
        }),

        setLoading: (isLoading) => set({ isLoading }),

        setError: (error) => set({ error }),

        clearSession: () => set({
          user: null,
          accessToken: null,
          refreshToken: null,
          expiresAt: null,
          isAuthenticated: false,
          error: null
        }),

        clearError: () => set({ error: null }),

        // Computed
        isTokenExpired: () => {
          const { expiresAt } = get()
          return expiresAt ? Date.now() > expiresAt : true
        },

        hasPermission: (permission) => {
          const { user } = get()
          return user?.permissions?.includes(permission) || false
        },

        hasRole: (role) => {
          const { user } = get()
          return user?.role === role
        },

        canAccess: (requiredPermissions) => {
          const { user } = get()
          if (!user?.permissions) return false
          return requiredPermissions.every(permission => 
            user.permissions.includes(permission)
          )
        }
      }),
      {
        name: 'auth-storage',
        partialize: (state) => ({
          user: state.user,
          accessToken: state.accessToken,
          refreshToken: state.refreshToken,
          expiresAt: state.expiresAt,
          isAuthenticated: state.isAuthenticated
        }),
        onRehydrateStorage: () => (state) => {
          // Vérifier si le token est expiré au rechargement
          if (state && state.isTokenExpired()) {
            state.clearSession()
          }
        }
      }
    )
  )
) 