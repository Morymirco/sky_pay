'use client'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from '@/hooks/use-toast'
import { authService } from '@/lib/services/auth'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, Loader2, Mail } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

const requestOTPSchema = z.object({
  email: z.string().email('Email invalide')
})

type RequestOTPForm = z.infer<typeof requestOTPSchema>

interface ForgotPasswordPanelProps {
  onBack: () => void
  onOTPSent: (email: string) => void
}

export function ForgotPasswordPanel({ onBack, onOTPSent }: ForgotPasswordPanelProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const form = useForm<RequestOTPForm>({
    resolver: zodResolver(requestOTPSchema)
  })

  const onSubmit = async (data: RequestOTPForm) => {
    setIsLoading(true)
    setError('')
    
    try {
      await authService.requestPasswordResetOTP(data.email)
      toast({
        title: "Code OTP envoyé",
        description: "Vérifiez votre email pour le code OTP",
      })
      onOTPSent(data.email)
    } catch (error: any) {
      setError(error.response?.data?.message || 'Erreur lors de l\'envoi du code OTP')
    } finally {
      setIsLoading(false)
    }
  }

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
      
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="votre@email.com"
              className="pl-10"
              {...form.register('email')}
            />
          </div>
          {form.formState.errors.email && (
            <p className="text-sm text-red-600">
              {form.formState.errors.email.message}
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