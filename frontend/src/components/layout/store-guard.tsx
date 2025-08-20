import { ReactNode, useEffect, useRef } from "react"
import { useStore } from "@/context/store-context"
import { useNavigate, useLocation } from "@tanstack/react-router"

interface StoreGuardProps {
  children: ReactNode
}

export function StoreGuard({ children }: StoreGuardProps) {
  const { currentStore, isLoading } = useStore()
  const navigate = useNavigate()
  const location = useLocation()
  const hasRedirected = useRef(false)

  useEffect(() => {
    // Éviter les redirections multiples
    if (isLoading) return

    // Si on est sur store-selection ou create-store, ne rien faire
    if (location.pathname === '/store-selection' || location.pathname === '/create-store') {
      return
    }

    // Si aucune boutique n'est sélectionnée, rediriger vers store-selection
    if (!currentStore) {
      if (!hasRedirected.current) {
        hasRedirected.current = true
        navigate({ to: "/store-selection" })
      }
      return
    }

    // Si on est sur une route avec storeId mais que la boutique ne correspond pas
    // Ne pas rediriger automatiquement, laisser le StoreSelector gérer les changements
    const pathSegments = location.pathname.split('/')
    const urlStoreId = pathSegments[1] // Le storeId est le premier segment après le slash
    
    // Reset le flag de redirection quand l'URL correspond
    if (urlStoreId && currentStore.id === urlStoreId) {
      hasRedirected.current = false
    }
  }, [currentStore?.id, isLoading, location.pathname, navigate])

  // Si on est sur store-selection ou create-store, afficher le contenu sans vérification
  if (location.pathname === '/store-selection' || location.pathname === '/create-store') {
    return <>{children}</>
  }

  // Si en cours de chargement, afficher un loader
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-neutral-600">Vérification de la boutique...</p>
        </div>
      </div>
    )
  }

  // Si aucune boutique n'est sélectionnée, ne rien afficher (redirection en cours)
  if (!currentStore) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-neutral-600">Redirection vers la sélection de boutique...</p>
        </div>
      </div>
    )
  }

  // Si tout est correct, afficher le contenu
  return <>{children}</>
} 