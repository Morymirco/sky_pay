"use client"

import { useState } from "react"
import { History, Download, Calendar, DollarSign, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface PaymentHistory {
  id: string
  memberName: string
  provider: "Kulu" | "Soutra Money" | "Orange Money"
  accountNumber: string
  amount: number
  status: "completed" | "failed" | "pending"
  date: string
  confirmedBy: string
}

export default function HistoryPage() {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth())
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())

  const [payments] = useState<PaymentHistory[]>([
    {
      id: "1",
      memberName: "Jean Dupont",
      provider: "Orange Money",
      accountNumber: "OM123456789",
      amount: 150,
      status: "completed",
      date: "2025-01-15",
      confirmedBy: "admin"
    },
    {
      id: "2",
      memberName: "Marie Martin",
      provider: "Kulu",
      accountNumber: "KL987654321",
      amount: 200,
      status: "completed",
      date: "2025-01-14",
      confirmedBy: "admin"
    },
    {
      id: "3",
      memberName: "Pierre Durand",
      provider: "Soutra Money",
      accountNumber: "SM456789123",
      amount: 75,
      status: "failed",
      date: "2025-01-13",
      confirmedBy: "admin"
    }
  ])

  const filteredPayments = payments.filter(payment => {
    const paymentDate = new Date(payment.date)
    return paymentDate.getMonth() === selectedMonth && paymentDate.getFullYear() === selectedYear
  })

  const totalAmount = filteredPayments.reduce((sum, payment) => sum + payment.amount, 0)
  const completedCount = filteredPayments.filter(p => p.status === "completed").length

  const exportToExcel = () => {
    const csvContent = "data:text/csv;charset=utf-8," +
      "ID,Bénéficiaire,Fournisseur,Compte,Montant,Statut,Date,Confirmé par\n" +
      filteredPayments.map(payment => 
        `${payment.id},${payment.memberName},${payment.provider},${payment.accountNumber},${payment.amount}€,${payment.status},${payment.date},${payment.confirmedBy}`
      ).join("\n")
    
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `historique_${selectedMonth + 1}_${selectedYear}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const getProviderColor = (provider: string) => {
    switch (provider) {
      case "Kulu": return "bg-green-500/20 text-green-400"
      case "Soutra Money": return "bg-blue-500/20 text-blue-400"
      case "Orange Money": return "bg-orange-500/20 text-orange-400"
      default: return "bg-neutral-500/20 text-muted-foreground"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-500/20 text-green-400"
      case "failed": return "bg-red-500/20 text-red-400"
      case "pending": return "bg-yellow-500/20 text-yellow-400"
      default: return "bg-neutral-500/20 text-muted-foreground"
    }
  }

  const months = [
    "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
    "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
  ]

  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i)

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-wider">HISTORIQUE DES PAIEMENTS</h1>
          <p className="text-sm text-muted-foreground">Consultez l'historique de vos transactions</p>
        </div>
        <Button variant="outline" onClick={exportToExcel} className="border-border text-muted-foreground">
          <Download className="w-4 h-4 mr-2" />
          Export Excel
        </Button>
      </div>

      {/* Filters */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-foreground tracking-wider">FILTRES</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Mois</label>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                className="border rounded-md px-3 py-2 bg-background text-foreground"
              >
                {months.map((month, index) => (
                  <option key={index} value={index}>{month}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Année</label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                className="border rounded-md px-3 py-2 bg-background text-foreground"
              >
                {years.map((year) => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground tracking-wider">TOTAL TRANSACTIONS</p>
                <p className="text-2xl font-bold text-foreground font-mono">{filteredPayments.length}</p>
              </div>
              <History className="w-8 h-8 text-blue-500" />
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
                <p className="text-xs text-muted-foreground tracking-wider">RÉUSSIES</p>
                <p className="text-2xl font-bold text-foreground font-mono">{completedCount}</p>
              </div>
              <CreditCard className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payment History */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-foreground tracking-wider">
            HISTORIQUE - {months[selectedMonth]} {selectedYear}
          </CardTitle>
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
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground tracking-wider">DATE</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground tracking-wider">CONFIRMÉ PAR</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayments.map((payment) => (
                  <tr
                    key={payment.id}
                    className="table-row-hover"
                  >
                    <td className="py-3 px-4">
                      <div className="text-sm text-foreground font-medium">{payment.memberName}</div>
                      <div className="text-xs text-muted-foreground">ID: {payment.id}</div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge className={getProviderColor(payment.provider)}>
                        {payment.provider}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm text-foreground font-mono">{payment.accountNumber}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm text-foreground font-bold">{payment.amount}€</span>
                    </td>
                    <td className="py-3 px-4">
                      <Badge className={getStatusColor(payment.status)}>
                        {payment.status === "completed" ? "Terminé" : 
                         payment.status === "failed" ? "Échoué" : "En attente"}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm text-foreground">
                        {new Date(payment.date).toLocaleDateString('fr-FR')}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm text-foreground">{payment.confirmedBy}</span>
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