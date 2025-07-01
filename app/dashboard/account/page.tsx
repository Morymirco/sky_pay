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
      default: return "bg-neutral-500/20 text-neutral-400"
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
          <h1 className="text-2xl font-bold text-white tracking-wider">GESTION DE COMPTE</h1>
          <p className="text-sm text-neutral-400">Gérez les utilisateurs et les rôles</p>
        </div>
        <Button className="bg-blue-500 hover:bg-blue-600 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Nouvel Utilisateur
          </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-neutral-900 border-neutral-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-neutral-400 tracking-wider">TOTAL UTILISATEURS</p>
                <p className="text-2xl font-bold text-white font-mono">{users.length}</p>
              </div>
              <User className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-neutral-900 border-neutral-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-neutral-400 tracking-wider">UTILISATEURS ACTIFS</p>
                <p className="text-2xl font-bold text-white font-mono">
                  {users.filter(u => u.status === "active").length}
                </p>
              </div>
              <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-neutral-900 border-neutral-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-neutral-400 tracking-wider">ADMINISTRATEURS</p>
                <p className="text-2xl font-bold text-white font-mono">
                  {users.filter(u => u.role === "admin").length}
                </p>
              </div>
              <Shield className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <Card className="bg-neutral-900 border-neutral-700">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider">LISTE DES UTILISATEURS</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-700">
                  <th className="text-left py-3 px-4 text-xs font-medium text-neutral-400 tracking-wider">UTILISATEUR</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-neutral-400 tracking-wider">EMAIL</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-neutral-400 tracking-wider">RÔLE</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-neutral-400 tracking-wider">STATUT</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-neutral-400 tracking-wider">DERNIÈRE CONNEXION</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-neutral-400 tracking-wider">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-neutral-800 hover:bg-neutral-800 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="text-sm text-white font-medium">{user.username}</div>
                      <div className="text-xs text-neutral-400">ID: {user.id}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm text-neutral-300">{user.email}</span>
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
                      <span className="text-sm text-neutral-300">
                        {new Date(user.lastLogin).toLocaleString('fr-FR')}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-neutral-400 hover:text-blue-500"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-neutral-400 hover:text-red-500"
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
      <Card className="bg-neutral-900 border-neutral-700">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider">INFORMATION SUR LES RÔLES</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Badge className="bg-red-500/20 text-red-400">Administrateur</Badge>
                <span className="text-sm text-neutral-400">Accès complet à toutes les fonctionnalités</span>
              </div>
              <div className="flex items-center gap-3">
                <Badge className="bg-orange-500/20 text-orange-400">Ajout + Éditer + Supprimer</Badge>
                <span className="text-sm text-neutral-400">Peut ajouter, modifier et supprimer des données</span>
              </div>
              <div className="flex items-center gap-3">
                <Badge className="bg-blue-500/20 text-blue-400">Ajout + Éditer</Badge>
                <span className="text-sm text-neutral-400">Peut ajouter et modifier des données</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Badge className="bg-green-500/20 text-green-400">Ajout</Badge>
                <span className="text-sm text-neutral-400">Peut uniquement ajouter des données</span>
              </div>
              <div className="flex items-center gap-3">
                <Badge className="bg-purple-500/20 text-purple-400">Confirmer Paiement</Badge>
                <span className="text-sm text-neutral-400">Peut confirmer les paiements</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 