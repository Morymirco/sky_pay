"use client"

import { useState } from "react"
import { CheckCircle, X, Download, CreditCard, DollarSign, Clock, CheckSquare, List, AlertCircle, Users, Eye, Shield, Key } from "lucide-react"
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
  status: "pending" | "validated" | "cancelled" | "rejected"
  beneficiaryCount: number
  validatedAt?: string
  validatedBy?: string
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

export default function ValidatePaymentPage() {
  const [activeTab, setActiveTab] = useState("pending-payments")
  
  // Modal states
  const [showBeneficiariesModal, setShowBeneficiariesModal] = useState(false)
  const [showValidationModal, setShowValidationModal] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState<PaymentBatch | null>(null)
  
  // Validation form states
  const [secretCode, setSecretCode] = useState("")
  const [otpCode, setOtpCode] = useState("")
  const [isValidating, setIsValidating] = useState(false)
  
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
  
  // Lots de paiements en attente de validation
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



  // Lots de paiements rejetés
  const [rejectedPayments, setRejectedPayments] = useState<PaymentBatch[]>([
    {
      id: "11",
      date: "2024-01-25",
      totalAmount: 150.00,
      reference: "PAY-2024-011",
      status: "rejected",
      beneficiaryCount: 1,
      description: "Paiement salaire",
      validatedAt: "2024-01-25 10:30",
      validatedBy: "Admin"
    },
    {
      id: "12",
      date: "2024-01-26",
      totalAmount: 200.00,
      reference: "PAY-2024-012",
      status: "rejected",
      beneficiaryCount: 1,
      description: "Paiement fournisseur",
      validatedAt: "2024-01-26 14:15",
      validatedBy: "Admin"
    }
  ])

  // Lots de paiements validés
  const [validatedPayments, setValidatedPayments] = useState<PaymentBatch[]>([
    {
      id: "7",
      date: "2024-01-21",
      totalAmount: 210.50,
      reference: "PAY-2024-007",
      status: "validated",
      beneficiaryCount: 1,
      description: "Paiement salaire",
      validatedAt: "2024-01-21 14:30",
      validatedBy: "Admin"
    },
    {
      id: "8",
      date: "2024-01-22",
      totalAmount: 165.80,
      reference: "PAY-2024-008",
      status: "validated",
      beneficiaryCount: 1,
      description: "Paiement fournisseur",
      validatedAt: "2024-01-22 09:15",
      validatedBy: "Admin"
    },
    {
      id: "9",
      date: "2024-01-23",
      totalAmount: 185.90,
      reference: "PAY-2024-009",
      status: "validated",
      beneficiaryCount: 1,
      description: "Paiement consultant",
      validatedAt: "2024-01-23 16:45",
      validatedBy: "Admin"
    },
    {
      id: "10",
      date: "2024-01-24",
      totalAmount: 220.30,
      reference: "PAY-2024-010",
      status: "validated",
      beneficiaryCount: 1,
      description: "Paiement prestataire",
      validatedAt: "2024-01-24 11:20",
      validatedBy: "Admin"
    }
  ])

  // Pagination states
  const [currentPendingPage, setCurrentPendingPage] = useState(1)
  const [currentValidatedPage, setCurrentValidatedPage] = useState(1)
  const [currentRejectedPage, setCurrentRejectedPage] = useState(1)

  const [itemsPerPage] = useState(5)

  // Pagination logic for pending payments
  const indexOfLastPending = currentPendingPage * itemsPerPage
  const indexOfFirstPending = indexOfLastPending - itemsPerPage
  const currentPendingPayments = pendingPayments.slice(indexOfFirstPending, indexOfLastPending)
  const totalPendingPages = Math.ceil(pendingPayments.length / itemsPerPage)

  // Pagination logic for validated payments
  const indexOfLastValidated = currentValidatedPage * itemsPerPage
  const indexOfFirstValidated = indexOfLastValidated - itemsPerPage
  const currentValidatedPayments = validatedPayments.slice(indexOfFirstValidated, indexOfLastValidated)
  const totalValidatedPages = Math.ceil(validatedPayments.length / itemsPerPage)

  // Pagination logic for rejected payments
  const indexOfLastRejected = currentRejectedPage * itemsPerPage
  const indexOfFirstRejected = indexOfLastRejected - itemsPerPage
  const currentRejectedPayments = rejectedPayments.slice(indexOfFirstRejected, indexOfLastRejected)
  const totalRejectedPages = Math.ceil(rejectedPayments.length / itemsPerPage)

  const handleValidate = (payment: PaymentBatch) => {
    setSelectedPayment(payment)
    setShowValidationModal(true)
  }

  const handleConfirmValidation = async () => {
    if (!secretCode || !otpCode) {
      alert("Veuillez remplir tous les champs")
      return
    }

    setIsValidating(true)
    
    // Simuler la validation
    setTimeout(() => {
      if (selectedPayment) {
        const updatedPayment: PaymentBatch = {
          ...selectedPayment,
          status: "validated",
          validatedAt: new Date().toLocaleString('fr-FR'),
          validatedBy: "Admin"
        }
        
        setPendingPayments(prev => prev.filter(p => p.id !== selectedPayment.id))
        setValidatedPayments(prev => [updatedPayment, ...prev])
        
        // Reset form
        setSecretCode("")
        setOtpCode("")
        setShowValidationModal(false)
        setSelectedPayment(null)
      }
      setIsValidating(false)
    }, 2000)
  }

  const handleCancel = (id: string) => {
    setPendingPayments(prev => prev.map(payment => 
      payment.id === id ? { ...payment, status: "cancelled" as const } : payment
    ))
  }

  const handleReject = (payment: PaymentBatch) => {
    const updatedPayment: PaymentBatch = {
      ...payment,
      status: "rejected",
      validatedAt: new Date().toLocaleString('fr-FR'),
      validatedBy: "Admin"
    }
    
    setPendingPayments(prev => prev.filter(p => p.id !== payment.id))
    setRejectedPayments(prev => [updatedPayment, ...prev])
  }

  const exportToExcel = (type: 'pending' | 'validated') => {
    const data = type === 'pending' ? pendingPayments : validatedPayments
    const csvContent = "data:text/csv;charset=utf-8," +
      "Date,Montant Total,Référence,Bénéficiaires,Description,Statut\n" +
      data.map(batch => 
        `${batch.date},${batch.totalAmount.toFixed(2)}€,${batch.reference},${batch.beneficiaryCount},${batch.description || ''},${batch.status}`
      ).join("\n")
    
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `paiements_${type === 'pending' ? 'en_attente' : 'valides'}.csv`)
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
    setShowValidationModal(false)
    setSelectedPayment(null)
    setSecretCode("")
    setOtpCode("")
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
      case "validated": return "bg-green-500/20 text-green-400"
      case "pending": return "bg-yellow-500/20 text-yellow-400"
      case "cancelled": return "bg-red-500/20 text-red-400"
      case "rejected": return "bg-red-500/20 text-red-400"
      case "active": return "bg-green-500/20 text-green-400"
      case "inactive": return "bg-red-500/20 text-red-400"
      default: return "bg-muted text-muted-foreground"
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-wider">VALIDER LE PAIEMENT</h1>
          <p className="text-sm text-muted-foreground">Confirmer les paiements initiés</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => exportToExcel('pending')}>
            <Download className="w-4 h-4 mr-2" />
            Export En Attente
          </Button>
          <Button variant="outline" onClick={() => exportToExcel('validated')}>
          <Download className="w-4 h-4 mr-2" />
            Export Validés
        </Button>
        </div>
      </div>

      {/* Stats Cards - Now Clickable Panels */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card 
          className={`bg-card border-border cursor-pointer transition-all duration-200 hover:shadow-lg ${
            activeTab === "pending-payments" ? "ring-2 ring-yellow-500" : ""
          }`}
          onClick={() => setActiveTab("pending-payments")}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center">
                <Clock className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">PAIEMENTS EN ATTENTE</p>
                <p className="text-lg font-bold">{pendingPayments.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card 
          className={`bg-card border-border cursor-pointer transition-all duration-200 hover:shadow-lg ${
            activeTab === "validated-payments" ? "ring-2 ring-green-500" : ""
          }`}
          onClick={() => setActiveTab("validated-payments")}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">PAIEMENTS VALIDÉS</p>
                <p className="text-lg font-bold">{validatedPayments.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card 
          className={`bg-card border-border cursor-pointer transition-all duration-200 hover:shadow-lg ${
            activeTab === "rejected-payments" ? "ring-2 ring-red-500" : ""
          }`}
          onClick={() => setActiveTab("rejected-payments")}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                <X className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">PAIEMENTS REJETÉS</p>
                <p className="text-lg font-bold">{rejectedPayments.length}</p>
              </div>
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
                <h3 className="text-lg font-semibold">Paiements en Attente</h3>
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
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground tracking-wider">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                    {currentPendingPayments.map((payment) => (
                      <tr
                        key={payment.id}
                        className="table-row-hover cursor-pointer"
                        onClick={() => handleRowClick(payment)}
                      >
                        <td className="py-3 px-4">
                          <div className="text-sm text-foreground font-medium">{payment.date}</div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-lg font-bold text-foreground">{payment.totalAmount.toFixed(2)}€</div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-sm text-foreground font-mono">{payment.reference}</span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm text-foreground">{payment.beneficiaryCount}</span>
                          </div>
                        </td>
                    <td className="py-3 px-4">
                          <div className="text-sm text-foreground">{payment.description}</div>
                    </td>
                    <td className="py-3 px-4">
                          <Badge className={getStatusColor(payment.status)}>
                            En attente
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleRowClick(payment)
                              }}
                              className="h-8 w-8 p-0"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="default"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleValidate(payment)
                              }}
                              className="h-8 bg-green-600 hover:bg-green-700"
                            >
                              Confirmer
                            </Button>
                            <Button
                              variant="default"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleReject(payment)
                              }}
                              className="h-8 bg-red-600 hover:bg-red-700"
                            >
                              Rejeter
                            </Button>

                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination for pending payments */}
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

          {activeTab === "validated-payments" && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <h3 className="text-lg font-semibold">Paiements Validés</h3>
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
                      <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground tracking-wider">VALIDÉ LE</th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground tracking-wider">STATUT</th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground tracking-wider">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentValidatedPayments.map((payment) => (
                      <tr
                        key={payment.id}
                        className="table-row-hover cursor-pointer"
                        onClick={() => handleRowClick(payment)}
                      >
                        <td className="py-3 px-4">
                          <div className="text-sm text-foreground font-medium">{payment.date}</div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-lg font-bold text-foreground">{payment.totalAmount.toFixed(2)}€</div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-sm text-foreground font-mono">{payment.reference}</span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm text-foreground">{payment.beneficiaryCount}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-sm text-foreground">{payment.description}</div>
                    </td>
                    <td className="py-3 px-4">
                          <div className="text-sm text-foreground">{payment.validatedAt}</div>
                          <div className="text-xs text-muted-foreground">par {payment.validatedBy}</div>
                    </td>
                    <td className="py-3 px-4">
                          <Badge className={getStatusColor(payment.status)}>
                            Validé
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleRowClick(payment)
                            }}
                            className="h-8 w-8 p-0"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                                </div>

              {/* Pagination for validated payments */}
              {totalValidatedPages > 1 && (
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div className="text-sm text-muted-foreground">
                    Affichage {indexOfFirstValidated + 1}-{Math.min(indexOfLastValidated, validatedPayments.length)} sur {validatedPayments.length} paiements
                                </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentValidatedPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentValidatedPage === 1}
                    >
                      Précédent
                    </Button>
                    
                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalValidatedPages }, (_, i) => i + 1).map((page) => (
                        <Button
                          key={page}
                          variant={currentValidatedPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentValidatedPage(page)}
                          className="w-8 h-8 p-0"
                        >
                          {page}
                                  </Button>
                      ))}
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentValidatedPage(prev => Math.min(prev + 1, totalValidatedPages))}
                      disabled={currentValidatedPage === totalValidatedPages}
                    >
                      Suivant
                                  </Button>
                                </div>
                              </div>
              )}
                        </div>
          )}

          {activeTab === "rejected-payments" && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <X className="w-5 h-5 text-red-500" />
                <h3 className="text-lg font-semibold">Paiements Rejetés</h3>
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
                      <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground tracking-wider">REJETÉ LE</th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground tracking-wider">STATUT</th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground tracking-wider">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentRejectedPayments.map((payment) => (
                      <tr
                        key={payment.id}
                        className="table-row-hover cursor-pointer"
                        onClick={() => handleRowClick(payment)}
                      >
                        <td className="py-3 px-4">
                          <div className="text-sm text-foreground font-medium">{payment.date}</div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-lg font-bold text-foreground">{payment.totalAmount.toFixed(2)}€</div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-sm text-foreground font-mono">{payment.reference}</span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm text-foreground">{payment.beneficiaryCount}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-sm text-foreground">{payment.description}</div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-sm text-foreground">{payment.validatedAt}</div>
                          <div className="text-xs text-muted-foreground">par {payment.validatedBy}</div>
                        </td>
                        <td className="py-3 px-4">
                          <Badge className={getStatusColor(payment.status)}>
                            Rejeté
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleRowClick(payment)
                            }}
                            className="h-8 w-8 p-0"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

              {/* Pagination for rejected payments */}
              {totalRejectedPages > 1 && (
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div className="text-sm text-muted-foreground">
                    Affichage {indexOfFirstRejected + 1}-{Math.min(indexOfLastRejected, rejectedPayments.length)} sur {rejectedPayments.length} paiements
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentRejectedPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentRejectedPage === 1}
                    >
                      Précédent
                    </Button>
                    
                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalRejectedPages }, (_, i) => i + 1).map((page) => (
                        <Button
                          key={page}
                          variant={currentRejectedPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentRejectedPage(page)}
                          className="w-8 h-8 p-0"
                        >
                          {page}
                        </Button>
                      ))}
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentRejectedPage(prev => Math.min(prev + 1, totalRejectedPages))}
                      disabled={currentRejectedPage === totalRejectedPages}
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
        <DialogContent className="sm:max-w-4xl max-h-[80vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              Bénéficiaires du Lot de Paiement
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 overflow-hidden">
            {selectedPayment && (
              <>
                {/* Informations du lot */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/30 rounded-lg">
                  <div>
                    <div className="text-sm text-muted-foreground">Référence</div>
                    <div className="text-sm font-medium">{selectedPayment.reference}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Montant Total</div>
                    <div className="text-sm font-medium">{selectedPayment.totalAmount.toFixed(2)}€</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Bénéficiaires</div>
                    <div className="text-sm font-medium">{selectedPayment.beneficiaryCount}</div>
                  </div>
                </div>

                {/* Liste des bénéficiaires */}
                <div className="overflow-y-auto max-h-96">
                  <table className="w-full">
                    <thead className="sticky top-0 bg-background">
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground tracking-wider">BÉNÉFICIAIRE</th>
                        <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground tracking-wider">FOURNISSEUR</th>
                        <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground tracking-wider">COMPTE</th>
                        <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground tracking-wider">CONTACT</th>
                        <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground tracking-wider">MONTANT</th>
                        <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground tracking-wider">STATUT</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(beneficiariesData[selectedPayment.reference] || []).map((beneficiary) => (
                        <tr key={beneficiary.id} className="border-b border-border/50">
                          <td className="py-3 px-4">
                            <div className="text-sm text-foreground font-medium">{beneficiary.name}</div>
                            <div className="text-xs text-muted-foreground">ID: {beneficiary.id}</div>
                          </td>
                          <td className="py-3 px-4">
                            <Badge className={getProviderColor(beneficiary.provider)}>
                              {beneficiary.provider}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-sm text-foreground font-mono">{beneficiary.accountNumber}</span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="text-sm text-foreground">{beneficiary.email}</div>
                            <div className="text-xs text-muted-foreground">{beneficiary.phone}</div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="text-sm font-medium text-foreground">{beneficiary.amount.toFixed(2)}€</div>
                          </td>
                          <td className="py-3 px-4">
                            <Badge className={getStatusColor(beneficiary.status)}>
                              {beneficiary.status === "active" ? "Actif" : "Inactif"}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Message si aucun bénéficiaire */}
                {(!beneficiariesData[selectedPayment.reference] || beneficiariesData[selectedPayment.reference].length === 0) && (
                  <div className="text-center py-8">
                    <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-sm text-muted-foreground">Aucun bénéficiaire trouvé pour ce lot de paiement.</p>
                  </div>
                )}
              </>
            )}
            <div className="flex justify-end pt-4 border-t border-border">
              <Button onClick={closeModal}>
                Fermer
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de Validation */}
      <Dialog open={showValidationModal} onOpenChange={setShowValidationModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                <Shield className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              Confirmer le Paiement
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            {selectedPayment && (
              <div className="space-y-4">
                {/* Informations du paiement */}
                <div className="bg-muted/30 rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Référence:</span>
                      <div className="font-medium">{selectedPayment.reference}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Montant:</span>
                      <div className="font-medium">{selectedPayment.totalAmount.toFixed(2)}€</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Bénéficiaires:</span>
                      <div className="font-medium">{selectedPayment.beneficiaryCount}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Description:</span>
                      <div className="font-medium">{selectedPayment.description}</div>
                    </div>
                  </div>
                </div>

                {/* Formulaire de validation */}
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground block mb-2">
                      Code Secret
                    </label>
                    <div className="relative">
                      <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        type="password"
                        placeholder="Entrez votre code secret"
                        value={secretCode}
                        onChange={(e) => setSecretCode(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted-foreground block mb-2">
                      Code OTP
                    </label>
                    <div className="relative">
                      <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        type="text"
                        placeholder="Entrez le code OTP"
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value)}
                        className="pl-10"
                        maxLength={6}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Le code OTP a été envoyé par SMS
                    </p>
                  </div>
                </div>

                {/* Boutons d'action */}
                <div className="flex gap-2">
                  <Button 
                    onClick={closeModal}
                    variant="outline"
                    className="flex-1"
                    disabled={isValidating}
                  >
                    Annuler
                  </Button>
                  <Button 
                    onClick={handleConfirmValidation}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                    disabled={!secretCode || !otpCode || isValidating}
                  >
                    {isValidating ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Validation...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Confirmer
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
} 