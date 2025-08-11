"use client"

import React from 'react'
import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { MainNav } from '@/components/layout/main-nav'
import { useAuth } from '@/context/auth-context'
import {
  Home,
  Search,
  ArrowLeft,
  AlertTriangle,
  MapPin,
  Compass,
  Shield
} from 'lucide-react'

export default function NotFoundPage() {
  const { isAuthenticated } = useAuth()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <MainNav />
      
      <div className="flex items-center justify-center min-h-screen px-4">
        <Card className="w-full max-w-2xl mx-auto text-center">
          <CardHeader className="space-y-6">
            <div className="mx-auto w-24 h-24 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-12 h-12 text-white" />
            </div>
            
            <div>
              <CardTitle className="text-6xl font-bold text-gray-900 mb-4">
                404
              </CardTitle>
              <CardDescription className="text-xl text-gray-600">
                Page introuvable
              </CardDescription>
            </div>
            
            <p className="text-gray-500 max-w-md mx-auto">
              Désolé, la page que vous recherchez n'existe pas ou a été déplacée. 
              Vérifiez l'URL ou utilisez les liens ci-dessous pour naviguer.
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Actions principales */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                onClick={() => window.history.back()}
                variant="outline"
                className="flex-1 sm:flex-none"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour en arrière
              </Button>
              
              <Link to="/">
                <Button className="flex-1 sm:flex-none bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  <Home className="w-4 h-4 mr-2" />
                  Accueil
                </Button>
              </Link>
            </div>

            {/* Navigation rapide */}
            <div className="pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Navigation rapide
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {isAuthenticated ? (
                  <>
                    <Link to="/dashboard">
                      <Button variant="ghost" className="w-full justify-start">
                        <Compass className="w-4 h-4 mr-2" />
                        Tableau de bord
                      </Button>
                    </Link>
                    
                    <Link to="/profile">
                      <Button variant="ghost" className="w-full justify-start">
                        <Shield className="w-4 h-4 mr-2" />
                        Mon profil
                      </Button>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link to="/login">
                      <Button variant="ghost" className="w-full justify-start">
                        <Shield className="w-4 h-4 mr-2" />
                        Se connecter
                      </Button>
                    </Link>
                    
                    <Button variant="ghost" className="w-full justify-start">
                      <Search className="w-4 h-4 mr-2" />
                      Rechercher
                    </Button>
                  </>
                )}
              </div>
            </div>

            {/* Informations utiles */}
            <div className="pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-gray-500">
                <div className="flex items-center justify-center space-x-2">
                  <MapPin className="w-4 h-4" />
                  <span>Vérifiez l'URL</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <Search className="w-4 h-4" />
                  <span>Utilisez la recherche</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <Home className="w-4 h-4" />
                  <span>Retour à l'accueil</span>
                </div>
              </div>
            </div>

            {/* Support */}
            <div className="pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500 mb-3">
                Besoin d'aide ? Contactez notre support
              </p>
              <div className="flex flex-col sm:flex-row gap-2 justify-center text-sm">
                <a 
                  href="mailto:support@coovia.com" 
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  support@coovia.com
                </a>
                <span className="hidden sm:inline text-gray-400">•</span>
                <a 
                  href="tel:+1234567890" 
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  +1 (234) 567-890
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
