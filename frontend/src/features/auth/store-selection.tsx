import { useState, useEffect } from "react"
import { useNavigate } from "@tanstack/react-router"
import { useAuth } from "@/hooks/useAuth"
import { useStore } from "@/context/store-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2, Store, Users, Package, TrendingUp } from "lucide-react"
import { toast } from "sonner"

export function StoreSelection() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { stores, currentStore, setCurrentStore, isLoading, error } = useStore()
  const [selectedStoreId, setSelectedStoreId] = useState<string | null>(null)

  console.log("🔍 StoreSelection - Debug:", {
    user,
    stores: stores.length,
    isLoading,
    error,
    currentStore,
    token: localStorage.getItem('auth_token')
  })

  const handleStoreSelect = async (storeId: string) => {
    try {
      console.log("🔄 Sélection de la boutique:", storeId)
      console.log("🔐 Token d'authentification:", localStorage.getItem('auth_token'))
      console.log("👤 Utilisateur connecté:", user)
      
      setSelectedStoreId(storeId)
      const selectedStore = stores.find(store => store.id === storeId)
      
      if (selectedStore) {
        console.log("✅ Boutique trouvée:", selectedStore.name)
        setCurrentStore(selectedStore)
        toast.success("Boutique sélectionnée", {
          description: `Bienvenue dans ${selectedStore.name}`
        })
        
        // Redirection vers le dashboard de la boutique avec la nouvelle structure
        console.log("🔄 Redirection vers:", `/${storeId}/dashboard`)
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Chargement de vos boutiques...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Erreur de chargement</CardTitle>
            <CardDescription>
              {error}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button 
              onClick={() => window.location.reload()}
              className="w-full"
            >
              Réessayer
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (stores.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Aucune boutique trouvée</CardTitle>
            <CardDescription>
              Vous n'avez pas encore créé de boutique
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button 
              onClick={() => navigate({ to: "/stores" })}
              className="w-full"
            >
              Créer ma première boutique
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Bienvenue, {user?.name} ! 👋
          </h1>
          <p className="text-lg text-gray-600">
            Sélectionnez la boutique que vous souhaitez gérer
          </p>
        </div>

        {/* Stores Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stores.map((store) => (
            <Card 
              key={store.id} 
              className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                selectedStoreId === store.id 
                  ? 'ring-2 ring-blue-500 bg-blue-50' 
                  : 'hover:scale-105'
              }`}
              onClick={() => handleStoreSelect(store.id)}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Store className="h-5 w-5 text-blue-600" />
                    <CardTitle className="text-lg">{store.name}</CardTitle>
                  </div>
                  <Badge variant={store.status === 'active' ? 'default' : 'secondary'}>
                    {store.status === 'active' ? 'Actif' : 'Inactif'}
                  </Badge>
                </div>
                <CardDescription className="text-sm">
                  {store.description || 'Aucune description'}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-3">
                  {/* Store Stats */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <Package className="h-4 w-4 text-gray-500" />
                      <span>{store.stats?.totalProducts || 0} produits</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-gray-500" />
                      <span>{store.stats?.totalCustomers || 0} clients</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-4 w-4 text-gray-500" />
                      <span>{store.stats?.totalOrders || 0} commandes</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">
                        {store.stats?.conversionRate || 0}% conversion
                      </span>
                    </div>
                  </div>

                  {/* Store Address */}
                  {store.contact?.address?.street && (
                    <div className="text-xs text-gray-500 pt-2 border-t">
                      📍 {store.contact.address.street}, {store.contact.address.city}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Create New Store Button */}
        <div className="text-center mt-8">
          <Button 
            variant="outline" 
            onClick={() => navigate({ to: "/stores" })}
            className="mx-auto"
          >
            <Store className="h-4 w-4 mr-2" />
            Créer une nouvelle boutique
          </Button>
        </div>
      </div>
    </div>
  )
} 