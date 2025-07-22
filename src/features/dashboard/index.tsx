"use client"

import { ClipboardPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Main } from "@/components/layout/main"
import { SearchProvider } from "@/context/search-context"
import { Overview } from "./components/overview"
import { RecentSales } from "./components/recent-sales"
import Paiement from "@/components/paiement"
import { mockTransactions } from "@/data/mock-transactions"
import { useMemo } from "react"
import { DashboardTopBar } from "./components/dashboard-top-bar"

export default function Dashboard() {
  // Calculer les statistiques basées sur les vraies données de paiement
  const stats = useMemo(() => {
    const now = new Date()
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())
    const lastHour = new Date(now.getTime() - 60 * 60 * 1000)

    // Transactions du mois actuel
    const currentMonthTransactions = mockTransactions.filter((transaction) => {
      const transactionDate = new Date(transaction.joinDate)
      return transactionDate >= lastMonth
    })

    // Transactions du mois précédent
    const previousMonth = new Date(now.getFullYear(), now.getMonth() - 2, now.getDate())
    const previousMonthTransactions = mockTransactions.filter((transaction) => {
      const transactionDate = new Date(transaction.joinDate)
      return transactionDate >= previousMonth && transactionDate < lastMonth
    })

    // Revenus totaux (paiements réussis uniquement)
    const currentMonthRevenue = currentMonthTransactions
      .filter((t) => t.status === "Succès")
      .reduce((sum, t) => sum + t.value, 0)
    const previousMonthRevenue = previousMonthTransactions
      .filter((t) => t.status === "Succès")
      .reduce((sum, t) => sum + t.value, 0)
    const revenueGrowth =
      previousMonthRevenue > 0 ? ((currentMonthRevenue - previousMonthRevenue) / previousMonthRevenue) * 100 : 100

    // Total des transactions (abonnements)
    const currentMonthTotal = currentMonthTransactions.length
    const previousMonthTotal = previousMonthTransactions.length
    const totalGrowth =
      previousMonthTotal > 0 ? ((currentMonthTotal - previousMonthTotal) / previousMonthTotal) * 100 : 100

    // Ventes réussies
    const currentMonthSales = currentMonthTransactions.filter((t) => t.status === "Succès").length
    const previousMonthSales = previousMonthTransactions.filter((t) => t.status === "Succès").length
    const salesGrowth =
      previousMonthSales > 0 ? ((currentMonthSales - previousMonthSales) / previousMonthSales) * 100 : 100

    // Transactions actives (En Attente + Initié)
    const activeTransactions = mockTransactions.filter((t) => t.status === "En Attente" || t.status === "Initié").length

    // Nouvelles transactions depuis la dernière heure
    const recentTransactions = mockTransactions.filter((transaction) => {
      const transactionDate = new Date(transaction.joinDate)
      return transactionDate >= lastHour
    }).length

    return {
      revenue: {
        current: currentMonthRevenue,
        growth: revenueGrowth,
      },
      subscriptions: {
        current: currentMonthTotal,
        growth: totalGrowth,
      },
      sales: {
        current: currentMonthSales,
        growth: salesGrowth,
      },
      active: {
        current: activeTransactions,
        recent: recentTransactions,
      },
    }
  }, [])

  const handleBack = () => {
    console.log("Retour en arrière")
  }

  const handleExport = () => {
    console.log("Export des données")
  }

  const handleAddProduct = () => {
    window.location.href = "/add-product"
  }

  const handleNavigate = (section: string) => {
    console.log("Navigation vers:", section)
    // Ici vous pouvez implémenter la navigation vers différentes sections
  }

  return (
    <SearchProvider>
      {/* ===== TopBar avec recherche dynamique ===== */}
      <DashboardTopBar
        onBack={handleBack}
        onExport={handleExport}
        onAddProduct={handleAddProduct}
        onNavigate={handleNavigate}
      />

      {/* ===== Main ===== */}
      <Main>
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
          </div>
        </div>

        <Tabs orientation="vertical" defaultValue="overview" className="space-y-4">
          <div className="w-full overflow-x-auto pb-2">
            <TabsList className="bg-gray-50 p-1 rounded-lg">
              <TabsTrigger value="overview" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                Vue d'ensemble
              </TabsTrigger>
              <TabsTrigger value="analytics" disabled className="opacity-50">
                Analyse
              </TabsTrigger>
              <TabsTrigger value="reports" disabled className="opacity-50">
                Rapports
              </TabsTrigger>
              <TabsTrigger value="notifications" disabled className="opacity-50">
                Notifications
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <Card className="bg-[oklch(0.2274_0.0492_157.66)] text-[oklch(1_0_0)] border-none shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="text-[oklch(1_0_0)] h-4 w-4"
                  >
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.revenue.current.toLocaleString()} CFA</div>
                  <p className="text-[oklch(1_0_0)] text-xs opacity-80">
                    {stats.revenue.growth >= 0 ? "+" : ""}
                    {stats.revenue.growth.toFixed(1)}% du mois dernier
                  </p>
                </CardContent>
              </Card>

              <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Transactions</CardTitle>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="text-muted-foreground h-4 w-4"
                  >
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">+{stats.subscriptions.current}</div>
                  <p className="text-muted-foreground text-xs">
                    {stats.subscriptions.growth >= 0 ? "+" : ""}
                    {stats.subscriptions.growth.toFixed(1)}% du mois dernier
                  </p>
                </CardContent>
              </Card>

              <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Ventes</CardTitle>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="text-muted-foreground h-4 w-4"
                  >
                    <rect width="20" height="14" x="2" y="5" rx="2" />
                    <path d="M2 10h20" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">+{stats.sales.current}</div>
                  <p className="text-muted-foreground text-xs">
                    {stats.sales.growth >= 0 ? "+" : ""}
                    {stats.sales.growth.toFixed(1)}% du mois dernier
                  </p>
                </CardContent>
              </Card>

              <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Actif maintenant</CardTitle>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="text-muted-foreground h-4 w-4"
                  >
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">+{stats.active.current}</div>
                  <p className="text-muted-foreground text-xs">+{stats.active.recent} depuis la dernière heure</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-7">
              <Card className="col-span-1 lg:col-span-4 shadow-sm">
                <CardHeader>
                  <CardTitle>Vue d'ensemble</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                  <Overview />
                </CardContent>
              </Card>

              <Card className="col-span-1 lg:col-span-3 shadow-sm">
                <CardHeader>
                  <CardTitle>Ventes récentes</CardTitle>
                  <CardDescription>Vous avez réalisé {stats.sales.current} ventes ce mois-ci.</CardDescription>
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
