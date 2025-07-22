"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { AnimatePresence, motion } from "framer-motion"
import {
  ArrowLeft,
  MoreHorizontal,
  Eye,
  Copy,
  HelpCircle,
  X,
  Save,
  Search,
  Lightbulb,
  Package,
  Tag,
  DollarSign,
  FileText,
  Upload,
  Sparkles,
  CheckCircle,
  ArrowRight,
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
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface Suggestion {
  id: string
  type: "name" | "category" | "price" | "description" | "files" | "tip"
  title: string
  description: string
  action: string
  icon: React.ComponentType<{ className?: string }>
  color: string
  value?: string
  priority: number
}

interface DynamicSearchBarProps {
  productName?: string
  category?: string
  price?: string
  description?: string
  selectedType?: string
  uploadedFilesCount?: number
  isFormValid?: boolean
  hasUnsavedChanges?: boolean
  onSave?: () => void
  onDiscard?: () => void
  onBack?: () => void
  onSuggestionApply?: (type: string, value: string) => void
  className?: string
}

const categoryPriceRanges: Record<string, { min: number; max: number }> = {
  logiciel: { min: 5000, max: 50000 },
  formation: { min: 10000, max: 100000 },
  ebook: { min: 2000, max: 15000 },
  template: { min: 1000, max: 10000 },
  plugin: { min: 3000, max: 25000 },
  consultation: { min: 15000, max: 200000 },
}

const nameTemplates: Record<string, string[]> = {
  logiciel: ["Logiciel de Gestion Pro", "Application Mobile Premium", "Outil de Productivité"],
  formation: ["Formation Complète en", "Masterclass Avancée", "Cours Intensif"],
  ebook: ["Guide Complet", "Manuel Pratique", "E-book Professionnel"],
  template: ["Template Professionnel", "Modèle Premium", "Kit de Designs"],
  plugin: ["Plugin WordPress", "Extension Premium", "Module Avancé"],
  consultation: ["Consultation Personnalisée", "Session de Coaching", "Accompagnement Expert"],
}

export function DynamicSearchBar({
  productName = "Produit sans titre",
  category = "",
  price = "",
  description = "",
  selectedType = "telechargeable",
  uploadedFilesCount = 0,
  isFormValid = false,
  hasUnsavedChanges = false,
  onSave,
  onDiscard,
  onBack,
  onSuggestionApply,
  className = "",
}: DynamicSearchBarProps) {
  const [isActive, setIsActive] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isDiscardDialogOpen, setIsDiscardDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [currentContext, setCurrentContext] = useState("")
  const [hasAnimated, setHasAnimated] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Animation initiale au montage du composant
  useEffect(() => {
    const timer = setTimeout(() => {
      setHasAnimated(true)
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  // Auto-collapse after inactivity
  useEffect(() => {
    if (isActive) {
      const timer = setTimeout(() => {
        setIsActive(false)
        setShowSuggestions(false)
        setSearchQuery("")
      }, 4000)
      return () => clearTimeout(timer)
    }
  }, [isActive])

  // Générer les suggestions intelligentes
  useEffect(() => {
    const newSuggestions: Suggestion[] = []

    // Suggestions pour le nom du produit
    if (!productName || productName === "Produit sans titre") {
      if (category) {
        const templates = nameTemplates[category] || []
        newSuggestions.push({
          id: "name-template",
          type: "name",
          title: "Suggérer un nom de produit",
          description: `Basé sur la catégorie "${category}"`,
          action: templates[0] || "Nom de produit",
          icon: Package,
          color: "text-blue-400",
          value: templates[0] || "",
          priority: 10,
        })
      } else {
        newSuggestions.push({
          id: "name-required",
          type: "name",
          title: "Ajouter un nom de produit",
          description: "Le nom est obligatoire pour publier",
          action: "Cliquez pour saisir",
          icon: Package,
          color: "text-red-400",
          priority: 10,
        })
      }
    }

    // Suggestions pour la catégorie
    if (!category) {
      newSuggestions.push({
        id: "category-required",
        type: "category",
        title: "Choisir une catégorie",
        description: "Catégorie obligatoire pour la publication",
        action: "Ouvrir le sélecteur",
        icon: Tag,
        color: "text-green-400",
        priority: 9,
      })
    }

    // Suggestions pour le prix
    if (!price && category) {
      const priceRange = categoryPriceRanges[category]
      if (priceRange) {
        newSuggestions.push({
          id: "price-suggestion",
          type: "price",
          title: "Définir un prix",
          description: `Fourchette suggérée: ${priceRange.min} - ${priceRange.max} FCFA`,
          action: "Ajouter un prix",
          icon: DollarSign,
          color: "text-yellow-400",
          priority: 7,
        })
      }
    }

    // Suggestions pour la description
    if (!description.trim()) {
      newSuggestions.push({
        id: "description-required",
        type: "description",
        title: "Ajouter une description",
        description: "Une description détaillée améliore les ventes de 60%",
        action: "Rédiger la description",
        icon: FileText,
        color: "text-purple-400",
        priority: 6,
      })
    } else if (description.length < 100) {
      newSuggestions.push({
        id: "description-improve",
        type: "description",
        title: "Enrichir la description",
        description: "Description trop courte, ajoutez plus de détails",
        action: "Améliorer la description",
        icon: FileText,
        color: "text-orange-400",
        priority: 5,
      })
    }

    // Suggestions pour les fichiers
    if (selectedType === "telechargeable" && uploadedFilesCount === 0) {
      newSuggestions.push({
        id: "files-required",
        type: "files",
        title: "Ajouter des fichiers",
        description: "Produit téléchargeable sans fichiers",
        action: "Uploader des fichiers",
        icon: Upload,
        color: "text-indigo-400",
        priority: 8,
      })
    }

    // Conseils d'optimisation
    if (productName && category && price && description) {
      newSuggestions.push({
        id: "seo-tip",
        type: "tip",
        title: "Optimiser pour le SEO",
        description: "Ajoutez des mots-clés dans la description",
        action: "Voir les conseils SEO",
        icon: Lightbulb,
        color: "text-cyan-400",
        priority: 3,
      })
    }

    // Trier par priorité
    setSuggestions(newSuggestions.sort((a, b) => b.priority - a.priority))

    // Définir le contexte actuel
    if (newSuggestions.length === 0) {
      setCurrentContext("Produit complet ✨")
    } else if (!productName || productName === "Produit sans titre") {
      setCurrentContext("Nom requis")
    } else if (!category) {
      setCurrentContext("Catégorie requise")
    } else if (!price) {
      setCurrentContext("Prix suggéré")
    } else {
      setCurrentContext("Presque fini")
    }
  }, [productName, category, price, description, selectedType, uploadedFilesCount])

  const handleFocus = () => {
    setIsActive(true)
    setTimeout(() => searchInputRef.current?.focus(), 100)
  }

  const handleBlur = (e: React.FocusEvent) => {
    // Ne fermer que si le focus ne va pas vers un élément enfant
    if (!containerRef.current?.contains(e.relatedTarget as Node)) {
      if (!searchQuery) {
        setTimeout(() => {
          setIsActive(false)
          setShowSuggestions(false)
        }, 150)
      }
    }
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)
    setShowSuggestions(query.length > 0 || suggestions.length > 0)
  }

  const handleSave = () => {
    if (isFormValid) {
      toast.success("Produit publié avec succès !", {
        description: "Votre produit est maintenant visible par tous les utilisateurs",
      })
    } else {
      toast.success("Brouillon sauvegardé", {
        description: "Votre produit a été sauvegardé en tant que brouillon",
      })
    }
    onSave?.()
  }

  const handleDiscard = () => {
    toast.info("Modifications annulées", {
      description: "Toutes les modifications non sauvegardées ont été supprimées",
    })
    onDiscard?.()
    setIsDiscardDialogOpen(false)
  }

  const handleBack = () => {
    onBack?.()
  }

  const handleSuggestionClick = (suggestion: Suggestion) => {
    onSuggestionApply?.(suggestion.type, suggestion.value || "")
    setIsActive(false)
    setShowSuggestions(false)
    setSearchQuery("")
    toast.success("Suggestion appliquée", {
      description: suggestion.action,
    })
  }

  const filteredSuggestions = suggestions.filter(
    (suggestion) =>
      suggestion.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      suggestion.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const getContextBadgeColor = () => {
    if (currentContext === "Produit complet ✨") return "bg-green-500/20 text-green-300 border-green-400/30"
    if (currentContext.includes("requis")) return "bg-red-500/20 text-red-300 border-red-400/30"
    return "bg-blue-500/20 text-blue-300 border-blue-400/30"
  }

  const getStatusIndicatorColor = () => {
    if (isFormValid) return "bg-green-400"
    if (hasUnsavedChanges) return "bg-orange-400"
    return "bg-gray-500"
  }

  return (
    <div className={cn("relative flex flex-col items-center", className)} ref={containerRef}>
      {/* Container avec bouton back séparé */}
      <div className="flex items-center gap-3">
        {/* Bouton back séparé dans un cercle */}
        <motion.div
          initial={{ x: 52, scale: 0.8, opacity: 0.5 }}
          animate={{ 
            x: hasAnimated ? 0 : 52,
            scale: hasAnimated ? (isActive ? 1.05 : 1) : 0.8,
            opacity: hasAnimated ? 1 : 0.5
          }}
          transition={{
            type: "spring",
            bounce: hasAnimated ? 0.2 : 0.6,
            damping: hasAnimated ? 20 : 15,
            stiffness: hasAnimated ? 300 : 200,
            duration: hasAnimated ? 0.3 : 0.8,
          }}
          className="w-10 h-10 rounded-full backdrop-blur-md border shadow-lg flex items-center justify-center z-[9998]"
          style={{
            backgroundColor: "oklch(0.129 0.042 264.695)",
            borderColor: "oklch(0.2 0.05 264.695)",
          }}
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="h-6 w-6 p-0 hover:bg-white/20 rounded-md text-gray-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
          </Button>
        </motion.div>

        {/* Barre de recherche principale */}
        <motion.div
          initial={{ width: 420, height: 40, borderRadius: 20 }}
          animate={{
            width: isActive ? 520 : 420,
            height: isActive ? 44 : 40,
            borderRadius: isActive ? 22 : 20,
          }}
          transition={{
            type: "spring",
            bounce: 0.2,
            damping: 20,
            stiffness: 300,
          }}
          className="backdrop-blur-md border shadow-lg relative overflow-hidden z-[9998]"
          style={{
            backgroundColor: "oklch(0.129 0.042 264.695)",
            borderColor: "oklch(0.2 0.05 264.695)",
          }}
          onBlur={handleBlur}
        >
          <AnimatePresence mode="wait">
            {!isActive && (
              <IdleState
                key="idle"
                onFocus={handleFocus}
                productName={productName}
                currentContext={currentContext}
                getContextBadgeColor={getContextBadgeColor}
                getStatusIndicatorColor={getStatusIndicatorColor}
                isFormValid={isFormValid}
                hasUnsavedChanges={hasUnsavedChanges}
                onSave={handleSave}
                onDiscard={handleDiscard}
                isDiscardDialogOpen={isDiscardDialogOpen}
                setIsDiscardDialogOpen={setIsDiscardDialogOpen}
              />
            )}

            {isActive && (
              <ActiveState
                key="active"
                searchQuery={searchQuery}
                onChange={handleSearch}
                onBlur={handleBlur}
                inputRef={searchInputRef}
                productName={productName}
                getStatusIndicatorColor={getStatusIndicatorColor}
                onFocus={() => setShowSuggestions(true)}
              />
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Panneau de suggestions séparé */}
      <AnimatePresence>
        {showSuggestions && isActive && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{
              type: "spring",
              bounce: 0.2,
              damping: 20,
              stiffness: 300,
            }}
            className="absolute top-full mt-2 w-[600px] backdrop-blur-md border shadow-xl rounded-2xl overflow-hidden z-[9999] ml-[52px]"
            style={{
              backgroundColor: "oklch(0.15 0.045 264.695)",
              borderColor: "oklch(0.25 0.055 264.695)",
            }}
          >
            <SuggestionsPanel
              suggestions={filteredSuggestions}
              onSuggestionClick={handleSuggestionClick}
              searchQuery={searchQuery}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// État inactif
interface IdleStateProps {
  onFocus: () => void
  productName: string
  currentContext: string
  getContextBadgeColor: () => string
  getStatusIndicatorColor: () => string
  isFormValid: boolean
  hasUnsavedChanges: boolean
  onSave: () => void
  onDiscard: () => void
  isDiscardDialogOpen: boolean
  setIsDiscardDialogOpen: (open: boolean) => void
}

const IdleState = ({
  onFocus,
  productName,
  currentContext,
  getContextBadgeColor,
  getStatusIndicatorColor,
  isFormValid,
  hasUnsavedChanges,
  onSave,
  onDiscard,
  isDiscardDialogOpen,
  setIsDiscardDialogOpen,
}: IdleStateProps) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="flex items-center h-full px-3"
  >
    {/* Status indicator */}
    <div className={cn("w-1.5 h-1.5 rounded-full flex-shrink-0 mr-2", getStatusIndicatorColor())} />

    {/* Product name and context */}
    <div className="flex items-center gap-2 flex-1 min-w-0" onClick={onFocus}>
      <span className="truncate text-sm font-normal text-gray-300 hover:text-white cursor-text transition-colors">{productName}</span>
      {!isFormValid && (
        <Badge
          variant="secondary"
          className="text-xs h-4 px-1.5 flex-shrink-0 bg-gray-700/50 text-gray-300 border-gray-600"
        >
          Brouillon
        </Badge>
      )}
      <Badge variant="outline" className={cn("text-xs font-medium animate-pulse ml-auto", getContextBadgeColor())}>
        {currentContext}
      </Badge>
    </div>

    {/* Right section - Actions */}
    <div className="flex items-center gap-1 flex-shrink-0 ml-4">
      {/* More actions dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 hover:bg-white/10 rounded-md text-gray-300 hover:text-white transition-colors"
          >
            <MoreHorizontal className="h-3.5 w-3.5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48 bg-gray-800 border-gray-700">
          <DropdownMenuItem className="text-gray-300 hover:text-white hover:bg-gray-700">
            <Eye className="h-4 w-4 mr-2" />
            Aperçu du produit
          </DropdownMenuItem>
          <DropdownMenuItem className="text-gray-300 hover:text-white hover:bg-gray-700">
            <Copy className="h-4 w-4 mr-2" />
            Dupliquer le produit
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-gray-700" />
          <DropdownMenuItem className="text-gray-300 hover:text-white hover:bg-gray-700">
            <HelpCircle className="h-4 w-4 mr-2" />
            Aide
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Separator */}
      <div className="w-px h-4 bg-gray-600 mx-1" />

      {/* Discard button - only show if has unsaved changes */}
      {hasUnsavedChanges && (
        <AlertDialog open={isDiscardDialogOpen} onOpenChange={setIsDiscardDialogOpen}>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-xs text-gray-400 hover:text-gray-200 hover:bg-white/10 rounded-md transition-colors"
            >
              Annuler
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Annuler les modifications ?</AlertDialogTitle>
              <AlertDialogDescription>
                Toutes les modifications non sauvegardées seront perdues. Cette action ne peut pas être annulée.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Continuer l'édition</AlertDialogCancel>
              <AlertDialogAction
                onClick={onDiscard}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                <X className="h-4 w-4 mr-2" />
                Annuler les modifications
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

      {/* Save button */}
      <div
        className={cn(
          "flex items-center gap-1 rounded-md border px-2 py-1",
          "font-mono text-xs font-medium shadow-sm transition-all cursor-pointer",
          isFormValid
            ? "border-green-400/30 bg-green-500/20 text-green-300 hover:bg-green-500/30"
            : "border-gray-600 bg-gray-700/50 text-gray-300 hover:bg-gray-600/50",
        )}
        onClick={onSave}
      >
        {isFormValid ? <CheckCircle className="h-3 w-3" /> : <Save className="h-3 w-3" />}
        <span>{isFormValid ? "Publier" : "Enregistrer"}</span>
      </div>
    </div>
  </motion.div>
)

// État actif
interface ActiveStateProps {
  searchQuery: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onBlur: (e: React.FocusEvent) => void
  inputRef: React.RefObject<HTMLInputElement | null>
  productName: string
  getStatusIndicatorColor: () => string
  onFocus: () => void
}

const ActiveState = ({
  searchQuery,
  onChange,
  onBlur,
  inputRef,
  productName,
  getStatusIndicatorColor,
  onFocus,
}: ActiveStateProps) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="group flex items-center h-full px-3 relative"
  >
    {/* Product status indicator */}
    <div className={cn("w-1.5 h-1.5 rounded-full flex-shrink-0 mr-2", getStatusIndicatorColor())} />

    {/* Search input */}
    <Search className="h-4 w-4 text-gray-400 mr-2" />
    <input
      ref={inputRef}
      type="text"
      value={searchQuery}
      onChange={onChange}
      onBlur={onBlur}
      onFocus={onFocus}
      className="flex-1 bg-transparent outline-none text-sm placeholder-gray-400 text-white"
      placeholder="Que voulez-vous faire ?"
      autoFocus
    />

    {/* Keyboard shortcut hint */}
    <kbd className="absolute right-2 top-1/2 -translate-y-1/2 hidden items-center gap-0.5 rounded-md border border-gray-600 bg-gray-700/50 px-2 py-1 font-mono text-xs font-medium text-gray-400 shadow-sm transition-all group-hover:border-gray-500 group-hover:bg-gray-600/50 sm:flex">
      <span className="text-xs">⌘</span>
      <span>K</span>
    </kbd>
  </motion.div>
)

// Panneau de suggestions séparé
interface SuggestionsPanelProps {
  suggestions: Suggestion[]
  onSuggestionClick: (suggestion: Suggestion) => void
  searchQuery: string
}

const SuggestionsPanel = ({ suggestions, onSuggestionClick, searchQuery }: SuggestionsPanelProps) => (
  <div className="max-h-80 overflow-y-auto">
    {suggestions.length > 0 ? (
      <>
        <div className="p-3 border-b border-gray-700/50 bg-gray-800/30">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-blue-400" />
            <span className="text-sm font-medium text-gray-200">Suggestions intelligentes</span>
            <Badge variant="secondary" className="text-xs bg-gray-700/50 text-gray-300 border-gray-600">
              {suggestions.length}
            </Badge>
          </div>
        </div>
        <div className="p-2 space-y-1">
          {suggestions.map((suggestion, index) => {
            const Icon = suggestion.icon
            return (
              <motion.div
                key={suggestion.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center px-3 py-3 hover:bg-white/5 rounded-lg cursor-pointer transition-colors"
                onClick={() => onSuggestionClick(suggestion)}
                onMouseDown={(e) => e.preventDefault()} // Prevent blur when clicking
              >
                <div className={cn("mr-3", suggestion.color)}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-sm text-gray-200">{suggestion.title}</div>
                  <div className="text-xs text-gray-400 mt-1">{suggestion.description}</div>
                  <div className="text-xs text-blue-400 mt-1 font-medium">→ {suggestion.action}</div>
                </div>
                <ArrowRight className="h-4 w-4 text-gray-500 ml-2" />
              </motion.div>
            )
          })}
        </div>
      </>
    ) : (
      <div className="p-8 text-center">
        <Lightbulb className="h-12 w-12 mx-auto text-gray-500 mb-3" />
        <div className="font-medium text-sm mb-1 text-gray-200">Aucune suggestion trouvée</div>
        <div className="text-xs text-gray-400">
          {searchQuery ? "Essayez un autre terme de recherche" : "Votre produit semble complet !"}
        </div>
      </div>
    )}
  </div>
)

export default DynamicSearchBar