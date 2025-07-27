import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { CreateBulkPaymentRequest, CreatePaymentRequest, paymentsService } from '../services/payments'
import { handleApiError } from '../utils/api'

export function usePayments(page = 1, limit = 10, status?: string) {
  return useQuery({
    queryKey: ['payments', page, limit, status],
    queryFn: () => paymentsService.getPayments(page, limit, status),
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: 2
  })
}

export function usePayment(id: string) {
  return useQuery({
    queryKey: ['payments', id],
    queryFn: () => paymentsService.getPayment(id),
    enabled: !!id,
    staleTime: 2 * 60 * 1000,
    retry: 2
  })
}

export function useCreatePayment() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data: CreatePaymentRequest) => paymentsService.createPayment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
    onError: (error) => {
      console.error('❌ Error creating payment:', error)
      throw handleApiError(error)
    }
  })
}

export function useBulkPayments(page = 1, limit = 10, status?: string) {
  return useQuery({
    queryKey: ['bulk-payments', page, limit, status],
    queryFn: () => paymentsService.getBulkPayments(page, limit, status),
    staleTime: 2 * 60 * 1000,
    retry: 2
  })
}

export function useBulkPayment(id: string) {
  return useQuery({
    queryKey: ['bulk-payments', id],
    queryFn: () => paymentsService.getBulkPayment(id),
    enabled: !!id,
    staleTime: 2 * 60 * 1000,
    retry: 2
  })
}

export function useCreateBulkPayment() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data: CreateBulkPaymentRequest) => paymentsService.createBulkPayment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bulk-payments'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
    onError: (error) => {
      console.error('❌ Error creating bulk payment:', error)
      throw handleApiError(error)
    }
  })
}

export function useVerifyBulkPayment() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id: string) => paymentsService.verifyBulkPayment(id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['bulk-payments'] })
      queryClient.invalidateQueries({ queryKey: ['bulk-payments', variables] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
    onError: (error) => {
      console.error('❌ Error verifying bulk payment:', error)
      throw handleApiError(error)
    }
  })
}

export function useValidateBulkPayment() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id: string) => paymentsService.validateBulkPayment(id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['bulk-payments'] })
      queryClient.invalidateQueries({ queryKey: ['bulk-payments', variables] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
    onError: (error) => {
      console.error('❌ Error validating bulk payment:', error)
      throw handleApiError(error)
    }
  })
}

export function usePaymentHistory(page = 1, limit = 10, month?: number, year?: number) {
  return useQuery({
    queryKey: ['payment-history', page, limit, month, year],
    queryFn: () => paymentsService.getPaymentHistory(page, limit, month, year),
    staleTime: 5 * 60 * 1000,
    retry: 2
  })
}

export function usePaymentStats() {
  return useQuery({
    queryKey: ['payment-stats'],
    queryFn: () => paymentsService.getPaymentStats(),
    staleTime: 5 * 60 * 1000,
    retry: 2
  })
}

export function useBulkPaymentStats() {
  return useQuery({
    queryKey: ['bulk-payment-stats'],
    queryFn: () => paymentsService.getBulkPaymentStats(),
    staleTime: 5 * 60 * 1000,
    retry: 2
  })
}

export function useExportPayments() {
  return useMutation({
    mutationFn: ({ format, filters }: { format: 'csv' | 'xlsx'; filters?: any }) => 
      paymentsService.exportPayments(format, filters),
    onError: (error) => {
      console.error('❌ Error exporting payments:', error)
      throw handleApiError(error)
    }
  })
} 