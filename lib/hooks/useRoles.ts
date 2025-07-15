import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
    createRole,
    deleteRole,
    getRoleById,
    getRoles,
    updateRole
} from '../services/roles'
import { CreateRoleRequest } from '../types/role'

// Clés de cache pour React Query
export const roleKeys = {
  all: ['roles'] as const,
  lists: () => [...roleKeys.all, 'list'] as const,
  list: (filters: string) => [...roleKeys.lists(), { filters }] as const,
  details: () => [...roleKeys.all, 'detail'] as const,
  detail: (id: number) => [...roleKeys.details(), id] as const,
}

/**
 * Hook pour récupérer la liste des rôles
 */
export const useRoles = () => {
  return useQuery({
    queryKey: roleKeys.lists(),
    queryFn: getRoles,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

/**
 * Hook pour récupérer un rôle par son ID
 */
export const useRole = (id: number) => {
  return useQuery({
    queryKey: roleKeys.detail(id),
    queryFn: () => getRoleById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

/**
 * Hook pour créer un nouveau rôle
 */
export const useCreateRole = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (roleData: CreateRoleRequest) => createRole(roleData),
    onSuccess: () => {
      // Invalider et refetch la liste des rôles
      queryClient.invalidateQueries({ queryKey: roleKeys.lists() })
    },
  })
}

/**
 * Hook pour mettre à jour un rôle
 */
export const useUpdateRole = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<CreateRoleRequest> }) =>
      updateRole(id, data),
    onSuccess: (updatedRole) => {
      // Mettre à jour le cache pour ce rôle spécifique
      queryClient.setQueryData(roleKeys.detail(updatedRole.id), updatedRole)
      // Invalider la liste des rôles
      queryClient.invalidateQueries({ queryKey: roleKeys.lists() })
    },
  })
}

/**
 * Hook pour supprimer un rôle
 */
export const useDeleteRole = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id: number) => deleteRole(id),
    onSuccess: (_, deletedId) => {
      // Supprimer le rôle du cache
      queryClient.removeQueries({ queryKey: roleKeys.detail(deletedId) })
      // Invalider la liste des rôles
      queryClient.invalidateQueries({ queryKey: roleKeys.lists() })
    },
  })
}

 