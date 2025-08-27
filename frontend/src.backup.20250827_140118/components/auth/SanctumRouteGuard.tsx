"use client"

import React from 'react'
import { useSanctumAuth } from '@/hooks/useSanctumAuth'
import { useNavigate } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, Shield, Key, ArrowRight } from 'lucide-react'

// Import du nouveau système de chargement unifié
import { LoadingIndicator } from '@/components/unified-loading'

interface SanctumRouteGuardProps {
  children: React.ReactNode
  requireAuth?: boolean
  requireGuest?: boolean
  requiredRole?: string
  fallback?: React.ReactNode
  redirectTo?: string
}

export function SanctumRouteGuard({
  children,
  requireAuth = false,
  requireGuest = false,
  requiredRole,
  fallback,
  redirectTo
}: SanctumRouteGuardProps) {
  const { user, isAuthenticated, isLoading } = useSanctumAuth()
  const navigate = useNavigate()

  // Pendant le chargement
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <Card className="w-full max-w-md mx-auto border-0 shadow-2xl bg-white/80 backdrop-blur-sm">
          <CardContent className="p-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <LoadingIndicator size="lg" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Vérification de l'authentification
            </h2>
            <p className="text-gray-600">
              Veuillez patienter pendant que nous vérifions votre session...
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Protection pour les utilisateurs connectés (pages publiques)
  if (requireGuest && isAuthenticated) {
    const defaultRedirect = redirectTo || '/dashboard'
    React.useEffect(() => {
      navigate({ to: defaultRedirect })
    }, [navigate, defaultRedirect])
    
    return fallback || (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <Card className="w-full max-w-md mx-auto border-0 shadow-2xl bg-white/80 backdrop-blur-sm">
          <CardContent className="p-8 text-center">
            <Shield className="h-8 w-8 mx-auto mb-4 text-green-600" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Redirection en cours
            </h2>
            <p className="text-gray-600 mb-4">
              Vous êtes déjà connecté, redirection vers le tableau de bord...
            </p>
            <Button
              onClick={() => navigate({ to: defaultRedirect })}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              Aller au tableau de bord
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Protection pour les utilisateurs non connectés (pages privées)
  if (requireAuth && !isAuthenticated) {
    const defaultRedirect = redirectTo || '/sign-in'
    React.useEffect(() => {
      navigate({ to: defaultRedirect })
    }, [navigate, defaultRedirect])
    
    return fallback || (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <Card className="w-full max-w-md mx-auto border-0 shadow-2xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-r from-red-600 to-pink-600 rounded-full flex items-center justify-center">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Accès restreint
            </CardTitle>
            <CardDescription className="text-gray-600">
              Vous devez être connecté pour accéder à cette page
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <Key className="h-5 w-5 text-blue-600" />
              <div>
                <h3 className="font-semibold text-blue-900">Authentification Sanctum</h3>
                <p className="text-sm text-blue-700">
                  Connectez-vous avec votre compte Coovia
                </p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button
                onClick={() => navigate({ to: '/sign-in' })}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                Se connecter
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate({ to: '/sign-up' })}
                className="flex-1 border-gray-300"
              >
                Créer un compte
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Vérification des rôles
  if (requiredRole && user && user.role !== requiredRole) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <Card className="w-full max-w-md mx-auto border-0 shadow-2xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-r from-orange-600 to-red-600 rounded-full flex items-center justify-center">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Permissions insuffisantes
            </CardTitle>
            <CardDescription className="text-gray-600">
              Vous n'avez pas les permissions nécessaires pour accéder à cette page
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-gray-600 mb-4">
              Rôle requis: <span className="font-semibold text-orange-600">{requiredRole}</span><br />
              Votre rôle: <span className="font-semibold text-gray-900">{user.role}</span>
            </p>
            <Button
              onClick={() => navigate({ to: '/dashboard' })}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              Retour au tableau de bord
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Tout est OK, afficher le contenu
  return <>{children}</>
}

// Composants utilitaires pour une utilisation plus simple
export function RequireAuth({ children, ...props }: Omit<SanctumRouteGuardProps, 'requireAuth'>) {
  return (
    <SanctumRouteGuard requireAuth={true} {...props}>
      {children}
    </SanctumRouteGuard>
  )
}

export function RequireGuest({ children, ...props }: Omit<SanctumRouteGuardProps, 'requireGuest'>) {
  return (
    <SanctumRouteGuard requireGuest={true} {...props}>
      {children}
    </SanctumRouteGuard>
  )
}

export function RequireRole({ 
  children, 
  role, 
  ...props 
}: Omit<SanctumRouteGuardProps, 'requiredRole'> & { role: string }) {
  return (
    <SanctumRouteGuard requireAuth={true} requiredRole={role} {...props}>
      {children}
    </SanctumRouteGuard>
  )
}

export function RequireAdmin({ children, ...props }: Omit<SanctumRouteGuardProps, 'requiredRole'>) {
  return (
    <SanctumRouteGuard requireAuth={true} requiredRole="admin" {...props}>
      {children}
    </SanctumRouteGuard>
  )
}
