"use client"

import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle, RefreshCw, Home, HelpCircle, Shield } from 'lucide-react'

interface AuthErrorProps {
  error: {
    code?: string
    message: string
    description?: string
  }
  onRetry?: () => void
  onGoHome?: () => void
  onGetHelp?: () => void
}

export function AuthError({ error, onRetry, onGoHome, onGetHelp }: AuthErrorProps) {
  const getErrorDetails = (code?: string) => {
    switch (code) {
      case 'access_denied':
        return {
          title: 'Accès refusé',
          description: 'Vous avez annulé le processus d\'authentification ou n\'avez pas les autorisations nécessaires.',
          solution: 'Vérifiez vos autorisations ou contactez votre administrateur.',
          icon: Shield
        }
      case 'invalid_grant':
        return {
          title: 'Session expirée',
          description: 'Votre session d\'authentification a expiré ou est invalide.',
          solution: 'Veuillez vous reconnecter en utilisant le bouton ci-dessous.',
          icon: AlertTriangle
        }
      case 'consent_required':
        return {
          title: 'Consentement requis',
          description: 'L\'application nécessite votre consentement pour accéder à vos informations.',
          solution: 'Veuillez accepter les conditions d\'utilisation pour continuer.',
          icon: HelpCircle
        }
      case 'login_required':
        return {
          title: 'Connexion requise',
          description: 'Vous devez être connecté pour accéder à cette ressource.',
          solution: 'Veuillez vous connecter pour continuer.',
          icon: AlertTriangle
        }
      case 'server_error':
        return {
          title: 'Erreur du serveur',
          description: 'Une erreur s\'est produite côté serveur d\'authentification.',
          solution: 'Veuillez réessayer dans quelques minutes ou contacter le support.',
          icon: AlertTriangle
        }
      case 'temporarily_unavailable':
        return {
          title: 'Service temporairement indisponible',
          description: 'Le service d\'authentification est temporairement indisponible.',
          solution: 'Veuillez réessayer dans quelques minutes.',
          icon: AlertTriangle
        }
      default:
        return {
          title: 'Erreur d\'authentification',
          description: error.description || 'Une erreur inattendue s\'est produite lors de l\'authentification.',
          solution: 'Veuillez réessayer ou contacter le support si le problème persiste.',
          icon: AlertTriangle
        }
    }
  }

  const errorDetails = getErrorDetails(error.code)
  const IconComponent = errorDetails.icon

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50 to-orange-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg bg-white/90 backdrop-blur-sm border-0 shadow-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <IconComponent className="w-8 h-8 text-red-600" />
          </div>
          <CardTitle className="text-xl text-red-800">{errorDetails.title}</CardTitle>
          <CardDescription className="text-base">
            {errorDetails.description}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Solution */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start space-x-3">
              <HelpCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-blue-900 mb-1">Solution recommandée</h4>
                <p className="text-sm text-blue-800">{errorDetails.solution}</p>
              </div>
            </div>
          </div>

          {/* Détails de l'erreur */}
          {error.code && (
            <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Code d'erreur :</span>
                <code className="text-xs bg-gray-200 px-2 py-1 rounded text-gray-800 font-mono">
                  {error.code}
                </code>
              </div>
            </div>
          )}

          {/* Message d'erreur détaillé */}
          {error.message && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start space-x-2">
                <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-red-800 mb-1">Message d'erreur :</p>
                  <p className="text-xs text-red-700 font-mono break-words">
                    {error.message}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="space-y-3">
            {onRetry && (
              <Button 
                onClick={onRetry}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Réessayer
              </Button>
            )}
            
            {onGoHome && (
              <Button 
                onClick={onGoHome}
                variant="outline"
                className="w-full"
              >
                <Home className="w-4 h-4 mr-2" />
                Retour à l'accueil
              </Button>
            )}
            
            {onGetHelp && (
              <Button 
                onClick={onGetHelp}
                variant="ghost"
                className="w-full"
              >
                <HelpCircle className="w-4 h-4 mr-2" />
                Obtenir de l'aide
              </Button>
            )}
          </div>

          {/* Informations supplémentaires */}
          <div className="pt-4 border-t border-gray-200">
            <div className="text-center">
              <p className="text-xs text-gray-500 mb-2">
                Si le problème persiste, contactez notre équipe de support
              </p>
              <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
                <span>Support : support@coovia.com</span>
                <span>•</span>
                <span>Documentation : docs.coovia.com</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
