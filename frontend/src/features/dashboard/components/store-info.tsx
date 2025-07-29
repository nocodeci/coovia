"use client"

import { Store, Package, ShoppingCart, DollarSign, Users, TrendingUp } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useStore } from "@/context/store-context"

export function StoreInfo() {
  const { currentStore } = useStore()

  if (!currentStore) return null

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

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case "enterprise":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "professional":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "starter":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getPlanText = (plan: string) => {
    switch (plan) {
      case "enterprise":
        return "Enterprise"
      case "professional":
        return "Professionnel"
      case "starter":
        return "Débutant"
      default:
        return plan
    }
  }

  return (
    <div className="space-y-6">
      {/* Informations de la boutique */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={currentStore.logo || "/placeholder.svg"} alt={currentStore.name} />
              <AvatarFallback className="text-lg">{currentStore.name.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <CardTitle className="text-2xl">{currentStore.name}</CardTitle>
                <Badge className={getStatusColor(currentStore.status)}>
                  {getStatusText(currentStore.status)}
                </Badge>
                <Badge className={getPlanColor(currentStore.plan)}>
                  {getPlanText(currentStore.plan)}
                </Badge>
              </div>
              <CardDescription className="text-base">{currentStore.description}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">{currentStore.stats.totalProducts}</p>
                <p className="text-xs text-muted-foreground">Produits</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">{currentStore.stats.totalOrders}</p>
                <p className="text-xs text-muted-foreground">Commandes</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">{currentStore.stats.totalCustomers}</p>
                <p className="text-xs text-muted-foreground">Clients</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">{currentStore.stats.conversionRate}%</p>
                <p className="text-xs text-muted-foreground">Taux de conversion</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistiques détaillées */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenus totaux</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentStore.stats.totalRevenue.toLocaleString()} FCFA</div>
            <p className="text-xs text-muted-foreground">
              Valeur moyenne: {currentStore.stats.averageOrderValue.toLocaleString()} FCFA
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Performance</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentStore.stats.conversionRate}%</div>
            <p className="text-xs text-muted-foreground">Taux de conversion</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contact</CardTitle>
            <Store className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <p className="text-sm">{currentStore.contact.email}</p>
              <p className="text-sm">{currentStore.contact.phone}</p>
              <p className="text-xs text-muted-foreground">
                {currentStore.contact.address.city}, {currentStore.contact.address.country}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}