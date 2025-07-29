"use client"

import { createFileRoute, notFound } from "@tanstack/react-router"
import { StoreDashboard } from "@/components/StoreDashboard"
import { useStore } from "@/context/store-context"
import { useEffect } from "react"

export const Route = createFileRoute("/_authenticated/dashboard/$storeId")({
  beforeLoad: ({ params }) => {
    // Valider que storeId est présent
    if (!params.storeId) {
      throw notFound()
    }
  },
  component: StoreDashboardPage,
})

function StoreDashboardPage() {
  const { storeId } = Route.useParams()
  const { stores, setCurrentStore, currentStore } = useStore()

  useEffect(() => {
    // Trouver la boutique correspondante et la définir comme courante
    const store = stores.find((s) => s.id === storeId)
    if (store && (!currentStore || currentStore.id !== storeId)) {
      setCurrentStore(store)
    }
  }, [storeId, stores, currentStore, setCurrentStore])

  // Vérifier que la boutique existe
  const store = stores.find((s) => s.id === storeId)
  if (!store) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Boutique non trouvée</h1>
          <p className="text-muted-foreground mb-4">
            La boutique que vous recherchez n'existe pas ou vous n'y avez pas accès.
          </p>
          <a href="/select-store" className="text-primary hover:underline">
            Retourner à la sélection des boutiques
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <StoreDashboard
        storeId={storeId}
        onEditStore={() => {
         
          console.log("Edit store:", storeId)
        }}
        onViewStorefront={() => {
         
          window.open(`/storefront/${store.slug}`, "_blank")
        }}
        onManageSettings={() => {
         
          console.log("Manage settings:", storeId)
        }}
      />
    </div>
  )
}
