"use client"

import { useState } from "react"
import { ArrowLeft, Percent, Package, Settings, Eye, Save, Check, ChevronsUpDown, X } from "lucide-react"
import { MarketingPrimaryButtons } from "./components/marketin-primary-bouton"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

import { produits } from "../../produits/produit/data/produits"

// Filtrer seulement les produits actifs pour les codes promo
const availableProducts = produits.filter((product) => product.statut === "actif")

const discountTypes = [
  {
    id: "percentage",
    title: "Pourcentage",
    description: "Réduction en pourcentage du prix",
    icon: Percent,
    example: "20% de réduction",
  },
  {
    id: "fixed",
    title: "Montant fixe",
    description: "Réduction d'un montant fixe",
    icon: Package,
    example: "5000 FCFA de réduction",
  },
]

export default function AddPromoCode() {
  const [promoCode, setPromoCode] = useState("")
  const [description, setDescription] = useState("")
  const [discountType, setDiscountType] = useState("percentage")
  const [discountValue, setDiscountValue] = useState("")
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])
  const [applyToAll, setApplyToAll] = useState(false)
  const [usageLimit, setUsageLimit] = useState("")
  const [validFrom, setValidFrom] = useState("")
  const [validUntil, setValidUntil] = useState("")
  const [minimumAmount, setMinimumAmount] = useState("")
  const [isActive, setIsActive] = useState(true)

  // États pour les combobox
  const [openProducts, setOpenProducts] = useState(false)

  const generateRandomCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    let result = ""
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    setPromoCode(result)
  }

  const toggleProduct = (productId: string) => {
    setSelectedProducts((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId],
    )
  }

  const removeProduct = (productId: string) => {
    setSelectedProducts((prev) => prev.filter((id) => id !== productId))
  }

  const handleSave = () => {
    toast("💾 Code promo sauvegardé", {
      description: "Le code promo a été créé avec succès",
      style: {
        background: "hsl(var(--card))",
        color: "hsl(var(--card-foreground))",
        border: "1px solid hsl(var(--border))",
      },
      action: {
        label: "Voir la liste",
        onClick: () => console.log("Redirection vers la liste"),
      },
    })
  }

  const isFormValid = promoCode && discountValue && (applyToAll || selectedProducts.length > 0)

 

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contenu Principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Informations de base */}
            <Card className="shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Percent className="h-5 w-5 text-primary" />
                  Informations générales
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="promo-code" className="text-sm font-medium">
                    Code promo <span className="text-destructive">*</span>
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="promo-code"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                      placeholder="WELCOME20"
                      className="h-12 text-base font-mono"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={generateRandomCode}
                      className="h-12 px-4 bg-transparent"
                    >
                      Générer
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">Le code sera automatiquement converti en majuscules</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-sm font-medium">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Décrivez brièvement cette promotion..."
                    className="min-h-[80px]"
                  />
                </div>

                {/* Type de réduction */}
                <div className="space-y-4">
                  <Label className="text-sm font-medium">
                    Type de réduction <span className="text-destructive">*</span>
                  </Label>
                  <RadioGroup value={discountType} onValueChange={setDiscountType}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {discountTypes.map((type) => {
                        const Icon = type.icon
                        return (
                          <div key={type.id} className="relative">
                            <RadioGroupItem value={type.id} id={type.id} className="peer sr-only" />
                            <Label
                              htmlFor={type.id}
                              className={cn(
                                "flex flex-col p-4 border-2 rounded-lg cursor-pointer transition-all",
                                "peer-checked:border-primary peer-checked:bg-primary/5",
                                "hover:border-primary/50",
                              )}
                            >
                              <div className="flex items-center gap-3 mb-2">
                                <Icon className="h-5 w-5 text-primary" />
                                <span className="font-medium">{type.title}</span>
                              </div>
                              <p className="text-sm text-muted-foreground mb-1">{type.description}</p>
                              <p className="text-xs text-primary font-medium">Ex: {type.example}</p>
                            </Label>
                          </div>
                        )
                      })}
                    </div>
                  </RadioGroup>
                </div>

                {/* Valeur de la réduction */}
                <div className="space-y-2">
                  <Label htmlFor="discount-value" className="text-sm font-medium">
                    Valeur de la réduction <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="discount-value"
                      type="number"
                      value={discountValue}
                      onChange={(e) => setDiscountValue(e.target.value)}
                      className="h-12 text-base pr-16"
                      placeholder="0"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-medium">
                      {discountType === "percentage" ? "%" : "FCFA"}
                    </span>
                  </div>
                  {discountType === "percentage" && Number(discountValue) > 100 && (
                    <p className="text-xs text-destructive">La réduction ne peut pas dépasser 100%</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Produits concernés */}
            <Card className="shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Package className="h-5 w-5 text-primary" />
                  Produits concernés
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="apply-all"
                    checked={applyToAll}
                    onCheckedChange={(checked) => {
                      setApplyToAll(checked as boolean)
                      if (checked) {
                        setSelectedProducts([])
                      }
                    }}
                  />
                  <Label htmlFor="apply-all" className="text-sm font-medium">
                    Appliquer à tous les produits
                  </Label>
                </div>

                {!applyToAll && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">
                        Sélectionner les produits <span className="text-destructive">*</span>
                      </Label>
                      <Popover open={openProducts} onOpenChange={setOpenProducts}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={openProducts}
                            className="w-full h-12 justify-between bg-transparent"
                          >
                            {selectedProducts.length > 0
                              ? `${selectedProducts.length} produit(s) sélectionné(s)`
                              : "Sélectionner des produits..."}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[--radix-popover-trigger-width] max-h-[300px] p-0">
                          <Command>
                            <CommandInput placeholder="Rechercher un produit..." className="h-9" />
                            <CommandList>
                              <CommandEmpty>Aucun produit trouvé.</CommandEmpty>
                              <CommandGroup>
                                {availableProducts.map((product) => (
                                  <CommandItem
                                    key={product.id}
                                    value={product.nom}
                                    onSelect={() => toggleProduct(product.id)}
                                  >
                                    <div className="flex items-center justify-between w-full">
                                      <div className="flex items-center gap-3">
                                        <img
                                          src={product.image || "/placeholder.svg"}
                                          alt={product.nom}
                                          className="w-8 h-8 rounded object-cover"
                                        />
                                        <div>
                                          <div className="font-medium">{product.nom}</div>
                                          <div className="text-xs text-muted-foreground">
                                            {product.prix === 0 ? "Gratuit" : `${product.prix.toLocaleString()} FCFA`} •{" "}
                                            {product.categorie}
                                          </div>
                                        </div>
                                      </div>
                                      <Check
                                        className={cn(
                                          "h-4 w-4",
                                          selectedProducts.includes(product.id) ? "opacity-100" : "opacity-0",
                                        )}
                                      />
                                    </div>
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </div>

                    {/* Produits sélectionnés */}
                    {selectedProducts.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="font-medium text-sm">Produits sélectionnés ({selectedProducts.length})</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedProducts.map((productId) => {
                            const product = availableProducts.find((p) => p.id === productId)
                            if (!product) return null
                            return (
                              <Badge key={productId} variant="secondary" className="flex items-center gap-2 pr-1">
                                <img
                                  src={product.image || "/placeholder.svg"}
                                  alt={product.nom}
                                  className="w-4 h-4 rounded object-cover"
                                />
                                {product.nom}
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                                  onClick={() => removeProduct(productId)}
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </Badge>
                            )
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Conditions d'utilisation */}
            <Card className="shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Settings className="h-5 w-5 text-primary" />
                  Conditions d'utilisation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="usage-limit" className="text-sm font-medium">
                      Limite d'utilisation
                    </Label>
                    <Input
                      id="usage-limit"
                      type="number"
                      value={usageLimit}
                      onChange={(e) => setUsageLimit(e.target.value)}
                      placeholder="100"
                      className="h-12"
                    />
                    <p className="text-xs text-muted-foreground">Laissez vide pour un usage illimité</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="minimum-amount" className="text-sm font-medium">
                      Montant minimum
                    </Label>
                    <div className="relative">
                      <Input
                        id="minimum-amount"
                        type="number"
                        value={minimumAmount}
                        onChange={(e) => setMinimumAmount(e.target.value)}
                        placeholder="0"
                        className="h-12 pr-16"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-medium">
                        FCFA
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">Montant minimum de commande requis</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="valid-from" className="text-sm font-medium">
                      Valide à partir du
                    </Label>
                    <Input
                      id="valid-from"
                      type="date"
                      value={validFrom}
                      onChange={(e) => setValidFrom(e.target.value)}
                      className="h-12"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="valid-until" className="text-sm font-medium">
                      Valide jusqu'au
                    </Label>
                    <Input
                      id="valid-until"
                      type="date"
                      value={validUntil}
                      onChange={(e) => setValidUntil(e.target.value)}
                      className="h-12"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Aperçu du code */}
            <Card className="shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Aperçu</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-6 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg border-2 border-dashed border-primary/20">
                  <div className="text-2xl font-bold font-mono text-primary mb-2">{promoCode || "VOTRE_CODE"}</div>
                  <div className="text-lg font-semibold text-foreground mb-1">
                    {discountType === "percentage" && discountValue
                      ? `${discountValue}% de réduction`
                      : discountType === "fixed" && discountValue
                        ? `${discountValue} FCFA de réduction`
                        : "Réduction à définir"}
                  </div>
                  <p className="text-sm text-muted-foreground">{description || "Description du code promo"}</p>
                </div>

                <Separator />

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>Type :</span>
                    <span className="font-medium">
                      {discountType === "percentage" ? "Pourcentage" : "Montant fixe"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Produits :</span>
                    <span className="font-medium">
                      {applyToAll
                        ? "Tous"
                        : selectedProducts.length > 0
                          ? `${selectedProducts.length} sélectionné(s)`
                          : "Aucun"}
                    </span>
                  </div>
                  {usageLimit && (
                    <div className="flex justify-between">
                      <span>Limite :</span>
                      <span className="font-medium">{usageLimit} utilisations</span>
                    </div>
                  )}
                  {minimumAmount && (
                    <div className="flex justify-between">
                      <span>Minimum :</span>
                      <span className="font-medium">{minimumAmount} FCFA</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card className="shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Publication</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Statut :</span>
                  <Badge variant={isActive ? "default" : "secondary"}>{isActive ? "Actif" : "Inactif"}</Badge>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="is-active"
                    checked={isActive}
                    onCheckedChange={(checked) => setIsActive(checked as boolean)}
                  />
                  <Label htmlFor="is-active" className="text-sm">
                    Activer immédiatement
                  </Label>
                </div>

                <Separator />

                <div className="space-y-3">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button className="w-full" disabled={!isFormValid}>
                        <Save className="h-4 w-4 mr-2" />
                        Créer le code promo
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>

                        <AlertDialogTitle>Créer ce code promo ?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Le code promo "{promoCode}" sera créé et{" "}
                          {isActive ? "activé immédiatement" : "restera inactif"}.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                        <AlertDialogAction onClick={handleSave}>Créer</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>

                  <Button variant="outline" className="w-full bg-transparent">
                    <Eye className="h-4 w-4 mr-2" />
                    Aperçu client
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Résumé */}
            {isFormValid && (
              <Card className="shadow-sm bg-primary/5 border-primary/20">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg text-primary">Résumé</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>Code :</span>
                    <span className="font-mono font-medium">{promoCode}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Réduction :</span>
                    <span className="font-medium">
                      {discountType === "percentage" ? `${discountValue}%` : `${discountValue} FCFA`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Produits :</span>
                    <span className="font-medium">
                      {applyToAll ? "Tous" : `${selectedProducts.length} sélectionné(s)`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Statut :</span>
                    <span className="font-medium">{isActive ? "Actif" : "Inactif"}</span>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
