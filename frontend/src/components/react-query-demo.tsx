"use client"

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { RefreshCw, Plus, Trash2, Edit } from 'lucide-react'
import { useStores, useCreateStore, useUpdateStore, useDeleteStore } from '@/hooks/useStores'
import { toast } from 'sonner'

export function ReactQueryDemo() {
  const queryClient = useQueryClient()
  
  // Hooks React Query
  const { 
    data: stores, 
    isLoading, 
    isError, 
    error,
    refetch 
  } = useStores()
  
  const createStoreMutation = useCreateStore()
  const updateStoreMutation = useUpdateStore()
  const deleteStoreMutation = useDeleteStore()

  const handleCreateStore = async () => {
    try {
      await createStoreMutation.mutateAsync({
        name: `Nouvelle boutique ${Date.now()}`,
        description: 'Boutique créée via React Query',
        category: 'general',
        address: {},
        contact: {},
      })
      toast.success('Boutique créée avec succès !')
    } catch (error: any) {
      toast.error('Erreur lors de la création:', error.message)
    }
  }

  const handleUpdateStore = async (storeId: string) => {
    try {
      await updateStoreMutation.mutateAsync({
        storeId,
        storeData: {
          name: `Boutique mise à jour ${Date.now()}`,
          description: 'Boutique mise à jour via React Query',
        }
      })
      toast.success('Boutique mise à jour avec succès !')
    } catch (error: any) {
      toast.error('Erreur lors de la mise à jour:', error.message)
    }
  }

  const handleDeleteStore = async (storeId: string) => {
    try {
      await deleteStoreMutation.mutateAsync(storeId)
      toast.success('Boutique supprimée avec succès !')
    } catch (error: any) {
      toast.error('Erreur lors de la suppression:', error.message)
    }
  }

  const handleRefresh = () => {
    refetch()
    toast.info('Données actualisées !')
  }

  const handleInvalidateCache = () => {
    queryClient.invalidateQueries({ queryKey: ['stores'] })
    toast.info('Cache invalidé !')
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4 animate-spin" />
            Chargement des boutiques...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (isError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-destructive">Erreur de chargement</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            {error?.message || 'Une erreur est survenue lors du chargement des boutiques'}
          </p>
          <div className="flex gap-2">
            <Button onClick={handleRefresh} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Réessayer
            </Button>
            <Button onClick={handleInvalidateCache} variant="outline">
              Invalider le cache
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* En-tête avec actions */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Démonstration React Query</h2>
          <p className="text-muted-foreground">
            {stores?.length || 0} boutique(s) chargée(s) avec succès
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleRefresh} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualiser
          </Button>
          <Button onClick={handleInvalidateCache} variant="outline">
            Invalider cache
          </Button>
          <Button onClick={handleCreateStore} disabled={createStoreMutation.isPending}>
            <Plus className="h-4 w-4 mr-2" />
            {createStoreMutation.isPending ? 'Création...' : 'Créer boutique'}
          </Button>
        </div>
      </div>

      {/* Liste des boutiques */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {stores?.map((store) => (
          <Card key={store.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{store.name}</CardTitle>
                <Badge variant={store.status === 'active' ? 'default' : 'secondary'}>
                  {store.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                {store.description || 'Aucune description'}
              </p>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleUpdateStore(store.id)}
                  disabled={updateStoreMutation.isPending}
                >
                  <Edit className="h-3 w-3 mr-1" />
                  Modifier
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDeleteStore(store.id)}
                  disabled={deleteStoreMutation.isPending}
                >
                  <Trash2 className="h-3 w-3 mr-1" />
                  Supprimer
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* État des mutations */}
      {(createStoreMutation.isPending || updateStoreMutation.isPending || deleteStoreMutation.isPending) && (
        <Card>
          <CardHeader>
            <CardTitle>Mutations en cours...</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {createStoreMutation.isPending && (
                <div className="flex items-center gap-2">
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Création d'une nouvelle boutique...</span>
                </div>
              )}
              {updateStoreMutation.isPending && (
                <div className="flex items-center gap-2">
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Mise à jour d'une boutique...</span>
                </div>
              )}
              {deleteStoreMutation.isPending && (
                <div className="flex items-center gap-2">
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Suppression d'une boutique...</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Informations sur React Query */}
      <Card>
        <CardHeader>
          <CardTitle>Avantages de React Query</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h4 className="font-semibold mb-2">✅ Cache intelligent</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Données mises en cache automatiquement</li>
                <li>• Évite les appels API répétitifs</li>
                <li>• Synchronisation entre les composants</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">⚡ Performance optimisée</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Chargement instantané depuis le cache</li>
                <li>• Mise à jour en arrière-plan</li>
                <li>• Gestion automatique des états</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">🔄 Synchronisation</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Invalidation automatique du cache</li>
                <li>• Mise à jour optimiste de l'UI</li>
                <li>• Gestion des erreurs robuste</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">🛠️ Développement</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• DevTools pour le debugging</li>
                <li>• Types TypeScript complets</li>
                <li>• Configuration flexible</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 