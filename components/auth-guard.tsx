"use client"

import { AuthSkeleton } from "@/components/auth-skeleton"
import { useAuthStore } from "@/lib/stores/authStore"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

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
      userEmail: user?.email,
      hasUserRole: !!user?.Role,
      hasPermissions: !!user?.Role?.permissions
    })

    // Vérifier si l'utilisateur est authentifié (token suffit)
    if (!isAuthenticated || !token) {
      console.log('❌ AuthGuard: Not authenticated, redirecting to login')
      router.push('/login')
      return
    }

    // Si authentifié avec token, autoriser l'accès même si les données utilisateur ne sont pas complètes
    // Les données utilisateur seront chargées par useAuthCheck
    console.log('✅ AuthGuard: User authenticated with token, allowing access')
    setIsChecking(false)
  }, [isAuthenticated, token, router])

  // Afficher le fallback pendant la vérification
  if (isChecking) {
    return fallback || <AuthSkeleton />
  }

  // Si pas authentifié, ne rien afficher (redirection en cours)
  if (!isAuthenticated || !token) {
    return null
  }

  // Afficher le contenu protégé
  return <>{children}</>
} 