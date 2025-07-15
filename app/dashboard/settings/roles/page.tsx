"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useRoles } from "@/lib/hooks/useRoles"
import { Role, RolePermissions } from "@/lib/types/role"
import { ArrowLeft, Edit, Eye, MoreHorizontal, Plus, Search, Shield } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function RolesPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)
  const [showRoleDetails, setShowRoleDetails] = useState(false)

  // Hooks React Query
  const { data: rolesData, isLoading: isLoadingRoles, refetch } = useRoles()

  const handleViewRoleDetails = (role: Role) => {
    setSelectedRole(role)
    setShowRoleDetails(true)
  }

  const roles = rolesData || []
  const filteredRoles = roles.filter((role: Role) =>
    role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (role.description && role.description.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getPermissionCount = (permissions: RolePermissions) => {
    let count = 0
    Object.values(permissions).forEach(permission => {
      if (typeof permission === 'object' && permission !== null && 'permissions' in permission) {
        count += permission.permissions.length
      }
    })
    return count
  }

  const getPermissionSummary = (permissions: RolePermissions) => {
    const summary: string[] = []
    
    if (permissions.isAdmin) summary.push("Administrateur")
    if (permissions.canManageRoles) summary.push("Gestion des rôles")
    if (permissions.canManageUsers) summary.push("Gestion des utilisateurs")
    
    Object.entries(permissions).forEach(([key, permission]) => {
      if (typeof permission === 'object' && permission !== null && 'permissions' in permission && permission.permissions.length > 0) {
        summary.push(permission.name)
      }
    })
    
    return summary.slice(0, 3).join(", ") + (summary.length > 3 ? "..." : "")
  }

  const handleBack = () => {
    router.back()
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
            <h1 className="text-2xl font-bold text-foreground tracking-wider">GESTION DES RÔLES</h1>
            <p className="text-sm text-muted-foreground">Créer et gérer les rôles utilisateurs et leurs permissions</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => router.push('/dashboard/settings/create-role')}
            className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Créer un rôle
          </Button>
        </div>
      </div>

      {/* Contenu principal */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-foreground tracking-wider flex items-center gap-2">
            <Shield className="w-4 h-4" />
            LISTE DES RÔLES
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Barre de recherche */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Rechercher un rôle..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="text-sm text-muted-foreground">
              {filteredRoles.length} rôle{filteredRoles.length > 1 ? 's' : ''} trouvé{filteredRoles.length > 1 ? 's' : ''}
            </div>
          </div>

          {/* Tableau des rôles */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Nom du rôle</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="w-[150px]">Permissions</TableHead>
                  <TableHead className="w-[120px]">Créé le</TableHead>
                  <TableHead className="w-[80px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoadingRoles ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        Chargement des rôles...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredRoles.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      {searchTerm ? "Aucun rôle trouvé pour cette recherche" : "Aucun rôle disponible"}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRoles.map((role) => (
                    <TableRow key={role.id} className="hover:bg-muted/50">
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{role.name}</span>
                          {role.is_default && (
                            <Badge variant="secondary" className="text-xs">
                              Par défaut
                            </Badge>
                          )}
                          {role.permissions.isAdmin && (
                            <Badge variant="destructive" className="text-xs">
                              Admin
                            </Badge>
                          )}
                          {!role.is_active && (
                            <Badge variant="outline" className="text-xs">
                              Inactif
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {role.description}
                        </p>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <Badge variant="outline" className="text-xs">
                            {getPermissionCount(role.permissions)} permissions
                          </Badge>
                          <p className="text-xs text-muted-foreground line-clamp-1">
                            {getPermissionSummary(role.permissions)}
                          </p>
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(role.createdAt)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleViewRoleDetails(role)}>
                              <Eye className="w-4 h-4 mr-2" />
                              Voir les détails
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => router.push(`/dashboard/settings/create-role?id=${role.id}`)}>
                              <Edit className="w-4 h-4 mr-2" />
                              Modifier
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Modal de détails du rôle */}
      <Dialog open={showRoleDetails} onOpenChange={setShowRoleDetails}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              {selectedRole?.name}
            </DialogTitle>
          </DialogHeader>
          {selectedRole && (
            <div className="space-y-4">
              <div className="space-y-3">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Description</h4>
                  <p className="text-sm">{selectedRole.description}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Permissions principales</h4>
                  <div className="flex flex-wrap gap-1">
                    {Object.entries(selectedRole.permissions).map(([key, permission]) => {
                      if (typeof permission === 'object' && permission !== null && 'permissions' in permission && permission.permissions.length > 0) {
                        return (
                          <Badge key={key} variant="outline" className="text-xs">
                            {permission.name}
                          </Badge>
                        )
                      }
                      if (typeof permission === 'boolean' && permission) {
                        return (
                          <Badge key={key} variant="default" className="text-xs">
                            {key}
                          </Badge>
                        )
                      }
                      return null
                    })}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Créé le</h4>
                  <p className="text-sm">{formatDate(selectedRole.createdAt)}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
} 