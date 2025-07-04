"use client"

import { useState } from "react"
import { Settings, User, Shield, Trash2, Plus, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface UserAccount {
  id: string
  username: string
  email: string
  role: "admin" | "ajout" | "ajout_editer" | "ajout_editer_supprimer" | "confirmer"
  status: "active" | "inactive"
  createdAt: string
  lastLogin: string
}

export default function AccountPage() {
  const [users, setUsers] = useState<UserAccount[]>([
    {
      id: "1",
      username: "admin",
      email: "admin@skypay.com",
      role: "admin",
      status: "active",
      createdAt: "2025-01-01",
      lastLogin: "2025-01-15 14:30"
    },
    {
      id: "2",
      username: "manager",
      email: "manager@skypay.com",
      role: "ajout_editer_supprimer",
      status: "active",
      createdAt: "2025-01-05",
      lastLogin: "2025-01-14 09:15"
    },
    {
      id: "3",
      username: "operator",
      email: "operator@skypay.com",
      role: "ajout_editer",
      status: "active",
      createdAt: "2025-01-10",
      lastLogin: "2025-01-13 16:45"
    }
  ])

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin": return "bg-red-500/20 text-red-400"
      case "ajout_editer_supprimer": return "bg-orange-500/20 text-orange-400"
      case "ajout_editer": return "bg-blue-500/20 text-blue-400"
      case "ajout": return "bg-green-500/20 text-green-400"
      case "confirmer": return "bg-purple-500/20 text-purple-400"
      default: return "bg-neutral-500/20 text-muted-foreground"
    }
  }

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "admin": return "Administrateur"
      case "ajout_editer_supprimer": return "Ajout + Éditer + Supprimer"
      case "ajout_editer": return "Ajout + Éditer"
      case "ajout": return "Ajout"
      case "confirmer": return "Confirmer Paiement"
      default: return role
    }
  }

  const handleDeleteUser = (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) {
      setUsers(users.filter(user => user.id !== id))
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-wider">GESTION DE COMPTE</h1>
          <p className="text-sm text-muted-foreground">Gérez les utilisateurs et les rôles</p>
        </div>
        <Button className="bg-blue-500 hover:bg-blue-600 text-foreground">
          <Plus className="w-4 h-4 mr-2" />
          Nouvel Utilisateur
          </Button>
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
                  {users.filter(u => u.status === "active").length}
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
                  {users.filter(u => u.role === "admin").length}
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
          <CardTitle className="text-sm font-medium text-foreground tracking-wider">LISTE DES UTILISATEURS</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
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
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className="table-row-hover"
                  >
                    <td className="py-3 px-4">
                      <div className="text-sm text-foreground font-medium">{user.username}</div>
                      <div className="text-xs text-muted-foreground">ID: {user.id}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm text-foreground">{user.email}</span>
                    </td>
                    <td className="py-3 px-4">
                      <Badge className={getRoleColor(user.role)}>
                        {getRoleLabel(user.role)}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Badge className={user.status === "active" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}>
                        {user.status === "active" ? "Actif" : "Inactif"}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm text-foreground">
                        {new Date(user.lastLogin).toLocaleString('fr-FR')}
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
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Roles Information */}
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
                <Badge className="bg-orange-500/20 text-orange-400">Ajout + Éditer + Supprimer</Badge>
                <span className="text-sm text-muted-foreground">Peut ajouter, modifier et supprimer des données</span>
              </div>
              <div className="flex items-center gap-3">
                <Badge className="bg-blue-500/20 text-blue-400">Ajout + Éditer</Badge>
                <span className="text-sm text-muted-foreground">Peut ajouter et modifier des données</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Badge className="bg-green-500/20 text-green-400">Ajout</Badge>
                <span className="text-sm text-muted-foreground">Peut uniquement ajouter des données</span>
              </div>
              <div className="flex items-center gap-3">
                <Badge className="bg-purple-500/20 text-purple-400">Confirmer Paiement</Badge>
                <span className="text-sm text-muted-foreground">Peut confirmer les paiements</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 