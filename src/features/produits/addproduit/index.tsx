import { useState } from "react"
import {
  ArrowLeft,
  Eye,
  MoreHorizontal,
  Package,
  BookOpen,
  Upload,
  Check,
  Store,
  Bell,
  Grid3X3,
  Search,
  User,
  RefreshCw,
  X,
  FileImage,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import { SimpleEditor } from '@/components/tiptap-templates/simple/simple-editor'


const categories = [
  "Arts Créatifs",
  "Logiciel",
  "E-book",
  "Cours en ligne",
  "Template",
  "Plugin",
  "Consultation",
  "Maintenance",
  "Formation",
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

const pricingModels = ["Paiement unique", "Abonnement mensuel", "Abonnement annuel", "Paiement à l'usage", "Gratuit"]

interface UploadedFile {
  id: string
  name: string
  size: number
  type: string
  preview?: string
}

export default function AddProduct() {
  const { toast } = useToast()
  const [selectedType, setSelectedType] = useState("telechargeable")
  const [productName, setProductName] = useState("")
  const [category, setCategory] = useState("")
  const [pricingModel, setPricingModel] = useState("Paiement unique")
  const [price, setPrice] = useState("")
  const [promotionalPrice, setPromotionalPrice] = useState("")
  const [description, ] = useState("")
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [isDragging, setIsDragging] = useState(false)

  // Options avancées
  const [autoReduction, setAutoReduction] = useState(false)
  const [validityPeriod, setValidityPeriod] = useState(false)
  const [customUrl, setCustomUrl] = useState(false)
  const [postPurchaseGuide, setPostPurchaseGuide] = useState(false)
  const [passwordProtection, setPasswordProtection] = useState(false)
  const [watermarkFiles, setWatermarkFiles] = useState(true)
  const [purchaseLimit, setPurchaseLimit] = useState(false)
  const [hideFromStore, setHideFromStore] = useState(false)

  const handleGoBack = () => {
    window.history.back()
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

      // Créer une preview pour les images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onload = (e) => {
          setUploadedFiles(prev => prev.map(f => 
            f.id === id ? { ...f, preview: e.target?.result as string } : f
          ))
        }
        reader.readAsDataURL(file)
      }

      setUploadedFiles(prev => [...prev, newFile])
    })

    toast({
      title: "Fichiers ajoutés",
      description: `${files.length} fichier(s) ajouté(s) avec succès.`,
    })
  }

  const removeFile = (id: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== id))
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
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

  const handleSubmit = () => {
    if (!productName || !category) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive",
      })
      return
    }

    const productData = {
      name: productName,
      type: selectedType,
      category,
      pricingModel,
      price,
      promotionalPrice,
      description,
      files: uploadedFiles,
      options: {
        autoReduction,
        validityPeriod,
        customUrl,
        postPurchaseGuide,
        passwordProtection,
        watermarkFiles,
        purchaseLimit,
        hideFromStore,
      }
    }

    console.log("Publication du produit:", productData)
    
    toast({
      title: "Produit publié",
      description: "Votre produit a été publié avec succès !",
    })
  }

  const isFormValid = productName && category && (uploadedFiles.length > 0 || selectedType === "cours")

  return (
    <div className="min-h-screen bg-background">
      {/* Header personnalisé */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="flex h-16 items-center px-6">
          {/* Left side */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={handleGoBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
            <h1 className="text-lg font-semibold">Ajouter un produit</h1>
          </div>

          {/* Center - Search */}
          <div className="flex-1 max-w-md mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Trouvez n'importe quoi : Appuyez sur espace sur votre clavier"
                className="pl-10 bg-muted/50"
              />
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm">
              <Store className="h-4 w-4 mr-2" />
              Visiter ma boutique
            </Button>
            <Button variant="ghost" size="sm">
              <Bell className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Avatar className="h-8 w-8">
              <AvatarImage src="/placeholder.svg?height=32&width=32" />
              <AvatarFallback>
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="px-6 py-2 bg-muted/50">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
            <span>Progression de création</span>
            <span>{isFormValid ? "85" : "45"}%</span>
          </div>
          <Progress value={isFormValid ? 85 : 45} className="h-2" />
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Informations de base */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Informations de base
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Nom du produit */}
              <div className="space-y-2">
                <Label htmlFor="product-name" className="text-sm font-medium">
                  Nom du produit <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="product-name"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="Entrez le nom de votre produit"
                  className="h-11"
                />
              </div>

              {/* Type de produit */}
              <div className="space-y-4">
                <Label className="text-sm font-medium">Type de produit</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

              {/* Catégorie et Modèle de tarification */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="category" className="text-sm font-medium">
                    Catégorie <span className="text-destructive">*</span>
                  </Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger className="h-12 w-full">
                      <SelectValue placeholder="Sélectionner une catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat.toLowerCase()}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Modèle de tarification */}
                <div className="space-y-2">
                  <Label htmlFor="pricing-model" className="text-sm font-medium">
                    Modèle de tarification
                  </Label>
                  <Select value={pricingModel} onValueChange={setPricingModel}>
                    <SelectTrigger className="h-12 w-full">
                      <SelectValue placeholder="Sélectionner un modèle" />
                    </SelectTrigger>
                    <SelectContent>
                      {pricingModels.map((model) => (
                        <SelectItem key={model} value={model}>
                          {model}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Prix */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="price" className="text-sm font-medium">
                    Prix
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">FCFA</span>
                    <Input
                      id="price"
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="pl-16 h-11"
                      placeholder="0"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="promotional-price" className="text-sm font-medium">
                    Prix promotionnel
                    <Badge variant="secondary" className="ml-2 text-xs">
                      Optionnel
                    </Badge>
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">FCFA</span>
                    <Input
                      id="promotional-price"
                      type="number"
                      value={promotionalPrice}
                      onChange={(e) => setPromotionalPrice(e.target.value)}
                      className="pl-16 h-11"
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Description du produit
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium">
                  Description détaillée
                </Label>
                <SimpleEditor />
              </div>
            </CardContent>
          </Card>

          {/* Fichiers */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Fichiers du produit
                {selectedType !== "cours" && <span className="text-destructive">*</span>}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Zone de drop */}
              <div
                className={cn(
                  "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
                  isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25",
                )}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Glissez vos fichiers ici</h3>
                <p className="text-sm text-muted-foreground mb-4">ou cliquez pour sélectionner des fichiers</p>
                <Button
                  variant="outline"
                  onClick={() => {
                    const input = document.createElement('input')
                    input.type = 'file'
                    input.multiple = true
                    input.onchange = (e) => {
                      const target = e.target as HTMLInputElement
                      handleFileUpload(target.files)
                    }
                    input.click()
                  }}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Choisir des fichiers
                </Button>
              </div>

              {/* Liste des fichiers uploadés */}
              {uploadedFiles.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-sm font-medium">Fichiers ajoutés ({uploadedFiles.length})</h4>
                  <div className="space-y-2">
                    {uploadedFiles.map((file) => (
                      <div key={file.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          {file.preview ? (
                            <img src={file.preview} alt={file.name} className="w-10 h-10 object-cover rounded" />
                          ) : (
                            <div className="w-10 h-10 bg-muted rounded flex items-center justify-center">
                              <FileImage className="h-5 w-5 text-muted-foreground" />
                            </div>
                          )}
                          <div>
                            <p className="text-sm font-medium">{file.name}</p>
                            <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(file.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Options avancées */}
          <Card>
            <CardHeader>
              <CardTitle>Options avancées</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Réduction automatique */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <Label className="text-sm font-medium">Réduction automatique</Label>
                    <Badge variant="secondary" className="text-xs">
                      Premium
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Offrez des réductions automatiques aux clients lors du 3ème rappel d'abandon.
                  </p>
                </div>
                <Switch checked={autoReduction} onCheckedChange={setAutoReduction} />
              </div>

              <Separator />

              {/* Période de validité */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-sm font-medium">Période de validité du prix</Label>
                  <p className="text-sm text-muted-foreground">
                    Définissez les dates de début et de fin de votre prix de vente
                  </p>
                </div>
                <Switch checked={validityPeriod} onCheckedChange={setValidityPeriod} />
              </div>

              <Separator />

              {/* URL personnalisée */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-sm font-medium">URL personnalisée</Label>
                  <p className="text-sm text-muted-foreground">Personnalisez l'URL de votre produit</p>
                </div>
                <Switch checked={customUrl} onCheckedChange={setCustomUrl} />
              </div>

              <Separator />

              {/* Guide après-achat */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-sm font-medium">Guide après-achat</Label>
                  <p className="text-sm text-muted-foreground">
                    Ajoutez des instructions utiles que les clients verront après l'achat
                  </p>
                </div>
                <Switch checked={postPurchaseGuide} onCheckedChange={setPostPurchaseGuide} />
              </div>

              <Separator />

              {/* Protection par mot de passe */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-sm font-medium">Protection par mot de passe</Label>
                  <p className="text-sm text-muted-foreground">
                    Exigez un mot de passe pour accéder aux fichiers après l'achat
                  </p>
                </div>
                <Switch checked={passwordProtection} onCheckedChange={setPasswordProtection} />
              </div>

              <Separator />

              {/* Filigrane */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-sm font-medium">Filigranes automatiques</Label>
                  <p className="text-sm text-muted-foreground">
                    Ajoutez automatiquement des filigranes avec les détails du client
                  </p>
                </div>
                <Switch checked={watermarkFiles} onCheckedChange={setWatermarkFiles} />
              </div>

              <Separator />

              {/* Limite d'achat */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-sm font-medium">Limite d'achat</Label>
                  <p className="text-sm text-muted-foreground">
                    Limitez le nombre de fois où ce produit peut être acheté
                  </p>
                </div>
                <Switch checked={purchaseLimit} onCheckedChange={setPurchaseLimit} />
              </div>

              <Separator />

              {/* Masquer de la boutique */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-sm font-medium">Masquer de la boutique</Label>
                  <p className="text-sm text-muted-foreground">Ce produit ne sera visible que via un lien direct</p>
                </div>
                <Switch checked={hideFromStore} onCheckedChange={setHideFromStore} />
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex items-center justify-between pt-6 pb-8">
            <Button variant="outline" onClick={handleGoBack}>
              Annuler
            </Button>
            <div className="flex items-center space-x-3">
              <Button variant="outline">
                <Eye className="h-4 w-4 mr-2" />
                Aperçu
              </Button>
              <Button onClick={handleSubmit} disabled={!isFormValid}>
                Publier le produit
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Sauvegarder comme brouillon</DropdownMenuItem>
                  <DropdownMenuItem>Dupliquer</DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive">Supprimer</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}