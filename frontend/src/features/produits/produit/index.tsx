"use client"

import { useState, useEffect } from "react"
import { ProductsTopBar } from "./components/products-top-bar"
import { ProductsHeader } from "./components/products-header"
import { ProductListTable } from "./components/product-list-table"
import { ProductHeaderSkeleton } from "./components/product-table-skeleton"
import { Button } from "@/components/ui/button"
import { AccessibleButton } from "@/components/ui/accessible-button"
import { AccessibleTableSkeleton } from "@/components/ui/accessible-skeleton"
// ErrorRetrySection supprimé car les vérifications sont faites au layout parent
import { ProductsErrorRetry } from "./components/products-error-retry"
import { Plus } from "lucide-react"
// Les vérifications d'auth sont faites au niveau du layout parent
import { useProducts } from "@/hooks/useProducts"
import { useStore } from "@/context/store-context"
import { useParams, useNavigate } from "@tanstack/react-router"
// CircleLoader supprimé car plus de vérifications d'auth dans cette page

type TabType = "tous" | "actifs" | "brouillons" | "archives"

interface FilterState {
  searchTerm: string
  category: string
}

export default function Produits() {
  const params = useParams({ from: "/_authenticated/$storeId/produits" })
  const storeId = params.storeId
  const navigate = useNavigate()
  
  // Les vérifications d'auth sont faites au niveau du layout parent
  // On récupère seulement la boutique actuelle depuis le contexte
  const { currentStore } = useStore()
  
  const [activeTab, setActiveTab] = useState<TabType>("tous")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const [filters, setFilters] = useState<FilterState>({
    searchTerm: "",
    category: "",
  })

  // Hook React Query pour les produits avec filtres côté backend
  const { 
    data: productsData, 
    isLoading: productsLoading, 
    isError: productsError,
    error: productsErrorDetails,
    refetch: refetchProducts
  } = useProducts(storeId, {
    search: filters.searchTerm,
    category: filters.category,
    status: activeTab === "tous" ? undefined : activeTab === "actifs" ? "active" : activeTab === "brouillons" ? "draft" : "archived",
    sortBy: "created_at", // Tri par défaut
    sortOrder: sortOrder
  })

  // Extraire les produits des données
  const products = productsData?.data || []

  // Note: Les erreurs de produits sont gérées via ProductsErrorRetry dans le rendu
  // Pas besoin de toast pour éviter la redondance

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
    navigate({ to: "/" })
  }

  const handleAddProduct = () => {
    if (storeId) {
      navigate({ to: "/_authenticated/$storeId/produits/addproduit" })
    } else {
      navigate({ to: "/stores" })
    }
  }

  // Les vérifications d'auth et de boutique sont faites au niveau du layout parent
  // On peut directement afficher la page avec les skeletons

  return (
    <>
      {/* ProductsTopBar - toujours affiché pour une UX fluide */}
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
          {productsLoading ? (
            <ProductHeaderSkeleton />
          ) : (
            <ProductsHeader />
          )}

          {/* Bouton Ajouter un produit */}
          <div className="flex justify-end">
            <AccessibleButton
              onClick={handleAddProduct}
              className="bg-primary hover:bg-primary/90 text-primary-foreground flex items-center gap-2"
              aria-label="Ajouter un nouveau produit"
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
              Ajouter un produit
            </AccessibleButton>
          </div>

          {/* Table des produits avec skeleton loading */}
          {productsLoading ? (
            <AccessibleTableSkeleton rows={5} columns={6} />
          ) : productsError ? (
            <ProductsErrorRetry
              onRetry={() => refetchProducts()}
              loading={productsLoading}
              error={productsErrorDetails?.message}
            />
          ) : (
            <>
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
            </>
          )}
        </main>
      </div>
    </>
  )
}
