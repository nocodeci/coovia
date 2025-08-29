"use client"

import { useEffect, useMemo, useState } from "react"
import { useNavigate } from "@tanstack/react-router"
import { LogOut, Plus, RefreshCw, ArrowRight, Building2, Search, X, ChevronDown, ChevronUp } from "lucide-react"

import { useSanctumAuth } from "@/hooks/useSanctumAuth"
import { useStore } from "@/context/store-context"
import { ProtectedRoute } from "@/components/ProtectedRoute"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"

// Import du nouveau système de chargement unifié
import { UnifiedPageWrapper, LoadingIndicator } from "@/components/unified-loading"

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
  const { user, logout } = useSanctumAuth()
  const { stores, setCurrentStore, isLoading, error, refreshStores } = useStore()

  const [selectedStoreId, setSelectedStoreId] = useState<string | null>(null)
  const [query, setQuery] = useState("")
  const [showAllStores, setShowAllStores] = useState(false)
  const [authChecked, setAuthChecked] = useState(false)

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

  // Vérification d'authentification améliorée
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('sanctum_token')
        console.log('🔍 Vérification authentification...')
        console.log('  - Token présent:', !!token)
        console.log('  - User présent:', !!user)
        
        if (!token || !user) {
          console.log('🚫 Utilisateur non authentifié, redirection...')
          navigate({ to: '/sign-in' })
          return
        }
        
        console.log('✅ Utilisateur authentifié')
        setAuthChecked(true)
        
        // Si on a un utilisateur, continuer normalement
        const t = setTimeout(() => {
          if (stores.length === 0 && !isLoading && !error) {
            console.log('🔄 Rafraîchissement des boutiques...')
            refreshStores()
          }
        }, 1000)
        
        return () => clearTimeout(t)
      } catch (error) {
        console.error('❌ Erreur lors de la vérification d\'authentification:', error)
        navigate({ to: '/sign-in' })
      }
    }
    
    checkAuth()
  }, [user, stores.length, isLoading, error, refreshStores, navigate])

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
      // Rafraîchir les boutiques
      await refreshStores()
      toast.success("Données rafraîchies")
    } catch (err) {
      console.error("🚨 Erreur lors du rafraîchissement:", err)
      toast.error("Erreur", { description: "Impossible de rafraîchir les données" })
    }
  }

  // Si pas encore vérifié l'authentification, afficher un loader
  if (!authChecked) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white">Vérification de l'authentification...</p>
        </div>
      </div>
    )
  }

  // Si pas d'utilisateur après vérification, ne rien afficher (redirection en cours)
  if (!user) {
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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
        {/* Éléments décoratifs animés */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute top-40 right-32 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute bottom-32 left-1/4 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "4s" }}
        ></div>
        <div
          className="absolute bottom-20 right-20 w-64 h-64 bg-orange-500/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "3s" }}
        ></div>

        {/* Pattern de points subtil */}
        <div className="absolute inset-0 opacity-5 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIxIi8+PC9nPjwvZz48L3N2Zz4=')]"></div>

        <div className="relative z-10 h-screen flex items-center justify-center p-4">
          <Card className="w-full max-w-xl bg-white shadow-2xl rounded-2xl overflow-hidden max-h-[90vh]">
            {/* Top Bar */}
            <header className="bg-white border-b border-gray-200 px-6 py-4">
              <div className="flex items-center justify-between">
                {/* Logo */}
                <div className="flex items-center">
                  <img 
                    src="/assets/images/logo.svg" 
                    alt="Coovia" 
                    className="h-8 w-auto"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.style.display = 'none'
                      const fallback = document.createElement('div')
                      fallback.className = 'h-8 flex items-center justify-center text-lg font-bold text-primary bg-primary/10 px-3 rounded-lg'
                      fallback.textContent = 'COOVIA'
                      target.parentNode?.appendChild(fallback)
                    }}
                  />
                </div>
                
                {/* User Avatar */}
                <div className="flex items-center gap-4">
                  <LoadingIndicator size="sm" />
                  <Button variant="ghost" size="sm" onClick={handleRefresh} disabled={isLoading} className="rounded-lg">
                    <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={handleLogout} className="rounded-lg">
                    <LogOut className="h-4 w-4" />
                  </Button>
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-sm font-semibold text-primary">
                      {user?.name ? getInitials(user.name) : 'U'}
                    </span>
                  </div>
                </div>
              </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
              <div className="px-6 py-6">
                {/* Header avec message de bienvenue */}
                <header className="mb-8">
                  <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold text-gray-900">
                      Bon retour, {user?.name || 'Utilisateur'}
                    </h1>
                    <Button onClick={() => navigate({ to: "/create-store" })} className="rounded-lg" size="lg">
                      <Plus className="h-4 w-4 mr-2" />
                      Créer une boutique
                    </Button>
                  </div>
                </header>

                {/* Tabs */}
                <div className="mb-6">
                  <div className="border-b border-gray-200">
                    <nav className="-mb-px flex space-x-8">
                      <button className="border-b-2 border-primary text-primary px-1 py-2 text-sm font-medium">
                        Actives ({filteredStores.length})
                      </button>
                      <button className="border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 px-1 py-2 text-sm font-medium">
                        Inactives (0)
                      </button>
                    </nav>
                  </div>
                </div>

                {/* Barre de recherche */}
                <div className="mb-6">
                  <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Rechercher une boutique..."
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      className="pl-10 rounded-lg"
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

                {/* Dropdown des boutiques */}
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

                {/* Message si aucune boutique */}
                {filteredStores.length === 0 && !isLoading && (
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
              </div>
            </main>
          </Card>
        </div>
      </div>
    </UnifiedPageWrapper>
  )
}
