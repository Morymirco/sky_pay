"use client"

import { useState } from "react"
import { RefreshCw, Download, AlertTriangle, Clock, Upload, Plus, CheckCircle, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

interface RechargeRequest {
  id: string
  label: string
  amount: number
  attachedFile?: string
  note?: string
  status: "pending" | "approved" | "rejected" | "completed"
  isUrgent: boolean
  createdAt: string
  updatedAt?: string
  createdBy: string
  processedBy?: string
}

export default function RechargeRequestsPage() {
  const [requests, setRequests] = useState<RechargeRequest[]>([
    {
      id: "1",
      label: "Rechargement compte principal",
      amount: 5000.00,
      attachedFile: "justificatif_recharge_001.pdf",
      note: "Rechargement urgent pour paiements en cours",
      status: "pending",
      isUrgent: true,
      createdAt: "2024-01-25 10:30",
      createdBy: "Admin"
    },
    {
      id: "2",
      label: "Rechargement compte secondaire",
      amount: 2500.00,
      attachedFile: "justificatif_recharge_002.pdf",
      note: "Rechargement pour maintenance",
      status: "approved",
      isUrgent: false,
      createdAt: "2024-01-24 14:15",
      updatedAt: "2024-01-25 09:00",
      createdBy: "Manager",
      processedBy: "Admin"
    },
    {
      id: "3",
      label: "Rechargement compte d'urgence",
      amount: 10000.00,
      attachedFile: "justificatif_recharge_003.pdf",
      note: "Rechargement pour paiements de masse",
      status: "completed",
      isUrgent: true,
      createdAt: "2024-01-23 16:45",
      updatedAt: "2024-01-24 11:30",
      createdBy: "Admin",
      processedBy: "Supervisor"
    },
    {
      id: "4",
      label: "Rechargement compte test",
      amount: 1000.00,
      note: "Rechargement pour tests système",
      status: "rejected",
      isUrgent: false,
      createdAt: "2024-01-22 12:00",
      updatedAt: "2024-01-23 10:15",
      createdBy: "Tester",
      processedBy: "Admin"
    }
  ])



  // Form states
  const [newRequest, setNewRequest] = useState({
    label: "",
    amount: 0,
    attachedFile: "",
    note: "",
    isUrgent: false
  })

  // Tab state
  const [activeTab, setActiveTab] = useState("create")



  const handleCreateRequest = () => {
    if (newRequest.label && newRequest.amount > 0) {
      const request: RechargeRequest = {
        id: Date.now().toString(),
        label: newRequest.label,
        amount: newRequest.amount,
        attachedFile: newRequest.attachedFile || undefined,
        note: newRequest.note || undefined,
        status: "pending",
        isUrgent: newRequest.isUrgent,
        createdAt: new Date().toLocaleString('fr-FR'),
        createdBy: "Admin"
      }
      
      setRequests([request, ...requests])
      setNewRequest({
        label: "",
        amount: 0,
        attachedFile: "",
        note: "",
        isUrgent: false
      })
      
      // Afficher un message de succès
      alert("Demande de rechargement soumise avec succès!")
    }
  }

  const handleStatusChange = (id: string, newStatus: RechargeRequest['status']) => {
    setRequests(prev => prev.map(request => 
      request.id === id 
        ? { 
            ...request, 
            status: newStatus,
            updatedAt: new Date().toLocaleString('fr-FR'),
            processedBy: "Admin"
          }
        : request
    ))
  }



  const exportToExcel = () => {
    const csvContent = "data:text/csv;charset=utf-8," +
      "ID,Label,Montant,Fichier,Note,Statut,Urgence,Créé le,Créé par\n" +
      requests.map(request => 
        `${request.id},${request.label},${request.amount.toFixed(2)}€,${request.attachedFile || 'Aucun'},${request.note || 'Aucune'},${request.status},${request.isUrgent ? 'Oui' : 'Non'},${request.createdAt},${request.createdBy}`
      ).join("\n")
    
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", "demandes_rechargement.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-500/20 text-yellow-400"
      case "approved": return "bg-blue-500/20 text-blue-400"
      case "rejected": return "bg-red-500/20 text-red-400"
      case "completed": return "bg-green-500/20 text-green-400"
      default: return "bg-muted text-muted-foreground"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending": return "En attente"
      case "approved": return "Approuvé"
      case "rejected": return "Rejeté"
      case "completed": return "Terminé"
      default: return status
    }
  }

  const pendingCount = requests.filter(r => r.status === "pending").length
  const urgentCount = requests.filter(r => r.isUrgent).length
  const totalAmount = requests.reduce((sum, r) => sum + r.amount, 0)

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-wider">DEMANDES DE RECHARGEMENT</h1>
          <p className="text-sm text-muted-foreground">Gérer les demandes de rechargement de compte</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportToExcel}>
            <Download className="w-4 h-4 mr-2" />
            Export Excel
          </Button>

        </div>
      </div>

      {/* Cards Navigation */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card 
          className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
            activeTab === "create" 
              ? "ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-950/20" 
              : "hover:bg-muted/50"
          }`}
          onClick={() => setActiveTab("create")}
        >
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                activeTab === "create" 
                  ? "bg-blue-100 dark:bg-blue-900/30" 
                  : "bg-muted"
              }`}>
                <Plus className={`w-6 h-6 ${
                  activeTab === "create" 
                    ? "text-blue-600 dark:text-blue-400" 
                    : "text-muted-foreground"
                }`} />
              </div>
              <div>
                <h3 className={`font-semibold ${
                  activeTab === "create" 
                    ? "text-blue-600 dark:text-blue-400" 
                    : "text-foreground"
                }`}>
                  Créer une Commande
                </h3>
                <p className="text-sm text-muted-foreground">Nouvelle demande de rechargement</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card 
          className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
            activeTab === "accepted" 
              ? "ring-2 ring-green-500 bg-green-50 dark:bg-green-950/20" 
              : "hover:bg-muted/50"
          }`}
          onClick={() => setActiveTab("accepted")}
        >
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                activeTab === "accepted" 
                  ? "bg-green-100 dark:bg-green-900/30" 
                  : "bg-muted"
              }`}>
                <CheckCircle className={`w-6 h-6 ${
                  activeTab === "accepted" 
                    ? "text-green-600 dark:text-green-400" 
                    : "text-muted-foreground"
                }`} />
              </div>
              <div>
                <h3 className={`font-semibold ${
                  activeTab === "accepted" 
                    ? "text-green-600 dark:text-green-400" 
                    : "text-foreground"
                }`}>
                  Demandes Acceptées
                </h3>
                <p className="text-sm text-muted-foreground">
                  {requests.filter(r => r.status === "approved" || r.status === "completed").length} demandes
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card 
          className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
            activeTab === "rejected" 
              ? "ring-2 ring-red-500 bg-red-50 dark:bg-red-950/20" 
              : "hover:bg-muted/50"
          }`}
          onClick={() => setActiveTab("rejected")}
        >
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                activeTab === "rejected" 
                  ? "bg-red-100 dark:bg-red-900/30" 
                  : "bg-muted"
              }`}>
                <X className={`w-6 h-6 ${
                  activeTab === "rejected" 
                    ? "text-red-600 dark:text-red-400" 
                    : "text-muted-foreground"
                }`} />
              </div>
              <div>
                <h3 className={`font-semibold ${
                  activeTab === "rejected" 
                    ? "text-red-600 dark:text-red-400" 
                    : "text-foreground"
                }`}>
                  Demandes Rejetées
                </h3>
                <p className="text-sm text-muted-foreground">
                  {requests.filter(r => r.status === "rejected").length} demandes
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content based on active tab */}
      {activeTab === "create" && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <Plus className="w-5 h-5 text-blue-500" />
              <h3 className="text-lg font-semibold">Créer une Demande de Rechargement</h3>
            </div>
            
            <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); handleCreateRequest(); }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="label" className="text-sm font-medium">Label *</Label>
                  <Input
                    id="label"
                    placeholder="Ex: Rechargement compte principal"
                    value={newRequest.label}
                    onChange={(e) => setNewRequest({...newRequest, label: e.target.value})}
                    className="mt-2"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="amount" className="text-sm font-medium">Montant à recharger (€) *</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="0.00"
                    value={newRequest.amount}
                    onChange={(e) => setNewRequest({...newRequest, amount: parseFloat(e.target.value) || 0})}
                    className="mt-2"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="file" className="text-sm font-medium">Fichier joint</Label>
                <div className="mt-2 flex items-center gap-2">
                  <Input
                    id="file"
                    placeholder="Nom du fichier (optionnel)"
                    value={newRequest.attachedFile}
                    onChange={(e) => setNewRequest({...newRequest, attachedFile: e.target.value})}
                  />
                  <Button type="button" variant="outline" size="sm">
                    <Upload className="w-4 h-4 mr-2" />
                    Parcourir
                  </Button>
                </div>
              </div>

              <div>
                <Label htmlFor="note" className="text-sm font-medium">Note</Label>
                <Textarea
                  id="note"
                  placeholder="Note additionnelle (optionnel)"
                  value={newRequest.note}
                  onChange={(e) => setNewRequest({...newRequest, note: e.target.value})}
                  rows={4}
                  className="mt-2"
                />
              </div>

              <div className="flex items-center space-x-2 p-4 bg-muted/30 rounded-lg">
                <Switch
                  id="urgent"
                  checked={newRequest.isUrgent}
                  onCheckedChange={(checked) => setNewRequest({...newRequest, isUrgent: checked})}
                />
                <Label htmlFor="urgent" className="text-sm font-medium">Demande urgente</Label>
                {newRequest.isUrgent && (
                  <Badge className="ml-2 bg-red-500/20 text-red-400">
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    Urgent
                  </Badge>
                )}
              </div>

              <div className="flex gap-4 pt-4 border-t border-border">
                <Button 
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setNewRequest({
                      label: "",
                      amount: 0,
                      attachedFile: "",
                      note: "",
                      isUrgent: false
                    })
                  }}
                  className="flex-1"
                >
                  Réinitialiser
                </Button>
                <Button 
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                  disabled={!newRequest.label || newRequest.amount <= 0}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Créer la Demande
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {activeTab === "accepted" && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <h3 className="text-lg font-semibold">Demandes Acceptées</h3>
                <Badge className="bg-green-500/20 text-green-400">
                  {requests.filter(r => r.status === "approved" || r.status === "completed").length}
                </Badge>
              </div>
              <Button variant="outline" size="sm" onClick={exportToExcel}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground tracking-wider">LABEL</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground tracking-wider">MONTANT</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground tracking-wider">FICHIER</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground tracking-wider">URGENCE</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground tracking-wider">STATUT</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground tracking-wider">CRÉÉ LE</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.filter(r => r.status === "approved" || r.status === "completed").map((request) => (
                    <tr key={request.id} className="border-b border-border/50">
                      <td className="py-3 px-4">
                        <div className="text-sm text-foreground font-medium">{request.label}</div>
                        <div className="text-xs text-muted-foreground">par {request.createdBy}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-lg font-bold text-foreground">{request.amount.toFixed(2)}€</div>
                      </td>
                      <td className="py-3 px-4">
                        {request.attachedFile ? (
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-foreground">{request.attachedFile}</span>
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground">Aucun fichier</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {request.isUrgent ? (
                          <Badge className="bg-red-500/20 text-red-400">
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            Urgent
                          </Badge>
                        ) : (
                          <Badge variant="secondary">Normal</Badge>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <Badge className={getStatusColor(request.status)}>
                          {getStatusLabel(request.status)}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-sm text-foreground">{request.createdAt}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === "rejected" && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <X className="w-5 h-5 text-red-500" />
                <h3 className="text-lg font-semibold">Demandes Rejetées</h3>
                <Badge className="bg-red-500/20 text-red-400">
                  {requests.filter(r => r.status === "rejected").length}
                </Badge>
              </div>
              <Button variant="outline" size="sm" onClick={exportToExcel}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground tracking-wider">LABEL</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground tracking-wider">MONTANT</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground tracking-wider">FICHIER</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground tracking-wider">URGENCE</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground tracking-wider">CRÉÉ LE</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground tracking-wider">ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.filter(r => r.status === "rejected").map((request) => (
                    <tr key={request.id} className="border-b border-border/50">
                      <td className="py-3 px-4">
                        <div className="text-sm text-foreground font-medium">{request.label}</div>
                        <div className="text-xs text-muted-foreground">par {request.createdBy}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-lg font-bold text-foreground">{request.amount.toFixed(2)}€</div>
                      </td>
                      <td className="py-3 px-4">
                        {request.attachedFile ? (
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-foreground">{request.attachedFile}</span>
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground">Aucun fichier</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {request.isUrgent ? (
                          <Badge className="bg-red-500/20 text-red-400">
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            Urgent
                          </Badge>
                        ) : (
                          <Badge variant="secondary">Normal</Badge>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-sm text-foreground">{request.createdAt}</div>
                      </td>
                      <td className="py-3 px-4">
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => handleStatusChange(request.id, "pending")}
                          className="h-8 bg-blue-600 hover:bg-blue-700"
                        >
                          <RefreshCw className="w-4 h-4 mr-1" />
                          Relancer
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}


    </div>
  )
} 