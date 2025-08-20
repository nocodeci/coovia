"use client"

import React from 'react'
import { useSanctumAuth } from '@/hooks/useSanctumAuth'
import { useNavigate } from '@tanstack/react-router'
import { Loader2, Shield, AlertCircle } from 'lucide-react'

// Import du nouveau système de chargement unifié
import { LoadingIndicator } from '@/components/unified-loading'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface SanctumAuthGuardProps {
  children: React.ReactNode
  requiredRole?: string
  fallback?: React.ReactNode
  redirectTo?: string
}

export function SanctumAuthGuard({ 
  children, 
  requiredRole, 
  fallback,
  redirectTo = '/login'
}: SanctumAuthGuardProps) {
  const { user, isAuthenticated, isLoading, error } = useSanctumAuth()
  const navigate = useNavigate()

  // Afficher un loader pendant la vérification de l'authentification
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <Card className="w-full max-w-md mx-auto">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold">Vérification de l'authentification</CardTitle>
            <CardDescription>
              Veuillez patienter pendant que nous vérifions vos accès...
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="flex items-center justify-center gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              <LoadingIndicator size="lg" />
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Rediriger vers la page de connexion si non authentifié
  if (!isAuthenticated) {
    if (fallback) {
      return <>{fallback}</>
    }

    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <Card className="w-full max-w-md mx-auto">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-r from-red-600 to-pink-600 rounded-full flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold">Accès restreint</CardTitle>
            <CardDescription>
              Vous devez être connecté pour accéder à cette page
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}
            <Button 
              onClick={() => navigate({ to: redirectTo })}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              Se connecter
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate({ to: '/' })}
              className="w-full"
            >
              Retour à l'accueil
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Vérifier le rôle si requis
  if (requiredRole && user && user.role !== requiredRole) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <Card className="w-full max-w-md mx-auto">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-full flex items-center justify-center">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold">Accès insuffisant</CardTitle>
            <CardDescription>
              Vous n'avez pas les permissions nécessaires pour accéder à cette page
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center text-sm text-gray-600">
              <p>Rôle requis : <span className="font-semibold">{requiredRole}</span></p>
              <p>Votre rôle : <span className="font-semibold">{user.role}</span></p>
            </div>
            <Button 
              onClick={() => navigate({ to: '/' })}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              Retour à l'accueil
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Afficher le contenu protégé
  return <>{children}</>
}

// Composant de protection pour les composants de niveau supérieur
export function withSanctumAuth<P extends object>(
  Component: React.ComponentType<P>,
  requiredRole?: string
) {
  return function AuthenticatedComponent(props: P) {
    return (
      <SanctumAuthGuard requiredRole={requiredRole}>
        <Component {...props} />
      </SanctumAuthGuard>
    )
  }
}

// Hook pour vérifier les permissions avec Sanctum
export function useSanctumPermissions() {
  const { user, isAuthenticated } = useSanctumAuth()

  const hasRole = (role: string) => {
    return isAuthenticated && user?.role === role
  }

  const hasAnyRole = (roles: string[]) => {
    return isAuthenticated && user && roles.includes(user.role)
  }

  const isAdmin = () => hasRole('admin')
  const isVendor = () => hasRole('vendor')
  const isCustomer = () => hasRole('customer')

  return {
    hasRole,
    hasAnyRole,
    isAdmin,
    isVendor,
    isCustomer,
    user,
    isAuthenticated
  }
}

// Composants de protection spécialisés
export function RequireAuth({ children, fallback }: { children: React.ReactNode; fallback?: React.ReactNode }) {
  return <SanctumAuthGuard fallback={fallback}>{children}</SanctumAuthGuard>
}

export function RequireAdmin({ children, fallback }: { children: React.ReactNode; fallback?: React.ReactNode }) {
  return <SanctumAuthGuard requiredRole="admin" fallback={fallback}>{children}</SanctumAuthGuard>
}

export function RequireVendor({ children, fallback }: { children: React.ReactNode; fallback?: React.ReactNode }) {
  return <SanctumAuthGuard requiredRole="vendor" fallback={fallback}>{children}</SanctumAuthGuard>
}

export function RequireCustomer({ children, fallback }: { children: React.ReactNode; fallback?: React.ReactNode }) {
  return <SanctumAuthGuard requiredRole="customer" fallback={fallback}>{children}</SanctumAuthGuard>
} 