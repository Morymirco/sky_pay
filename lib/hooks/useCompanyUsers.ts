import { useQuery } from '@tanstack/react-query'
import { authService } from '../services/auth'

export const useCompanyUsers = () => {
  return useQuery({
    queryKey: ['company-users'],
    queryFn: authService.getCompanyUsers,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
} 