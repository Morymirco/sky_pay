import { useToast } from '@/components/ui/use-toast'
import { useAuthStore } from '../stores/authStore'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export const useSessionToast = () => {
  const { toast } = useToast()
  const { logout } = useAuthStore()
  const router = useRouter()

  const showSessionExpiredToast = () => {
    toast({
      title: "Session expirée",
      description: "Votre session a expiré. Veuillez vous reconnecter.",
      variant: "destructive",
      duration: 8000, // 8 secondes pour donner le temps de lire
      action: (
        <button
          onClick={() => {
            logout()
            router.push('/login')
          }}
          className="bg-white text-red-600 px-3 py-1 rounded text-sm font-medium hover:bg-gray-100 transition-colors"
        >
          Se reconnecter
        </button>
      ),
    })
  }

  const showTokenRefreshToast = () => {
    toast({
      title: "Session renouvelée",
      description: "Votre session a été automatiquement renouvelée.",
      variant: "default",
      duration: 3000, // 3 secondes
    })
  }

  const showAuthErrorToast = (message: string) => {
    toast({
      title: "Erreur d'authentification",
      description: message,
      variant: "destructive",
      duration: 5000,
    })
  }

  // Fonction de test pour démonstration
  const testSessionExpiredToast = () => {
    showSessionExpiredToast()
  }

  const testTokenRefreshToast = () => {
    showTokenRefreshToast()
  }

  return {
    showSessionExpiredToast,
    showTokenRefreshToast,
    showAuthErrorToast,
    testSessionExpiredToast,
    testTokenRefreshToast,
  }
} 