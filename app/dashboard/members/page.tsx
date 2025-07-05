"use client"

import { useState } from "react"
import { Plus, Search, Download, Upload, Edit, Trash2, User, Mail, Phone, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

interface Member {
  id: string
  name: string
  email: string
  phone: string
  provider: "Kulu" | "Soutra Money" | "Orange Money"
  accountNumber: string
  status: "active" | "inactive"
  createdAt: string
}

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([
    {
      id: "1",
      name: "Jean Dupont",
      email: "jean.dupont@email.com",
      phone: "+33 6 12 34 56 78",
      provider: "Orange Money",
      accountNumber: "OM123456789",
      status: "active",
      createdAt: "2025-01-15"
    },
    {
      id: "2",
      name: "Marie Martin",
      email: "marie.martin@email.com",
      phone: "+33 6 98 76 54 32",
      provider: "Kulu",
      accountNumber: "KL987654321",
      status: "active",
      createdAt: "2025-01-20"
    },
    {
      id: "3",
      name: "Pierre Durand",
      email: "pierre.durand@email.com",
      phone: "+33 6 55 44 33 22",
      provider: "Soutra Money",
      accountNumber: "SM456789123",
      status: "inactive",
      createdAt: "2025-01-25"
    }
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedMember, setSelectedMember] = useState<Member | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [newMember, setNewMember] = useState<Partial<Member>>({
    name: "",
    email: "",
    phone: "",
    provider: "Orange Money",
    accountNumber: "",
    status: "active"
  })

  const filteredMembers = members.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.phone.includes(searchTerm) ||
    member.provider.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleAddMember = () => {
    if (newMember.name && newMember.email && newMember.phone && newMember.accountNumber) {
      const member: Member = {
        id: Date.now().toString(),
        name: newMember.name,
        email: newMember.email,
        phone: newMember.phone,
        provider: newMember.provider as "Kulu" | "Soutra Money" | "Orange Money",
        accountNumber: newMember.accountNumber,
        status: newMember.status as "active" | "inactive",
        createdAt: new Date().toISOString().split('T')[0]
      }
      setMembers([...members, member])
      setNewMember({
        name: "",
        email: "",
        phone: "",
        provider: "Orange Money",
        accountNumber: "",
        status: "active"
      })
      setIsAddDialogOpen(false)
    }
  }

  const handleEditMember = () => {
    if (selectedMember && newMember.name && newMember.email && newMember.phone && newMember.accountNumber) {
      const updatedMembers = members.map(member =>
        member.id === selectedMember.id
          ? {
              ...member,
              name: newMember.name!,
              email: newMember.email!,
              phone: newMember.phone!,
              provider: newMember.provider as "Kulu" | "Soutra Money" | "Orange Money",
              accountNumber: newMember.accountNumber!,
              status: newMember.status as "active" | "inactive"
            }
          : member
      )
      setMembers(updatedMembers)
      setSelectedMember(null)
      setNewMember({
        name: "",
        email: "",
        phone: "",
        provider: "Orange Money",
        accountNumber: "",
        status: "active"
      })
      setIsEditDialogOpen(false)
    }
  }

  const handleDeleteMember = (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce bénéficiaire ?")) {
      setMembers(members.filter(member => member.id !== id))
    }
  }

  const handleEdit = (member: Member) => {
    setSelectedMember(member)
    setNewMember({
      name: member.name,
      email: member.email,
      phone: member.phone,
      provider: member.provider,
      accountNumber: member.accountNumber,
      status: member.status
    })
    setIsEditDialogOpen(true)
  }

  const exportToExcel = () => {
    // Simulate Excel export
    const csvContent = "data:text/csv;charset=utf-8," +
      "ID,Nom,Email,Téléphone,Fournisseur,Numéro de compte,Statut,Date de création\n" +
      members.map(member => 
        `${member.id},${member.name},${member.email},${member.phone},${member.provider},${member.accountNumber},${member.status},${member.createdAt}`
      ).join("\n")
    
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", "bénéficiaires_sky_pay.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const getProviderColor = (provider: string) => {
    switch (provider) {
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
          <h1 className="text-2xl font-bold text-foreground tracking-wider">GESTION DES BÉNÉFICIAIRES</h1>
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
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Ajouter un nouveau bénéficiaire</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Nom complet</label>
                  <Input
                    value={newMember.name}
                    onChange={(e) => setNewMember({...newMember, name: e.target.value})}
                    placeholder="Nom complet"
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Email</label>
                  <Input
                    type="email"
                    value={newMember.email}
                    onChange={(e) => setNewMember({...newMember, email: e.target.value})}
                    placeholder="email@exemple.com"
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Téléphone</label>
                  <Input
                    value={newMember.phone}
                    onChange={(e) => setNewMember({...newMember, phone: e.target.value})}
                    className="bg-muted border-neutral-600 text-foreground"
                    placeholder="+33 6 12 34 56 78"
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Fournisseur</label>
                  <select
                    value={newMember.provider}
                    onChange={(e) => setNewMember({...newMember, provider: e.target.value as any})}
                    className="w-full bg-muted border border-neutral-600 text-foreground rounded-md px-3 py-2"
                  >
                    <option value="Orange Money">Orange Money</option>
                    <option value="Kulu">Kulu</option>
                    <option value="Soutra Money">Soutra Money</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Numéro de compte</label>
                  <Input
                    value={newMember.accountNumber}
                    onChange={(e) => setNewMember({...newMember, accountNumber: e.target.value})}
                    className="bg-muted border-neutral-600 text-foreground"
                    placeholder="Numéro de compte"
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Statut</label>
                  <select
                    value={newMember.status}
                    onChange={(e) => setNewMember({...newMember, status: e.target.value as any})}
                    className="w-full bg-muted border border-neutral-600 text-foreground rounded-md px-3 py-2"
                  >
                    <option value="active">Actif</option>
                    <option value="inactive">Inactif</option>
                  </select>
                </div>
                <div className="flex gap-2 pt-4">
                  <Button onClick={handleAddMember} className="bg-blue-500 hover:bg-blue-600 text-foreground">
                    Ajouter
                  </Button>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} className="border-border text-muted-foreground">
                    Annuler
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>


          <Button variant="outline" onClick={exportToExcel} className="border-border text-muted-foreground">
            <Download className="w-4 h-4 mr-2" />
            Export Excel
          </Button>
        </div>
      </div>

      {/* Search and Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <Card className="lg:col-span-2 bg-card border-border">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un bénéficiaire..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-muted border-neutral-600 text-foreground placeholder-neutral-400"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground tracking-wider">TOTAL BÉNÉFICIAIRES</p>
                <p className="text-2xl font-bold text-foreground font-mono">{members.length}</p>
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
                  {members.filter(m => m.status === "active").length}
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
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground tracking-wider">MEMBRE</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground tracking-wider">CONTACT</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground tracking-wider">FOURNISSEUR</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground tracking-wider">COMPTE</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground tracking-wider">STATUT</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground tracking-wider">DATE</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground tracking-wider">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filteredMembers.map((member) => (
                  <tr
                    key={member.id}
                    className="table-row-hover"
                  >
                    <td className="py-3 px-4">
                      <div>
                        <div className="text-sm text-foreground font-medium">{member.name}</div>
                        <div className="text-xs text-muted-foreground">ID: {member.id}</div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-foreground">
                          <Mail className="w-3 h-3 text-muted-foreground" />
                          {member.email}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-foreground">
                          <Phone className="w-3 h-3 text-muted-foreground" />
                          {member.phone}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge className={getProviderColor(member.provider)}>
                        {member.provider}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-3 h-3 text-muted-foreground" />
                        <span className="text-sm text-foreground font-mono">{member.accountNumber}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge className={member.status === "active" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}>
                        {member.status === "active" ? "Actif" : "Inactif"}
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
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteMember(member.id)}
                          className="delete-button-hover button-hover"
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
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">Modifier le bénéficiaire</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Nom complet</label>
              <Input
                value={newMember.name}
                onChange={(e) => setNewMember({...newMember, name: e.target.value})}
                className="bg-muted border-neutral-600 text-foreground"
                placeholder="Nom complet"
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Email</label>
              <Input
                type="email"
                value={newMember.email}
                onChange={(e) => setNewMember({...newMember, email: e.target.value})}
                className="bg-muted border-neutral-600 text-foreground"
                placeholder="email@exemple.com"
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Téléphone</label>
              <Input
                value={newMember.phone}
                onChange={(e) => setNewMember({...newMember, phone: e.target.value})}
                className="bg-muted border-neutral-600 text-foreground"
                placeholder="+33 6 12 34 56 78"
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Fournisseur</label>
              <select
                value={newMember.provider}
                onChange={(e) => setNewMember({...newMember, provider: e.target.value as any})}
                className="w-full bg-muted border border-neutral-600 text-foreground rounded-md px-3 py-2"
              >
                <option value="Orange Money">Orange Money</option>
                <option value="Kulu">Kulu</option>
                <option value="Soutra Money">Soutra Money</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Numéro de compte</label>
              <Input
                value={newMember.accountNumber}
                onChange={(e) => setNewMember({...newMember, accountNumber: e.target.value})}
                className="bg-muted border-neutral-600 text-foreground"
                placeholder="Numéro de compte"
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Statut</label>
              <select
                value={newMember.status}
                onChange={(e) => setNewMember({...newMember, status: e.target.value as any})}
                className="w-full bg-muted border border-neutral-600 text-foreground rounded-md px-3 py-2"
              >
                <option value="active">Actif</option>
                <option value="inactive">Inactif</option>
              </select>
            </div>
            <div className="flex gap-2 pt-4">
              <Button onClick={handleEditMember} className="bg-blue-500 hover:bg-blue-600 text-foreground">
                Modifier
              </Button>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} className="border-border text-muted-foreground">
                Annuler
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
} 