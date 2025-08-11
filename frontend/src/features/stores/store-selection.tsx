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

  // Maintenant les conditions de retour anticipé
  // Afficher un loader pendant la vérification de l'authentification
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

  // Loading
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background grid place-items-center p-4">
        <Card className="w-full max-w-3xl rounded-2xl">
          <CardContent className="p-8">
            <div className="mb-6">
              <div className="flex flex-col items-center gap-4">
                <Spinner variant="infinite" size={40} />
                <p className="text-sm text-muted-foreground">Récupération de vos boutiques...</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Card key={i} className="rounded-xl border-dashed">
                  <CardContent className="p-5 flex items-center gap-4">
                    <Skeleton className="h-12 w-12 rounded-lg" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Error
  if (error) {
    return (
      <div className="min-h-screen bg-background grid place-items-center p-4">
        <Card className="w-full max-w-md rounded-2xl">
          <CardContent className="p-8">
            <div className="text-center space-y-4">
              <div className="text-3xl">⚠️</div>
              <h2 className="text-xl font-semibold">Oups !</h2>
              <p className="text-muted-foreground">{error}</p>
              <Button
                onClick={() => window.location.reload()}
                className="w-full rounded-xl"
              >
                Réessayer
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Empty
  if (stores.length === 0) {
    return (
      <div className="min-h-screen bg-background grid place-items-center p-4">
        <Card className="w-full max-w-lg rounded-2xl">
          <CardContent className="p-10">
            <div className="text-center space-y-6">
              <img
                src="/assets/images/logo.svg"
                alt="Coovia Logo"
                className="h-10 w-auto mx-auto"
              />
              <div>
                <h2 className="text-2xl font-semibold">Commencez votre aventure</h2>
                <p className="text-muted-foreground mt-1">
                  Créez votre première boutique et commencez à vendre en ligne
                </p>
              </div>
              <Button
                onClick={() => navigate({ to: "/create-store" })}
                className="w-full rounded-xl"
              >
                <Plus className="mr-2 h-4 w-4" />
                Créer ma première boutique
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Main (simple et moderne)
  return (
    <div className="min-h-screen bg-background grid place-items-center p-4">
      <Card className="w-full max-w-3xl rounded-2xl">
        {/* Header très simple */}
        <CardHeader className="px-6 py-5 border-b">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <img
                src="/assets/images/logo.svg"
                alt="coovia"
                width={96}
                height={28}
                className="h-7 w-auto"
              />
              <span className="text-sm text-muted-foreground hidden sm:inline">
                Sélectionnez une boutique
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={handleRefresh}
                variant="outline"
                size="sm"
                className="rounded-lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Spinner variant="infinite" size={16} className="mr-2" />
                ) : (
                  <RefreshCw className="h-4 w-4 mr-2" />
                )}
                Actualiser
              </Button>
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="rounded-lg"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Déconnexion
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {/* Barre d'actions compacte */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
            <div className="text-left">
              <CardTitle className="text-xl">Bienvenue{user?.name ? `, ${user.name}` : ""} 👋</CardTitle>
              <p className="text-sm text-muted-foreground">
                Choisissez une boutique pour continuer
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Rechercher une boutique..."
                  className="pl-9 pr-9 w-60"
                />
                {query && (
                  <button
                    aria-label="Effacer la recherche"
                    onClick={() => setQuery("")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-muted"
                  >
                    <X className="h-4 w-4 text-muted-foreground" />
                  </button>
                )}
              </div>
              <Button
                onClick={() => navigate({ to: "/create-store" })}
                className="rounded-lg"
              >
                <Plus className="mr-2 h-4 w-4" />
                Nouvelle boutique
              </Button>
            </div>
          </div>

          {/* Liste des boutiques */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredStores.map((store: Store) => (
              <Card
                key={store.id}
                className="group cursor-pointer transition-all hover:shadow-md hover:border-primary/30"
                onClick={() => handleStoreSelect(store.id)}
              >
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary font-semibold text-lg">
                        {getInitials(store.name)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground truncate">
                          {store.name}
                        </h3>
                        {store.description && (
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {store.description}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="shrink-0">
                      {selectedStoreId === store.id ? (
                        <Spinner variant="infinite" size={16} />
                      ) : (
                        <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-transform" />
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
