"use client"

import { useState, useEffect } from "react"
import { Eye, EyeOff, Lock, Mail, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ThemeToggle } from "@/components/theme-toggle"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  })
  const [error, setError] = useState("")

  // Vérifier si l'utilisateur est déjà connecté
  useEffect(() => {
    const token = localStorage.getItem("sky_pay_auth_token")
    if (token) {
      window.location.href = "/dashboard"
    }
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      // Simulate error for demo
      setError(credentials.email === "" || credentials.password === "" ? "Veuillez remplir tous les champs." : "")
      if (credentials.email && credentials.password) {
        localStorage.setItem("sky_pay_auth_token", "authenticated")
        window.location.href = "/dashboard"
      }
    }, 1200)
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
              <div className="text-red-500 bg-red-100 border border-red-200 rounded p-2 text-sm flex items-center gap-2">
                {error}
              </div>
            )}
            <Button
              type="submit"
              className="w-full py-3 rounded-lg text-base font-semibold bg-blue-600 hover:bg-blue-700 text-white transition"
              disabled={isLoading}
            >
              {isLoading ? "Connexion..." : "Connexion"}
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