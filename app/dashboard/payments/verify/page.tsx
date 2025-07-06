"use client"

import { useState } from "react"
import { CheckCircle, X, Download, CreditCard, DollarSign, Clock, CheckSquare, List, AlertCircle, Users, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface PaymentBatch {
  id: string
  date: string
  totalAmount: number
  reference: string
  status: "pending" | "verified" | "cancelled"
  beneficiaryCount: number
  verifiedAt?: string
  verifiedBy?: string
  description?: string
}

interface Beneficiary {
  id: string
  name: string
  provider: "Kulu" | "Soutra Money" | "Orange Money"
  accountNumber: string
  email: string
  phone: string
  amount: number
  status: "active" | "inactive"
}

export default function VerifyPaymentPage() {
  const [activeTab, setActiveTab] = useState("pending-payments")
  
  // Modal states
  const [showBeneficiariesModal, setShowBeneficiariesModal] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState<PaymentBatch | null>(null)
  
  // Données des bénéficiaires (simulation - en réalité viendrait de l'API)
  const [beneficiariesData] = useState<{ [key: string]: Beneficiary[] }>({
    "PAY-2024-001": [
    {
      id: "1",
      name: "Jean Dupont",
      provider: "Orange Money",
      accountNumber: "OM123456789",
        email: "jean.dupont@email.com",
        phone: "+33 6 12 34 56 78",
      amount: 150.00,
        status: "active"
    },
    {
      id: "2",
      name: "Marie Martin",
      provider: "Kulu",
      accountNumber: "KL987654321",
        email: "marie.martin@email.com",
        phone: "+33 6 98 76 54 32",
      amount: 200.00,
        status: "active"
      }
    ],
    "PAY-2024-002": [
    {
      id: "3",
      name: "Pierre Durand",
      provider: "Soutra Money",
      accountNumber: "SM456789123",
        email: "pierre.durand@email.com",
        phone: "+33 6 55 44 33 22",
      amount: 175.50,
        status: "active"
      }
    ],
    "PAY-2024-003": [
      {
        id: "4",
        name: "Sophie Bernard",
        provider: "Orange Money",
        accountNumber: "OM987654321",
        email: "sophie.bernard@email.com",
        phone: "+33 6 11 22 33 44",
        amount: 225.00,
        status: "active"
      },
      {
        id: "5",
        name: "Lucas Moreau",
        provider: "Kulu",
        accountNumber: "KL123456789",
        email: "lucas.moreau@email.com",
        phone: "+33 6 99 88 77 66",
        amount: 180.75,
        status: "active"
      },
      {
        id: "6",
        name: "Emma Dubois",
        provider: "Soutra Money",
        accountNumber: "SM789123456",
        email: "emma.dubois@email.com",
        phone: "+33 6 77 66 55 44",
        amount: 195.25,
        status: "active"
      }
    ]
  })
  
  // Lots de paiements en attente de vérification
  const [pendingPayments, setPendingPayments] = useState<PaymentBatch[]>([
    {
      id: "1",
      date: "2024-01-15",
      totalAmount: 350.00,
      reference: "PAY-2024-001",
      status: "pending",
      beneficiaryCount: 2,
      description: "Paiement salaires Janvier 2024"
    },
    {
      id: "2",
      date: "2024-01-16",
      totalAmount: 175.50,
      reference: "PAY-2024-002",
      status: "pending",
      beneficiaryCount: 1,
      description: "Paiement fournisseur"
    },
    {
      id: "3",
      date: "2024-01-17",
      totalAmount: 601.00,
      reference: "PAY-2024-003",
      status: "pending",
      beneficiaryCount: 3,
      description: "Paiement prestataires"
    },
    {
      id: "4",
      date: "2024-01-18",
      totalAmount: 225.00,
      reference: "PAY-2024-004",
      status: "pending",
      beneficiaryCount: 1,
      description: "Paiement consultant"
    },
    {
      id: "5",
      date: "2024-01-19",
      totalAmount: 180.75,
      reference: "PAY-2024-005",
      status: "pending",
      beneficiaryCount: 1,
      description: "Paiement freelance"
    },
    {
      id: "6",
      date: "2024-01-20",
      totalAmount: 195.25,
      reference: "PAY-2024-006",
      status: "pending",
      beneficiaryCount: 1,
      description: "Paiement service"
    }
  ])

  // Lots de paiements vérifiés
  const [verifiedPayments, setVerifiedPayments] = useState<PaymentBatch[]>([
    {
      id: "7",
      date: "2024-01-21",
      totalAmount: 210.50,
      reference: "PAY-2024-007",
      status: "verified",
      beneficiaryCount: 1,
      description: "Paiement salaire",
      verifiedAt: "2024-01-21 14:30",
      verifiedBy: "Admin"
    },
    {
      id: "8",
      date: "2024-01-22",
      totalAmount: 165.80,
      reference: "PAY-2024-008",
      status: "verified",
      beneficiaryCount: 1,
      description: "Paiement fournisseur",
      verifiedAt: "2024-01-22 09:15",
      verifiedBy: "Admin"
    },
    {
      id: "9",
      date: "2024-01-23",
      totalAmount: 185.90,
      reference: "PAY-2024-009",
      status: "verified",
      beneficiaryCount: 1,
      description: "Paiement consultant",
      verifiedAt: "2024-01-23 16:45",
      verifiedBy: "Admin"
    },
    {
      id: "10",
      date: "2024-01-24",
      totalAmount: 220.30,
      reference: "PAY-2024-010",
      status: "verified",
      beneficiaryCount: 1,
      description: "Paiement service",
      verifiedAt: "2024-01-24 11:20",
      verifiedBy: "Admin"
    }
  ])

  // Pagination states
  const [currentPendingPage, setCurrentPendingPage] = useState(1)
  const [currentVerifiedPage, setCurrentVerifiedPage] = useState(1)
  const [itemsPerPage] = useState(5)

  // Calculs
  const totalPendingAmount = pendingPayments.reduce((sum, payment) => sum + payment.totalAmount, 0)
  const totalVerifiedAmount = verifiedPayments.reduce((sum, payment) => sum + payment.totalAmount, 0)
  const pendingCount = pendingPayments.length
  const verifiedCount = verifiedPayments.length

  // Pagination logic for pending payments
  const indexOfLastPending = currentPendingPage * itemsPerPage
  const indexOfFirstPending = indexOfLastPending - itemsPerPage
  const currentPendingPayments = pendingPayments.slice(indexOfFirstPending, indexOfLastPending)
  const totalPendingPages = Math.ceil(pendingPayments.length / itemsPerPage)

  // Pagination logic for verified payments
  const indexOfLastVerified = currentVerifiedPage * itemsPerPage
  const indexOfFirstVerified = indexOfLastVerified - itemsPerPage
  const currentVerifiedPayments = verifiedPayments.slice(indexOfFirstVerified, indexOfLastVerified)
  const totalVerifiedPages = Math.ceil(verifiedPayments.length / itemsPerPage)

  const handleValidate = (id: string) => {
    const paymentToVerify = pendingPayments.find(p => p.id === id)
    if (paymentToVerify) {
      const verifiedPayment: PaymentBatch = {
        ...paymentToVerify,
        status: "verified",
        verifiedAt: new Date().toLocaleString('fr-FR'),
        verifiedBy: "Admin"
      }
      
      setVerifiedPayments([verifiedPayment, ...verifiedPayments])
      setPendingPayments(pendingPayments.filter(p => p.id !== id))
    }
  }

  const handleCancel = (id: string) => {
    const paymentToCancel = pendingPayments.find(p => p.id === id)
    if (paymentToCancel) {
      const cancelledPayment: PaymentBatch = {
        ...paymentToCancel,
        status: "cancelled",
        verifiedAt: new Date().toLocaleString('fr-FR'),
        verifiedBy: "Admin"
      }
      
      setVerifiedPayments([cancelledPayment, ...verifiedPayments])
      setPendingPayments(pendingPayments.filter(p => p.id !== id))
    }
  }

  const exportToExcel = (type: 'pending' | 'verified') => {
    const data = type === 'pending' ? pendingPayments : verifiedPayments
    const csvContent = "data:text/csv;charset=utf-8," +
      "ID,Nom,Fournisseur,Compte,Montant,Date,Référence,Statut\n" +
      data.map(payment => 
        `${payment.id},${payment.name},${payment.provider},${payment.accountNumber},${payment.amount}€,${payment.date},${payment.reference},${payment.status}`
      ).join("\n")
    
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `paiements_${type === 'pending' ? 'en_attente' : 'verifies'}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleRowClick = (payment: PaymentBatch) => {
    setSelectedPayment(payment)
    setShowBeneficiariesModal(true)
  }

  const closeModal = () => {
    setShowBeneficiariesModal(false)
    setSelectedPayment(null)
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
      case "verified": return "bg-green-500/20 text-green-400"
      case "pending": return "bg-yellow-500/20 text-yellow-400"
      case "cancelled": return "bg-red-500/20 text-red-400"
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
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => exportToExcel('pending')}>
            <Download className="w-4 h-4 mr-2" />
            Export En Attente
          </Button>
          <Button variant="outline" onClick={() => exportToExcel('verified')}>
          <Download className="w-4 h-4 mr-2" />
            Export Vérifiés
        </Button>
        </div>
      </div>

      {/* Stats Cards - Clickable Panels */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card 
          className={`bg-card border-border cursor-pointer transition-all duration-200 hover:shadow-lg ${
            activeTab === "pending-payments" ? "ring-2 ring-yellow-500" : ""
          }`}
          onClick={() => setActiveTab("pending-payments")}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground tracking-wider">EN ATTENTE</p>
                <p className="text-sm font-medium text-foreground">{pendingCount} paiements</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card 
          className={`bg-card border-border cursor-pointer transition-all duration-200 hover:shadow-lg ${
            activeTab === "verified-payments" ? "ring-2 ring-green-500" : ""
          }`}
          onClick={() => setActiveTab("verified-payments")}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground tracking-wider">VÉRIFIÉS</p>
                <p className="text-sm font-medium text-foreground">{verifiedCount} paiements</p>
              </div>
              <CheckSquare className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground tracking-wider">MONTANT TOTAL</p>
                <p className="text-sm font-medium text-foreground">{(totalPendingAmount + totalVerifiedAmount).toFixed(2)}€</p>
              </div>
              <DollarSign className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dynamic Content Panel */}
      <Card className="bg-card border-border">
        <CardContent className="p-6">
          {activeTab === "pending-payments" && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-5 h-5 text-yellow-500" />
                <h3 className="text-lg font-semibold">Paiements en Attente de Vérification</h3>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-muted-foreground">Total: {totalPendingAmount.toFixed(2)}€</span>
                  <span className="text-muted-foreground">En attente: {pendingCount}</span>
                </div>
              </div>
              
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground tracking-wider">DATE</th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground tracking-wider">MONTANT INITIÉ</th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground tracking-wider">RÉFÉRENCE</th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground tracking-wider">BÉNÉFICIAIRES</th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground tracking-wider">DESCRIPTION</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground tracking-wider">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                    {currentPendingPayments.map((payment) => (
                      <tr 
                        key={payment.id} 
                        className="table-row-hover cursor-pointer hover:bg-muted/50"
                        onClick={() => handleRowClick(payment)}
                      >
                    <td className="py-3 px-4">
                          <div className="text-sm text-foreground font-medium">{payment.date}</div>
                    </td>
                    <td className="py-3 px-4">
                          <div className="text-lg font-bold text-foreground">{payment.totalAmount}€</div>
                    </td>
                    <td className="py-3 px-4">
                          <span className="text-sm text-foreground font-mono">{payment.reference}</span>
                    </td>
                    <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-blue-500" />
                            <span className="text-sm text-foreground">{payment.beneficiaryCount}</span>
                          </div>
                    </td>
                    <td className="py-3 px-4">
                          <div className="text-sm text-foreground">{payment.description}</div>
                    </td>
                    <td className="py-3 px-4">
                          <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => handleCancel(payment.id)} 
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                            <X className="w-4 h-4 mr-1" /> Annuler
                          </Button>
                            <Button 
                              size="sm" 
                              onClick={() => handleValidate(payment.id)} 
                              className="bg-green-600 hover:bg-green-700"
                            >
                            <CheckCircle className="w-4 h-4 mr-1" /> Valider
                          </Button>
                        </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Pagination for Pending Payments */}
              {totalPendingPages > 1 && (
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div className="text-sm text-muted-foreground">
                    Affichage {indexOfFirstPending + 1}-{Math.min(indexOfLastPending, pendingPayments.length)} sur {pendingPayments.length} paiements
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPendingPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPendingPage === 1}
                    >
                      Précédent
                    </Button>
                    
                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPendingPages }, (_, i) => i + 1).map((page) => (
                        <Button
                          key={page}
                          variant={currentPendingPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPendingPage(page)}
                          className="w-8 h-8 p-0"
                        >
                          {page}
                        </Button>
                      ))}
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPendingPage(prev => Math.min(prev + 1, totalPendingPages))}
                      disabled={currentPendingPage === totalPendingPages}
                    >
                      Suivant
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "verified-payments" && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <CheckSquare className="w-5 h-5 text-green-500" />
                <h3 className="text-lg font-semibold">Paiements Vérifiés</h3>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-muted-foreground">Total: {totalVerifiedAmount.toFixed(2)}€</span>
                  <span className="text-muted-foreground">Vérifiés: {verifiedCount}</span>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground tracking-wider">DATE</th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground tracking-wider">MONTANT INITIÉ</th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground tracking-wider">RÉFÉRENCE</th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground tracking-wider">BÉNÉFICIAIRES</th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground tracking-wider">DESCRIPTION</th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground tracking-wider">STATUT</th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground tracking-wider">VÉRIFIÉ LE</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentVerifiedPayments.map((payment) => (
                      <tr 
                        key={payment.id} 
                        className="table-row-hover cursor-pointer hover:bg-muted/50"
                        onClick={() => handleRowClick(payment)}
                      >
                        <td className="py-3 px-4">
                          <div className="text-sm text-foreground font-medium">{payment.date}</div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-lg font-bold text-foreground">{payment.totalAmount}€</div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-sm text-foreground font-mono">{payment.reference}</span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-blue-500" />
                            <span className="text-sm text-foreground">{payment.beneficiaryCount}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-sm text-foreground">{payment.description}</div>
                        </td>
                        <td className="py-3 px-4">
                          <Badge className={getStatusColor(payment.status)}>
                            {payment.status === "verified" ? "Validé" : "Annulé"}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-sm text-foreground">{payment.verifiedAt}</div>
                          <div className="text-xs text-muted-foreground">par {payment.verifiedBy}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
              
              {/* Pagination for Verified Payments */}
              {totalVerifiedPages > 1 && (
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div className="text-sm text-muted-foreground">
                    Affichage {indexOfFirstVerified + 1}-{Math.min(indexOfLastVerified, verifiedPayments.length)} sur {verifiedPayments.length} paiements
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentVerifiedPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentVerifiedPage === 1}
                    >
                      Précédent
                    </Button>
                    
                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalVerifiedPages }, (_, i) => i + 1).map((page) => (
                        <Button
                          key={page}
                          variant={currentVerifiedPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentVerifiedPage(page)}
                          className="w-8 h-8 p-0"
                        >
                          {page}
                        </Button>
                      ))}
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentVerifiedPage(prev => Math.min(prev + 1, totalVerifiedPages))}
                      disabled={currentVerifiedPage === totalVerifiedPages}
                    >
                      Suivant
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal des Bénéficiaires */}
      <Dialog open={showBeneficiariesModal} onOpenChange={setShowBeneficiariesModal}>
        <DialogContent className="sm:max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-500" />
              Liste des Bénéficiaires - {selectedPayment?.reference}
            </DialogTitle>
          </DialogHeader>
          
          {selectedPayment && (
            <div className="space-y-4">
              {/* Informations du lot de paiement */}
              <div className="bg-muted/30 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Référence:</span>
                    <span className="ml-2 font-medium">{selectedPayment.reference}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Date:</span>
                    <span className="ml-2 font-medium">{selectedPayment.date}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Montant Total:</span>
                    <span className="ml-2 font-medium">{selectedPayment.totalAmount}€</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Description:</span>
                    <span className="ml-2 font-medium">{selectedPayment.description}</span>
                  </div>
                </div>
              </div>

              {/* Liste des bénéficiaires */}
              <div>
                <h4 className="text-sm font-medium mb-3">Bénéficiaires ({beneficiariesData[selectedPayment.reference]?.length || 0})</h4>
                
                {beneficiariesData[selectedPayment.reference] ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground">BÉNÉFICIAIRE</th>
                          <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground">FOURNISSEUR</th>
                          <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground">COMPTE</th>
                          <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground">CONTACT</th>
                          <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground">MONTANT</th>
                          <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground">STATUT</th>
                        </tr>
                      </thead>
                      <tbody>
                        {beneficiariesData[selectedPayment.reference].map((beneficiary) => (
                          <tr key={beneficiary.id} className="border-b border-border/50">
                            <td className="py-2 px-3">
                              <div className="text-sm text-foreground font-medium">{beneficiary.name}</div>
                              <div className="text-xs text-muted-foreground">ID: {beneficiary.id}</div>
                            </td>
                            <td className="py-2 px-3">
                              <Badge className={getProviderColor(beneficiary.provider)}>
                                {beneficiary.provider}
                              </Badge>
                            </td>
                            <td className="py-2 px-3">
                              <span className="text-sm text-foreground font-mono">{beneficiary.accountNumber}</span>
                            </td>
                            <td className="py-2 px-3">
                              <div className="text-sm text-foreground">{beneficiary.email}</div>
                              <div className="text-xs text-muted-foreground">{beneficiary.phone}</div>
                            </td>
                            <td className="py-2 px-3">
                              <div className="text-sm font-bold text-foreground">{beneficiary.amount}€</div>
                            </td>
                            <td className="py-2 px-3">
                              <Badge className={getStatusColor(beneficiary.status)}>
                                {beneficiary.status === "active" ? "Actif" : "Inactif"}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Aucun bénéficiaire trouvé pour ce paiement</p>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex justify-end pt-4 border-t border-border">
                <Button onClick={closeModal}>
                  Fermer
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
} 