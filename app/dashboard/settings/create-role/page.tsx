"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { useCreateRole, useRole, useUpdateRole } from "@/lib/hooks/useRoles"
import { ArrowLeft, BarChart3, CreditCard, Home, RefreshCw, Save, Settings, Shield, User, UserPlus, Users } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

interface MenuItem {
  id: string
  name: string
  icon: any
  description: string
  category: string
}

export default function CreateRolePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const roleId = searchParams.get('id')
  const isEditing = !!roleId
  
  const [roleName, setRoleName] = useState("")
  const [roleDescription, setRoleDescription] = useState("")
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([])
  
  // Hooks React Query
  const createRoleMutation = useCreateRole()
  const updateRoleMutation = useUpdateRole()
  const { data: existingRole, isLoading: isLoadingRole } = useRole(roleId ? parseInt(roleId) : 0)

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

  // Fonction pour mapper les permissions de l'API vers les IDs de l'interface
  const mapApiPermissionsToInterface = (permissions: any) => {
    const selectedIds: string[] = []
    
    console.log('🔍 Mapping des permissions API vers interface:', permissions)
    
    if (!permissions) {
      console.warn('⚠️ Aucune permission trouvée dans la réponse')
      return selectedIds
    }
    
    // Accueil
    if (permissions.accueil?.permissions?.includes("view")) {
      selectedIds.push("dashboard")
      console.log('✅ Permission accueil.view → dashboard')
    }
    
    // Rapports
    if (permissions.rapports?.permissions?.includes("view")) {
      selectedIds.push("reports")
      console.log('✅ Permission rapports.view → reports')
    }
    
    // Paramètres
    if (permissions.parametres?.permissions?.includes("view")) {
      selectedIds.push("settings")
      console.log('✅ Permission parametres.view → settings')
    }
    
    // Gestion de compte
    if (permissions.gestion_compte?.permissions?.includes("view")) {
      selectedIds.push("account")
      console.log('✅ Permission gestion_compte.view → account')
    }
    
    // Demandes de rechargement
    if (permissions.demande_rechargement?.permissions?.includes("view")) {
      selectedIds.push("recharge-requests")
      console.log('✅ Permission demande_rechargement.view → recharge-requests')
    }
    
    // Gestion des bénéficiaires
    if (permissions.gestion_beneficiaires?.permissions?.includes("view")) {
      selectedIds.push("members")
      console.log('✅ Permission gestion_beneficiaires.view → members')
    }
    if (permissions.gestion_beneficiaires?.permissions?.includes("import")) {
      selectedIds.push("members-import")
      console.log('✅ Permission gestion_beneficiaires.import → members-import')
    }
    
    // Paiement des bénéficiaires
    if (permissions.paiement_beneficiaires?.permissions?.includes("view")) {
      selectedIds.push("payments")
      console.log('✅ Permission paiement_beneficiaires.view → payments')
    }
    if (permissions.paiement_beneficiaires?.permissions?.includes("initiate")) {
      selectedIds.push("payments-initiate")
      console.log('✅ Permission paiement_beneficiaires.initiate → payments-initiate')
    }
    if (permissions.paiement_beneficiaires?.permissions?.includes("verify")) {
      selectedIds.push("payments-verify")
      console.log('✅ Permission paiement_beneficiaires.verify → payments-verify')
    }
    if (permissions.paiement_beneficiaires?.permissions?.includes("validate")) {
      selectedIds.push("payments-validate")
      console.log('✅ Permission paiement_beneficiaires.validate → payments-validate')
    }
    
    // Administration
    if (permissions.isAdmin || permissions.canManageRoles) {
      selectedIds.push("settings-create-role")
      console.log('✅ Permission admin/roles → settings-create-role')
    }
    
    console.log('🔍 Permissions mappées finales:', selectedIds)
    return selectedIds
  }

  // Charger les données du rôle existant
  useEffect(() => {
    if (existingRole && isEditing) {
      console.log('🔍 Chargement du rôle existant:', existingRole)
      console.log('🔍 Permissions du rôle:', existingRole.permissions)
      
      setRoleName(existingRole.name)
      setRoleDescription(existingRole.description)
      const mappedPermissions = mapApiPermissionsToInterface(existingRole.permissions)
      console.log('🔍 Permissions mappées vers l\'interface:', mappedPermissions)
      setSelectedPermissions(mappedPermissions)
    }
  }, [existingRole, isEditing])

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
    const trimmedRoleName = (roleName || '').trim()
    const trimmedRoleDescription = (roleDescription || '').trim()
    
    if (!trimmedRoleName || !trimmedRoleDescription || selectedPermissions.length === 0) {
      alert("Veuillez remplir tous les champs obligatoires et sélectionner au moins une permission.")
      return
    }

    try {
      // Mapper les permissions sélectionnées vers la structure attendue par l'API
      const permissions = {
        accueil: { 
          name: "Accueil", 
          permissions: selectedPermissions.includes("dashboard") ? ["view"] : [], 
          subMenus: {} 
        },
        rapports: { 
          name: "Rapports", 
          permissions: selectedPermissions.includes("reports") ? ["view"] : [], 
          subMenus: {} 
        },
        parametres: { 
          name: "Paramètres", 
          permissions: selectedPermissions.includes("settings") ? ["view"] : [], 
          subMenus: {} 
        },
        gestion_compte: { 
          name: "Gestion de compte", 
          permissions: selectedPermissions.includes("account") ? ["view"] : [], 
          subMenus: {} 
        },
        demande_rechargement: { 
          name: "Demandes de rechargement", 
          permissions: selectedPermissions.includes("recharge-requests") ? ["view"] : [], 
          subMenus: {} 
        },
        gestion_beneficiaires: { 
          name: "Gestion des bénéficiaires", 
          permissions: [
            ...(selectedPermissions.includes("members") ? ["view"] : []),
            ...(selectedPermissions.includes("members-import") ? ["import"] : [])
          ], 
          subMenus: {} 
        },
        paiement_beneficiaires: { 
          name: "Paiement des bénéficiaires", 
          permissions: [
            ...(selectedPermissions.includes("payments") ? ["view"] : []),
            ...(selectedPermissions.includes("payments-initiate") ? ["initiate"] : []),
            ...(selectedPermissions.includes("payments-verify") ? ["verify"] : []),
            ...(selectedPermissions.includes("payments-validate") ? ["validate"] : [])
          ], 
          subMenus: {} 
        },
        isAdmin: selectedPermissions.includes("settings-create-role"),
        canManageRoles: selectedPermissions.includes("settings-create-role"),
        canManageUsers: selectedPermissions.includes("members") || selectedPermissions.includes("members-import")
      }

      console.log('🔍 Permissions sélectionnées:', selectedPermissions)
      console.log('🔍 Structure des permissions à envoyer:', permissions)

      if (isEditing && roleId) {
        // Mise à jour du rôle existant
        await updateRoleMutation.mutateAsync({
          id: parseInt(roleId),
          data: {
            name: trimmedRoleName,
            description: trimmedRoleDescription,
            permissions: permissions
          }
        })
        alert("Rôle mis à jour avec succès !")
      } else {
        // Création d'un nouveau rôle
        await createRoleMutation.mutateAsync({
          name: trimmedRoleName,
          description: trimmedRoleDescription,
          permissions: permissions
        })
        alert("Rôle créé avec succès !")
      }
      
      // Rediriger vers la liste des rôles
      router.push('/dashboard/settings/roles')
    } catch (error) {
      console.error("Erreur lors de la création/mise à jour du rôle:", error)
      alert("Erreur lors de la création/mise à jour du rôle. Veuillez réessayer.")
    }
  }

  const handleBack = () => {
    window.history.back()
  }

  if (isEditing && isLoadingRole) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement du rôle...</p>
        </div>
      </div>
    )
  }

  // Empêcher le rendu du formulaire si on est en mode édition et que les données ne sont pas encore chargées
  if (isEditing && !existingRole) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Préparation du formulaire...</p>
        </div>
      </div>
    )
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
            <h1 className="text-2xl font-bold text-foreground tracking-wider">
              {isEditing ? "MODIFIER LE RÔLE" : "CRÉER UN RÔLE"}
            </h1>
            <p className="text-sm text-muted-foreground">
              {isEditing ? "Modifier le rôle et ses permissions" : "Définir un nouveau rôle avec ses permissions"}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={handleSubmit}
            disabled={
              (isEditing ? updateRoleMutation.isPending : createRoleMutation.isPending) || 
              !(roleName || '').trim() || 
              !(roleDescription || '').trim() || 
              selectedPermissions.length === 0
            }
            className="bg-blue-600 hover:bg-blue-700"
          >
            {(isEditing ? updateRoleMutation.isPending : createRoleMutation.isPending) ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                {isEditing ? "MISE À JOUR..." : "CRÉATION..."}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Save className="w-4 h-4" />
                {isEditing ? "METTRE À JOUR" : "CRÉER LE RÔLE"}
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