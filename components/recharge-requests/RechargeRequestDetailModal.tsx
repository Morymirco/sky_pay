"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { useRechargeRequest } from "@/lib/hooks/useRechargeRequests"
import { AlertTriangle, Calendar, CreditCard, Download, FileText, User, X } from "lucide-react"

interface RechargeRequestDetailModalProps {
  isOpen: boolean
  onClose: () => void
  requestId: string | null
}

export default function RechargeRequestDetailModal({ 
  isOpen, 
  onClose, 
  requestId 
}: RechargeRequestDetailModalProps) {
  const { data: response, isLoading, error } = useRechargeRequest(requestId || "")
  const request = response?.data

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

  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case "bank_transfer": return "Virement bancaire"
      case "credit_card": return "Carte de crédit"
      case "paypal": return "PayPal"
      case "mobile_money": return "Mobile Money"
      case "other": return "Autre"
      default: return method.replace('_', ' ')
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (!requestId) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Détails de la demande de rechargement
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-6 w-6"
            >
              <X className="w-4 h-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              Chargement des détails...
            </div>
          </div>
        )}

        {error && (
          <div className="text-center py-8">
            <p className="text-red-500 mb-4">Erreur lors du chargement des détails</p>
            <Button onClick={() => window.location.reload()} variant="outline">
              Réessayer
            </Button>
          </div>
        )}

        {request && (
          <div className="space-y-6">
            {/* En-tête avec informations principales */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{request.reason}</CardTitle>
                    <p className="text-sm text-muted-foreground">Demande #{request.id}</p>
                  </div>
                  <div className="flex gap-2">
                    <Badge className={getStatusColor(request.status)}>
                      {getStatusLabel(request.status)}
                    </Badge>
                    {request.isUrgent && (
                      <Badge className="bg-red-500/20 text-red-400">
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        Urgent
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-foreground">
                      {request.amount.toLocaleString('fr-FR')}€
                    </div>
                    <div className="text-sm text-muted-foreground">Montant demandé</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-foreground">
                      {getPaymentMethodLabel(request.paymentMethod)}
                    </div>
                    <div className="text-sm text-muted-foreground">Méthode de paiement</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-foreground">
                      {getPriorityLabel(request.priority)}
                    </div>
                    <div className="text-sm text-muted-foreground">Priorité</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Informations détaillées */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Colonne gauche */}
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <CreditCard className="w-4 h-4" />
                      Informations de paiement
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Référence:</span>
                      <span className="text-sm font-mono text-foreground">{request.paymentReference}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Méthode:</span>
                      <span className="text-sm text-foreground">{getPaymentMethodLabel(request.paymentMethod)}</span>
                    </div>
                    {request.attachmentUrl && (
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Attachement:</span>
                        <Button variant="link" size="sm" className="h-auto p-0">
                          <Download className="w-3 h-3 mr-1" />
                          Télécharger
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Informations de traitement
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Demandé par:</span>
                      <span className="text-sm text-foreground">Utilisateur #{request.requestedById}</span>
                    </div>
                    {request.processedBy && (
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Traité par:</span>
                        <span className="text-sm text-foreground">Utilisateur #{request.processedBy}</span>
                      </div>
                    )}
                    {request.rejectionReason && (
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Raison du rejet:</span>
                        <span className="text-sm text-red-500">{request.rejectionReason}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Colonne droite */}
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Dates et statut
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Créé le:</span>
                      <span className="text-sm text-foreground">{formatDate(request.createdAt)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Modifié le:</span>
                      <span className="text-sm text-foreground">{formatDate(request.updatedAt)}</span>
                    </div>
                    {request.processedAt && (
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Traité le:</span>
                        <span className="text-sm text-foreground">{formatDate(request.processedAt)}</span>
                      </div>
                    )}
                    <Separator />
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Statut:</span>
                      <Badge className={getStatusColor(request.status)}>
                        {getStatusLabel(request.status)}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Priorité:</span>
                      <Badge className={getPriorityColor(request.priority)}>
                        {getPriorityLabel(request.priority)}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Urgence:</span>
                      <Badge className={request.isUrgent ? "bg-red-500/20 text-red-400" : "bg-green-500/20 text-green-400"}>
                        {request.isUrgent ? "Urgent" : "Normal"}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                {request.notes && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Notes
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-foreground">{request.notes}</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>

            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={onClose}>
                    Fermer
                  </Button>
                  {request.attachmentUrl && (
                    <Button variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      Télécharger l'attachement
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
} 