"use client"

import { useState } from "react"
import { ArrowRight, Shield, CreditCard, Users, TrendingUp, CheckCircle, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function LandingPage() {
  const [isLoading, setIsLoading] = useState(false)

  const handleGetStarted = () => {
    setIsLoading(true)
    // Simulate loading
    setTimeout(() => {
      window.location.href = "/login"
    }, 1000)
  }

  const features = [
    {
      icon: CreditCard,
      title: "Transfert Multi-Plateforme",
      description: "Envoyez de l'argent vers Kulu, Soutra Money et Orange Money en quelques clics"
    },
    {
      icon: Shield,
      title: "Sécurité Maximale",
      description: "Transactions chiffrées et authentification à deux facteurs pour votre sécurité"
    },
    {
      icon: Users,
      title: "Gestion des Membres",
      description: "Gérez facilement vos listes de bénéficiaires avec import/export Excel"
    },
    {
      icon: TrendingUp,
      title: "Suivi en Temps Réel",
      description: "Historique détaillé de tous vos paiements avec filtres avancés"
    }
  ]

  const providers = [
    { name: "Kulu", color: "bg-green-500" },
    { name: "Soutra Money", color: "bg-blue-500" },
    { name: "Orange Money", color: "bg-orange-500" }
  ]

  const stats = [
    { value: "50K+", label: "Transactions" },
    { value: "10K+", label: "Utilisateurs" },
    { value: "99.9%", label: "Disponibilité" },
    { value: "24/7", label: "Support" }
  ]

  return (
    <div className="min-h-screen bg-black">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, #3b82f6 1px, transparent 1px),
                           radial-gradient(circle at 75% 75%, #3b82f6 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-wider">SKY PAY</h1>
            <p className="text-xs text-neutral-400">Transfert d'argent sécurisé</p>
          </div>
        </div>
        <Button
          onClick={handleGetStarted}
          disabled={isLoading}
          className="bg-blue-500 hover:bg-blue-600 text-white"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              CONNEXION...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              ACCÉDER
              <ArrowRight className="w-4 h-4" />
            </div>
          )}
        </Button>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 text-center px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 tracking-tight">
            Transfert d'Argent
            <span className="text-blue-500 block">Simplifié</span>
          </h1>
          <p className="text-xl text-neutral-300 mb-8 max-w-2xl mx-auto">
            Envoyez de l'argent en toute sécurité vers les comptes Kulu, Soutra Money et Orange Money. 
            Gestion complète de vos bénéficiaires et suivi de vos transactions.
          </p>
          
          {/* Supported Providers */}
          <div className="flex justify-center gap-4 mb-8">
            {providers.map((provider) => (
              <div key={provider.name} className="flex items-center gap-2">
                <div className={`w-3 h-3 ${provider.color} rounded-full`}></div>
                <span className="text-neutral-300 text-sm">{provider.name}</span>
              </div>
            ))}
          </div>

          <Button
            size="lg"
            onClick={handleGetStarted}
            disabled={isLoading}
            className="bg-blue-500 hover:bg-blue-600 text-white text-lg px-8 py-6 h-auto"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                CONNEXION EN COURS...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                COMMENCER MAINTENANT
                <ArrowRight className="w-5 h-5" />
              </div>
            )}
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Fonctionnalités Principales</h2>
            <p className="text-neutral-400">Tout ce dont vous avez besoin pour gérer vos transferts d'argent</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="bg-neutral-900 border-neutral-700 hover:border-blue-500/50 transition-colors">
                <CardHeader className="text-center pb-4">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="w-6 h-6 text-blue-500" />
                  </div>
                  <CardTitle className="text-lg font-bold text-white">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-neutral-400 text-sm text-center">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 px-6 py-20 bg-neutral-900/50">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-blue-500 mb-2">{stat.value}</div>
                <div className="text-neutral-400 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Prêt à Commencer ?</h2>
          <p className="text-neutral-400 mb-8">
            Rejoignez des milliers d'utilisateurs qui font confiance à Sky Pay pour leurs transferts d'argent
          </p>
          <Button
            size="lg"
            onClick={handleGetStarted}
            disabled={isLoading}
            className="bg-blue-500 hover:bg-blue-600 text-white text-lg px-8 py-6 h-auto"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                CONNEXION...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                ACCÉDER AU DASHBOARD
                <ArrowRight className="w-5 h-5" />
              </div>
            )}
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-neutral-800 px-6 py-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <span className="text-white font-bold">SKY PAY</span>
          </div>
          <p className="text-neutral-400 text-sm">
            © 2025 Sky Pay. Tous droits réservés. Transfert d'argent sécurisé.
          </p>
        </div>
      </footer>
    </div>
  )
}
