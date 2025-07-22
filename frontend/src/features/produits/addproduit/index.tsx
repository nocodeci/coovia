"use client"

import { useState, useEffect } from "react"
import type React from "react"
import {
  Eye,
  Save,
  Package,
  ImageIcon,
  Video,
  Plus,
  X,
  FileImage,
  Upload,
  Check,
  ChevronsUpDown,
  BookOpen,
  RefreshCw,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
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
import { RichTextEditor } from "@/components/editor/rich-text-editor"
import { ShineBorder } from "@/components/magicui/shine-border"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { TopBar } from "./components/top-bar-simple"

const categories = [
  { value: "logiciel", label: "Logiciel" },
  { value: "formation", label: "Formation" },
  { value: "ebook", label: "E-book" },
  { value: "template", label: "Template" },
  { value: "plugin", label: "Plugin" },
  { value: "consultation", label: "Consultation" },
]

const productTypes = [
  {
    id: "telechargeable",
    title: "Téléchargeable",
    description: "Fichiers numériques livrés instantanément",
    icon: Package,
  },
  {
    id: "cours",
    title: "Cours",
    description: "Formations structurées et interactives",
    icon: BookOpen,
  },
  {
    id: "abonnement",
    title: "Abonnement",
    description: "Produits avec facturation récurrente",
    icon: RefreshCw,
  },
]

interface UploadedFile {
  id: string
  name: string
  size: number
  type: string
  preview?: string
}

export default function AddProduct() {
  const [productName, setProductName] = useState("")
  const [selectedType, setSelectedType] = useState("telechargeable")
  const [category, setCategory] = useState("")
  const [price, setPrice] = useState("")
  const [description, setDescription] = useState("")
  const [promotionalPrice, setPromotionalPrice] = useState("")
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [featuredImage, setFeaturedImage] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isVideoDialogOpen, setIsVideoDialogOpen] = useState(false)
  const [videoUrl, setVideoUrl] = useState("")
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  // États pour les combobox
  const [openCategory, setOpenCategory] = useState(false)

  // Calculer si le formulaire est valide
  const isFormValid = productName.trim() && category && selectedType

  // Détecter les changements non sauvegardés
  useEffect(() => {
    const hasChanges =
      productName ||
      category !== "" ||
      price ||
      description ||
      promotionalPrice ||
      uploadedFiles.length > 0 ||
      featuredImage
    setHasUnsavedChanges(true)
  }, [productName, category, price, description, promotionalPrice, uploadedFiles, featuredImage])

  // Gestionnaire pour appliquer les suggestions de recherche
  const handleSuggestionApply = (type: string, value: string) => {
    switch (type) {
      case "name":
        if (value) setProductName(value)
        // Focus sur le champ nom si pas de valeur
        if (!value) {
          setTimeout(() => {
            const nameInput = document.getElementById("product-name")
            nameInput?.focus()
          }, 100)
        }
        break
      case "category":
        // Ouvrir le sélecteur de catégorie
        setTimeout(() => {
          setOpenCategory(true)
        }, 100)
        break
      case "price":
        // Focus sur le champ prix
        setTimeout(() => {
          const priceInput = document.getElementById("price")
          priceInput?.focus()
        }, 100)
        break
      case "description":
        // Focus sur l'éditeur de description
        setTimeout(() => {
          const descriptionArea = document.querySelector('[data-testid="rich-text-editor"]')
          if (descriptionArea) {
            ;(descriptionArea as HTMLElement).focus()
          }
        }, 100)
        break
    }
  }

  const handleFileUpload = (files: FileList | null) => {
    if (!files) return
    Array.from(files).forEach((file) => {
      const id = Math.random().toString(36).substr(2, 9)
      const newFile: UploadedFile = {
        id,
        name: file.name,
        size: file.size,
        type: file.type,
      }

      if (file.type.startsWith("image/")) {
        const reader = new FileReader()
        reader.onload = (e) => {
          setUploadedFiles((prev) => prev.map((f) => (f.id === id ? { ...f, preview: e.target?.result as string } : f)))
        }
        reader.readAsDataURL(file)
      }
      setUploadedFiles((prev) => [...prev, newFile])
    })
    toast.success("Fichiers ajoutés", {
      description: `${files.length} fichier(s) ajouté(s) avec succès.`,
      style: {
        background: "hsl(var(--card))",
        color: "hsl(var(--card-foreground))",
        border: "1px solid hsl(var(--border))",
      },
    })
  }

  const removeFile = (id: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== id))
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    handleFileUpload(e.dataTransfer.files)
  }

  const insertVideo = () => {
    if (!videoUrl.trim()) {
      return
    }

    const videoHtml = `<iframe src="${videoUrl}" width="560" height="315" frameborder="0" allowfullscreen style="max-width: 100%; height: auto;"></iframe>`
    setDescription(description + videoHtml)
    setVideoUrl("")
    setIsVideoDialogOpen(false)
    toast.success("Vidéo ajoutée", {
      description: "La vidéo a été insérée avec succès.",
      style: {
        background: "hsl(var(--card))",
        color: "hsl(var(--card-foreground))",
        border: "1px solid hsl(var(--border))",
      },
    })
  }

  const handlePublish = () => {
    toast("🎉 Produit publié avec succès !", {
      description: "Votre produit est maintenant visible par tous les utilisateurs",
      style: {
        background: "hsl(var(--card))",
        color: "hsl(var(--card-foreground))",
        border: "1px solid hsl(var(--primary))",
      },
      action: {
        label: "Voir le produit",
        onClick: () => console.log("Redirection vers le produit"),
      },
    })
    setHasUnsavedChanges(false)
  }

  const handleSaveDraft = () => {
    toast("💾 Brouillon sauvegardé", {
      description: "Votre produit a été sauvegardé en tant que brouillon",
      style: {
        background: "hsl(var(--card))",
        color: "hsl(var(--card-foreground))",
        border: "1px solid hsl(var(--border))",
      },
      action: {
        label: "Continuer",
        onClick: () => console.log("Continuer l'édition"),
      },
    })
    setHasUnsavedChanges(false)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const handleSave = () => {
    if (isFormValid) {
      handlePublish()
    } else {
      handleSaveDraft()
    }
  }

  const handleDiscard = () => {
    setProductName("")
    setSelectedType("telechargeable")
    setCategory("")
    setPrice("")
    setDescription("")
    setPromotionalPrice("")
    setUploadedFiles([])
    setFeaturedImage(null)
    setVideoUrl("")
    setHasUnsavedChanges(false)
    toast.info("Modifications annulées", {
      description: "Toutes les modifications non sauvegardées ont été supprimées",
    })
  }

  const handleBack = () => {
    window.location.href = "/"
  }

  const handlePreview = () => {
    toast.info("Aperçu du produit", {
      description: "Ouverture de l'aperçu dans un nouvel onglet",
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      {/* TopBar avec recherche dynamique - maintenant au niveau racine */}
      <TopBar
        productName={productName || "Produit sans titre"}
        category={category}
        price={price}
        description={description}
        selectedType={selectedType}
        uploadedFilesCount={uploadedFiles.length}
        isFormValid={true}
        hasUnsavedChanges={hasUnsavedChanges}
        onSave={handleSave}
        onDiscard={handleDiscard}
        onBack={handleBack}
        onSuggestionApply={handleSuggestionApply}
      />

      {/* Contenu principal avec padding-top pour compenser le TopBar sticky */}
      <main className="pt-4" style={{ paddingTop: "6rem" }}>
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contenu Principal */}
            <div className="lg:col-span-2 space-y-6">
              {/* Informations de base */}
              <Card className="shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Package className="h-5 w-5 text-primary" />
                    Informations générales
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="product-name" className="text-sm font-medium">
                      Nom du produit <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="product-name"
                      value={productName}
                      onChange={(e) => setProductName(e.target.value)}
                      placeholder="Entrez le nom de votre produit"
                      className="h-12 text-base"
                    />
                  </div>

                  {/* Type de produit */}
                  <div className="space-y-4">
                    <Label className="text-sm font-medium">
                      Type de produit <span className="text-destructive">*</span>
                    </Label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {productTypes.map((type) => {
                        const Icon = type.icon
                        const isSelected = selectedType === type.id
                        return (
                          <Card
                            key={type.id}
                            className={cn(
                              "cursor-pointer transition-all border-2 relative hover:shadow-sm",
                              isSelected ? "border-primary bg-primary/5" : "border-border hover:border-primary/50",
                            )}
                            onClick={() => setSelectedType(type.id)}
                          >
                            {isSelected && (
                              <div className="absolute -top-2 -right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                                <Check className="w-3 h-3 text-primary-foreground" />
                              </div>
                            )}
                            <CardContent className="p-4">
                              <div className="flex items-start space-x-3">
                                <div
                                  className={cn(
                                    "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
                                    isSelected ? "bg-primary text-primary-foreground" : "bg-muted",
                                  )}
                                >
                                  <Icon className="w-5 h-5" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h3 className="font-medium text-sm">{type.title}</h3>
                                  <p className="text-xs text-muted-foreground mt-1">{type.description}</p>
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
                    <Label className="text-sm font-medium">
                      Catégorie <span className="text-destructive">*</span>
                    </Label>
                    <Popover open={openCategory} onOpenChange={setOpenCategory}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={openCategory}
                          className="w-full h-12 justify-between bg-transparent"
                        >
                          {category
                            ? categories.find((cat) => cat.value === category)?.label
                            : "Sélectionner une catégorie..."}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[--radix-popover-trigger-width] min-w-[var(--radix-popover-trigger-width)] max-h-[300px] p-0">
                        <Command>
                          <CommandInput placeholder="Rechercher une catégorie..." className="h-9" />
                          <CommandList>
                            <CommandEmpty>Aucune catégorie trouvée.</CommandEmpty>
                            <CommandGroup>
                              {categories.map((cat) => (
                                <CommandItem
                                  key={cat.value}
                                  value={cat.value}
                                  onSelect={(currentValue) => {
                                    setCategory(currentValue === category ? "" : currentValue)
                                    setOpenCategory(false)
                                  }}
                                >
                                  {cat.label}
                                  <Check
                                    className={cn(
                                      "ml-auto h-4 w-4",
                                      category === cat.value ? "opacity-100" : "opacity-0",
                                    )}
                                  />
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* Section Prix */}
                  <div className="space-y-4">
                    <Label className="text-sm font-medium">Tarification</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="price" className="text-sm font-medium text-muted-foreground">
                          Prix de vente
                        </Label>
                        <div className="relative">
                          <Input
                            id="price"
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            className="h-12 pl-16 text-base"
                            placeholder="0"
                          />
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-medium">
                            FCFA
                          </span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Label htmlFor="promotional-price" className="text-sm font-medium text-muted-foreground">
                            Prix promotionnel
                          </Label>
                          <Badge variant="secondary" className="text-xs">
                            Optionnel
                          </Badge>
                        </div>
                        <div className="relative">
                          <Input
                            id="promotional-price"
                            type="number"
                            value={promotionalPrice}
                            onChange={(e) => setPromotionalPrice(e.target.value)}
                            className="h-12 pl-16 text-base"
                            placeholder="0"
                          />
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-medium">
                            FCFA
                          </span>
                        </div>
                        {promotionalPrice && price && Number(promotionalPrice) < Number(price) && (
                          <p className="text-xs text-green-600 font-medium">
                            Économie de {Math.round(((Number(price) - Number(promotionalPrice)) / Number(price)) * 100)}
                            %
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Aperçu des prix */}
                    {(price || promotionalPrice) && (
                      <div className="bg-muted/30 rounded-lg p-4 border">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Aperçu client :</span>
                          <div className="flex items-center gap-2">
                            {promotionalPrice && price && Number(promotionalPrice) < Number(price) ? (
                              <>
                                <span className="text-lg font-semibold text-green-600">{promotionalPrice} FCFA</span>
                                <span className="text-sm text-muted-foreground line-through">{price} FCFA</span>
                              </>
                            ) : (
                              <span className="text-lg font-semibold">{price || promotionalPrice} FCFA</span>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Description */}
              <Card className="shadow-sm">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Description du produit</CardTitle>
                    <AlertDialog open={isVideoDialogOpen} onOpenChange={setIsVideoDialogOpen}>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Video className="h-4 w-4 mr-2" />
                          Ajouter vidéo
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Ajouter une vidéo</AlertDialogTitle>
                          <AlertDialogDescription>
                            Entrez l'URL de votre vidéo YouTube, Vimeo ou tout autre lien vidéo pour l'intégrer à la
                            description de votre produit.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <div className="py-4">
                          <div className="space-y-2">
                            <Label htmlFor="video-url">URL de la vidéo</Label>
                            <Input
                              id="video-url"
                              placeholder="https://www.youtube.com/watch?v=..."
                              value={videoUrl}
                              onChange={(e) => setVideoUrl(e.target.value)}
                            />
                          </div>
                        </div>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="border-border hover:bg-muted">Annuler</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={insertVideo}
                            className="bg-primary text-primary-foreground hover:bg-primary/90"
                          >
                            Insérer la vidéo
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardHeader>
                <CardContent>
                  <RichTextEditor value={description} onChange={setDescription} />
                </CardContent>
              </Card>

              {/* Fichiers */}
              <Card className="shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg">Fichiers du produit</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div
                    className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                      isDragging
                        ? "border-primary bg-primary/5 scale-[1.02]"
                        : "border-muted-foreground/25 hover:border-primary/50"
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">Glissez vos fichiers ici</h3>
                    <p className="text-sm text-muted-foreground mb-4">ou cliquez pour sélectionner</p>
                    <Button
                      variant="outline"
                      onClick={() => {
                        const input = document.createElement("input")
                        input.type = "file"
                        input.multiple = true
                        input.onchange = (e) => {
                          const target = e.target as HTMLInputElement
                          handleFileUpload(target.files)
                        }
                        input.click()
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Choisir des fichiers
                    </Button>
                  </div>

                  {uploadedFiles.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="font-medium">Fichiers ajoutés ({uploadedFiles.length})</h4>
                      <div className="grid gap-3">
                        {uploadedFiles.map((file) => (
                          <div
                            key={file.id}
                            className="flex items-center justify-between p-4 border rounded-lg bg-muted/30"
                          >
                            <div className="flex items-center gap-3">
                              {file.preview ? (
                                <img
                                  src={file.preview || "/placeholder.svg"}
                                  alt={file.name}
                                  className="w-12 h-12 object-cover rounded"
                                />
                              ) : (
                                <div className="w-12 h-12 bg-muted rounded flex items-center justify-center">
                                  <FileImage className="h-6 w-6 text-muted-foreground" />
                                </div>
                              )}
                              <div>
                                <p className="font-medium">{file.name}</p>
                                <p className="text-sm text-muted-foreground">{formatFileSize(file.size)}</p>
                              </div>
                            </div>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Supprimer ce fichier ?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Cette action ne peut pas être annulée. Le fichier "{file.name}" sera définitivement
                                    supprimé.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => removeFile(file.id)}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  >
                                    Supprimer
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Image du produit */}
              <Card className="shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg">Image du produit</CardTitle>
                </CardHeader>
                <CardContent>
                  {featuredImage ? (
                    <div className="relative group">
                      <img
                        src={featuredImage || "/placeholder.svg"}
                        alt="Image du produit"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm" className="bg-destructive/80 hover:bg-destructive">
                              <X className="h-4 w-4 mr-2" />
                              Supprimer
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Supprimer l'image du produit ?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Cette action ne peut pas être annulée. L'image du produit sera définitivement supprimée.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Annuler</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => setFeaturedImage(null)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Supprimer
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      className="w-full h-48 border-dashed bg-muted/30 hover:bg-muted/50 transition-colors"
                      onClick={() => {
                        const input = document.createElement("input")
                        input.type = "file"
                        input.accept = "image/*"
                        input.onchange = (e) => {
                          const file = (e.target as HTMLInputElement).files?.[0]
                          if (file) {
                            const reader = new FileReader()
                            reader.onload = (e) => setFeaturedImage(e.target?.result as string)
                            reader.readAsDataURL(file)
                          }
                        }
                        input.click()
                      }}
                    >
                      <div className="text-center">
                        <ImageIcon className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
                        <div className="font-medium">Ajouter une image</div>
                        <div className="text-sm text-muted-foreground mt-1">Cliquez pour sélectionner</div>
                      </div>
                    </Button>
                  )}
                </CardContent>
              </Card>

              {/* Section Publication avec ShineBorder */}
              <div className="relative">
                <Card className="relative shadow-sm bg-background">
                  <ShineBorder />
                  <CardHeader className="pb-4 relative z-10">
                    <CardTitle className="text-lg">Publication</CardTitle>
                    <CardDescription>Gérez la publication et la visibilité de votre produit</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 relative z-10">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Statut :</span>
                      <Badge variant={isFormValid ? "default" : "secondary"}>
                        {isFormValid ? "Prêt à publier" : "Brouillon"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Visibilité :</span>
                      <Badge variant="outline">Publique</Badge>
                    </div>
                    <Separator />
                    <div className="flex items-center gap-2">
                      <Checkbox id="featured" />
                      <Label htmlFor="featured" className="text-sm">
                        Produit en vedette
                      </Label>
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col space-y-3 pt-6 relative z-10">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button className="w-full" disabled={!isFormValid}>
                          Publier le produit
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Publier ce produit ?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Votre produit sera publié et visible par tous les utilisateurs. Assurez-vous que toutes les
                            informations sont correctes.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="border-border hover:bg-muted">Annuler</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={handlePublish}
                            className="bg-primary text-primary-foreground hover:bg-primary/90"
                          >
                            Publier
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" className="w-full bg-transparent">
                          <Save className="h-4 w-4 mr-2" />
                          Sauvegarder comme brouillon
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Sauvegarder en brouillon ?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Votre produit sera sauvegardé en tant que brouillon. Vous pourrez le modifier et le publier
                            plus tard.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="border-border hover:bg-muted">Annuler</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={handleSaveDraft}
                            className="bg-primary text-primary-foreground hover:bg-primary/90"
                          >
                            Sauvegarder
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>

                    <Button variant="outline" className="w-full bg-transparent" onClick={handlePreview}>
                      <Eye className="h-4 w-4 mr-2" />
                      Aperçu du produit
                    </Button>
                  </CardFooter>
                </Card>
              </div>

              {/* Résumé */}
              <Card className="shadow-sm bg-primary/5 border-primary/20">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg text-primary">Résumé</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Nom :</span>
                    <span className="font-medium">{productName || "Non défini"}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Type :</span>
                    <span className="font-medium">
                      {productTypes.find((t) => t.id === selectedType)?.title || "Non défini"}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Catégorie :</span>
                    <span className="font-medium">
                      {categories.find((c) => c.value === category)?.label || "Non définie"}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Prix :</span>
                    <span className="font-medium">{price ? `${price} FCFA` : "Gratuit"}</span>
                  </div>
                  {promotionalPrice && (
                    <div className="flex justify-between text-sm">
                      <span>Prix promo :</span>
                      <span className="font-medium text-green-600">{promotionalPrice} FCFA</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span>Fichiers :</span>
                    <span className="font-medium">{uploadedFiles.length}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  ) 
}
