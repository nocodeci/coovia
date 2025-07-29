"use client"

import { useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Package, ShoppingCart, DollarSign, Star, Eye, Settings, Edit, Users, TrendingUp } from "lucide-react"
import { useStore } from "@/context/store-context"

interface StoreDashboardProps {
  storeId: string
  onEditStore?: () => void
  onViewStorefront?: () => void
  onManageSettings?: () => void
}

export function StoreDashboard({ storeId, onEditStore, onViewStorefront, onManageSettings }: StoreDashboardProps) {
  const { currentStore, storeDashboard, fetchStoreDashboard, isLoading } = useStore()

  useEffect(() => {
    if (storeId) {
      fetchStoreDashboard(storeId)
    }
  }, [storeId])

  if (isLoading || !currentStore) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "inactive":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "Active"
      case "pending":
        return "En attente"
      case "inactive":
        return "Inactive"
      default:
        return status
    }
  }

  return (
    <div className="space-y-6">
      {/* En-tête de la boutique */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={currentStore.logo || "/placeholder.svg"} alt={currentStore.name} />
                <AvatarFallback className="text-lg">{currentStore.name.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold">{currentStore.name}</h1>
                  <Badge className={getStatusColor(currentStore.status)}>{getStatusText(currentStore.status)}</Badge>
                </div>
                <p className="text-muted-foreground max-w-2xl">{currentStore.description}</p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>Catégorie: {currentStore.category}</span>
                  <span>•</span>
                  <span>Créée le {new Date(currentStore.created_at).toLocaleDateString("fr-FR")}</span>
                  {currentStore.stats.rating > 0 && (
                    <>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span>
                          {currentStore.stats.rating} ({currentStore.stats.reviewCount} avis)
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={onViewStorefront}>
                <Eye className="h-4 w-4 mr-2" />
                Voir la boutique
              </Button>
              <Button variant="outline" size="sm" onClick={onEditStore}>
                <Edit className="h-4 w-4 mr-2" />
                Modifier
              </Button>
              <Button variant="outline" size="sm" onClick={onManageSettings}>
                <Settings className="h-4 w-4 mr-2" />
                Paramètres
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Produits</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {storeDashboard?.generalStats.totalProducts || currentStore.stats.totalProducts}
            </div>
            <p className="text-xs text-muted-foreground">
              {storeDashboard?.generalStats.growthPercentage.products && (
                <span
                  className={`inline-flex items-center ${storeDashboard.generalStats.growthPercentage.products >= 0 ? "text-green-600" : "text-red-600"}`}
                >
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {storeDashboard.generalStats.growthPercentage.products > 0 ? "+" : ""}
                  {storeDashboard.generalStats.growthPercentage.products}%
                </span>
              )}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Commandes</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {storeDashboard?.generalStats.totalOrders || currentStore.stats.totalOrders}
            </div>
            <p className="text-xs text-muted-foreground">
              {storeDashboard?.generalStats.growthPercentage.orders && (
                <span
                  className={`inline-flex items-center ${storeDashboard.generalStats.growthPercentage.orders >= 0 ? "text-green-600" : "text-red-600"}`}
                >
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {storeDashboard.generalStats.growthPercentage.orders > 0 ? "+" : ""}
                  {storeDashboard.generalStats.growthPercentage.orders}%
                </span>
              )}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {storeDashboard?.generalStats.totalCustomers || currentStore.stats.totalCustomers}
            </div>
            <p className="text-xs text-muted-foreground">
              {storeDashboard?.generalStats.growthPercentage.customers && (
                <span
                  className={`inline-flex items-center ${storeDashboard.generalStats.growthPercentage.customers >= 0 ? "text-green-600" : "text-red-600"}`}
                >
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {storeDashboard.generalStats.growthPercentage.customers > 0 ? "+" : ""}
                  {storeDashboard.generalStats.growthPercentage.customers}%
                </span>
              )}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenus</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(storeDashboard?.generalStats.totalRevenue || currentStore.stats.totalRevenue).toLocaleString()} FCFA
            </div>
            <p className="text-xs text-muted-foreground">
              {storeDashboard?.generalStats.growthPercentage.revenue && (
                <span
                  className={`inline-flex items-center ${storeDashboard.generalStats.growthPercentage.revenue >= 0 ? "text-green-600" : "text-red-600"}`}
                >
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {storeDashboard.generalStats.growthPercentage.revenue > 0 ? "+" : ""}
                  {storeDashboard.generalStats.growthPercentage.revenue}%
                </span>
              )}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Revenus mensuels et produits populaires */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Revenus mensuels</CardTitle>
            <CardDescription>Évolution des revenus sur les 6 derniers mois</CardDescription>
          </CardHeader>
          <CardContent>
            {storeDashboard?.monthlyRevenue ? (
              <div className="space-y-2">
                {storeDashboard.monthlyRevenue.map((item, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">{item.month}</span>
                    <span className="font-medium">{item.revenue.toLocaleString()} FCFA</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">Aucune donnée disponible</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Produits populaires</CardTitle>
            <CardDescription>Vos produits les plus vendus</CardDescription>
          </CardHeader>
          <CardContent>
            {storeDashboard?.topProducts ? (
              <div className="space-y-2">
                {storeDashboard.topProducts.map((product, index) => (
                  <div key={product.id} className="flex justify-between items-center">
                    <div>
                      <span className="text-sm font-medium">{product.name}</span>
                      <p className="text-xs text-muted-foreground">{product.sales} ventes</p>
                    </div>
                    <span className="font-medium">{product.revenue.toLocaleString()} FCFA</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">Aucun produit vendu</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Commandes récentes */}
      {storeDashboard?.recentOrders && storeDashboard.recentOrders.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Commandes récentes</CardTitle>
            <CardDescription>Les dernières commandes de votre boutique</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {storeDashboard.recentOrders.map((order) => (
                <div key={order.id} className="flex justify-between items-center p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{order.customer_name}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(order.created_at).toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{order.total.toLocaleString()} FCFA</p>
                    <Badge variant={order.status === "completed" ? "default" : "secondary"} className="text-xs">
                      {order.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
