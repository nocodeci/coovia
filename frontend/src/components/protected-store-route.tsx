"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useNavigate } from "@tanstack/react-router"
import { useStore } from "@/context/store-context"
import { LoadingState, RedirectState } from "@/components/ui/loading-state"

interface ProtectedStoreRouteProps {
  children: React.ReactNode
  storeId?: string
}

export function ProtectedStoreRoute({ children, storeId }: ProtectedStoreRouteProps) {
  const { currentStore, stores, isLoading, setCurrentStore } = useStore()
  const navigate = useNavigate()
  const [isRedirecting, setIsRedirecting] = useState(false)

  useEffect(() => {
    // Early return si encore en chargement
    if (isLoading) return

    // Si aucune boutique n'est sélectionnée, rediriger vers la sélection
    if (!currentStore) {
      console.log("🚫 Aucune boutique sélectionnée, redirection vers la sélection")
      setIsRedirecting(true)
      navigate({ to: "/store-selection" })
      return
    }

    // Si un storeId est spécifié, vérifier qu'il correspond à la boutique sélectionnée
    if (storeId && currentStore.id !== storeId) {
      const storeExists = stores.find((store) => store.id === storeId)
      
      if (storeExists) {
        // Si la boutique existe mais n'est pas celle sélectionnée, la sélectionner
        console.log(`🔄 Changement de boutique: ${currentStore.id} -> ${storeId}`)
        localStorage.setItem("selectedStoreId", storeId)
        setCurrentStore(storeExists) // Mise à jour directe du contexte
        setIsRedirecting(true)
        navigate({ to: `/${storeId}/dashboard` })
      } else {
        // Si la boutique n'existe pas, rediriger vers la sélection
        console.log("🚫 Boutique inexistante, redirection vers la sélection")
        setIsRedirecting(true)
        navigate({ to: "/store-selection" })
      }
    }
  }, [isLoading, currentStore, storeId, stores, navigate, setCurrentStore])

  // Cleanup timeout pour éviter le double rendu
  useEffect(() => {
    let timeout: NodeJS.Timeout
    if (isRedirecting) {
      timeout = setTimeout(() => {
        // Cleanup si nécessaire après redirection
        console.log("🧹 Cleanup après redirection")
      }, 200)
    }
    return () => clearTimeout(timeout)
  }, [isRedirecting])

  // Afficher un loader pendant la vérification
  if (isLoading) {
    return <LoadingState message="Vérification de la boutique..." />
  }

  // Afficher un état de redirection au lieu de null
  if (isRedirecting || !currentStore || (storeId && currentStore.id !== storeId)) {
    return (
      <RedirectState 
        message={isRedirecting ? "Redirection en cours..." : "Vérification de la boutique..."} 
      />
    )
  }

  // Si tout est correct, afficher le contenu
  return <>{children}</>
}
