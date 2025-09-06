"use client"

import { useState } from "react"
import { ClipboardPlus } from "lucide-react"
import { ViewStoreButton } from "@/components/ui/view-store-button"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Main } from "@/components/layout/main"
import { SearchProvider } from "@/context/search-context"
import { Overview } from "./components/overview"
import { RecentSales } from "./components/recent-sales"
import Paiement from "@/components/paiement"
import { DashboardTopBar } from "./components/dashboard-top-bar"
import { useParams, useNavigate } from "@tanstack/react-router"
import { useStoreStats } from "@/hooks/useStores"
// CircleLoader supprimé car plus de vérifications d'auth dans cette page

interface StatsData {
  revenue: {
    current: number
    previous: number
    change: number
  }
  sales: {
    current: number
    previous: number
    change: number
  }
  orders: {
    current: number
    previous: number
    change: number
  }
  
  customers: {
    current: number
    previous: number
    change: number
  }
}

export default function Dashboard() {
  const params = useParams({ from: "/_authenticated/$storeId" })
  const navigate = useNavigate()
  const storeId = params.storeId
  
  // Hooks React Query pour les données
  const { data: stats, isLoading: statsLoading } = useStoreStats(storeId || '')

  // La boutique est déjà vérifiée par AuthenticatedLayout

  // État du Dynamic Island
  const [dynamicIslandView, setDynamicIslandView] = useState<"idle" | "search" | "filter" | "actions" | "analytics" | "notifications">("idle")

  // Données par défaut si pas encore chargées
  const defaultStats: StatsData = {
    revenue: {
      current: 0,
      previous: 0,
      change: 0
    },
    sales: {
      current: 0,
      previous: 0,
      change: 0
    },
    orders: {
      current: 0,
      previous: 0,
      change: 0
    },
    customers: {
      current: 0,
      previous: 0,
      change: 0
    }
  }

  // Utiliser les vraies données ou les données par défaut avec vérification de sécurité
  const displayStats: StatsData = (stats as StatsData) || defaultStats

  // Debug: Afficher les états de chargement
  console.log('Dashboard Debug:', {
    storeId,
    storeIdType: typeof storeId,
    storeIdLength: storeId?.length,
    statsLoading,
    hasStats: !!stats,
    hasDisplayStats: !!displayStats
  })

  // Les vérifications d'auth sont faites au niveau du layout parent
  // On peut directement afficher la page avec les skeletons

  // Si les stats ne sont pas encore chargées, on affiche le dashboard avec les valeurs par défaut
  console.log('Affichage du dashboard avec les données:', displayStats)

  const handleBack = () => {
    console.log("Retour en arrière")
  }

  const handleExport = () => {
    console.log("Export des données")
  }

  const handleAddProduct = () => {
    if (storeId) {
      navigate({ to: "/_authenticated/$storeId/produits/addproduit" })
    } else {
      navigate({ to: "/stores" })
    }
  }

  const handleNavigate = (section: string) => {
    console.log("Navigation vers:", section)
  }

  // Handlers pour le Dynamic Island
  const handleDynamicIslandViewChange = (view: "idle" | "search" | "filter" | "actions" | "analytics" | "notifications") => {
    setDynamicIslandView(view)
  }

  const handleSearchTrigger = () => {
    const searchInput = document.querySelector('input[placeholder*="Rechercher"]') as HTMLInputElement
    if (searchInput) {
      searchInput.focus()
    }
  }

  const handleFilterTrigger = () => {
    console.log("Filtres déclenchés")
  }

  const handleActionsTrigger = () => {
    console.log("Actions déclenchées")
  }

  const handleAnalyticsTrigger = () => {
    console.log("Analytics déclenchés")
  }

  const handleNotificationsTrigger = () => {
    console.log("Notifications déclenchées")
  }

  return (
    <SearchProvider>
      <DashboardTopBar
        onBack={handleBack}
        onExport={handleExport}
        onAddProduct={handleAddProduct}
        onNavigate={handleNavigate}
        currentView={dynamicIslandView}
        onViewChange={handleDynamicIslandViewChange}
        onSearchTrigger={handleSearchTrigger}
        onFilterTrigger={handleFilterTrigger}
        onActionsTrigger={handleActionsTrigger}
        onAnalyticsTrigger={handleAnalyticsTrigger}
        onNotificationsTrigger={handleNotificationsTrigger}
      />
      <Main>
        {/* Contenu du dashboard */}
        <div className="mb-6 flex items-center justify-between" style={{ paddingTop: "6rem" }}>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Tableau de bord</h1>
            <p className="text-gray-600 mt-2">Gérez votre boutique et suivez vos performances</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              className="border-gray-200 text-gray-700 hover:bg-gray-50 bg-transparent"
              onClick={handleExport}
            >
              Exporter
            </Button>
            <Button
              className="bg-[oklch(0.8944_0.1931_121.75)] text-foreground hover:bg-[oklch(0.8_0.19_121)] shadow-sm"
              onClick={handleAddProduct}
            >
              <ClipboardPlus className="mr-2 h-4 w-4" />
              Ajouter un produit
            </Button>
                                <ViewStoreButton storeId={storeId || ''} />
          </div>
        </div>

        <Tabs orientation="vertical" defaultValue="overview" className="space-y-4">
          <div className="w-full overflow-x-auto pb-2">
            <TabsList className="bg-gray-50 p-1 rounded-lg">
              <TabsTrigger value="overview" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                Vue d'ensemble
              </TabsTrigger>
              <TabsTrigger value="analytics" disabled className="opacity-50">
                Analytics
              </TabsTrigger>
              <TabsTrigger value="reports" disabled className="opacity-50">
                Rapports
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card className="border-l-4" style={{ borderLeftColor: 'rgb(3, 35, 19)' }}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium" style={{ color: 'rgb(3, 35, 19)' }}>Revenus totaux</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold" style={{ color: 'rgb(3, 35, 19)' }}>
                    {displayStats?.revenue?.current || 0} FCFA
                  </div>
                  <p className="text-xs text-muted-foreground">
                    +{displayStats?.revenue?.change || 0}% par rapport au mois dernier
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Commandes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{displayStats?.orders?.current || 0}</div>
                  <p className="text-xs text-muted-foreground">+{displayStats?.orders?.change || 0}% par rapport au mois dernier</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Ventes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{displayStats?.sales?.current || 0}</div>
                  <p className="text-xs text-muted-foreground">+{displayStats?.sales?.change || 0}% par rapport au mois dernier</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Transactions actives</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{displayStats?.customers?.current || 0}</div>
                  <p className="text-xs text-muted-foreground">+{displayStats?.customers?.change || 0}% par rapport au mois dernier</p>
                </CardContent>
              </Card>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Vue d'ensemble</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                  <Overview />
                </CardContent>
              </Card>
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Ventes récentes</CardTitle>
                  <CardDescription>
                    Vous avez fait {displayStats?.sales?.current || 0} ventes ce mois.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <RecentSales />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-6">
          <Paiement />
        </div>
      </Main>
    </SearchProvider>
  )
}
