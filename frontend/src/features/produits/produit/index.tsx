"use client"

import { useState, useEffect } from "react"
import { ProductsTopBar } from "./components/products-top-bar"
import { ProductsHeader } from "./components/products-header"
import { ProductListTable } from "./components/product-list-table"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useAuth } from "@/hooks/useAuthQuery"
import { useStores } from "@/hooks/useStores"
import { useParams } from "@tanstack/react-router"
import { CircleLoader } from "@/components/ui/circle-loader"
import apiService from "@/lib/api"

type TabType = "tous" | "actifs" | "brouillons" | "archives"

interface FilterState {
  searchTerm: string
  category: string
}

export default function Produits() {
  const params = useParams({ from: "/_authenticated/$storeId/produits" })
  const storeId = params.storeId
  
  // Hooks React Query
  const { data: user, isLoading: authLoading, isError: authError } = useAuth()
  const { data: stores, isLoading: storesLoading, isError: storesError } = useStores()
  
  // Trouver la boutique actuelle
  const currentStore = stores?.find(store => store.id === storeId)
  
  const [activeTab, setActiveTab] = useState<TabType>("tous")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const [filters, setFilters] = useState<FilterState>({
    searchTerm: "",
    category: "",
  })
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Charger les produits
  useEffect(() => {
    const loadProducts = async () => {
      if (!currentStore?.id) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const response = await apiService.getStoreProducts(currentStore.id)
        
        if (response.success && response.data) {
          let productsData = (response.data as any).data || response.data
          
          // Filtrer par onglet
          if (activeTab !== "tous") {
            const statusMap = {
              "actifs": "active",
              "brouillons": "draft", 
              "archives": "archived"
            }
            productsData = productsData.filter((product: any) => 
              product.status === statusMap[activeTab as keyof typeof statusMap]
            )
          }

          setProducts(productsData)
        }
      } catch (error) {
        console.error('Erreur lors du chargement des produits:', error)
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [currentStore?.id, activeTab])

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab)
  }

  const handleToggleSort = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc")
  }

  const handleApplyFilters = (newFilters: FilterState) => {
    setFilters(newFilters)
    console.log("Filtres appliqués:", newFilters)
  }

  const handleClearFilters = () => {
    const emptyFilters = { searchTerm: "", category: "" }
    setFilters(emptyFilters)
  }

  const handleBack = () => {
    window.location.href = "/"
  }

  const handleAddProduct = () => {
    if (storeId) {
      window.location.href = `/${storeId}/produits/addproduit`
    } else {
      window.location.href = "/stores"
    }
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
          message="Chargement des produits..." 
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
      {/* ProductsTopBar avec recherche dynamique */}
      <ProductsTopBar
        activeTab={activeTab}
        filters={filters}
        sortOrder={sortOrder}
        onTabChange={handleTabChange}
        onFiltersChange={handleApplyFilters}
        onClearFilters={handleClearFilters}
        onToggleSort={handleToggleSort}
        onBack={handleBack}
      />

      {/* Contenu principal avec padding-top pour compenser le TopBar fixe */}
      <div className="polaris-frame" style={{ paddingTop: "6rem" }}>
        <main className="flex-1 space-y-6 p-4 md:p-6" style={{ backgroundColor: "var(--p-color-bg)" }}>
          <ProductsHeader />

          {/* Bouton Ajouter un produit */}
          <div className="flex justify-end">
            <Button
              onClick={handleAddProduct}
              className="bg-primary hover:bg-primary/90 text-primary-foreground flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Ajouter un produit
            </Button>
          </div>

          {/* Table des produits */}
          <ProductListTable productData={products} />

          <div
            className="text-center"
            style={{
              fontSize: "var(--p-font-size-300)",
              color: "var(--p-color-text-secondary)",
            }}
          >
            En savoir plus sur les{" "}
            <a href="#" className="polaris-text-link">
              produits
            </a>
          </div>
        </main>
      </div>
    </>
  )
}
