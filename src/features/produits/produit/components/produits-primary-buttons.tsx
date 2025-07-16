"use client"

import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useNavigate } from "@tanstack/react-router" // Importation nécessaire pour la navigation

export function ProduitsPrimaryButtons() {
  const navigate = useNavigate()

  const handleAddProduct = () => {
    // Redirige vers la nouvelle route
    navigate({ to: "/produits/addproduit" })
  }

  return (
    <div className="flex items-center space-x-2">
      <Button
        onClick={handleAddProduct} // Attache le gestionnaire de clic
        size="sm"
        className="bg-[oklch(0.8944_0.1931_121.75)] text-foreground hover:bg-[oklch(0.8_0.19_121)]"
      >
        <Plus className="mr-2 h-4 w-4" />
        Ajouter un produit
      </Button>
    </div>
  )
}