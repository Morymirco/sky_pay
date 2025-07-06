"use client"

import { useState } from "react"
import { 
  Building, 
  Key, 
  Lock, 
  Globe, 
  Save, 
  Eye, 
  EyeOff,
  Upload,
  CheckCircle,
  AlertTriangle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("company")
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [showPin, setShowPin] = useState(false)

  // Company Profile State
  const [companyProfile, setCompanyProfile] = useState({
    name: "Sky Pay Enterprise",
    email: "contact@skypay.com",
    phone: "+33 1 23 45 67 89",
    address: "123 Rue de la Paix, 75001 Paris, France",
    website: "https://www.skypay.com",
    description: "Entreprise spécialisée dans les solutions de paiement innovantes",
    logo: null as File | null
  })

  // PIN State
  const [pinData, setPinData] = useState({
    currentPin: "",
    newPin: "",
    confirmPin: ""
  })

  // Password State
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  })

  // Language State
  const [language, setLanguage] = useState("fr")

  const handleCompanyProfileSave = () => {
    // Simuler la sauvegarde
    alert("Profil de l'entreprise mis à jour avec succès!")
  }

  const handlePinChange = () => {
    if (pinData.newPin !== pinData.confirmPin) {
      alert("Les codes PIN ne correspondent pas!")
      return
    }
    if (pinData.newPin.length !== 4) {
      alert("Le code PIN doit contenir 4 chiffres!")
      return
    }
    // Simuler la sauvegarde
    alert("Code PIN mis à jour avec succès!")
    setPinData({ currentPin: "", newPin: "", confirmPin: "" })
  }

  const handlePasswordChange = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("Les mots de passe ne correspondent pas!")
      return
    }
    if (passwordData.newPassword.length < 8) {
      alert("Le mot de passe doit contenir au moins 8 caractères!")
      return
    }
    // Simuler la sauvegarde
    alert("Mot de passe mis à jour avec succès!")
    setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" })
  }

  const handleLanguageChange = (value: string) => {
    setLanguage(value)
    // Simuler la sauvegarde
    alert(`Langue changée vers ${value === "fr" ? "Français" : "English"}`)
  }

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setCompanyProfile({ ...companyProfile, logo: file })
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-wider">PARAMÈTRES</h1>
          <p className="text-sm text-muted-foreground">Gérer les paramètres de l'application</p>
        </div>
      </div>

      {/* Cards Navigation */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card 
          className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
            activeTab === "company" 
              ? "ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-950/20" 
              : "hover:bg-muted/50"
          }`}
          onClick={() => setActiveTab("company")}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                activeTab === "company" 
                  ? "bg-blue-100 dark:bg-blue-900/30" 
                  : "bg-muted"
              }`}>
                <Building className={`w-5 h-5 ${
                  activeTab === "company" 
                    ? "text-blue-600 dark:text-blue-400" 
                    : "text-muted-foreground"
                }`} />
              </div>
              <div>
                <h3 className={`font-semibold text-sm ${
                  activeTab === "company" 
                    ? "text-blue-600 dark:text-blue-400" 
                    : "text-foreground"
                }`}>
                  Profil Entreprise
                </h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card 
          className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
            activeTab === "pin" 
              ? "ring-2 ring-green-500 bg-green-50 dark:bg-green-950/20" 
              : "hover:bg-muted/50"
          }`}
          onClick={() => setActiveTab("pin")}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                activeTab === "pin" 
                  ? "bg-green-100 dark:bg-green-900/30" 
                  : "bg-muted"
              }`}>
                <Key className={`w-5 h-5 ${
                  activeTab === "pin" 
                    ? "text-green-600 dark:text-green-400" 
                    : "text-muted-foreground"
                }`} />
              </div>
              <div>
                <h3 className={`font-semibold text-sm ${
                  activeTab === "pin" 
                    ? "text-green-600 dark:text-green-400" 
                    : "text-foreground"
                }`}>
                  Code PIN
                </h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card 
          className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
            activeTab === "password" 
              ? "ring-2 ring-orange-500 bg-orange-50 dark:bg-orange-950/20" 
              : "hover:bg-muted/50"
          }`}
          onClick={() => setActiveTab("password")}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                activeTab === "password" 
                  ? "bg-orange-100 dark:bg-orange-900/30" 
                  : "bg-muted"
              }`}>
                <Lock className={`w-5 h-5 ${
                  activeTab === "password" 
                    ? "text-orange-600 dark:text-orange-400" 
                    : "text-muted-foreground"
                }`} />
              </div>
              <div>
                <h3 className={`font-semibold text-sm ${
                  activeTab === "password" 
                    ? "text-orange-600 dark:text-orange-400" 
                    : "text-foreground"
                }`}>
                  Mot de Passe
                </h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card 
          className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
            activeTab === "language" 
              ? "ring-2 ring-purple-500 bg-purple-50 dark:bg-purple-950/20" 
              : "hover:bg-muted/50"
          }`}
          onClick={() => setActiveTab("language")}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                activeTab === "language" 
                  ? "bg-purple-100 dark:bg-purple-900/30" 
                  : "bg-muted"
              }`}>
                <Globe className={`w-5 h-5 ${
                  activeTab === "language" 
                    ? "text-purple-600 dark:text-purple-400" 
                    : "text-muted-foreground"
                }`} />
              </div>
              <div>
                <h3 className={`font-semibold text-sm ${
                  activeTab === "language" 
                    ? "text-purple-600 dark:text-purple-400" 
                    : "text-foreground"
                }`}>
                  Langue
                </h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content based on active tab */}
      {activeTab === "company" && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <Building className="w-5 h-5 text-blue-500" />
              <h3 className="text-lg font-semibold">Profil de l'Entreprise</h3>
            </div>
            
            <div className="space-y-6">
              {/* Logo Upload */}
              <div>
                <Label className="text-sm font-medium">Logo de l'entreprise</Label>
                <div className="mt-2 flex items-center gap-4">
                  <div className="w-20 h-20 bg-muted rounded-lg flex items-center justify-center">
                    {companyProfile.logo ? (
                      <img 
                        src={URL.createObjectURL(companyProfile.logo)} 
                        alt="Logo" 
                        className="w-16 h-16 object-contain"
                      />
                    ) : (
                      <Building className="w-8 h-8 text-muted-foreground" />
                    )}
                  </div>
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                      id="logo-upload"
                    />
                    <Label htmlFor="logo-upload" className="cursor-pointer">
                      <Button variant="outline" size="sm">
                        <Upload className="w-4 h-4 mr-2" />
                        Choisir un logo
                      </Button>
                    </Label>
                    <p className="text-xs text-muted-foreground mt-1">
                      PNG, JPG jusqu'à 2MB
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="company-name" className="text-sm font-medium">Nom de l'entreprise *</Label>
                  <Input
                    id="company-name"
                    value={companyProfile.name}
                    onChange={(e) => setCompanyProfile({...companyProfile, name: e.target.value})}
                    className="mt-2"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="company-email" className="text-sm font-medium">Email *</Label>
                  <Input
                    id="company-email"
                    type="email"
                    value={companyProfile.email}
                    onChange={(e) => setCompanyProfile({...companyProfile, email: e.target.value})}
                    className="mt-2"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="company-phone" className="text-sm font-medium">Téléphone</Label>
                  <Input
                    id="company-phone"
                    value={companyProfile.phone}
                    onChange={(e) => setCompanyProfile({...companyProfile, phone: e.target.value})}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="company-website" className="text-sm font-medium">Site web</Label>
                  <Input
                    id="company-website"
                    value={companyProfile.website}
                    onChange={(e) => setCompanyProfile({...companyProfile, website: e.target.value})}
                    className="mt-2"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="company-address" className="text-sm font-medium">Adresse</Label>
                <Textarea
                  id="company-address"
                  value={companyProfile.address}
                  onChange={(e) => setCompanyProfile({...companyProfile, address: e.target.value})}
                  rows={3}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="company-description" className="text-sm font-medium">Description</Label>
                <Textarea
                  id="company-description"
                  value={companyProfile.description}
                  onChange={(e) => setCompanyProfile({...companyProfile, description: e.target.value})}
                  rows={4}
                  className="mt-2"
                />
              </div>

              <div className="flex gap-4 pt-4 border-t border-border">
                <Button 
                  variant="outline"
                  onClick={() => setCompanyProfile({
                    name: "Sky Pay Enterprise",
                    email: "contact@skypay.com",
                    phone: "+33 1 23 45 67 89",
                    address: "123 Rue de la Paix, 75001 Paris, France",
                    website: "https://www.skypay.com",
                    description: "Entreprise spécialisée dans les solutions de paiement innovantes",
                    logo: null
                  })}
                  className="flex-1"
                >
                  Réinitialiser
                </Button>
                <Button 
                  onClick={handleCompanyProfileSave}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Sauvegarder
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === "pin" && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <Key className="w-5 h-5 text-green-500" />
              <h3 className="text-lg font-semibold">Code PIN de Transaction</h3>
            </div>
            
            <div className="space-y-6 max-w-md">
              <div className="bg-muted/30 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-4 h-4 text-orange-500" />
                  <span className="text-sm font-medium">Sécurité</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Le code PIN est utilisé pour valider les transactions importantes. 
                  Assurez-vous de le garder secret et de ne pas le partager.
                </p>
              </div>

              <div>
                <Label htmlFor="current-pin" className="text-sm font-medium">Code PIN actuel</Label>
                <div className="mt-2 relative">
                  <Input
                    id="current-pin"
                    type={showPin ? "text" : "password"}
                    value={pinData.currentPin}
                    onChange={(e) => setPinData({...pinData, currentPin: e.target.value})}
                    maxLength={4}
                    placeholder="••••"
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowPin(!showPin)}
                  >
                    {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              <div>
                <Label htmlFor="new-pin" className="text-sm font-medium">Nouveau code PIN</Label>
                <div className="mt-2 relative">
                  <Input
                    id="new-pin"
                    type={showPin ? "text" : "password"}
                    value={pinData.newPin}
                    onChange={(e) => setPinData({...pinData, newPin: e.target.value})}
                    maxLength={4}
                    placeholder="••••"
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowPin(!showPin)}
                  >
                    {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">4 chiffres requis</p>
              </div>

              <div>
                <Label htmlFor="confirm-pin" className="text-sm font-medium">Confirmer le nouveau code PIN</Label>
                <div className="mt-2 relative">
                  <Input
                    id="confirm-pin"
                    type={showPin ? "text" : "password"}
                    value={pinData.confirmPin}
                    onChange={(e) => setPinData({...pinData, confirmPin: e.target.value})}
                    maxLength={4}
                    placeholder="••••"
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowPin(!showPin)}
                  >
                    {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              <div className="flex gap-4 pt-4 border-t border-border">
                <Button 
                  variant="outline"
                  onClick={() => setPinData({ currentPin: "", newPin: "", confirmPin: "" })}
                  className="flex-1"
                >
                  Réinitialiser
                </Button>
                <Button 
                  onClick={handlePinChange}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  disabled={!pinData.currentPin || !pinData.newPin || !pinData.confirmPin}
                >
                  <Key className="w-4 h-4 mr-2" />
                  Changer le PIN
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === "password" && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <Lock className="w-5 h-5 text-orange-500" />
              <h3 className="text-lg font-semibold">Changer le Mot de Passe</h3>
            </div>
            
            <div className="space-y-6 max-w-md">
              <div className="bg-muted/30 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-medium">Recommandations</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Utilisez un mot de passe fort avec au moins 8 caractères, 
                  incluant des lettres, chiffres et symboles.
                </p>
              </div>

              <div>
                <Label htmlFor="current-password" className="text-sm font-medium">Mot de passe actuel</Label>
                <div className="mt-2 relative">
                  <Input
                    id="current-password"
                    type={showCurrentPassword ? "text" : "password"}
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  >
                    {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              <div>
                <Label htmlFor="new-password" className="text-sm font-medium">Nouveau mot de passe</Label>
                <div className="mt-2 relative">
                  <Input
                    id="new-password"
                    type={showNewPassword ? "text" : "password"}
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Minimum 8 caractères</p>
              </div>

              <div>
                <Label htmlFor="confirm-password" className="text-sm font-medium">Confirmer le nouveau mot de passe</Label>
                <div className="mt-2 relative">
                  <Input
                    id="confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              <div className="flex gap-4 pt-4 border-t border-border">
                <Button 
                  variant="outline"
                  onClick={() => setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" })}
                  className="flex-1"
                >
                  Réinitialiser
                </Button>
                <Button 
                  onClick={handlePasswordChange}
                  className="flex-1 bg-orange-600 hover:bg-orange-700"
                  disabled={!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
                >
                  <Lock className="w-4 h-4 mr-2" />
                  Changer le mot de passe
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === "language" && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <Globe className="w-5 h-5 text-purple-500" />
              <h3 className="text-lg font-semibold">Langue</h3>
            </div>
            
            <div className="space-y-6 max-w-md">
              <div className="bg-muted/30 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Globe className="w-4 h-4 text-purple-500" />
                  <span className="text-sm font-medium">Langue de l'interface</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Choisissez la langue d'affichage de l'interface utilisateur.
                </p>
              </div>

              <div>
                <Label htmlFor="language-select" className="text-sm font-medium">Sélectionner la langue</Label>
                <Select value={language} onValueChange={handleLanguageChange}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Choisir une langue" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fr">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">🇫🇷</span>
                        <span>Français</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="en">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">🇬🇧</span>
                        <span>English</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="es">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">🇪🇸</span>
                        <span>Español</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="de">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">🇩🇪</span>
                        <span>Deutsch</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-medium text-green-700 dark:text-green-300">
                    Langue actuelle : {language === "fr" ? "Français" : language === "en" ? "English" : language === "es" ? "Español" : "Deutsch"}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 