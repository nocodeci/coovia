"use client"

import { useEffect } from "react"
import { useNavigate } from "@tanstack/react-router"
import { useAuthStore } from "@/stores/authStore"

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
    console.log('🔍 ProtectedRoute - Vérification authentification...')
    console.log('  - isAuthenticated:', isAuthenticated)
    console.log('  - user:', user)
    console.log('  - token:', token ? `${token.substring(0, 20)}...` : 'AUCUN')
    
    // Vérifier l'authentification
    if (!isAuthenticated || !user || !token) {
      console.log('🚫 Utilisateur non authentifié, redirection vers:', redirectTo)
      navigate({ to: redirectTo })
      return
    }
    
    console.log('✅ Utilisateur authentifié, accès autorisé')
  }, [isAuthenticated, user, token, navigate, redirectTo])

  // Si l'utilisateur n'est pas authentifié, ne rien afficher (redirection en cours)
  if (!isAuthenticated || !user || !token) {
    return null
  }

  // Si l'utilisateur est authentifié, afficher le contenu
  return <>{children}</>
}
