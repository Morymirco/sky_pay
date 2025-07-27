"use client"

import RechargeRequestDetailModal from "@/components/recharge-requests/RechargeRequestDetailModal"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import {
  useApproveRechargeRequest,
  useChangeRechargeRequestStatus,
  useCreateRechargeRequest,
  useExportRechargeRequests,
  useRechargeRequest,
  useRechargeRequests,
  useRechargeRequestsStats, // Route /api/recharge-requests/stats
  // useRechargeRequestsOverview, // Route /api/recharge-requests/stats/overview (commentée)
  useRejectRechargeRequest
} from "@/lib/hooks/useRechargeRequests"
import { CreateRechargeRequestRequest } from "@/lib/services/rechargeRequests"
import { AlertTriangle, CheckCircle, Clock, Download, Plus, RefreshCw, X } from "lucide-react"
import { useState } from "react"

export default function RechargeRequestsPage() {
  // États locaux
  const [activeTab, setActiveTab] = useState("create")
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string | null>(null)
  const [urgentFilter, setUrgentFilter] = useState<boolean | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null)
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false)
  const [approvalNotes, setApprovalNotes] = useState("")
  const [requestToApprove, setRequestToApprove] = useState<string | null>(null)
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false)
  const [rejectionReason, setRejectionReason] = useState("")
  const [rejectionNotes, setRejectionNotes] = useState("")
  const [requestToReject, setRequestToReject] = useState<string | null>(null)

  // ✅ ACTIVÉ - Récupérer les vraies données depuis l'API
  const { data: response, isLoading, error } = useRechargeRequests(
    currentPage, 
    20, 
    JSON.stringify({ 
      search: searchTerm, 
      status: statusFilter, 
      isUrgent: urgentFilter 
    })
  )

  // ✅ ACTIVÉ - Utiliser les hooks React Query réels
  const { data: statsData } = useRechargeRequestsStats() // Route /api/recharge-requests/stats
  // const { data: overviewData } = useRechargeRequestsOverview() // Route /api/recharge-requests/stats/overview (commentée)
  const createRequest = useCreateRechargeRequest()
  const changeStatus = useChangeRechargeRequestStatus()
  const exportRequests = useExportRechargeRequests()
  const { data: detailData, isLoading: isLoadingDetail } = useRechargeRequest(selectedRequestId || "")
  const approveRequest = useApproveRechargeRequest()
  const rejectRequest = useRejectRechargeRequest()

  const requests = response?.data?.requests || []
  const pagination = response?.data?.pagination || { 
    currentPage: 1, 
    totalPages: 1, 
    totalItems: 0, 
    itemsPerPage: 20, 
    hasNextPage: false, 
    hasPrevPage: false, 
    nextPage: null, 
    prevPage: null 
  }

  // Form states
  const [newRequest, setNewRequest] = useState<CreateRechargeRequestRequest>({
    reason: "",
    amount: 0,
    paymentMethod: "bank_transfer",
    paymentReference: "",
    attachmentUrl: "",
    notes: "",
    isUrgent: false,
    priority: "medium"
  })

  const handleCreateRequest = () => {
    if (newRequest.reason && newRequest.amount > 0 && newRequest.paymentReference) {
      createRequest.mutate(newRequest, {
        onSuccess: () => {
          setNewRequest({
            reason: "",
            amount: 0,
            paymentMethod: "bank_transfer",
            paymentReference: "",
            attachmentUrl: "",
            notes: "",
            isUrgent: false,
            priority: "medium"
          })
          setActiveTab("accepted") // Basculer vers l'onglet des demandes acceptées
        }
      })
    }
  }

  const handleStatusChange = (id: string, newStatus: "pending" | "approved" | "rejected" | "completed") => {
    changeStatus.mutate({ id, status: newStatus })
  }

  const handleExport = () => {
    exportRequests.mutate('csv')
  }

  const handleViewDetail = (id: string) => {
    setSelectedRequestId(id)
    setIsDetailModalOpen(true)
  }

  const handleCloseDetail = () => {
    setIsDetailModalOpen(false)
    setSelectedRequestId(null)
  }

  const handleOpenApproveModal = (id: string) => {
    setRequestToApprove(id)
    setApprovalNotes("")
    setIsApproveModalOpen(true)
  }

  const handleApprove = () => {
    if (requestToApprove) {
      approveRequest.mutate(
        { id: requestToApprove, notes: approvalNotes },
        {
          onSuccess: () => {
            setIsApproveModalOpen(false)
            setRequestToApprove(null)
            setApprovalNotes("")
          }
        }
      )
    }
  }

  const handleOpenRejectModal = (id: string) => {
    setRequestToReject(id)
    setRejectionReason("")
    setRejectionNotes("")
    setIsRejectModalOpen(true)
  }

  const handleReject = () => {
    if (requestToReject && rejectionReason.trim()) {
      rejectRequest.mutate(
        { id: requestToReject, rejectionReason: rejectionReason.trim(), notes: rejectionNotes },
        {
          onSuccess: () => {
            setIsRejectModalOpen(false)
            setRequestToReject(null)
            setRejectionReason("")
            setRejectionNotes("")
          }
        }
      )
    }
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-500/20 text-red-400"
      case "medium": return "bg-yellow-500/20 text-yellow-400"
      case "low": return "bg-green-500/20 text-green-400"
      default: return "bg-muted text-muted-foreground"
    }
  }

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case "high": return "Élevée"
      case "medium": return "Moyenne"
      case "low": return "Faible"
      default: return priority
    }
  }

  // Statistiques depuis l'API
  const stats = statsData?.data || {
    totalRequests: 0,
    pendingRequests: 0,
    approvedRequests: 0,
    rejectedRequests: 0,
    completedRequests: 0,
    urgentRequests: 0,
    totalAmount: 0
  }

  // Nouvelles statistiques détaillées
  const overview = statsData?.data || {
    overview: {
      total: 0,
      pending: 0,
      approved: 0,
      rejected: 0,
      cancelled: 0
    },
    amounts: {
      totalApproved: 0,
      totalPending: 0
    },
    urgent: {
      count: 0
    }
  }

  // Filtrer les demandes selon l'onglet actif
  const getFilteredRequests = () => {
    switch (activeTab) {
      case "accepted":
        return requests.filter(r => r.status === "approved" || r.status === "completed")
      case "rejected":
        return requests.filter(r => r.status === "rejected")
      default:
        return requests
    }
  }

  const filteredRequests = getFilteredRequests()

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center py-8">
          <p className="text-red-500 mb-4">Erreur lors du chargement des demandes de rechargement</p>
          <Button onClick={() => window.location.reload()} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Réessayer
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-wider">DEMANDES DE RECHARGEMENT</h1>
          <p className="text-sm text-muted-foreground">Gérer les demandes de rechargement de compte</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport} disabled={exportRequests.isPending}>
            <Download className="w-4 h-4 mr-2" />
            {exportRequests.isPending ? "Export..." : "Export Excel"}
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground tracking-wider">TOTAL DEMANDES</p>
                <p className="text-2xl font-bold text-foreground font-mono">{stats.totalRequests}</p>
              </div>
              <Clock className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground tracking-wider">EN ATTENTE</p>
                <p className="text-2xl font-bold text-foreground font-mono">{stats.pendingRequests}</p>
                <p className="text-xs text-muted-foreground">
                  {stats.totalAmount.toLocaleString('fr-FR')}€
                </p>
              </div>
              <div className="w-8 h-8 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                <Clock className="w-4 h-4 text-yellow-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground tracking-wider">URGENTES</p>
                <p className="text-2xl font-bold text-foreground font-mono">{stats.urgentRequests}</p>
              </div>
              <div className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-4 h-4 text-red-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground tracking-wider">MONTANT APPROUVÉ</p>
                <p className="text-2xl font-bold text-foreground font-mono">
                  {stats.totalAmount.toLocaleString('fr-FR')}€
                </p>
              </div>
              <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Statistiques détaillées */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <h4 className="text-sm font-medium text-muted-foreground mb-3">Répartition par statut</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Approuvées</span>
                <span className="text-sm font-semibold text-green-600">{stats.approvedRequests}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Rejetées</span>
                <span className="text-sm font-semibold text-red-600">{stats.rejectedRequests}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Annulées</span>
                <span className="text-sm font-semibold text-orange-600">0</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <h4 className="text-sm font-medium text-muted-foreground mb-3">Montants</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Approuvé</span>
                <span className="text-sm font-semibold text-green-600">
                  {stats.totalAmount.toLocaleString('fr-FR')}€
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">En attente</span>
                <span className="text-sm font-semibold text-yellow-600">
                  {stats.totalAmount.toLocaleString('fr-FR')}€
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Urgentes</span>
                <span className="text-sm font-semibold text-red-600">{stats.urgentRequests}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <h4 className="text-sm font-medium text-muted-foreground mb-3">Taux de traitement</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Taux d'approbation</span>
                <span className="text-sm font-semibold text-blue-600">
                  {stats.totalRequests > 0 
                    ? Math.round((stats.approvedRequests / stats.totalRequests) * 100) 
                    : 0}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Taux de rejet</span>
                <span className="text-sm font-semibold text-red-600">
                  {stats.totalRequests > 0 
                    ? Math.round((stats.rejectedRequests / stats.totalRequests) * 100) 
                    : 0}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">% Urgentes</span>
                <span className="text-sm font-semibold text-orange-600">
                  {stats.totalRequests > 0 
                    ? Math.round((stats.urgentRequests / stats.totalRequests) * 100) 
                    : 0}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
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
                  {stats.approvedRequests} demandes
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
                  {stats.rejectedRequests} demandes
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      {activeTab !== "create" && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <Card className="lg:col-span-3 bg-card border-border">
            <CardContent className="p-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="relative">
                  <Input
                    placeholder="Rechercher une demande..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value)
                      setCurrentPage(1) // Reset to first page on search
                    }}
                    className="bg-muted border-neutral-600 text-foreground placeholder-neutral-400"
                  />
                </div>
                <Select
                  value={statusFilter === null ? 'all' : statusFilter}
                  onValueChange={(value) => setStatusFilter(value === 'all' ? null : value)}
                >
                  <SelectTrigger className="bg-muted border-neutral-600 text-foreground">
                    <SelectValue placeholder="Statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les statuts</SelectItem>
                    <SelectItem value="pending">En attente</SelectItem>
                    <SelectItem value="approved">Approuvé</SelectItem>
                    <SelectItem value="rejected">Rejeté</SelectItem>
                    <SelectItem value="completed">Terminé</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={urgentFilter === null ? 'all' : urgentFilter ? 'true' : 'false'}
                  onValueChange={(value) => setUrgentFilter(value === 'all' ? null : value === 'true' ? true : false)}
                >
                  <SelectTrigger className="bg-muted border-neutral-600 text-foreground">
                    <SelectValue placeholder="Urgence" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes</SelectItem>
                    <SelectItem value="true">Urgentes</SelectItem>
                    <SelectItem value="false">Normales</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

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
                  <Label htmlFor="reason" className="text-sm font-medium">Raison *</Label>
                  <Input
                    id="reason"
                    placeholder="Ex: Rechargement pour paiements de membres"
                    value={newRequest.reason}
                    onChange={(e) => setNewRequest({...newRequest, reason: e.target.value})}
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="paymentMethod" className="text-sm font-medium">Méthode de paiement *</Label>
                  <Select
                    value={newRequest.paymentMethod}
                    onValueChange={(value) => setNewRequest({...newRequest, paymentMethod: value})}
                  >
                    <SelectTrigger className="bg-muted border-neutral-600 text-foreground">
                      <SelectValue placeholder="Sélectionnez une méthode de paiement" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bank_transfer">Virement bancaire</SelectItem>
                      <SelectItem value="credit_card">Carte de crédit</SelectItem>
                      <SelectItem value="paypal">PayPal</SelectItem>
                      <SelectItem value="mobile_money">Mobile Money</SelectItem>
                      <SelectItem value="other">Autre</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="paymentReference" className="text-sm font-medium">Référence de paiement *</Label>
                  <Input
                    id="paymentReference"
                    placeholder="Ex: REF123456"
                    value={newRequest.paymentReference}
                    onChange={(e) => setNewRequest({...newRequest, paymentReference: e.target.value})}
                    className="mt-2"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="attachmentUrl" className="text-sm font-medium">URL de l'attachement</Label>
                <Input
                  id="attachmentUrl"
                  placeholder="Ex: https://example.com/attachment.pdf"
                  value={newRequest.attachmentUrl}
                  onChange={(e) => setNewRequest({...newRequest, attachmentUrl: e.target.value})}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="notes" className="text-sm font-medium">Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Notes additionnelles (optionnel)"
                  value={newRequest.notes}
                  onChange={(e) => setNewRequest({...newRequest, notes: e.target.value})}
                  rows={4}
                  className="mt-2"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div className="space-y-0.5">
                    <Label className="text-sm font-medium">Demande urgente</Label>
                    <p className="text-xs text-muted-foreground">Traiter en priorité</p>
                  </div>
                  <Switch
                    checked={newRequest.isUrgent}
                    onCheckedChange={(checked) => setNewRequest({...newRequest, isUrgent: checked})}
                  />
                </div>

                <div>
                  <Label htmlFor="priority" className="text-sm font-medium">Priorité</Label>
                  <Select
                    value={newRequest.priority}
                    onValueChange={(value) => setNewRequest({...newRequest, priority: value as "low" | "medium" | "high"})}
                  >
                    <SelectTrigger className="bg-muted border-neutral-600 text-foreground">
                      <SelectValue placeholder="Sélectionnez une priorité" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Faible</SelectItem>
                      <SelectItem value="medium">Moyenne</SelectItem>
                      <SelectItem value="high">Élevée</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-4 pt-4 border-t border-border">
                <Button 
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setNewRequest({
                      reason: "",
                      amount: 0,
                      paymentMethod: "bank_transfer",
                      paymentReference: "",
                      attachmentUrl: "",
                      notes: "",
                      isUrgent: false,
                      priority: "medium"
                    })
                  }}
                  className="flex-1"
                >
                  Réinitialiser
                </Button>
                <Button 
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                  disabled={!newRequest.reason || newRequest.amount <= 0 || !newRequest.paymentReference || createRequest.isPending}
                >
                  {createRequest.isPending ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Création...
                    </div>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-2" />
                      Créer la Demande
                    </>
                  )}
                </Button>
              </div>
              
              {createRequest.isError && (
                <p className="text-red-500 text-sm">{createRequest.error?.message || 'Erreur lors de la création'}</p>
              )}
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
                  {filteredRequests.length}
                </Badge>
              </div>
              <Button variant="outline" size="sm" onClick={handleExport} disabled={exportRequests.isPending}>
                <Download className="w-4 h-4 mr-2" />
                {exportRequests.isPending ? "Export..." : "Export"}
              </Button>
            </div>

            {isLoading && <p className="text-foreground">Chargement...</p>}
            {error && <p className="text-red-500">Erreur lors du chargement</p>}
            {!isLoading && !error && filteredRequests.length === 0 && (
              <p className="text-foreground">Aucune demande acceptée trouvée</p>
            )}

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground tracking-wider">RAISON</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground tracking-wider">MONTANT</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground tracking-wider">MÉTHODE</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground tracking-wider">RÉFÉRENCE</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground tracking-wider">PRIORITÉ</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground tracking-wider">URGENCE</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground tracking-wider">STATUT</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground tracking-wider">CRÉÉ LE</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground tracking-wider">ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRequests.map((request) => (
                    <tr key={request.id} className="border-b border-border/50">
                      <td className="py-3 px-4">
                        <div className="text-sm text-foreground font-medium">{request.reason}</div>
                        {request.notes && (
                          <div className="text-xs text-muted-foreground mt-1">{request.notes}</div>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-lg font-bold text-foreground">{request.amount.toLocaleString('fr-FR')}€</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-sm text-foreground capitalize">{request.paymentMethod.replace('_', ' ')}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-sm text-foreground font-mono">{request.paymentReference}</div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge className={getPriorityColor(request.priority)}>
                          {getPriorityLabel(request.priority)}
                        </Badge>
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
                        <div className="text-sm text-foreground">{new Date(request.createdAt).toLocaleDateString('fr-FR')}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewDetail(request.id.toString())}
                            className="h-8"
                          >
                            Voir détails
                          </Button>
                          {request.status === "pending" && (
                            <>
                              <Button
                                variant="default"
                                size="sm"
                                onClick={() => handleOpenApproveModal(request.id.toString())}
                                className="h-8 bg-green-600 hover:bg-green-700"
                                disabled={approveRequest.isPending}
                              >
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Approuver
                              </Button>
                              <Button
                                variant="default"
                                size="sm"
                                onClick={() => handleOpenRejectModal(request.id.toString())}
                                className="h-8 bg-red-600 hover:bg-red-700"
                                disabled={rejectRequest.isPending}
                              >
                                <X className="w-4 h-4 mr-1" />
                                Rejeter
                              </Button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {pagination.totalItems > pagination.itemsPerPage && (
              <div className="flex justify-between items-center mt-4">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(pagination.prevPage || 1)}
                  disabled={!pagination.hasPrevPage || isLoading}
                  className="border-border text-muted-foreground"
                >
                  Précédent
                </Button>
                <span className="text-foreground">
                  Page {pagination.currentPage} sur {pagination.totalPages} ({pagination.totalItems} éléments)
                </span>
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(pagination.nextPage || pagination.currentPage)}
                  disabled={!pagination.hasNextPage || isLoading}
                  className="border-border text-muted-foreground"
                >
                  Suivant
                </Button>
              </div>
            )}
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
                  {filteredRequests.length}
                </Badge>
              </div>
              <Button variant="outline" size="sm" onClick={handleExport} disabled={exportRequests.isPending}>
                <Download className="w-4 h-4 mr-2" />
                {exportRequests.isPending ? "Export..." : "Export"}
              </Button>
            </div>

            {isLoading && <p className="text-foreground">Chargement...</p>}
            {error && <p className="text-red-500">Erreur lors du chargement</p>}
            {!isLoading && !error && filteredRequests.length === 0 && (
              <p className="text-foreground">Aucune demande rejetée trouvée</p>
            )}

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground tracking-wider">RAISON</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground tracking-wider">MONTANT</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground tracking-wider">MÉTHODE</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground tracking-wider">RÉFÉRENCE</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground tracking-wider">PRIORITÉ</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground tracking-wider">URGENCE</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground tracking-wider">CRÉÉ LE</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground tracking-wider">ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRequests.map((request) => (
                    <tr key={request.id} className="border-b border-border/50">
                      <td className="py-3 px-4">
                        <div className="text-sm text-foreground font-medium">{request.reason}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-lg font-bold text-foreground">{request.amount.toLocaleString('fr-FR')}€</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-sm text-foreground capitalize">{request.paymentMethod.replace('_', ' ')}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-sm text-foreground font-mono">{request.paymentReference}</div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge className={getPriorityColor(request.priority)}>
                          {getPriorityLabel(request.priority)}
                        </Badge>
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
                        <div className="text-sm text-foreground">{new Date(request.createdAt).toLocaleDateString('fr-FR')}</div>
                      </td>
                      <td className="py-3 px-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewDetail(request.id.toString())}
                          className="h-8"
                        >
                          Voir détails
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {pagination.totalItems > pagination.itemsPerPage && (
              <div className="flex justify-between items-center mt-4">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(pagination.prevPage || 1)}
                  disabled={!pagination.hasPrevPage || isLoading}
                  className="border-border text-muted-foreground"
                >
                  Précédent
                </Button>
                <span className="text-foreground">
                  Page {pagination.currentPage} sur {pagination.totalPages} ({pagination.totalItems} éléments)
                </span>
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(pagination.nextPage || pagination.currentPage)}
                  disabled={!pagination.hasNextPage || isLoading}
                  className="border-border text-muted-foreground"
                >
                  Suivant
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Modal de détail */}
      <RechargeRequestDetailModal
        isOpen={isDetailModalOpen}
        onClose={handleCloseDetail}
        requestId={selectedRequestId}
      />

      {/* Modal d'approbation */}
      <Dialog open={isApproveModalOpen} onOpenChange={setIsApproveModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              Approuver la demande
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="approval-notes">Notes d'approbation (optionnel)</Label>
              <Textarea
                id="approval-notes"
                value={approvalNotes}
                onChange={(e) => setApprovalNotes(e.target.value)}
                placeholder="Ajouter des notes pour cette approbation..."
                rows={3}
              />
            </div>
            
            <div className="flex gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setIsApproveModalOpen(false)}
                className="flex-1"
                disabled={approveRequest.isPending}
              >
                Annuler
              </Button>
              <Button
                onClick={handleApprove}
                className="flex-1 bg-green-600 hover:bg-green-700"
                disabled={approveRequest.isPending}
              >
                {approveRequest.isPending ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Approbation...
                  </div>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Approuver
                  </>
                )}
              </Button>
            </div>
            
            {approveRequest.isError && (
              <p className="text-red-500 text-sm">{approveRequest.error?.message || 'Erreur lors de l\'approbation'}</p>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de rejet */}
      <Dialog open={isRejectModalOpen} onOpenChange={setIsRejectModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <X className="w-5 h-5 text-red-500" />
              Rejeter la demande
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="rejection-reason">Raison du rejet *</Label>
              <Textarea
                id="rejection-reason"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Expliquer la raison du rejet..."
                rows={3}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="rejection-notes">Notes supplémentaires (optionnel)</Label>
              <Textarea
                id="rejection-notes"
                value={rejectionNotes}
                onChange={(e) => setRejectionNotes(e.target.value)}
                placeholder="Ajouter des notes supplémentaires..."
                rows={2}
              />
            </div>
            
            <div className="flex gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setIsRejectModalOpen(false)}
                className="flex-1"
                disabled={rejectRequest.isPending}
              >
                Annuler
              </Button>
              <Button
                onClick={handleReject}
                className="flex-1 bg-red-600 hover:bg-red-700"
                disabled={rejectRequest.isPending || !rejectionReason.trim()}
              >
                {rejectRequest.isPending ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Rejet...
                  </div>
                ) : (
                  <>
                    <X className="w-4 h-4 mr-2" />
                    Rejeter
                  </>
                )}
              </Button>
            </div>
            
            {rejectRequest.isError && (
              <p className="text-red-500 text-sm">{rejectRequest.error?.message || 'Erreur lors du rejet'}</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
} 