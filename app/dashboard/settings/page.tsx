"use client"

import { useState } from "react"
import { Settings, Save, ArrowLeft, Bell, Shield, Globe, Palette, Database, Key, User, Lock, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function SettingsPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // États des paramètres
  const [settings, setSettings] = useState({
    // Notifications
    emailNotifications: true,
    pushNotifications: false,
    smsNotifications: false,
    notificationFrequency: "immediate",
    
    // Sécurité
    twoFactorAuth: false,
    sessionTimeout: "30",
    passwordExpiry: "90",
    maxLoginAttempts: "5",
    
    // Interface
    language: "fr",
    timezone: "Europe/Paris",
    dateFormat: "DD/MM/YYYY",
    currency: "EUR",
    
    // Système
    autoBackup: true,
    backupFrequency: "daily",
    logRetention: "30",
    debugMode: false,
    
    // API
    apiRateLimit: "1000",
    apiTimeout: "30",
    enableApiLogs: true,
  })

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    
    try {
      // Simulation d'un appel API
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      console.log("Paramètres sauvegardés:", settings)
      alert("Paramètres sauvegardés avec succès !")
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error)
      alert("Erreur lors de la sauvegarde. Veuillez réessayer.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleBack = () => {
    window.history.back()
  }

  const handleReset = () => {
    if (confirm("Êtes-vous sûr de vouloir réinitialiser tous les paramètres ?")) {
      setSettings({
        emailNotifications: true,
        pushNotifications: false,
        smsNotifications: false,
        notificationFrequency: "immediate",
        twoFactorAuth: false,
        sessionTimeout: "30",
        passwordExpiry: "90",
        maxLoginAttempts: "5",
        language: "fr",
        timezone: "Europe/Paris",
        dateFormat: "DD/MM/YYYY",
        currency: "EUR",
        autoBackup: true,
        backupFrequency: "daily",
        logRetention: "30",
        debugMode: false,
        apiRateLimit: "1000",
        apiTimeout: "30",
        enableApiLogs: true,
      })
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={handleBack} className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Retour
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground tracking-wider">PARAMÈTRES GÉNÉRAUX</h1>
            <p className="text-sm text-muted-foreground">Configurer les paramètres de l'application</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleReset}>
            Réinitialiser
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                SAUVEGARDE...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Save className="w-4 h-4" />
                SAUVEGARDER
              </div>
            )}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="notifications" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="w-4 h-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Sécurité
          </TabsTrigger>
          <TabsTrigger value="interface" className="flex items-center gap-2">
            <Palette className="w-4 h-4" />
            Interface
          </TabsTrigger>
          <TabsTrigger value="system" className="flex items-center gap-2">
            <Database className="w-4 h-4" />
            Système
          </TabsTrigger>
          <TabsTrigger value="api" className="flex items-center gap-2">
            <Key className="w-4 h-4" />
            API
          </TabsTrigger>
        </TabsList>

        {/* Notifications */}
        <TabsContent value="notifications" className="space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-foreground tracking-wider flex items-center gap-2">
                <Bell className="w-4 h-4" />
                CONFIGURATION DES NOTIFICATIONS
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-sm font-medium">Notifications par email</Label>
                      <p className="text-xs text-muted-foreground">Recevoir les notifications par email</p>
                    </div>
                    <Switch
                      checked={settings.emailNotifications}
                      onCheckedChange={(checked) => handleSettingChange("emailNotifications", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-sm font-medium">Notifications push</Label>
                      <p className="text-xs text-muted-foreground">Recevoir les notifications push</p>
                    </div>
                    <Switch
                      checked={settings.pushNotifications}
                      onCheckedChange={(checked) => handleSettingChange("pushNotifications", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-sm font-medium">Notifications SMS</Label>
                      <p className="text-xs text-muted-foreground">Recevoir les notifications par SMS</p>
                    </div>
                    <Switch
                      checked={settings.smsNotifications}
                      onCheckedChange={(checked) => handleSettingChange("smsNotifications", checked)}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Fréquence des notifications</Label>
                    <Select value={settings.notificationFrequency} onValueChange={(value) => handleSettingChange("notificationFrequency", value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="immediate">Immédiate</SelectItem>
                        <SelectItem value="hourly">Toutes les heures</SelectItem>
                        <SelectItem value="daily">Quotidienne</SelectItem>
                        <SelectItem value="weekly">Hebdomadaire</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sécurité */}
        <TabsContent value="security" className="space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-foreground tracking-wider flex items-center gap-2">
                <Shield className="w-4 h-4" />
                PARAMÈTRES DE SÉCURITÉ
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-sm font-medium">Authentification à deux facteurs</Label>
                      <p className="text-xs text-muted-foreground">Activer la 2FA pour plus de sécurité</p>
                    </div>
                    <Switch
                      checked={settings.twoFactorAuth}
                      onCheckedChange={(checked) => handleSettingChange("twoFactorAuth", checked)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Timeout de session (minutes)</Label>
                    <Select value={settings.sessionTimeout} onValueChange={(value) => handleSettingChange("sessionTimeout", value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 minutes</SelectItem>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="60">1 heure</SelectItem>
                        <SelectItem value="120">2 heures</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Expiration du mot de passe (jours)</Label>
                    <Select value={settings.passwordExpiry} onValueChange={(value) => handleSettingChange("passwordExpiry", value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30">30 jours</SelectItem>
                        <SelectItem value="60">60 jours</SelectItem>
                        <SelectItem value="90">90 jours</SelectItem>
                        <SelectItem value="180">180 jours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Tentatives de connexion max</Label>
                    <Select value={settings.maxLoginAttempts} onValueChange={(value) => handleSettingChange("maxLoginAttempts", value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3">3 tentatives</SelectItem>
                        <SelectItem value="5">5 tentatives</SelectItem>
                        <SelectItem value="10">10 tentatives</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Interface */}
        <TabsContent value="interface" className="space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-foreground tracking-wider flex items-center gap-2">
                <Palette className="w-4 h-4" />
                PRÉFÉRENCES D'INTERFACE
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Langue</Label>
                    <Select value={settings.language} onValueChange={(value) => handleSettingChange("language", value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fr">Français</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Español</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Fuseau horaire</Label>
                    <Select value={settings.timezone} onValueChange={(value) => handleSettingChange("timezone", value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Europe/Paris">Europe/Paris</SelectItem>
                        <SelectItem value="UTC">UTC</SelectItem>
                        <SelectItem value="America/New_York">America/New_York</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Format de date</Label>
                    <Select value={settings.dateFormat} onValueChange={(value) => handleSettingChange("dateFormat", value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                        <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                        <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Devise</Label>
                    <Select value={settings.currency} onValueChange={(value) => handleSettingChange("currency", value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="EUR">EUR (€)</SelectItem>
                        <SelectItem value="USD">USD ($)</SelectItem>
                        <SelectItem value="GBP">GBP (£)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Système */}
        <TabsContent value="system" className="space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-foreground tracking-wider flex items-center gap-2">
                <Database className="w-4 h-4" />
                PARAMÈTRES SYSTÈME
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-sm font-medium">Sauvegarde automatique</Label>
                      <p className="text-xs text-muted-foreground">Activer les sauvegardes automatiques</p>
                    </div>
                    <Switch
                      checked={settings.autoBackup}
                      onCheckedChange={(checked) => handleSettingChange("autoBackup", checked)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Fréquence de sauvegarde</Label>
                    <Select value={settings.backupFrequency} onValueChange={(value) => handleSettingChange("backupFrequency", value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hourly">Toutes les heures</SelectItem>
                        <SelectItem value="daily">Quotidienne</SelectItem>
                        <SelectItem value="weekly">Hebdomadaire</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Rétention des logs (jours)</Label>
                    <Select value={settings.logRetention} onValueChange={(value) => handleSettingChange("logRetention", value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="7">7 jours</SelectItem>
                        <SelectItem value="30">30 jours</SelectItem>
                        <SelectItem value="90">90 jours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-sm font-medium">Mode debug</Label>
                      <p className="text-xs text-muted-foreground">Activer le mode debug</p>
                    </div>
                    <Switch
                      checked={settings.debugMode}
                      onCheckedChange={(checked) => handleSettingChange("debugMode", checked)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* API */}
        <TabsContent value="api" className="space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-foreground tracking-wider flex items-center gap-2">
                <Key className="w-4 h-4" />
                CONFIGURATION API
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Limite de taux API (requêtes/heure)</Label>
                    <Select value={settings.apiRateLimit} onValueChange={(value) => handleSettingChange("apiRateLimit", value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="100">100</SelectItem>
                        <SelectItem value="500">500</SelectItem>
                        <SelectItem value="1000">1000</SelectItem>
                        <SelectItem value="5000">5000</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Timeout API (secondes)</Label>
                    <Select value={settings.apiTimeout} onValueChange={(value) => handleSettingChange("apiTimeout", value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 secondes</SelectItem>
                        <SelectItem value="30">30 secondes</SelectItem>
                        <SelectItem value="60">60 secondes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-sm font-medium">Logs API</Label>
                      <p className="text-xs text-muted-foreground">Activer les logs des appels API</p>
                    </div>
                    <Switch
                      checked={settings.enableApiLogs}
                      onCheckedChange={(checked) => handleSettingChange("enableApiLogs", checked)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 