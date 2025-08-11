"use client"

import React from 'react'
import { useAuth } from '@/context/auth-context'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Shield, Lock, AlertTriangle, UserCheck } from 'lucide-react'

interface RoleGuardProps {
  children: React.ReactNode
  requiredRoles?: string[]
  requiredPermissions?: string[]
  fallback?: React.ReactNode
  showAccessDenied?: boolean
}

export function RoleGuard({ 
  children, 
  requiredRoles = [], 
  requiredPermissions = [], 
  fallback,
  showAccessDenied = true 
}: RoleGuardProps) {
  const { user, isAuthenticated, isLoading } = useAuth()

  // Si en cours de chargement, afficher un loader
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // Si pas authentifié, ne rien afficher (laisser ProtectedRoute gérer)
  if (!isAuthenticated || !user) {
    return null
  }

  // Extraire les rôles et permissions de l'utilisateur
  const userRoles = user['https://coovia.com/roles'] || []
  const userPermissions = user['https://coovia.com/permissions'] || []

  // Vérifier les rôles requis
  const hasRequiredRoles = requiredRoles.length === 0 || 
    requiredRoles.some(role => userRoles.includes(role))

  // Vérifier les permissions requises
  const hasRequiredPermissions = requiredPermissions.length === 0 || 
    requiredPermissions.every(permission => userPermissions.includes(permission))

  // Si l'utilisateur a les droits requis, afficher le contenu
  if (hasRequiredRoles && hasRequiredPermissions) {
    return <>{children}</>
  }

  // Si un fallback personnalisé est fourni, l'utiliser
  if (fallback) {
    return <>{fallback}</>
  }

  // Si showAccessDenied est false, ne rien afficher
  if (!showAccessDenied) {
    return null
  }

  // Afficher le message d'accès refusé par défaut
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50 to-orange-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg bg-white/90 backdrop-blur-sm border-0 shadow-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <Lock className="w-8 h-8 text-red-600" />
          </div>
          <CardTitle className="text-xl text-red-800">Accès refusé</CardTitle>
          <CardDescription className="text-base">
            Vous n'avez pas les autorisations nécessaires pour accéder à cette ressource.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Détails des exigences */}
          <div className="space-y-4">
            {requiredRoles.length > 0 && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start space-x-3">
                  <Shield className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-blue-900 mb-2">Rôles requis :</h4>
                    <div className="flex flex-wrap gap-2">
                      {requiredRoles.map((role, index) => (
                        <span 
                          key={index}
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            userRoles.includes(role)
                              ? 'bg-green-100 text-green-800 border border-green-200'
                              : 'bg-red-100 text-red-800 border border-red-200'
                          }`}
                        >
                          {role}
                          {userRoles.includes(role) && (
                            <UserCheck className="w-3 h-3 ml-1 inline" />
                          )}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {requiredPermissions.length > 0 && (
              <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <div className="flex items-start space-x-3">
                  <Shield className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-purple-900 mb-2">Permissions requises :</h4>
                    <div className="flex flex-wrap gap-2">
                      {requiredPermissions.map((permission, index) => (
                        <span 
                          key={index}
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            userPermissions.includes(permission)
                              ? 'bg-green-100 text-green-800 border border-green-200'
                              : 'bg-red-100 text-red-800 border border-red-200'
                          }`}
                        >
                          {permission}
                          {userPermissions.includes(permission) && (
                            <UserCheck className="w-3 h-3 ml-1 inline" />
                          )}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Rôles et permissions actuels de l'utilisateur */}
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <div className="flex items-start space-x-3">
              <UserCheck className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Vos autorisations actuelles :</h4>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm font-medium text-gray-700">Rôles :</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {userRoles.length > 0 ? (
                        userRoles.map((role, index) => (
                          <span 
                            key={index}
                            className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs"
                          >
                            {role}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-gray-500">Aucun rôle assigné</span>
                      )}
                    </div>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">Permissions :</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {userPermissions.length > 0 ? (
                        userPermissions.map((permission, index) => (
                          <span 
                            key={index}
                            className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs"
                          >
                            {permission}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-gray-500">Aucune permission assignée</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Button 
              onClick={() => window.history.back()}
              variant="outline"
              className="w-full"
            >
              Retour en arrière
            </Button>
            
            <Button 
              onClick={() => window.location.href = '/'}
              variant="ghost"
              className="w-full"
            >
              Retour à l'accueil
            </Button>
          </div>

          {/* Informations de contact */}
          <div className="pt-4 border-t border-gray-200">
            <div className="text-center">
              <p className="text-xs text-gray-500 mb-2">
                Si vous pensez qu'il s'agit d'une erreur, contactez votre administrateur
              </p>
              <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
                <span>Support : support@coovia.com</span>
                <span>•</span>
                <span>Admin : admin@coovia.com</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Composants utilitaires pour des cas d'usage courants
export function AdminOnly({ children, fallback, showAccessDenied }: Omit<RoleGuardProps, 'requiredRoles'>) {
  return (
    <RoleGuard 
      requiredRoles={['admin', 'super_admin']} 
      fallback={fallback}
      showAccessDenied={showAccessDenied}
    >
      {children}
    </RoleGuard>
  )
}

export function ManagerOnly({ children, fallback, showAccessDenied }: Omit<RoleGuardProps, 'requiredRoles'>) {
  return (
    <RoleGuard 
      requiredRoles={['manager', 'admin', 'super_admin']} 
      fallback={fallback}
      showAccessDenied={showAccessDenied}
    >
      {children}
    </RoleGuard>
  )
}

export function StoreOwnerOnly({ children, fallback, showAccessDenied }: Omit<RoleGuardProps, 'requiredRoles'>) {
  return (
    <RoleGuard 
      requiredRoles={['store_owner', 'admin', 'super_admin']} 
      fallback={fallback}
      showAccessDenied={showAccessDenied}
    >
      {children}
    </RoleGuard>
  )
}

export function HasPermission({ 
  children, 
  permission, 
  fallback, 
  showAccessDenied 
}: Omit<RoleGuardProps, 'requiredPermissions'> & { permission: string }) {
  return (
    <RoleGuard 
      requiredPermissions={[permission]} 
      fallback={fallback}
      showAccessDenied={showAccessDenied}
    >
      {children}
    </RoleGuard>
  )
}
