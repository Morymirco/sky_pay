"use client"

import { useState } from "react"
import { CheckCircle, X, Download, CreditCard, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface PaymentMember {
  id: string
  name: string
  provider: "Kulu" | "Soutra Money" | "Orange Money"
  accountNumber: string
  amount: number
  status: "pending" | "validé"
}

export default function VerifyPaymentPage() {
  const [members, setMembers] = useState<PaymentMember[]>([
    {
      id: "1",
      name: "Jean Dupont",
      provider: "Orange Money",
      accountNumber: "OM123456789",
      amount: 150.00,
      status: "pending"
    },
    {
      id: "2",
      name: "Marie Martin",
      provider: "Kulu",
      accountNumber: "KL987654321",
      amount: 200.00,
      status: "pending"
    },
    {
      id: "3",
      name: "Pierre Durand",
      provider: "Soutra Money",
      accountNumber: "SM456789123",
      amount: 175.50,
      status: "pending"
    }
  ])

  const totalAmount = members.reduce((sum, member) => sum + member.amount, 0)
  const pendingCount = members.filter(m => m.status === "pending").length

  const exportToExcel = () => {
    const csvContent = "data:text/csv;charset=utf-8," +
      "ID,Nom,Fournisseur,Compte,Montant,Statut\n" +
      members.map(member => 
        `${member.id},${member.name},${member.provider},${member.accountNumber},${member.amount}€,${member.status}`
      ).join("\n")
    
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", "paiements_a_verifier.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleValidate = (id: string) => {
    setMembers(members.map(member =>
      member.id === id ? { ...member, status: "validé" } : member
    ))
  }

  const handleCancel = (id: string) => {
    setMembers(members.filter(member => member.id !== id))
  }

  const getProviderColor = (provider: string) => {
    switch (provider) {
      case "Kulu": return "bg-green-500/20 text-green-400"
      case "Soutra Money": return "bg-blue-500/20 text-blue-400"
      case "Orange Money": return "bg-orange-500/20 text-orange-400"
      default: return "bg-muted text-muted-foreground"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "validé": return "bg-green-500/20 text-green-400"
      case "pending": return "bg-yellow-500/20 text-yellow-400"
      default: return "bg-muted text-muted-foreground"
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-wider">VÉRIFIER LE PAIEMENT</h1>
          <p className="text-sm text-muted-foreground">Vérifiez et validez les paiements en attente</p>
        </div>
        <Button variant="outline" onClick={exportToExcel}>
          <Download className="w-4 h-4 mr-2" />
          Export Excel
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground tracking-wider">TOTAL BÉNÉFICIAIRES</p>
                <p className="text-2xl font-bold text-foreground font-mono">{members.length}</p>
              </div>
              <CreditCard className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground tracking-wider">MONTANT TOTAL</p>
                <p className="text-2xl font-bold text-foreground font-mono">{totalAmount}€</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground tracking-wider">EN ATTENTE</p>
                <p className="text-2xl font-bold text-foreground font-mono">{pendingCount}</p>
              </div>
              <div className="w-8 h-8 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payment List */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-foreground tracking-wider">LISTE DES PAIEMENTS À VÉRIFIER</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground tracking-wider">MEMBRE</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground tracking-wider">FOURNISSEUR</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground tracking-wider">COMPTE</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground tracking-wider">MONTANT</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground tracking-wider">STATUT</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground tracking-wider">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {members.map((member) => (
                  <tr key={member.id} className="table-row-hover">
                    <td className="py-3 px-4">
                      <div className="text-sm text-foreground font-medium">{member.name}</div>
                      <div className="text-xs text-muted-foreground">ID: {member.id}</div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge className={getProviderColor(member.provider)}>
                        {member.provider}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm text-foreground font-mono">{member.accountNumber}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm text-foreground font-bold">{member.amount}€</span>
                    </td>
                    <td className="py-3 px-4">
                      <Badge className={getStatusColor(member.status)}>
                        {member.status === "pending" ? "En attente" : "Validé"}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      {member.status === "pending" ? (
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => handleCancel(member.id)} className="delete-button-hover button-hover">
                            <X className="w-4 h-4 mr-1" /> Annuler
                          </Button>
                          <Button size="sm" onClick={() => handleValidate(member.id)} className="edit-button-hover button-hover">
                            <CheckCircle className="w-4 h-4 mr-1" /> Valider
                          </Button>
                        </div>
                      ) : (
                        <span className="text-green-500 font-bold">Validé</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 