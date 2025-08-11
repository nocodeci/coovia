"use client"

import React, { useState } from 'react'
import { SanctumLoginForm } from './SanctumLoginForm'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Shield, Key, Users, ArrowLeft } from 'lucide-react'

type AuthMethod = 'select' | 'sanctum' | 'auth0'

interface AuthSelectorProps {
  onAuth0Select: () => void
  onSuccess?: () => void
}

export function AuthSelector({ onAuth0Select, onSuccess }: AuthSelectorProps) {
  const [selectedMethod, setSelectedMethod] = useState<AuthMethod>('select')

  const handleBackToSelect = () => {
    setSelectedMethod('select')
  }

  if (selectedMethod === 'sanctum') {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="mb-4">
          <Button
            variant="ghost"
            onClick={handleBackToSelect}
            className="mb-2 text-neutral-600 hover:text-neutral-900"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour au choix
          </Button>
        </div>
        <SanctumLoginForm 
          onSuccess={onSuccess}
          onSwitchToAuth0={() => setSelectedMethod('auth0')}
        />
      </div>
    )
  }

  if (selectedMethod === 'auth0') {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="mb-4">
          <Button
            variant="ghost"
            onClick={handleBackToSelect}
            className="mb-2 text-neutral-600 hover:text-neutral-900"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour au choix
          </Button>
        </div>
        <Card className="border-0 shadow-none">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full flex items-center justify-center">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-neutral-900">
              Connexion avec Auth0
            </CardTitle>
            <CardDescription className="text-neutral-600">
              Connectez-vous avec votre compte Auth0 existant
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={onAuth0Select}
              className="w-full h-11 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-medium"
              size="lg"
            >
              <Shield className="mr-2 h-5 w-5" />
              Se connecter avec Auth0
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <Card className="w-full max-w-md mx-auto border-0 shadow-none">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
          <Users className="h-10 w-10 text-white" />
        </div>
        <CardTitle className="text-2xl font-bold text-neutral-900">
          Choisissez votre méthode de connexion
        </CardTitle>
        <CardDescription className="text-neutral-600">
          Sélectionnez comment vous souhaitez vous authentifier
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <Button
          variant="outline"
          className="w-full h-16 text-left justify-start border-neutral-300 hover:bg-blue-50 hover:border-blue-300 transition-colors"
          onClick={() => setSelectedMethod('sanctum')}
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Key className="h-6 w-6 text-blue-600" />
            </div>
            <div className="text-left">
              <div className="font-semibold text-neutral-900">Connexion classique</div>
              <div className="text-sm text-neutral-500">
                Email et mot de passe
              </div>
            </div>
          </div>
        </Button>

        <Button
          variant="outline"
          className="w-full h-16 text-left justify-start border-neutral-300 hover:bg-green-50 hover:border-green-300 transition-colors"
          onClick={() => setSelectedMethod('auth0')}
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Shield className="h-6 w-6 text-green-600" />
            </div>
            <div className="text-left">
              <div className="font-semibold text-neutral-900">Connexion Auth0</div>
              <div className="text-sm text-neutral-500">
                Compte existant ou social
              </div>
            </div>
          </div>
        </Button>

        <div className="text-center text-sm text-neutral-500 pt-4">
          <Users className="inline-block mr-1 h-4 w-4" />
          Vous pouvez utiliser les deux méthodes avec le même compte
        </div>
      </CardContent>
    </Card>
  )
}
