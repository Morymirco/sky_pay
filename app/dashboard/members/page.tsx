"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { CreditCard, Download, Edit, Mail, Phone, Plus, Search, Trash2, User, X } from "lucide-react"
import { useState } from "react"
import { useCreateMember, useDeleteMember, useExportMembers, useMembers, /* useMembersCount, */ useUpdateMember } from './../../../lib/hooks/useMembers'
import { usePaymentMethods } from './../../../lib/hooks/usePaymentMethods'
import { CreateMemberRequest, UpdateMemberRequest } from './../../../lib/services/members'

interface Member {
  id: number
  first_name: string
  last_name: string
  email: string | null
  phone: string | null
  paiementMethodeId: number
  paiement_identicator: string
  montant_paiement: number
  company_identificator: string
  town: string | null
  is_active: boolean
  paiementMethode: {
    id: number
    name: string
    logo: string
    // is_active: boolean // Supprimé car pas dans la structure fournie
  }
  createdAt: string
}

interface MembersResponse {
  success: boolean
  message: string
  data: {
    members: Member[]
    pagination: {
      currentPage: number
      totalPages: number
      totalItems: number
      itemsPerPage: number
      hasNextPage: boolean
      hasPrevPage: boolean
      nextPage: number | null
      prevPage: number | null
    }
    filters: {
      search: string
      is_active: boolean | null
      paiementMethodeId: number | null
    }
    company: {
      id: number
      name: string
    }
  }
}

