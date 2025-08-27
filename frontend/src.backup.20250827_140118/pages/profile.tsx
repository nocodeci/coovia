"use client"

import React from 'react'
import { ProtectedRoute } from '@/components/auth/protected-route'
import { MainNav } from '@/components/layout/main-nav'
import { UserProfile } from '@/components/user/user-profile'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Shield, User, Settings, Key } from 'lucide-react'

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <MainNav />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* En-tête de la page */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Mon Profil</h1>
                <p className="text-gray-600">Gérez vos informations personnelles et vos paramètres</p>
              </div>
            </div>
          </div>

          {/* Navigation du profil */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex flex-wrap gap-4">
                <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <User className="w-4 h-4" />
                  <span>Informations</span>
                </button>
                <button className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                  <Settings className="w-4 h-4" />
                  <span>Paramètres</span>
                </button>
                <button className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                  <Key className="w-4 h-4" />
                  <span>Sécurité</span>
                </button>
                <button className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                  <Shield className="w-4 h-4" />
                  <span>Autorisations</span>
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Contenu principal du profil */}
          <UserProfile />

          {/* Informations supplémentaires */}
          <div className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-purple-600" />
                  <span>À propos de votre compte</span>
                </CardTitle>
                <CardDescription>
                  Informations importantes concernant votre compte et vos accès
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">Support</h4>
                    <p className="text-sm text-blue-800">
                      Besoin d'aide ? Contactez notre équipe support pour toute question concernant votre compte.
                    </p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-medium text-green-900 mb-2">Sécurité</h4>
                    <p className="text-sm text-green-800">
                      Votre compte est protégé par une authentification MFA, garantissant une sécurité de niveau entreprise.
                    </p>
                  </div>
                </div>
                
                <Separator />
                
                <div className="text-center text-sm text-gray-500">
                  <p>Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}</p>
                  <p>Version de l'application : 1.0.0</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
