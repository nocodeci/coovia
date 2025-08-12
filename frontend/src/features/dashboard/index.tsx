"use client"

import { useState } from "react"
import { ClipboardPlus, Store } from "lucide-react"
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
import { useSanctumAuth } from "@/hooks/useSanctumAuth"
import { useStores, useStoreStats } from "@/hooks/useStores"
import { CircleLoader } from "@/components/ui/circle-loader"

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
  
  // Hooks React Query pour les vraies données
  const { user, isLoading: authLoading } = useSanctumAuth()
  const { data: stores, isLoading: storesLoading } = useStores()
  const { data: stats, isLoading: statsLoading } = useStoreStats(storeId || '')
  
  // État de chargement global
  const isLoading = authLoading || storesLoading || statsLoading

  // Trouver la vraie boutique actuelle
  const currentStore = stores?.find(store => store.id === storeId)

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
    isLoading,
    authLoading,
    storesLoading,
    statsLoading,
    hasStats: !!stats,
    hasDisplayStats: !!displayStats,
    stores: stores?.map(s => ({ id: s.id, name: s.name }))
  })

  // Afficher le CircleLoader seulement pendant le chargement initial
  if (authLoading || storesLoading) {
    console.log('Affichage du CircleLoader - chargement auth/stores')
    return (
      <div className="min-h-screen flex items-center justify-center">
        <CircleLoader size="lg" message="Chargement du dashboard..." />
      </div>
    )
  }

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
      window.location.href = `/${storeId}/produits/addproduit`
    } else {
      window.location.href = "/stores"
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
                    <Button
          variant="outline"
          onClick={async () => {
            console.log('Navigating to boutique-client with storeId:', storeId)
            console.log('Current URL:', window.location.href)
            if (!storeId) {
              console.error('storeId is undefined or null')
              return
            }
            
            try {
              // Récupérer le slug de la boutique depuis l'API
              const response = await fetch(`http://localhost:8000/api/boutique/slug/${storeId}`)
              if (response.ok) {
                const storeData = await response.json()
                const storeSlug = storeData.slug
                console.log('Store slug from API:', storeSlug)
                
                // Rediriger vers l'application boutique-client
                const boutiqueClientUrl = `http://localhost:3000/${storeSlug}`
                console.log('Boutique Client URL:', boutiqueClientUrl)
                
                // Ouvrir dans un nouvel onglet
                window.open(boutiqueClientUrl, '_blank')
              } else {
                console.error('Erreur lors de la récupération du slug de la boutique')
                // Fallback vers store-123
                window.open('http://localhost:3000/store-123', '_blank')
              }
            } catch (error) {
              console.error('Erreur lors de la récupération du slug:', error)
              // Fallback vers store-123
              window.open('http://localhost:3000/store-123', '_blank')
            }
          }}
        >
          <Store className="mr-2 h-4 w-4" />
          Voir la boutique
        </Button>
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
                  <CardDescription>Vous avez fait {displayStats?.sales?.current || 0} ventes ce mois.</CardDescription>
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
