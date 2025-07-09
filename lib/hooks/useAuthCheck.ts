import { useEffect } from 'react'
import { useAuthStore } from '../stores/authStore'
import { useRouter } from 'next/navigation'

export function useAuthCheck() {
  const { isAuthenticated, token, logout } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    // Attendre que le store soit hydraté
    const authState = JSON.parse(localStorage.getItem('auth-storage') || '{}')
    const storedToken = authState.state?.token
    const storedIsAuthenticated = authState.state?.isAuthenticated

    console.log('🔍 Auth state check:', {
      storeIsAuthenticated: isAuthenticated,
      storeHasToken: !!token,
      localStorageIsAuthenticated: storedIsAuthenticated,
      localStorageHasToken: !!storedToken,
      tokenMatch: token === storedToken,
      pathname: window.location.pathname
    })

    // Éviter les redirections sur la page d'accueil ou login
    if (window.location.pathname === '/' || window.location.pathname === '/login') {
      console.log('🏠 On public page, skipping auth check')
      return
    }

    // Si incohérence entre store et localStorage, nettoyer
    if (isAuthenticated !== storedIsAuthenticated || token !== storedToken) {
      console.warn('⚠️ Auth state inconsistency detected, clearing...')
      logout()
      router.push('/login')
      return
    }

    // Si authentifié mais pas de token, déconnecter
    if (isAuthenticated && !token) {
      console.warn('⚠️ Authenticated but no token, logging out...')
      logout()
      router.push('/login')
      return
    }

    // Si pas authentifié mais sur une page protégée, rediriger
    if (!isAuthenticated && window.location.pathname.startsWith('/dashboard')) {
      console.log('🔄 Not authenticated, redirecting to login...')
      router.push('/login')
    }
  }, [isAuthenticated, token, logout, router])

  return { isAuthenticated, token }
} 