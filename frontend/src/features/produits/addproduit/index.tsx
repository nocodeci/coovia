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
  ArrowLeft,
  Image,
  File,
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
import { useNavigate } from "@tanstack/react-router"
import apiService from "@/lib/api"
import MediaSelectorDialog from "@/components/MediaSelectorDialog"
import { MediaItem } from "@/services/mediaService"


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

// Catégories adaptées selon le type de produit
const getCategoriesByType = (type: string) => {
  switch (type) {
    case "telechargeable":
      return [
        { id: "1", name: "Templates" },
        { id: "2", name: "Graphiques" },
        { id: "3", name: "Audio" },
        { id: "4", name: "Vidéo" },
        { id: "5", name: "Documents" },
        { id: "6", name: "Code" },
        { id: "7", name: "Photos" },
        { id: "8", name: "Illustrations" },
        { id: "9", name: "Fonts" },
        { id: "10", name: "Développement" },
        { id: "11", name: "Design" },
        { id: "12", name: "Marketing" },
        { id: "13", name: "Business" },
        { id: "14", name: "Langues" },
        { id: "15", name: "Musique" },
        { id: "16", name: "Photographie" },
        { id: "17", name: "Écriture" },
        { id: "18", name: "Logiciels" },
        { id: "19", name: "Services" },
        { id: "20", name: "Contenu Premium" },
        { id: "21", name: "Support" },
        { id: "22", name: "Mentorat" },
        { id: "23", name: "Communauté" },
        { id: "24", name: "Autre" },
      ]
    case "cours":
      return [
        { id: "c1", name: "Formation en ligne" },
        { id: "c2", name: "Tutoriel vidéo" },
        { id: "c3", name: "Cours interactif" },
        { id: "c4", name: "Formation technique" },
        { id: "c5", name: "Cours de langues" },
        { id: "c6", name: "Formation business" },
        { id: "c7", name: "Cours de design" },
        { id: "c8", name: "Formation marketing" },
        { id: "c9", name: "Cours de développement" },
        { id: "c10", name: "Formation créative" },
        { id: "c11", name: "Cours de photographie" },
        { id: "c12", name: "Formation musique" },
        { id: "c13", name: "Cours de fitness" },
        { id: "c14", name: "Formation cuisine" },
        { id: "c15", name: "Cours de bien-être" },
        { id: "c16", name: "Formation finance" },
        { id: "c17", name: "Cours de leadership" },
        { id: "c18", name: "Formation vente" },
        { id: "c19", name: "Cours de communication" },
        { id: "c20", name: "Formation entrepreneuriat" },
      ]
    case "abonnement":
      return [
        { id: "a1", name: "Abonnement mensuel" },
        { id: "a2", name: "Abonnement annuel" },
        { id: "a3", name: "Accès premium" },
        { id: "a4", name: "Mentorat continu" },
        { id: "a5", name: "Support prioritaire" },
        { id: "a6", name: "Contenu exclusif" },
        { id: "a7", name: "Communauté privée" },
        { id: "a8", name: "Formation continue" },
        { id: "a9", name: "Coaching personnalisé" },
        { id: "a10", name: "Accès illimité" },
        { id: "a11", name: "Mise à jour continue" },
        { id: "a12", name: "Support technique" },
        { id: "a13", name: "Consultation" },
        { id: "a14", name: "Accès VIP" },
        { id: "a15", name: "Formation avancée" },
      ]
    default:
      return [
        { id: "1", name: "Templates" },
        { id: "2", name: "Graphiques" },
        { id: "3", name: "Audio" },
        { id: "4", name: "Vidéo" },
        { id: "5", name: "Documents" },
        { id: "6", name: "Code" },
        { id: "7", name: "Photos" },
        { id: "8", name: "Illustrations" },
        { id: "9", name: "Fonts" },
        { id: "10", name: "Développement" },
        { id: "11", name: "Design" },
        { id: "12", name: "Marketing" },
        { id: "13", name: "Business" },
        { id: "14", name: "Langues" },
        { id: "15", name: "Musique" },
        { id: "16", name: "Photographie" },
        { id: "17", name: "Écriture" },
        { id: "18", name: "Logiciels" },
        { id: "19", name: "Services" },
        { id: "20", name: "Contenu Premium" },
        { id: "21", name: "Support" },
        { id: "22", name: "Mentorat" },
        { id: "23", name: "Communauté" },
        { id: "24", name: "Autre" },
      ]
  }
}

