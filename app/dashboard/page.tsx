"use client"

import { DashboardSkeleton } from "@/components/dashboard-skeleton"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useRequireAuth } from "@/lib/hooks/useRequireAuth"
// import { useDashboard } from "@/lib/hooks/useDashboard" // DÉSACTIVÉ TEMPORAIREMENT
import { authService } from "@/lib/services/auth"
import { useAuthStore } from "@/lib/stores/authStore"
import { Building, CheckCircle, CheckSquare, FileText, Users, Wallet } from "lucide-react"
import { useEffect, useState } from "react"

interface CompanyData {
  id: number
  name: string
  address: string
  phone: string
  email: string
  logo: string
  is_active: boolean
  solde: number
  createdAt: string
  updatedAt: string
}

interface UserData {
  id: number
  email: string
  role: string
  companyId: number
  is_active: boolean
  is_first_login: boolean
  first_name: string
  last_name: string
}

interface ApiResponse {
  success: boolean
  message: string
  user: UserData
  company: CompanyData
}

// Données mockées pour le dashboard (DÉSACTIVÉ TEMPORAIREMENT)
const mockDashboardData = {
  beneficiaries: 1247,
  bulkPayments: {
    initiated: 15,
    validated: 89,
    total: 104
  },
  recentActivities: [
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

export default function Dashboard() {
  const { isAuthenticated, user, isLoading } = useRequireAuth()
  const [apiData, setApiData] = useState<ApiResponse | null>(null)
  const [isLoadingData, setIsLoadingData] = useState(false)

  // DÉSACTIVÉ TEMPORAIREMENT - Utiliser des données mockées
  // const { data: dashboardData, isLoading: isDashboardLoading } = useDashboard()
  const dashboardData = mockDashboardData
  const isDashboardLoading = false

  useEffect(() => {
    let retryCount = 0
    const maxRetries = 2

    const fetchUserData = async () => {
      try {
        setIsLoadingData(true)
        console.log('🔍 Fetching current user data... (attempt', retryCount + 1, ')')
        
        const { token } = useAuthStore.getState()
        console.log('🔍 Token state before request:', {
          hasToken: !!token,
          tokenLength: token ? token.length : 0,
          tokenPreview: token ? `${token.substring(0, 20)}...` : 'none'
        })
        
        if (typeof window !== 'undefined') {
          const persistedState = JSON.parse(localStorage.getItem('auth-storage') || '{}')
          const persistedToken = persistedState.state?.token
          console.log('🔍 localStorage token state:', {
            hasPersistedToken: !!persistedToken,
            persistedTokenLength: persistedToken ? persistedToken.length : 0,
            tokensMatch: token === persistedToken
          })
        }
        
        const response = await authService.getCurrentUser()
        console.log('✅ Current user data:', response)
        // DÉSACTIVÉ TEMPORAIREMENT - Adapter la réponse pour éviter les erreurs de type
        const adaptedResponse: ApiResponse = {
          success: response.success,
          message: response.message,
          user: {
            id: response.user.id,
            email: response.user.email,
            role: response.role?.name || 'user', // Adapter le rôle
            companyId: response.user.companyId,
            is_active: response.user.is_active,
            is_first_login: response.user.is_first_login,
            first_name: response.user.first_name,
            last_name: response.user.last_name
          },
          company: response.company
        }
        setApiData(adaptedResponse)
      } catch (error: any) {
        console.error('❌ Error fetching user data:', error)
        
        if (error?.response?.status === 401 && retryCount < maxRetries) {
          retryCount++
          console.log('🔄 Retrying user data fetch... (attempt', retryCount + 1, ')')
          
          setTimeout(() => {
            fetchUserData()
          }, 1500 * retryCount)
          return
        }
        
        if (error?.response?.status === 401) {
          console.log('⚠️ 401 error after retries - logout will be handled by API interceptor')
        }
      } finally {
        setIsLoadingData(false)
      }
    }

    if (isAuthenticated && user && !isLoading) {
      setTimeout(() => {
        fetchUserData()
      }, 500)
    }
  }, [isAuthenticated, user, isLoading])
  
  if (isLoading || isLoadingData || isDashboardLoading) {
    return <DashboardSkeleton />
  }

  return (
    <div className="p-6 space-y-6">
        <Card className="border-blue-500/20">
          <CardHeader>
          <div className="flex items-center gap-4">
            {apiData?.company?.logo ? (
              <div className="flex-shrink-0">
                <img 
                  src={apiData.company.logo} 
                  alt={`Logo ${apiData.company.name}`}
                  className="w-16 h-16 object-contain rounded-lg border border-border bg-white p-2"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.style.display = 'none'
                  }}
                />
              </div>
            ) : (
              <div className="w-16 h-16 bg-blue-500/10 rounded-lg border border-blue-500/20 flex items-center justify-center">
                <Building className="w-8 h-8 text-blue-500" />
              </div>
            )}
            
            <div className="flex-1">
            <CardTitle className="flex items-center gap-2">
              <Building className="w-5 h-5 text-blue-500" />
              {apiData?.company?.name || "SKY PAY ENTERPRISE"}
            </CardTitle>
            <CardDescription>
              Plateforme de paiement sécurisée pour la gestion des bénéficiaires
            </CardDescription>
            </div>
          </div>
          </CardHeader>
          <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Adresse:</p>
                <p>{apiData?.company?.address || "123 Avenue des Technologies, Dakar, Sénégal"}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Téléphone:</p>
                <p>{apiData?.company?.phone || "+221 33 123 45 67"}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Email:</p>
                <p>{apiData?.company?.email || "contact@skypay.sn"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-green-500/20">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Wallet className="w-5 h-5 text-green-500" />
                Solde
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">
              {apiData?.company.solde || 0} GNF
              </div>
              <p className="text-sm text-muted-foreground mt-1">Disponible</p>
            </CardContent>
          </Card>

          <Card className="border-blue-500/20">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Users className="w-5 h-5 text-blue-500" />
                Bénéficiaires
              </CardTitle>
            </CardHeader>
            <CardContent>
            <div className="text-2xl font-bold text-blue-500">
              {dashboardData?.beneficiaries || 0}
            </div>
              <p className="text-sm text-muted-foreground mt-1">Actifs</p>
            </CardContent>
          </Card>

          <Card className="border-orange-500/20">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <FileText className="w-5 h-5 text-orange-500" />
                Paiements Initiés
              </CardTitle>
            </CardHeader>
            <CardContent>
            <div className="text-2xl font-bold text-orange-500">
              {dashboardData?.bulkPayments.initiated || 0}
            </div>
              <p className="text-sm text-muted-foreground mt-1">En attente</p>
            </CardContent>
          </Card>

          <Card className="border-purple-500/20">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <CheckCircle className="w-5 h-5 text-purple-500" />
                Paiements Validés
              </CardTitle>
            </CardHeader>
            <CardContent>
            <div className="text-2xl font-bold text-purple-500">
              {dashboardData?.bulkPayments.validated || 0}
            </div>
              <p className="text-sm text-muted-foreground mt-1">Confirmés</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-blue-500" />
              Activité Récente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
            {dashboardData?.recentActivities?.length > 0 ? (
              dashboardData.recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-3 bg-muted rounded">
                <div className="flex items-center gap-3">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        activity.type === 'payment'
                          ? activity.action.includes('validé')
                            ? 'bg-green-500'
                            : 'bg-orange-500'
                          : activity.type === 'member'
                          ? 'bg-blue-500'
                          : 'bg-gray-500'
                      }`}
                    ></div>
                    <span className="text-sm">{activity.description}</span>
                </div>
                  <Badge variant="secondary">
                    {new Date(activity.timestamp).toLocaleTimeString()}
                  </Badge>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">Aucune activité récente</p>
            )}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  } 