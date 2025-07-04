"use client"

import { useState, useRef } from "react"
import { CreditCard, Download, Upload, CheckCircle, AlertCircle, DollarSign, FileSpreadsheet, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"

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
  const [isImporting, setIsImporting] = useState(false)
  const [importedData, setImportedData] = useState<PaymentMember[]>([])
  const [showImportPreview, setShowImportPreview] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

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
      "ID,Nom,Fournisseur,Numéro de compte,Montant (€),Statut\n" +
      members.map(member => 
        `${member.id},${member.name},${member.provider},${member.accountNumber},${member.amount},${member.status}`
      ).join("\n")
    
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `paiements_sky_pay_${new Date().toISOString().split('T')[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsImporting(true)
    const reader = new FileReader()

    reader.onload = (e) => {
      const text = e.target?.result as string
      const lines = text.split('\n')
      const headers = lines[0].split(',')
      
      const importedMembers: PaymentMember[] = []
      
      for (let i = 1; i < lines.length; i++) {
        if (lines[i].trim()) {
          const values = lines[i].split(',')
          if (values.length >= 5) {
            importedMembers.push({
              id: values[0] || `import_${i}`,
              name: values[1] || '',
              provider: (values[2] as "Kulu" | "Soutra Money" | "Orange Money") || "Orange Money",
              accountNumber: values[3] || '',
              amount: parseFloat(values[4]) || 0,
              status: "pending" as const
            })
          }
        }
      }
      
      setImportedData(importedMembers)
      setShowImportPreview(true)
      setIsImporting(false)
    }

    reader.readAsText(file)
  }

  const confirmImport = () => {
    setMembers([...members, ...importedData])
    setImportedData([])
    setShowImportPreview(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const cancelImport = () => {
    setImportedData([])
    setShowImportPreview(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const updateAmount = (id: string, newAmount: number) => {
    setMembers(members.map(member =>
      member.id === id ? { ...member, amount: newAmount } : member
    ))
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
      case "pending": return "bg-yellow-500/20 text-yellow-400"
      case "confirmed": return "bg-blue-500/20 text-blue-400"
      case "completed": return "bg-green-500/20 text-green-400"
      default: return "bg-neutral-500/20 text-muted-foreground"
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-wider">PAYER LES BÉNÉFICIAIRES</h1>
          <p className="text-sm text-muted-foreground">Gérez les paiements vers vos bénéficiaires</p>
        </div>
        <div className="flex gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={handleFileUpload}
            className="hidden"
          />
          <Button 
            variant="outline" 
            onClick={() => fileInputRef.current?.click()}
            disabled={isImporting}
            className="border-border text-muted-foreground"
          >
            {isImporting ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-neutral-400 border-t-transparent rounded-full animate-spin"></div>
                IMPORT...
              </div>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Import Excel
              </>
            )}
          </Button>
          <Button variant="outline" onClick={exportToExcel} className="border-border text-muted-foreground">
            <Download className="w-4 h-4 mr-2" />
            Export Excel
          </Button>
        </div>
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
              <AlertCircle className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Import Preview */}
      {showImportPreview && (
        <Card className="bg-card border-border border-blue-500/50">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-blue-400 tracking-wider flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4" />
              PRÉVISUALISATION DE L'IMPORT ({importedData.length} bénéficiaires)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2 px-4 text-xs font-medium text-muted-foreground">Nom</th>
                      <th className="text-left py-2 px-4 text-xs font-medium text-muted-foreground">Fournisseur</th>
                      <th className="text-left py-2 px-4 text-xs font-medium text-muted-foreground">Compte</th>
                      <th className="text-left py-2 px-4 text-xs font-medium text-muted-foreground">Montant</th>
                    </tr>
                  </thead>
                  <tbody>
                    {importedData.slice(0, 5).map((member, index) => (
                      <tr key={index} className="table-row-hover">
                        <td className="py-2 px-4 text-sm text-foreground">{member.name}</td>
                        <td className="py-2 px-4">
                          <Badge className={getProviderColor(member.provider)}>
                            {member.provider}
                          </Badge>
                        </td>
                        <td className="py-2 px-4 text-sm text-foreground font-mono">{member.accountNumber}</td>
                        <td className="py-2 px-4 text-sm text-foreground font-bold">{member.amount}€</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {importedData.length > 5 && (
                  <p className="text-xs text-muted-foreground mt-2">
                    ... et {importedData.length - 5} autres bénéficiaires
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                <Button onClick={confirmImport} className="bg-blue-500 hover:bg-blue-600 text-foreground">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Confirmer l'Import
                </Button>
                <Button variant="outline" onClick={cancelImport} className="border-border text-muted-foreground">
                  <X className="w-4 h-4 mr-2" />
                  Annuler
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Payment List */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-foreground tracking-wider">LISTE DES PAIEMENTS</CardTitle>
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
                </tr>
              </thead>
              <tbody>
                {members.map((member) => (
                  <tr
                    key={member.id}
                    className="table-row-hover"
                  >
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
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          value={member.amount}
                          onChange={(e) => updateAmount(member.id, parseFloat(e.target.value) || 0)}
                          className="w-20 h-8 text-sm"
                          min="0"
                          step="0.01"
                        />
                        <span className="text-sm text-muted-foreground">€</span>
                      </div>
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
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-foreground tracking-wider">CONFIRMATION DES PAIEMENTS</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                Total à payer : <span className="text-foreground font-bold">{totalAmount}€</span>
              </p>
              <p className="text-xs text-muted-foreground">
                {pendingCount} paiement(s) en attente de confirmation
              </p>
            </div>
            <Button
              onClick={handleConfirmPayments}
              disabled={isConfirming || pendingCount === 0}
              className="bg-blue-500 hover:bg-blue-600 text-foreground"
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