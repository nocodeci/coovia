"use client"

import { useEffect } from "react"
import { useParams } from "@tanstack/react-router"
import { useStore } from "@/context/store-context"
import Dashboard from "./index"

export function StoreDashboard() {
  const { storeId } = useParams({ from: "/_authenticated/stores/$storeId/dashboard" })
  const { stores, currentStore, setCurrentStore } = useStore()

  useEffect(() => {
    // Trouver la boutique correspondante à l'ID dans l'URL
    const store = stores.find((s) => s.id === storeId)
    if (store && (!currentStore || currentStore.id !== storeId)) {
      setCurrentStore(store)
    }
  }, [storeId, stores, currentStore, setCurrentStore])

  // Si la boutique n'existe pas, afficher une erreur
  if (!stores.find((s) => s.id === storeId)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Boutique introuvable</h1>
          <p className="text-gray-600 mb-4">La boutique que vous recherchez n'existe pas ou vous n'y avez pas accès.</p>
          <button
            onClick={() => window.location.href = "/"}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retour au dashboard
          </button>
        </div>
      </div>
    )
  }

  // Si la boutique n'est pas encore chargée, afficher un loader
  if (!currentStore || currentStore.id !== storeId) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de la boutique...</p>
        </div>
      </div>
    )
  }

  return <Dashboard />
}