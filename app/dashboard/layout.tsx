"use client"

import { useState, useEffect } from "react"
import { ChevronRight, Users, CreditCard, History, Settings, LogOut, Bell, RefreshCw, ChevronDown, Play, CheckCircle, Shield, Home, Building, Wallet, UserCheck, FileText, CheckSquare, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { usePathname } from "next/navigation"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [paymentsSubmenu, setPaymentsSubmenu] = useState(false)
  const [membersSubmenu, setMembersSubmenu] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const pathname = usePathname()

  // Gérer automatiquement l'ouverture des sous-menus selon la page active
  useEffect(() => {
    if (pathname.startsWith("/dashboard/members")) {
      setMembersSubmenu(true)
    } else {
      setMembersSubmenu(false)
    }
    
    if (pathname.startsWith("/dashboard/payments")) {
      setPaymentsSubmenu(true)
    } else {
      setPaymentsSubmenu(false)
    }
  }, [pathname])

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

  const getSectionTitle = () => {
    if (pathname === "/dashboard") return "ACCUEIL"
    if (pathname === "/dashboard/members") return "LISTE DES BÉNÉFICIAIRES"
    if (pathname === "/dashboard/members/import") return "IMPORTER DES BÉNÉFICIAIRES"
    if (pathname === "/dashboard/payments/initiate") return "INITIER LE PAIEMENT"
    if (pathname === "/dashboard/payments/verify") return "VÉRIFIER LE PAIEMENT"
    if (pathname === "/dashboard/payments/validate") return "VALIDER LE PAIEMENT"
    if (pathname === "/dashboard/history") return "HISTORIQUE DES PAIEMENTS"
    if (pathname === "/dashboard/account") return "GESTION DE COMPTE"
    return "DASHBOARD"
  }

  const paymentsSubItems = [
    { id: "initiate", icon: Play, label: "INITIER LE PAIEMENT", href: "/dashboard/payments/initiate" },
    { id: "verify", icon: CheckCircle, label: "VÉRIFIER LE PAIEMENT", href: "/dashboard/payments/verify" },
    { id: "validate", icon: Shield, label: "VALIDER LE PAIEMENT", href: "/dashboard/payments/validate" },
  ]

  const membersSubItems = [
    { id: "members-list", icon: Users, label: "LISTE DES BÉNÉFICIAIRES", href: "/dashboard/members" },
    { id: "members-import", icon: Upload, label: "IMPORTER DES BÉNÉFICIAIRES", href: "/dashboard/members/import" },
  ]

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
              onClick={() => window.location.href = "/dashboard"}
              className={`w-full flex items-center gap-3 p-3 rounded transition-all duration-200 ease-in-out transform hover:scale-[1.02] ${
                pathname === "/dashboard"
                  ? "bg-blue-500 text-white shadow-lg"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              }`}
            >
              <Home className="w-5 h-5 md:w-5 md:h-5 sm:w-6 sm:h-6" />
              {!sidebarCollapsed && <span className="text-xs font-medium">ACCUEIL</span>}
            </button>

            {/* Gestion des bénéficiaires - Sous-menu */}
            <div className="space-y-1">
              <button
                onClick={() => setMembersSubmenu(!membersSubmenu)}
                className={`w-full flex items-center justify-between p-3 rounded transition-all duration-200 ease-in-out transform hover:scale-[1.02] ${
                  pathname.startsWith("/dashboard/members")
                    ? "bg-blue-500 text-white shadow-lg"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 md:w-5 md:h-5 sm:w-6 sm:h-6" />
                  {!sidebarCollapsed && <span className="text-xs font-medium">GESTION DES BÉNÉFICIAIRES</span>}
                </div>
                {!sidebarCollapsed && (
                  <ChevronDown className={`w-4 h-4 transition-transform ${membersSubmenu ? "rotate-180" : ""}`} />
                )}
              </button>
              
              <div className={`ml-6 space-y-1 overflow-hidden transition-all duration-300 ease-in-out ${
                membersSubmenu && !sidebarCollapsed ? "max-h-32 opacity-100" : "max-h-0 opacity-0"
              }`}>
                  {membersSubItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => window.location.href = item.href}
                      className={`w-full flex items-center gap-3 p-2 rounded transition-all duration-200 ease-in-out transform hover:scale-[1.02] text-xs ${
                        pathname === item.href
                          ? "bg-blue-500/20 text-blue-500"
                          : "text-muted-foreground hover:text-foreground hover:bg-accent"
                      }`}
                    >
                      <item.icon className="w-4 h-4" />
                      <span className="text-xs font-medium">{item.label}</span>
                    </button>
                  ))}
                </div>
            </div>

            {/* Payments Submenu placé ici */}
            <div className="space-y-1">
              <button
                onClick={() => setPaymentsSubmenu(!paymentsSubmenu)}
                className={`w-full flex items-center justify-between p-3 rounded transition-all duration-200 ease-in-out transform hover:scale-[1.02] ${
                  pathname.startsWith("/dashboard/payments")
                    ? "bg-blue-500 text-white shadow-lg"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                }`}
              >
                <div className="flex items-center gap-3">
                  <CreditCard className="w-5 h-5 md:w-5 md:h-5 sm:w-6 sm:h-6" />
                  {!sidebarCollapsed && <span className="text-xs font-medium">PAYER LES BÉNÉFICIAIRES</span>}
                </div>
                {!sidebarCollapsed && (
                  <ChevronDown className={`w-4 h-4 transition-transform ${paymentsSubmenu ? "rotate-180" : ""}`} />
                )}
              </button>
              <div className={`ml-6 space-y-1 overflow-hidden transition-all duration-300 ease-in-out ${
                paymentsSubmenu && !sidebarCollapsed ? "max-h-32 opacity-100" : "max-h-0 opacity-0"
              }`}>
                  {paymentsSubItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => window.location.href = item.href}
                      className={`w-full flex items-center gap-3 p-2 rounded transition-all duration-200 ease-in-out transform hover:scale-[1.02] text-xs ${
                        pathname === item.href
                          ? "bg-blue-500/20 text-blue-500"
                          : "text-muted-foreground hover:text-foreground hover:bg-accent"
                      }`}
                    >
                      <item.icon className="w-4 h-4" />
                      <span className="text-xs font-medium">{item.label}</span>
                    </button>
                  ))}
                </div>
            </div>

            {/* Historique */}
            <button
              onClick={() => window.location.href = "/dashboard/history"}
              className={`w-full flex items-center gap-3 p-3 rounded transition-all duration-200 ease-in-out transform hover:scale-[1.02] ${
                pathname === "/dashboard/history"
                  ? "bg-blue-500 text-white shadow-lg"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              }`}
            >
              <History className="w-5 h-5 md:w-5 md:h-5 sm:w-6 sm:h-6" />
              {!sidebarCollapsed && <span className="text-xs font-medium">HISTORIQUE</span>}
            </button>

            {/* Gestion de compte */}
            <button
              onClick={() => window.location.href = "/dashboard/account"}
              className={`w-full flex items-center gap-3 p-3 rounded transition-all duration-200 ease-in-out transform hover:scale-[1.02] ${
                pathname === "/dashboard/account"
                  ? "bg-blue-500 text-white shadow-lg"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              }`}
            >
              <Settings className="w-5 h-5 md:w-5 md:h-5 sm:w-6 sm:h-6" />
              {!sidebarCollapsed && <span className="text-xs font-medium">GESTION DE COMPTE</span>}
            </button>
          </nav>

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
          {children}
        </div>
      </div>
    </div>
  )
} 