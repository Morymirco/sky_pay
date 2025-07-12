import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useAuthStore } from '../stores/authStore'

interface UseRequireAuthOptions {
  redirectTo?: string
  requiredPermissions?: string[]
  requiredRole?: string
  fallback?: React.ReactNode
}

export function useRequireAuth({
  redirectTo = '/login',
  requiredPermissions = [],
  requiredRole,
  fallback
}: UseRequireAuthOptions = {}) {
  const { isAuthenticated, user, hasPermission, hasRole, canAccess, token } = useAuthStore()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    console.log('🔍 Auth check:', { 
      isAuthenticated, 
      hasUser: !!user, 
      hasToken: !!token,
      userEmail: user?.email 
    })

    if (!isAuthenticated || !user || !token) {
      console.log('❌ Not authenticated, redirecting to login')
      router.push('/login')
      return
    }

    // Vérifier les permissions
    if (requiredPermissions.length > 0 && !canAccess(requiredPermissions)) {
      router.push('/unauthorized')
      return
    }

    // Vérifier le rôle
    if (requiredRole && !hasRole(requiredRole)) {
      router.push('/unauthorized')
      return
    }

    // Si tout est OK, arrêter le loading
    setIsLoading(false)
  }, [isAuthenticated, user, requiredPermissions, requiredRole, redirectTo, router, hasPermission, hasRole, canAccess, token])

  return {
    isAuthenticated,
    user,
    token,
    isLoading,
    hasPermission,
    hasRole,
    canAccess: (permissions: string[]) => canAccess(permissions)
  }
} 