import {
    CreateRoleRequest,
    CreateRoleResponse,
    Role,
    RolesResponse,
    SequelizeRoleResponse
} from '../types/role'
import { apiClient, handleApiError } from '../utils/api'

/**
 * Récupère la liste des rôles
 */
export const getRoles = async (): Promise<Role[]> => {
  try {
    const response = await apiClient.get<RolesResponse>('/api/roles/')
    
    // Convertir l'objet en tableau et exclure newToken
    const rolesArray = Object.entries(response.data)
      .filter(([key, value]) => key !== 'newToken' && typeof value === 'object')
      .map(([_, role]) => role as Role)
    
    return rolesArray
  } catch (error) {
    throw new Error(handleApiError(error))
  }
}

/**
 * Récupère un rôle par son ID
 */
export const getRoleById = async (id: number): Promise<Role> => {
  try {
    const response = await apiClient.get<SequelizeRoleResponse>(`/api/roles/${id}`)
    
    // Gérer la structure Sequelize avec dataValues
    const roleData = response.data.dataValues || response.data
    
    // Extraire le rôle de la structure de réponse
    const role: Role = {
      id: roleData.id,
      name: roleData.name,
      description: roleData.description,
      permissions: roleData.permissions,
      is_active: roleData.is_active,
      companyId: roleData.companyId,
      is_default: roleData.is_default,
      createdAt: roleData.createdAt,
      updatedAt: roleData.updatedAt
    }
    
    return role
  } catch (error) {
    throw new Error(handleApiError(error))
  }
}

/**
 * Crée un nouveau rôle
 */
export const createRole = async (roleData: CreateRoleRequest): Promise<CreateRoleResponse> => {
  try {
    const response = await apiClient.post<CreateRoleResponse>('/api/roles/create', roleData)
    return response.data
  } catch (error) {
    throw new Error(handleApiError(error))
  }
}

/**
 * Met à jour un rôle
 */
export const updateRole = async (id: number, roleData: Partial<CreateRoleRequest>): Promise<Role> => {
  try {
    const response = await apiClient.put<Role>(`/api/roles/${id}`, roleData)
    return response.data
  } catch (error) {
    throw new Error(handleApiError(error))
  }
}

/**
 * Supprime un rôle
 */
export const deleteRole = async (id: number): Promise<void> => {
  try {
    await apiClient.delete(`/api/roles/${id}`)
  } catch (error) {
    throw new Error(handleApiError(error))
  }
} 