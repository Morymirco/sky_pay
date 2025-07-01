"use client"

import { useState } from "react"
import { ChevronRight, Users, CreditCard, History, Settings, LogOut, Bell, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import MembersPage from "./members/page"
import PaymentsPage from "./payments/page"
import HistoryPage from "./history/page"
import AccountPage from "./account/page"

export default function Dashboard() {
  const [activeSection, setActiveSection] = useState("members")
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
    { id: "members", icon: Users, label: "GESTION DES MEMBRES" },
    { id: "payments", icon: CreditCard, label: "PAYER LES MEMBRES" },
    { id: "history", icon: History, label: "HISTORIQUE" },
    { id: "account", icon: Settings, label: "GESTION DE COMPTE" },
  ]

  const getSectionTitle = () => {
    switch (activeSection) {
      case "members": return "GESTION DES MEMBRES"
      case "payments": return "PAYER LES MEMBRES"
      case "history": return "HISTORIQUE DES PAIEMENTS"
      case "account": return "GESTION DE COMPTE"
      default: return "DASHBOARD"
    }
  }

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div
        className={`${sidebarCollapsed ? "w-16" : "w-70"} bg-neutral-900 border-r border-neutral-700 transition-all duration-300 fixed md:relative z-50 md:z-auto h-full md:h-auto ${!sidebarCollapsed ? "md:block" : ""}`}
      >
        <div className="p-4">
          <div className="flex items-center justify-between mb-8">
            <div className={`${sidebarCollapsed ? "hidden" : "block"}`}>
              <h1 className="text-blue-500 font-bold text-lg tracking-wider">SKY PAY</h1>
              <p className="text-neutral-500 text-xs">Dashboard v2.1.7</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="text-neutral-400 hover:text-blue-500"
            >
              <ChevronRight
                className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform ${sidebarCollapsed ? "" : "rotate-180"}`}
              />
            </Button>
          </div>

          <nav className="space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center gap-3 p-3 rounded transition-colors ${
                  activeSection === item.id
                    ? "bg-blue-500 text-white"
                    : "text-neutral-400 hover:text-white hover:bg-neutral-800"
                }`}
              >
                <item.icon className="w-5 h-5 md:w-5 md:h-5 sm:w-6 sm:h-6" />
                {!sidebarCollapsed && <span className="text-sm font-medium">{item.label}</span>}
              </button>
            ))}
          </nav>

          {!sidebarCollapsed && (
            <div className="mt-8 p-4 bg-neutral-800 border border-neutral-700 rounded">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                <span className="text-xs text-white">SYSTÈME ACTIF</span>
              </div>
              <div className="text-xs text-neutral-500">
                <div>UTILISATEURS: 1,247</div>
                <div>TRANSACTIONS: 45,892</div>
                <div>MONTANT TOTAL: 2.5M €</div>
              </div>
            </div>
          )}

          {/* Logout Button */}
          {!sidebarCollapsed && (
            <div className="mt-4">
              <Button
                variant="outline"
                onClick={handleLogout}
                className="w-full border-neutral-700 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-300 bg-transparent"
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
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setSidebarCollapsed(true)} />
      )}

      {/* Main Content */}
      <div className={`flex-1 flex flex-col ${!sidebarCollapsed ? "md:ml-0" : ""}`}>
        {/* Top Toolbar */}
        <div className="h-16 bg-neutral-800 border-b border-neutral-700 flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <div className="text-sm text-neutral-400">
              SKY PAY / <span className="text-blue-500">{getSectionTitle()}</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-xs text-neutral-500">
              DERNIÈRE MAJ: {new Date().toLocaleString('fr-FR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
            <Button variant="ghost" size="icon" className="text-neutral-400 hover:text-blue-500">
              <Bell className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" className="text-neutral-400 hover:text-blue-500">
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-auto">
          {activeSection === "members" && <MembersPage />}
          {activeSection === "payments" && <PaymentsPage />}
          {activeSection === "history" && <HistoryPage />}
          {activeSection === "account" && <AccountPage />}
        </div>
      </div>
    </div>
  )
} 