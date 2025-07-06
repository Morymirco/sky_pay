'use client'

import { ReactNode } from 'react'
import { useAuthStore } from '@/lib/stores/authStore'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface ProtectedRouteProps {
  children: ReactNode
  requiredPermissions?: string[]
  requiredRole?: string
  fallback?: ReactNode
  redirectTo?: string
}

export function ProtectedRoute({ 
  children, 
  requiredPermissions = [], 
  requiredRole, 
  fallback,
  redirectTo = '/login'
}: ProtectedRouteProps) {
  const { isAuthenticated, user, hasPermission, hasRole, canAccess } = useAuthStore()
  const router = useRouter()
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

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

    setIsAuthorized(true)
    setIsLoading(false)
  }, [isAuthenticated, user, requiredPermissions, requiredRole, redirectTo, router, hasPermission, hasRole, canAccess])

  if (isLoading) {
    return fallback || (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!isAuthorized) {
    return null
  }

  return <>{children}</>
} 