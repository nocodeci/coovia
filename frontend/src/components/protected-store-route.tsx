import { useEffect } from 'react'
import { useStore } from '@/context/store-context'

interface ProtectedStoreRouteProps {
  children: React.ReactNode
  storeId?: string
}

export function ProtectedStoreRoute({ children, storeId }: ProtectedStoreRouteProps) {
  const { currentStore, stores, isLoading } = useStore()

  useEffect(() => {
    if (!isLoading) {
      // Si aucune boutique n'est sélectionnée, rediriger vers la sélection
      if (!currentStore) {
        window.location.href = '/store-selection'
        return
      }

      // Si un storeId est spécifié, vérifier qu'il correspond à la boutique sélectionnée
      if (storeId && currentStore.id !== storeId) {
        // Vérifier si la boutique existe dans la liste
        const storeExists = stores.find(store => store.id === storeId)
        if (storeExists) {
          // Si la boutique existe mais n'est pas sélectionnée, rediriger vers la sélection
          window.location.href = '/store-selection'
        } else {
          // Si la boutique n'existe pas, rediriger vers la sélection
          window.location.href = '/store-selection'
        }
      }
    }
  }, [currentStore, storeId, stores, isLoading])

  // Afficher un loader pendant la vérification
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

  // Si aucune boutique n'est sélectionnée ou si elle ne correspond pas, ne rien afficher
  if (!currentStore || (storeId && currentStore.id !== storeId)) {
    return null
  }

  // Si tout est correct, afficher le contenu
  return <>{children}</>
} 