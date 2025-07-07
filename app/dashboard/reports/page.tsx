"use client"

import { useState, useEffect } from "react"
import { FileText, Download, Filter, Calendar as CalendarIcon, User, CheckCircle, Shield, BarChart3, TrendingUp, DollarSign, Users, Clock, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

interface ReportData {
  id: string
  date: string
  reference: string
  initiator: string
  verifier?: string
  validator?: string
  amount: number
  beneficiaryCount: number
  status: "initiated" | "verified" | "validated" | "completed" | "cancelled"
  provider: "Kulu" | "Soutra Money" | "Orange Money"
  description?: string
}

interface FilterState {
  dateFrom: Date | null
  dateTo: Date | null
  initiator: string
  verifier: string
  validator: string
  status: string
  provider: string
}

export default function ReportsPage() {
  const [reports, setReports] = useState<ReportData[]>([
    {
      id: "1",
      date: "2024-01-15",
      reference: "PAY-2024-001",
      initiator: "Jean Dupont",
      verifier: "Marie Martin",
      validator: "Pierre Durand",
      amount: 1500.00,
      beneficiaryCount: 5,
      status: "completed",
      provider: "Orange Money",
      description: "Paiement salaires janvier"
    },
    {
      id: "2",
      date: "2024-01-16",
      reference: "PAY-2024-002",
      initiator: "Sophie Bernard",
      verifier: "Lucas Moreau",
      validator: "Emma Dubois",
      amount: 2200.00,
      beneficiaryCount: 8,
      status: "validated",
      provider: "Kulu",
      description: "Paiement fournisseurs"
    },
    {
      id: "3",
      date: "2024-01-17",
      reference: "PAY-2024-003",
      initiator: "Thomas Leroy",
      verifier: "Julie Rousseau",
      amount: 950.00,
      beneficiaryCount: 3,
      status: "verified",
      provider: "Soutra Money",
      description: "Paiement consultants"
    },
    {
      id: "4",
      date: "2024-01-18",
      reference: "PAY-2024-004",
      initiator: "Jean Dupont",
      amount: 1800.00,
      beneficiaryCount: 6,
      status: "initiated",
      provider: "Orange Money",
      description: "Paiement prestations"
    },
    {
      id: "5",
      date: "2024-01-19",
      reference: "PAY-2024-005",
      initiator: "Marie Martin",
      verifier: "Pierre Durand",
      validator: "Sophie Bernard",
      amount: 3200.00,
      beneficiaryCount: 12,
      status: "completed",
      provider: "Kulu",
      description: "Paiement salaires fin de mois"
    },
    {
      id: "6",
      date: "2024-01-20",
      reference: "PAY-2024-006",
      initiator: "Lucas Moreau",
      amount: 750.00,
      beneficiaryCount: 2,
      status: "cancelled",
      provider: "Soutra Money",
      description: "Paiement annulé"
    }
  ])

  const [filteredReports, setFilteredReports] = useState<ReportData[]>(reports)
  const [filters, setFilters] = useState<FilterState>({
    dateFrom: null,
    dateTo: null,
    initiator: "",
    verifier: "",
    validator: "",
    status: "all",
    provider: "all"
  })

  const [showFilters, setShowFilters] = useState(false)

  // Statistiques
  const totalAmount = filteredReports.reduce((sum, report) => sum + report.amount, 0)
  const totalTransactions = filteredReports.length
  const totalBeneficiaries = filteredReports.reduce((sum, report) => sum + report.beneficiaryCount, 0)
  
  const statusCounts = {
    initiated: filteredReports.filter(r => r.status === "initiated").length,
    verified: filteredReports.filter(r => r.status === "verified").length,
    validated: filteredReports.filter(r => r.status === "validated").length,
    completed: filteredReports.filter(r => r.status === "completed").length,
    cancelled: filteredReports.filter(r => r.status === "cancelled").length
  }

  // Appliquer les filtres
  useEffect(() => {
    let filtered = reports

    if (filters.dateFrom) {
      filtered = filtered.filter(report => new Date(report.date) >= filters.dateFrom!)
    }

    if (filters.dateTo) {
      filtered = filtered.filter(report => new Date(report.date) <= filters.dateTo!)
    }

    if (filters.initiator) {
      filtered = filtered.filter(report => 
        report.initiator.toLowerCase().includes(filters.initiator.toLowerCase())
      )
    }

    if (filters.verifier) {
      filtered = filtered.filter(report => 
        report.verifier?.toLowerCase().includes(filters.verifier.toLowerCase())
      )
    }

    if (filters.validator) {
      filtered = filtered.filter(report => 
        report.validator?.toLowerCase().includes(filters.validator.toLowerCase())
      )
    }

    if (filters.status && filters.status !== "all") {
      filtered = filtered.filter(report => report.status === filters.status)
    }

    if (filters.provider && filters.provider !== "all") {
      filtered = filtered.filter(report => report.provider === filters.provider)
    }

    setFilteredReports(filtered)
  }, [filters, reports])

  const clearFilters = () => {
    setFilters({
      dateFrom: null,
      dateTo: null,
      initiator: "",
      verifier: "",
      validator: "",
      status: "all",
      provider: "all"
    })
  }

  const exportToExcel = () => {
    const csvContent = "data:text/csv;charset=utf-8," +
      "Date,Référence,Initiateur,Vérificateur,Validateur,Montant,Bénéficiaires,Statut,Fournisseur,Description\n" +
      filteredReports.map(report => 
        `${report.date},${report.reference},${report.initiator},${report.verifier || ""},${report.validator || ""},${report.amount},${report.beneficiaryCount},${report.status},${report.provider},${report.description || ""}`
      ).join("\n")
    
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `rapport_paiements_${new Date().toISOString().split('T')[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "initiated": return "bg-blue-500/20 text-blue-400"
      case "verified": return "bg-yellow-500/20 text-yellow-400"
      case "validated": return "bg-green-500/20 text-green-400"
      case "completed": return "bg-green-500/20 text-green-400"
      case "cancelled": return "bg-red-500/20 text-red-400"
      default: return "bg-neutral-500/20 text-muted-foreground"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "initiated": return "Initié"
      case "verified": return "Vérifié"
      case "validated": return "Validé"
      case "completed": return "Terminé"
      case "cancelled": return "Annulé"
      default: return status
    }
  }

  const getProviderColor = (provider: string) => {
    switch (provider) {
      case "Kulu": return "bg-green-500/20 text-green-400"
      case "Soutra Money": return "bg-blue-500/20 text-blue-400"
      case "Orange Money": return "bg-orange-500/20 text-orange-400"
      default: return "bg-neutral-500/20 text-muted-foreground"
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-wider">RAPPORTS DE PAIEMENTS</h1>
          <p className="text-sm text-muted-foreground">Analysez et exportez les données de paiements</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => setShowFilters(!showFilters)}
            className="border-border text-muted-foreground"
          >
            <Filter className="w-4 h-4 mr-2" />
            {showFilters ? "Masquer" : "Afficher"} Filtres
          </Button>
          <Button variant="outline" onClick={exportToExcel} className="border-border text-muted-foreground">
            <Download className="w-4 h-4 mr-2" />
            Export Excel
          </Button>
        </div>
      </div>

      {/* Filtres */}
      {showFilters && (
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-foreground tracking-wider flex items-center gap-2">
              <Filter className="w-4 h-4" />
              FILTRES DE RECHERCHE
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Période */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">PÉRIODE</label>
                <div className="grid grid-cols-2 gap-3">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal h-10">
                        <CalendarIcon className="w-4 h-4 mr-2" />
                        {filters.dateFrom ? format(filters.dateFrom, "dd/MM/yyyy") : "Du"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        selected={filters.dateFrom}
                        onSelect={(date: Date | undefined) => setFilters({...filters, dateFrom: date || null})}
                        locale={fr}
                      />
                    </PopoverContent>
                  </Popover>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal h-10">
                        <CalendarIcon className="w-4 h-4 mr-2" />
                        {filters.dateTo ? format(filters.dateTo, "dd/MM/yyyy") : "Au"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        selected={filters.dateTo}
                        onSelect={(date: Date | undefined) => setFilters({...filters, dateTo: date || null})}
                        locale={fr}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              {/* Initiateur */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">INITIATEUR</label>
                <Input
                  placeholder="Rechercher par initiateur..."
                  value={filters.initiator}
                  onChange={(e) => setFilters({...filters, initiator: e.target.value})}
                  className="h-10"
                />
              </div>

              {/* Vérificateur */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">VÉRIFICATEUR</label>
                <Input
                  placeholder="Rechercher par vérificateur..."
                  value={filters.verifier}
                  onChange={(e) => setFilters({...filters, verifier: e.target.value})}
                  className="h-10"
                />
              </div>

              {/* Validateur */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">VALIDATEUR</label>
                <Input
                  placeholder="Rechercher par validateur..."
                  value={filters.validator}
                  onChange={(e) => setFilters({...filters, validator: e.target.value})}
                  className="h-10"
                />
              </div>

              {/* Statut */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">STATUT</label>
                <Select value={filters.status} onValueChange={(value) => setFilters({...filters, status: value})}>
                  <SelectTrigger className="h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les statuts</SelectItem>
                    <SelectItem value="initiated">Initié</SelectItem>
                    <SelectItem value="verified">Vérifié</SelectItem>
                    <SelectItem value="validated">Validé</SelectItem>
                    <SelectItem value="completed">Terminé</SelectItem>
                    <SelectItem value="cancelled">Annulé</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Fournisseur */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">FOURNISSEUR</label>
                <Select value={filters.provider} onValueChange={(value) => setFilters({...filters, provider: value})}>
                  <SelectTrigger className="h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les fournisseurs</SelectItem>
                    <SelectItem value="Kulu">Kulu</SelectItem>
                    <SelectItem value="Soutra Money">Soutra Money</SelectItem>
                    <SelectItem value="Orange Money">Orange Money</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={clearFilters} size="sm">
                Effacer les filtres
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground tracking-wider">MONTANT TOTAL</p>
                <p className="text-2xl font-bold text-foreground font-mono">{totalAmount.toFixed(2)}€</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground tracking-wider">TRANSACTIONS</p>
                <p className="text-2xl font-bold text-foreground font-mono">{totalTransactions}</p>
              </div>
              <BarChart3 className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground tracking-wider">TERMINÉS</p>
                <p className="text-2xl font-bold text-foreground font-mono">{statusCounts.completed}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Répartition par statut */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="bg-card border-border">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-500">{statusCounts.initiated}</div>
            <div className="text-xs text-muted-foreground">Initiés</div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-500">{statusCounts.verified}</div>
            <div className="text-xs text-muted-foreground">Vérifiés</div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-500">{statusCounts.validated}</div>
            <div className="text-xs text-muted-foreground">Validés</div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-500">{statusCounts.cancelled}</div>
            <div className="text-xs text-muted-foreground">Annulés</div>
          </CardContent>
        </Card>
      </div>

      {/* Tableau des rapports */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-foreground tracking-wider flex items-center justify-between">
            <span>DÉTAIL DES TRANSACTIONS</span>
            <span className="text-xs text-muted-foreground">
              {filteredReports.length} résultat{filteredReports.length > 1 ? 's' : ''}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground tracking-wider w-24">DATE</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground tracking-wider w-32">RÉFÉRENCE</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground tracking-wider w-32">INITIATEUR</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground tracking-wider w-24">MONTANT</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground tracking-wider w-28">FOURNISSEUR</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground tracking-wider w-24">STATUT</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground tracking-wider">DESCRIPTION</th>
                </tr>
              </thead>
              <tbody>
                {filteredReports.map((report) => (
                  <tr
                    key={report.id}
                    className="border-b border-border hover:bg-muted/50 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <span className="text-sm text-foreground font-mono">
                        {new Date(report.date).toLocaleDateString('fr-FR')}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm text-foreground font-mono">{report.reference}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-blue-500" />
                        <span className="text-sm text-foreground">{report.initiator}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm text-foreground font-mono font-bold">
                        {report.amount.toFixed(2)}€
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <Badge className={getProviderColor(report.provider)}>
                        {report.provider}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Badge className={getStatusColor(report.status)}>
                        {getStatusLabel(report.status)}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm text-muted-foreground max-w-32 truncate block">
                        {report.description || "-"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredReports.length === 0 && (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Aucun rapport trouvé avec les filtres actuels</p>
              <Button variant="outline" onClick={clearFilters} className="mt-4">
                Effacer les filtres
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 