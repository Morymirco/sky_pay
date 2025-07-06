'use client'

import { useEffect, ReactNode } from 'react'
import { useAuthStore } from '@/lib/stores/authStore'
import { authService } from '@/lib/services/auth'
import { useRouter } from 'next/navigation'

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { 
    isAuthenticated, 
    refreshToken, 
    isTokenExpired, 
    updateToken, 
    clearSession 
  } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    // Vérifier si le token est expiré au chargement
    if (isAuthenticated && isTokenExpired()) {
      // Essayer de rafraîchir le token
      if (refreshToken) {
        authService.refreshToken(refreshToken)
          .then((data) => {
            updateToken(data.accessToken, data.expiresIn)
          })
          .catch(() => {
            clearSession()
            router.push('/login')
          })
      } else {
        clearSession()
        router.push('/login')
      }
    }
  }, [isAuthenticated, refreshToken, isTokenExpired, updateToken, clearSession, router])

  // Intercepteur pour rafraîchir automatiquement le token
  useEffect(() => {
    const checkTokenExpiry = () => {
      if (isAuthenticated && isTokenExpired() && refreshToken) {
        authService.refreshToken(refreshToken)
          .then((data) => {
            updateToken(data.accessToken, data.expiresIn)
          })
          .catch(() => {
            clearSession()
            router.push('/login')
          })
      }
    }

    // Vérifier toutes les 5 minutes
    const interval = setInterval(checkTokenExpiry, 5 * 60 * 1000)

    return () => clearInterval(interval)
  }, [isAuthenticated, refreshToken, isTokenExpired, updateToken, clearSession, router])

  return <>{children}</>
} 