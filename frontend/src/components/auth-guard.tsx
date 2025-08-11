"use client"

import { useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useAuth } from '@/context/auth-context'
import { Loader2 } from 'lucide-react'

interface AuthGuardProps {
  children: React.ReactNode
  requireAuth?: boolean
  redirectTo?: string
}

export function AuthGuard({ 
  children, 
  requireAuth = true, 
  redirectTo = '/sign-in' 
}: AuthGuardProps) {
  const { isAuthenticated, hasCheckedAuth, isLoading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (hasCheckedAuth && !isLoading) {
      if (requireAuth && !isAuthenticated) {
        navigate({ to: redirectTo })
      } else if (!requireAuth && isAuthenticated) {
        navigate({ to: '/' })
      }
    }
  }, [isAuthenticated, hasCheckedAuth, isLoading, requireAuth, redirectTo, navigate])

  // Afficher un loader pendant la vérification de l'authentification
  if (!hasCheckedAuth || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Vérification de l'authentification...
          </h2>
          <p className="text-gray-600">
            Veuillez patienter pendant que nous vérifions votre session.
          </p>
        </div>
      </div>
    )
  }

  // Si l'authentification est requise et que l'utilisateur n'est pas connecté
  if (requireAuth && !isAuthenticated) {
    return null // Le navigate va rediriger
  }

  // Si l'authentification n'est pas requise et que l'utilisateur est connecté
  if (!requireAuth && isAuthenticated) {
    return null // Le navigate va rediriger
  }

  // Afficher le contenu protégé
  return <>{children}</>
}
