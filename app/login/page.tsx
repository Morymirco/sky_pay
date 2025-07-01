"use client"

import { useState } from "react"
import { Eye, EyeOff, Shield, Lock, User, ArrowRight, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState("login") // "login" or "otp"
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  })
  const [otp, setOtp] = useState("")
  const [error, setError] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Simulate API call
    setTimeout(() => {
      if (credentials.username === "admin" && credentials.password === "password") {
        setStep("otp")
        setIsLoading(false)
      } else {
        setError("Invalid credentials. Access denied.")
        setIsLoading(false)
      }
    }, 1500)
  }

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Simulate OTP verification
    setTimeout(() => {
      if (otp === "123456") {
        // Store auth token and redirect to dashboard
        localStorage.setItem("sky_pay_auth_token", "authenticated")
        window.location.href = "/dashboard"
      } else {
        setError("Invalid OTP code. Access denied.")
        setIsLoading(false)
      }
    }, 1000)
  }

  const resendOtp = () => {
    setError("")
    // Simulate resend
    setTimeout(() => {
      setError("New OTP code sent to your secure device.")
    }, 500)
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, #3b82f6 1px, transparent 1px),
                           radial-gradient(circle at 75% 75%, #3b82f6 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <h1 className="text-2xl font-bold text-white tracking-wider">SKY PAY</h1>
              <p className="text-xs text-neutral-400 font-mono">v2.1.7 CLASSIFIED</p>
            </div>
          </div>
          <p className="text-sm text-neutral-400">Tactical Operations Dashboard</p>
        </div>

        {/* Login Form */}
        {step === "login" && (
          <Card className="bg-neutral-900 border-neutral-700">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-lg font-bold text-white tracking-wider">SECURE ACCESS</CardTitle>
              <p className="text-xs text-neutral-400">Enter your credentials to access the system</p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs text-neutral-400 tracking-wider">AGENT ID</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <Input
                      type="text"
                      placeholder="Enter your agent ID"
                      value={credentials.username}
                      onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                      className="pl-10 bg-neutral-800 border-neutral-600 text-white placeholder-neutral-400 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs text-neutral-400 tracking-wider">ACCESS CODE</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your access code"
                      value={credentials.password}
                      onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                      className="pl-10 pr-10 bg-neutral-800 border-neutral-600 text-white placeholder-neutral-400 focus:border-blue-500"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1/2 transform -translate-y-1/2 w-8 h-8 text-neutral-400 hover:text-white"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>

                {error && (
                  <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded text-red-400 text-sm">
                    <AlertTriangle className="w-4 h-4" />
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      AUTHENTICATING...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      ACCESS SYSTEM
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* OTP Form */}
        {step === "otp" && (
          <Card className="bg-neutral-900 border-neutral-700">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-lg font-bold text-white tracking-wider">TWO-FACTOR AUTHENTICATION</CardTitle>
              <p className="text-xs text-neutral-400">Enter the 6-digit code from your secure device</p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleOtpSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs text-neutral-400 tracking-wider">OTP CODE</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <Input
                      type="text"
                      placeholder="000000"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      className="pl-10 bg-neutral-800 border-neutral-600 text-white placeholder-neutral-400 focus:border-blue-500 text-center text-lg font-mono tracking-widest"
                      maxLength={6}
                      required
                    />
                  </div>
                </div>

                {error && (
                  <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded text-red-400 text-sm">
                    <AlertTriangle className="w-4 h-4" />
                    {error}
                  </div>
                )}

                <div className="space-y-4">
                  <Button
                    type="submit"
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        VERIFYING...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        VERIFY ACCESS
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    )}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full border-neutral-700 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-300 bg-transparent"
                    onClick={resendOtp}
                  >
                    RESEND OTP CODE
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Footer */}
        <div className="text-center mt-8 space-y-2">
          <div className="flex items-center justify-center gap-2 text-xs text-neutral-500">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <span>SECURE CONNECTION ESTABLISHED</span>
          </div>
          <p className="text-xs text-neutral-600 font-mono">
            {new Date().toLocaleString('en-US', {
              timeZone: 'UTC',
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit'
            })} UTC
          </p>
        </div>

        {/* Security Badges */}
        <div className="flex justify-center gap-2 mt-6">
          <Badge className="bg-neutral-800 text-neutral-300 text-xs border-neutral-700">
            ENCRYPTED
          </Badge>
          <Badge className="bg-blue-500/20 text-blue-400 text-xs border-blue-500/30">
            SECURE
          </Badge>
          <Badge className="bg-neutral-800 text-neutral-300 text-xs border-neutral-700">
            CLASSIFIED
          </Badge>
        </div>
      </div>
    </div>
  )
} 