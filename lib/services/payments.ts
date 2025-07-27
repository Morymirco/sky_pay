import { apiClient } from '../utils/api'

export interface Payment {
  id: string
  reference: string
  memberId: string
  memberName: string
  provider: "Kulu" | "Soutra Money" | "Orange Money"
  accountNumber: string
  amount: number
  status: "pending" | "initiated" | "verified" | "validated" | "completed" | "failed" | "cancelled"
  createdAt: string
  updatedAt?: string
  initiatedBy?: string
  verifiedBy?: string
  validatedBy?: string
  description?: string
}

export interface BulkPayment {
  id: string
  reference: string
  totalAmount: number
  beneficiaryCount: number
  status: "pending" | "initiated" | "verified" | "validated" | "completed" | "failed" | "cancelled"
  createdAt: string
  updatedAt?: string
  initiatedBy?: string
  verifiedBy?: string
  validatedBy?: string
  description?: string
  payments: Payment[]
}

export interface CreatePaymentRequest {
  memberId: string
  amount: number
  description?: string
}

export interface CreateBulkPaymentRequest {
  payments: CreatePaymentRequest[]
  description?: string
}

export interface PaymentHistory {
  id: string
  reference: string
  memberName: string
  provider: "Kulu" | "Soutra Money" | "Orange Money"
  accountNumber: string
  amount: number
  status: "completed" | "failed" | "pending"
  date: string
  confirmedBy: string
}

export interface PaymentStats {
  total: number
  completed: number
  failed: number
  pending: number
  totalAmount: number
}

export interface PaymentsResponse {
  success: boolean
  message: string
  data: Payment[]
  total: number
  page: number
  limit: number
  newToken?: string
}

export interface PaymentResponse {
  success: boolean
  message: string
  data: Payment
  newToken?: string
}

export interface BulkPaymentsResponse {
  success: boolean
  message: string
  data: BulkPayment[]
  total: number
  page: number
  limit: number
  newToken?: string
}

export interface BulkPaymentResponse {
  success: boolean
  message: string
  data: BulkPayment
  newToken?: string
}

export interface PaymentHistoryResponse {
  success: boolean
  message: string
  data: PaymentHistory[]
  total: number
  page: number
  limit: number
  newToken?: string
}

export interface PaymentStatsResponse {
  success: boolean
  data: PaymentStats
  newToken?: string
}

export interface BulkPaymentStatsResponse {
  success: boolean
  data: { initiated: number; validated: number; total: number }
  newToken?: string
}

class PaymentsService {
  // Récupérer tous les paiements avec pagination
  async getPayments(page = 1, limit = 10, status?: string): Promise<PaymentsResponse> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(status && { status })
      })
      
      const response = await apiClient.get(`/api/payments?${params}`)
      console.log('💰 Payments fetched:', response.data)
      return response.data
    } catch (error) {
      console.error('❌ Error fetching payments:', error)
      throw error
    }
  }

  // Récupérer un paiement par ID
  async getPayment(id: string): Promise<PaymentResponse> {
    try {
      const response = await apiClient.get(`/api/payments/${id}`)
      console.log('💰 Payment fetched:', response.data)
      return response.data
    } catch (error) {
      console.error('❌ Error fetching payment:', error)
      throw error
    }
  }

  // Créer un nouveau paiement
  async createPayment(data: CreatePaymentRequest): Promise<PaymentResponse> {
    try {
      const response = await apiClient.post('/api/payments', data)
      console.log('✅ Payment created:', response.data)
      return response.data
    } catch (error) {
      console.error('❌ Error creating payment:', error)
      throw error
    }
  }

  // Créer un paiement en lot
  async createBulkPayment(data: CreateBulkPaymentRequest): Promise<BulkPaymentResponse> {
    try {
      const response = await apiClient.post('/api/bulk-payments', data)
      console.log('✅ Bulk payment created:', response.data)
      return response.data
    } catch (error) {
      console.error('❌ Error creating bulk payment:', error)
      throw error
    }
  }

  // Récupérer les paiements en lot
  async getBulkPayments(page = 1, limit = 10, status?: string): Promise<BulkPaymentsResponse> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(status && { status })
      })
      
      const response = await apiClient.get(`/api/bulk-payments?${params}`)
      console.log('💰 Bulk payments fetched:', response.data)
      return response.data
    } catch (error) {
      console.error('❌ Error fetching bulk payments:', error)
      throw error
    }
  }

  // Récupérer un paiement en lot par ID
  async getBulkPayment(id: string): Promise<BulkPaymentResponse> {
    try {
      const response = await apiClient.get(`/api/bulk-payments/${id}`)
      console.log('💰 Bulk payment fetched:', response.data)
      return response.data
    } catch (error) {
      console.error('❌ Error fetching bulk payment:', error)
      throw error
    }
  }

  // Vérifier un paiement en lot
  async verifyBulkPayment(id: string): Promise<BulkPaymentResponse> {
    try {
      const response = await apiClient.post(`/api/bulk-payments/${id}/verify`)
      console.log('✅ Bulk payment verified:', response.data)
      return response.data
    } catch (error) {
      console.error('❌ Error verifying bulk payment:', error)
      throw error
    }
  }

  // Valider un paiement en lot
  async validateBulkPayment(id: string): Promise<BulkPaymentResponse> {
    try {
      const response = await apiClient.post(`/api/bulk-payments/${id}/validate`)
      console.log('✅ Bulk payment validated:', response.data)
      return response.data
    } catch (error) {
      console.error('❌ Error validating bulk payment:', error)
      throw error
    }
  }

  // Récupérer l'historique des paiements
  async getPaymentHistory(page = 1, limit = 10, month?: number, year?: number): Promise<PaymentHistoryResponse> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(month !== undefined && { month: month.toString() }),
        ...(year !== undefined && { year: year.toString() })
      })
      
      const response = await apiClient.get(`/api/payments/history?${params}`)
      console.log('📋 Payment history fetched:', response.data)
      return response.data
    } catch (error) {
      console.error('❌ Error fetching payment history:', error)
      throw error
    }
  }

  // Récupérer les statistiques des paiements
  async getPaymentStats(): Promise<PaymentStatsResponse> {
    try {
      const response = await apiClient.get('/api/payments/stats')
      console.log('📊 Payment stats:', response.data)
      return response.data
    } catch (error) {
      console.error('❌ Error fetching payment stats:', error)
      throw error
    }
  }

  // Récupérer les statistiques des paiements en lot
  async getBulkPaymentStats(): Promise<BulkPaymentStatsResponse> {
    try {
      const response = await apiClient.get('/api/bulk-paiement/number')
      console.log('📊 Bulk payment stats:', response.data)
      return response.data
    } catch (error) {
      console.error('❌ Error fetching bulk payment stats:', error)
      throw error
    }
  }

  // Exporter les paiements
  async exportPayments(format: 'csv' | 'xlsx' = 'csv', filters?: any): Promise<Blob> {
    try {
      const params = new URLSearchParams({
        format,
        ...(filters && Object.entries(filters).reduce((acc, [key, value]) => {
          if (value !== undefined && value !== null) {
            acc[key] = value.toString()
          }
          return acc
        }, {} as Record<string, string>))
      })
      
      const response = await apiClient.get(`/api/payments/export?${params}`, {
        responseType: 'blob'
      })
      console.log('✅ Payments exported:', response.data)
      return response.data
    } catch (error) {
      console.error('❌ Error exporting payments:', error)
      throw error
    }
  }
}

export const paymentsService = new PaymentsService() 