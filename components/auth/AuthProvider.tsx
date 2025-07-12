'use client'

import { useAuthStore } from '@/lib/stores/authStore'
import { decodeToken, isTokenExpired } from '@/lib/utils/api'
import { useEffect } from 'react'

interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { isAuthenticated, user, token } = useAuthStore()

  useEffect(() => {
    // Vérifier l'état d'authentification au chargement de l'application
    console.log('🔐 AuthProvider: Initializing authentication state', {
      isAuthenticated,
      hasUser: !!user,
      hasToken: !!token,
      userEmail: user?.email
    })

    // Vérifier la persistance du token dans localStorage
    if (typeof window !== 'undefined') {
      const persistedState = JSON.parse(localStorage.getItem('auth-storage') || '{}')
      const persistedToken = persistedState.state?.token
      
      console.log('💾 AuthProvider: Checking token persistence', {
        storeToken: token ? `${token.substring(0, 20)}...` : 'none',
        storeTokenLength: token ? token.length : 0,
        persistedToken: persistedToken ? `${persistedToken.substring(0, 20)}...` : 'none',
        persistedTokenLength: persistedToken ? persistedToken.length : 0,
        tokensMatch: token === persistedToken,
        hasPersistedState: !!persistedState.state,
        persistedIsAuthenticated: persistedState.state?.isAuthenticated,
        persistedUserEmail: persistedState.state?.user?.email
      })
      
      // Si le token du store ne correspond pas au token persisté, mettre à jour
      if (isAuthenticated && token && persistedToken && token !== persistedToken) {
        console.log('🔄 AuthProvider: Token mismatch detected, updating store')
        const { setToken } = useAuthStore.getState()
        setToken(persistedToken)
      }
      
      // Si on a un token persisté mais pas dans le store, vérifier s'il est valide
      if (!isAuthenticated && persistedToken && persistedState.state?.isAuthenticated) {
        // Vérifier si le token est expiré
        const tokenExpired = isTokenExpired(persistedToken)
        const tokenPayload = decodeToken(persistedToken)
        
        console.log('🔍 AuthProvider: Checking persisted token validity', {
          userEmail: persistedState.state.user?.email,
          tokenLength: persistedToken.length,
          tokenExpired,
          tokenExp: tokenPayload?.exp ? new Date(tokenPayload.exp * 1000).toISOString() : 'unknown',
          currentTime: new Date().toISOString()
        })
        
        if (tokenExpired) {
          console.log('⚠️ AuthProvider: Persisted token is expired, clearing auth state')
          const { logout } = useAuthStore.getState()
          logout()
          return
        }
        
        console.log('🔄 AuthProvider: Restoring authentication state from localStorage', {
          userEmail: persistedState.state.user?.email,
          tokenLength: persistedToken.length,
          isFirstLogin: persistedState.state.isFirstLogin
        })
        const { login } = useAuthStore.getState()
        login({
          user: persistedState.state.user,
          token: persistedToken,
          isFirstLogin: persistedState.state.isFirstLogin || false
        })
      }
    }

    // Nettoyer les données temporaires au chargement
    const tempAuthData = localStorage.getItem('temp_auth_data')
    const tempResetData = localStorage.getItem('temp_reset_data')
    
    if (tempAuthData) {
      console.log('🧹 Cleaning up temp auth data on app load')
      localStorage.removeItem('temp_auth_data')
    }
    
    if (tempResetData) {
      console.log('🧹 Cleaning up temp reset data on app load')
      localStorage.removeItem('temp_reset_data')
    }

    // Vérifier si l'utilisateur est authentifié
    if (isAuthenticated && user && token) {
      console.log('✅ AuthProvider: User is authenticated')
    } else {
      console.log('❌ AuthProvider: User is not authenticated')
    }
  }, []) // Exécuter seulement au montage du composant

  return <>{children}</>
} 