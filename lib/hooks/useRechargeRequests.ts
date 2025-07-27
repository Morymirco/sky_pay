import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { CreateRechargeRequestRequest, rechargeRequestsService, UpdateRechargeRequestRequest } from '../services/rechargeRequests'

export const useRechargeRequests = (
  page: number = 1,
  limit: number = 20,
  filters: string = "{}"
) => {
  return useQuery({
    queryKey: ['recharge-requests', page, limit, filters],
    queryFn: () => rechargeRequestsService.getRechargeRequests(page, limit, filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export const useRechargeRequest = (id: string) => {
  return useQuery({
    queryKey: ['recharge-request', id],
    queryFn: () => rechargeRequestsService.getRechargeRequest(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export const useCreateRechargeRequest = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data: CreateRechargeRequestRequest) => 
      rechargeRequestsService.createRechargeRequest(data),
    onSuccess: (data) => {
      toast.success('Demande de rechargement créée avec succès')
      // Invalider et refetch les listes
      queryClient.invalidateQueries({ queryKey: ['recharge-requests'] })
      queryClient.invalidateQueries({ queryKey: ['recharge-requests-stats'] })
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Erreur lors de la création de la demande')
    }
  })
}

export const useUpdateRechargeRequest = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data: UpdateRechargeRequestRequest) => 
      rechargeRequestsService.updateRechargeRequest(data),
    onSuccess: (data, variables) => {
      toast.success('Demande de rechargement mise à jour avec succès')
      // Invalider et refetch les listes
      queryClient.invalidateQueries({ queryKey: ['recharge-requests'] })
      queryClient.invalidateQueries({ queryKey: ['recharge-request', variables.id.toString()] })
      queryClient.invalidateQueries({ queryKey: ['recharge-requests-stats'] })
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Erreur lors de la mise à jour de la demande')
    }
  })
}

export const useDeleteRechargeRequest = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id: string) => rechargeRequestsService.deleteRechargeRequest(id),
    onSuccess: () => {
      toast.success('Demande de rechargement supprimée avec succès')
      // Invalider et refetch les listes
      queryClient.invalidateQueries({ queryKey: ['recharge-requests'] })
      queryClient.invalidateQueries({ queryKey: ['recharge-requests-stats'] })
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Erreur lors de la suppression de la demande')
    }
  })
}

export const useChangeRechargeRequestStatus = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: "pending" | "approved" | "rejected" | "completed" }) => 
      rechargeRequestsService.changeStatus(id, status),
    onSuccess: (data, variables) => {
      const statusLabels = {
        pending: 'En attente',
        approved: 'Approuvé',
        rejected: 'Rejeté',
        completed: 'Terminé'
      }
      toast.success(`Demande ${statusLabels[variables.status].toLowerCase()} avec succès`)
      // Invalider et refetch les listes
      queryClient.invalidateQueries({ queryKey: ['recharge-requests'] })
      queryClient.invalidateQueries({ queryKey: ['recharge-request', variables.id] })
      queryClient.invalidateQueries({ queryKey: ['recharge-requests-stats'] })
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Erreur lors du changement de statut')
    }
  })
}

export const useApproveRechargeRequest = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, notes }: { id: string; notes?: string }) => 
      rechargeRequestsService.approveRechargeRequest(id, { notes }),
    onSuccess: (data, variables) => {
      toast.success('Demande de rechargement approuvée avec succès')
      // Invalider et refetch les listes
      queryClient.invalidateQueries({ queryKey: ['recharge-requests'] })
      queryClient.invalidateQueries({ queryKey: ['recharge-request', variables.id] })
      queryClient.invalidateQueries({ queryKey: ['recharge-requests-stats'] })
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Erreur lors de l\'approbation de la demande')
    }
  })
}

export const useRejectRechargeRequest = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, rejectionReason, notes }: { id: string; rejectionReason: string; notes?: string }) => 
      rechargeRequestsService.rejectRechargeRequest(id, { rejectionReason, notes }),
    onSuccess: (data, variables) => {
      toast.success('Demande de rechargement rejetée avec succès')
      // Invalider et refetch les listes
      queryClient.invalidateQueries({ queryKey: ['recharge-requests'] })
      queryClient.invalidateQueries({ queryKey: ['recharge-request', variables.id] })
      queryClient.invalidateQueries({ queryKey: ['recharge-requests-stats'] })
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Erreur lors du rejet de la demande')
    }
  })
}

export const useExportRechargeRequests = () => {
  return useMutation({
    mutationFn: (format: 'csv' | 'excel' = 'csv') => 
      rechargeRequestsService.exportRechargeRequests(format),
    onSuccess: (data, variables) => {
      toast.success('Export réalisé avec succès')
      // Créer un lien de téléchargement
      const url = window.URL.createObjectURL(data)
      const link = document.createElement('a')
      link.href = url
      link.download = `demandes_rechargement.${variables}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Erreur lors de l\'export')
    }
  })
}

export const useRechargeRequestsStats = () => {
  return useQuery({
    queryKey: ['recharge-requests-stats'],
    queryFn: () => rechargeRequestsService.getRechargeRequestsStats(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// export const useRechargeRequestsOverview = () => {
//   return useQuery({
//     queryKey: ['recharge-requests-overview'],
//     queryFn: () => rechargeRequestsService.getRechargeRequestsOverview(),
//     staleTime: 5 * 60 * 1000, // 5 minutes
//   })
// } 