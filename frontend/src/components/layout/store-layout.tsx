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
  const { stores, currentStore, setCurrentStore } = useStore()

  // Charger la boutique depuis l'URL
  React.useEffect(() => {
    console.log('StoreLayout Debug:', {
      storeId,
      storesCount: stores.length,
      currentStoreId: currentStore?.id,
      stores: stores.map(s => ({ id: s.id, name: s.name }))
    })
    
    if (storeId && stores.length > 0) {
      const storeFromList = stores.find(store => store.id === storeId)
      console.log('Store trouvé:', storeFromList)
      
      if (storeFromList && (!currentStore || currentStore.id !== storeId)) {
        console.log('Définition de la boutique actuelle:', storeFromList.name)
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
    <div className="flex flex-col h-full">
      <Header fixed>
        <div className="flex items-center space-x-4">
          <div>
            <h1 className="text-2xl font-bold">{currentStore.name}</h1>
            <p className="text-sm text-muted-foreground">Dashboard</p>
          </div>
          <Badge variant={currentStore.status === 'active' ? 'default' : 'secondary'}>
            {currentStore.status === 'active' ? 'Actif' : 'Inactif'}
          </Badge>
        </div>
      </Header>
      
      <div className="flex-1">
        {children}
      </div>
    </div>
  )
} 