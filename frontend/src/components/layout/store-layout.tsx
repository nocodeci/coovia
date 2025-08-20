import React from 'react'
import { useParams } from '@tanstack/react-router'
import { useStore } from '@/context/store-context'
import { Header } from '@/components/layout/header'
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
      <Header fixed>
        <div className="flex items-center space-x-4">
          <div>
            <h1 className="text-2xl font-bold">{storeFromUrl.name}</h1>
            <p className="text-sm text-muted-foreground">Dashboard</p>
          </div>
          <Badge variant={storeFromUrl.status === 'active' ? 'default' : 'secondary'}>
            {storeFromUrl.status === 'active' ? 'Actif' : 'Inactif'}
          </Badge>
        </div>
      </Header>
      
      <div className="flex-1">
        {children}
      </div>
    </div>
  )
} 