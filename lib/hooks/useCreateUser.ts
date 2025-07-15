import { useMutation, useQueryClient } from '@tanstack/react-query'
import { authService } from '../services/auth'

interface CreateUserData {
  first_name: string
  last_name: string
  username: string
  email: string
  roleId: number
  is_active: boolean
  is_first_login: boolean
}

export const useCreateUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (userData: CreateUserData) => authService.createUser(userData),
    // Suppression de l'invalidation automatique pour éviter la double requête
    // onSuccess: () => {
    //   queryClient.invalidateQueries({ queryKey: ['company-users'] })
    // },
  })
} 