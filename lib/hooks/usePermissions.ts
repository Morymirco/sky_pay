import { useAuthStore } from '../stores/authStore'
import { PermissionItem, SubMenuPermission } from '../types/auth'

export function usePermissions() {
  const { user, isLoading } = useAuthStore()
  
  const permissions = user?.Role?.permissions

  // Debug: Afficher les données utilisateur et permissions
  console.log('🔍 usePermissions hook debug:', {
    user,
    isLoading,
    hasUser: !!user,
    hasRole: !!user?.Role,
    permissions,
    accueilPermissions: permissions?.accueil?.permissions,
    isAdmin: permissions?.isAdmin
  })

  // Vérifier si l'utilisateur a une permission spécifique
  const hasPermission = (permissionPath: string): boolean => {
    if (!permissions) return false
    
    // Gestion des permissions spéciales
    if (permissionPath === 'isAdmin') return permissions.isAdmin || false
    if (permissionPath === 'canManageRoles') return permissions.canManageRoles || false
    if (permissionPath === 'canManageUsers') return permissions.canManageUsers || false
    
    // Parser le chemin de permission (ex: "gestion_beneficiaires.liste_beneficiaires.view")
    const parts = permissionPath.split('.')
    
    if (parts.length === 1) {
      // Permission simple (ex: "accueil")
      const menu = permissions[parts[0] as keyof typeof permissions] as PermissionItem
      return menu?.permissions?.includes('view') || false
    }
    
    if (parts.length === 2) {
      // Permission avec action (ex: "accueil.view")
      const [menuKey, action] = parts
      const menu = permissions[menuKey as keyof typeof permissions] as PermissionItem
      return menu?.permissions?.includes(action) || false
    }
    
    if (parts.length === 3) {
      // Permission avec sous-menu et action (ex: "gestion_beneficiaires.liste_beneficiaires.view")
      const [menuKey, subMenuKey, action] = parts
      const menu = permissions[menuKey as keyof typeof permissions] as PermissionItem
      const subMenu = menu?.subMenus?.[subMenuKey] as SubMenuPermission
      return subMenu?.permissions?.includes(action) || false
    }
    
    return false
  }

  // Vérifier si l'utilisateur peut accéder à un menu
  const canAccessMenu = (menuKey: string): boolean => {
    return hasPermission(`${menuKey}.view`) || hasPermission(menuKey)
  }

  // Vérifier si l'utilisateur peut effectuer une action sur un sous-menu
  const canPerformAction = (menuKey: string, subMenuKey: string, action: string): boolean => {
    return hasPermission(`${menuKey}.${subMenuKey}.${action}`)
  }

  // Vérifier si l'utilisateur est admin
  const isAdmin = (): boolean => {
    return hasPermission('isAdmin')
  }

  // Vérifier si l'utilisateur peut gérer les rôles
  const canManageRoles = (): boolean => {
    return hasPermission('canManageRoles')
  }

  // Vérifier si l'utilisateur peut gérer les utilisateurs
  const canManageUsers = (): boolean => {
    return hasPermission('canManageUsers')
  }

  // Obtenir toutes les permissions disponibles
  const getAllPermissions = () => {
    return permissions || {}
  }

  // Vérifier si l'utilisateur a au moins une des permissions spécifiées
  const hasAnyPermission = (permissionPaths: string[]): boolean => {
    return permissionPaths.some(path => hasPermission(path))
  }

  // Vérifier si l'utilisateur a toutes les permissions spécifiées
  const hasAllPermissions = (permissionPaths: string[]): boolean => {
    return permissionPaths.every(path => hasPermission(path))
  }

  // Obtenir les permissions d'un menu spécifique
  const getMenuPermissions = (menuKey: string): PermissionItem | null => {
    if (!permissions) return null
    return permissions[menuKey as keyof typeof permissions] as PermissionItem || null
  }

  // Obtenir les sous-menus d'un menu spécifique
  const getSubMenus = (menuKey: string): Record<string, SubMenuPermission> | null => {
    const menu = getMenuPermissions(menuKey)
    return menu?.subMenus || null
  }

  return {
    // État
    permissions,
    isLoading,
    isAdmin: isAdmin(),
    canManageRoles: canManageRoles(),
    canManageUsers: canManageUsers(),
    
    // Méthodes de vérification
    hasPermission,
    canAccessMenu,
    canPerformAction,
    hasAnyPermission,
    hasAllPermissions,
    
    // Méthodes d'accès aux données
    getAllPermissions,
    getMenuPermissions,
    getSubMenus,
    
    // Utilitaires
    isAdmin,
    canManageRoles,
    canManageUsers
  }
} 