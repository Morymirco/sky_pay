"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"

interface AuthGuardProps {
  children: React.ReactNode
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = () => {
      const token = localStorage.getItem("sky_pay_auth_token")
      const isLoginPage = pathname === "/login"
      
      if (!token && !isLoginPage) {
        // Redirect to login if not authenticated
        router.push("/login")
        return
      }
      
      if (token && isLoginPage) {
        // Redirect to dashboard if already authenticated
        router.push("/")
        return
      }
      
      setIsAuthenticated(!!token)
      setIsLoading(false)
    }

    checkAuth()
  }, [pathname, router])

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-neutral-400 text-sm">INITIALIZING SECURE CONNECTION...</p>
        </div>
      </div>
    )
  }

  // Don't render children for login page (it has its own layout)
  if (pathname === "/login") {
    return null
  }

  return <>{children}</>
} 