import { useState, useEffect } from "react"
import { useNavigate } from "@tanstack/react-router"
import { useAuth } from "@/hooks/useAuth"
import { useStore } from "@/context/store-context"
import { Button } from "@/components/ui/button"
import { LogOut, Plus, Sparkles, Store, ArrowRight, RefreshCw } from "lucide-react"
import { CircleLoader } from "@/components/ui/circle-loader"
import { toast } from "sonner"

export function StoreSelection() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const { stores, setCurrentStore, isLoading, error, refreshStores } = useStore()
  const [selectedStoreId, setSelectedStoreId] = useState<string | null>(null)
  const [hoveredStore, setHoveredStore] = useState<string | null>(null)



  // Vérification d'authentification et chargement forcé des boutiques
  useEffect(() => {
    const token = localStorage.getItem('auth_token')
    if (!token || !user) {
      navigate({ to: '/sign-in' })
      return
    }

    // Forcer le chargement des boutiques si elles ne sont pas chargées après 1 seconde
    const timeoutId = setTimeout(() => {
      if (stores.length === 0 && !isLoading && !error) {
        refreshStores()
      }
    }, 1000) // Réduit de 2s à 1s

    return () => clearTimeout(timeoutId)
  }, [user, navigate, stores.length, isLoading, error, refreshStores])

  // État de chargement pour l'authentification
  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="bg-card/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-border/20 max-w-md w-full">
          <CircleLoader size="lg" message="Vérification de l'authentification..." />
        </div>
      </div>
    )
  }

  const handleStoreSelect = async (storeId: string) => {
    try {
      setSelectedStoreId(storeId)
      const selectedStore = stores.find(store => store.id === storeId)
      
      if (selectedStore) {
        setCurrentStore(selectedStore)
        toast.success("Boutique sélectionnée", {
          description: `Bienvenue dans ${selectedStore.name}`
        })
        
        // Redirection vers le dashboard de la boutique
        navigate({ to: `/${storeId}/dashboard` })
      } else {
        console.error("❌ Boutique non trouvée pour l'ID:", storeId)
      }
    } catch (error) {
      console.error("🚨 Erreur lors de la sélection:", error)
      toast.error("Erreur", {
        description: "Impossible de sélectionner cette boutique"
      })
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
      toast.success("Boutiques rechargées")
    } catch (error) {
      toast.error("Erreur lors du rechargement")
    }
  }

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Bonjour"
    if (hour < 18) return "Bon après-midi"
    return "Bonsoir"
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const getGreetingEmoji = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "☀️"
    if (hour < 18) return "🌅"
    return "🌙"
  }

  // Si les boutiques sont déjà chargées, afficher directement le contenu
  if (stores.length > 0 && !isLoading) {
    
  }

  // Affichage du loader seulement si vraiment en cours de chargement
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="bg-card/80 backdrop-blur-sm rounded-3xl p-10 shadow-xl border border-border/20 max-w-md w-full">
          <CircleLoader size="xl" message="Récupération de vos boutiques..." />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-destructive/5 flex items-center justify-center p-4">
        <div className="bg-card/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-border/20 max-w-md w-full">
          <div className="w-16 h-16 mx-auto mb-6 bg-destructive rounded-2xl flex items-center justify-center">
            <span className="text-2xl">⚠️</span>
          </div>
          <h2 className="text-2xl font-bold text-foreground text-center mb-3">Oups !</h2>
          <p className="text-muted-foreground text-center mb-8">{error}</p>
          <Button 
            onClick={() => window.location.reload()}
            className="w-full bg-destructive hover:bg-destructive/90 text-destructive-foreground font-semibold py-3 rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Réessayer
          </Button>
        </div>
      </div>
    )
  }

  if (stores.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="bg-card/80 backdrop-blur-sm rounded-3xl p-10 shadow-xl border border-border/20 max-w-lg w-full">
          <div className="text-center mb-8">
            <div className="w-24 h-24 mx-auto mb-6 bg-white rounded-3xl flex items-center justify-center shadow-lg">
              <img 
                src="/assets/images/logo.svg" 
                alt="Coovia Logo" 
                className="h-12 w-auto"
              />
            </div>
            <h2 className="text-3xl font-bold text-foreground mb-3">Commencez votre aventure</h2>
            <p className="text-muted-foreground text-lg">Créez votre première boutique et commencez à vendre en ligne</p>
          </div>
          <Button 
            onClick={() => navigate({ to: "/create-store" })}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-4 rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl text-lg"
          >
            <Plus className="mr-2 h-5 w-5" />
            Créer ma première boutique
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="bg-card/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-border/20 w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header avec logo et déconnexion */}
        <div className="flex justify-between items-center p-8 pb-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="flex flex-col items-start justify-start w-full mb-6 max-w-xs">
              <img 
                src="/assets/images/logo.svg" 
                alt="coovia" 
                width="100" 
                height="16" 
                className="h-8 w-auto"
              />
            </div>

          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              onClick={handleRefresh}
              variant="outline"
              size="sm"
              className="border-border hover:border-border/80 bg-card/70 backdrop-blur-sm hover:bg-card rounded-xl px-3 py-2 transition-all duration-200 shadow-sm"
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              <span className="font-medium">Actualiser</span>
            </Button>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="border-border hover:border-border/80 bg-card/70 backdrop-blur-sm hover:bg-card rounded-2xl px-4 py-2 transition-all duration-200 shadow-sm"
            >
              <LogOut className="h-4 w-4 mr-2" />
              <span className="font-medium">Déconnexion</span>
            </Button>
          </div>
        </div>

        {/* Contenu principal avec scroll */}
        <div className="p-8 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Salutation */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-2">
              {getGreeting()} {user?.name} ! {getGreetingEmoji()}
            </h2>
            <p className="text-lg text-muted-foreground">Sélectionnez une boutique pour continuer</p>
          </div>

          {/* Liste des boutiques */}
          <div className="space-y-3 mb-8">
            {stores.map((store, index) => (
              <div
                key={store.id}
                className="group relative"
                onMouseEnter={() => setHoveredStore(store.id)}
                onMouseLeave={() => setHoveredStore(null)}
                style={{ 
                  animation: `fadeInUp 0.5s ease-out ${index * 100}ms both`
                }}
              >
                <button
                  onClick={() => handleStoreSelect(store.id)}
                  disabled={selectedStoreId === store.id}
                  className="w-full bg-card/60 backdrop-blur-sm border border-border/60 rounded-2xl p-5 hover:bg-card hover:border-primary/30 hover:shadow-lg transition-all duration-300 group-hover:scale-[1.01] disabled:opacity-75"
                >
                  <div className="flex items-center space-x-5">
                    {/* Avatar de la boutique */}
                    <div className="relative">
                      <div className={`w-14 h-14 rounded-xl flex items-center justify-center font-bold text-base shadow-md transition-all duration-300 ${
                        hoveredStore === store.id 
                          ? 'bg-primary text-primary-foreground scale-105' 
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        {getInitials(store.name)}
                      </div>
                      {hoveredStore === store.id && (
                        <div className="absolute -inset-2 bg-primary rounded-xl opacity-20 blur-md transition-opacity duration-300"></div>
                      )}
                    </div>

                    {/* Informations de la boutique */}
                    <div className="flex-1 text-left">
                      <h3 className="font-bold text-lg text-foreground mb-1 group-hover:text-primary transition-colors duration-200">
                        {store.name}
                      </h3>
                      <p className="text-muted-foreground group-hover:text-foreground transition-colors duration-200">
                        {store.description || "Aucune description"}
                      </p>
                    </div>

                    {/* Flèche ou loader */}
                    <div className="flex items-center">
                      {selectedStoreId === store.id ? (
                        <CircleLoader size="sm" className="!flex-row" />
                      ) : (
                        <ArrowRight className={`h-5 w-5 transition-all duration-300 ${
                          hoveredStore === store.id 
                            ? 'text-primary translate-x-1' 
                            : 'text-muted-foreground'
                        }`} />
                      )}
                    </div>
                  </div>
                </button>
              </div>
            ))}
          </div>

          {/* Bouton créer une boutique */}
          <div className="text-center pt-4 border-t border-border">
            <Button
              onClick={() => navigate({ to: "/create-store" })}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6 py-3 rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
            >
              <Plus className="mr-2 h-5 w-5" />
              Ouvrir une nouvelle boutique
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}