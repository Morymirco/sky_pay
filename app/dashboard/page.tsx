"use client"

import { DashboardSkeleton } from "@/components/dashboard-skeleton"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useRequireAuth } from "@/lib/hooks/useRequireAuth"
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

export default function Dashboard() {
  const { isAuthenticated, user, isLoading } = useRequireAuth()
  const [apiData, setApiData] = useState<ApiResponse | null>(null)
  const [isLoadingData, setIsLoadingData] = useState(false)

  // Le hook useRequireAuth gère automatiquement la redirection si pas authentifié
  // et affiche un loading pendant la vérification
  
  // Appel API pour récupérer les données utilisateur
  useEffect(() => {
    let retryCount = 0
    const maxRetries = 2

    const fetchUserData = async () => {
      try {
        setIsLoadingData(true)
        console.log('🔍 Fetching current user data... (attempt', retryCount + 1, ')')
        
        // Debug: Vérifier l'état du token avant la requête
        const { token } = useAuthStore.getState()
        console.log('🔍 Token state before request:', {
          hasToken: !!token,
          tokenLength: token ? token.length : 0,
          tokenPreview: token ? `${token.substring(0, 20)}...` : 'none'
        })
        
        // Debug: Vérifier localStorage
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
        setApiData(response)
      } catch (error: any) {
        console.error('❌ Error fetching user data:', error)
        
        // Si c'est une erreur 401 et qu'on n'a pas dépassé le nombre de tentatives
        if (error?.response?.status === 401 && retryCount < maxRetries) {
          retryCount++
          console.log('🔄 Retrying user data fetch... (attempt', retryCount + 1, ')')
          
          // Attendre un peu plus longtemps avant de réessayer pour laisser le temps au token d'être mis à jour
          setTimeout(() => {
            fetchUserData()
          }, 1500 * retryCount)
          return
        }
        
        // Si c'est une erreur 401 et qu'on a dépassé les tentatives
        if (error?.response?.status === 401) {
          console.log('⚠️ 401 error after retries - logout will be handled by API interceptor')
          // La déconnexion sera gérée par l'intercepteur API si nécessaire
        }
      } finally {
        setIsLoadingData(false)
      }
    }

    // Appeler l'API seulement si l'utilisateur est authentifié et pas en cours de chargement
    if (isAuthenticated && user && !isLoading) {
      // Délai pour s'assurer que la rotation des tokens est terminée
      setTimeout(() => {
        fetchUserData()
      }, 500)
    }
  }, [isAuthenticated, user, isLoading])
  
  // Afficher le skeleton pendant le chargement
  if (isLoading || isLoadingData) {
    return <DashboardSkeleton />
  }

  return (
    <div className="p-6 space-y-6">
        {/* Company Info */}
        <Card className="border-blue-500/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="w-5 h-5 text-blue-500" />
              {apiData?.company?.name || "SKY PAY ENTERPRISE"}
            </CardTitle>
            <CardDescription>
              Plateforme de paiement sécurisée pour la gestion des bénéficiaires
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
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
              <div>
                <p className="text-muted-foreground">Site Web:</p>
                <p>www.skypay.sn</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Solde */}
          <Card className="border-green-500/20">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Wallet className="w-5 h-5 text-green-500" />
                Solde
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">
                {apiData?.company?.solde ? `${apiData.company.solde.toLocaleString()} €` : "2,450,000 €"}
              </div>
              <p className="text-sm text-muted-foreground mt-1">Disponible</p>
            </CardContent>
          </Card>

          {/* Nombre de bénéficiaires */}
          <Card className="border-blue-500/20">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Users className="w-5 h-5 text-blue-500" />
                Bénéficiaires
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-500">1,247</div>
              <p className="text-sm text-muted-foreground mt-1">Actifs</p>
            </CardContent>
          </Card>

          {/* Nombre de paiements initiés */}
          <Card className="border-orange-500/20">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <FileText className="w-5 h-5 text-orange-500" />
                Paiements Initiés
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-500">156</div>
              <p className="text-sm text-muted-foreground mt-1">En attente</p>
            </CardContent>
          </Card>

          {/* Nombre de paiements validés */}
          <Card className="border-purple-500/20">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <CheckCircle className="w-5 h-5 text-purple-500" />
                Paiements Validés
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-500">89</div>
              <p className="text-sm text-muted-foreground mt-1">Confirmés</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-blue-500" />
              Activité Récente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-muted rounded">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Paiement validé - ID: #PAY-2024-001</span>
                </div>
                <Badge variant="secondary">2 min</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted rounded">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm">Nouveau bénéficiaire ajouté</span>
                </div>
                <Badge variant="secondary">15 min</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted rounded">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span className="text-sm">Paiement initié - 50 bénéficiaires</span>
                </div>
                <Badge variant="secondary">1h</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  } 