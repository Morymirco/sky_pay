import { apiClient } from '../utils/api'

export interface BulkPaymentStats {
  initiated: number
  validated: number
  total: number
}

export interface RecentActivity {
  id: string
  type: 'payment' | 'user' | 'member' | 'system'
  action: string
  description: string
  timestamp: string
  userId?: number
  userName?: string
  paymentId?: string
  amount?: number
}

export interface DashboardStats {
  bulkPayments: BulkPaymentStats
  recentActivities: RecentActivity[]
  beneficiaries: number
}

// Interfaces de réponse avec newToken
export interface BulkPaymentStatsResponse {
  success: boolean
  data: BulkPaymentStats
  newToken?: string
}

export interface RecentActivitiesResponse {
  success: boolean
  data: RecentActivity[]
  newToken?: string
}

export interface BeneficiariesCountResponse {
  success: boolean
  count: number
  newToken?: string
}

export interface DashboardStatsResponse {
  success: boolean
  data: DashboardStats
  newToken?: string
}

class DashboardService {
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

  // Récupérer les activités récentes - DÉSACTIVÉ TEMPORAIREMENT
  async getRecentActivities(): Promise<RecentActivitiesResponse> {
    try {
      // DÉSACTIVÉ - Retourner des données mockées
      console.log('📋 Recent activities - DISABLED, returning mock data')
      return {
        success: true,
        data: [
          {
            id: "1",
            type: "payment" as const,
            action: "Paiement validé",
            description: "Paiement validé - ID: #PAY-2024-001",
            timestamp: new Date().toISOString(),
            paymentId: "PAY-2024-001",
            amount: 150.00
          },
          {
            id: "2",
            type: "member" as const,
            action: "Nouveau bénéficiaire",
            description: "Nouveau bénéficiaire ajouté",
            timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // 15 min ago
            userId: 1,
            userName: "Admin"
          },
          {
            id: "3",
            type: "payment" as const,
            action: "Paiement initié",
            description: "Paiement initié - 50 bénéficiaires",
            timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(), // 1h ago
            paymentId: "PAY-2024-002",
            amount: 5000.00
          }
        ]
      }
      
      // CODE ORIGINAL COMMENTÉ
      // const response = await apiClient.get('/api/users/recent-activities')
      // console.log('📋 Recent activities:', response.data)
      // return response.data
    } catch (error) {
      console.error('❌ Error fetching recent activities:', error)
      throw error
    }
  }

  // Récupérer le nombre de bénéficiaires - DÉSACTIVÉ TEMPORAIREMENT
  async getBeneficiariesCount(): Promise<BeneficiariesCountResponse> {
    try {
      // DÉSACTIVÉ - Retourner des données mockées
      console.log('👥 Beneficiaries count - DISABLED, returning mock data')
      return {
        success: true,
        count: 1247
      }
      
      // CODE ORIGINAL COMMENTÉ
      // const response = await apiClient.get('/api/members/number')
      // console.log('👥 Beneficiaries count:', response.data)
      // return response.data
    } catch (error) {
      console.error('❌ Error fetching beneficiaries count:', error)
      throw error
    }
  }

  // Récupérer toutes les statistiques du tableau de bord
  // EXÉCUTION SÉQUENTIELLE pour assurer la propagation du newToken
  async getDashboardStats(): Promise<DashboardStatsResponse> {
    try {
      console.log('🔄 Starting sequential dashboard stats fetch...')
      
      // 1. D'abord récupérer les stats des paiements en lot (peut retourner un newToken)
      console.log('📊 Step 1: Fetching bulk payment stats...')
      const bulkPaymentsResponse = await this.getBulkPaymentStats()
      console.log('✅ Bulk payment stats received, newToken:', bulkPaymentsResponse.newToken ? 'present' : 'none')
      
      // 2. Ensuite récupérer les activités récentes (utilisera le newToken si disponible)
      console.log('📋 Step 2: Fetching recent activities (DISABLED)...')
      const recentActivitiesResponse = await this.getRecentActivities()
      console.log('✅ Recent activities received (mock), newToken:', recentActivitiesResponse.newToken ? 'present' : 'none')
      
      // 3. Enfin récupérer le nombre de bénéficiaires (utilisera le newToken si disponible)
      console.log('👥 Step 3: Fetching beneficiaries count (DISABLED)...')
      const beneficiariesResponse = await this.getBeneficiariesCount()
      console.log('✅ Beneficiaries count received (mock), newToken:', beneficiariesResponse.newToken ? 'present' : 'none')
      
      const dashboardStats: DashboardStats = {
        bulkPayments: bulkPaymentsResponse.data,
        recentActivities: recentActivitiesResponse.data,
        beneficiaries: beneficiariesResponse.count
      }
      
      console.log('📊 Dashboard stats compiled:', dashboardStats)
      
      // Retourner la réponse avec le newToken le plus récent
      const newToken = beneficiariesResponse.newToken || 
                      recentActivitiesResponse.newToken || 
                      bulkPaymentsResponse.newToken
      
      console.log('🔄 Dashboard stats fetch completed, final newToken:', newToken ? 'present' : 'none')
      
      return {
        success: true,
        data: dashboardStats,
        newToken
      }
    } catch (error) {
      console.error('❌ Error fetching dashboard stats:', error)
      throw error
    }
  }
}

export const dashboardService = new DashboardService()