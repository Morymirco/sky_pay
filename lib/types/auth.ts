export interface User {
  id: number
  first_name: string
  last_name: string
  email: string
  username?: string
  roleId: number
  companyId: number
  is_active: boolean
  is_first_login: boolean
  Role?: Role
  company?: {
    id: number
    name: string
  }
  createdAt?: string
  updatedAt?: string
}

export interface Role {
  id: number
  name: string
  description?: string
  permissions: Permissions
  is_active: boolean
  is_default: boolean
  createdAt: string
  updatedAt: string
}

export interface Permissions {
  accueil?: PermissionItem
  rapports?: PermissionItem
  parametres?: PermissionItem
  gestion_compte?: PermissionItem
  demande_rechargement?: PermissionItem
  gestion_beneficiaires?: PermissionItem
  paiement_beneficiaires?: PermissionItem
  isAdmin?: boolean
  canManageRoles?: boolean
  canManageUsers?: boolean
}

export interface PermissionItem {
  name: string
  permissions: string[]
  subMenus?: Record<string, SubMenuPermission>
}

export interface SubMenuPermission {
  name: string
  permissions: string[]
}

export interface AuthSession {
  user: User
  token: string
  isAuthenticated: boolean
  isFirstLogin?: boolean
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface LoginResponse {
  success: boolean
  message: string
  data: {
    token: string
    user: User
    requiresOTP: boolean
  }
}

export interface OTPVerificationRequest {
  email: string
  otp: string
}

export interface OTPVerificationResponse {
  success: boolean
  message: string
  token: string
  first_login?: boolean
  data?: {
    token: string
    user: User
  }
}

export interface PasswordChangeRequest {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export interface RefreshTokenResponse {
  success: boolean
  accessToken: string
  expiresIn: number
}

export interface ApiResponse {
  success: boolean
  message: string
  user: User
  company: CompanyData
  role: Role
  newToken?: string
}

export interface CompanyData {
  id: number
  name: string
  address: string
  phone: string
  email: string
  logo: string
  is_active: boolean
  solde: number
  createdAt: string
  updatedAt: string
}

export interface ChangePasswordRequest {
  current_password: string
  new_password: string
}

export interface RequestPasswordResetOTPRequest {
  email: string
}

export interface ResetPasswordOTPRequest {
  email: string
  otp: string
  new_password: string
}

export interface RequestPasswordResetOTPResponse {
  message: string
}

export interface ResetPasswordOTPResponse {
  message: string
} 