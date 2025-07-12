'use client'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from '@/hooks/use-toast'
import { authService } from '@/lib/services/auth'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, Key, Loader2, Lock, Mail } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

const emailSchema = z.object({
  email: z.string().email('Email invalide')
})

const otpSchema = z.object({
  otp: z.string().min(6, 'Le code OTP doit contenir 6 chiffres').max(6)
})

const passwordSchema = z.object({
  newPassword: z.string().min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
  confirmPassword: z.string()
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"]
})

type EmailForm = z.infer<typeof emailSchema>
type OTPForm = z.infer<typeof otpSchema>
type PasswordForm = z.infer<typeof passwordSchema>

type Step = 'email' | 'otp' | 'password'

interface ResetPasswordPanelProps {
  onBack: () => void
  onSuccess: () => void
}

export function ResetPasswordPanel({ onBack, onSuccess }: ResetPasswordPanelProps) {
  const [currentStep, setCurrentStep] = useState<Step>('email')
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const emailForm = useForm<EmailForm>({
    resolver: zodResolver(emailSchema)
  })

  const otpForm = useForm<OTPForm>({
    resolver: zodResolver(otpSchema)
  })

  const passwordForm = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema)
  })

  const onEmailSubmit = async (data: EmailForm) => {
    setIsLoading(true)
    setError('')
    
    try {
      const response = await authService.requestPasswordResetOTP(data.email)
      setEmail(data.email)
      
      // Stocker les données temporaires pour l'OTP de réinitialisation
      if (response.token) {
        localStorage.setItem('temp_reset_data', JSON.stringify({
          email: data.email,
          token: response.token
        }))
        console.log('💾 Stored temp reset data with token:', response.token.substring(0, 20) + '...')
      }
      
      setCurrentStep('otp')
      toast({
        title: "Code OTP envoyé",
        description: "Vérifiez votre email pour le code OTP",
      })
    } catch (error: any) {
      setError(error.response?.data?.message || 'Erreur lors de l\'envoi du code OTP')
    } finally {
      setIsLoading(false)
    }
  }

  const onOTPSubmit = async (data: OTPForm) => {
    setIsLoading(true)
    setError('')
    
    try {
      // Vérifier l'OTP de réinitialisation avec le service d'authentification
      const response = await authService.verifyResetOTP(email, data.otp)
      setOtp(data.otp)
      
      // Stocker le token retourné par la vérification de l'OTP
      if (response.token) {
        const currentResetData = JSON.parse(localStorage.getItem('temp_reset_data') || '{}')
        localStorage.setItem('temp_reset_data', JSON.stringify({
          ...currentResetData,
          token: response.token
        }))
        console.log('💾 Updated temp reset data with verification token:', response.token.substring(0, 20) + '...')
      }
      
      setCurrentStep('password')
      toast({
        title: "Code OTP vérifié",
        description: "Code OTP valide, vous pouvez maintenant définir votre nouveau mot de passe",
      })
    } catch (error: any) {
      setError(error.response?.data?.message || 'Code OTP invalide ou expiré')
    } finally {
      setIsLoading(false)
    }
  }

  const onPasswordSubmit = async (data: PasswordForm) => {
    setIsLoading(true)
    setError('')
    
    try {
      await authService.resetPasswordWithOTP(email, otp, data.newPassword)
      
      // Nettoyer les données temporaires
      localStorage.removeItem('temp_reset_data')
      console.log('🧹 Cleaned up temp reset data')
      
      toast({
        title: "Mot de passe réinitialisé",
        description: "Votre mot de passe a été modifié avec succès. Vous allez être redirigé vers la page de connexion.",
      })
      
      // Rediriger vers la page de login après un délai
      setTimeout(() => {
        window.location.href = '/login'
      }, 2000)
      
    } catch (error: any) {
      setError(error.response?.data?.message || 'Erreur lors de la réinitialisation du mot de passe')
    } finally {
      setIsLoading(false)
    }
  }

  const resendOTP = async () => {
    setIsLoading(true)
    setError('')
    
    try {
      const response = await authService.requestPasswordResetOTP(email)
      
      // Mettre à jour les données temporaires avec le nouveau token
      if (response.token) {
        localStorage.setItem('temp_reset_data', JSON.stringify({
          email: email,
          token: response.token
        }))
        console.log('💾 Updated temp reset data with new token:', response.token.substring(0, 20) + '...')
      }
      
      toast({
        title: "Code OTP renvoyé",
        description: "Un nouveau code OTP a été envoyé à votre email",
      })
    } catch (error: any) {
      setError(error.response?.data?.message || 'Erreur lors de l\'envoi du code OTP')
    } finally {
      setIsLoading(false)
    }
  }

  const goBack = () => {
    if (currentStep === 'otp') {
      setCurrentStep('email')
      setError('')
    } else if (currentStep === 'password') {
      setCurrentStep('otp')
      setError('')
    }
  }

  // Étape 1: Saisie de l'email
  if (currentStep === 'email') {
    return (
      <div className="w-full max-w-md p-8 rounded-2xl shadow-xl border border-border bg-card">
        <div className="flex items-center gap-3 mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="h-8 w-8"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">S</span>
            </div>
            <div>
              <h2 className="text-lg font-bold text-primary">Sky Pay</h2>
            </div>
          </div>
        </div>
        
        <h1 className="text-2xl font-bold mb-2 text-foreground">Mot de passe oublié</h1>
        <p className="text-muted-foreground mb-6">
          Entrez votre email pour recevoir un code OTP de réinitialisation
        </p>
        
        <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="votre@email.com"
                className="pl-10"
                {...emailForm.register('email')}
              />
            </div>
            {emailForm.formState.errors.email && (
              <p className="text-sm text-red-600">
                {emailForm.formState.errors.email.message}
              </p>
            )}
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button 
            type="submit" 
            className="w-full py-3 rounded-lg text-base font-semibold bg-blue-600 hover:bg-blue-700 text-white transition" 
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Envoi en cours...
              </div>
            ) : (
              "Envoyer le code OTP"
            )}
          </Button>
        </form>
      </div>
    )
  }

  // Étape 2: Saisie du code OTP
  if (currentStep === 'otp') {
    return (
      <div className="w-full max-w-md p-8 rounded-2xl shadow-xl border border-border bg-card">
        <div className="flex items-center gap-3 mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={goBack}
            className="h-8 w-8"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">S</span>
            </div>
            <div>
              <h2 className="text-lg font-bold text-primary">Sky Pay</h2>
            </div>
          </div>
        </div>
        
        <h1 className="text-2xl font-bold mb-2 text-foreground">Code OTP</h1>
        <p className="text-muted-foreground mb-6">
          Entrez le code OTP envoyé à {email}
        </p>
        
        <form onSubmit={otpForm.handleSubmit(onOTPSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="otp">Code OTP</Label>
            <div className="relative">
              <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="otp"
                type="text"
                placeholder="123456"
                maxLength={6}
                className="pl-10"
                {...otpForm.register('otp')}
              />
            </div>
            {otpForm.formState.errors.otp && (
              <p className="text-sm text-red-600">
                {otpForm.formState.errors.otp.message}
              </p>
            )}
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button 
            type="submit" 
            className="w-full py-3 rounded-lg text-base font-semibold bg-blue-600 hover:bg-blue-700 text-white transition" 
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Vérification...
              </div>
            ) : (
              "Vérifier le code OTP"
            )}
          </Button>

          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={resendOTP}
            disabled={isLoading}
          >
            Renvoyer le code OTP
          </Button>
        </form>
      </div>
    )
  }

  // Étape 3: Changement de mot de passe
  return (
    <div className="w-full max-w-md p-8 rounded-2xl shadow-xl border border-border bg-card">
      <div className="flex items-center gap-3 mb-8">
        <Button
          variant="ghost"
          size="icon"
          onClick={goBack}
          className="h-8 w-8"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg">S</span>
          </div>
          <div>
            <h2 className="text-lg font-bold text-primary">Sky Pay</h2>
          </div>
        </div>
      </div>
      
      <h1 className="text-2xl font-bold mb-2 text-foreground">Nouveau mot de passe</h1>
      <p className="text-muted-foreground mb-6">
        Définissez votre nouveau mot de passe
      </p>
      
      <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="newPassword">Nouveau mot de passe</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="newPassword"
              type="password"
              placeholder="Nouveau mot de passe"
              className="pl-10"
              {...passwordForm.register('newPassword')}
            />
          </div>
          {passwordForm.formState.errors.newPassword && (
            <p className="text-sm text-red-600">
              {passwordForm.formState.errors.newPassword.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Confirmer le mot de passe"
              className="pl-10"
              {...passwordForm.register('confirmPassword')}
            />
          </div>
          {passwordForm.formState.errors.confirmPassword && (
            <p className="text-sm text-red-600">
              {passwordForm.formState.errors.confirmPassword.message}
            </p>
          )}
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Button 
          type="submit" 
          className="w-full py-3 rounded-lg text-base font-semibold bg-blue-600 hover:bg-blue-700 text-white transition" 
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Réinitialisation...
            </div>
          ) : (
            "Réinitialiser le mot de passe"
          )}
        </Button>
      </form>
    </div>
  )
} 