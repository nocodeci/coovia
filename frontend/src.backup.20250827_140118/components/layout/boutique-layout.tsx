import React from 'react'
import { useParams } from '@tanstack/react-router'
import { useStore } from '@/context/store-context'
import { Badge } from '@/components/ui/badge'

interface BoutiqueLayoutProps {
  children: React.ReactNode
}

export function BoutiqueLayout({ children }: BoutiqueLayoutProps) {
  const { storeId } = useParams({ from: '/boutique/$storeId' })
  const { stores, currentStore, setCurrentStore } = useStore()

  // Charger la boutique depuis l'URL
  React.useEffect(() => {
    if (storeId && stores.length > 0) {
      const storeFromList = stores.find(store => store.id === storeId)
      if (storeFromList && (!currentStore || currentStore.id !== storeId)) {
        setCurrentStore(storeFromList)
      }
    }
  }, [storeId, stores, currentStore, setCurrentStore])

  // Si pas de boutique sélectionnée, afficher un message de chargement
  if (!currentStore) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-muted-foreground">Chargement de la boutique...</p>
          <p className="text-sm text-muted-foreground mt-2">StoreId: {storeId}</p>
          <p className="text-sm text-muted-foreground">Stores disponibles: {stores.length}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header simple pour la boutique */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center space-x-4">
            <div>
              <h1 className="text-xl font-bold">{currentStore.name}</h1>
              <p className="text-sm text-muted-foreground">Boutique</p>
            </div>
            <Badge variant={currentStore.status === 'active' ? 'default' : 'secondary'}>
              {currentStore.status === 'active' ? 'Actif' : 'Inactif'}
            </Badge>
          </div>
        </div>
      </header>
      
      {/* Contenu principal */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  )
} 