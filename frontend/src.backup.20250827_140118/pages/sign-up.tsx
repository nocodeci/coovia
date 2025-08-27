"use client"

import React from 'react'
import { useSanctumAuth } from '@/hooks/useSanctumAuth'
import { useNavigate } from '@tanstack/react-router'
import { SanctumRegisterForm } from '@/components/auth/SanctumRegisterForm'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowLeft, Shield, Sparkles, Users } from 'lucide-react'

export default function SignUpPage() {
  const { isAuthenticated } = useSanctumAuth()
  const navigate = useNavigate()

  // Rediriger si déjà connecté
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate({ to: '/dashboard' })
    }
  }, [isAuthenticated, navigate])

  const handleGoHome = () => {
    navigate({ to: '/' })
  }

  const handleGoToSignIn = () => {
    navigate({ to: '/sign-in' })
  }

  const handleSuccess = () => {
    // Rediriger vers le tableau de bord après inscription réussie
    navigate({ to: '/dashboard' })
  }

  if (isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex flex-col">
      {/* Header */}
      <header className="p-6">
        <Button 
          variant="ghost" 
          onClick={handleGoHome}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour à l'accueil
        </Button>
      </header>

      {/* Contenu principal */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Section gauche - Informations */}
          <div className="hidden lg:block space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Coovia</h2>
                  <p className="text-gray-600">Rejoignez notre communauté</p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h1 className="text-4xl font-bold text-gray-900 leading-tight">
                Créez votre compte
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Rejoignez Coovia et commencez à gérer vos boutiques en ligne avec notre plateforme sécurisée et intuitive.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-center gap-3 p-4 bg-white/50 rounded-lg border border-gray-200/50">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Shield className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Sécurité garantie</h3>
                  <p className="text-sm text-gray-600">Protection de vos données personnelles</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-white/50 rounded-lg border border-gray-200/50">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Interface moderne</h3>
                  <p className="text-sm text-gray-600">Design intuitif et responsive</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-white/50 rounded-lg border border-gray-200/50">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Users className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Support communautaire</h3>
                  <p className="text-sm text-gray-600">Assistance et ressources disponibles</p>
                </div>
              </div>
            </div>
          </div>

          {/* Section droite - Formulaire */}
          <div className="flex justify-center">
            <Card className="w-full max-w-md shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Créer un compte
                  </h2>
                  <p className="text-gray-600">
                    Rejoignez Coovia en quelques étapes simples
                  </p>
                </div>
                
                <SanctumRegisterForm 
                  onSuccess={handleSuccess}
                  onSwitchToLogin={handleGoToSignIn}
                />

                <div className="mt-6 text-center">
                  <Button
                    variant="link"
                    onClick={handleGoToSignIn}
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    Déjà un compte ? Se connecter
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-6 text-center text-sm text-gray-500">
        <p>&copy; 2024 Coovia. Tous droits réservés.</p>
      </footer>
    </div>
  )
}
