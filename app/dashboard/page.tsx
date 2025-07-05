"use client"

import { useState } from "react"
import { ChevronRight, Users, CreditCard, History, Settings, LogOut, Bell, RefreshCw, ChevronDown, Play, CheckCircle, Shield, Home, Building, Wallet, UserCheck, FileText, CheckSquare, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import MembersPage from "./members/page"
import ImportMembersPage from "./members/import/page"
import InitiatePaymentPage from "./payments/initiate/page"
import VerifyPaymentPage from "./payments/verify/page"
import ValidatePaymentPage from "./payments/validate/page"
import HistoryPage from "./history/page"
import AccountPage from "./account/page"

export default function Dashboard() {
  const [activeSection, setActiveSection] = useState("home")
  const [paymentsSubmenu, setPaymentsSubmenu] = useState(false)
  const [membersSubmenu, setMembersSubmenu] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const handleLogout = () => {
    localStorage.removeItem("sky_pay_auth_token")
    window.location.href = "/"
  }

  // Simple auth check - redirect to login if not authenticated
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem("sky_pay_auth_token")
    if (!token && window.location.pathname !== "/login") {
      window.location.href = "/login"
      return null
    }
  }

  const menuItems = [
    { id: "home", icon: Home, label: "ACCUEIL" },
    { id: "members", icon: Users, label: "GESTION DES BÉNÉFICIAIRES" },
    { id: "history", icon: History, label: "HISTORIQUE" },
    { id: "account", icon: Settings, label: "GESTION DE COMPTE" },
  ]

  const paymentsSubItems = [
    { id: "initiate", icon: Play, label: "INITIER LE PAIEMENT" },
    { id: "verify", icon: CheckCircle, label: "VÉRIFIER LE PAIEMENT" },
    { id: "validate", icon: Shield, label: "VALIDER LE PAIEMENT" },
  ]

  const membersSubItems = [
    { id: "members-list", icon: Users, label: "LISTE DES BÉNÉFICIAIRES" },
    { id: "members-import", icon: Upload, label: "IMPORTER DES BÉNÉFICIAIRES" },
  ]

  const getSectionTitle = () => {
    switch (activeSection) {
      case "home": return "ACCUEIL"
      case "members": return "GESTION DES BÉNÉFICIAIRES"
      case "members-list": return "LISTE DES BÉNÉFICIAIRES"
      case "members-import": return "IMPORTER DES BÉNÉFICIAIRES"
      case "initiate": return "INITIER LE PAIEMENT"
      case "verify": return "VÉRIFIER LE PAIEMENT"
      case "validate": return "VALIDER LE PAIEMENT"
      case "history": return "HISTORIQUE DES PAIEMENTS"
      case "account": return "GESTION DE COMPTE"
      default: return "DASHBOARD"
    }
  }

  // Home Page Component
  const HomePage = () => {
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

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div
        className={`${sidebarCollapsed ? "w-16" : "w-70"} bg-muted border-r border-border transition-all duration-300 fixed md:relative z-50 md:z-auto h-full md:h-auto ${!sidebarCollapsed ? "md:block" : ""} relative`}
      >
        <div className="p-4">
          <div className="flex items-center justify-between mb-8">
            <div className={`${sidebarCollapsed ? "hidden" : "block"}`}>
              <h1 className="text-blue-500 font-bold text-lg tracking-wider">SKY PAY</h1>
              <p className="text-muted-foreground text-xs">Dashboard v2.1.7</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="text-muted-foreground hover:text-blue-500"
            >
              <ChevronRight
                className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform ${sidebarCollapsed ? "" : "rotate-180"}`}
              />
            </Button>
          </div>

          <nav className="space-y-2">
            {/* Accueil */}
            <button
              key="home"
              onClick={() => setActiveSection("home")}
              className={`w-full flex items-center gap-3 p-3 rounded transition-all duration-200 ease-in-out transform hover:scale-[1.02] ${
                activeSection === "home"
                  ? "bg-blue-500 text-white shadow-lg"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              }`}
            >
              <Home className="w-5 h-5 md:w-5 md:h-5 sm:w-6 sm:h-6" />
              {!sidebarCollapsed && <span className="text-sm font-medium">ACCUEIL</span>}
            </button>

            {/* Gestion des bénéficiaires - Sous-menu */}
            <div className="space-y-1">
              <button
                onClick={() => setMembersSubmenu(!membersSubmenu)}
                className={`w-full flex items-center justify-between p-3 rounded transition-all duration-200 ease-in-out transform hover:scale-[1.02] ${
                  activeSection.startsWith("members-")
                    ? "bg-blue-500 text-white shadow-lg"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 md:w-5 md:h-5 sm:w-6 sm:h-6" />
                  {!sidebarCollapsed && <span className="text-sm font-medium">GESTION DES BÉNÉFICIAIRES</span>}
                </div>
                {!sidebarCollapsed && (
                  <ChevronDown className={`w-4 h-4 transition-transform ${membersSubmenu ? "rotate-180" : ""}`} />
                )}
              </button>
              
              {membersSubmenu && !sidebarCollapsed && (
                <div className="ml-6 space-y-1">
                  {membersSubItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveSection(item.id)}
                      className={`w-full flex items-center gap-3 p-2 rounded transition-all duration-200 ease-in-out transform hover:scale-[1.02] text-sm ${
                        activeSection === item.id
                          ? "bg-blue-500/20 text-blue-500"
                          : "text-muted-foreground hover:text-foreground hover:bg-accent"
                      }`}
                    >
                      <item.icon className="w-4 h-4" />
                      <span className="font-medium">{item.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Payments Submenu placé ici */}
            <div className="space-y-1">
              <button
                onClick={() => setPaymentsSubmenu(!paymentsSubmenu)}
                className={`w-full flex items-center justify-between p-3 rounded transition-all duration-200 ease-in-out transform hover:scale-[1.02] ${
                  activeSection.startsWith("initiate") || activeSection.startsWith("verify") || activeSection.startsWith("validate")
                    ? "bg-blue-500 text-white shadow-lg"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                }`}
              >
                <div className="flex items-center gap-3">
                  <CreditCard className="w-5 h-5 md:w-5 md:h-5 sm:w-6 sm:h-6" />
                  {!sidebarCollapsed && <span className="text-sm font-medium">PAYER LES BÉNÉFICIAIRES</span>}
                </div>
                {!sidebarCollapsed && (
                  <ChevronDown className={`w-4 h-4 transition-transform ${paymentsSubmenu ? "rotate-180" : ""}`} />
                )}
              </button>
              {paymentsSubmenu && !sidebarCollapsed && (
                <div className="ml-6 space-y-1">
                  {paymentsSubItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveSection(item.id)}
                      className={`w-full flex items-center gap-3 p-2 rounded transition-all duration-200 ease-in-out transform hover:scale-[1.02] text-sm ${
                        activeSection === item.id
                          ? "bg-blue-500/20 text-blue-500"
                          : "text-muted-foreground hover:text-foreground hover:bg-accent"
                      }`}
                    >
                      <item.icon className="w-4 h-4" />
                      <span className="font-medium">{item.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Historique */}
            <button
              key="history"
              onClick={() => setActiveSection("history")}
              className={`w-full flex items-center gap-3 p-3 rounded transition-all duration-200 ease-in-out transform hover:scale-[1.02] ${
                activeSection === "history"
                  ? "bg-blue-500 text-white shadow-lg"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              }`}
            >
              <History className="w-5 h-5 md:w-5 md:h-5 sm:w-6 sm:h-6" />
              {!sidebarCollapsed && <span className="text-sm font-medium">HISTORIQUE</span>}
            </button>

            {/* Gestion de compte */}
            <button
              key="account"
              onClick={() => setActiveSection("account")}
              className={`w-full flex items-center gap-3 p-3 rounded transition-all duration-200 ease-in-out transform hover:scale-[1.02] ${
                activeSection === "account"
                  ? "bg-blue-500 text-white shadow-lg"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              }`}
            >
              <Settings className="w-5 h-5 md:w-5 md:h-5 sm:w-6 sm:h-6" />
              {!sidebarCollapsed && <span className="text-sm font-medium">GESTION DE COMPTE</span>}
            </button>
          </nav>

          {/* Section SYSTÈME ACTIF - Indicateur de santé et statistiques en temps réel */}
          {/* Masquée temporairement
          {!sidebarCollapsed && (
            <div className="mt-8 p-4 bg-muted border border-border rounded">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-foreground">SYSTÈME ACTIF</span>
              </div>
              <div className="text-xs text-muted-foreground">
                <div>UTILISATEURS: 1,247</div>
                <div>TRANSACTIONS: 45,892</div>
                <div>MONTANT TOTAL: 2.5M €</div>
              </div>
            </div>
          )}
          */}

          {/* Logout Button - Positionné en bas de la sidebar */}
          {!sidebarCollapsed && (
            <div className="absolute bottom-4 left-4 right-4">
              <Button
                variant="outline"
                onClick={handleLogout}
                className="w-full"
              >
                <LogOut className="w-4 h-4 mr-2" />
                DÉCONNEXION
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Overlay */}
      {!sidebarCollapsed && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden" onClick={() => setSidebarCollapsed(true)} />
      )}

      {/* Main Content */}
      <div className={`flex-1 flex flex-col ${!sidebarCollapsed ? "md:ml-0" : ""}`}>
        {/* Top Toolbar */}
        <div className="h-16 bg-card border-b border-border flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground">
              SKY PAY / <span className="text-blue-500">{getSectionTitle()}</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-xs text-muted-foreground">
              DERNIÈRE MAJ: {new Date().toLocaleString('fr-FR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
            <ThemeToggle />
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-blue-500">
              <Bell className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-blue-500">
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-auto">
          <div className="relative">
            <div className={`transition-all duration-300 ease-in-out ${activeSection === "home" ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4 absolute inset-0"}`}>
              {activeSection === "home" && <HomePage />}
            </div>
            <div className={`transition-all duration-300 ease-in-out ${activeSection === "members-list" ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4 absolute inset-0"}`}>
              {activeSection === "members-list" && <MembersPage />}
            </div>
            <div className={`transition-all duration-300 ease-in-out ${activeSection === "members-import" ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4 absolute inset-0"}`}>
              {activeSection === "members-import" && <ImportMembersPage />}
            </div>
            <div className={`transition-all duration-300 ease-in-out ${activeSection === "initiate" ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4 absolute inset-0"}`}>
              {activeSection === "initiate" && <InitiatePaymentPage />}
            </div>
            <div className={`transition-all duration-300 ease-in-out ${activeSection === "verify" ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4 absolute inset-0"}`}>
              {activeSection === "verify" && <VerifyPaymentPage />}
            </div>
            <div className={`transition-all duration-300 ease-in-out ${activeSection === "validate" ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4 absolute inset-0"}`}>
              {activeSection === "validate" && <ValidatePaymentPage />}
            </div>
            <div className={`transition-all duration-300 ease-in-out ${activeSection === "history" ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4 absolute inset-0"}`}>
              {activeSection === "history" && <HistoryPage />}
            </div>
            <div className={`transition-all duration-300 ease-in-out ${activeSection === "account" ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4 absolute inset-0"}`}>
              {activeSection === "account" && <AccountPage />}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 