"use client"

import { useState } from "react"
import { Package, BookOpen, Headphones, Eye, MoreHorizontal, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useProduitsContext } from "../context/produits-context"
import { categories } from "../data/data"

const productTypes = [
  {
    id: "telechargeable",
    title: "Téléchargeable",
    description: "Vendez des fichiers numériques livrés instantanément après achat.",
    icon: Package,
    selected: true,
  },
  {
    id: "cours",
    title: "Cours",
    description: "Créez des formations structurées pour partager votre expertise.",
    icon: BookOpen,
    selected: false,
  },
  {
    id: "service",
    title: "Service",
    description: "Proposez vos compétences sous forme de prestations personnalisées.",
    icon: Headphones,
    selected: false,
  },
]

const pricingModels = ["Paiement unique", "Abonnement mensuel", "Abonnement annuel", "Paiement à l'usage", "Gratuit"]

interface CreateProduitDialogProps {
  open: boolean
}

export function CreateProduitDialog({ open }: CreateProduitDialogProps) {
  const { setOpen } = useProduitsContext()
  const [selectedType, setSelectedType] = useState("telechargeable")
  const [productName, setProductName] = useState("")
  const [category, setCategory] = useState("")
  const [pricingModel, setPricingModel] = useState("")
  const [price, setPrice] = useState("")
  const [promotionalPrice, setPromotionalPrice] = useState("")
  const [description, setDescription] = useState("")

  // États pour les options avancées
  const [autoReduction, setAutoReduction] = useState(false)
  const [validityPeriod, setValidityPeriod] = useState(false)
  const [customUrl, setCustomUrl] = useState(false)
  const [postPurchaseGuide, setPostPurchaseGuide] = useState(false)
  const [passwordProtection, setPasswordProtection] = useState(false)
  const [watermarkFiles, setWatermarkFiles] = useState(true)
  const [purchaseLimit, setPurchaseLimit] = useState(false)
  const [hideFromStore, setHideFromStore] = useState(false)

  const handleSubmit = () => {
    // Logique de création du produit
    console.log("Création du produit...")
    setOpen(null)
  }

  return (
    <Dialog open={open} onOpenChange={() => setOpen(null)}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-hidden p-0">
        {/* Header */}
        <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex h-14 items-center px-6">
            <Button variant="ghost" size="sm" onClick={() => setOpen(null)} className="mr-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>

            <div className="flex-1">
              <DialogTitle className="text-lg font-semibold">{productName || "Nouveau produit"}</DialogTitle>
            </div>

            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                Voir
              </Button>
              <Button
                size="sm"
                className="bg-[oklch(0.8944_0.1931_121.75)] text-foreground hover:bg-[oklch(0.8_0.19_121)]"
                onClick={handleSubmit}
              >
                Publier
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    Plus
                    <MoreHorizontal className="h-4 w-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Sauvegarder comme brouillon</DropdownMenuItem>
                  <DropdownMenuItem>Dupliquer</DropdownMenuItem>
                  <DropdownMenuItem>Supprimer</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        <div className="flex overflow-hidden">
          {/* Sidebar Navigation */}
          <div className="w-64 border-r bg-muted/10 overflow-y-auto">
            <Tabs defaultValue="details" orientation="vertical" className="w-full">
              <TabsList className="grid w-full grid-rows-6 h-auto bg-transparent p-2">
                <TabsTrigger
                  value="details"
                  className="w-full justify-start data-[state=active]:bg-background data-[state=active]:shadow-sm"
                >
                  <Package className="h-4 w-4 mr-2" />
                  Détails
                </TabsTrigger>
                <TabsTrigger
                  value="description"
                  className="w-full justify-start data-[state=active]:bg-background data-[state=active]:shadow-sm"
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  Description
                </TabsTrigger>
                <TabsTrigger
                  value="appearance"
                  className="w-full justify-start data-[state=active]:bg-background data-[state=active]:shadow-sm"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Apparence
                </TabsTrigger>
                <TabsTrigger
                  value="files"
                  className="w-full justify-start data-[state=active]:bg-background data-[state=active]:shadow-sm"
                >
                  <Package className="h-4 w-4 mr-2" />
                  Fichiers
                </TabsTrigger>
                <TabsTrigger
                  value="custom-fields"
                  className="w-full justify-start data-[state=active]:bg-background data-[state=active]:shadow-sm"
                >
                  <Package className="h-4 w-4 mr-2" />
                  Champs personnalisés
                </TabsTrigger>
                <TabsTrigger
                  value="faq"
                  className="w-full justify-start data-[state=active]:bg-background data-[state=active]:shadow-sm"
                >
                  <Package className="h-4 w-4 mr-2" />
                  FAQ
                </TabsTrigger>
              </TabsList>

              {/* Main Content */}
              <div className="flex-1 p-6 overflow-y-auto max-h-[calc(90vh-14rem)]">
                <TabsContent value="details" className="mt-0">
                  <div className="space-y-6">
                    {/* Nom du produit */}
                    <div className="space-y-2">
                      <Label htmlFor="product-name">
                        Nom du produit <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="product-name"
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                        placeholder="Entrez le nom de votre produit"
                      />
                    </div>

                    {/* Type de produit */}
                    <div className="space-y-4">
                      <Label>Type de produit</Label>
                      <div className="grid grid-cols-1 gap-4">
                        {productTypes.map((type) => {
                          const Icon = type.icon
                          return (
                            <Card
                              key={type.id}
                              className={`cursor-pointer transition-all ${
                                selectedType === type.id ? "ring-2 ring-primary bg-primary/5" : "hover:bg-muted/50"
                              }`}
                              onClick={() => setSelectedType(type.id)}
                            >
                              <CardContent className="p-4">
                                <div className="flex items-start space-x-3">
                                  <div className="flex-shrink-0">
                                    <Icon className="h-6 w-6" />
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                      <h3 className="font-medium">{type.title}</h3>
                                      {selectedType === type.id && (
                                        <Badge variant="default" className="bg-primary">
                                          Sélectionné
                                        </Badge>
                                      )}
                                    </div>
                                    <p className="text-sm text-muted-foreground mt-1">{type.description}</p>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          )
                        })}
                      </div>
                    </div>

                    {/* Catégorie */}
                    <div className="space-y-2">
                      <Label htmlFor="category">
                        Catégorie <span className="text-red-500">*</span>
                      </Label>
                      <Select value={category} onValueChange={setCategory}>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner une catégorie" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem key={cat.value} value={cat.value}>
                              <div className="flex items-center">
                                {cat.icon && <cat.icon className="mr-2 h-4 w-4" />}
                                {cat.label}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Modèle de tarification */}
                    <div className="space-y-2">
                      <Label htmlFor="pricing-model">
                        Modèle de tarification <span className="text-red-500">*</span>
                      </Label>
                      <Select value={pricingModel} onValueChange={setPricingModel}>
                        <SelectTrigger>
                          <SelectValue placeholder="Paiement unique" />
                        </SelectTrigger>
                        <SelectContent>
                          {pricingModels.map((model) => (
                            <SelectItem key={model} value={model.toLowerCase()}>
                              {model}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Prix */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="price">Prix</Label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">FCFA</span>
                          <Input
                            id="price"
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            className="pl-16"
                            placeholder="2323"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="promotional-price">Prix promotionnel</Label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">FCFA</span>
                          <Input
                            id="promotional-price"
                            type="number"
                            value={promotionalPrice}
                            onChange={(e) => setPromotionalPrice(e.target.value)}
                            className="pl-16"
                            placeholder="2322"
                          />
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Options avancées */}
                    <div className="space-y-6">
                      <h3 className="text-lg font-medium">Options avancées</h3>

                      {/* Réduction automatique */}
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <Label>Réduction automatique</Label>
                            <Badge variant="secondary" className="text-xs">
                              ⚡
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Offrez des réductions automatiques aux clients lors du 3ème rappel d'abandon.
                          </p>
                        </div>
                        <Switch checked={autoReduction} onCheckedChange={setAutoReduction} />
                      </div>

                      {/* Période de validité */}
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <Label>Période de validité du prix de vente</Label>
                          <p className="text-sm text-muted-foreground">
                            Définissez les dates de début et de fin de votre prix de vente
                          </p>
                        </div>
                        <Switch checked={validityPeriod} onCheckedChange={setValidityPeriod} />
                      </div>

                      {/* URL du produit */}
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <Label>URL du produit</Label>
                          <p className="text-sm text-muted-foreground">Personnalisez l'URL de votre produit</p>
                        </div>
                        <Switch checked={customUrl} onCheckedChange={setCustomUrl} />
                      </div>

                      {/* Guide après-achat */}
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <Label>Guide après-achat</Label>
                          <p className="text-sm text-muted-foreground">
                            Ajoutez des instructions utiles que les clients verront après l'achat
                          </p>
                        </div>
                        <Switch checked={postPurchaseGuide} onCheckedChange={setPostPurchaseGuide} />
                      </div>

                      {/* Protection par mot de passe */}
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <Label>Protégez vos fichiers avec un mot de passe</Label>
                          <p className="text-sm text-muted-foreground">
                            Exigez que les clients saisissent un mot de passe pour accéder à vos fichiers après l'achat
                          </p>
                        </div>
                        <Switch checked={passwordProtection} onCheckedChange={setPasswordProtection} />
                      </div>

                      {/* Filigrane */}
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <Label>Ajoutez des filigranes à vos fichiers</Label>
                          <p className="text-sm text-muted-foreground">
                            Ajoutez automatiquement des filigranes avec les détails du client
                          </p>
                        </div>
                        <Switch checked={watermarkFiles} onCheckedChange={setWatermarkFiles} />
                      </div>

                      {/* Limite d'achat */}
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <Label>Définir une limite d'achat</Label>
                          <p className="text-sm text-muted-foreground">
                            Limitez le nombre de fois où ce produit peut être acheté
                          </p>
                        </div>
                        <Switch checked={purchaseLimit} onCheckedChange={setPurchaseLimit} />
                      </div>

                      {/* Masquer de la boutique */}
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <Label>Masquer sur la boutique</Label>
                          <p className="text-sm text-muted-foreground">
                            Ce produit ne sera visible que via un lien direct
                          </p>
                        </div>
                        <Switch checked={hideFromStore} onCheckedChange={setHideFromStore} />
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="description" className="mt-0">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-medium mb-2">Description du produit</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Rédigez une description détaillée de votre produit
                      </p>
                    </div>
                    <div className="space-y-4">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Décrivez votre produit en détail..."
                        className="min-h-[200px]"
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="appearance" className="mt-0">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Apparence</h3>
                    <p className="text-muted-foreground">Configuration de l'apparence à venir...</p>
                  </div>
                </TabsContent>

                <TabsContent value="files" className="mt-0">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Fichiers</h3>
                    <p className="text-muted-foreground">Gestion des fichiers à venir...</p>
                  </div>
                </TabsContent>

                <TabsContent value="custom-fields" className="mt-0">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Champs personnalisés</h3>
                    <p className="text-muted-foreground">Champs personnalisés à venir...</p>
                  </div>
                </TabsContent>

                <TabsContent value="faq" className="mt-0">
                  <div>
                    <h3 className="text-lg font-medium mb-2">FAQ</h3>
                    <p className="text-muted-foreground">Section FAQ à venir...</p>
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
