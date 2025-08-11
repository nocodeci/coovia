"use client"

import React from 'react'
import { useNavigate } from '@tanstack/react-router'
import { AuthSelector } from '@/components/auth/AuthSelector'
import { SanctumUserProfile } from '@/components/auth/SanctumUserProfile'
import { useSanctumAuth } from '@/hooks/useSanctumAuth'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Home } from 'lucide-react'

export function SanctumLoginPage() {
  const navigate = useNavigate()
  const { isAuthenticated, user } = useSanctumAuth()

  const handleAuth0Select = () => {
    // Rediriger vers la page de connexion Auth0 existante
    navigate({ to: '/sign-in' })
  }

  const handleSuccess = () => {
    // Rediriger vers le tableau de bord après connexion réussie
    navigate({ to: '/' })
  }

  const handleGoHome = () => {
    navigate({ to: '/' })
  }

  const handleGoBack = () => {
    navigate({ to: -1 })
  }

  // Si l'utilisateur est déjà connecté, afficher son profil
  if (isAuthenticated && user) {
    return (
      <main className="bg-white h-screen w-full flex flex-row">
        {/* Section gauche avec image de fond */}
        <div 
          className="w-2/5 bg-primary md:flex hidden flex-col items-center justify-center px-10 bg-no-repeat bg-bottom bg-contain"
          style={{ 
            backgroundImage: "url('/assets/images/3d-logo.svg')",
            backgroundSize: 'contain',
            backgroundPosition: 'bottom'
          }}
        >
          <div className="bg-white rounded-[12px] p-6 max-w-sm mx-auto shadow-xl">
            <div className="text-neutral-900 text-2xl font-semibold mb-8">
              Bienvenue dans votre espace personnel Sanctum. Gérez votre profil et vos paramètres en toute sécurité.
            </div>
            <div className="flex flex-row items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">SK</span>
              </div>
              <div>
                <div className="text-neutral-900 text-lg font-bold">Sanctum Key</div>
                <div className="text-neutral-500 text-sm">Authentification sécurisée</div>
              </div>
            </div>
          </div>
        </div>

        {/* Section droite avec profil */}
        <div className="flex flex-col items-center justify-center w-full flex-1 md:p-0 p-4 relative overflow-y-auto h-screen">
          <div className="flex flex-col items-start justify-start w-full mb-6 max-w-xs">
            <img 
              src="/assets/images/logo.svg" 
              alt="coovia" 
              width="100" 
              height="16"
              className="h-8 w-auto"
            />
          </div>
          
          <div className="w-full max-w-2xl">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-neutral-900 mb-2">
                Bienvenue, {user.name} !
              </h1>
              <p className="text-neutral-600">
                Vous êtes connecté via Sanctum. Voici votre profil utilisateur.
              </p>
            </div>

            <SanctumUserProfile />

            {/* Actions rapides */}
            <div className="mt-8 text-center space-x-4">
              <Button onClick={() => navigate({ to: '/' })} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                Aller au tableau de bord
              </Button>
              <Button variant="outline" onClick={() => navigate({ to: '/profile' })} className="border-neutral-300">
                Modifier le profil
              </Button>
            </div>
          </div>
        </div>
      </main>
    )
  }

  // Page de connexion
  return (
    <main className="bg-white h-screen w-full flex flex-row">
      {/* Section gauche avec image de fond */}
      <div 
        className="w-2/5 bg-primary md:flex hidden flex-col items-center justify-center px-10 bg-no-repeat bg-bottom bg-contain"
        style={{ 
          backgroundImage: "url('/assets/images/3d-logo.svg')",
          backgroundSize: 'contain',
          backgroundPosition: 'bottom'
        }}
      >
        <div className="bg-white rounded-[12px] p-6 max-w-sm mx-auto shadow-xl">
          <div className="text-neutral-900 text-2xl font-semibold mb-8">
            Choisissez votre méthode d'authentification préférée. Sanctum pour une connexion classique ou Auth0 pour une authentification avancée.
          </div>
          <div className="flex flex-row items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">SK</span>
            </div>
            <div>
              <div className="text-neutral-900 text-lg font-bold">Sanctum Key</div>
              <div className="text-neutral-500 text-sm">Authentification flexible</div>
            </div>
          </div>
        </div>
      </div>

      {/* Section droite avec formulaire */}
      <div className="flex flex-col items-center justify-center w-full flex-1 md:p-0 p-4 relative overflow-y-auto h-screen">
        <div className="flex flex-col items-start justify-start w-full mb-6 max-w-xs">
          <img 
            src="/assets/images/logo.svg" 
            alt="coovia" 
            width="100" 
            height="16"
            className="h-8 w-auto"
          />
        </div>
        
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-neutral-900 mb-4">
              Authentification Coovia
            </h1>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              Choisissez votre méthode de connexion préférée. 
              Sanctum pour une connexion classique ou Auth0 pour une authentification avancée.
            </p>
          </div>

          {/* Sélecteur d'authentification */}
          <AuthSelector 
            onAuth0Select={handleAuth0Select}
            onSuccess={handleSuccess}
          />

          {/* Informations supplémentaires */}
          <div className="mt-12 text-center text-neutral-600">
            <div className="max-w-2xl mx-auto space-y-4">
              <h3 className="text-lg font-semibold text-neutral-800">
                À propos de nos méthodes d'authentification
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                <div className="text-left">
                  <h4 className="font-medium text-neutral-800 mb-2">🔐 Sanctum (Laravel)</h4>
                  <ul className="space-y-1 text-neutral-600">
                    <li>• Connexion classique email/mot de passe</li>
                    <li>• Tokens d'API sécurisés</li>
                    <li>• Gestion des sessions</li>
                    <li>• Idéal pour les applications internes</li>
                  </ul>
                </div>
                
                <div className="text-left">
                  <h4 className="font-medium text-neutral-800 mb-2">🛡️ Auth0</h4>
                  <ul className="space-y-1 text-neutral-600">
                    <li>• Authentification sociale (Google, Facebook)</li>
                    <li>• Single Sign-On (SSO)</li>
                    <li>• Gestion avancée des identités</li>
                    <li>• Idéal pour les applications grand public</li>
                  </ul>
                </div>
              </div>
              
              <p className="text-sm text-neutral-500 pt-4">
                Les deux méthodes sont sécurisées et vous pouvez utiliser celle qui vous convient le mieux.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
} 