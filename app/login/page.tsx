"use client"

import { useState, useEffect } from "react"
import { Eye, EyeOff, Lock, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ThemeToggle } from "@/components/theme-toggle"
import { useAuth } from "@/lib/hooks/useAuth"
import { LoginCredentials } from "@/lib/types/auth"
import { useRouter } from "next/navigation"
import { OTPVerification } from "@/components/auth/otp-verification"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showOTP, setShowOTP] = useState(false)
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: "",
    password: "",
  })

  const { login, isLoading, error, clearError, isAuthenticated } = useAuth()
  const router = useRouter()

  // Vérifier si l'utilisateur est déjà connecté
  useEffect(() => {
    // Ne pas rediriger si on est en train de saisir l'OTP
    if (isAuthenticated && !showOTP) {
      console.log('🔄 User already authenticated, redirecting to dashboard')
      router.push("/dashboard")
    }
  }, [isAuthenticated, router, showOTP])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('🔐 Login form submitted:', { email: credentials.email })
    clearError()
    
    if (!credentials.email || !credentials.password) {
      console.warn('⚠️ Missing credentials')
      return
    }

    console.log('🚀 Calling login function...')
    try {
      const response = await login(credentials)
      console.log('📱 Login response received:', response)
      console.log('📱 Response structure:', {
        hasData: !!response?.data,
        requiresOTP: response?.data?.requiresOTP,
        hasUser: !!response?.data?.user,
        hasToken: !!response?.data?.token
      })
      
      // L'API force l'OTP pour tous les utilisateurs
      // Même si requiresOTP n'est pas dans la réponse, l'OTP est toujours requis
      console.log('📱 OTP always required for this API')
      console.log('📱 Response data:', response?.data)
      
      // Stocker les données temporaires pour l'OTP
      console.log('💾 Storing temp auth data:', {
        hasToken: !!response.data.token,
        tokenPreview: response.data.token ? `${response.data.token.substring(0, 20)}...` : 'none',
        hasUser: !!response.data.user,
        userEmail: response.data.user?.email
      })
      localStorage.setItem('temp_auth_data', JSON.stringify(response.data))
      setShowOTP(true)
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
    setShowOTP(false)
    clearError()
  }

  // Afficher le composant OTP si nécessaire
  if (showOTP) {
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
            email={credentials.email}
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

      {/* Right: Form */}
      <div className="flex-1 flex items-center justify-center bg-white dark:bg-card">
        <div className="w-full max-w-md p-8 rounded-2xl shadow-xl border border-border">
          <div className="flex justify-between items-center mb-8">
            <img src="/placeholder-logo.png" alt="Sky Pay" className="h-10" />
            <ThemeToggle />
          </div>
          <h1 className="text-2xl font-bold mb-2 text-foreground">Nous sommes heureux de vous revoir</h1>
          <p className="text-muted-foreground mb-6">Veuillez vous connecter à votre compte pour consulter et gérer vos transactions</p>
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Identifiant</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Entrez votre identifiant"
                  value={credentials.email}
                  onChange={e => setCredentials({ ...credentials, email: e.target.value })}
                  className="pl-10 py-3 rounded-lg"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Mot de passe</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Votre mot de passe"
                  value={credentials.password}
                  onChange={e => setCredentials({ ...credentials, password: e.target.value })}
                  className="pl-10 pr-10 py-3 rounded-lg"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2 w-8 h-8 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
            </div>
            {error && (
              <div className="text-red-500 bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded p-3 text-sm flex items-center gap-2">
                <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            )}
            <Button
              type="submit"
              className="w-full py-3 rounded-lg text-base font-semibold bg-blue-600 hover:bg-blue-700 text-white transition"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Connexion...
                </div>
              ) : (
                "Connexion"
              )}
            </Button>
          </form>
          <div className="flex flex-col items-center gap-2 mt-6">
            <a href="#" className="text-blue-600 hover:underline text-sm font-medium">Mot de passe oublié ?</a>
            <div className="w-full border-t border-border my-2"></div>
            <span className="text-sm text-muted-foreground">Vous n'avez pas de compte ?</span>
          </div>
        </div>
      </div>
    </div>
  )
} 