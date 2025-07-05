"use client"

import { useState, useRef } from "react"
import { Upload, Download, FileSpreadsheet, Users, CheckCircle, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog"

interface ImportedMember {
  name: string
  email: string
  phone: string
  provider: "Kulu" | "Soutra Money" | "Orange Money"
  accountNumber: string
  status: "active" | "inactive"
}

export default function ImportMembersPage() {
  const [isProcessing, setIsProcessing] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [importedData, setImportedData] = useState<ImportedMember[]>([])
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [importStatus, setImportStatus] = useState<{
    success: number
    errors: number
    total: number
  }>({ success: 0, errors: 0, total: 0 })

  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const itemsPerPage = 10
  const totalPages = Math.ceil(importedData.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentData = importedData.slice(startIndex, endIndex)

  const downloadTemplate = () => {
    // Créer un fichier Excel avec des données d'exemple
    const workbook = {
      SheetNames: ['Bénéficiaires'],
      Sheets: {
        'Bénéficiaires': {
          'A1': { v: 'Nom', t: 's' },
          'B1': { v: 'Email', t: 's' },
          'C1': { v: 'Téléphone', t: 's' },
          'D1': { v: 'Fournisseur', t: 's' },
          'E1': { v: 'Numéro de compte', t: 's' },
          'F1': { v: 'Statut', t: 's' },
          'A2': { v: 'Jean Dupont', t: 's' },
          'B2': { v: 'jean.dupont@email.com', t: 's' },
          'C2': { v: '+33 6 12 34 56 78', t: 's' },
          'D2': { v: 'Orange Money', t: 's' },
          'E2': { v: 'OM123456789', t: 's' },
          'F2': { v: 'active', t: 's' },
          'A3': { v: 'Marie Martin', t: 's' },
          'B3': { v: 'marie.martin@email.com', t: 's' },
          'C3': { v: '+33 6 98 76 54 32', t: 's' },
          'D3': { v: 'Kulu', t: 's' },
          'E3': { v: 'KL987654321', t: 's' },
          'F3': { v: 'active', t: 's' },
          'A4': { v: 'Pierre Durand', t: 's' },
          'B4': { v: 'pierre.durand@email.com', t: 's' },
          'C4': { v: '+33 6 55 44 33 22', t: 's' },
          'D4': { v: 'Soutra Money', t: 's' },
          'E4': { v: 'SM456789123', t: 's' },
          'F4': { v: 'inactive', t: 's' }
        }
      }
    }

    // Pour l'instant, on utilise un CSV mais on change l'extension en .xlsx
    // En production, il faudrait utiliser une librairie comme xlsx pour créer un vrai fichier Excel
    const csvContent = "data:text/csv;charset=utf-8," +
      "Nom,Email,Téléphone,Fournisseur,Numéro de compte,Statut\n" +
      "Jean Dupont,jean.dupont@email.com,+33 6 12 34 56 78,Orange Money,OM123456789,active\n" +
      "Marie Martin,marie.martin@email.com,+33 6 98 76 54 32,Kulu,KL987654321,active\n" +
      "Pierre Durand,pierre.durand@email.com,+33 6 55 44 33 22,Soutra Money,SM456789123,inactive"
    
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", "modele_beneficiaires_sky_pay.xlsx")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const text = e.target?.result as string
          
          const lines = text.split('\n').filter(line => line.trim() !== '')
          if (lines.length < 2) {
            alert("Le fichier semble vide ou ne contient pas de données valides.")
            return
          }
          
          const headers = lines[0].split(',').map(h => h.trim())
          
          const data = lines.slice(1).map((line, index) => {
            const values = line.split(',').map(v => v.trim())
            return {
              name: values[0] || '',
              email: values[1] || '',
              phone: values[2] || '',
              provider: values[3] as "Kulu" | "Soutra Money" | "Orange Money",
              accountNumber: values[4] || '',
              status: values[5] as "active" | "inactive"
            }
          }).filter(item => item.name && item.email && item.phone && item.accountNumber)
          
          setImportedData(data)
          setShowPreview(true)
        } catch (error) {
          alert("Erreur lors de la lecture du fichier. Vérifiez le format.")
        }
      }
      
      reader.onerror = () => {
        alert("Erreur lors de la lecture du fichier.")
      }
      
      reader.readAsText(file)
    }
  }

  const confirmImport = () => {
    setIsProcessing(true)
    // Simulate import processing
    setTimeout(() => {
      const success = importedData.length
      const errors = 0
      setImportStatus({ success, errors, total: success + errors })
      setIsProcessing(false)
      setShowPreview(false)
      setShowSuccess(true)
      setImportedData([])
      setSelectedFile(null)
      setCurrentPage(1)
    }, 2000)
  }

  const handleSuccessClose = () => {
    setShowSuccess(false)
    // Rediriger vers la liste des bénéficiaires
    window.location.href = '/dashboard/members'
  }

  const getProviderColor = (provider: string) => {
    switch (provider) {
      case "Kulu": return "bg-green-500/20 text-green-400"
      case "Soutra Money": return "bg-blue-500/20 text-blue-400"
      case "Orange Money": return "bg-orange-500/20 text-orange-400"
      default: return "bg-muted text-muted-foreground"
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-wider">IMPORTER DES BÉNÉFICIAIRES</h1>
          <p className="text-sm text-muted-foreground">Importez vos listes de bénéficiaires depuis un fichier Excel</p>
        </div>
      </div>

      {/* Template Download Section */}
      <Card className="border-blue-500/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-blue-500" />
            Modèle de Format Excel
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Téléchargez le modèle Excel (.xlsx) pour vous assurer que votre fichier respecte le bon format.
            </p>
            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-medium mb-2">Format requis :</h4>
              <div className="text-xs space-y-1 text-muted-foreground">
                <div>• <strong>Nom</strong> : Nom complet du bénéficiaire</div>
                <div>• <strong>Email</strong> : Adresse email valide</div>
                <div>• <strong>Téléphone</strong> : Numéro de téléphone avec indicatif</div>
                <div>• <strong>Fournisseur</strong> : Kulu, Soutra Money, ou Orange Money</div>
                <div>• <strong>Numéro de compte</strong> : Numéro de compte du fournisseur</div>
                <div>• <strong>Statut</strong> : active ou inactive</div>
              </div>
            </div>
            <Button onClick={downloadTemplate} className="bg-blue-500 hover:bg-blue-600">
              <Download className="w-4 h-4 mr-2" />
              Télécharger le Modèle
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Import Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5 text-green-500" />
            Importer le Fichier
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div 
              className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-green-500 transition-colors cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault()
                e.currentTarget.style.borderColor = '#10b981'
              }}
              onDragLeave={(e) => {
                e.preventDefault()
                e.currentTarget.style.borderColor = ''
              }}
              onDrop={(e) => {
                e.preventDefault()
                const files = e.dataTransfer.files
                if (files.length > 0) {
                  handleFileUpload({ target: { files } } as any)
                }
              }}
            >
              <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Glissez votre fichier Excel ici</h3>
              <p className="text-sm text-muted-foreground mb-4">
                ou cliquez sur le bouton ci-dessous pour sélectionner un fichier (.xlsx, .xls, .csv)
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileUpload}
                className="hidden"
              />
              <Button 
                onClick={() => {
                  fileInputRef.current?.click()
                }}
                className="bg-green-500 hover:bg-green-600"
              >
                <Upload className="w-4 h-4 mr-2" />
                {selectedFile ? `Fichier sélectionné: ${selectedFile.name}` : "Sélectionner un Fichier"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Import Status */}
      {importStatus.total > 0 && (
        <Card className="border-green-500/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              Import Terminé
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-500">{importStatus.success}</div>
                <div className="text-sm text-muted-foreground">Importés avec succès</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-500">{importStatus.errors}</div>
                <div className="text-sm text-muted-foreground">Erreurs</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-500">{importStatus.total}</div>
                <div className="text-sm text-muted-foreground">Total</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Prévisualisation de l'Import</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                {importedData.length} bénéficiaires trouvés
              </span>
              <Badge variant="secondary">
                {importedData.length} lignes
              </Badge>
            </div>
            
            <div className="max-h-96 overflow-y-auto">
              <table className="w-full">
                <thead className="sticky top-0 bg-background">
                  <tr className="border-b border-border">
                    <th className="text-left py-2 px-4 text-xs font-medium text-muted-foreground">Nom</th>
                    <th className="text-left py-2 px-4 text-xs font-medium text-muted-foreground">Email</th>
                    <th className="text-left py-2 px-4 text-xs font-medium text-muted-foreground">Téléphone</th>
                    <th className="text-left py-2 px-4 text-xs font-medium text-muted-foreground">Fournisseur</th>
                    <th className="text-left py-2 px-4 text-xs font-medium text-muted-foreground">Compte</th>
                    <th className="text-left py-2 px-4 text-xs font-medium text-muted-foreground">Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {currentData.map((member, index) => (
                    <tr key={startIndex + index} className="border-b border-border hover:bg-muted/50">
                      <td className="py-2 px-4 text-sm text-foreground">{member.name}</td>
                      <td className="py-2 px-4 text-sm text-foreground">{member.email}</td>
                      <td className="py-2 px-4 text-sm text-foreground">{member.phone}</td>
                      <td className="py-2 px-4">
                        <Badge className={getProviderColor(member.provider)}>
                          {member.provider}
                        </Badge>
                      </td>
                      <td className="py-2 px-4 text-sm text-foreground font-mono">{member.accountNumber}</td>
                      <td className="py-2 px-4">
                        <Badge variant={member.status === "active" ? "default" : "secondary"}>
                          {member.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-muted-foreground">
                  Page {currentPage} sur {totalPages} ({importedData.length} bénéficiaires)
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                  >
                    Précédent
                  </Button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const page = i + 1
                      return (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(page)}
                          className="w-8 h-8 p-0"
                        >
                          {page}
                        </Button>
                      )
                    })}
                    {totalPages > 5 && (
                      <>
                        <span className="text-muted-foreground">...</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(totalPages)}
                          className="w-8 h-8 p-0"
                        >
                          {totalPages}
                        </Button>
                      </>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Suivant
                  </Button>
                </div>
              </div>
            )}
            
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowPreview(false)}>
                Annuler
              </Button>
              <Button 
                onClick={confirmImport} 
                disabled={isProcessing}
                className="bg-green-500 hover:bg-green-600"
              >
                {isProcessing ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Import en cours...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Confirmer l'Import
                  </div>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de succès */}
      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Import réussi
            </DialogTitle>
            <DialogDescription>
              Les bénéficiaires ont été importés avec succès dans votre liste.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
                <CheckCircle className="h-4 w-4" />
                <span className="font-medium">Import terminé</span>
              </div>
              <div className="mt-2 text-sm text-green-600 dark:text-green-400">
                <p>• {importStatus.success} bénéficiaires importés avec succès</p>
                {importStatus.errors > 0 && (
                  <p>• {importStatus.errors} erreurs détectées</p>
                )}
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={handleSuccessClose}>
                Voir la liste
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
} 