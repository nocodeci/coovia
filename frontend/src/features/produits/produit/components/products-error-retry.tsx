import React from "react"
import { ErrorRetrySection } from "@/components/ui/retry-button"

interface ProductsErrorRetryProps {
  onRetry: () => void
  loading?: boolean
  error?: string
}

export function ProductsErrorRetry({ 
  onRetry, 
  loading = false, 
  error 
}: ProductsErrorRetryProps) {
  return (
    <ErrorRetrySection
      title="Impossible de charger les produits"
      description={error || "Une erreur est survenue lors du chargement des produits. Vérifiez votre connexion et réessayez."}
      onRetry={onRetry}
      loading={loading}
      className="py-8"
    />
  )
}
