"use client"

import { useState, useEffect } from "react"
import { Package, TrendingUp, AlertTriangle, Archive } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useStore } from "@/context/store-context"
import apiService from "@/lib/api"

export function ProductsHeader() {
  const { currentStore } = useStore()
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    draft: 0,
    archived: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadProductStats = async () => {
      if (!currentStore?.id) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)
        const response = await apiService.getStoreProducts(currentStore.id)
        
        if (response.success && response.data) {
          const products = response.data
          const stats = {
            total: products.length,
            active: products.filter((p: any) => p.status === 'active').length,
            draft: products.filter((p: any) => p.status === 'draft').length,
            archived: products.filter((p: any) => p.status === 'archived').length,
          }
          setStats(stats)
        } else {
          setError('Erreur lors du chargement des statistiques')
        }
      } catch (error: any) {
        console.error('Erreur lors du chargement des statistiques:', error)
        setError(error.message || 'Erreur de connexion')
      } finally {
        setLoading(false)
      }
    }

    loadProductStats()
  }, [currentStore?.id])

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 bg-gray-200 rounded w-24"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded w-16"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Erreur</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-destructive">Impossible de charger les statistiques</div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total des produits</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.total}</div>
          <p className="text-xs text-muted-foreground">
            Tous les produits
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Produits actifs</CardTitle>
          <TrendingUp className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{stats.active}</div>
          <p className="text-xs text-muted-foreground">
            En vente
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Brouillons</CardTitle>
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-yellow-600">{stats.draft}</div>
          <p className="text-xs text-muted-foreground">
            En attente de publication
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Archivés</CardTitle>
          <Archive className="h-4 w-4 text-gray-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-600">{stats.archived}</div>
          <p className="text-xs text-muted-foreground">
            Hors catalogue
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
    