"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { isAuthenticated } from "@/utils/clear-cache"

interface AutoRedirectProps {
  children: React.ReactNode
  redirectTo?: string
  delay?: number
}

export const AutoRedirect: React.FC<AutoRedirectProps> = ({ 
  children, 
  redirectTo = "/sign-in", 
  delay = 2000 
}) => {
  const router = useRouter()

  useEffect(() => {
    // Vérifier l'authentification
    if (!isAuthenticated()) {
      console.log('🚫 Utilisateur non authentifié, redirection automatique...')
      
      // Rediriger après le délai spécifié
      const timer = setTimeout(() => {
        console.log(`🔄 Redirection vers ${redirectTo}`)
        router.push(redirectTo)
      }, delay)

      return () => clearTimeout(timer)
    }
  }, [router, redirectTo, delay])

  // Si l'utilisateur n'est pas authentifié, afficher un message de chargement
  if (!isAuthenticated()) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Redirection en cours...
          </h2>
          <p className="text-gray-600">
            Vous devez être connecté pour accéder à cette page
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Redirection automatique dans {delay / 1000} secondes
          </p>
        </div>
      </div>
    )
  }

  // Si l'utilisateur est authentifié, afficher le contenu
  return <>{children}</>
}
