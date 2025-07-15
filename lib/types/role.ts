export interface RolePermission {
  name: string
  subMenus: Record<string, any>
  permissions: string[]
}

export interface RolePermissions {
  accueil: RolePermission
  isAdmin: boolean
  rapports: RolePermission
  parametres: RolePermission
  canManageRoles: boolean
  canManageUsers: boolean
  gestion_compte: RolePermission
  demande_rechargement: RolePermission
  gestion_beneficiaires: RolePermission
  paiement_beneficiaires: RolePermission
}

export interface Role {
  id: number
  name: string
  description: string
  permissions: RolePermissions
  is_active: boolean
  companyId: number
  is_default: boolean
  createdAt: string
  updatedAt: string
}

// Structure de réponse Sequelize pour un rôle individuel
export interface SequelizeRoleResponse {
  dataValues: Role
  _previousDataValues: Role
  uniqno: number
  _changed: Record<string, any>
  _options: {
    isNewRecord: boolean
    _schema: any
    _schemaDelimiter: string
    raw: boolean
    attributes: string[]
  }
  isNewRecord: boolean
  newToken?: string
}

export interface RolesResponse {
  [key: string]: Role
  newToken?: string
}

export interface CreateRoleRequest {
  name: string
  description: string
  permissions: RolePermissions
}

export interface CreateRoleResponse {
  success: boolean
  message: string
  role?: Role
  newToken?: string
} 