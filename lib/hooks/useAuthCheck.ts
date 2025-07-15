import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { useAuthStore } from '../stores/authStore'
import { apiClient } from '../utils/api'

export function useAuthCheck() {
  const { isAuthenticated, token, logout, setUser, setRole, setPermissions, user } = useAuthStore()
  const router = useRouter()
  const [isLoadingUserData, setIsLoadingUserData] = useState(false)
  const hasLoadedUserData = useRef(false)

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
      pathname: window.location.pathname,
      hasUserData: !!user,
      hasUserRole: !!user?.Role,
      hasLoadedUserData: hasLoadedUserData.current
    })

    // Éviter les redirections sur la page d'accueil ou login
    if (window.location.pathname === '/' || window.location.pathname === '/login') {
      console.log('🏠 On public page, skipping auth check')
      return
    }

    // Si pas authentifié mais sur une page protégée, rediriger
    if (!isAuthenticated && window.location.pathname.startsWith('/dashboard')) {
      console.log('🔄 Not authenticated, redirecting to login...')
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

    // Si authentifié avec token mais pas de données utilisateur complètes, les charger
    if (isAuthenticated && token && !hasLoadedUserData.current && (!user?.Role || !user?.Role?.permissions)) {
      console.log('📊 Authenticated but missing user data, loading from /api/users/me...')
      
      if (!isLoadingUserData) {
        setIsLoadingUserData(true)
        
        apiClient.get('/api/users/me')
          .then((response) => {
            const data = response.data
            console.log('✅ User data loaded successfully:', {
              hasUser: !!data.user,
              hasRole: !!data.role,
              hasPermissions: !!data.role?.permissions,
              accueilPermissions: data.role?.permissions?.accueil?.permissions,
              hasNewToken: !!data.newToken
            })
            
            // Mettre à jour le store avec les données complètes
            setUser(data.user)
            setRole(data.role)
            setPermissions(data.role?.permissions)
            
            hasLoadedUserData.current = true
            console.log('💾 Store updated with complete user data')
          })
          .catch((error) => {
            console.error('❌ Failed to load user data:', error)
            // En cas d'erreur, déconnecter l'utilisateur seulement si c'est une erreur 401
            if (error.response?.status === 401) {
              logout()
              router.push('/login')
            }
          })
          .finally(() => {
            setIsLoadingUserData(false)
          })
      }
    }

    // Marquer que les données utilisateur sont chargées si elles existent
    if (isAuthenticated && token && user?.Role?.permissions && !hasLoadedUserData.current) {
      hasLoadedUserData.current = true
      console.log('✅ User data already available, marking as loaded')
    }
  }, [isAuthenticated, token, logout, router, user, setUser, setRole, setPermissions])

  return { isAuthenticated, token, isLoadingUserData }
} 