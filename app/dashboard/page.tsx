"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Building, Wallet, Users, FileText, CheckCircle, CheckSquare } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuthStore } from "@/lib/stores/authStore"

export default function Dashboard() {
  const { isAuthenticated, user } = useAuthStore()
  const router = useRouter()

  // Vérification d'authentification avec le nouveau système
  useEffect(() => {
    console.log('🔍 Dashboard auth check:', { isAuthenticated, user: user?.email })
    
    if (!isAuthenticated) {
      console.log('❌ Not authenticated, redirecting to login')
      router.push("/login")
    }
  }, [isAuthenticated, router])

  // Si pas authentifié, ne rien afficher (redirection en cours)
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
        {/* Company Info */}
        <Card className="border-blue-500/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="w-5 h-5 text-blue-500" />
              SKY PAY ENTERPRISE
            </CardTitle>
            <CardDescription>
              Plateforme de paiement sécurisée pour la gestion des bénéficiaires
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Adresse:</p>
                <p>123 Avenue des Technologies, Dakar, Sénégal</p>
              </div>
              <div>
                <p className="text-muted-foreground">Téléphone:</p>
                <p>+221 33 123 45 67</p>
              </div>
              <div>
                <p className="text-muted-foreground">Email:</p>
                <p>contact@skypay.sn</p>
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
              <div className="text-2xl font-bold text-green-500">2,450,000 €</div>
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