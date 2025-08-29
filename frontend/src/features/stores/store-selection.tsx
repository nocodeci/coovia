"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "@tanstack/react-router"
import { LogOut, Plus, RefreshCw, ArrowRight, Building2, Search, X } from "lucide-react"

import { useAuthStore } from "@/stores/authStore"
import { useStore } from "@/context/store-context"
import { ProtectedRoute } from "@/components/ProtectedRoute"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"

type Store = {
  id: string
  name: string
  description?: string
  slug?: string
}

export function StoreSelection() {
  return (
    <ProtectedRoute>
      <StoreSelectionContent />
    </ProtectedRoute>
  )
}

function StoreSelectionContent() {
  const navigate = useNavigate()
  const { user, logout, isAuthenticated, token } = useAuthStore()
  const { stores, setCurrentStore, isLoading, error, refreshStores } = useStore()

  const [selectedStoreId, setSelectedStoreId] = useState<string | null>(null)
  const [query, setQuery] = useState("")
  const [filteredStores, setFilteredStores] = useState<Store[]>([])

  // Filtrer les boutiques basé sur la recherche
  useEffect(() => {
    const q = query.trim().toLowerCase()
    if (!q) {
      setFilteredStores(stores)
    } else {
      const filtered = stores.filter((store: Store) => {
        const name = store.name?.toLowerCase() || ""
        const desc = store.description?.toLowerCase() || ""
        return name.includes(q) || desc.includes(q)
      })
      setFilteredStores(filtered)
    }
  }, [stores, query])

  // Vérification d'authentification stricte
  useEffect(() => {
    console.log('🔍 StoreSelection - Vérification authentification...')
    console.log('  - isAuthenticated:', isAuthenticated)
    console.log('  - user:', user)
    console.log('  - token:', token ? `${token.substring(0, 20)}...` : 'AUCUN')
    
    if (!isAuthenticated || !user || !token) {
      console.log('🚫 Utilisateur non authentifié, redirection vers /sign-in')
      navigate({ to: '/sign-in' })
      return
    }
    
    console.log('✅ Utilisateur authentifié, chargement des boutiques...')
    
    // Charger les boutiques si pas encore fait
    if (stores.length === 0 && !isLoading && !error) {
      refreshStores()
    }
  }, [isAuthenticated, user, token, navigate, stores.length, isLoading, error, refreshStores])

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((w) => w.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2)

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
      await refreshStores()
      toast.success("Boutiques rafraîchies")
    } catch (error) {
      toast.error("Erreur", { description: "Impossible de rafraîchir les boutiques" })
    }
  }

  // Si pas encore authentifié, afficher un loader
  if (!isAuthenticated || !user || !token) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Vérification de l'authentification...
          </h2>
          <p className="text-gray-600">
            Redirection vers la page de connexion
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background grid place-items-center p-4">
      <Card className="w-full max-w-3xl rounded-2xl">
        <CardHeader className="text-center pb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Building2 className="h-6 w-6 text-primary" />
              <h1 className="text-2xl font-bold">Sélection de Boutique</h1>
            </div>
            <div className="flex items-center gap-2">
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

          {/* État de chargement */}
          {isLoading && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Chargement des boutiques...</p>
            </div>
          )}

          {/* Erreur */}
          {error && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚠️</span>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Erreur de chargement</h3>
              <p className="text-gray-500 mb-6">{error}</p>
              <Button onClick={handleRefresh} variant="outline">
                <RefreshCw className="w-4 h-4 mr-2" />
                Réessayer
              </Button>
            </div>
          )}

          {/* Liste des boutiques */}
          {!isLoading && !error && (
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
          )}

          {/* Bouton pour créer une nouvelle boutique */}
          {!isLoading && !error && (
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
          )}

          {/* Message si aucune boutique */}
          {!isLoading && !error && filteredStores.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building2 className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune boutique trouvée</h3>
              <p className="text-gray-500 mb-6">
                {query ? "Aucune boutique ne correspond à votre recherche." : "Vous n'avez pas encore créé de boutique."}
              </p>
              {!query && (
                <Button onClick={() => navigate({ to: "/create-store" })} className="rounded-xl">
                  <Plus className="h-4 w-4 mr-2" />
                  Créer votre première boutique
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
