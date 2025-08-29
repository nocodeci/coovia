"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "@tanstack/react-router"
import { LogOut, Plus, RefreshCw, ArrowRight, Building2, Search, X, ChevronDown, ChevronUp } from "lucide-react"

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
  const [showAllStores, setShowAllStores] = useState(false)
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo et titre */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">Wozif</h1>
            </div>

            {/* Actions utilisateur */}
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={isLoading}
                className="flex items-center gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                Actualiser
              </Button>
              
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-600">
                  Bonjour, {user.name}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Déconnexion
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Contenu principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Sélectionnez votre boutique
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Choisissez la boutique dans laquelle vous souhaitez travailler aujourd'hui
            </p>
          </CardHeader>

          <CardContent className="px-8 pb-8">
            {/* Barre de recherche */}
            <div className="mb-8">
              <div className="relative max-w-md mx-auto">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Rechercher une boutique..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="pl-10 pr-10 py-3 text-base border-gray-300 focus:border-primary focus:ring-primary"
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
            </div>

            {/* État de chargement */}
            {isLoading && (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-gray-600">Chargement des boutiques...</p>
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
              <div className="space-y-3">
                {/* Boutiques visibles (3 premières ou toutes si showAllStores) */}
                {filteredStores.slice(0, showAllStores ? filteredStores.length : 3).map((store: Store) => (
                  <div
                    key={store.id}
                    className="bg-white border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-sm transition-all cursor-pointer"
                    onClick={() => handleStoreSelect(store.id)}
                  >
                    <div className="p-4">
                      <div className="flex items-center gap-4">
                        {/* Avatar de la boutique */}
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-sm font-semibold text-primary">
                            {getInitials(store.name)}
                          </span>
                        </div>
                        
                        {/* Détails de la boutique */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 truncate">{store.name}</h3>
                          <p className="text-sm text-gray-500 truncate">
                            {store.slug ? `${store.slug}.wozif.store` : `${store.id}.wozif.store`}
                          </p>
                        </div>
                        
                        {/* Flèche */}
                        <ArrowRight className="h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Bouton pour afficher plus/moins de boutiques */}
                {filteredStores.length > 3 && (
                  <div className="flex justify-center">
                    <Button
                      variant="outline"
                      onClick={() => setShowAllStores(!showAllStores)}
                      className="flex items-center gap-2"
                    >
                      {showAllStores ? (
                        <>
                          <ChevronUp className="h-4 w-4" />
                          Voir moins
                        </>
                      ) : (
                        <>
                          <ChevronDown className="h-4 w-4" />
                          Voir toutes les boutiques ({filteredStores.length - 3} de plus)
                        </>
                      )}
                    </Button>
                  </div>
                )}
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
                  <Button onClick={() => navigate({ to: "/create-store" })} className="rounded-lg">
                    <Plus className="h-4 w-4 mr-2" />
                    Créer votre première boutique
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
