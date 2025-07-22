"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Package, ShoppingCart, DollarSign, Star, Eye, Settings, Edit } from "lucide-react"
import type { Store as StoreType } from "@/types/store"

interface StoreOverviewProps {
  store: StoreType
  onEditStore: () => void
  onViewStorefront: () => void
  onManageSettings: () => void
}

export function StoreOverview({ store, onEditStore, onViewStorefront, onManageSettings }: StoreOverviewProps) {
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
                <AvatarImage src={store.logo || "/placeholder.svg"} alt={store.name} />
                <AvatarFallback className="text-lg">{store.name.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold">{store.name}</h1>
                  <Badge className={getStatusColor(store.status)}>{getStatusText(store.status)}</Badge>
                </div>
                <p className="text-muted-foreground max-w-2xl">{store.description}</p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>Catégorie: {store.category}</span>
                  <span>•</span>
                  <span>Créée le {new Date(store.createdAt).toLocaleDateString("fr-FR")}</span>
                  {store.stats.rating > 0 && (
                    <>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span>
                          {store.stats.rating} ({store.stats.reviewCount} avis)
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
            <div className="text-2xl font-bold">{store.stats.totalProducts}</div>
            <p className="text-xs text-muted-foreground">Total des produits actifs</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Commandes</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{store.stats.totalOrders}</div>
            <p className="text-xs text-muted-foreground">Commandes traitées</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenus</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{store.stats.totalRevenue.toLocaleString()} FCFA</div>
            <p className="text-xs text-muted-foreground">Revenus totaux</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Note moyenne</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{store.stats.rating > 0 ? store.stats.rating : "N/A"}</div>
            <p className="text-xs text-muted-foreground">{store.stats.reviewCount} avis clients</p>
          </CardContent>
        </Card>
      </div>

      {/* Informations de contact */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Informations de contact</CardTitle>
            <CardDescription>Coordonnées de votre boutique</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Email</label>
              <p className="text-sm">{store.contact.email}</p>
            </div>
            {store.contact.phone && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Téléphone</label>
                <p className="text-sm">{store.contact.phone}</p>
              </div>
            )}
            {store.address && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Adresse</label>
                <p className="text-sm">
                  {store.address.street}
                  {store.address.city && `, ${store.address.city}`}
                  {store.address.country && `, ${store.address.country}`}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Paramètres de la boutique</CardTitle>
            <CardDescription>Configuration actuelle de votre boutique</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Devise</label>
              <p className="text-sm">{store.settings.currency}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Langue</label>
              <p className="text-sm">{store.settings.language.toUpperCase()}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Avis clients</label>
              <p className="text-sm">{store.settings.allowReviews ? "Activés" : "Désactivés"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Approbation automatique des avis</label>
              <p className="text-sm">{store.settings.autoApproveReviews ? "Activée" : "Désactivée"}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
