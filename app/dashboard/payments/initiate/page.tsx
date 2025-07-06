"use client"

import { useState } from "react"
import { Play, Users, DollarSign, CreditCard, Download, Upload, Plus, List, FileText, CheckCircle, Eye, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface PaymentMember {
  id: string
  name: string
  provider: "Kulu" | "Soutra Money" | "Orange Money"
  accountNumber: string
  amount: number
  status: "pending" | "confirmed" | "completed"
  date: string
  reference: string
}

interface PaymentBatch {
  id: string
  date: string
  totalAmount: number
  reference: string
  status: "pending" | "confirmed" | "completed"
  beneficiaryCount: number
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

export default function InitiatePaymentPage() {
  const [activeTab, setActiveTab] = useState("quick-init")
  const [members, setMembers] = useState<PaymentMember[]>([
    {
      id: "1",
      name: "Jean Dupont",
      provider: "Orange Money",
      accountNumber: "OM123456789",
      amount: 150.00,
      status: "pending",
      date: "2024-01-15",
      reference: "PAY-2024-001"
    },
    {
      id: "2",
      name: "Marie Martin",
      provider: "Kulu",
      accountNumber: "KL987654321",
      amount: 200.00,
      status: "pending",
      date: "2024-01-16",
      reference: "PAY-2024-002"
    },
    {
      id: "3",
      name: "Pierre Durand",
      provider: "Soutra Money",
      accountNumber: "SM456789123",
      amount: 175.50,
      status: "pending",
      date: "2024-01-17",
      reference: "PAY-2024-003"
    },
    {
      id: "4",
      name: "Sophie Bernard",
      provider: "Orange Money",
      accountNumber: "OM987654321",
      amount: 225.00,
      status: "pending",
      date: "2024-01-18",
      reference: "PAY-2024-004"
    },
    {
      id: "5",
      name: "Lucas Moreau",
      provider: "Kulu",
      accountNumber: "KL123456789",
      amount: 180.75,
      status: "pending",
      date: "2024-01-19",
      reference: "PAY-2024-005"
    },
    {
      id: "6",
      name: "Emma Dubois",
      provider: "Soutra Money",
      accountNumber: "SM789123456",
      amount: 195.25,
      status: "pending",
      date: "2024-01-20",
      reference: "PAY-2024-006"
    },
    {
      id: "7",
      name: "Thomas Leroy",
      provider: "Orange Money",
      accountNumber: "OM456789123",
      amount: 210.50,
      status: "pending",
      date: "2024-01-21",
      reference: "PAY-2024-007"
    },
    {
      id: "8",
      name: "Julie Rousseau",
      provider: "Kulu",
      accountNumber: "KL456789123",
      amount: 165.80,
      status: "pending",
      date: "2024-01-22",
      reference: "PAY-2024-008"
    },
    {
      id: "9",
      name: "Antoine Girard",
      provider: "Soutra Money",
      accountNumber: "SM123789456",
      amount: 185.90,
      status: "pending",
      date: "2024-01-23",
      reference: "PAY-2024-009"
    },
    {
      id: "10",
      name: "Camille Lefevre",
      provider: "Orange Money",
      accountNumber: "OM789456123",
      amount: 220.30,
      status: "pending",
      date: "2024-01-24",
      reference: "PAY-2024-010"
    },
    {
      id: "11",
      name: "Nicolas Mercier",
      provider: "Kulu",
      accountNumber: "KL789123456",
      amount: 170.45,
      status: "pending",
      date: "2024-01-25",
      reference: "PAY-2024-011"
    },
    {
      id: "12",
      name: "Sarah Petit",
      provider: "Soutra Money",
      accountNumber: "SM456123789",
      amount: 190.20,
      status: "pending",
      date: "2024-01-26",
      reference: "PAY-2024-012"
    },
    {
      id: "13",
      name: "Alexandre Roux",
      provider: "Orange Money",
      accountNumber: "OM123789456",
      amount: 205.75,
      status: "pending",
      date: "2024-01-27",
      reference: "PAY-2024-013"
    },
    {
      id: "14",
      name: "Léa Simon",
      provider: "Kulu",
      accountNumber: "KL321654987",
      amount: 175.60,
      status: "pending",
      date: "2024-01-28",
      reference: "PAY-2024-014"
    },
    {
      id: "15",
      name: "Maxime Michel",
      provider: "Soutra Money",
      accountNumber: "SM987654321",
      amount: 215.40,
      status: "pending",
      date: "2024-01-29",
      reference: "PAY-2024-015"
    }
  ])

  const [isProcessing, setIsProcessing] = useState(false)
  const [showImportPreview, setShowImportPreview] = useState(false)
  const [importedData, setImportedData] = useState<PaymentMember[]>([])
  const [quickPayment, setQuickPayment] = useState({
    name: "",
    provider: "Orange Money" as "Kulu" | "Soutra Money" | "Orange Money",
    accountNumber: "",
    amount: 0
  })
  const [selectedBeneficiaries, setSelectedBeneficiaries] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(5)
  const [showSummary, setShowSummary] = useState(false)
  const [showImportSummary, setShowImportSummary] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [showImportSuccessModal, setShowImportSuccessModal] = useState(false)
  const [importedCount, setImportedCount] = useState(0)
  
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
  const [beneficiariesList, setBeneficiariesList] = useState([
    {
      id: "1",
      name: "Jean Dupont",
      provider: "Orange Money" as "Kulu" | "Soutra Money" | "Orange Money",
      accountNumber: "OM123456789",
      email: "jean.dupont@email.com",
      phone: "+33 6 12 34 56 78",
      status: "active" as "active" | "inactive"
    },
    {
      id: "2",
      name: "Marie Martin",
      provider: "Kulu" as "Kulu" | "Soutra Money" | "Orange Money",
      accountNumber: "KL987654321",
      email: "marie.martin@email.com",
      phone: "+33 6 98 76 54 32",
      status: "active" as "active" | "inactive"
    },
    {
      id: "3",
      name: "Pierre Durand",
      provider: "Soutra Money" as "Kulu" | "Soutra Money" | "Orange Money",
      accountNumber: "SM456789123",
      email: "pierre.durand@email.com",
      phone: "+33 6 55 44 33 22",
      status: "inactive" as "active" | "inactive"
    },
    {
      id: "4",
      name: "Sophie Bernard",
      provider: "Orange Money" as "Kulu" | "Soutra Money" | "Orange Money",
      accountNumber: "OM987654321",
      email: "sophie.bernard@email.com",
      phone: "+33 6 11 22 33 44",
      status: "active" as "active" | "inactive"
    },
    {
      id: "5",
      name: "Lucas Moreau",
      provider: "Kulu" as "Kulu" | "Soutra Money" | "Orange Money",
      accountNumber: "KL123456789",
      email: "lucas.moreau@email.com",
      phone: "+33 6 99 88 77 66",
      status: "active" as "active" | "inactive"
    },
    {
      id: "6",
      name: "Emma Dubois",
      provider: "Soutra Money" as "Kulu" | "Soutra Money" | "Orange Money",
      accountNumber: "SM789123456",
      email: "emma.dubois@email.com",
      phone: "+33 6 77 66 55 44",
      status: "active" as "active" | "inactive"
    },
    {
      id: "7",
      name: "Thomas Leroy",
      provider: "Orange Money" as "Kulu" | "Soutra Money" | "Orange Money",
      accountNumber: "OM456789123",
      email: "thomas.leroy@email.com",
      phone: "+33 6 33 44 55 66",
      status: "active" as "active" | "inactive"
    },
    {
      id: "8",
      name: "Julie Rousseau",
      provider: "Kulu" as "Kulu" | "Soutra Money" | "Orange Money",
      accountNumber: "KL456789123",
      email: "julie.rousseau@email.com",
      phone: "+33 6 88 99 00 11",
      status: "inactive" as "active" | "inactive"
    },
    {
      id: "9",
      name: "Antoine Girard",
      provider: "Soutra Money" as "Kulu" | "Soutra Money" | "Orange Money",
      accountNumber: "SM123789456",
      email: "antoine.girard@email.com",
      phone: "+33 6 22 33 44 55",
      status: "active" as "active" | "inactive"
    },
    {
      id: "10",
      name: "Camille Lefevre",
      provider: "Orange Money" as "Kulu" | "Soutra Money" | "Orange Money",
      accountNumber: "OM789456123",
      email: "camille.lefevre@email.com",
      phone: "+33 6 66 77 88 99",
      status: "active" as "active" | "inactive"
    },
    {
      id: "11",
      name: "Nicolas Mercier",
      provider: "Kulu" as "Kulu" | "Soutra Money" | "Orange Money",
      accountNumber: "KL789123456",
      email: "nicolas.mercier@email.com",
      phone: "+33 6 44 55 66 77",
      status: "active" as "active" | "inactive"
    },
    {
      id: "12",
      name: "Sarah Petit",
      provider: "Soutra Money" as "Kulu" | "Soutra Money" | "Orange Money",
      accountNumber: "SM456123789",
      email: "sarah.petit@email.com",
      phone: "+33 6 55 66 77 88",
      status: "inactive" as "active" | "inactive"
    },
    {
      id: "13",
      name: "Alexandre Roux",
      provider: "Orange Money" as "Kulu" | "Soutra Money" | "Orange Money",
      accountNumber: "OM123789456",
      email: "alexandre.roux@email.com",
      phone: "+33 6 11 22 33 44",
      status: "active" as "active" | "inactive"
    },
    {
      id: "14",
      name: "Léa Simon",
      provider: "Kulu" as "Kulu" | "Soutra Money" | "Orange Money",
      accountNumber: "KL321654987",
      email: "lea.simon@email.com",
      phone: "+33 6 99 88 77 66",
      status: "active" as "active" | "inactive"
    },
    {
      id: "15",
      name: "Maxime Michel",
      provider: "Soutra Money" as "Kulu" | "Soutra Money" | "Orange Money",
      accountNumber: "SM987654321",
      email: "maxime.michel@email.com",
      phone: "+33 6 77 66 55 44",
      status: "active" as "active" | "inactive"
    }
  ])

  // Transformer les membres en lots de paiements
  const paymentBatches: PaymentBatch[] = members.reduce((batches: PaymentBatch[], member) => {
    const existingBatch = batches.find(batch => batch.reference === member.reference)
    
    if (existingBatch) {
      existingBatch.totalAmount += member.amount
      existingBatch.beneficiaryCount += 1
    } else {
      batches.push({
        id: member.reference,
        date: member.date,
        totalAmount: member.amount,
        reference: member.reference,
        status: member.status,
        beneficiaryCount: 1,
        description: `Paiement ${member.reference}`
      })
    }
    
    return batches
  }, [])

  const totalAmount = paymentBatches.reduce((sum, batch) => sum + batch.totalAmount, 0)
  const pendingCount = paymentBatches.filter(b => b.status === "pending").length

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentBatches = paymentBatches.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(paymentBatches.length / itemsPerPage)

  // Pagination for beneficiaries
  const [currentBeneficiariesPage, setCurrentBeneficiariesPage] = useState(1)
  const [beneficiariesPerPage] = useState(5)
  const indexOfLastBeneficiary = currentBeneficiariesPage * beneficiariesPerPage
  const indexOfFirstBeneficiary = indexOfLastBeneficiary - beneficiariesPerPage
  const currentBeneficiaries = beneficiariesList.slice(indexOfFirstBeneficiary, indexOfLastBeneficiary)
  const totalBeneficiariesPages = Math.ceil(beneficiariesList.length / beneficiariesPerPage)

  const [showImportRecap, setShowImportRecap] = useState(false)

  const handleInitiatePayments = () => {
    setIsProcessing(true)
    // Simulate payment processing
    setTimeout(() => {
      const updatedMembers = members.map(member => ({
        ...member,
        status: "completed" as const // Statut "Terminé" après traitement
      }))
      setMembers(updatedMembers)
      setIsProcessing(false)
    }, 3000)
  }

  const handleQuickPayment = () => {
    if (quickPayment.name && quickPayment.accountNumber && quickPayment.amount > 0) {
      const newMember: PaymentMember = {
        id: Date.now().toString(),
        name: quickPayment.name,
        provider: quickPayment.provider,
        accountNumber: quickPayment.accountNumber,
        amount: quickPayment.amount,
        status: "pending", // Statut "En attente" lors de l'initiation
        date: new Date().toISOString().split('T')[0],
        reference: `PAY-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`
      }
      setMembers([...members, newMember])
      setQuickPayment({
        name: "",
        provider: "Orange Money",
        accountNumber: "",
        amount: 0
      })
    }
  }

  const handleBeneficiarySelection = (beneficiaryId: string) => {
    setSelectedBeneficiaries(prev => 
      prev.includes(beneficiaryId) 
        ? prev.filter(id => id !== beneficiaryId)
        : [...prev, beneficiaryId]
    )
  }

  const handleInitiateQuickPayments = () => {
    if (selectedBeneficiaries.length === 0) return

    const selectedBeneficiariesData = beneficiariesList.filter(b => selectedBeneficiaries.includes(b.id))
    
    const newPayments: PaymentMember[] = selectedBeneficiariesData.map(beneficiary => ({
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      name: beneficiary.name,
      provider: beneficiary.provider,
      accountNumber: beneficiary.accountNumber,
      amount: 0, // Montant à définir par l'utilisateur
      status: "pending", // Statut "En attente" lors de l'initiation
      date: new Date().toISOString().split('T')[0],
      reference: `PAY-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}-${Math.random().toString(36).substr(2, 4)}`
    }))

    setMembers([...members, ...newPayments])
    setSelectedBeneficiaries([])
    setShowSummary(false)
    setShowSuccessModal(true)
  }

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false)
  }

  const handleContinueToSummary = () => {
    setShowSummary(true)
  }

  const handleBackToSelection = () => {
    setShowSummary(false)
  }

  const exportToExcel = () => {
    const csvContent = "data:text/csv;charset=utf-8," +
      "Date,Montant Total,Référence,Bénéficiaires,Description,Statut\n" +
      paymentBatches.map(batch => 
        `${batch.date},${batch.totalAmount.toFixed(2)}€,${batch.reference},${batch.beneficiaryCount},${batch.description || ''},${batch.status}`
      ).join("\n")
    
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", "lots_paiements_inities.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const downloadTemplate = () => {
    const templateContent = "data:text/csv;charset=utf-8," +
      "Nom,Fournisseur,Compte,Montant,Date,Référence\n" +
      "Jean Dupont,Orange Money,OM123456789,150.00,2024-01-15,PAY-2024-001\n" +
      "Marie Martin,Kulu,KL987654321,200.00,2024-01-16,PAY-2024-002\n" +
      "Pierre Durand,Soutra Money,SM456789123,175.50,2024-01-17,PAY-2024-003"
    
    const encodedUri = encodeURI(templateContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", "modele_import_paiements.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const text = e.target?.result as string
        const lines = text.split('\n').filter(line => line.trim() !== '')
        const headers = lines[0].split(',').map(h => h.trim())
        const data = lines.slice(1).map((line, index) => {
          const values = line.split(',').map(v => v.trim())
          return {
            id: `import-${Date.now()}-${index}`,
            name: values[0] || '',
            provider: (values[1] || 'Orange Money') as "Kulu" | "Soutra Money" | "Orange Money",
            accountNumber: values[2] || '',
            amount: parseFloat(values[3]) || 0,
            status: "pending" as const,
            date: values[4] || new Date().toISOString().split('T')[0],
            reference: values[5] || `PAY-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`
          }
        }).filter(item => item.name && item.accountNumber && item.amount > 0)
        
        console.log('Données importées:', data) // Debug
        setImportedData(data)
        setShowImportSummary(true)
      }
      reader.readAsText(file)
    }
  }

  const handleBulkImportConfirm = () => {
    const newMembers = importedData.map((item, index) => ({
      id: `imported-${Date.now()}-${index}`,
      name: item.name,
      provider: item.provider,
      accountNumber: item.accountNumber,
      amount: item.amount,
      status: "pending" as const,
      date: item.date,
      reference: item.reference
    }))
    setMembers(prev => [...prev, ...newMembers])
    setShowImportSummary(false)
    setShowImportRecap(false)
    setImportedData([])
    setImportedCount(newMembers.length)
    setShowImportSuccessModal(true)
    setActiveTab("payment-list")
  }

  const cancelImport = () => {
    setShowImportPreview(false)
    setImportedData([])
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
      default: return "bg-muted text-muted-foreground"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-500/20 text-green-400"
      case "confirmed": return "bg-blue-500/20 text-blue-400"
      case "pending": return "bg-yellow-500/20 text-yellow-400"
      case "active": return "bg-green-500/20 text-green-400"
      case "inactive": return "bg-red-500/20 text-red-400"
      default: return "bg-muted text-muted-foreground"
    }
  }

  const handleRowClick = (payment: PaymentBatch) => {
    setSelectedPayment(payment)
    setShowBeneficiariesModal(true)
  }

  const closeModal = () => {
    setShowBeneficiariesModal(false)
    setSelectedPayment(null)
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-wider">INITIER LE PAIEMENT</h1>
          <p className="text-sm text-muted-foreground">Payer les bénéficiaires sélectionnés</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportToExcel}>
            <Download className="w-4 h-4 mr-2" />
            Export Lots
          </Button>
        </div>
      </div>

      {/* Stats Cards - Now Clickable Panels */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card 
          className={`bg-card border-border cursor-pointer transition-all duration-200 hover:shadow-lg ${
            activeTab === "quick-init" ? "ring-2 ring-blue-500" : ""
          }`}
          onClick={() => setActiveTab("quick-init")}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground tracking-wider">INITIATION RAPIDE</p>
                <p className="text-sm font-medium text-foreground">Paiement individuel</p>
              </div>
              <Plus className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card 
          className={`bg-card border-border cursor-pointer transition-all duration-200 hover:shadow-lg ${
            activeTab === "bulk-import" ? "ring-2 ring-blue-500" : ""
          }`}
          onClick={() => setActiveTab("bulk-import")}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground tracking-wider">IMPORTER EN MASSE</p>
                <p className="text-sm font-medium text-foreground">Fichier Excel/CSV</p>
              </div>
              <Upload className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card 
          className={`bg-card border-border cursor-pointer transition-all duration-200 hover:shadow-lg ${
            activeTab === "payment-list" ? "ring-2 ring-blue-500" : ""
          }`}
          onClick={() => setActiveTab("payment-list")}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground tracking-wider">LISTE DES PAIEMENTS</p>
                <p className="text-sm font-medium text-foreground">{paymentBatches.length} lots</p>
              </div>
              <List className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dynamic Content Panel */}
      <Card className="bg-card border-border">
        <CardContent className="p-6">
          {activeTab === "quick-init" && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <Plus className="w-5 h-5 text-blue-500" />
                <h3 className="text-lg font-semibold">Initiation Rapide</h3>
              </div>
              
              {!showSummary ? (
                <>
                  {/* Indicateur d'étapes */}
                  <div className="flex items-center justify-center mb-8">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                          1
                        </div>
                        <span className="text-sm font-medium text-blue-600">Étape 1</span>
                      </div>
                      <div className="w-12 h-0.5 bg-gray-300"></div>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gray-200 text-gray-500 rounded-full flex items-center justify-center text-sm font-medium">
                          2
                        </div>
                        <span className="text-sm font-medium text-gray-500">Étape 2</span>
                      </div>
                    </div>
                  </div>

                  {/* Bénéficiaires Sélectionnés */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-foreground">
                        Bénéficiaires sélectionnés: {selectedBeneficiaries.length}
                      </span>
                    </div>
                    {selectedBeneficiaries.length > 0 && (
                      <Button 
                        onClick={handleContinueToSummary}
                        className="bg-blue-500 hover:bg-blue-600"
                      >
                        Continuer
                      </Button>
                    )}
                  </div>
              
              {/* Tableau des Bénéficiaires */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground tracking-wider">
                        <input
                          type="checkbox"
                          checked={selectedBeneficiaries.length === beneficiariesList.length && beneficiariesList.length > 0}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedBeneficiaries(beneficiariesList.map(b => b.id))
                            } else {
                              setSelectedBeneficiaries([])
                            }
                          }}
                          className="w-4 h-4 text-blue-500 bg-background border-border rounded focus:ring-blue-500"
                        />
                      </th>
                                             <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground tracking-wider">BÉNÉFICIAIRE</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground tracking-wider">FOURNISSEUR</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground tracking-wider">COMPTE</th>
                       <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground tracking-wider">CONTACT</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground tracking-wider">STATUT</th>
                </tr>
              </thead>
              <tbody>
                    {currentBeneficiaries.map((beneficiary) => (
                      <tr
                        key={beneficiary.id}
                        className={`table-row-hover cursor-pointer ${
                          selectedBeneficiaries.includes(beneficiary.id) ? 'bg-blue-50 dark:bg-blue-950/20' : ''
                        }`}
                        onClick={() => handleBeneficiarySelection(beneficiary.id)}
                      >
                        <td className="py-3 px-4">
                          <input
                            type="checkbox"
                            checked={selectedBeneficiaries.includes(beneficiary.id)}
                            onChange={(e) => {
                              e.stopPropagation()
                              handleBeneficiarySelection(beneficiary.id)
                            }}
                            className="w-4 h-4 text-blue-500 bg-background border-border rounded focus:ring-blue-500"
                          />
                        </td>
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
                           <Badge className={getStatusColor(beneficiary.status)}>
                             {beneficiary.status === "active" ? "Actif" : "Inactif"}
                           </Badge>
                         </td>
                       </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
                  {/* Bouton d'Action en Bas */}
                  {selectedBeneficiaries.length > 0 && (
                    <div className="flex justify-end pt-4 border-t border-border">
                      <Button 
                        onClick={handleContinueToSummary}
                        className="bg-blue-500 hover:bg-blue-600"
                      >
                        Continuer
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                /* Fiche Récapitulative */
                <div className="space-y-6">
                  {/* Indicateur d'étapes */}
                  <div className="flex items-center justify-center mb-8">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                          ✓
                        </div>
                        <span className="text-sm font-medium text-green-600">Étape 1</span>
                      </div>
                      <div className="w-12 h-0.5 bg-gray-300"></div>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                          2
                        </div>
                        <span className="text-sm font-medium text-blue-600">Étape 2</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <h4 className="text-lg font-semibold">Récapitulatif </h4>
                    </div>
                    <Button 
                      variant="outline"
                      onClick={handleBackToSelection}
                    >
                      ← Retour à la sélection
                    </Button>
                  </div>

                  {/* Informations de Paiement */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-2">
                          <Users className="w-5 h-5 text-blue-500" />
                          <div className="text-sm text-muted-foreground">Total Bénéficiaires</div>
                        </div>
                        <div className="text-3xl font-bold text-blue-600">{selectedBeneficiaries.length}</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-2">
                          <DollarSign className="w-5 h-5 text-green-500" />
                          <div className="text-sm text-muted-foreground">Montant à Payer</div>
                        </div>
                        <div className="text-3xl font-bold text-green-600">0.00 €</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Montant à définir dans la liste des paiements
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Informations Supplémentaires */}
                  <div className="bg-muted/30 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="text-sm">
                        <span className="text-muted-foreground">Date d'Initiation :</span>
                        <span className="ml-2 font-medium">{new Date().toLocaleDateString('fr-FR')}</span>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground block mb-2">
                          Label
                        </label>
                        <Input
                          type="text"
                          placeholder="Ex: Paiement salaires Mars 2024"
                          className="text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Bouton d'Action Final */}
                  <div className="flex justify-end pt-4 border-t border-border">
                    <Button 
                      onClick={handleInitiateQuickPayments}
                      className="bg-blue-500 hover:bg-blue-600"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Initier le Paiement
                    </Button>
                  </div>
                </div>
              )}


            </div>
          )}

          {activeTab === "bulk-import" && (
            <div className="space-y-6">
              {!showImportSummary && !showImportRecap ? (
                <>
                  <div className="flex items-center gap-2 mb-4">
                    <Upload className="w-5 h-5 text-green-500" />
                    <h3 className="text-lg font-semibold">Importer en Masse</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <label className="text-sm font-medium text-muted-foreground mb-2 block">Sélectionner un fichier CSV/Excel</label>
                        <Input
                          type="file"
                          accept=".csv,.xlsx,.xls"
                          onChange={handleFileUpload}
                          className="cursor-pointer"
                        />
                      </div>
                      <div className="flex-shrink-0">
                        <Button
                          variant="outline"
                          onClick={downloadTemplate}
                          className="mt-6"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Importer le Modèle
                        </Button>
                      </div>
                    </div>
                    
                    <div className="bg-muted p-4 rounded-lg">
                      <h4 className="text-sm font-medium mb-2">Format attendu :</h4>
                      <p className="text-xs text-muted-foreground mb-2">Nom, Fournisseur, Compte, Montant, Date, Référence</p>
                      <p className="text-xs text-muted-foreground">Exemple : Jean Dupont, Orange Money, OM123456789, 150.00, 2024-01-15, PAY-2024-001</p>
                    </div>
                  </div>
                </>
              ) : !showImportRecap ? (
                /* Étape 1: Affichage des données importées */
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-foreground">
                        Paiements importés: {importedData.length}
                      </span>
                    </div>
                    <Button 
                      onClick={() => setShowImportRecap(true)}
                      className="bg-blue-500 hover:bg-blue-600"
                    >
                      Continuer
                    </Button>
                  </div>

                  {/* Tableau des Données Importées */}
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground tracking-wider">NOM</th>
                          <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground tracking-wider">FOURNISSEUR</th>
                          <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground tracking-wider">COMPTE</th>
                          <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground tracking-wider">MONTANT</th>
                          <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground tracking-wider">DATE</th>
                          <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground tracking-wider">RÉFÉRENCE</th>
                        </tr>
                      </thead>
                      <tbody>
                        {importedData.map((member, index) => (
                          <tr key={index} className="table-row-hover">
                    <td className="py-3 px-4">
                      <div className="text-sm text-foreground font-medium">{member.name}</div>
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
                              <div className="text-lg font-bold text-foreground">{member.amount}€</div>
                            </td>
                            <td className="py-3 px-4">
                              <div className="text-sm text-foreground">{member.date}</div>
                            </td>
                            <td className="py-3 px-4">
                              <span className="text-sm text-foreground font-mono">{member.reference}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Bouton d'Action en Bas */}
                  <div className="flex justify-end pt-4 border-t border-border">
                    <Button 
                      onClick={() => setShowImportRecap(true)}
                      className="bg-blue-500 hover:bg-blue-600"
                    >
                      Continuer
                    </Button>
                  </div>
                </div>
              ) : (
                /* Étape 2: Récapitulatif (comme initiation rapide) */
                <div className="space-y-6">
                  {/* Indicateur d'étapes */}
                  <div className="flex items-center justify-center mb-8">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                          ✓
                        </div>
                        <span className="text-sm font-medium text-green-600">Étape 1</span>
                      </div>
                      <div className="w-12 h-0.5 bg-gray-300"></div>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                          2
                        </div>
                        <span className="text-sm font-medium text-blue-600">Étape 2</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <h4 className="text-lg font-semibold">Récapitulatif</h4>
                    </div>
                    <Button 
                      variant="outline"
                      onClick={() => setShowImportRecap(false)}
                    >
                      ← Retour à l'import
                    </Button>
                  </div>

                  {/* Informations de Paiement */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-2">
                          <Users className="w-5 h-5 text-blue-500" />
                          <div className="text-sm text-muted-foreground">Total Paiements</div>
                        </div>
                        <div className="text-3xl font-bold text-blue-600">{importedData.length}</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-2">
                          <DollarSign className="w-5 h-5 text-green-500" />
                          <div className="text-sm text-muted-foreground">Montant Total</div>
                        </div>
                        <div className="text-3xl font-bold text-green-600">
                          {importedData.reduce((sum, item) => sum + item.amount, 0).toFixed(2)}€
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Informations Supplémentaires */}
                  <div className="bg-muted/30 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="text-sm">
                        <span className="text-muted-foreground">Date d'Initiation :</span>
                        <span className="ml-2 font-medium">{new Date().toLocaleDateString('fr-FR')}</span>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground block mb-2">
                          Label
                        </label>
                        <Input
                          type="text"
                          placeholder="Ex: Paiement salaires Mars 2024"
                          className="text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Bouton d'Action Final */}
                  <div className="flex justify-end pt-4 border-t border-border">
                    <Button 
                      onClick={handleBulkImportConfirm}
                      className="bg-green-500 hover:bg-green-600"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Confirmer l'Import
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "payment-list" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                  <List className="w-5 h-5 text-purple-500" />
                  <h3 className="text-lg font-semibold">Liste des Paiements Initiés</h3>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-muted-foreground">Total: {totalAmount.toFixed(2)}€</span>
                  <span className="text-muted-foreground">Lots: {paymentBatches.length}</span>
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
                      <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground tracking-wider">STATUT</th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground tracking-wider">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentBatches.map((batch) => (
                      <tr
                        key={batch.id}
                        className="table-row-hover cursor-pointer"
                        onClick={() => handleRowClick(batch)}
                      >
                        <td className="py-3 px-4">
                          <div className="text-sm text-foreground font-medium">{batch.date}</div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-lg font-bold text-foreground">{batch.totalAmount.toFixed(2)}€</div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-sm text-foreground font-mono">{batch.reference}</span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm text-foreground">{batch.beneficiaryCount}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-sm text-foreground">{batch.description}</div>
                        </td>
                        <td className="py-3 px-4">
                          <Badge className={getStatusColor(batch.status)}>
                            {batch.status === "pending" ? "En attente" : 
                             batch.status === "confirmed" ? "Confirmé" : "Terminé"}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleRowClick(batch)
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
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div className="text-sm text-muted-foreground">
                    Affichage {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, paymentBatches.length)} sur {paymentBatches.length} lots de paiements
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                    >
                      Précédent
                    </Button>
                    
                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(page)}
                          className="w-8 h-8 p-0"
                        >
                          {page}
                        </Button>
                      ))}
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
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

      {/* Modal de Succès */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              Paiements Initiés avec Succès
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-4">
                Les paiements ont été initiés avec succès pour {selectedBeneficiaries.length} bénéficiaires.
              </p>
              <div className="bg-green-50 dark:bg-green-950/20 rounded-lg p-4">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                  <span className="text-sm font-medium text-green-800 dark:text-green-200">
                    {selectedBeneficiaries.length} paiements en attente
                  </span>
                </div>
                <p className="text-xs text-green-600 dark:text-green-400">
                  Les paiements sont maintenant disponibles dans la liste des paiements initiés.
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={handleCloseSuccessModal}
                className="flex-1"
              >
                Fermer
              </Button>
              <Button 
                variant="outline"
                onClick={() => {
                  setShowSuccessModal(false)
                  setActiveTab("payment-list")
                }}
                className="flex-1"
              >
                Voir les Paiements
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de Succès Import */}
      <Dialog open={showImportSuccessModal} onOpenChange={setShowImportSuccessModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                <Upload className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              Import Réussi
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-4">
                L'import a été effectué avec succès !
              </p>
              <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-4">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                    {importedCount} paiements importés
                  </span>
                </div>
                <p className="text-xs text-blue-600 dark:text-blue-400">
                  Les paiements sont maintenant disponibles dans la liste des paiements initiés.
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={() => setShowImportSuccessModal(false)}
                className="flex-1"
              >
                Fermer
              </Button>
              <Button 
                variant="outline"
                onClick={() => {
                  setShowImportSuccessModal(false)
                  setActiveTab("payment-list")
                }}
                className="flex-1"
              >
                Voir les Paiements
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
} 