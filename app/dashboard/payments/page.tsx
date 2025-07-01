"use client"

import { useState } from "react"
import { CreditCard, Download, Upload, CheckCircle, AlertCircle, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface PaymentMember {
  id: string
  name: string
  provider: "Kulu" | "Soutra Money" | "Orange Money"
  accountNumber: string
  amount: number
  status: "pending" | "confirmed" | "completed"
}

export default function PaymentsPage() {
  const [members, setMembers] = useState<PaymentMember[]>([
    {
      id: "1",
      name: "Jean Dupont",
      provider: "Orange Money",
      accountNumber: "OM123456789",
      amount: 150,
      status: "pending"
    },
    {
      id: "2",
      name: "Marie Martin",
      provider: "Kulu",
      accountNumber: "KL987654321",
      amount: 200,
      status: "pending"
    },
    {
      id: "3",
      name: "Pierre Durand",
      provider: "Soutra Money",
      accountNumber: "SM456789123",
      amount: 75,
      status: "pending"
    }
  ])

  const [isConfirming, setIsConfirming] = useState(false)

  const totalAmount = members.reduce((sum, member) => sum + member.amount, 0)
  const pendingCount = members.filter(m => m.status === "pending").length

  const handleConfirmPayments = () => {
    setIsConfirming(true)
    // Simulate payment processing
    setTimeout(() => {
      setMembers(members.map(member => ({
        ...member,
        status: "completed" as const
      })))
      setIsConfirming(false)
    }, 2000)
  }

  const exportToExcel = () => {
    const csvContent = "data:text/csv;charset=utf-8," +
      "ID,Nom,Fournisseur,Compte,Montant,Statut\n" +
      members.map(member => 
        `${member.id},${member.name},${member.provider},${member.accountNumber},${member.amount}€,${member.status}`
      ).join("\n")
    
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", "paiements_sky_pay.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const getProviderColor = (provider: string) => {
    switch (provider) {
      case "Kulu": return "bg-green-500/20 text-green-400"
      case "Soutra Money": return "bg-blue-500/20 text-blue-400"
      case "Orange Money": return "bg-orange-500/20 text-orange-400"
      default: return "bg-neutral-500/20 text-neutral-400"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-500/20 text-yellow-400"
      case "confirmed": return "bg-blue-500/20 text-blue-400"
      case "completed": return "bg-green-500/20 text-green-400"
      default: return "bg-neutral-500/20 text-neutral-400"
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-wider">PAYER LES MEMBRES</h1>
          <p className="text-sm text-neutral-400">Gérez les paiements vers vos bénéficiaires</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-neutral-700 text-neutral-400">
            <Upload className="w-4 h-4 mr-2" />
            Import Excel
          </Button>
          <Button variant="outline" onClick={exportToExcel} className="border-neutral-700 text-neutral-400">
            <Download className="w-4 h-4 mr-2" />
            Export Excel
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-neutral-900 border-neutral-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-neutral-400 tracking-wider">TOTAL MEMBRES</p>
                <p className="text-2xl font-bold text-white font-mono">{members.length}</p>
              </div>
              <CreditCard className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-neutral-900 border-neutral-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-neutral-400 tracking-wider">MONTANT TOTAL</p>
                <p className="text-2xl font-bold text-white font-mono">{totalAmount}€</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-neutral-900 border-neutral-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-neutral-400 tracking-wider">EN ATTENTE</p>
                <p className="text-2xl font-bold text-white font-mono">{pendingCount}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payment List */}
      <Card className="bg-neutral-900 border-neutral-700">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider">LISTE DES PAIEMENTS</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-700">
                  <th className="text-left py-3 px-4 text-xs font-medium text-neutral-400 tracking-wider">MEMBRE</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-neutral-400 tracking-wider">FOURNISSEUR</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-neutral-400 tracking-wider">COMPTE</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-neutral-400 tracking-wider">MONTANT</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-neutral-400 tracking-wider">STATUT</th>
                </tr>
              </thead>
              <tbody>
                {members.map((member) => (
                  <tr
                    key={member.id}
                    className="border-b border-neutral-800 hover:bg-neutral-800 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="text-sm text-white font-medium">{member.name}</div>
                      <div className="text-xs text-neutral-400">ID: {member.id}</div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge className={getProviderColor(member.provider)}>
                        {member.provider}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm text-neutral-300 font-mono">{member.accountNumber}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm text-white font-bold">{member.amount}€</span>
                    </td>
                    <td className="py-3 px-4">
                      <Badge className={getStatusColor(member.status)}>
                        {member.status === "pending" ? "En attente" : 
                         member.status === "confirmed" ? "Confirmé" : "Terminé"}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Confirmation Section */}
      <Card className="bg-neutral-900 border-neutral-700">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider">CONFIRMATION DES PAIEMENTS</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-400">
                Total à payer : <span className="text-white font-bold">{totalAmount}€</span>
              </p>
              <p className="text-xs text-neutral-500">
                {pendingCount} paiement(s) en attente de confirmation
              </p>
            </div>
            <Button
              onClick={handleConfirmPayments}
              disabled={isConfirming || pendingCount === 0}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              {isConfirming ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  TRAITEMENT...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  CONFIRMER LES PAIEMENTS
                </div>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 