interface UploadedFile {
  id: string
  name: string
  size: number
  type: string
  preview?: string
  file?: File
}

// États pour les médias sélectionnés
interface MediaState {
  productFiles: MediaItem[]
  productImages: MediaItem[]
  featuredImage: MediaItem | null
}

interface AddProductProps {
  storeId: string
}

export default function AddProduct({ storeId }: AddProductProps) {
  const navigate = useNavigate()

  // Fonction pour nettoyer le HTML et extraire le texte
  const stripHtml = (html: string) => {
    if (!html) return ''
    // Créer un élément temporaire pour extraire le texte
    const tempDiv = document.createElement('div')
    tempDiv.innerHTML = html
    return tempDiv.textContent || tempDiv.innerText || ''
  }

  // États locaux uniquement (pas d'appels API)
  const [productName, setProductName] = useState("")
  const [selectedType, setSelectedType] = useState("telechargeable")
  const [category, setCategory] = useState("")
  const [price, setPrice] = useState("")
  const [description, setDescription] = useState("")
  const [promotionalPrice, setPromotionalPrice] = useState("")
  const [sku, setSku] = useState("")
  const [stockQuantity, setStockQuantity] = useState("")
  const [minStockLevel, setMinStockLevel] = useState("")
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [featuredImage, setFeaturedImage] = useState<string | null>(null)
  const [featuredImageFile, setFeaturedImageFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isVideoDialogOpen, setIsVideoDialogOpen] = useState(false)
  const [videoUrl, setVideoUrl] = useState("")
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [isFeatured, setIsFeatured] = useState(false)
  
  // États pour les médias sélectionnés
  const [selectedMedia, setSelectedMedia] = useState<MediaState>({
    productFiles: [],
    productImages: [],
    featuredImage: null
  })
  
  // États pour les modals de sélection de médias
  const [isMediaSelectorOpen, setIsMediaSelectorOpen] = useState(false)
  const [mediaSelectorType, setMediaSelectorType] = useState<'files' | 'images' | 'featured'>('files')

  // États pour les combobox
  const [openCategory, setOpenCategory] = useState(false)

  // Magasin simulé (côté client uniquement)
  const currentStore = { id: storeId, name: "Boutique sélectionnée" }

  // Générer automatiquement le SKU basé sur le nom du produit
  useEffect(() => {
    if (productName && !sku) {
      const generatedSku = productName
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "")
        .substring(0, 20)
      setSku(generatedSku + "-" + Date.now().toString().slice(-4))
    }
  }, [productName, sku])

  // Réinitialiser la catégorie quand le type change
  useEffect(() => {
    setCategory("")
  }, [selectedType])

  // Validation pour la publication (prix, description et image requis)
  const canPublish = Boolean(
    productName.trim() && 
    category && 
    selectedType && 
    price && 
    description.trim() && 
    selectedMedia.featuredImage
  )

  // Validation pour le brouillon (nom et type requis)
  const canSaveDraft = Boolean(productName.trim() && selectedType)

  // Détecter les changements non sauvegardés
  useEffect(() => {
    const hasChanges =
      productName ||
      category !== "" ||
      price ||
      description ||
      promotionalPrice ||
      sku ||
      stockQuantity ||
      minStockLevel ||
          selectedMedia.productFiles.length > 0 ||
    selectedMedia.featuredImage
    setHasUnsavedChanges(!!hasChanges)
  }, [
    productName,
    category,
    price,
    description,
    promotionalPrice,
    sku,
    stockQuantity,
    minStockLevel,
    selectedMedia,
  ])

  // Générer automatiquement le SKU basé sur le nom du produit
  useEffect(() => {
    if (productName && !sku) {
      const generatedSku = productName
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "")
        .substring(0, 20)
      setSku(generatedSku + "-" + Date.now().toString().slice(-4))
    }
  }, [productName, sku])

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
        file,
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
    })
  }

  const handlePublish = async () => {
    if (!currentStore) {
      toast.error("Erreur", {
        description: "Aucun magasin sélectionné",
      })
      return
    }

    try {
      // Préparer les données du produit pour l'API
      const productData = {
        name: productName,
        description,
        price: Number.parseFloat(price) || 0,
        sale_price: promotionalPrice ? Number.parseFloat(promotionalPrice) : null,
        sku,
        category,
        stock_quantity: Number.parseInt(stockQuantity) || 0,
        min_stock_level: Number.parseInt(minStockLevel) || 0,
        status: "active",
        images: selectedMedia.featuredImage ? [selectedMedia.featuredImage] : [],
        files: selectedMedia.productFiles,
        inventory: {
          quantity: Number.parseInt(stockQuantity) || 0,
          min_level: Number.parseInt(minStockLevel) || 0,
          track_inventory: true,
          low_stock_threshold: Number.parseInt(minStockLevel) || 0,
        },
        attributes: {
          type: selectedType,
          featured: isFeatured,
        },
        seo: {
          meta_title: productName,
          meta_description: stripHtml(description).substring(0, 160),
        },
      }

      // Appel à l'API pour créer le produit
      const response = await apiService.createProduct(storeId, productData)

      if (response.success) {
        toast.success("🎉 Produit publié avec succès !", {
          description: "Votre produit est maintenant visible par tous les utilisateurs",
          action: {
            label: "Voir le produit",
            onClick: () => navigate({ to: `/${storeId}/produits` }),
          },
        })

        setHasUnsavedChanges(false)

        // Rediriger immédiatement vers la liste des produits
        navigate({ to: `/${storeId}/produits` })
      } else {
        throw new Error(response.message || "Erreur lors de la création du produit")
      }
    } catch (error: any) {
      console.error("Erreur lors de la publication:", error)
      toast.error("Erreur lors de la publication", {
        description: error.message || "Veuillez réessayer",
      })
    }
  }

  const handleSaveDraft = async () => {
    if (!currentStore) {
      toast.error("Erreur", {
        description: "Aucun magasin sélectionné",
      })
      return
    }

    try {
      const productData = {
        name: productName || "Produit sans titre",
        description,
        price: Number.parseFloat(price) || 0,
        sale_price: promotionalPrice ? Number.parseFloat(promotionalPrice) : null,
        sku: sku || `draft-${Date.now()}`,
        category: category || "non-categorise",
        stock_quantity: Number.parseInt(stockQuantity) || 0,
        min_stock_level: Number.parseInt(minStockLevel) || 0,
        status: "draft",
        images: selectedMedia.featuredImage ? [selectedMedia.featuredImage] : [],
        files: selectedMedia.productFiles,
        inventory: {
          quantity: Number.parseInt(stockQuantity) || 0,
          min_level: Number.parseInt(minStockLevel) || 0,
          track_inventory: true,
          low_stock_threshold: Number.parseInt(minStockLevel) || 0,
        },
        attributes: {
          type: selectedType,
          featured: isFeatured,
        },
        seo: {
          meta_title: productName,
          meta_description: stripHtml(description).substring(0, 160),
        },
      }

      // Appel à l'API pour créer le brouillon
      const response = await apiService.createProduct(storeId, productData)

      if (response.success) {
        toast.success("💾 Brouillon sauvegardé", {
          description: "Votre produit a été sauvegardé en tant que brouillon",
          action: {
            label: "Continuer",
            onClick: () => console.log("Continuer l'édition"),
          },
        })
        setHasUnsavedChanges(false)
      } else {
        throw new Error(response.message || "Erreur lors de la sauvegarde")
      }
    } catch (error: any) {
      console.error("Erreur lors de la sauvegarde:", error)
      toast.error("Erreur lors de la sauvegarde", {
        description: error.message || "Veuillez réessayer",
      })
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const handleSave = () => {
    if (canPublish) {
      handlePublish()
    } else if (canSaveDraft) {
      handleSaveDraft()
    } else {
      toast.error("Informations manquantes", {
        description: "Veuillez remplir au minimum le nom du produit et le type pour sauvegarder un brouillon",
      })
    }
  }

  const handleDiscard = () => {
    setProductName("")
    setSelectedType("telechargeable")
    setCategory("")
    setPrice("")
    setDescription("")
    setPromotionalPrice("")
    setSku("")
    setStockQuantity("")
    setMinStockLevel("")
    setUploadedFiles([])
    setFeaturedImage(null)
    setFeaturedImageFile(null)
    setVideoUrl("")
    setIsFeatured(false)
    setHasUnsavedChanges(false)
    toast.info("Modifications annulées", {
      description: "Toutes les modifications non sauvegardées ont été supprimées",
    })
  }

  const handleBack = () => {
    navigate({ to: `/${storeId}/produits` })
  }

  const handlePreview = () => {
    toast.info("Aperçu du produit", {
      description: "Ouverture de l'aperçu dans un nouvel onglet",
    })
  }

  const handleFeaturedImageUpload = (file: File) => {
    setFeaturedImageFile(file)
    const reader = new FileReader()
    reader.onload = (e) => setFeaturedImage(e.target?.result as string)
    reader.readAsDataURL(file)
  }

  // Fonctions pour gérer la sélection de médias
  const openMediaSelector = (type: 'files' | 'images' | 'featured') => {
    setMediaSelectorType(type)
    setIsMediaSelectorOpen(true)
  }

  const handleMediaSelect = (media: MediaItem) => {
    switch (mediaSelectorType) {
      case 'files':
        setSelectedMedia(prev => ({
          ...prev,
          productFiles: [...prev.productFiles, media]
        }))
        break
      case 'images':
        setSelectedMedia(prev => ({
          ...prev,
          productImages: [...prev.productImages, media]
        }))
        break
      case 'featured':
        setSelectedMedia(prev => ({
          ...prev,
          featuredImage: media
        }))
        // Mettre à jour l'image featured pour la compatibilité
        // Utiliser la thumbnail si disponible, sinon l'URL du fichier
        const imageUrl = media.thumbnail 
          ? `http://localhost:8000/storage/${media.thumbnail}`
          : `http://localhost:8000/storage/${media.url}`
        setFeaturedImage(imageUrl)
        break
    }
    setIsMediaSelectorOpen(false)
  }

  const removeSelectedMedia = (mediaId: string, type: 'files' | 'images' | 'featured') => {
    switch (type) {
      case 'files':
        setSelectedMedia(prev => ({
          ...prev,
          productFiles: prev.productFiles.filter(m => m.id !== mediaId)
        }))
        break
      case 'images':
        setSelectedMedia(prev => ({
          ...prev,
          productImages: prev.productImages.filter(m => m.id !== mediaId)
        }))
        break
      case 'featured':
        setSelectedMedia(prev => ({
          ...prev,
          featuredImage: null
        }))
        setFeaturedImage(null)
        break
    }
  }



  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      {/* TopBar avec recherche dynamique - maintenant au niveau racine */}
      <TopBar
        productName={productName || "Produit sans titre"}
        isFormValid={canPublish}
        onSave={handleSave}
        onDiscard={handleDiscard}
        onBack={handleBack}
        formData={{
          productName,
          category,
          price,
          description,
          selectedType,
          stockQuantity,
          images: [] // Ajouter les images quand elles seront disponibles
        }}
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

                  {/* SKU - Masqué car généré automatiquement */}
                  {/* <div className="space-y-2">
                    <Label htmlFor="sku" className="text-sm font-medium">
                      SKU (Référence produit)
                    </Label>
                    <Input
                      id="sku"
                      value={sku}
                      onChange={(e) => setSku(e.target.value)}
                      placeholder="Référence unique du produit"
                      className="h-12 text-base"
                    />
                    <p className="text-xs text-muted-foreground">Généré automatiquement si laissé vide</p>
                  </div> */}

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
                            ? getCategoriesByType(selectedType).find((cat) => cat.name === category)?.name
                            : "Sélectionner une catégorie..."}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-(--radix-popover-trigger-width) min-w-[var(--radix-popover-trigger-width)] max-h-[300px] p-0">
                        <Command>
                          <CommandInput placeholder="Rechercher une catégorie..." className="h-9" />
                          <CommandList>
                            <CommandEmpty>Aucune catégorie trouvée.</CommandEmpty>
                            <CommandGroup>
                              {getCategoriesByType(selectedType).map((cat) => (
                                <CommandItem
                                  key={cat.id}
                                  value={cat.name}
                                  onSelect={(currentValue) => {
                                    setCategory(currentValue === category ? "" : currentValue)
                                    setOpenCategory(false)
                                  }}
                                >
                                  {cat.name}
                                  <Check
                                    className={cn(
                                      "ml-auto h-4 w-4",
                                      category === cat.name ? "opacity-100" : "opacity-0",
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
                          Prix de vente <span className="text-destructive">*</span>
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
                        {!price && (
                          <p className="text-xs text-destructive">Le prix est requis pour publier le produit</p>
                        )}
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

                  {/* Gestion des stocks */}
                  <div className="space-y-4">
                    <Label className="text-sm font-medium">Gestion des stocks</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="stock-quantity" className="text-sm font-medium text-muted-foreground">
                          Quantité en stock
                        </Label>
                        <Input
                          id="stock-quantity"
                          type="number"
                          value={stockQuantity}
                          onChange={(e) => setStockQuantity(e.target.value)}
                          className="h-12 text-base"
                          placeholder="0"
                          min="0"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="min-stock-level" className="text-sm font-medium text-muted-foreground">
                          Niveau de stock minimum
                        </Label>
                        <Input
                          id="min-stock-level"
                          type="number"
                          value={minStockLevel}
                          onChange={(e) => setMinStockLevel(e.target.value)}
                          className="h-12 text-base"
                          placeholder="0"
                          min="0"
                        />
                        <p className="text-xs text-muted-foreground">Alerte quand le stock atteint ce niveau</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Description */}
              <Card className="shadow-sm">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Description du produit <span className="text-destructive">*</span></CardTitle>
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
                  {!description.trim() && (
                    <p className="text-xs text-destructive mt-2">La description est requise pour publier le produit</p>
                  )}
                </CardContent>
              </Card>

              {/* Fichiers du produit */}
              <Card className="shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg">Fichiers du produit</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border-2 border-dashed rounded-xl p-8 text-center transition-all border-muted-foreground/25 hover:border-primary/50">
                    <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">Sélectionner des fichiers</h3>
                    <p className="text-sm text-muted-foreground mb-4">Choisissez des fichiers depuis votre bibliothèque média</p>
                    <Button
                      variant="outline"
                      onClick={() => openMediaSelector('files')}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Sélectionner des fichiers
                    </Button>
                  </div>

                  {selectedMedia.productFiles.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="font-medium">Fichiers sélectionnés ({selectedMedia.productFiles.length})</h4>
                      <div className="grid gap-3">
                        {selectedMedia.productFiles.map((file) => (
                          <div
                            key={file.id}
                            className="flex items-center justify-between p-4 border rounded-lg bg-muted/30"
                          >
                            <div className="flex items-center gap-3">
                              {file.thumbnail ? (
                                <img
                                  src={`http://localhost:8000/storage/${file.thumbnail}`}
                                  alt={file.name}
                                  className="w-12 h-12 object-cover rounded"
                                />
                              ) : file.type === 'image' ? (
                                <img
                                  src={`http://localhost:8000/storage/${file.url}`}
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
                                <p className="text-sm text-muted-foreground">
                                  {(file.size / 1024 / 1024).toFixed(1)} MB
                                </p>
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
                                    supprimé de la sélection.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => removeSelectedMedia(file.id, 'files')}
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
                  <CardTitle className="text-lg">Image du produit <span className="text-destructive">*</span></CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedMedia.featuredImage ? (
                    <div className="relative group w-full h-64 rounded-lg overflow-hidden">
                      <img
                        src={`http://localhost:8000/storage/${selectedMedia.featuredImage.thumbnail || selectedMedia.featuredImage.url}`}
                        alt="Image du produit"
                        className="w-full h-full object-cover rounded-lg"
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
                                onClick={() => removeSelectedMedia(selectedMedia.featuredImage!.id, 'featured')}
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
                    <div className="space-y-2">
                      <Button
                        variant="outline"
                        className="w-full h-64 border-dashed bg-muted/30 hover:bg-muted/50 transition-colors"
                        onClick={() => openMediaSelector('featured')}
                      >
                        <div className="text-center">
                          <ImageIcon className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
                          <div className="font-medium">Sélectionner une image</div>
                          <div className="text-sm text-muted-foreground mt-1">Choisissez depuis votre bibliothèque média</div>
                        </div>
                      </Button>
                      <p className="text-xs text-destructive">L'image principale est requise pour publier le produit</p>
                    </div>
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
                      <Badge variant={canPublish ? "default" : "secondary"}>
                        {canPublish ? "Prêt à publier" : "Brouillon"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Visibilité :</span>
                      <Badge variant="outline">Publique</Badge>
                    </div>
                    
                    {/* Indicateurs des champs manquants */}
                    {!canPublish && (
                      <div className="space-y-2 p-3 bg-muted/30 rounded-lg border border-destructive/20">
                        <p className="text-xs font-medium text-destructive">Champs requis pour la publication :</p>
                        <ul className="text-xs space-y-1">
                          {!productName.trim() && <li className="text-destructive">• Nom du produit</li>}
                          {!category && <li className="text-destructive">• Catégorie</li>}
                          {!price && <li className="text-destructive">• Prix de vente</li>}
                          {!description.trim() && <li className="text-destructive">• Description</li>}
                          {!selectedMedia.featuredImage && <li className="text-destructive">• Image principale</li>}
                        </ul>
                      </div>
                    )}
                    
                    <Separator />
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="featured"
                        checked={isFeatured}
                        onCheckedChange={(checked) => setIsFeatured(checked as boolean)}
                      />
                      <Label htmlFor="featured" className="text-sm">
                        Produit en vedette
                      </Label>
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col space-y-3 pt-6 relative z-10">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button className="w-full" disabled={!canPublish}>
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
                    <span>Magasin :</span>
                    <span className="font-medium">{currentStore.name}</span>
                  </div>
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
                      {getCategoriesByType(selectedType).find((c) => c.name === category)?.name || "Non définie"}
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
                    <span>Stock :</span>
                    <span className="font-medium">{stockQuantity || "0"}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Fichiers :</span>
                    <span className="font-medium">{selectedMedia.productFiles.length}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      {/* Sélecteur de médias */}
      <MediaSelectorDialog
        isOpen={isMediaSelectorOpen}
        onClose={() => setIsMediaSelectorOpen(false)}
        onSelect={handleMediaSelect}
        storeId={storeId}
        title={
          mediaSelectorType === 'files' 
            ? "Sélectionner des fichiers" 
            : mediaSelectorType === 'images'
            ? "Sélectionner des images"
            : "Sélectionner une image principale"
        }
        allowMultiple={mediaSelectorType !== 'featured'}
      />
    </div>
  )
} 