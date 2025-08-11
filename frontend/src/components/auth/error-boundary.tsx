"use client"

import React, { Component, ErrorInfo, ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle, RefreshCw, Home, Bug, Shield, AlertCircle } from 'lucide-react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
  errorInfo?: ErrorInfo
  isAuthError: boolean
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      isAuthError: false
    }
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    // Vérifier si c'est une erreur d'authentification
    const isAuthError = this.isAuthenticationError(error)
    
    return {
      hasError: true,
      error,
      isAuthError
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Erreur capturée par ErrorBoundary:', error, errorInfo)
    
    // Log l'erreur vers un service externe si nécessaire
    this.logErrorToService(error, errorInfo)
  }

  private static isAuthenticationError(error: Error): boolean {
    const authErrorKeywords = [
      'authentication',
      'auth',
      'token',
      'unauthorized',
      'forbidden',
      'login',
      'session',
      'expired'
    ]
    
    const errorMessage = error.message.toLowerCase()
    const errorStack = error.stack?.toLowerCase() || ''
    
    return authErrorKeywords.some(keyword => 
      errorMessage.includes(keyword) || errorStack.includes(keyword)
    )
  }

  private logErrorToService(error: Error, errorInfo: ErrorInfo) {
    // Ici vous pouvez intégrer avec des services comme Sentry, LogRocket, etc.
    if (process.env.NODE_ENV === 'production') {
      // Exemple d'intégration avec un service de monitoring
      console.log('Logging error to monitoring service:', {
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        timestamp: new Date().toISOString()
      })
    }
  }

  private handleRetry = () => {
    this.setState({
      hasError: false,
      error: undefined,
      errorInfo: undefined,
      isAuthError: false
    })
  }

  private handleGoHome = () => {
    window.location.href = '/'
  }

  private handleReload = () => {
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      // Si un fallback personnalisé est fourni, l'utiliser
      if (this.props.fallback) {
        return this.props.fallback
      }

      const { error, isAuthError } = this.state

      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50 to-orange-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl mx-auto bg-white/90 backdrop-blur-sm border-0 shadow-2xl">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 w-20 h-20 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center">
                {isAuthError ? (
                  <Shield className="w-10 h-10 text-white" />
                ) : (
                  <AlertTriangle className="w-10 h-10 text-white" />
                )}
              </div>
              
              <CardTitle className="text-2xl text-red-800">
                {isAuthError ? 'Erreur d\'authentification' : 'Une erreur est survenue'}
              </CardTitle>
              
              <CardDescription className="text-base">
                {isAuthError 
                  ? 'Un problème est survenu avec votre authentification. Veuillez réessayer de vous connecter.'
                  : 'Une erreur inattendue s\'est produite dans l\'application.'
                }
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Détails de l'erreur */}
              {process.env.NODE_ENV === 'development' && error && (
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <Bug className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 mb-2">Détails de l'erreur (Développement)</h4>
                      <div className="text-sm text-gray-700 space-y-2">
                        <p><strong>Message :</strong> {error.message}</p>
                        {error.stack && (
                          <details className="mt-2">
                            <summary className="cursor-pointer text-gray-600 hover:text-gray-800">
                              Voir la stack trace
                            </summary>
                            <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-x-auto">
                              {error.stack}
                            </pre>
                          </details>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="space-y-3">
                {isAuthError ? (
                  <>
                    <Button
                      onClick={this.handleRetry}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      <Shield className="w-4 h-4 mr-2" />
                      Réessayer la connexion
                    </Button>
                    
                    <Button
                      onClick={this.handleGoHome}
                      variant="outline"
                      className="w-full"
                    >
                      <Home className="w-4 h-4 mr-2" />
                      Retour à l'accueil
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      onClick={this.handleRetry}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Réessayer
                    </Button>
                    
                    <Button
                      onClick={this.handleReload}
                      variant="outline"
                      className="w-full"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Recharger la page
                    </Button>
                    
                    <Button
                      onClick={this.handleGoHome}
                      variant="ghost"
                      className="w-full"
                    >
                      <Home className="w-4 h-4 mr-2" />
                      Retour à l'accueil
                    </Button>
                  </>
                )}
              </div>

              {/* Informations de support */}
              <div className="pt-4 border-t border-gray-200">
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2">
                    Si le problème persiste, contactez notre support
                  </p>
                  <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
                    <span>Support : support@coovia.com</span>
                    <span>•</span>
                    <span>Urgence : +1 (234) 567-890</span>
                  </div>
                </div>
              </div>

              {/* Informations techniques */}
              {process.env.NODE_ENV === 'production' && (
                <div className="pt-4 border-t border-gray-200">
                  <div className="text-center text-xs text-gray-500">
                    <p>ID d'erreur : {this.generateErrorId()}</p>
                    <p>Timestamp : {new Date().toISOString()}</p>
                    <p>Version : 1.0.0</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )
    }

    return this.props.children
  }

  private generateErrorId(): string {
    return `ERR_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }
}

// Composant de fallback pour les erreurs d'authentification
export function AuthErrorFallback({ error }: { error: Error }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50 to-orange-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg mx-auto bg-white/90 backdrop-blur-sm border-0 shadow-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <CardTitle className="text-xl text-red-800">Erreur d'authentification</CardTitle>
          <CardDescription>
            Impossible de vérifier votre identité. Veuillez vous reconnecter.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={() => window.location.href = '/login'}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            Se reconnecter
          </Button>
          <Button
            onClick={() => window.location.href = '/'}
            variant="outline"
            className="w-full"
          >
            Retour à l'accueil
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
