"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/lib/hooks/useAuth"
import { useAuthStore } from "@/lib/stores/authStore"
import { passwordChangeSchema } from "@/lib/validations/auth"
import { AlertTriangle, CheckCircle, Eye, EyeOff, Lock, XCircle } from "lucide-react"
import { useState } from "react"

interface ChangePasswordModalProps {
  isOpen: boolean
  onClose: () => void
  isFirstLogin?: boolean
}

export function ChangePasswordModal({ isOpen, onClose, isFirstLogin = false }: ChangePasswordModalProps) {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: ""
  })

  const { changePassword } = useAuth()
  const { setFirstLogin } = useAuthStore()

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setError("") // Clear error when user types
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // Validation avec Zod
      passwordChangeSchema.parse(formData)
    } catch (validationError: any) {
      setError(validationError.errors[0]?.message || "Données invalides")
      setIsLoading(false)
      return
    }

    try {
      console.log('🔐 Changing password...')
      await changePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      })
      
      console.log('✅ Password changed successfully')
      setSuccess(true)
      setFirstLogin(false) // Marquer que ce n'est plus le premier login
      
      // Fermer le modal après 2 secondes seulement si ce n'est pas le premier login
      if (!isFirstLogin) {
        setTimeout(() => {
          onClose()
          setSuccess(false)
          setFormData({
            currentPassword: "",
            newPassword: "",
            confirmNewPassword: ""
          })
        }, 2000)
      } else {
        // Pour le premier login, rediriger vers le dashboard après 2 secondes
        setTimeout(() => {
          window.location.href = '/dashboard'
        }, 2000)
      }
      
    } catch (err: any) {
      console.error('❌ Password change failed:', err)
      setError(err.message || "Erreur lors du changement de mot de passe")
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    // Empêcher la fermeture si c'est le premier login et que le changement n'est pas réussi
    if (isFirstLogin && !success) {
      console.log('🔒 Cannot close modal - first login requires password change')
      return
    }
    
    if (!isLoading && !success) {
      onClose()
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: ""
      })
      setError("")
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent 
        className="sm:max-w-md" 
        onEscapeKeyDown={(e) => {
          if (isFirstLogin && !success) {
            e.preventDefault()
            return
          }
          handleClose()
        }}
        onInteractOutside={(e) => {
          if (isFirstLogin && !success) {
            e.preventDefault()
            return
          }
          handleClose()
        }}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-blue-500" />
            {isFirstLogin ? "Changement de mot de passe obligatoire" : "Changer votre mot de passe"}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {success ? (
            <div className="text-center space-y-4">
              <div className="mx-auto w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-green-600">Mot de passe changé avec succès !</h3>
                <p className="text-sm text-muted-foreground">
                  {isFirstLogin 
                    ? "Votre mot de passe a été mis à jour. Vous allez être redirigé vers le dashboard."
                    : "Votre mot de passe a été mis à jour. Vous pouvez maintenant utiliser votre nouveau mot de passe."
                  }
                </p>
              </div>
            </div>
          ) : (
            <>
              {isFirstLogin && (
                <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-amber-800 dark:text-amber-200 mb-1">
                        Changement obligatoire
                      </h4>
                      <p className="text-sm text-amber-700 dark:text-amber-300">
                        Pour des raisons de sécurité, vous devez changer votre mot de passe temporaire avant d'accéder au dashboard.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground">
                  {isFirstLogin 
                    ? "Veuillez définir un nouveau mot de passe sécurisé pour votre compte."
                    : "Pour des raisons de sécurité, vous pouvez changer votre mot de passe."
                  }
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Mot de passe actuel */}
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-1 block">
                    Mot de passe actuel
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type={showCurrentPassword ? "text" : "password"}
                      placeholder="Votre mot de passe actuel"
                      value={formData.currentPassword}
                      onChange={(e) => handleInputChange("currentPassword", e.target.value)}
                      className="pl-10 pr-10"
                      disabled={isLoading}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1/2 -translate-y-1/2 w-8 h-8 text-muted-foreground hover:text-foreground"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      disabled={isLoading}
                    >
                      {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>

                {/* Nouveau mot de passe */}
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-1 block">
                    Nouveau mot de passe
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type={showNewPassword ? "text" : "password"}
                      placeholder="Votre nouveau mot de passe"
                      value={formData.newPassword}
                      onChange={(e) => handleInputChange("newPassword", e.target.value)}
                      className="pl-10 pr-10"
                      disabled={isLoading}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1/2 -translate-y-1/2 w-8 h-8 text-muted-foreground hover:text-foreground"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      disabled={isLoading}
                    >
                      {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Au moins 8 caractères avec minuscule, majuscule et chiffre
                  </p>
                </div>

                {/* Confirmation du nouveau mot de passe */}
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-1 block">
                    Confirmer le nouveau mot de passe
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirmez votre nouveau mot de passe"
                      value={formData.confirmNewPassword}
                      onChange={(e) => handleInputChange("confirmNewPassword", e.target.value)}
                      className="pl-10 pr-10"
                      disabled={isLoading}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1/2 -translate-y-1/2 w-8 h-8 text-muted-foreground hover:text-foreground"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      disabled={isLoading}
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>

                {/* Message d'erreur */}
                {error && (
                  <div className="text-red-500 bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded p-3 text-sm flex items-center gap-2">
                    <XCircle className="w-4 h-4 flex-shrink-0" />
                    {error}
                  </div>
                )}

                {/* Bouton de soumission */}
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? "Changement en cours..." : (isFirstLogin ? "Définir le mot de passe" : "Changer le mot de passe")}
                </Button>
              </form>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
} 