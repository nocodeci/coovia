"use client"

import React from 'react'
import { useSanctumAuth } from '@/hooks/useSanctumAuth'
import { useNavigate } from '@tanstack/react-router'
import { SanctumLoginForm } from '@/components/auth/SanctumLoginForm'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { MainNav } from '@/components/layout/main-nav'
import {
  Shield,
  CheckCircle,
  Sparkles,
  Zap
} from 'lucide-react'

export default function LoginPage() {
  const { isAuthenticated } = useSanctumAuth()
  const navigate = useNavigate()

  // Rediriger si déjà connecté
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate({ to: '/dashboard' })
    }
  }, [isAuthenticated, navigate])

  const handleGoToSignUp = () => {
    navigate({ to: '/sign-up' })
  }

  const handleGoToSignIn = () => {
    navigate({ to: '/sign-in' })
  }

  const handleSuccess = () => {
    // Rediriger vers le tableau de bord après connexion réussie
    navigate({ to: '/dashboard' })
  }

  const handleGoHome = () => {
    navigate({ to: '/' })
  }

  if (isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <MainNav />
      
      <div className="flex min-h-screen">
        {/* Section de connexion */}
        <div className="flex-1 flex items-center justify-center p-8">
          <Card className="w-full max-w-md mx-auto">
            <CardHeader className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold">Connexion</CardTitle>
                <CardDescription>
                  Connectez-vous à votre compte Coovia pour continuer
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Connexion
                </h2>
                <p className="text-gray-600">
                  Connectez-vous à votre compte Coovia
                </p>
              </div>
              
              <SanctumLoginForm 
                onSuccess={handleSuccess}
                onSwitchToAuth0={handleGoToSignUp}
              />

              <div className="text-center">
                <Button
                  variant="ghost"
                  onClick={handleGoHome}
                  className="text-gray-600 hover:text-gray-800"
                >
                  ← Retour à l'accueil
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Section d'informations */}
        <div className="hidden lg:flex flex-1 bg-gradient-to-br from-blue-600 to-purple-700 text-white p-12">
          <div className="max-w-lg">
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-4">
                Bienvenue sur Coovia
              </h2>
              <p className="text-blue-100 text-lg">
                La plateforme e-commerce moderne pour gérer vos boutiques en ligne avec simplicité et efficacité.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Interface intuitive</h3>
                  <p className="text-blue-100">
                    Une expérience utilisateur moderne et responsive pour tous vos appareils.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Shield className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Sécurité maximale</h3>
                  <p className="text-blue-100">
                    Authentification sécurisée avec MFA et protection de vos données.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Zap className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Performance optimale</h3>
                  <p className="text-blue-100">
                    Architecture moderne pour des performances exceptionnelles.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-12 p-6 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="flex items-center space-x-3 mb-3">
                <CheckCircle className="w-5 h-5 text-green-300" />
                <span className="font-semibold">Connexion sécurisée</span>
              </div>
              <p className="text-blue-100 text-sm">
                Votre connexion est protégée par les meilleures pratiques de sécurité de l'industrie.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
