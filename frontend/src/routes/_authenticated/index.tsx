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
      // Si l'utilisateur n'a aucune boutique, rediriger vers la création
      hasRedirected.current = true
      window.location.href = "/create-store"
    }
  }, [authLoading, isAuthenticated, user, hasLoaded, storesLoading, currentStore, stores.length, navigate])

  // Afficher un loader optimisé pendant la vérification
  if (authLoading || storesLoading) {
    return (
      <OptimizedLoading 
        type="spinner"
        message={
          authLoading 
            ? "Vérification de votre compte..." 
            : "Chargement de vos boutiques..."
        }
      />
    )
  }

  // Si on arrive ici, c'est qu'il n'y a pas eu de redirection
  return null
}
