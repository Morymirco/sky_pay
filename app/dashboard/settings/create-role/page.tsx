"use client"

import { useState } from "react"
import { UserPlus, Save, ArrowLeft, Shield, CheckSquare, Users, CreditCard, BarChart3, Settings, Home, RefreshCw, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"

interface MenuItem {
  id: string
  name: string
  icon: any
  description: string
  category: string
}

interface Role {
  id: string
  name: string
  description: string
  permissions: string[]
  createdAt: string
  createdBy: string
}

export default function CreateRolePage() {
  const [roleName, setRoleName] = useState("")
  const [roleDescription, setRoleDescription] = useState("")
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Liste des menus disponibles
  const availableMenus: MenuItem[] = [
    // Accueil
    { id: "dashboard", name: "Accueil", icon: Home, description: "Accès au tableau de bord principal", category: "Général" },
    
    // Gestion des bénéficiaires
    { id: "members", name: "Gestion des bénéficiaires", icon: Users, description: "Gérer la liste des bénéficiaires", category: "Bénéficiaires" },
    { id: "members-import", name: "Importer des bénéficiaires", icon: Users, description: "Importer des bénéficiaires en masse", category: "Bénéficiaires" },
    
    // Paiements
    { id: "payments", name: "Payer les bénéficiaires", icon: CreditCard, description: "Accès aux paiements", category: "Paiements" },
    { id: "payments-initiate", name: "Initier le paiement", icon: CreditCard, description: "Créer de nouveaux paiements", category: "Paiements" },
    { id: "payments-verify", name: "Vérifier le paiement", icon: CreditCard, description: "Vérifier les paiements en attente", category: "Paiements" },
    { id: "payments-validate", name: "Valider le paiement", icon: CreditCard, description: "Valider les paiements vérifiés", category: "Paiements" },
    
    // Rapports
    { id: "reports", name: "Rapports", icon: BarChart3, description: "Accès aux rapports de paiements", category: "Rapports" },
    
    // Demandes de rechargement
    { id: "recharge-requests", name: "Demandes de rechargement", icon: RefreshCw, description: "Gérer les demandes de rechargement", category: "Finance" },
    
    // Gestion de compte
    { id: "account", name: "Gestion de compte", icon: User, description: "Gérer son compte utilisateur", category: "Compte" },
    
    // Paramètres
    { id: "settings", name: "Paramètres", icon: Settings, description: "Accès aux paramètres système", category: "Administration" },
    { id: "settings-create-role", name: "Créer un rôle", icon: UserPlus, description: "Créer de nouveaux rôles", category: "Administration" },
  ]

  // Grouper les menus par catégorie
  const menusByCategory = availableMenus.reduce((acc, menu) => {
    if (!acc[menu.category]) {
      acc[menu.category] = []
    }
    acc[menu.category].push(menu)
    return acc
  }, {} as Record<string, MenuItem[]>)

  const handlePermissionToggle = (permissionId: string) => {
    setSelectedPermissions(prev => 
      prev.includes(permissionId)
        ? prev.filter(id => id !== permissionId)
        : [...prev, permissionId]
    )
  }

  const handleSelectAllCategory = (category: string) => {
    const categoryPermissions = menusByCategory[category].map(menu => menu.id)
    const allSelected = categoryPermissions.every(permission => selectedPermissions.includes(permission))
    
    if (allSelected) {
      // Désélectionner tous les permissions de la catégorie
      setSelectedPermissions(prev => prev.filter(id => !categoryPermissions.includes(id)))
    } else {
      // Sélectionner tous les permissions de la catégorie
      setSelectedPermissions(prev => [...new Set([...prev, ...categoryPermissions])])
    }
  }

  const handleSelectAll = () => {
    const allPermissions = availableMenus.map(menu => menu.id)
    const allSelected = allPermissions.every(permission => selectedPermissions.includes(permission))
    
    if (allSelected) {
      setSelectedPermissions([])
    } else {
      setSelectedPermissions(allPermissions)
    }
  }

  const handleSubmit = async () => {
    if (!roleName.trim() || !roleDescription.trim() || selectedPermissions.length === 0) {
      alert("Veuillez remplir tous les champs obligatoires et sélectionner au moins une permission.")
      return
    }

    setIsSubmitting(true)
    
    try {
      // Simulation d'un appel API
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const newRole: Role = {
        id: `role_${Date.now()}`,
        name: roleName,
        description: roleDescription,
        permissions: selectedPermissions,
        createdAt: new Date().toISOString(),
        createdBy: "Admin"
      }
      
      console.log("Nouveau rôle créé:", newRole)
      
      // Réinitialiser le formulaire
      setRoleName("")
      setRoleDescription("")
      setSelectedPermissions([])
      
      alert("Rôle créé avec succès !")
    } catch (error) {
      console.error("Erreur lors de la création du rôle:", error)
      alert("Erreur lors de la création du rôle. Veuillez réessayer.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleBack = () => {
    window.history.back()
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={handleBack} className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Retour
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground tracking-wider">CRÉER UN RÔLE</h1>
            <p className="text-sm text-muted-foreground">Définir un nouveau rôle avec ses permissions</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={handleSubmit}
            disabled={isSubmitting || !roleName.trim() || !roleDescription.trim() || selectedPermissions.length === 0}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                CRÉATION...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Save className="w-4 h-4" />
                CRÉER LE RÔLE
              </div>
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Informations du rôle */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-foreground tracking-wider flex items-center gap-2">
                <UserPlus className="w-4 h-4" />
                INFORMATIONS DU RÔLE
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="role-name" className="text-sm font-medium">
                  Nom du rôle *
                </Label>
                <Input
                  id="role-name"
                  placeholder="Ex: Administrateur, Gestionnaire, etc."
                  value={roleName}
                  onChange={(e) => setRoleName(e.target.value)}
                  className="h-10"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role-description" className="text-sm font-medium">
                  Description *
                </Label>
                <Textarea
                  id="role-description"
                  placeholder="Décrivez le rôle et ses responsabilités..."
                  value={roleDescription}
                  onChange={(e) => setRoleDescription(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>

              <div className="bg-muted/30 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Permissions sélectionnées</span>
                  <Badge className="bg-blue-500 text-white">
                    {selectedPermissions.length}
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground">
                  {selectedPermissions.length === 0 
                    ? "Aucune permission sélectionnée"
                    : `${selectedPermissions.length} permission${selectedPermissions.length > 1 ? 's' : ''} sélectionnée${selectedPermissions.length > 1 ? 's' : ''}`
                  }
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Permissions */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-foreground tracking-wider flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  PERMISSIONS
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSelectAll}
                  className="text-xs"
                >
                  {availableMenus.every(menu => selectedPermissions.includes(menu.id)) 
                    ? "Tout désélectionner" 
                    : "Tout sélectionner"
                  }
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {Object.entries(menusByCategory).map(([category, menus]) => (
                <div key={category} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-foreground">{category}</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSelectAllCategory(category)}
                      className="text-xs h-6 px-2"
                    >
                      {menus.every(menu => selectedPermissions.includes(menu.id)) 
                        ? "Désélectionner tout" 
                        : "Sélectionner tout"
                      }
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {menus.map((menu) => (
                      <div
                        key={menu.id}
                        className={`flex items-start gap-3 p-3 rounded-lg border transition-all duration-200 ${
                          selectedPermissions.includes(menu.id)
                            ? "bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800"
                            : "bg-muted/30 border-border hover:bg-muted/50"
                        }`}
                      >
                        <Checkbox
                          checked={selectedPermissions.includes(menu.id)}
                          onCheckedChange={() => handlePermissionToggle(menu.id)}
                          className="mt-1"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <menu.icon className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm font-medium text-foreground">
                              {menu.name}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {menu.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {category !== Object.keys(menusByCategory)[Object.keys(menusByCategory).length - 1] && (
                    <Separator />
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 