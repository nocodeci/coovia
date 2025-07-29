"use client"

import { useStore } from "@/context/store-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  TrendingUp, 
  Users, 
  ShoppingCart, 
  DollarSign,
  TrendingDown
} from "lucide-react"
import React from "react"

export default function Dashboard() {
  const { currentStore } = useStore()

  if (!currentStore) {
    return null
  }

  // Données mockées pour l'instant
  const mockStats = [
    {
      title: "Revenus Totaux",
      value: `${currentStore.stats?.totalRevenue?.toLocaleString('fr-FR') || 0} FCFA`,
      description: "Revenus de tous les temps",
      icon: DollarSign,
      trend: 12.5,
      trendLabel: "vs mois dernier"
    },
    {
      title: "Commandes",
      value: currentStore.stats?.totalOrders?.toString() || "0",
      description: "Total des commandes",
      icon: ShoppingCart,
      trend: 8.3,
      trendLabel: "vs mois dernier"
    },
    {
      title: "Ventes",
      value: "38",
      description: "Total des ventes",
      icon: TrendingUp,
      trend: 15.2,
      trendLabel: "vs mois dernier"
    },
    {
      title: "Clients Actifs",
      value: currentStore.stats?.totalCustomers?.toString() || "0",
      description: "Clients récents",
      icon: Users,
      trend: 0,
      trendLabel: "vs mois dernier"
    }
  ]

  return (
    <div className="space-y-4 p-4 md:p-8 pt-6">
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Rapports</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {mockStats.map((stat, index) => (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.title}
                  </CardTitle>
                  <stat.icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">
                    {stat.description}
                  </p>
                  {stat.trend !== 0 && (
                    <div className="flex items-center text-xs mt-1">
                      {stat.trend > 0 ? (
                        <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                      ) : (
                        <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
                      )}
                      <span className={stat.trend > 0 ? "text-green-500" : "text-red-500"}>
                        {Math.abs(stat.trend)}%
                      </span>
                      <span className="text-muted-foreground ml-1">
                        {stat.trendLabel}
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Recent Orders */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Commandes Récentes</CardTitle>
                <CardDescription>
                  Les dernières commandes de votre boutique
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center py-4">
                  Aucune commande récente
                </p>
              </CardContent>
            </Card>

            {/* Store Overview */}
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Vue d'ensemble</CardTitle>
                <CardDescription>
                  Statistiques générales de votre boutique
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Produits</span>
                    <span className="font-medium">
                      {currentStore.stats?.totalProducts || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Commandes</span>
                    <span className="font-medium">
                      {currentStore.stats?.totalOrders || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Revenus</span>
                    <span className="font-medium">
                      {currentStore.stats?.totalRevenue?.toLocaleString('fr-FR') || 0} FCFA
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Clients</span>
                    <span className="font-medium">
                      {currentStore.stats?.totalCustomers || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Taux de conversion</span>
                    <span className="font-medium">
                      {currentStore.stats?.conversionRate || 0}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Panier moyen</span>
                    <span className="font-medium">
                      {currentStore.stats?.averageOrderValue?.toLocaleString('fr-FR') || 0} FCFA
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Analytics</CardTitle>
              <CardDescription>
                Graphiques et analyses détaillées
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Les graphiques et analyses seront affichés ici.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Rapports</CardTitle>
              <CardDescription>
                Rapports détaillés et exports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Les rapports seront affichés ici.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
