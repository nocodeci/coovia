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
  Percent,
  Package,
  DollarSign,
  Sparkles,
  CheckCircle,
  ArrowRight,
  Zap,
  Target,
  Calendar,
  Users,
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
    type: "code" | "discount" | "products" | "conditions" | "template" | "tip"
    title: string
    description: string
    action: string
    icon: React.ComponentType<{ className?: string }>
    color: string
    value?: string
    priority: number
  }
  
  interface AddPromoCodeDynamicSearchBarProps {
    promoCode?: string
    discountType?: string
    discountValue?: string
    selectedProducts?: string[]
    applyToAll?: boolean
    isFormValid?: boolean
    hasUnsavedChanges?: boolean
    onSave?: () => void
    onDiscard?: () => void
    onBack?: () => void
    onSuggestionApply?: (type: string, value: string) => void
    className?: string
  }
  
  const promoTemplates = [
    { code: "WELCOME20", discount: "20", type: "percentage", description: "Code de bienvenue" },
    { code: "SUMMER30", discount: "30", type: "percentage", description: "Promotion d'été" },
    { code: "FIRST5000", discount: "5000", type: "fixed", description: "Premier achat" },
    { code: "STUDENT15", discount: "15", type: "percentage", description: "Réduction étudiant" },
    { code: "BLACKFRIDAY50", discount: "50", type: "percentage", description: "Black Friday" },
  ]
  
  export function AddPromoCodeDynamicSearchBar({
    promoCode = "",
    discountType = "percentage",
    discountValue = "",
    selectedProducts = [],
    applyToAll = false,
    isFormValid = false,
    hasUnsavedChanges = false,
    onSave,
    onDiscard,
    onBack,
    onSuggestionApply,
    className = "",
  }: AddPromoCodeDynamicSearchBarProps) {
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
  
      // Suggestions pour le code promo
      if (!promoCode.trim()) {
        newSuggestions.push({
          id: "code-required",
          type: "code",
          title: "Ajouter un code promo",
          description: "Le code est obligatoire pour créer la promotion",
          action: "Saisir un code",
          icon: Percent,
          color: "text-red-400",
          priority: 10,
        })
  
        // Suggestions de templates
        promoTemplates.forEach((template, index) => {
          newSuggestions.push({
            id: `template-${index}`,
            type: "template",
            title: `Utiliser "${template.code}"`,
            description: template.description,
            action: `Appliquer le template`,
            icon: Zap,
            color: "text-blue-400",
            value: template.code,
            priority: 8,
          })
        })
      }
  
      // Suggestions pour la réduction
      if (!discountValue.trim()) {
        newSuggestions.push({
          id: "discount-required",
          type: "discount",
          title: "Définir la réduction",
          description: "Spécifiez le montant ou pourcentage de réduction",
          action: "Ajouter une valeur",
          icon: DollarSign,
          color: "text-yellow-400",
          priority: 9,
        })
      } else if (discountType === "percentage" && Number(discountValue) > 100) {
        newSuggestions.push({
          id: "discount-invalid",
          type: "discount",
          title: "Réduction trop élevée",
          description: "Le pourcentage ne peut pas dépasser 100%",
          action: "Corriger la valeur",
          icon: DollarSign,
          color: "text-red-400",
          priority: 9,
        })
      }
  
      // Suggestions pour les produits
      if (!applyToAll && selectedProducts.length === 0) {
        newSuggestions.push({
          id: "products-required",
          type: "products",
          title: "Sélectionner des produits",
          description: "Choisissez les produits concernés par la promotion",
          action: "Ouvrir le sélecteur",
          icon: Package,
          color: "text-green-400",
          priority: 8,
        })
      }
  
      // Suggestions de conditions
      if (promoCode && discountValue && (applyToAll || selectedProducts.length > 0)) {
        newSuggestions.push({
          id: "add-conditions",
          type: "conditions",
          title: "Ajouter des conditions",
          description: "Limite d'utilisation, montant minimum, dates",
          action: "Configurer les conditions",
          icon: Target,
          color: "text-purple-400",
          priority: 5,
        })
  
        newSuggestions.push({
          id: "set-dates",
          type: "conditions",
          title: "Définir la période",
          description: "Dates de début et fin de validité",
          action: "Ajouter des dates",
          icon: Calendar,
          color: "text-indigo-400",
          priority: 4,
        })
      }
  
      // Conseils d'optimisation
      if (isFormValid) {
        newSuggestions.push({
          id: "marketing-tip",
          type: "tip",
          title: "Optimiser la promotion",
          description: "Conseils pour maximiser l'efficacité",
          action: "Voir les conseils",
          icon: Lightbulb,
          color: "text-cyan-400",
          priority: 3,
        })
  
        newSuggestions.push({
          id: "audience-tip",
          type: "tip",
          title: "Cibler l'audience",
          description: "Définir qui peut utiliser ce code",
          action: "Configurer le ciblage",
          icon: Users,
          color: "text-pink-400",
          priority: 2,
        })
      }
  
      // Trier par priorité
      setSuggestions(newSuggestions.sort((a, b) => b.priority - a.priority))
  
      // Définir le contexte actuel
      if (newSuggestions.length === 0) {
        setCurrentContext("Code prêt ✨")
      } else if (!promoCode.trim()) {
        setCurrentContext("Code requis")
      } else if (!discountValue.trim()) {
        setCurrentContext("Réduction requise")
      } else if (!applyToAll && selectedProducts.length === 0) {
        setCurrentContext("Produits requis")
      } else {
        setCurrentContext("Presque fini")
      }
    }, [promoCode, discountType, discountValue, selectedProducts, applyToAll, isFormValid])
  
    const handleFocus = () => {
      setIsActive(true)
      setTimeout(() => searchInputRef.current?.focus(), 100)
    }
  
    const handleBlur = (e: React.FocusEvent) => {
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
        toast.success("Code promo créé avec succès !", {
          description: "Le code promo est maintenant disponible",
        })
      } else {
        toast.success("Brouillon sauvegardé", {
          description: "Le code promo a été sauvegardé en tant que brouillon",
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
      if (currentContext === "Code prêt ✨") return "bg-green-500/20 text-green-300 border-green-400/30"
      if (currentContext.includes("requis")) return "bg-red-500/20 text-red-300 border-red-400/30"
      return "bg-blue-500/20 text-blue-300 border-blue-400/30"
    }
  
    const getStatusIndicatorColor = () => {
      if (isFormValid) return "bg-green-400"
      if (hasUnsavedChanges) return "bg-orange-400"
      return "bg-gray-500"
    }
  
    const getDisplayName = () => {
      if (promoCode.trim()) return promoCode
      return "Nouveau code promo"
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
            initial={{ width: 280, height: 40, borderRadius: 20 }}
            animate={{
              width: isActive ? 360 : 280,
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
                displayName={getDisplayName()}
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
              className="absolute top-full mt-2 w-[480px] backdrop-blur-md border shadow-xl rounded-2xl overflow-hidden z-[9999] ml-[52px]"
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
    displayName: string
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
    displayName,
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

      {/* Code name and context */}
      <div className="flex items-center gap-2 flex-1 min-w-0" onClick={onFocus}>
        <span className="truncate text-sm font-normal text-gray-300 hover:text-white cursor-text transition-colors">{displayName}</span>
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
              Aperçu client
            </DropdownMenuItem>
            <DropdownMenuItem className="text-gray-300 hover:text-white hover:bg-gray-700">
              <Copy className="h-4 w-4 mr-2" />
              Dupliquer le code
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
          <span>{isFormValid ? "Créer" : "Enregistrer"}</span>
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
    getStatusIndicatorColor: () => string
    onFocus: () => void
  }
  
  const ActiveState = ({
    searchQuery,
    onChange,
    onBlur,
    inputRef,
    getStatusIndicatorColor,
    onFocus,
  }: ActiveStateProps) => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="group flex items-center h-full px-3 relative"
    >
      {/* Status indicator */}
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
                  onMouseDown={(e) => e.preventDefault()}
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
            {searchQuery ? "Essayez un autre terme de recherche" : "Votre code promo semble complet !"}
          </div>
        </div>
      )}
    </div>
  )

export default AddPromoCodeDynamicSearchBar