'use client'

import { usePermissions } from '@/lib/hooks/usePermissions'
import { ReactNode } from 'react'

interface PermissionGuardProps {
  children: ReactNode
  requiredPermissions?: string[]
  requiredMenu?: string
  requiredAction?: string
  requiredSubMenu?: string
  fallback?: ReactNode
  showFallback?: boolean
}

export function PermissionGuard({ 
  children, 
  requiredPermissions = [],
  requiredMenu,
  requiredAction,
  requiredSubMenu,
  fallback = null,
  showFallback = false
}: PermissionGuardProps) {
  const { 
    hasPermission, 
    canAccessMenu, 
    canPerformAction, 
    hasAnyPermission, 
    hasAllPermissions 
  } = usePermissions()

  // Vérifier les permissions spécifiques
  if (requiredPermissions.length > 0) {
    const hasAccess = hasAnyPermission(requiredPermissions)
    if (!hasAccess) {
      return showFallback ? fallback : null
    }
  }

  // Vérifier l'accès au menu
  if (requiredMenu && !canAccessMenu(requiredMenu)) {
    return showFallback ? fallback : null
  }

  // Vérifier l'action sur un sous-menu
  if (requiredMenu && requiredSubMenu && requiredAction) {
    const canPerform = canPerformAction(requiredMenu, requiredSubMenu, requiredAction)
    if (!canPerform) {
      return showFallback ? fallback : null
    }
  }

  return <>{children}</>
}

// Composant pour vérifier si l'utilisateur est admin
export function AdminGuard({ children, fallback = null }: { children: ReactNode, fallback?: ReactNode }) {
  const { isAdmin } = usePermissions()
  
  if (!isAdmin) {
    return fallback ? <>{fallback}</> : null
  }
  
  return <>{children}</>
}

// Composant pour vérifier la gestion des rôles
export function RoleManagementGuard({ children, fallback = null }: { children: ReactNode, fallback?: ReactNode }) {
  const { canManageRoles } = usePermissions()
  
  if (!canManageRoles) {
    return fallback ? <>{fallback}</> : null
  }
  
  return <>{children}</>
}

// Composant pour vérifier la gestion des utilisateurs
export function UserManagementGuard({ children, fallback = null }: { children: ReactNode, fallback?: ReactNode }) {
  const { canManageUsers } = usePermissions()
  
  if (!canManageUsers) {
    return fallback ? <>{fallback}</> : null
  }
  
  return <>{children}</>
} 