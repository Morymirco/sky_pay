import { toast } from '@/components/ui/use-toast'

// Variable pour éviter les toasts multiples
let sessionExpiredToastShown = false
let tokenRefreshToastShown = false

// Fonction pour réinitialiser les flags (appelée lors du login)
export const resetSessionToastFlags = () => {
  sessionExpiredToastShown = false
  tokenRefreshToastShown = false
}

// Fonction pour afficher le toast de session expirée
export const showSessionExpiredToast = () => {
  if (sessionExpiredToastShown) return
  
  sessionExpiredToastShown = true
  
  toast({
    title: "Session expirée",
    description: "Votre session a expiré. Veuillez vous reconnecter.",
    variant: "destructive",
    duration: 8000, // 8 secondes pour donner le temps de lire
  })
}

// Fonction pour afficher le toast de renouvellement de token
export const showTokenRefreshToast = () => {
  if (tokenRefreshToastShown) return
  
  tokenRefreshToastShown = true
  
  toast({
    title: "Session renouvelée",
    description: "Votre session a été automatiquement renouvelée.",
    variant: "default",
    duration: 3000,
  })
  
  // Réinitialiser le flag après 5 secondes pour permettre un nouveau toast
  setTimeout(() => {
    tokenRefreshToastShown = false
  }, 5000)
}

// Fonction pour afficher une erreur d'authentification
export const showAuthErrorToast = (message: string) => {
  toast({
    title: "Erreur d'authentification",
    description: message,
    variant: "destructive",
    duration: 5000,
  })
}

// Fonction pour afficher un toast de déconnexion
export const showLogoutToast = () => {
  toast({
    title: "Déconnexion",
    description: "Vous avez été déconnecté avec succès.",
    variant: "default",
    duration: 3000,
  })
} 