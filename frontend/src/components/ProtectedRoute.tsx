"use client"

import { useEffect } from "react"
import { useNavigate } from "@tanstack/react-router"
import { useAuthStore } from "@/stores/authStore"
import { debugAuth } from "@/utils/debug-auth"

interface ProtectedRouteProps {
  children: React.ReactNode
  redirectTo?: string
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  redirectTo = "/sign-in" 
}) => {
  const { isAuthenticated, user, token } = useAuthStore()
  const navigate = useNavigate()

  useEffect(() => {
    // Debug de l'authentification
    console.log('🔍 ProtectedRoute - Vérification authentification...')
    debugAuth()
    
    console.log('🔍 ProtectedRoute - État du store:')
    console.log('  - isAuthenticated:', isAuthenticated)
    console.log('  - user:', user)
    console.log('  - token:', token ? `${token.substring(0, 20)}...` : 'AUCUN')
    
    // Vérifier l'authentification
    if (!isAuthenticated || !user || !token) {
      console.log('🚫 Utilisateur non authentifié, redirection vers:', redirectTo)
      
      // Rediriger immédiatement
      navigate({ to: redirectTo })
      return
    }
    
    console.log('✅ Utilisateur authentifié, accès autorisé')
  }, [isAuthenticated, user, token, navigate, redirectTo])

  // Si l'utilisateur n'est pas authentifié, afficher un message de chargement
  if (!isAuthenticated || !user || !token) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Vérification de l'authentification...
          </h2>
          <p className="text-gray-600">
            Redirection vers la page de connexion
          </p>
        </div>
      </div>
    )
  }

  // Si l'utilisateur est authentifié, afficher le contenu
  return <>{children}</>
}