export default function MembersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isActiveFilter, setIsActiveFilter] = useState<boolean | null>(null)
  const [paiementMethodeFilter, setPaiementMethodeFilter] = useState<number | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedMember, setSelectedMember] = useState<Member | null>(null)
  const [newMember, setNewMember] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    paiementMethodeId: 1,
    paiement_identicator: "",
    montant_paiement: 0,
    company_identificator: "",
    town: "",
    is_active: true
  })

  // ✅ ACTIVÉ - Récupérer les vraies données depuis l'API
  const { data: response, isLoading, error } = useMembers(currentPage, 20, JSON.stringify({ 
    search: searchTerm, 
    is_active: isActiveFilter, 
    paiementMethodeId: paiementMethodeFilter 
  }))
  
  // ✅ NOUVEAU - Récupérer les vraies méthodes de paiement depuis l'API
  const { data: paymentMethodsResponse, isLoading: isLoadingPaymentMethods } = usePaymentMethods()
  const paymentMethods = paymentMethodsResponse?.data || []
  
  // ✅ ACTIVÉ - Utiliser les hooks React Query réels
  // const { data: membersCount } = useMembersCount()
  const createMember = useCreateMember()
  const updateMember = useUpdateMember()
  const deleteMember = useDeleteMember()
  const exportMembers = useExportMembers()

  const members = response?.data?.members || []
  const pagination = response?.data?.pagination || { currentPage: 1, totalPages: 1, totalItems: 0, itemsPerPage: 20, hasNextPage: false, hasPrevPage: false, nextPage: null, prevPage: null }
  const company = response?.data?.company || { id: 0, name: "" }
  
  const handleAddMember = () => {
    if (newMember.first_name && newMember.last_name && newMember.paiement_identicator && newMember.company_identificator) {
      const member: CreateMemberRequest = {
        first_name: newMember.first_name,
        last_name: newMember.last_name,
        email: newMember.email || null,
        phone: newMember.phone || null,
        paiementMethodeId: newMember.paiementMethodeId || 1,
        paiement_identicator: newMember.paiement_identicator,
        montant_paiement: newMember.montant_paiement ?? 0,
        company_identificator: newMember.company_identificator,
        town: newMember.town || null,
        is_active: newMember.is_active ?? true
      }
      createMember.mutate(member, {
        onSuccess: () => {
          setNewMember({
            first_name: "",
            last_name: "",
            email: "",
            phone: "",
            paiementMethodeId: 1,
            paiement_identicator: "",
            montant_paiement: 0,
            company_identificator: "",
            town: "",
            is_active: true
          })
          setIsAddDialogOpen(false)
        }
      })
    }
  }

  const handleEditMember = () => {
    if (selectedMember && newMember.first_name && newMember.last_name && newMember.paiement_identicator && newMember.company_identificator) {
      const updatedMember: UpdateMemberRequest = {
        id: selectedMember.id,
        first_name: newMember.first_name,
        last_name: newMember.last_name,
        email: newMember.email || null,
        phone: newMember.phone || null,
        paiementMethodeId: newMember.paiementMethodeId || 1,
        paiement_identicator: newMember.paiement_identicator,
        montant_paiement: newMember.montant_paiement ?? 0,
        company_identificator: newMember.company_identificator,
        town: newMember.town || null,
        is_active: newMember.is_active ?? true
      }
      updateMember.mutate(updatedMember, {
        onSuccess: () => {
          setSelectedMember(null)
          setNewMember({
            first_name: "",
            last_name: "",
            email: "",
            phone: "",
            paiementMethodeId: 1,
            paiement_identicator: "",
            montant_paiement: 0,
            company_identificator: "",
            town: "",
            is_active: true
          })
          setIsEditDialogOpen(false)
        }
      })
    }
  }

  const handleDeleteMember = (id: number) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce bénéficiaire ?")) {
      deleteMember.mutate(id.toString())
    }
  }

  const handleEdit = (member: Member) => {
    setSelectedMember(member)
    setNewMember({
      first_name: member.first_name,
      last_name: member.last_name,
      email: member.email || "",
      phone: member.phone || "",
      paiementMethodeId: member.paiementMethodeId,
      paiement_identicator: member.paiement_identicator,
      montant_paiement: member.montant_paiement,
      company_identificator: member.company_identificator,
      town: member.town || "",
      is_active: member.is_active
    })
    setIsEditDialogOpen(true)
  }

  const handleExport = () => {
    exportMembers.mutate('csv', {
      onSuccess: (data: Blob) => {
        // Créer un fichier CSV à partir des données actuelles
        const csvContent = "data:text/csv;charset=utf-8," +
          "ID,Nom,Prénom,Email,Téléphone,Méthode de paiement,Identifiant de paiement,Actif,Montant,Ville,Entreprise,Date de création\n" +
          members.map(member =>
            `${member.id},${member.last_name},${member.first_name},${member.email || ''},${member.phone || ''},${member.paiementMethode.name},${member.paiement_identicator},${member.is_active ? 'Actif' : 'Inactif'},${member.montant_paiement},${member.town || ''},${company.name},${member.createdAt}`
          ).join("\n")
        
        const encodedUri = encodeURI(csvContent)
        const link = document.createElement("a")
        link.setAttribute("href", encodedUri)
        link.setAttribute("download", `bénéficiaires_${company.name}.csv`)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }
    })
  }

  const getPaiementMethodeColor = (methode: string) => {
    switch (methode) {
      case "Kulu": return "bg-green-500/20 text-green-400"
      case "Soutra Money": return "bg-blue-500/20 text-blue-400"
      case "Orange Money": return "bg-orange-500/20 text-orange-400"
      default: return "bg-muted text-muted-foreground"
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-wider">GESTION DES BÉNÉFICIAIRES - {company.name}</h1>
          <p className="text-sm text-muted-foreground">Gérez vos listes de bénéficiaires</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-500 hover:bg-blue-600 text-foreground">
                <Plus className="w-4 h-4 mr-2" />
                Ajouter Bénéficiaire
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Ajouter un nouveau bénéficiaire
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsAddDialogOpen(false)}
                    className="h-6 w-6"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </DialogTitle>
              </DialogHeader>
              
              <div className="grid grid-cols-2 gap-6">
                {/* Colonne gauche */}
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="first_name">Prénom *</Label>
                      <Input
                        id="first_name"
                        value={newMember.first_name}
                        onChange={(e) => setNewMember({...newMember, first_name: e.target.value})}
                        placeholder="Prénom"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="last_name">Nom *</Label>
                      <Input
                        id="last_name"
                        value={newMember.last_name}
                        onChange={(e) => setNewMember({...newMember, last_name: e.target.value})}
                        placeholder="Nom"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newMember.email || ''}
                      onChange={(e) => setNewMember({...newMember, email: e.target.value})}
                      placeholder="email@exemple.com"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Téléphone</Label>
                    <Input
                      id="phone"
                      value={newMember.phone || ''}
                      onChange={(e) => setNewMember({...newMember, phone: e.target.value})}
                      placeholder="+33 6 12 34 56 78"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="town">Ville</Label>
                    <Input
                      id="town"
                      value={newMember.town || ''}
                      onChange={(e) => setNewMember({...newMember, town: e.target.value})}
                      placeholder="Ville"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="company_identificator">Identifiant entreprise *</Label>
                    <Input
                      id="company_identificator"
                      value={newMember.company_identificator}
                      onChange={(e) => setNewMember({...newMember, company_identificator: e.target.value})}
                      placeholder="COMP001"
                    />
                  </div>
                </div>
                
                {/* Colonne droite */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="paiementMethode">Méthode de paiement *</Label>
                    <Select
                      value={newMember.paiementMethodeId?.toString() || ''}
                      onValueChange={(value) => setNewMember({...newMember, paiementMethodeId: parseInt(value) || 1})}
                      disabled={isLoadingPaymentMethods}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={isLoadingPaymentMethods ? "Chargement..." : "Sélectionner une méthode"} />
                      </SelectTrigger>
                      <SelectContent>
                        {paymentMethods.map((method) => (
                          <SelectItem key={method.id} value={method.id.toString()}>
                            {method.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="paiement_identicator">Identifiant de paiement *</Label>
                    <Input
                      id="paiement_identicator"
                      value={newMember.paiement_identicator}
                      onChange={(e) => setNewMember({...newMember, paiement_identicator: e.target.value})}
                      placeholder="Identifiant de paiement"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="montant_paiement">Montant de paiement</Label>
                    <Input
                      id="montant_paiement"
                      type="number"
                      value={newMember.montant_paiement || 0}
                      onChange={(e) => setNewMember({...newMember, montant_paiement: parseInt(e.target.value) || 0})}
                      placeholder="Montant"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div className="space-y-0.5">
                      <Label className="text-sm font-medium">Bénéficiaire actif</Label>
                      <p className="text-xs text-muted-foreground">Le bénéficiaire sera visible dans les listes</p>
                    </div>
                    <Switch
                      checked={newMember.is_active ?? true}
                      onCheckedChange={(checked) => setNewMember({...newMember, is_active: checked})}
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2 pt-6">
                <Button
                  variant="outline"
                  onClick={() => setIsAddDialogOpen(false)}
                  className="flex-1"
                >
                  Annuler
                </Button>
                <Button
                  onClick={handleAddMember}
                  disabled={createMember.isPending}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  {createMember.isPending ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Ajout...
                    </div>
                  ) : (
                    "Ajouter le bénéficiaire"
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Button 
            variant="outline" 
            onClick={handleExport} 
            className="border-border text-muted-foreground"
            disabled={exportMembers.isPending}
          >
            <Download className="w-4 h-4 mr-2" />
            {exportMembers.isPending ? "Exportation..." : "Export Excel"}
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <Card className="lg:col-span-3 bg-card border-border">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un bénéficiaire..."
                value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value)
                    pagination.currentPage = 1 // Reset to first page on search
                  }}
                className="pl-10 bg-muted border-neutral-600 text-foreground placeholder-neutral-400"
              />
              </div>
              <Select
                value={isActiveFilter === null ? 'all' : isActiveFilter ? 'true' : 'false'}
                onValueChange={(value) => setIsActiveFilter(value === 'all' ? null : value === 'true')}
              >
                <SelectTrigger className="bg-muted border-neutral-600 text-foreground">
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="true">Actif</SelectItem>
                  <SelectItem value="false">Inactif</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={paiementMethodeFilter === null ? 'all' : paiementMethodeFilter.toString()}
                onValueChange={(value) => setPaiementMethodeFilter(value === 'all' ? null : parseInt(value) || null)}
                disabled={isLoadingPaymentMethods}
              >
                <SelectTrigger className="bg-muted border-neutral-600 text-foreground">
                  <SelectValue placeholder={isLoadingPaymentMethods ? "Chargement..." : "Méthode de paiement"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les méthodes</SelectItem>
                  {paymentMethods.map((method) => (
                    <SelectItem key={method.id} value={method.id.toString()}>
                      {method.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground tracking-wider">TOTAL BÉNÉFICIAIRES</p>
                <p className="text-2xl font-bold text-foreground font-mono">
                  {pagination.totalItems || 0}
                </p>
              </div>
              <User className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground tracking-wider">BÉNÉFICIAIRES ACTIFS</p>
                <p className="text-2xl font-bold text-foreground font-mono">
                  {members.filter((m: Member) => m.is_active).length}
                </p>
              </div>
              <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Members Table */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-foreground tracking-wider">LISTE DES BÉNÉFICIAIRES</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading && <p className="text-foreground">Chargement...</p>}
          {error && <p className="text-red-500">Erreur: {error.message}</p>}
          {!isLoading && !error && members.length === 0 && (
            <p className="text-foreground">Aucun bénéficiaire trouvé</p>
          )}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground tracking-wider">MEMBRE</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground tracking-wider">CONTACT</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground tracking-wider">PAIEMENT</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground tracking-wider">ENTREPRISE</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground tracking-wider">MONTANT</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground tracking-wider">VILLE</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground tracking-wider">STATUT</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground tracking-wider">DATE</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground tracking-wider">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {members.map((member: Member) => (
                  <tr key={member.id} className="table-row-hover">
                    <td className="py-3 px-4">
                      <div>
                        <div className="text-sm text-foreground font-medium">{member.first_name} {member.last_name}</div>
                        <div className="text-xs text-muted-foreground">ID: {member.id}</div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="space-y-1">
                        {member.email && (
                        <div className="flex items-center gap-2 text-sm text-foreground">
                          <Mail className="w-3 h-3 text-muted-foreground" />
                          {member.email}
                        </div>
                        )}
                        {member.phone && (
                        <div className="flex items-center gap-2 text-sm text-foreground">
                          <Phone className="w-3 h-3 text-muted-foreground" />
                          {member.phone}
                        </div>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="space-y-1">
                        <Badge className={getPaiementMethodeColor(member.paiementMethode.name)}>
                          {member.paiementMethode.name}
                        </Badge>
                        <div className="flex items-center gap-2 text-sm text-foreground">
                        <CreditCard className="w-3 h-3 text-muted-foreground" />
                          <span className="font-mono">{member.paiement_identicator}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-foreground font-mono">
                      {member.company_identificator}
                    </td>
                    <td className="py-3 px-4 text-sm text-foreground font-mono">
                      {member.montant_paiement.toLocaleString('fr-FR')} FCFA
                    </td>
                    <td className="py-3 px-4 text-sm text-foreground">
                      {member.town || 'N/A'}
                    </td>
                    <td className="py-3 px-4">
                      <Badge className={member.is_active ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}>
                        {member.is_active ? "Actif" : "Inactif"}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-sm text-foreground font-mono">
                      {new Date(member.createdAt).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(member)}
                          className="edit-button-hover button-hover"
                          disabled={updateMember.isPending}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteMember(member.id)}
                          className="delete-button-hover button-hover"
                          disabled={deleteMember.isPending}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
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

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">Modifier le bénéficiaire</DialogTitle>
          </DialogHeader>
          
          <div className="grid grid-cols-2 gap-6">
            {/* Colonne gauche */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit_first_name">Prénom *</Label>
                  <Input
                    id="edit_first_name"
                    value={newMember.first_name}
                    onChange={(e) => setNewMember({...newMember, first_name: e.target.value})}
                    placeholder="Prénom"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit_last_name">Nom *</Label>
                  <Input
                    id="edit_last_name"
                    value={newMember.last_name}
                    onChange={(e) => setNewMember({...newMember, last_name: e.target.value})}
                    placeholder="Nom"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit_email">Email</Label>
                <Input
                  id="edit_email"
                  type="email"
                  value={newMember.email || ''}
                  onChange={(e) => setNewMember({...newMember, email: e.target.value})}
                  placeholder="email@exemple.com"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit_phone">Téléphone</Label>
                <Input
                  id="edit_phone"
                  value={newMember.phone || ''}
                  onChange={(e) => setNewMember({...newMember, phone: e.target.value})}
                  placeholder="+33 6 12 34 56 78"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit_town">Ville</Label>
                <Input
                  id="edit_town"
                  value={newMember.town || ''}
                  onChange={(e) => setNewMember({...newMember, town: e.target.value})}
                  placeholder="Ville"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit_company_identificator">Identifiant entreprise *</Label>
                <Input
                  id="edit_company_identificator"
                  value={newMember.company_identificator}
                  onChange={(e) => setNewMember({...newMember, company_identificator: e.target.value})}
                  placeholder="COMP001"
                />
              </div>
            </div>
            
            {/* Colonne droite */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit_paiementMethode">Méthode de paiement *</Label>
                <Select
                  value={newMember.paiementMethodeId?.toString() || ''}
                  onValueChange={(value) => setNewMember({...newMember, paiementMethodeId: parseInt(value) || 1})}
                  disabled={isLoadingPaymentMethods}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={isLoadingPaymentMethods ? "Chargement..." : "Sélectionner une méthode"} />
                  </SelectTrigger>
                  <SelectContent>
                    {paymentMethods.map((method) => (
                      <SelectItem key={method.id} value={method.id.toString()}>
                        {method.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit_paiement_identicator">Identifiant de paiement *</Label>
                <Input
                  id="edit_paiement_identicator"
                  value={newMember.paiement_identicator}
                  onChange={(e) => setNewMember({...newMember, paiement_identicator: e.target.value})}
                  placeholder="Identifiant de paiement"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit_montant_paiement">Montant de paiement</Label>
                <Input
                  id="edit_montant_paiement"
                  type="number"
                  value={newMember.montant_paiement || 0}
                  onChange={(e) => setNewMember({...newMember, montant_paiement: parseInt(e.target.value) || 0})}
                  placeholder="Montant"
                />
              </div>
              
              <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div className="space-y-0.5">
                  <Label className="text-sm font-medium">Bénéficiaire actif</Label>
                  <p className="text-xs text-muted-foreground">Le bénéficiaire sera visible dans les listes</p>
                </div>
                <Switch
                  checked={newMember.is_active ?? true}
                  onCheckedChange={(checked) => setNewMember({...newMember, is_active: checked})}
                />
              </div>
            </div>
          </div>
          
          <div className="flex gap-2 pt-6">
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
              className="flex-1"
            >
              Annuler
            </Button>
            <Button
              onClick={handleEditMember}
              disabled={updateMember.isPending}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              {updateMember.isPending ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Modification...
                </div>
              ) : (
                "Modifier le bénéficiaire"
              )}
            </Button>
          </div>
          
          {updateMember.isError && (
            <p className="text-red-500 text-sm mt-4">{updateMember.error?.message || 'Erreur lors de la modification'}</p>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
} 