"use client"

import { useState } from "react"
import { Package, ChevronDown, Download, Upload, Settings } from "lucide-react"
import { useNavigate } from "@tanstack/react-router" // Importation nécessaire pour la navigation

export function ProductsHeader() {
    const navigate = useNavigate()
    const [showMoreActions, setShowMoreActions] = useState(false)


    const handleAddProduct = () => {
        // Redirige vers la nouvelle route
        navigate({ to: "/produits/addproduit" })
      }

      const handleMoreAction = (action: string) => {
        setShowMoreActions(false)
    
        switch (action) {
          case "export":
            alert("Export des produits en cours...")
            break
          case "import":
            alert("Import des produits...")
            break
          case "settings":
            break
        }
      }
    
      return (
        <div className="polaris-page-header">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Package
                  className="polaris-breadcrumb-icon"
                  style={{
                    width: "1.5rem",
                    height: "1.5rem",
                    color: "var(--p-color-icon-highlight)",
                  }}
                />
                <h1 className="polaris-page-title">Produits</h1>
              </div>
            </div>
    
            <div className="flex items-center gap-2">
              <div className="relative">
                <button
                  className="polaris-button-secondary flex items-center"
                  onClick={() => setShowMoreActions(!showMoreActions)}
                >
                  Plus d'actions
                  <ChevronDown
                    style={{
                      marginLeft: "var(--p-space-200)",
                      width: "1rem",
                      height: "1rem",
                      color: "var(--p-color-icon)",
                      transform: showMoreActions ? "rotate(180deg)" : "rotate(0deg)",
                      transition: "transform 0.2s ease",
                    }}
                  />
                </button>
    
                {showMoreActions && (
                  <div
                    className="absolute right-0 top-10 bg-white border rounded-lg shadow-lg z-10 min-w-48"
                    style={{
                      backgroundColor: "var(--p-color-bg-surface)",
                      border: "var(--p-border-width-025) solid var(--p-color-border)",
                      borderRadius: "var(--p-border-radius-300)",
                      boxShadow: "var(--p-shadow-200)",
                    }}
                  >
                    <button
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2"
                      onClick={() => handleMoreAction("export")}
                    >
                      <Download className="h-4 w-4" />
                      Exporter les produits
                    </button>
                    <button
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2"
                      onClick={() => handleMoreAction("import")}
                    >
                      <Upload className="h-4 w-4" />
                      Importer les produits
                    </button>
                    <button
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2"
                      onClick={() => handleMoreAction("settings")}
                    >
                      <Settings className="h-4 w-4" />
                      Paramètres des produits
                    </button>
                  </div>
                )}
              </div>
    
              <button
                className="polaris-button-primary hover:bg-green-700 transition-colors"
                style={{ backgroundColor: "#008060" }}
                onClick={handleAddProduct}
              >
                Ajouter un produit
              </button>
            </div>
          </div>
        </div>
      )
    }
    