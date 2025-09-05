"use client"

import { useState, useEffect } from "react"
import { OrderListTable } from "./components/order-list-table"
import OrderStatsCard from "./components/order-stats-card"
import { CommandesTopBar } from "./components/commandes-top-bar"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useAuth } from "@/hooks/useAuthQuery"
import { useStores } from "@/hooks/useStores"
import { CircleLoader } from "@/components/ui/circle-loader"
import { toast } from "sonner"

interface CommandesProps {
  storeId: string
}

function Commandes({ storeId }: CommandesProps) {
  // Hooks React Query
  const { data: user, isLoading: authLoading, isError: authError } = useAuth()
  const { data: stores, isLoading: storesLoading, isError: storesError } = useStores()
  
  // Trouver la boutique actuelle
  const currentStore = stores?.find(store => store.id === storeId)
  
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [orderStats, setOrderStats] = useState({
    cancelled: 0,
    downloaded: 0,
    totalRevenue: 0,
    totalOrders: 0
  })
  
  // État du Dynamic Island
  const [dynamicIslandView, setDynamicIslandView] = useState<"idle" | "search" | "filter" | "actions" | "analytics" | "notifications">("idle")

  // Charger les commandes
  useEffect(() => {
    const loadOrders = async () => {
      if (!currentStore?.id) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        // Simulation de données de commandes
        const mockOrders = [
          {
            id: 1,
            order_number: "ORD-001",
            customer_name: "Jean Dupont",
            customer_email: "jean.dupont@email.com",
            status: "downloaded",
            payment_method: "card",
            total_amount: 25000,
            items_count: 3,
            created_at: "2024-01-15T10:30:00Z"
          },
          {
            id: 2,
            order_number: "ORD-002",
            customer_name: "Marie Martin",
            customer_email: "marie.martin@email.com",
            status: "downloaded",
            payment_method: "mobile_money",
            total_amount: 15000,
            items_count: 2,
            created_at: "2024-01-14T14:20:00Z"
          },
          {
            id: 3,
            order_number: "ORD-003",
            customer_name: "Pierre Durand",
            customer_email: "pierre.durand@email.com",
            status: "downloaded",
            payment_method: "cash",
            total_amount: 45000,
            items_count: 5,
            created_at: "2024-01-13T09:15:00Z"
          },
          {
            id: 4,
            order_number: "ORD-004",
            customer_name: "Sophie Bernard",
            customer_email: "sophie.bernard@email.com",
            status: "downloaded",
            payment_method: "bank_transfer",
            total_amount: 32000,
            items_count: 4,
            created_at: "2024-01-12T16:45:00Z"
          },
          {
            id: 5,
            order_number: "ORD-005",
            customer_name: "Lucas Petit",
            customer_email: "lucas.petit@email.com",
            status: "cancelled",
            payment_method: "card",
            total_amount: 18000,
            items_count: 2,
            created_at: "2024-01-11T11:20:00Z"
          }
        ]

        setOrders(mockOrders)
        
        // Calculer les statistiques des commandes
        const stats = {
          cancelled: mockOrders.filter(order => order.status === 'cancelled').length,
          downloaded: mockOrders.filter(order => order.status === 'downloaded').length,
          totalRevenue: mockOrders.reduce((sum, order) => sum + order.total_amount, 0),
          totalOrders: mockOrders.length
        }
        setOrderStats(stats)
      } catch (error) {
        console.error('Erreur lors du chargement des commandes:', error)
      } finally {
        setLoading(false)
      }
    }

    loadOrders()
  }, [currentStore?.id])

  const handleAddOrder = () => {
    if (storeId) {
      window.location.href = `/${storeId}/commandes/nouvelle`
    } else {
      window.location.href = "/stores"
    }
  }

  const handleBack = () => {
    if (storeId) {
      window.location.href = `/${storeId}/dashboard`
    } else {
      window.location.href = "/store-selection"
    }
  }

  const handleExport = () => {
    console.log("Export des commandes")
    // La logique d'export est maintenant gérée dans le Dynamic Island
  }

  const handleNavigate = (section: string) => {
    if (storeId) {
      window.location.href = `/${storeId}/${section}`
    } else {
      window.location.href = "/store-selection"
    }
  }

  // Handlers pour le Dynamic Island
  const handleDynamicIslandViewChange = (view: "idle" | "search" | "filter" | "actions" | "analytics" | "notifications") => {
    setDynamicIslandView(view)
  }

  const handleSearchTrigger = () => {
    // Focus sur la barre de recherche de la table
    const searchInput = document.querySelector('input[placeholder*="Rechercher"]') as HTMLInputElement
    if (searchInput) {
      searchInput.focus()
    }
  }

  const handleFilterTrigger = () => {
    // Ouvrir les filtres de la table
    const filterButton = document.querySelector('button[class*="Filter"]') as HTMLButtonElement
    if (filterButton) {
      filterButton.click()
    }
  }

  const handleActionsTrigger = () => {
    // Focus sur les actions de la table
    console.log("Actions triggered")
  }

  const handleExportTrigger = () => {
    // Déclencher l'export dans le Dynamic Island
    setTimeout(() => {
      const exportButton = document.querySelector('[data-export-button]') as HTMLButtonElement
      if (exportButton) {
        exportButton.click()
      }
    }, 100)
  }

  const handleDynamicIslandTrigger = (view: "search" | "filter" | "actions" | "analytics" | "notifications") => {
    setDynamicIslandView(view)
  }

  const handleAnalyticsTrigger = () => {
    // Scroll vers les statistiques
    const statsCard = document.querySelector('[data-stats-card]')
    if (statsCard) {
      statsCard.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleNotificationsTrigger = () => {
    // Simuler une nouvelle notification
    toast.success("Nouvelle commande reçue", {
      description: "ORD-006 • Jean Dupont • 25 000 FCFA"
    })
  }

  // États de chargement et d'erreur
  const isLoading = authLoading || storesLoading || loading
  const isError = authError || storesError

  // Vérifications avant affichage
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <CircleLoader 
          size="lg" 
          message="Préparation des commandes..." 
        />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-destructive text-lg font-semibold mb-2">Erreur</div>
          <div className="text-muted-foreground">
            {authError ? "Erreur d'authentification" : "Erreur de chargement des boutiques"}
          </div>
          <Button 
            onClick={() => window.location.reload()}
            className="mt-4"
          >
            Réessayer
          </Button>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-destructive text-lg font-semibold mb-2">Accès refusé</div>
          <div className="text-muted-foreground">Vous devez être connecté pour accéder à cette page.</div>
        </div>
      </div>
    )
  }

  if (!currentStore) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-destructive text-lg font-semibold mb-2">Aucune boutique sélectionnée</div>
          <div className="text-muted-foreground">Veuillez sélectionner une boutique pour continuer.</div>
          <Button 
            onClick={() => window.location.href = "/store-selection"}
            className="mt-4"
          >
            Sélectionner une boutique
          </Button>
        </div>
      </div>
    )
  }

  return (
    <>
      <CommandesTopBar
        onBack={handleBack}
        onExport={handleExport}
        onAddOrder={handleAddOrder}
        onNavigate={handleNavigate}
        currentView={dynamicIslandView}
        onViewChange={handleDynamicIslandViewChange}
        onSearchTrigger={handleSearchTrigger}
        onFilterTrigger={handleFilterTrigger}
        onActionsTrigger={handleExportTrigger}
        onAnalyticsTrigger={handleAnalyticsTrigger}
        onNotificationsTrigger={handleNotificationsTrigger}
      />
      
      {/* Contenu principal avec padding-top pour compenser le TopBar fixe */}
      <div className="polaris-frame" style={{ paddingTop: "6rem" }}>
        <main className="flex-1 space-y-6 p-4 md:p-6" style={{ backgroundColor: "var(--p-color-bg)" }}>
          
          {/* Header de la page */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Commandes</h1>
              <p className="text-gray-600 mt-1">Gérez les commandes de votre boutique</p>
            </div>
            
            {/* Bouton Ajouter une commande */}
            <Button
              onClick={handleAddOrder}
              className="bg-primary hover:bg-primary/90 text-primary-foreground flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Nouvelle commande
            </Button>
          </div>

          {/* Statistiques des commandes */}
          <OrderStatsCard stats={orderStats} />

          {/* Table des commandes */}
          <OrderListTable 
            orderData={orders} 
            onDynamicIslandTrigger={handleDynamicIslandTrigger}
          />

          <div
            className="text-center"
            style={{
              fontSize: "var(--p-font-size-300)",
              color: "var(--p-color-text-secondary)",
            }}
          >
            En savoir plus sur les{" "}
            <a href="#" className="polaris-text-link">
              commandes
            </a>
          </div>
        </main>
      </div>
    </>
  )
}

export default Commandes 