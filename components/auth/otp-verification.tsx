"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/lib/hooks/useAuth"
import { OTPVerificationRequest } from "@/lib/types/auth"
import { otpVerificationSchema } from "@/lib/validations/auth"
import { ArrowLeft, Mail, RefreshCw, XCircle } from "lucide-react"
import { useEffect, useRef, useState } from "react"

interface OTPVerificationProps {
  email: string
  onBack: () => void
  onSuccess: () => void
}

export function OTPVerification({ email, onBack, onSuccess }: OTPVerificationProps) {
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""))
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [resendCountdown, setResendCountdown] = useState(0)
  const [isResending, setIsResending] = useState(false)
  
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const { verifyOTP, resendOTP } = useAuth()

  // Focus sur le premier input au montage
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus()
    }
  }, [])

  // Gestion du countdown pour le resend
  useEffect(() => {
    if (resendCountdown > 0) {
      const timer = setTimeout(() => setResendCountdown(resendCountdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [resendCountdown])

  const handleOtpChange = (index: number, value: string) => {
    // Accepter seulement les chiffres
    if (!/^\d*$/.test(value)) return
    if (value.length > 1) return // Empêcher plus d'un caractère

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    // Auto-focus sur le prochain input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }

    // Auto-submit si tous les champs sont remplis
    if (newOtp.every(digit => digit) && newOtp.join("").length === 6) {
      handleSubmit(newOtp.join(""))
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      // Retour au champ précédent si le champ actuel est vide
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleSubmit = async (otpValue?: string) => {
    const otpString = otpValue || otp.join("")
    
    // Validation avec Zod
    try {
      otpVerificationSchema.parse({ otp: otpString })
    } catch (validationError: any) {
      setError(validationError.errors[0]?.message || "Code OTP invalide")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      console.log('🔢 Submitting OTP:', otpString)
      const request: OTPVerificationRequest = { otp: otpString }
      
      // Vérifier que les données temporaires existent
      const tempData = localStorage.getItem('temp_auth_data')
      if (!tempData) {
        throw new Error('Données d\'authentification temporaires non trouvées')
      }
      
      const authData = JSON.parse(tempData)
      console.log('🔢 Temp auth data:', {
        hasToken: !!authData.token,
        tokenPreview: authData.token ? `${authData.token.substring(0, 20)}...` : 'none',
        hasUser: !!authData.user
      })
      
      await verifyOTP(request)
      console.log('✅ OTP verification successful')
      // Ne pas appeler onSuccess() ici - la redirection sera gérée par le hook useAuth
    } catch (err: any) {
      console.error('❌ OTP verification failed:', err)
      setError(err.message || "Code OTP invalide")
      // Reset OTP on error
      setOtp(new Array(6).fill(""))
      inputRefs.current[0]?.focus()
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendOTP = async () => {
    setIsResending(true)
    setError("")

    try {
      console.log('📧 Resending OTP to:', email)
      await resendOTP(email)
      setResendCountdown(60) // 60 secondes de countdown
      setOtp(new Array(6).fill(""))
      inputRefs.current[0]?.focus()
      console.log('✅ OTP resent successfully')
    } catch (err: any) {
      console.error('❌ Failed to resend OTP:', err)
      setError(err.message || "Erreur lors de l'envoi du code")
    } finally {
      setIsResending(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-4 top-4"
          onClick={onBack}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        
        <div className="mx-auto w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-4">
          <Mail className="h-6 w-6 text-blue-600" />
        </div>
        
        <CardTitle className="text-xl">Vérification requise</CardTitle>
        <CardDescription>
          Nous avons envoyé un code de vérification à <br />
          <span className="font-medium text-foreground">{email}</span>
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* OTP Input */}
        <div className="space-y-4">
          <label className="text-sm font-medium text-muted-foreground">
            Code de vérification (6 chiffres)
          </label>
          
          <div className="flex gap-2 justify-center">
            {otp.map((digit, index) => (
              <Input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el
                }}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-12 text-center text-lg font-semibold"
                disabled={isLoading}
                placeholder="0"
              />
            ))}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="text-red-500 bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded p-3 text-sm flex items-center gap-2">
            <XCircle className="w-4 h-4 flex-shrink-0" />
            {error}
          </div>
        )}

        {/* Submit Button */}
        <Button
          onClick={() => handleSubmit()}
          disabled={isLoading || otp.join("").length !== 6}
          className="w-full"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4 animate-spin" />
              Vérification...
            </div>
          ) : (
            "Vérifier le code"
          )}
        </Button>

        {/* Resend OTP */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-2">
            Vous n'avez pas reçu le code ?
          </p>
          
          {resendCountdown > 0 ? (
            <p className="text-sm text-muted-foreground">
              Nouveau code disponible dans {resendCountdown}s
            </p>
          ) : (
            <Button
              variant="link"
              onClick={handleResendOTP}
              disabled={isResending}
              className="text-sm"
            >
              {isResending ? (
                <div className="flex items-center gap-2">
                  <RefreshCw className="h-3 w-3 animate-spin" />
                  Envoi...
                </div>
              ) : (
                "Renvoyer le code"
              )}
            </Button>
          )}
        </div>

        {/* Instructions */}
        <div className="text-xs text-muted-foreground text-center space-y-1">
          <p>• Le code expire dans 10 minutes</p>
          <p>• Vérifiez vos spams si vous ne le recevez pas</p>
          <p>• Le code contient exactement 6 chiffres</p>
        </div>
      </CardContent>
    </Card>
  )
} 