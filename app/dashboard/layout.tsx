"use client"

import { useState, useEffect } from "react"
import { ChevronRight, Users, CreditCard, History, Settings, LogOut, Bell, RefreshCw, ChevronDown, Play, CheckCircle, Shield, Home, Building, Wallet, UserCheck, FileText, CheckSquare, Upload, Key, Globe, User, X, Clock, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { usePathname } from "next/navigation"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [paymentsSubmenu, setPaymentsSubmenu] = useState(false)
  const [membersSubmenu, setMembersSubmenu] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const pathname = usePathname()

  // Notifications data
  const [notifications] = useState([
    {
      id: 1,
      type: "success",
      title: "Paiement validé",
      message: "Le paiement de 500€ pour le lot #1234 a été validé avec succès.",
      time: "Il y a 5 minutes",
      read: false
    },
    {
      id: 2,
      type: "warning",
      title: "Demande de rechargement",
      message: "Nouvelle demande de rechargement de 1000€ en attente de validation.",
      time: "Il y a 15 minutes",
      read: false
    },
    {
      id: 3,
      type: "info",
      title: "Mise à jour système",
      message: "Une nouvelle version de l'application est disponible.",
      time: "Il y a 1 heure",
      read: true
    },
    {
      id: 4,
      type: "error",
      title: "Erreur de connexion",
      message: "Problème de connexion détecté. Vérifiez votre connexion internet.",
      time: "Il y a 2 heures",
      read: true
    }
  ])

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

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "warning":
        return <AlertCircle className="w-4 h-4 text-orange-500" />
      case "error":
        return <AlertCircle className="w-4 h-4 text-red-500" />
      case "info":
        return <Clock className="w-4 h-4 text-blue-500" />
      default:
        return <Bell className="w-4 h-4 text-muted-foreground" />
    }
  }

  const getNotificationBadgeColor = (type: string) => {
    switch (type) {
      case "success":
        return "bg-green-500/20 text-green-400"
      case "warning":
        return "bg-orange-500/20 text-orange-400"
      case "error":
        return "bg-red-500/20 text-red-400"
      case "info":
        return "bg-blue-500/20 text-blue-400"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const unreadCount = notifications.filter(n => !n.read).length

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
    if (pathname === "/dashboard/recharge-requests") return "DEMANDES DE RECHARGEMENT"
    if (pathname === "/dashboard/account") return "GESTION DE COMPTE"
    if (pathname === "/dashboard/settings") return "PARAMÈTRES"
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

            {/* Demandes de Rechargement */}
            <button
              onClick={() => window.location.href = "/dashboard/recharge-requests"}
              className={`w-full flex items-center gap-3 p-3 rounded transition-all duration-200 ease-in-out transform hover:scale-[1.02] ${
                pathname === "/dashboard/recharge-requests"
                  ? "bg-blue-500 text-white shadow-lg"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              }`}
            >
              <RefreshCw className="w-5 h-5 md:w-5 md:h-5 sm:w-6 sm:h-6" />
              {!sidebarCollapsed && <span className="text-xs font-medium">DEMANDES DE RECHARGEMENT</span>}
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
              <User className="w-5 h-5 md:w-5 md:h-5 sm:w-6 sm:h-6" />
              {!sidebarCollapsed && <span className="text-xs font-medium">GESTION DE COMPTE</span>}
            </button>

            {/* Paramètres */}
            <button
              onClick={() => window.location.href = "/dashboard/settings"}
              className={`w-full flex items-center gap-3 p-3 rounded transition-all duration-200 ease-in-out transform hover:scale-[1.02] ${
                pathname === "/dashboard/settings"
                  ? "bg-blue-500 text-white shadow-lg"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              }`}
            >
              <Settings className="w-5 h-5 md:w-5 md:h-5 sm:w-6 sm:h-6" />
              {!sidebarCollapsed && <span className="text-xs font-medium">PARAMÈTRES</span>}
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
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-muted-foreground hover:text-blue-500 relative"
              onClick={() => setNotificationsOpen(true)}
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center p-0">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </Badge>
              )}
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

      {/* Notifications Drawer */}
      <Drawer open={notificationsOpen} onOpenChange={setNotificationsOpen}>
        <DrawerContent className="right-0 left-auto w-80">
          <DrawerHeader className="border-b border-border">
            <div className="flex items-center justify-between">
              <DrawerTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-blue-500" />
                Notifications
                {unreadCount > 0 && (
                  <Badge className="bg-blue-500 text-white">
                    {unreadCount} non lu{unreadCount > 1 ? 's' : ''}
                  </Badge>
                )}
              </DrawerTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setNotificationsOpen(false)}
                className="h-8 w-8"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </DrawerHeader>
          
          <div className="p-4 space-y-4 max-h-[60vh] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="text-center py-8">
                <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Aucune notification</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 rounded-lg border transition-all duration-200 ${
                    notification.read 
                      ? "bg-muted/30 border-muted" 
                      : "bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className={`font-medium text-sm ${
                          notification.read ? "text-muted-foreground" : "text-foreground"
                        }`}>
                          {notification.title}
                        </h4>
                        <Badge className={`text-xs ${getNotificationBadgeColor(notification.type)}`}>
                          {notification.type}
                        </Badge>
                      </div>
                      <p className={`text-sm mb-2 ${
                        notification.read ? "text-muted-foreground" : "text-foreground"
                      }`}>
                        {notification.message}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          {notification.time}
                        </span>
                        {!notification.read && (
                          <Badge className="bg-blue-500 text-white text-xs">
                            Nouveau
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          
          {notifications.length > 0 && (
            <div className="p-4 border-t border-border">
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  Marquer tout comme lu
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  Voir toutes
                </Button>
              </div>
            </div>
          )}
        </DrawerContent>
      </Drawer>
    </div>
  )
} 