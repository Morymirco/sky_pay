import { apiClient } from '../utils/api'

export interface Report {
  id: string
  date: string
  reference: string
  initiator: string
  verifier?: string
  validator?: string
  amount: number
  beneficiaryCount: number
  status: "initiated" | "verified" | "validated" | "completed" | "cancelled"
  provider: "Kulu" | "Soutra Money" | "Orange Money"
  description?: string
}

export interface ReportFilter {
  dateFrom?: string
  dateTo?: string
  initiator?: string
  verifier?: string
  validator?: string
  status?: string
  provider?: string
}

export interface ReportStats {
  totalReports: number
  totalAmount: number
  totalBeneficiaries: number
  statusCounts: {
    initiated: number
    verified: number
    validated: number
    completed: number
    cancelled: number
  }
  providerCounts: {
    kulu: number
    soutraMoney: number
    orangeMoney: number
  }
  monthlyStats: {
    month: string
    amount: number
    count: number
  }[]
}

export interface ReportsResponse {
  success: boolean
  message: string
  data: Report[]
  total: number
  page: number
  limit: number
}

export interface ReportResponse {
  success: boolean
  message: string
  data: Report
}

export interface GenerateReportRequest {
  type: 'payment' | 'member' | 'recharge' | 'user'
  filters: ReportFilter
  format: 'pdf' | 'xlsx' | 'csv'
  includeCharts?: boolean
}

class ReportsService {
  // Récupérer tous les rapports avec pagination et filtres
  async getReports(page = 1, limit = 10, filters?: ReportFilter): Promise<ReportsResponse> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(filters && Object.entries(filters).reduce((acc, [key, value]) => {
          if (value !== undefined && value !== null) {
            acc[key] = value.toString()
          }
          return acc
        }, {} as Record<string, string>))
      })
      
      const response = await apiClient.get(`/api/reports?${params}`)
      console.log('📊 Reports fetched:', response.data)
      return response.data
    } catch (error) {
      console.error('❌ Error fetching reports:', error)
      throw error
    }
  }

  // Récupérer un rapport par ID
  async getReport(id: string): Promise<ReportResponse> {
    try {
      const response = await apiClient.get(`/api/reports/${id}`)
      console.log('📊 Report fetched:', response.data)
      return response.data
    } catch (error) {
      console.error('❌ Error fetching report:', error)
      throw error
    }
  }

  // Générer un nouveau rapport
  async generateReport(data: GenerateReportRequest): Promise<{ success: boolean; message: string; reportId: string; downloadUrl?: string }> {
    try {
      const response = await apiClient.post('/api/reports/generate', data)
      console.log('✅ Report generated:', response.data)
      return response.data
    } catch (error) {
      console.error('❌ Error generating report:', error)
      throw error
    }
  }

  // Récupérer les statistiques des rapports
  async getReportStats(filters?: ReportFilter): Promise<{ success: boolean; data: ReportStats }> {
    try {
      const params = new URLSearchParams()
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            params.append(key, value.toString())
          }
        })
      }
      
      const response = await apiClient.get(`/api/reports/stats?${params}`)
      console.log('📊 Report stats:', response.data)
      return response.data
    } catch (error) {
      console.error('❌ Error fetching report stats:', error)
      throw error
    }
  }

  // Récupérer les rapports de paiements
  async getPaymentReports(page = 1, limit = 10, filters?: ReportFilter): Promise<ReportsResponse> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(filters && Object.entries(filters).reduce((acc, [key, value]) => {
          if (value !== undefined && value !== null) {
            acc[key] = value.toString()
          }
          return acc
        }, {} as Record<string, string>))
      })
      
      const response = await apiClient.get(`/api/reports/payments?${params}`)
      console.log('💰 Payment reports fetched:', response.data)
      return response.data
    } catch (error) {
      console.error('❌ Error fetching payment reports:', error)
      throw error
    }
  }

  // Récupérer les rapports de membres
  async getMemberReports(page = 1, limit = 10, filters?: ReportFilter): Promise<ReportsResponse> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(filters && Object.entries(filters).reduce((acc, [key, value]) => {
          if (value !== undefined && value !== null) {
            acc[key] = value.toString()
          }
          return acc
        }, {} as Record<string, string>))
      })
      
      const response = await apiClient.get(`/api/reports/members?${params}`)
      console.log('👥 Member reports fetched:', response.data)
      return response.data
    } catch (error) {
      console.error('❌ Error fetching member reports:', error)
      throw error
    }
  }

  // Récupérer les rapports de recharge
  async getRechargeReports(page = 1, limit = 10, filters?: ReportFilter): Promise<ReportsResponse> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(filters && Object.entries(filters).reduce((acc, [key, value]) => {
          if (value !== undefined && value !== null) {
            acc[key] = value.toString()
          }
          return acc
        }, {} as Record<string, string>))
      })
      
      const response = await apiClient.get(`/api/reports/recharge?${params}`)
      console.log('🔋 Recharge reports fetched:', response.data)
      return response.data
    } catch (error) {
      console.error('❌ Error fetching recharge reports:', error)
      throw error
    }
  }

  // Exporter un rapport
  async exportReport(reportId: string, format: 'pdf' | 'xlsx' | 'csv' = 'pdf'): Promise<Blob> {
    try {
      const response = await apiClient.get(`/api/reports/${reportId}/export?format=${format}`, {
        responseType: 'blob'
      })
      console.log('✅ Report exported:', response.data)
      return response.data
    } catch (error) {
      console.error('❌ Error exporting report:', error)
      throw error
    }
  }

  // Télécharger un rapport généré
  async downloadReport(reportId: string): Promise<Blob> {
    try {
      const response = await apiClient.get(`/api/reports/${reportId}/download`, {
        responseType: 'blob'
      })
      console.log('✅ Report downloaded:', response.data)
      return response.data
    } catch (error) {
      console.error('❌ Error downloading report:', error)
      throw error
    }
  }

  // Supprimer un rapport
  async deleteReport(reportId: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await apiClient.delete(`/api/reports/${reportId}`)
      console.log('✅ Report deleted:', response.data)
      return response.data
    } catch (error) {
      console.error('❌ Error deleting report:', error)
      throw error
    }
  }

  // Récupérer les modèles de rapports disponibles
  async getReportTemplates(): Promise<{ success: boolean; data: { id: string; name: string; description: string; type: string }[] }> {
    try {
      const response = await apiClient.get('/api/reports/templates')
      console.log('📋 Report templates:', response.data)
      return response.data
    } catch (error) {
      console.error('❌ Error fetching report templates:', error)
      throw error
    }
  }
}

export const reportsService = new ReportsService() 