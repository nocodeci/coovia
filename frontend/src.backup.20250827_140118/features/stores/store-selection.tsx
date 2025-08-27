"use client"

import { useEffect, useMemo, useState } from "react"
import { useNavigate } from "@tanstack/react-router"
import { LogOut, Plus, RefreshCw, ArrowRight, Building2, Search, X } from 'lucide-react'

import { useAuth } from "@/context/auth-context"
import { useStore } from "@/context/store-context"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Spinner } from "@/components/ui/shadcn-io/spinner"
import { toast } from "sonner"

// Import du nouveau système de chargement unifié
import { 
  UnifiedPageWrapper, 
  LoadingIndicator
} from '@/components/unified-loading'

type Store = {
  id: string
  name: string
  description?: string
}

export function StoreSelection() {
  const navigate = useNavigate()
  const { user, logout, refreshAuth } = useAuth()
  const { stores, setCurrentStore, isLoading, error, refreshStores } = useStore()

  const [selectedStoreId, setSelectedStoreId] = useState<string | null>(null)
  const [query, setQuery] = useState("")

  // Tous les hooks doivent être appelés en premier
  const filteredStores = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return stores
    return stores.filter((s: Store) => {
      const name = s.name?.toLowerCase() || ""
      const desc = s.description?.toLowerCase() || ""
      return name.includes(q) || desc.includes(q)
    })
  }, [stores, query])

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((w) => w.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2)

  // Auth check + petit refresh si aucune boutique après 1s
  useEffect(() => {
    // Si pas d'utilisateur authentifié, rediriger immédiatement
    if (!user) {
      navigate({ to: "/sign-in" })
      return
    }
    
    // Si on a un utilisateur, continuer normalement
    if (user) {
      const t = setTimeout(() => {
        if (stores.length === 0 && !isLoading && !error) {
          refreshStores()
        }
      }, 1000)
      return () => clearTimeout(t)
    }
  }, [user, navigate, stores.length, isLoading, error, refreshStores])

  const handleStoreSelect = async (storeId: string) => {
    try {
      setSelectedStoreId(storeId)
      const selected = stores.find((s: Store) => s.id === storeId)
      if (selected) {
        setCurrentStore(selected)
        toast.success("Boutique sélectionnée", {
          description: `Bienvenue dans ${selected.name}`,
        })
        navigate({ to: `/${storeId}/dashboard` })
      } else {
        console.error("❌ Boutique non trouvée pour l'ID:", storeId)
        setSelectedStoreId(null)
      }
    } catch (err) {
      console.error("🚨 Erreur lors de la sélection:", err)
      toast.error("Erreur", { description: "Impossible de sélectionner cette boutique" })
      setSelectedStoreId(null)
    }
  }

  const handleLogout = () => {
    logout()
    navigate({ to: "/sign-in" })
  }

  const handleRefresh = async () => {
    try {
      // Rafraîchir l'authentification d'abord
      await refreshAuth()
      // Puis rafraîchir les boutiques
      await refreshStores()
      toast.success("Données rechargées")
    } catch {
      toast.error("Erreur lors du rechargement")
    }
  }

  // Si pas d'utilisateur, afficher un loader de vérification
  if (!user) {
    const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null
    
    // Si on a un token mais pas d'utilisateur, c'est probablement en cours de vérification
    if (token) {
      return (
        <div className="min-h-screen bg-background grid place-items-center p-4">
          <Card className="w-full max-w-md rounded-2xl">
            <CardContent className="p-8">
              <div className="flex flex-col items-center gap-4">
                <Spinner variant="infinite" size={32} />
                <p className="text-sm text-muted-foreground">Vérification de l'authentification...</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    }
    
    // Si pas de token, rediriger vers la connexion
    return null
  }

  return (
    <UnifiedPageWrapper
      data={stores}
      isLoading={isLoading}
      error={error}
      cacheKey="store-selection"
      resourceKey="stores"
      loadingMessage="Récupération de vos boutiques..."
      loadingType="skeleton"
    >
      <div className="min-h-screen bg-background grid place-items-center p-4">
        <Card className="w-full max-w-3xl rounded-2xl">
          <CardHeader className="text-center pb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Building2 className="h-6 w-6 text-primary" />
                <h1 className="text-2xl font-bold">Sélection de Boutique</h1>
              </div>
              <div className="flex items-center gap-2">
                <LoadingIndicator size="md" />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRefresh}
                  disabled={isLoading}
                  className="rounded-xl"
                >
                  <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="rounded-xl"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <p className="text-muted-foreground">
              Choisissez la boutique que vous souhaitez gérer
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Barre de recherche */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher une boutique..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-10 rounded-xl"
              />
              {query && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setQuery("")}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>

            {/* Liste des boutiques */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredStores.map((store: Store) => (
                <Card
                  key={store.id}
                  className={`rounded-xl border-dashed cursor-pointer transition-all hover:shadow-md ${
                    selectedStoreId === store.id
                      ? 'border-primary bg-primary/5'
                      : 'hover:border-primary/50'
                  }`}
                  onClick={() => handleStoreSelect(store.id)}
                >
                  <CardContent className="p-5 flex items-center gap-4">
                    <div className="bg-primary/10 text-primary rounded-lg p-3">
                      <span className="text-lg font-semibold">
                        {getInitials(store.name)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate">{store.name}</h3>
                      {store.description && (
                        <p className="text-sm text-muted-foreground truncate">
                          {store.description}
                        </p>
                      )}
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Bouton pour créer une nouvelle boutique */}
            <div className="text-center pt-4">
              <Button
                onClick={() => navigate({ to: "/create-store" })}
                className="rounded-xl"
                size="lg"
              >
                <Plus className="h-4 w-4 mr-2" />
                Créer une nouvelle boutique
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </UnifiedPageWrapper>
  )
}
