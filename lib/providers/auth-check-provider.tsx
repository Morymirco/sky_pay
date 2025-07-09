"use client"

import { useAuthCheck } from '../hooks/useAuthCheck'

interface AuthCheckProviderProps {
  children: React.ReactNode
}

export function AuthCheckProvider({ children }: AuthCheckProviderProps) {
  // Utiliser le hook pour vérifier l'état d'authentification
  useAuthCheck()
  
  return <>{children}</>
} 