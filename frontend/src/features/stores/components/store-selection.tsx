"use client"

import { useState } from "react"
import { useNavigate } from "@tanstack/react-router"
import { Store, Plus, ArrowRight, Building2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useStore } from "@/context/store-context"
import { CreateStoreDialog } from "./create-store-dialog"
import { cn } from "@/lib/utils"

export function StoreSelection() {
  const navigate = useNavigate()
  const { stores, isLoading, setCurrentStore } = useStore()
  const [selectedStoreId, setSelectedStoreId] = useState<string | null>(null)
  const [showCreateDialog, setShowCreateDialog] = useState(false)

  const handleStoreSelect = (store: any) => {
    setSelectedStoreId(store.id)
  }

  const handleContinue = () => {
    const selectedStore = stores.find((store) => store.id === selectedStoreId)
    if (selectedStore) {
      setCurrentStore(selectedStore)
      navigate({ to: "/" })
    }
  }

  const handleCreateStore = () => {
    setShowCreateDialog(true)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement de vos boutiques...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
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
                    selectedStoreId === store.id ? "ring-2 ring-primary shadow-md" : "hover:border-primary/50",
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
                          <Badge variant={store.status === "active" ? "default" : "secondary"} className="text-xs">
                            {store.status === "active" ? "Actif" : store.status}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {store.plan}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <CardDescription className="mb-4 line-clamp-2">{store.description}</CardDescription>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="text-center">
                        <div className="font-semibold text-lg">{store.stats.totalProducts}</div>
                        <div className="text-muted-foreground">Produits</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-lg">{store.stats.totalOrders}</div>
                        <div className="text-muted-foreground">Commandes</div>
                      </div>
                    </div>

                    {selectedStoreId === store.id && (
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
                onClick={handleCreateStore}
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
              <Button onClick={handleCreateStore} size="lg">
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
        onStoreCreated={(store) => {
          setShowCreateDialog(false)
          handleStoreSelect(store)
        }}
      />
    </div>
  )
}
