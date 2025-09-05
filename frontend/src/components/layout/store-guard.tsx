import { ReactNode, useEffect, useRef } from "react"
import { useStore } from "@/context/store-context"
import { useNavigate, useLocation } from "@tanstack/react-router"
import { FullPageLoader } from "@/components/ui/full-page-loader"
import { IGNORED_STORE_PATHS } from "@/constants/routes"

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

    // Si on est sur une route ignorée, ne rien faire
    if (IGNORED_STORE_PATHS.includes(location.pathname as any)) {
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
    const urlStoreId = pathSegments[1] || null // Vérification null pour les routes sans storeId
    
    // Reset le flag de redirection quand l'URL correspond
    if (urlStoreId && currentStore.id === urlStoreId) {
      hasRedirected.current = false
    }
  }, [currentStore?.id, isLoading, location.pathname, navigate])

  // Si on est sur une route ignorée, afficher le contenu sans vérification
  if (IGNORED_STORE_PATHS.includes(location.pathname as any)) {
    return <>{children}</>
  }

  // Si en cours de chargement, afficher un loader
  if (isLoading) {
    return <FullPageLoader message="Vérification de la boutique..." />
  }

  // Si aucune boutique n'est sélectionnée, ne rien afficher (redirection en cours)
  if (!currentStore) {
    return <FullPageLoader message="Redirection vers la sélection de boutique..." />
  }

  // Si tout est correct, afficher le contenu
  return <>{children}</>
} 