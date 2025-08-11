"use client"

import React from 'react'
import { useSanctumAuth } from '@/hooks/useSanctumAuth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  User, 
  Mail, 
  Calendar, 
  Shield, 
  LogOut, 
  RefreshCw,
  Settings,
  Key
} from 'lucide-react'

export function SanctumUserProfile() {
  const { 
    user, 
    logout, 
    logoutAll, 
    refreshToken, 
    isLoading 
  } = useSanctumAuth()

  if (!user) {
    return null
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin':
        return 'bg-red-100 text-red-800'
      case 'super_admin':
        return 'bg-purple-100 text-purple-800'
      case 'manager':
        return 'bg-blue-100 text-blue-800'
      case 'store_owner':
        return 'bg-green-100 text-green-800'
      case 'customer':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getRoleLabel = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin':
        return 'Administrateur'
      case 'super_admin':
        return 'Super Administrateur'
      case 'manager':
        return 'Gestionnaire'
      case 'store_owner':
        return 'Propriétaire de boutique'
      case 'customer':
        return 'Client'
      default:
        return role
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto border-0 shadow-none">
      <CardHeader className="text-center">
        <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
          <User className="h-10 w-10 text-white" />
        </div>
        <CardTitle className="text-2xl font-bold text-neutral-900">{user.name}</CardTitle>
        <CardDescription className="text-neutral-600">
          Profil utilisateur Sanctum
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Informations de base */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center text-neutral-900">
            <User className="mr-2 h-5 w-5" />
            Informations personnelles
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-600">
                Nom complet
              </label>
              <p className="text-sm text-neutral-900">{user.name}</p>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-600">
                Email
              </label>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-neutral-400" />
                <p className="text-sm text-neutral-900">{user.email}</p>
              </div>
            </div>
          </div>
        </div>

        <Separator className="bg-neutral-200" />

        {/* Rôle et permissions */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center text-neutral-900">
            <Shield className="mr-2 h-5 w-5" />
            Rôle et permissions
          </h3>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-600">
              Rôle actuel
            </label>
            <Badge className={getRoleColor(user.role)}>
              {getRoleLabel(user.role)}
            </Badge>
          </div>
        </div>

        <Separator className="bg-neutral-200" />

        {/* Informations temporelles */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center text-neutral-900">
            <Calendar className="mr-2 h-5 w-5" />
            Informations temporelles
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-600">
                Membre depuis
              </label>
              <p className="text-sm text-neutral-900">{formatDate(user.created_at)}</p>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-600">
                Dernière mise à jour
              </label>
              <p className="text-sm text-neutral-900">{formatDate(user.updated_at)}</p>
            </div>
          </div>
        </div>

        <Separator className="bg-neutral-200" />

        {/* Actions */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center text-neutral-900">
            <Settings className="mr-2 h-5 w-5" />
            Actions
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Button
              variant="outline"
              onClick={refreshToken}
              disabled={isLoading}
              className="w-full border-neutral-300 hover:bg-blue-50 hover:border-blue-300"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Rafraîchir le token
            </Button>
            
            <Button
              variant="outline"
              onClick={logoutAll}
              disabled={isLoading}
              className="w-full border-neutral-300 hover:bg-orange-50 hover:border-orange-300"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Déconnexion globale
            </Button>
          </div>
          
          <Button
            variant="destructive"
            onClick={logout}
            disabled={isLoading}
            className="w-full bg-red-600 hover:bg-red-700"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Se déconnecter
          </Button>
        </div>

        {/* Indicateur de méthode d'authentification */}
        <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center justify-center space-x-2 text-blue-700">
            <Key className="h-4 w-4" />
            <span className="text-sm font-medium">
              Authentifié via Sanctum
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
