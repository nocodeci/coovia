"use client"

import { useState } from "react"
import {
  Plus,
  StoreIcon,
  Package,
  ShoppingCart,
  DollarSign,
  Star,
  Eye,
  Edit,
  Settings,
  MoreHorizontal,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Main } from "@/components/layout/main"
import { SearchProvider } from "@/context/search-context"
import { CreateStoreDialog } from "./components/create-store-dialog"
import { mockStores } from "@/data/mock-stores"
import type { Store } from "@/types/store"

export function StoresManagement() {
  const [stores, setStores] = useState(mockStores)
  const [createStoreOpen, setCreateStoreOpen] = useState(false)

  const handleStoreCreated = (newStore: Store) => {
    setStores((prev) => [...prev, newStore])
  }

  const handleEditStore = (storeId: string) => {
    console.log("Modifier la boutique:", storeId)
  }

  const handleViewStorefront = (store: Store) => {
    window.open(`/store/${store.slug}`, "_blank")
  }

  const handleManageSettings = (storeId: string) => {
    window.location.href = `/stores/${storeId}/settings`
  }

  const handleDeleteStore = (storeId: string) => {
    console.log("Supprimer la boutique:", storeId)
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
    <SearchProvider>
      <Main>
        <div className="space-y-6" style={{ paddingTop: "2rem" }}>
          {/* En-tête */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Mes Boutiques</h1>
              <p className="text-muted-foreground mt-2">Gérez toutes vos boutiques depuis un seul endroit</p>
            </div>
            <Button onClick={() => setCreateStoreOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Créer une boutique
            </Button>
          </div>

          {/* Statistiques globales */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Boutiques</CardTitle>
                <StoreIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stores.length}</div>
                <p className="text-xs text-muted-foreground">
                  {stores.filter((s) => s.status === "active").length} actives
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Produits</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stores.reduce((sum, store) => sum + store.stats.totalProducts, 0)}
                </div>
                <p className="text-xs text-muted-foreground">Tous produits confondus</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Commandes</CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stores.reduce((sum, store) => sum + store.stats.totalOrders, 0)}
                </div>
                <p className="text-xs text-muted-foreground">Toutes boutiques confondues</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Revenus Totaux</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stores.reduce((sum, store) => sum + store.stats.totalRevenue, 0).toLocaleString()} FCFA
                </div>
                <p className="text-xs text-muted-foreground">Revenus cumulés</p>
              </CardContent>
            </Card>
          </div>

          {/* Liste des boutiques */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stores.map((store) => (
              <Card key={store.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={store.logo || "/placeholder.svg"} alt={store.name} />
                        <AvatarFallback>{store.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">{store.name}</CardTitle>
                        <Badge className={getStatusColor(store.status)}>{getStatusText(store.status)}</Badge>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewStorefront(store)}>
                          <Eye className="mr-2 h-4 w-4" />
                          Voir la boutique
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEditStore(store.id)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Modifier
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleManageSettings(store.id)}>
                          <Settings className="mr-2 h-4 w-4" />
                          Paramètres
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleDeleteStore(store.id)} className="text-red-600">
                          Supprimer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <CardDescription className="line-clamp-2">{store.description}</CardDescription>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Produits:</span>
                      <div className="font-medium">{store.stats.totalProducts}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Commandes:</span>
                      <div className="font-medium">{store.stats.totalOrders}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Revenus:</span>
                      <div className="font-medium">{store.stats.totalRevenue.toLocaleString()} FCFA</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Note:</span>
                      <div className="font-medium flex items-center gap-1">
                        {store.stats.rating > 0 ? (
                          <>
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            {store.stats.rating}
                          </>
                        ) : (
                          "N/A"
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 bg-transparent"
                      onClick={() => handleViewStorefront(store)}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      Voir
                    </Button>
                    <Button size="sm" className="flex-1" onClick={() => (window.location.href = `/?store=${store.id}`)}>
                      Gérer
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Carte pour créer une nouvelle boutique */}
            <Card
              className="border-dashed border-2 hover:border-primary/50 transition-colors cursor-pointer"
              onClick={() => setCreateStoreOpen(true)}
            >
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="w-12 h-12 rounded-full border-2 border-dashed border-muted-foreground/25 flex items-center justify-center mb-4">
                  <Plus className="h-6 w-6 text-muted-foreground" />
                </div>
                <CardTitle className="text-lg mb-2">Créer une boutique</CardTitle>
                <CardDescription className="text-center">
                  Ajoutez une nouvelle boutique pour vendre vos produits
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </Main>

      {/* Dialog de création de boutique */}
      <CreateStoreDialog open={createStoreOpen} onOpenChange={setCreateStoreOpen} onStoreCreated={handleStoreCreated} />
    </SearchProvider>
  )
}
