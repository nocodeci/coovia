"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "@tanstack/react-router"
import { useStore } from "@/context/store-context"
import { useAuth } from "@/hooks/useAuth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Plus, LogOut, Building2, Store, ArrowRight } from "lucide-react"
import { CreateStoreDialog } from "./CreateStoreDialog"
import { cn } from "@/lib/utils"

interface StoreType {
  id: number
  name: string
  description: string
  domain: string
  status: "active" | "inactive" | "suspended"
  category?: string
  logo?: string
  created_at: string
}

export function StoreSelection() {
  const [stores, setStores] = useState<StoreType[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedStoreId, setSelectedStoreId] = useState<string | null>(null)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const { setCurrentStore } = useStore()
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    fetchStores()
  }, [])

  const fetchStores = async () => {
    try {
      const token = localStorage.getItem("auth_token")
      const response = await fetch("http://localhost:8000/api/stores", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (response.ok) {
        const data = await response.json()
        setStores(data.data || [])
      }
    } catch (error) {
      console.error("Erreur lors du chargement des boutiques:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleStoreSelect = (store: StoreType) => {
    setSelectedStoreId(store.id.toString())
  }

  const handleContinue = () => {
    const selectedStore = stores.find((store) => store.id.toString() === selectedStoreId)
    if (selectedStore) {
      setCurrentStore(selectedStore)
      localStorage.setItem("selectedStoreId", selectedStore.id.toString())
      // Le composant parent va automatiquement afficher le Dashboard
      window.location.reload() // Force le rechargement pour afficher le dashboard
    }
  }

  const handleStoreCreated = (newStore: StoreType) => {
    setStores((prev) => [...prev, newStore])
    setShowCreateDialog(false)
    setSelectedStoreId(newStore.id.toString())
  }

  const handleLogout = async () => {
    await logout()
    navigate({ to: "/sign-in" })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "default"
      case "inactive":
        return "secondary"
      case "suspended":
        return "destructive"
      default:
        return "secondary"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "Actif"
      case "inactive":
        return "Inactif"
      case "suspended":
        return "Suspendu"
      default:
        return status
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement de vos boutiques...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header avec déconnexion - SANS SIDEBAR */}
      <div className="border-b bg-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Building2 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-semibold">Coovia</h1>
                <p className="text-sm text-muted-foreground">Gestion de boutiques</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium">{user?.name}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Déconnexion
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal - SANS SIDEBAR */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <Building2 className="h-8 w-8 text-primary" />
              </div>
            </div>
            <h1 className="text-3xl font-bold mb-2">Sélectionnez votre boutique</h1>
            <p className="text-muted-foreground text-lg">Choisissez la boutique que vous souhaitez gérer aujourd'hui</p>
          </div>

          {/* Stores Grid */}
          {stores.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {stores.map((store) => (
                <Card
                  key={store.id}
                  className={cn(
                    "cursor-pointer transition-all duration-200 hover:shadow-md",
                    selectedStoreId === store.id.toString()
                      ? "ring-2 ring-primary shadow-md"
                      : "hover:border-primary/50",
                  )}
                  onClick={() => handleStoreSelect(store)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={store.logo || "/placeholder.svg"} alt={store.name} />
                        <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                          {store.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <CardTitle className="text-lg">{store.name}</CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant={getStatusColor(store.status)} className="text-xs">
                            {getStatusText(store.status)}
                          </Badge>
                          {store.category && (
                            <Badge variant="outline" className="text-xs">
                              {store.category}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <CardDescription className="mb-4 line-clamp-2">{store.description}</CardDescription>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="text-center">
                        <div className="font-semibold text-lg">-</div>
                        <div className="text-muted-foreground">Produits</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-lg">-</div>
                        <div className="text-muted-foreground">Commandes</div>
                      </div>
                    </div>

                    {selectedStoreId === store.id.toString() && (
                      <div className="mt-4 p-2 bg-primary/5 rounded-md border border-primary/20">
                        <div className="flex items-center gap-2 text-primary text-sm font-medium">
                          <div className="w-2 h-2 bg-primary rounded-full"></div>
                          Boutique sélectionnée
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}

              {/* Create New Store Card */}
              <Card
                className="cursor-pointer transition-all duration-200 hover:shadow-md hover:border-primary/50 border-dashed"
                onClick={() => setShowCreateDialog(true)}
              >
                <CardContent className="flex flex-col items-center justify-center h-full min-h-[200px] text-center">
                  <div className="p-4 bg-muted rounded-full mb-4">
                    <Plus className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <CardTitle className="text-lg mb-2">Créer une nouvelle boutique</CardTitle>
                  <CardDescription>Ajoutez une nouvelle boutique à votre compte</CardDescription>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="p-4 bg-muted rounded-full w-fit mx-auto mb-4">
                <Store className="h-12 w-12 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Aucune boutique trouvée</h3>
              <p className="text-muted-foreground mb-6">
                Vous n'avez pas encore de boutique. Créez-en une pour commencer.
              </p>
              <Button onClick={() => setShowCreateDialog(true)} size="lg">
                <Plus className="h-4 w-4 mr-2" />
                Créer ma première boutique
              </Button>
            </div>
          )}

          {/* Action Buttons */}
          {stores.length > 0 && (
            <>
              <Separator className="mb-6" />
              <div className="flex justify-center">
                <Button onClick={handleContinue} disabled={!selectedStoreId} size="lg" className="min-w-[200px]">
                  Continuer
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </>
          )}
        </div>
      </div>

      <CreateStoreDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onStoreCreated={handleStoreCreated}
      />
    </div>
  )
}
