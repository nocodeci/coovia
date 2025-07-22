"use client"

import { useState } from "react"
import { ProductsTopBar } from "./components/products-top-bar"
import { ProductsHeader } from "./components/products-header"
import { ProductsTable } from "./components/products-table"

type TabType = "tous" | "actifs" | "brouillons" | "archives"

interface FilterState {
  searchTerm: string
  category: string
}

export default function Produits() {
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
