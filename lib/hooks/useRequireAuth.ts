import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
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
  const { isAuthenticated, user, hasPermission, hasRole, canAccess } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push(redirectTo)
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
  }, [isAuthenticated, user, requiredPermissions, requiredRole, redirectTo, router, hasPermission, hasRole, canAccess])

  return {
    isAuthenticated,
    user,
    hasPermission,
    hasRole,
    canAccess: (permissions: string[]) => canAccess(permissions)
  }
} 