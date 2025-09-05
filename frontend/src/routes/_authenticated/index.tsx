"use client"

import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { useStore } from "@/context/store-context"
import { useSanctumAuth } from "@/hooks/useSanctumAuth"
import { useEffect, useRef, useState } from "react"
import { OptimizedLoading } from "@/components/optimized-loading"

export const Route = createFileRoute("/_authenticated/")({
  component: AuthenticatedLayout,
})

function AuthenticatedLayout() {
  const { currentStore, stores, isLoading: storesLoading, hasLoaded } = useStore()
  const { user, isLoading: authLoading, isAuthenticated } = useSanctumAuth()
  const navigate = useNavigate()
  const hasRedirected = useRef(false)

  useEffect(() => {
    // Éviter les redirections multiples
    if (hasRedirected.current) return

    // Attendre que l'authentification soit vérifiée
    if (authLoading) return

    // Si l'utilisateur n'est pas connecté, rediriger vers la page de connexion
    if (!isAuthenticated || !user) {
      hasRedirected.current = true
      window.location.href = "/sign-in"
      return
    }

    // Attendre que les boutiques soient chargées
    if (!hasLoaded || storesLoading) return

    // Si une boutique est déjà sélectionnée, rediriger vers son dashboard
    if (currentStore) {
      hasRedirected.current = true
      navigate({ to: `/${currentStore.id}/dashboard` })
      return
    }

    // Si l'utilisateur a des boutiques mais n'en a pas sélectionné, vérifier le localStorage
    if (stores.length > 0) {
      const savedStoreId = localStorage.getItem("selectedStoreId")
      if (savedStoreId) {
        // Vérifier si la boutique existe toujours dans la liste
        const storeExists = stores.find((store) => store.id === savedStoreId)
        if (storeExists) {
          hasRedirected.current = true
          navigate({ to: `/${savedStoreId}/dashboard` })
          return
        }
      }
      // Si pas de boutique sélectionnée ou la boutique n'existe plus, aller au dashboard principal
      hasRedirected.current = true
      navigate({ to: "/dashboard" })
    } else {
      // Si l'utilisateur n'a aucune boutique, rediriger vers la sélection de boutique
      hasRedirected.current = true
      navigate({ to: "/store-selection" })
    }
  }, [authLoading, isAuthenticated, user, hasLoaded, storesLoading, currentStore, stores.length, navigate])

  // Afficher un loader discret pendant la vérification
  if (authLoading || storesLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <h3 className="text-lg font-medium text-slate-900 mb-2">Vérification en cours...</h3>
          <p className="text-slate-500">Veuillez patienter</p>
        </div>
      </div>
    )
  }

  // Si on arrive ici, c'est qu'il n'y a pas eu de redirection
  return null
}
