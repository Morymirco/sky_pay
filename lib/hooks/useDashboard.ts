import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { dashboardService, DashboardStatsResponse } from '../services/dashboard'

export function useDashboard() {
  return useQuery<DashboardStatsResponse, Error>({
    queryKey: ['dashboard'],
    queryFn: () => dashboardService.getDashboardStats(),
    retry: 2,
    staleTime: 5 * 60 * 1000,
  })
}

export function useRefreshDashboard() {
  const queryClient = useQueryClient()
  return useMutation<DashboardStatsResponse, Error>({
    mutationFn: () => dashboardService.getDashboardStats(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    }
  })
}

// Hooks individuels pour chaque type de données
export function useBulkPaymentStats() {
  return useQuery({
    queryKey: ['dashboard', 'bulk-payment-stats'],
    queryFn: () => dashboardService.getBulkPaymentStats(),
    retry: 2,
    staleTime: 5 * 60 * 1000,
  })
}

export function useRecentActivities() {
  return useQuery({
    queryKey: ['dashboard', 'recent-activities'],
    queryFn: () => dashboardService.getRecentActivities(),
    retry: 2,
    staleTime: 2 * 60 * 1000, // Plus court pour les activités récentes
  })
}

export function useBeneficiariesCount() {
  return useQuery({
    queryKey: ['dashboard', 'beneficiaries-count'],
    queryFn: () => dashboardService.getBeneficiariesCount(),
    retry: 2,
    staleTime: 10 * 60 * 1000, // Plus long pour les statistiques
  })
}