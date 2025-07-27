import { apiClient } from '../utils/api'

export interface RechargeRequest {
  id: number
  amount: number
  reason: string
  status: "pending" | "approved" | "rejected" | "completed"
  paymentMethod: string
  paymentReference: string
  attachmentUrl?: string
  notes?: string
  isUrgent: boolean
  priority: "low" | "medium" | "high"
  processedBy?: number
  processedAt?: string
  rejectionReason?: string
  companyId: number
  requestedById: number
  createdAt: string
  updatedAt: string
}

export interface CreateRechargeRequestRequest {
  amount: number
  reason: string
  paymentMethod: string
  paymentReference: string
  attachmentUrl?: string
  notes?: string
  isUrgent: boolean
  priority: "low" | "medium" | "high"
}

export interface UpdateRechargeRequestRequest {
  id: number
  amount?: number
  reason?: string
  paymentMethod?: string
  paymentReference?: string
  attachmentUrl?: string
  notes?: string
  status?: "pending" | "approved" | "rejected" | "completed"
  isUrgent?: boolean
  priority?: "low" | "medium" | "high"
  rejectionReason?: string
}

export interface ApproveRechargeRequestRequest {
  notes?: string
}

export interface RejectRechargeRequestRequest {
  rejectionReason: string
  notes?: string
}

export interface RechargeRequestsResponse {
  success: boolean
  message: string
  data: {
    requests: RechargeRequest[]
    pagination: {
      currentPage: number
      totalPages: number
      totalItems: number
      itemsPerPage: number
      hasNextPage: boolean
      hasPrevPage: boolean
      nextPage: number | null
      prevPage: number | null
    }
    filters: {
      status: string
      priority: string
      isUrgent: boolean
      startDate: string
      endDate: string
    }
  }
}

export interface RechargeRequestResponse {
  success: boolean
  message: string
  data: RechargeRequest
  newToken?: string
}

export interface RechargeRequestStats {
  total: number
  pending: number
  approved: number
  rejected: number
  completed: number
  urgent: number
  totalAmount: number
}

// export interface RechargeRequestOverviewStats {
//   overview: {
//     total: number
//     pending: number
//     approved: number
//     rejected: number
//     cancelled: number
//   }
//   amounts: {
//     totalApproved: number
//     totalPending: number
//   }
//   urgent: {
//     count: number
//   }
// }

// export interface RechargeRequestOverviewResponse {
//   success: boolean
//   message: string
//   data: RechargeRequestOverviewStats
//   newToken?: string
// }

export interface RechargeRequestStatsResponse {
  success: boolean
  data: RechargeRequestStats
  newToken?: string
}

export interface DeleteRechargeRequestResponse {
  success: boolean
  message: string
  newToken?: string
}

export const rechargeRequestsService = {
  // Récupérer toutes les demandes de rechargement
  getRechargeRequests: async (
    page: number = 1,
    limit: number = 20,
    filters: string = "{}"
  ): Promise<RechargeRequestsResponse> => {
    const response = await apiClient.get(`/api/recharge-requests`, {
      params: {
        page,
        limit,
        filters
      }
    })
    return response.data
  },

  // Récupérer une demande de rechargement par ID
  getRechargeRequest: async (id: string): Promise<{ success: boolean; data: RechargeRequest }> => {
    const response = await apiClient.get(`/api/recharge-requests/${id}`)
    return response.data
  },

  // Créer une nouvelle demande de rechargement
  createRechargeRequest: async (data: CreateRechargeRequestRequest): Promise<{ success: boolean; data: RechargeRequest }> => {
    const response = await apiClient.post('/api/recharge-requests', data)
    return response.data
  },

  // Mettre à jour une demande de rechargement
  updateRechargeRequest: async (data: UpdateRechargeRequestRequest): Promise<{ success: boolean; data: RechargeRequest }> => {
    const response = await apiClient.put(`/api/recharge-requests/${data.id}`, data)
    return response.data
  },

  // Supprimer une demande de rechargement
  deleteRechargeRequest: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.delete(`/api/recharge-requests/${id}`)
    return response.data
  },

  // Changer le statut d'une demande de rechargement
  changeStatus: async (id: string, status: RechargeRequest['status']): Promise<{ success: boolean; data: RechargeRequest }> => {
    const response = await apiClient.patch(`/api/recharge-requests/${id}/status`, { status })
    return response.data
  },

  // Approuver une demande de rechargement
  approveRechargeRequest: async (id: string, data: ApproveRechargeRequestRequest): Promise<{ success: boolean; data: RechargeRequest }> => {
    const response = await apiClient.post(`/api/recharge-requests/${id}/approve`, data)
    return response.data
  },

  // Rejeter une demande de rechargement
  rejectRechargeRequest: async (id: string, data: RejectRechargeRequestRequest): Promise<{ success: boolean; data: RechargeRequest }> => {
    const response = await apiClient.post(`/api/recharge-requests/${id}/reject`, data)
    return response.data
  },

  // Exporter les demandes de rechargement
  exportRechargeRequests: async (format: 'csv' | 'excel' = 'csv'): Promise<Blob> => {
    const response = await apiClient.get(`/api/recharge-requests/export`, {
      params: { format },
      responseType: 'blob'
    })
    return response.data
  },

  // Récupérer les statistiques des demandes de rechargement
  getRechargeRequestsStats: async (): Promise<{
    success: boolean
    data: {
      totalRequests: number
      pendingRequests: number
      approvedRequests: number
      rejectedRequests: number
      completedRequests: number
      urgentRequests: number
      totalAmount: number
    }
  }> => {
    const response = await apiClient.get('/api/recharge-requests/stats')
    return response.data
  },

  // Récupérer les statistiques détaillées des demandes de rechargement
  // getRechargeRequestsOverview: async (): Promise<RechargeRequestOverviewResponse> => {
  //   const response = await apiClient.get('/api/recharge-requests/stats/overview')
  //   return response.data
  // }
} 