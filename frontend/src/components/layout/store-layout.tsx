import React from 'react'
import { useParams } from '@tanstack/react-router'
import { useStore } from '@/context/store-context'
import { Badge } from '@/components/ui/badge'

interface StoreLayoutProps {
  children: React.ReactNode
}

export function StoreLayout({ children }: StoreLayoutProps) {
  const { storeId } = useParams({ from: '/_authenticated/$storeId' })
  const { stores } = useStore()

  // Trouver la boutique correspondant à l'URL
  const storeFromUrl = React.useMemo(() => {
    if (storeId && stores.length > 0) {
      return stores.find(store => store.id === storeId)
    }
    return null
  }, [storeId, stores])

  // Si pas de boutique trouvée, afficher un message d'erreur
  if (!storeFromUrl) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-muted-foreground">Boutique non trouvée</p>
          <p className="text-sm text-muted-foreground mt-2">StoreId: {storeId}</p>
          <p className="text-sm text-muted-foreground">Stores disponibles: {stores.length}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1">
        {children}
      </div>
    </div>
  )
} 