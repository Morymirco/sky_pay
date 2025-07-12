"use client"

import { useAuthStore } from "@/lib/stores/authStore"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { AuthSkeleton } from "@/components/auth-skeleton"

interface AuthGuardProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function AuthGuard({ children, fallback }: AuthGuardProps) {
  const { isAuthenticated, user, token } = useAuthStore()
  const router = useRouter()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    console.log('🔒 AuthGuard check:', { 
      isAuthenticated, 
      hasUser: !!user, 
      hasToken: !!token,
      userEmail: user?.email 
    })

    // Vérifier si l'utilisateur est authentifié
    if (!isAuthenticated || !user || !token) {
      console.log('❌ AuthGuard: Not authenticated, redirecting to login')
      router.push('/login')
      return
    }

    // Si tout est OK, autoriser l'accès
    console.log('✅ AuthGuard: User authenticated, allowing access')
    setIsChecking(false)
  }, [isAuthenticated, user, token, router])

  // Afficher le fallback pendant la vérification
  if (isChecking) {
    return fallback || <AuthSkeleton />
  }

  // Si pas authentifié, ne rien afficher (redirection en cours)
  if (!isAuthenticated || !user || !token) {
    return null
  }

  // Afficher le contenu protégé
  return <>{children}</>
} 