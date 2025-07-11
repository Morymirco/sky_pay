"use client"

import { ForgotPasswordPanel } from "@/components/auth/forgot-password-panel"
import { LoginPanel } from "@/components/auth/login-panel"
import { OTPVerification } from "@/components/auth/otp-verification"
import { ResetPasswordPanel } from "@/components/auth/reset-password-panel"
import { ThemeToggle } from "@/components/theme-toggle"
import { useAuth } from "@/lib/hooks/useAuth"
import { LoginCredentials } from "@/lib/types/auth"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

type PanelType = 'login' | 'otp' | 'forgot-password' | 'reset-password'

export default function LoginPage() {
  const [currentPanel, setCurrentPanel] = useState<PanelType>('login')
  const [email, setEmail] = useState<string>('')

  const { login, isLoading, error, clearError, isAuthenticated } = useAuth()
  const router = useRouter()

  // Vérifier si l'utilisateur est déjà connecté
  useEffect(() => {
    // Ne pas rediriger si on est en train de saisir l'OTP
    if (isAuthenticated && currentPanel !== 'otp') {
      console.log('🔄 User already authenticated, redirecting to dashboard')
      router.push("/dashboard")
    }
  }, [isAuthenticated, router, currentPanel])

  const handleLogin = async (credentials: LoginCredentials) => {
    console.log('🔐 Login form submitted:', { email: credentials.email })
    clearError()
    
    console.log('🚀 Calling login function...')
    try {
      const response = await login(credentials)
      console.log('📱 Login response received:', response)
      
      // Stocker les données temporaires pour l'OTP
      console.log('💾 Storing temp auth data:', {
        hasToken: !!response.data.token,
        tokenPreview: response.data.token ? `${response.data.token.substring(0, 20)}...` : 'none',
        hasUser: !!response.data.user,
        userEmail: response.data.user?.email
      })
      localStorage.setItem('temp_auth_data', JSON.stringify(response.data))
      setEmail(credentials.email)
      setCurrentPanel('otp')
    } catch (error) {
      console.error('❌ Login failed:', error)
    }
  }

  const handleOTPSuccess = () => {
    console.log('🎉 OTP verification successful, redirecting to dashboard')
    router.push('/dashboard')
  }

  const handleOTPBack = () => {
    console.log('⬅️ Going back to login form')
    setCurrentPanel('login')
    clearError()
  }

  const handleForgotPassword = () => {
    setCurrentPanel('forgot-password')
  }

  const handleBackToLogin = () => {
    setCurrentPanel('login')
    clearError()
  }



  const handleResetSuccess = () => {
    router.push('/login')
  }

  // Afficher le composant OTP si nécessaire
  if (currentPanel === 'otp') {
    return (
      <div className="min-h-screen flex">
        {/* Left: Image + Slogan */}
        <div className="hidden lg:flex w-1/2 relative">
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/login-cover.jpg')" }}></div>
          <div className="absolute inset-0 bg-black/40"></div>
          <div className="absolute bottom-0 left-0 w-full p-10 pb-8 flex flex-col gap-6 z-10">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2 drop-shadow-lg">Rejoignez +25 000 entreprises et propulsez votre croissance</h2>
            </div>
            <div className="flex gap-6 items-center">
              <img src="/placeholder-logo.png" alt="Partenaire 1" className="h-10 bg-white rounded p-1 shadow" />
              <img src="/placeholder-logo.png" alt="Partenaire 2" className="h-10 bg-white rounded p-1 shadow" />
              <img src="/placeholder-logo.png" alt="Partenaire 3" className="h-10 bg-white rounded p-1 shadow" />
            </div>
          </div>
        </div>

        {/* Right: OTP Form */}
        <div className="flex-1 flex items-center justify-center bg-white dark:bg-card">
          <OTPVerification
            email={email}
            onBack={handleOTPBack}
            onSuccess={handleOTPSuccess}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex">
      {/* Left: Image + Slogan */}
      <div className="hidden lg:flex w-1/2 relative">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/login-cover.jpg')" }}></div>
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute bottom-0 left-0 w-full p-10 pb-8 flex flex-col gap-6 z-10">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2 drop-shadow-lg">Rejoignez +25 000 entreprises et propulsez votre croissance</h2>
          </div>
          <div className="flex gap-6 items-center">
            <img src="/placeholder-logo.png" alt="Partenaire 1" className="h-10 bg-white rounded p-1 shadow" />
            <img src="/placeholder-logo.png" alt="Partenaire 2" className="h-10 bg-white rounded p-1 shadow" />
            <img src="/placeholder-logo.png" alt="Partenaire 3" className="h-10 bg-white rounded p-1 shadow" />
          </div>
        </div>
      </div>

      {/* Right: Panel Container */}
      <div className="flex-1 flex items-center justify-center bg-white dark:bg-card">
        <div className="relative">
          {/* Theme Toggle */}
          <div className="absolute -top-12 right-0">
            <ThemeToggle />
          </div>
          
          {/* Dynamic Panel */}
          {currentPanel === 'login' && (
            <LoginPanel
              onLogin={handleLogin}
              onForgotPassword={handleForgotPassword}
              isLoading={isLoading}
              error={error || ''}
            />
          )}
          
          {currentPanel === 'forgot-password' && (
            <ForgotPasswordPanel
              onBack={handleBackToLogin}
              onOTPSent={() => setCurrentPanel('reset-password')}
            />
          )}
          
          {currentPanel === 'reset-password' && (
            <ResetPasswordPanel
              onBack={() => setCurrentPanel('forgot-password')}
              onSuccess={handleResetSuccess}
            />
          )}
        </div>
      </div>
    </div>
  )
} 