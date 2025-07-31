"use client"

import { useState } from "react"
import { ProductsTopBar } from "./components/products-top-bar"
import { ProductsHeader } from "./components/products-header"
import { ProductsTable } from "./components/products-table"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useAuth } from "@/hooks/useAuthQuery"
import { useStores } from "@/hooks/useStores"
import { useParams } from "@tanstack/react-router"
import { CircleLoader } from "@/components/ui/circle-loader"

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
  const isLoading = authLoading || storesLoading
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
        <main className="flex-1 space-y-4 p-4 md:p-6" style={{ backgroundColor: "var(--p-color-bg)" }}>
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

          <div className="polaris-card">
            {/* Onglets simplifiés - maintenant gérés par le TopBar mais gardés pour l'interface */}
            <div style={{ borderBottom: "var(--p-border-width-025) solid var(--p-color-border)" }}>
              <div className="flex items-center justify-between p-4">
                <div className="polaris-tabs">
                  <div className="flex">
                    <button
                      className={`polaris-tab ${activeTab === "tous" ? "active" : ""}`}
                      onClick={() => handleTabChange("tous")}
                    >
                      Tous
                    </button>
                    <button
                      className={`polaris-tab ${activeTab === "actifs" ? "active" : ""}`}
                      onClick={() => handleTabChange("actifs")}
                    >
                      Actifs
                    </button>
                    <button
                      className={`polaris-tab ${activeTab === "brouillons" ? "active" : ""}`}
                      onClick={() => handleTabChange("brouillons")}
                    >
                      Brouillons
                    </button>
                    <button
                      className={`polaris-tab ${activeTab === "archives" ? "active" : ""}`}
                      onClick={() => handleTabChange("archives")}
                    >
                      Archivés
                    </button>
                  </div>
                </div>

                {/* Indicateurs de filtres actifs */}
                <div className="flex items-center gap-2">
                  {(filters.searchTerm || filters.category) && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">Filtres actifs:</span>
                      {filters.searchTerm && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-sm">
                          Recherche: "{filters.searchTerm}"
                        </span>
                      )}
                      {filters.category && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-sm">
                          Catégorie: {filters.category}
                        </span>
                      )}
                    </div>
                  )}
                  <span className="text-sm text-gray-500">Tri: {sortOrder === "asc" ? "A-Z" : "Z-A"}</span>
                </div>
              </div>
            </div>

            <ProductsTable activeTab={activeTab} sortOrder={sortOrder} filters={filters} />
          </div>

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
