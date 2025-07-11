'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { LoginCredentials } from '@/lib/types/auth'
import { Eye, EyeOff, Lock, User } from 'lucide-react'
import { useState } from 'react'

interface LoginPanelProps {
  onLogin: (credentials: LoginCredentials) => Promise<void>
  onForgotPassword: () => void
  isLoading: boolean
  error: string
}

export function LoginPanel({ onLogin, onForgotPassword, isLoading, error }: LoginPanelProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: "",
    password: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!credentials.email || !credentials.password) {
      return
    }

    await onLogin(credentials)
  }

  return (
    <div className="w-full max-w-md p-8 rounded-2xl shadow-xl border border-border bg-card">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-xl">S</span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-primary">Sky Pay</h2>
            <p className="text-xs text-muted-foreground">Plateforme de paiement</p>
          </div>
        </div>
      </div>
      <h1 className="text-2xl font-bold mb-2 text-foreground">Nous sommes heureux de vous revoir</h1>
      <p className="text-muted-foreground mb-6">Veuillez vous connecter à votre compte pour consulter et gérer vos transactions</p>
      
      <form onSubmit={handleSubmit} className="space-y-5">
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
        <Button
          type="button"
          variant="link"
          className="px-0 font-normal text-blue-600 hover:underline text-sm"
          onClick={onForgotPassword}
        >
          Mot de passe oublié ?
        </Button>
        <div className="w-full border-t border-border my-2"></div>
        <span className="text-sm text-muted-foreground">Vous n'avez pas de compte ?</span>
      </div>
    </div>
  )
} 