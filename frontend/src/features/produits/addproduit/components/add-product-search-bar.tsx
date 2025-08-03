"use client"

import type React from "react"
import { useState, useEffect, useRef, useMemo } from "react"
import { AnimatePresence, motion } from "framer-motion"
import {
  ArrowLeft,
  MoreHorizontal,
  Search,
  Plus,
  Download,
  FileText,
  Users,
  Package,
  Settings,
  Sparkles,
  ArrowRight,
  DollarSign,
  Activity,
  ShoppingCart,
  Clock,
  CheckCircle,
  XCircle,
  Filter,
  SortAsc,
  Bell,
  TrendingUp,
  BarChart3,
  Eye,
  Zap,
  Tag,
  Archive,
  ArrowUpDown,
  X,
  Save,
  Copy,
  HelpCircle,
  ImageIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

// Animation variants pour l'ajout de produit
const ANIMATION_VARIANTS = {
  "idle-search": { scale: 1.2, y: 0, bounce: 0.4 },
  "search-idle": { scale: 0.9, y: 0, bounce: 0.5 },
  "idle-filter": { scale: 1.1, y: -2, bounce: 0.4 },
  "filter-idle": { scale: 0.9, y: 2, bounce: 0.5 },
  "idle-actions": { scale: 1.3, y: 0, bounce: 0.3 },
  "actions-idle": { scale: 0.8, y: 0, bounce: 0.5 },
  "search-filter": { scale: 1.1, y: -1, bounce: 0.4 },
  "filter-search": { scale: 1.1, y: 1, bounce: 0.4 },
} as const

const BOUNCE_VARIANTS = {
  idle: 0.5,
  search: 0.4,
  filter: 0.4,
  actions: 0.3,
  "idle-search": 0.4,
  "search-idle": 0.5,
  "idle-filter": 0.4,
  "filter-idle": 0.5,
  "idle-actions": 0.3,
  "actions-idle": 0.5,
  "search-filter": 0.4,
  "filter-search": 0.4,
} as const

type View = "idle" | "search" | "filter" | "actions" | "analytics" | "notifications"

// Composants pour chaque vue du Dynamic Island
const IdleView = ({ onViewChange, productName, isFormValid, formData }: { 
  onViewChange: (view: View) => void
  productName?: string
  isFormValid?: boolean
  formData?: {
    productName?: string
    category?: string
    price?: string
    description?: string
    selectedType?: string
    stockQuantity?: string
    images?: string[]
  }
}) => {
  const [currentStatIndex, setCurrentStatIndex] = useState(0)
  
  const stats = [
    {
      title: "Nom du produit",
      value: productName && productName.trim() !== "" ? productName : "Nom du produit requis",
      icon: Package,
      color: productName && productName.trim() !== "" ? "text-green-400" : "text-red-400",
      bgColor: productName && productName.trim() !== "" ? "bg-green-500/20" : "bg-red-500/20"
    },
    {
      title: "Type de produit",
      value: formData?.selectedType ? 
        (formData.selectedType === "telechargeable" ? "Téléchargeable" : 
         formData.selectedType === "cours" ? "Cours" : 
         formData.selectedType === "abonnement" ? "Abonnement" : "Type requis") : 
        "Type requis",
      icon: Package,
      color: formData?.selectedType ? "text-green-400" : "text-red-400",
      bgColor: formData?.selectedType ? "bg-green-500/20" : "bg-red-500/20"
    },
    {
      title: "Catégorie",
      value: formData?.category && formData.category.trim() !== "" ? formData.category : "Catégorie requise",
      icon: Tag,
      color: formData?.category && formData.category.trim() !== "" ? "text-green-400" : "text-red-400",
      bgColor: formData?.category && formData.category.trim() !== "" ? "bg-green-500/20" : "bg-red-500/20"
    },
    {
      title: "Prix",
      value: formData?.price && formData.price.trim() !== "" ? `${formData.price} FCFA` : "Prix requis",
      icon: DollarSign,
      color: formData?.price && formData.price.trim() !== "" ? "text-green-400" : "text-red-400",
      bgColor: formData?.price && formData.price.trim() !== "" ? "bg-green-500/20" : "bg-red-500/20"
    },
    {
      title: "Description",
      value: formData?.description && formData.description.trim() !== "" ? "Description fournie" : "Description requise",
      icon: FileText,
      color: formData?.description && formData.description.trim() !== "" ? "text-green-400" : "text-red-400",
      bgColor: formData?.description && formData.description.trim() !== "" ? "bg-green-500/20" : "bg-red-500/20"
    },
    {
      title: "Stock",
      value: formData?.stockQuantity && formData.stockQuantity.trim() !== "" ? formData.stockQuantity : "Stock requis",
      icon: BarChart3,
      color: formData?.stockQuantity && formData.stockQuantity.trim() !== "" ? "text-green-400" : "text-red-400",
      bgColor: formData?.stockQuantity && formData.stockQuantity.trim() !== "" ? "bg-green-500/20" : "bg-red-500/20"
    },
    {
      title: "Statut global",
      value: isFormValid ? "Prêt à publier" : "Éléments manquants",
      icon: isFormValid ? CheckCircle : XCircle,
      color: isFormValid ? "text-green-400" : "text-red-400",
      bgColor: isFormValid ? "bg-green-500/20" : "bg-red-500/20"
    }
  ]

  // Filtrer les éléments requis qui ne sont pas remplis
  const requiredFields = [
    {
      title: "Nom du produit",
      value: "Nom du produit requis",
      icon: Package,
      color: "text-red-400",
      bgColor: "bg-red-500/20",
      isRequired: !productName || productName.trim() === ""
    },
    {
      title: "Type de produit",
      value: "Type requis",
      icon: Package,
      color: "text-red-400",
      bgColor: "bg-red-500/20",
      isRequired: !formData?.selectedType
    },
    {
      title: "Catégorie",
      value: "Catégorie requise",
      icon: Tag,
      color: "text-red-400",
      bgColor: "bg-red-500/20",
      isRequired: !formData?.category || formData.category.trim() === ""
    },
    {
      title: "Prix",
      value: "Prix requis",
      icon: DollarSign,
      color: "text-red-400",
      bgColor: "bg-red-500/20",
      isRequired: !formData?.price || formData.price.trim() === ""
    },
    {
      title: "Description",
      value: "Description requise",
      icon: FileText,
      color: "text-red-400",
      bgColor: "bg-red-500/20",
      isRequired: !formData?.description || formData.description.trim() === ""
    },
    {
      title: "Stock",
      value: "Stock requis",
      icon: BarChart3,
      color: "text-red-400",
      bgColor: "bg-red-500/20",
      isRequired: !formData?.stockQuantity || formData.stockQuantity.trim() === ""
    },
    {
      title: "Image",
      value: "Image requise",
      icon: ImageIcon,
      color: "text-red-400",
      bgColor: "bg-red-500/20",
      isRequired: !formData?.images || formData?.images?.length === 0
    }
  ]

  // Utiliser seulement les champs requis manquants pour la rotation
  const missingRequiredFields = requiredFields.filter(field => field.isRequired)
  
  // Si tous les champs sont remplis, afficher le statut global
  const displayStats = missingRequiredFields.length > 0 ? missingRequiredFields : [
    {
      title: "Statut global",
      value: isFormValid ? "Prêt à publier" : "Éléments manquants",
      icon: isFormValid ? CheckCircle : XCircle,
      color: isFormValid ? "text-green-400" : "text-red-400",
      bgColor: isFormValid ? "bg-green-500/20" : "bg-red-500/20"
    }
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStatIndex((prev) => (prev + 1) % displayStats.length)
    }, 3000) // Change toutes les 3 secondes

    return () => clearInterval(interval)
  }, [displayStats.length])

  const currentStat = displayStats[currentStatIndex] || displayStats[0]
  const Icon = currentStat.icon

  return (
    <motion.div
      className="flex w-96 items-center gap-3 px-4 py-2"
      layout
    >
      <div className={`p-2 rounded-full ${currentStat.bgColor}`}>
        <Icon className={`h-5 w-5 ${currentStat.color}`} />
      </div>
      <div className="flex-1">
        <AnimatePresence mode="wait">
          <motion.p
            key={currentStatIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5 }}
            className="text-sm font-medium text-white"
          >
            {currentStat.title}
          </motion.p>
        </AnimatePresence>
        <AnimatePresence mode="wait">
          <motion.p
            key={`value-${currentStatIndex}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-xs text-white opacity-70"
          >
            {currentStat.value}
          </motion.p>
        </AnimatePresence>
      </div>
      <div className="flex gap-1">
        <button
          onClick={() => onViewChange("search")}
          className="rounded-full p-1 hover:bg-white/20"
        >
          <Search className="h-3 w-3 text-white" />
        </button>
        <button
          onClick={() => onViewChange("filter")}
          className="rounded-full p-1 hover:bg-white/20"
        >
          <Filter className="h-3 w-3 text-white" />
        </button>
      </div>
    </motion.div>
  )
}

const SearchView = ({ onViewChange, searchQuery, onChange }: { 
  onViewChange: (view: View) => void
  searchQuery: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}) => (
  <div className="flex w-96 items-center gap-3 px-4 py-2">
    <Search className="h-5 w-5 text-blue-400" />
    <input
      type="text"
      value={searchQuery}
      onChange={onChange}
      className="flex-1 bg-transparent outline-none text-sm text-white placeholder-gray-400"
      placeholder="Rechercher dans le formulaire..."
      autoFocus
    />
    <button
      onClick={() => onViewChange("idle")}
      className="rounded-full p-1 hover:bg-white/20"
    >
      <ArrowLeft className="h-3 w-3 text-white" />
    </button>
  </div>
)

const FilterView = ({ onViewChange }: { onViewChange: (view: View) => void }) => (
  <div className="flex w-96 items-center gap-3 px-4 py-2">
    <Filter className="h-5 w-5 text-green-400" />
    <div className="flex-1">
      <p className="text-sm font-medium text-white">Filtres actifs</p>
      <p className="text-xs text-white opacity-70">Catégorie: Œuvre d'art numérique</p>
    </div>
    <div className="flex gap-1">
      <button className="rounded-full bg-green-500/20 px-2 py-1 text-xs text-green-400">
        Œuvre d'art
      </button>
      <button
        onClick={() => onViewChange("idle")}
        className="rounded-full p-1 hover:bg-white/20"
      >
        <ArrowLeft className="h-3 w-3 text-white" />
      </button>
    </div>
  </div>
)

const ActionsView = ({ onViewChange, onSave, onDiscard, isFormValid }: { 
  onViewChange: (view: View) => void
  onSave?: () => void
  onDiscard?: () => void
  isFormValid?: boolean
}) => {
  const [isSaving, setIsSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "success">("idle")

  const handleSave = async () => {
    if (isSaving) return
    
    setIsSaving(true)
    setSaveStatus("saving")
    
    // Simuler un délai de sauvegarde
    setTimeout(() => {
      setIsSaving(false)
      setSaveStatus("success")
      onSave?.()
      
      // Afficher le succès pendant 2 secondes puis retourner à idle
      setTimeout(() => {
        setSaveStatus("idle")
        onViewChange("idle")
      }, 2000)
    }, 2000)
  }

  return (
    <div className="flex w-96 items-center gap-3 px-4 py-2">
      <Zap className="h-5 w-5 text-yellow-400" />
      <div className="flex-1">
        {saveStatus === "saving" ? (
          <>
            <p className="text-sm font-medium text-white">Sauvegarde en cours</p>
            <p className="text-xs text-white opacity-70">Enregistrement du produit...</p>
          </>
        ) : saveStatus === "success" ? (
          <>
            <p className="text-sm font-medium text-white">Sauvegarde réussie</p>
            <p className="text-xs text-white opacity-70">Le produit a été enregistré</p>
          </>
        ) : (
          <>
            <p className="text-sm font-medium text-white">Actions rapides</p>
            <p className="text-xs text-white opacity-70">Sauvegarder, publier, annuler</p>
          </>
        )}
      </div>
      <div className="flex gap-1">
        {saveStatus === "idle" && (
          <>
            <button
              onClick={handleSave}
              disabled={isSaving}
              data-save-button
              className={cn(
                "rounded-full px-2 py-1 text-xs transition-all",
                isSaving 
                  ? "bg-yellow-500/40 text-yellow-300 cursor-not-allowed" 
                  : "bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30"
              )}
            >
              {isSaving ? (
                <>
                  <div className="h-3 w-3 mr-1 animate-spin rounded-full border border-yellow-400 border-t-transparent" />
                  Sauvegarde...
                </>
              ) : (
                <>
                  <Save className="h-3 w-3 mr-1" />
                  {isFormValid ? "Publier" : "Sauvegarder"}
                </>
              )}
            </button>
            <button
              onClick={onDiscard}
              className="rounded-full bg-red-500/20 px-2 py-1 text-xs text-red-400 hover:bg-red-500/30"
            >
              <X className="h-3 w-3 mr-1" />
              Annuler
            </button>
          </>
        )}
        {saveStatus === "saving" && (
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 animate-spin rounded-full border border-yellow-400 border-t-transparent" />
            <span className="text-xs text-yellow-400">Sauvegarde en cours...</span>
          </div>
        )}
        {saveStatus === "success" && (
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-400" />
            <span className="text-xs text-green-400">Sauvegarde réussie</span>
          </div>
        )}
        <button
          onClick={() => onViewChange("idle")}
          className="rounded-full p-1 hover:bg-white/20"
        >
          <ArrowLeft className="h-3 w-3 text-white" />
        </button>
      </div>
    </div>
  )
}

const AnalyticsView = ({ onViewChange }: { onViewChange: (view: View) => void }) => (
  <div className="flex w-96 items-center gap-3 px-4 py-2">
    <BarChart3 className="h-5 w-5 text-purple-400" />
    <div className="flex-1">
      <p className="text-sm font-medium text-white">Analytics</p>
      <p className="text-xs text-white opacity-70">Prévisualisation des performances</p>
    </div>
    <div className="h-1 w-16 overflow-hidden rounded-full bg-white/20">
      <motion.div
        className="h-full bg-purple-400"
        initial={{ width: "0%" }}
        animate={{ width: "80%" }}
        transition={{ duration: 1, ease: "easeOut" }}
      />
    </div>
    <button
      onClick={() => onViewChange("idle")}
      className="rounded-full p-1 hover:bg-white/20"
    >
      <ArrowLeft className="h-3 w-3 text-white" />
    </button>
  </div>
)

const NotificationsView = ({ onViewChange }: { onViewChange: (view: View) => void }) => (
  <div className="flex w-96 items-center gap-3 px-4 py-2">
    <Bell className="h-5 w-5 text-red-400" />
    <div className="flex-1">
      <p className="text-sm font-medium text-white">Aide disponible</p>
      <p className="text-xs text-white opacity-70">Conseils pour optimiser votre produit</p>
    </div>
    <span className="rounded-full bg-red-400/20 px-2 py-0.5 text-xs text-red-400">
      Aide
    </span>
    <button
      onClick={() => onViewChange("idle")}
      className="rounded-full p-1 hover:bg-white/20"
    >
      <ArrowLeft className="h-3 w-3 text-white" />
    </button>
  </div>
)

interface Suggestion {
  id: string
  type: "navigation" | "action" | "quick-action" | "search" | "filter" | "analytics"
  title: string
  description: string
  action: string
  icon: React.ComponentType<{ className?: string }>
  color: string
  value?: string
  priority: number
}

interface AddProductSearchBarProps {
  productName?: string
  isFormValid?: boolean
  onSave?: () => void
  onDiscard?: () => void
  onBack?: () => void
  className?: string
  formData?: {
    productName?: string
    category?: string
    price?: string
    description?: string
    selectedType?: string
    stockQuantity?: string
    images?: string[]
  }
  // Props pour contrôler le Dynamic Island depuis l'extérieur
  currentView?: View
  onViewChange?: (view: View) => void
  onSearchTrigger?: () => void
  onFilterTrigger?: () => void
  onActionsTrigger?: () => void
  onAnalyticsTrigger?: () => void
  onNotificationsTrigger?: () => void
}

export function AddProductSearchBar({
  productName = "Produit sans titre",
  isFormValid = false,
  onSave,
  onDiscard,
  onBack,
  className = "",
  formData,
  currentView: externalCurrentView,
  onViewChange: externalOnViewChange,
  onSearchTrigger,
  onFilterTrigger,
  onActionsTrigger,
  onAnalyticsTrigger,
  onNotificationsTrigger,
}: AddProductSearchBarProps) {
  const [internalCurrentView, setInternalCurrentView] = useState<View>("idle")
  const [searchQuery, setSearchQuery] = useState("")
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [currentContext, setCurrentContext] = useState("")
  const [variantKey, setVariantKey] = useState<string>("idle")
  const searchInputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Utiliser la vue externe si fournie, sinon la vue interne
  const currentView = externalCurrentView ?? internalCurrentView

  // Auto-retour à l'état idle après inactivité
  useEffect(() => {
    if (currentView !== "idle") {
      const timer = setTimeout(() => {
        handleViewChange("idle")
        setSearchQuery("")
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [currentView])

  // Générer les suggestions intelligentes pour l'ajout de produit
  useEffect(() => {
    const newSuggestions: Suggestion[] = []

    // Suggestions de recherche
    newSuggestions.push({
      id: "search-form",
      type: "search",
      title: "Rechercher dans le formulaire",
      description: "Rechercher par section ou champ",
      action: "Commencer la recherche",
      icon: Search,
      color: "text-blue-400",
      priority: 10,
    })

    // Actions rapides
    newSuggestions.push({
      id: "save-product",
      type: "quick-action",
      title: "Sauvegarder le produit",
      description: "Enregistrer le produit en brouillon",
      action: "Sauvegarder",
      icon: Save,
      color: "text-green-400",
      priority: 9,
    })

    newSuggestions.push({
      id: "publish-product",
      type: "action",
      title: "Publier le produit",
      description: "Rendre le produit visible publiquement",
      action: "Publier",
      icon: CheckCircle,
      color: "text-purple-400",
      priority: 8,
    })

    // Navigation vers les sections
    newSuggestions.push({
      id: "preview-product",
      type: "navigation",
      title: "Aperçu du produit",
      description: "Voir comment le produit apparaîtra",
      action: "Voir l'aperçu",
      icon: Eye,
      color: "text-orange-400",
      value: "preview",
      priority: 7,
    })

    newSuggestions.push({
      id: "duplicate-product",
      type: "navigation",
      title: "Dupliquer le produit",
      description: "Créer une copie de ce produit",
      action: "Dupliquer",
      icon: Copy,
      color: "text-indigo-400",
      value: "duplicate",
      priority: 6,
    })

    // Suggestions d'aide
    newSuggestions.push({
      id: "product-help",
      type: "analytics",
      title: "Aide et conseils",
      description: "Obtenir de l'aide pour créer votre produit",
      action: "Voir l'aide",
      icon: HelpCircle,
      color: "text-green-400",
      priority: 5,
    })

    newSuggestions.push({
      id: "optimization-tips",
      type: "analytics",
      title: "Conseils d'optimisation",
      description: "Améliorer la visibilité de votre produit",
      action: "Voir les conseils",
      icon: TrendingUp,
      color: "text-blue-400",
      priority: 4,
    })

    newSuggestions.push({
      id: "category-suggestions",
      type: "analytics",
      title: "Suggestions de catégorie",
      description: "Trouver la meilleure catégorie",
      action: "Voir les suggestions",
      icon: Tag,
      color: "text-cyan-400",
      priority: 3,
    })

    // Actions de gestion
    newSuggestions.push({
      id: "discard-changes",
      type: "navigation",
      title: "Annuler les modifications",
      description: "Supprimer toutes les modifications",
      action: "Annuler",
      icon: X,
      color: "text-red-400",
      value: "discard",
      priority: 2,
    })

    newSuggestions.push({
      id: "settings",
      type: "navigation",
      title: "Paramètres avancés",
      description: "Configurer les options avancées",
      action: "Ouvrir les paramètres",
      icon: Settings,
      color: "text-gray-400",
      value: "settings",
      priority: 1,
    })

    // Trier par priorité
    setSuggestions(newSuggestions.sort((a, b) => b.priority - a.priority))

    // Définir le contexte actuel
    setCurrentContext(`Ajout de produit • ${isFormValid ? "Prêt" : "Brouillon"}`)
  }, [isFormValid])

  const handleViewChange = (newView: View) => {
    if (currentView === newView) return
    setVariantKey(`${currentView}-${newView}`)
    
    // Appeler le callback externe si fourni, sinon utiliser l'état interne
    if (externalOnViewChange) {
      externalOnViewChange(newView)
    } else {
      setInternalCurrentView(newView)
    }

    // Déclencher les callbacks spécifiques
    switch (newView) {
      case "search":
        onSearchTrigger?.()
        break
      case "filter":
        onFilterTrigger?.()
        break
      case "actions":
        onActionsTrigger?.()
        // Déclencher automatiquement la sauvegarde après un délai
        setTimeout(() => {
          const saveButton = document.querySelector('[data-save-button]') as HTMLButtonElement
          if (saveButton) {
            saveButton.click()
          }
        }, 300)
        break
      case "analytics":
        onAnalyticsTrigger?.()
        break
      case "notifications":
        onNotificationsTrigger?.()
        break
    }
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)
  }

  const handleSuggestionClick = (suggestion: Suggestion) => {
    switch (suggestion.type) {
      case "navigation":
        if (suggestion.value === "discard" && onDiscard) {
          onDiscard()
        }
        break
      case "action":
        if (suggestion.id === "publish-product" && onSave) {
          onSave()
        }
        break
      case "quick-action":
        if (suggestion.id === "save-product" && onSave) {
          onSave()
        }
        break
      case "filter":
        // Appliquer le filtre correspondant
        console.log("Filter action:", suggestion.id)
        break
      case "search":
        // Activer la recherche
        console.log("Search action:", suggestion.id)
        break
    }

    handleViewChange("idle")
    setSearchQuery("")

    toast.success("Action effectuée", {
      description: suggestion.action,
    })
  }

  const content = useMemo(() => {
    switch (currentView) {
      case "search":
        return <SearchView onViewChange={handleViewChange} searchQuery={searchQuery} onChange={handleSearch} />
      case "filter":
        return <FilterView onViewChange={handleViewChange} />
      case "actions":
        return <ActionsView onViewChange={handleViewChange} onSave={onSave} onDiscard={onDiscard} isFormValid={isFormValid} />
      case "analytics":
        return <AnalyticsView onViewChange={handleViewChange} />
      case "notifications":
        return <NotificationsView onViewChange={handleViewChange} />
      default:
        return <IdleView onViewChange={handleViewChange} productName={productName} isFormValid={isFormValid} formData={formData} />
    }
  }, [currentView, searchQuery, onSave, onDiscard, isFormValid, productName, formData])

  return (
    <div className={cn("relative flex flex-col items-center", className)} ref={containerRef}>
      {/* Dynamic Island */}
      <div className="h-[200px]">
        <div className="relative flex h-full w-full flex-col justify-center">
          <motion.div
            layout
            transition={{
              type: "spring",
              bounce: BOUNCE_VARIANTS[variantKey as keyof typeof BOUNCE_VARIANTS] ?? 0.5,
            }}
            style={{ borderRadius: 32 }}
            className="mx-auto w-fit min-w-[100px] overflow-hidden rounded-full bg-black"
          >
            <motion.div
              transition={{
                type: "spring",
                bounce: BOUNCE_VARIANTS[variantKey as keyof typeof BOUNCE_VARIANTS] ?? 0.5,
              }}
              initial={{
                scale: 0.9,
                opacity: 0,
                filter: "blur(5px)",
                originX: 0.5,
                originY: 0.5,
              }}
              animate={{
                scale: 1,
                opacity: 1,
                filter: "blur(0px)",
                originX: 0.5,
                originY: 0.5,
                transition: { delay: 0.05 },
              }}
              key={currentView}
            >
              {content}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
