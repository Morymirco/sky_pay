"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useCompanyUsers } from "@/lib/hooks/useCompanyUsers"
import { useCreateUser } from "@/lib/hooks/useCreateUser"
import { useRoles } from "@/lib/hooks/useRoles"
import { Edit, Plus, RefreshCw, Shield, Trash2, User, X } from "lucide-react"
import { useState } from "react"

export default function AccountPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [showCreateModal, setShowCreateModal] = useState(false)
  
  // Hook React Query pour récupérer les utilisateurs
  const { data: usersData, isLoading, error, refetch } = useCompanyUsers()
  
  // Hook React Query pour récupérer les rôles
  const { data: rolesData, isLoading: isLoadingRoles } = useRoles()
  
  // Hook React Query pour créer un utilisateur
  const createUserMutation = useCreateUser()
  
  const users = usersData?.data || []
  const roles = rolesData || []
  
  // État du formulaire de création
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    roleId: "",
    is_active: true
  })

  // Filtrer les utilisateurs selon la recherche
  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    `${user.first_name} ${user.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getRoleColor = (roleName: string) => {
    const role = roleName.toLowerCase()
    if (role.includes('admin')) return "bg-red-500/20 text-red-400"
    if (role.includes('manager')) return "bg-orange-500/20 text-orange-400"
    if (role.includes('operator')) return "bg-blue-500/20 text-blue-400"
    if (role.includes('user')) return "bg-green-500/20 text-green-400"
    return "bg-neutral-500/20 text-muted-foreground"
  }

  const getRoleLabel = (roleName: string) => {
    return roleName || "Utilisateur"
  }

  const handleDeleteUser = (id: number) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) {
      // TODO: Implémenter la suppression via API
      console.log("Suppression de l'utilisateur:", id)
    }
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "Jamais"
    return new Date(dateString).toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleCreateUser = async () => {
    if (!formData.first_name.trim() || !formData.last_name.trim() || !formData.username.trim() || !formData.email.trim() || !formData.roleId) {
      alert("Veuillez remplir tous les champs obligatoires")
      return
    }

    try {
      const userData = {
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
        username: formData.username.trim(),
        email: formData.email.toLowerCase().trim(),
        roleId: parseInt(formData.roleId),
        is_active: formData.is_active,
        is_first_login: true
      }
      
      console.log("Création de l'utilisateur:", userData)
      
      const result = await createUserMutation.mutateAsync(userData)
      
      if (result.success) {
        // Fermer le modal et réinitialiser le formulaire
        setShowCreateModal(false)
        setFormData({
          first_name: "",
          last_name: "",
          username: "",
          email: "",
          roleId: "",
          is_active: true
        })
        
        // Recharger manuellement la liste des utilisateurs
        refetch()
        
        alert(`Utilisateur créé avec succès ! ${result.data.emailMessage}`)
      } else {
        alert("Erreur lors de la création. Veuillez réessayer.")
      }
    } catch (error) {
      console.error("Erreur lors de la création:", error)
      alert("Erreur lors de la création. Veuillez réessayer.")
    }
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const resetForm = () => {
    setFormData({
      first_name: "",
      last_name: "",
      username: "",
      email: "",
      roleId: "",
      is_active: true
    })
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center py-8">
          <p className="text-red-500 mb-4">Erreur lors du chargement des utilisateurs</p>
          <Button onClick={() => refetch()} variant="outline">
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
          <h1 className="text-2xl font-bold text-foreground tracking-wider">GESTION DE COMPTE</h1>
          <p className="text-sm text-muted-foreground">Gérez les utilisateurs et les rôles</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => refetch()}
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
            Actualiser
          </Button>
          <Button 
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-500 hover:bg-blue-600 text-foreground"
          >
          <Plus className="w-4 h-4 mr-2" />
          Nouvel Utilisateur
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground tracking-wider">TOTAL UTILISATEURS</p>
                <p className="text-2xl font-bold text-foreground font-mono">{users.length}</p>
              </div>
              <User className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground tracking-wider">UTILISATEURS ACTIFS</p>
                <p className="text-2xl font-bold text-foreground font-mono">
                  {users.filter(u => u.is_active).length}
                </p>
              </div>
              <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground tracking-wider">ADMINISTRATEURS</p>
                <p className="text-2xl font-bold text-foreground font-mono">
                  {users.filter(u => u.Role?.name?.toLowerCase().includes('admin')).length}
                </p>
              </div>
              <Shield className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-foreground tracking-wider flex items-center justify-between">
            <span>LISTE DES UTILISATEURS</span>
            <div className="flex items-center gap-4">
              <input
                type="text"
                placeholder="Rechercher un utilisateur..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-3 py-1 text-sm border border-border rounded-md bg-background text-foreground"
              />
              <span className="text-xs text-muted-foreground">
                {filteredUsers.length} utilisateur{filteredUsers.length > 1 ? 's' : ''} trouvé{filteredUsers.length > 1 ? 's' : ''}
              </span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="text-center py-8">
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Chargement des utilisateurs...
                </div>
              </div>
            ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground tracking-wider">UTILISATEUR</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground tracking-wider">EMAIL</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground tracking-wider">RÔLE</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground tracking-wider">STATUT</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground tracking-wider">DERNIÈRE CONNEXION</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground tracking-wider">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-muted-foreground">
                        {searchTerm ? "Aucun utilisateur trouvé pour cette recherche" : "Aucun utilisateur disponible"}
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="table-row-hover"
                  >
                    <td className="py-3 px-4">
                          <div className="text-sm text-foreground font-medium">
                            {user.first_name} {user.last_name}
                          </div>
                          <div className="text-xs text-muted-foreground">@{user.username}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm text-foreground">{user.email}</span>
                    </td>
                    <td className="py-3 px-4">
                          <Badge className={getRoleColor(user.Role?.name || '')}>
                            {getRoleLabel(user.Role?.name || '')}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                          <Badge className={user.is_active ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}>
                            {user.is_active ? "Actif" : "Inactif"}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm text-foreground">
                            {formatDate(user.updatedAt)}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="edit-button-hover button-hover"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteUser(user.id)}
                          className="delete-button-hover button-hover"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                    ))
                  )}
              </tbody>
            </table>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Modal de création d'utilisateur */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Créer un nouvel utilisateur
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowCreateModal(false)}
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
                    value={formData.first_name}
                    onChange={(e) => handleInputChange("first_name", e.target.value)}
                    placeholder="Prénom"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last_name">Nom *</Label>
                  <Input
                    id="last_name"
                    value={formData.last_name}
                    onChange={(e) => handleInputChange("last_name", e.target.value)}
                    placeholder="Nom"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="username">Nom d'utilisateur *</Label>
                <Input
                  id="username"
                  value={formData.username}
                  onChange={(e) => handleInputChange("username", e.target.value)}
                  placeholder="nom.utilisateur"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="email@exemple.com"
                />
              </div>
            </div>
            
            {/* Colonne droite */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="role">Rôle *</Label>
                <Select value={formData.roleId} onValueChange={(value) => handleInputChange("roleId", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un rôle" />
                  </SelectTrigger>
                  <SelectContent>
                    {isLoadingRoles ? (
                      <SelectItem value="" disabled>Chargement des rôles...</SelectItem>
                    ) : roles.length === 0 ? (
                      <SelectItem value="" disabled>Aucun rôle disponible</SelectItem>
                    ) : (
                      roles.map((role) => (
                        <SelectItem key={role.id} value={role.id.toString()}>
                          {role.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div className="space-y-0.5">
                  <Label className="text-sm font-medium">Utilisateur actif</Label>
                  <p className="text-xs text-muted-foreground">L'utilisateur pourra se connecter</p>
                </div>
                <Switch
                  checked={formData.is_active}
                  onCheckedChange={(checked) => handleInputChange("is_active", checked)}
                />
              </div>
              
              <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
                <p className="text-sm text-blue-600 dark:text-blue-400">
                  <strong>Note :</strong> Un mot de passe temporaire sera généré automatiquement. 
                  L'utilisateur devra le changer lors de sa première connexion.
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex gap-2 pt-6">
            <Button
              variant="outline"
              onClick={() => {
                setShowCreateModal(false)
                resetForm()
              }}
              className="flex-1"
            >
              Annuler
            </Button>
            <Button
              onClick={handleCreateUser}
              disabled={createUserMutation.isPending}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              {createUserMutation.isPending ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Création...
                </div>
              ) : (
                "Créer l'utilisateur"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Roles Information - Commenté car les rôles ne sont pas connus à l'avance */}
      {/* 
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-foreground tracking-wider">INFORMATION SUR LES RÔLES</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Badge className="bg-red-500/20 text-red-400">Administrateur</Badge>
                <span className="text-sm text-muted-foreground">Accès complet à toutes les fonctionnalités</span>
              </div>
              <div className="flex items-center gap-3">
                <Badge className="bg-orange-500/20 text-orange-400">Manager</Badge>
                <span className="text-sm text-muted-foreground">Gestion des équipes et des projets</span>
              </div>
              <div className="flex items-center gap-3">
                <Badge className="bg-blue-500/20 text-blue-400">Opérateur</Badge>
                <span className="text-sm text-muted-foreground">Exécution des tâches assignées</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Badge className="bg-green-500/20 text-green-400">Utilisateur</Badge>
                <span className="text-sm text-muted-foreground">Accès limité aux fonctionnalités de base</span>
              </div>
              <div className="flex items-center gap-3">
                <Badge className="bg-purple-500/20 text-purple-400">Consultant</Badge>
                <span className="text-sm text-muted-foreground">Accès en lecture seule</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      */}
    </div>
  )
} 