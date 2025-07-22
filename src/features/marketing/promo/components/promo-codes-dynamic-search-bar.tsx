"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { AnimatePresence, motion } from "framer-motion"
import {
  MoreHorizontal,
  Search,
  Percent,
  Plus,
  BarChart3,
  Filter,
  Calendar,
  Users,
  TrendingUp,
  Lightbulb,
  Sparkles,
  ArrowRight,
  CheckCircle,
  Clock,
  Target,
  Gift,
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

interface Suggestion {
  id: string
  type: "search" | "filter" | "action" | "analytics" | "tip" | "quick"
  title: string
  description: string
  action: string
  icon: React.ComponentType<{ className?: string }>
  color: string
  value?: string
  priority: number
}

interface PromoCodesDynamicSearchBarProps {
  searchQuery?: string
  selectedStatus?: string
  selectedType?: string
  totalCodes?: number
  activeCodes?: number
  totalUsage?: number
  onSearch?: (query: string) => void
  onFilterChange?: (filter: string, value: string) => void
  onCreateCode?: () => void
  onViewAnalytics?: () => void
  onSuggestionApply?: (type: string, value: string) => void
  className?: string
}

export function PromoCodesDynamicSearchBar({
  searchQuery = "",
  selectedStatus = "",
  selectedType = "",
  totalCodes = 4,
  activeCodes = 3,
  totalUsage = 158,
  onSearch,
  onFilterChange,
  onCreateCode,
  onViewAnalytics,
  onSuggestionApply,
  className = "",
}: PromoCodesDynamicSearchBarProps) {
  const [isActive, setIsActive] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [currentSearchQuery, setCurrentSearchQuery] = useState(searchQuery)
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [currentContext, setCurrentContext] = useState("")
  const searchInputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Auto-collapse after inactivity
  useEffect(() => {
    if (isActive) {
      const timer = setTimeout(() => {
        setIsActive(false)
        setShowSuggestions(false)
        setCurrentSearchQuery("")
      }, 4000)
      return () => clearTimeout(timer)
    }
  }, [isActive])

  // Générer les suggestions intelligentes
  useEffect(() => {
    const newSuggestions: Suggestion[] = []

    // Suggestions de recherche rapide
    if (!currentSearchQuery) {
      newSuggestions.push(
        {
          id: "search-active",
          type: "search",
          title: "Codes actifs",
          description: "Voir tous les codes promo actifs",
          action: "status:active",
          icon: CheckCircle,
          color: "text-green-400",
          value: "status:active",
          priority: 10,
        },
        {
          id: "search-expired",
          type: "search",
          title: "Codes expirés",
          description: "Voir les codes promo expirés",
          action: "status:expired",
          icon: Clock,
          color: "text-red-400",
          value: "status:expired",
          priority: 9,
        },
        {
          id: "search-percentage",
          type: "search",
          title: "Réductions en %",
          description: "Filtrer par codes pourcentage",
          action: "type:percentage",
          icon: Percent,
          color: "text-blue-400",
          value: "type:percentage",
          priority: 8,
        },
      )
    }

    // Actions rapides
    newSuggestions.push(
      {
        id: "create-code",
        type: "action",
        title: "Créer un code promo",
        description: "Nouveau code de réduction",
        action: "Créer maintenant",
        icon: Plus,
        color: "text-purple-400",
        priority: 7,
      },
      {
        id: "view-analytics",
        type: "analytics",
        title: "Voir les statistiques",
        description: `${totalUsage} utilisations au total`,
        action: "Ouvrir les analytics",
        icon: BarChart3,
        color: "text-cyan-400",
        priority: 6,
      },
    )

    // Filtres rapides
    if (!selectedStatus) {
      newSuggestions.push({
        id: "filter-status",
        type: "filter",
        title: "Filtrer par statut",
        description: "Actif, expiré ou inactif",
        action: "Choisir un statut",
        icon: Filter,
        color: "text-orange-400",
        priority: 5,
      })
    }

    if (!selectedType) {
      newSuggestions.push({
        id: "filter-type",
        type: "filter",
        title: "Filtrer par type",
        description: "Pourcentage ou montant fixe",
        action: "Choisir un type",
        icon: Target,
        color: "text-indigo-400",
        priority: 4,
      })
    }

    // Actions rapides contextuelles
    newSuggestions.push(
      {
        id: "quick-welcome",
        type: "quick",
        title: "Code de bienvenue",
        description: "Créer un code pour nouveaux clients",
        action: "WELCOME + pourcentage",
        icon: Gift,
        color: "text-pink-400",
        priority: 3,
      },
      {
        id: "quick-seasonal",
        type: "quick",
        title: "Promotion saisonnière",
        description: "Code avec date d'expiration",
        action: "Créer une promo limitée",
        icon: Calendar,
        color: "text-yellow-400",
        priority: 2,
      },
    )

    // Conseils d'optimisation
    if (activeCodes > 0) {
      const usageRate = totalUsage / (activeCodes * 50) // Estimation
      if (usageRate < 0.3) {
        newSuggestions.push({
          id: "tip-promotion",
          type: "tip",
          title: "Promouvoir vos codes",
          description: "Taux d'utilisation faible, augmentez la visibilité",
          action: "Voir les conseils marketing",
          icon: TrendingUp,
          color: "text-amber-400",
          priority: 1,
        })
      }
    }

    // Trier par priorité
    setSuggestions(newSuggestions.sort((a, b) => b.priority - a.priority))

    // Définir le contexte actuel
    if (totalCodes === 0) {
      setCurrentContext("Aucun code")
    } else if (activeCodes === 0) {
      setCurrentContext("Aucun code actif")
    } else {
      setCurrentContext(`${activeCodes} codes actifs`)
    }
  }, [currentSearchQuery, selectedStatus, selectedType, totalCodes, activeCodes, totalUsage])

  const handleFocus = () => {
    setIsActive(true)
    setTimeout(() => searchInputRef.current?.focus(), 100)
  }

  const handleBlur = (e: React.FocusEvent) => {
    if (!containerRef.current?.contains(e.relatedTarget as Node)) {
      if (!currentSearchQuery) {
        setTimeout(() => {
          setIsActive(false)
          setShowSuggestions(false)
        }, 150)
      }
    }
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setCurrentSearchQuery(query)
    setShowSuggestions(query.length > 0 || suggestions.length > 0)
    onSearch?.(query)
  }

  const handleSuggestionClick = (suggestion: Suggestion) => {
    switch (suggestion.type) {
      case "search":
        if (suggestion.value) {
          setCurrentSearchQuery(suggestion.value)
          onSearch?.(suggestion.value)
        }
        break
      case "filter":
        // Logique de filtrage
        break
      case "action":
        if (suggestion.id === "create-code") {
          onCreateCode?.()
        }
        break
      case "analytics":
        onViewAnalytics?.()
        break
      case "quick":
        onCreateCode?.()
        break
      case "tip":
        // Ouvrir les conseils
        break
    }

    onSuggestionApply?.(suggestion.type, suggestion.value || "")
    setIsActive(false)
    setShowSuggestions(false)
    setCurrentSearchQuery("")
    toast.success("Action appliquée", {
      description: suggestion.action,
    })
  }

  const filteredSuggestions = suggestions.filter(
    (suggestion) =>
      suggestion.title.toLowerCase().includes(currentSearchQuery.toLowerCase()) ||
      suggestion.description.toLowerCase().includes(currentSearchQuery.toLowerCase()),
  )

  const getContextBadgeColor = () => {
    if (currentContext.includes("Aucun")) return "bg-red-500/20 text-red-300 border-red-400/30"
    if (activeCodes > 0) return "bg-green-500/20 text-green-300 border-green-400/30"
    return "bg-blue-500/20 text-blue-300 border-blue-400/30"
  }

  const getStatusIndicatorColor = () => {
    if (activeCodes === 0) return "bg-red-400"
    if (activeCodes > 0) return "bg-green-400"
    return "bg-gray-500"
  }

  return (
    <div className={cn("relative flex flex-col items-center", className)} ref={containerRef}>
      {/* Barre de recherche fixe */}
      <motion.div
        initial={{ width: 320, height: 40, borderRadius: 20 }}
        animate={{
          width: isActive ? 400 : 320,
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
              currentContext={currentContext}
              getContextBadgeColor={getContextBadgeColor}
              getStatusIndicatorColor={getStatusIndicatorColor}
              totalCodes={totalCodes}
              activeCodes={activeCodes}
            />
          )}

          {isActive && (
            <ActiveState
              key="active"
              searchQuery={currentSearchQuery}
              onChange={handleSearch}
              onBlur={handleBlur}
              inputRef={searchInputRef}
              getStatusIndicatorColor={getStatusIndicatorColor}
              onFocus={() => setShowSuggestions(true)}
            />
          )}
        </AnimatePresence>
      </motion.div>

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
            className="absolute top-full mt-2 w-[480px] backdrop-blur-md border shadow-xl rounded-2xl overflow-hidden z-[9999]"
            style={{
              backgroundColor: "oklch(0.15 0.045 264.695)",
              borderColor: "oklch(0.25 0.055 264.695)",
            }}
          >
            <SuggestionsPanel
              suggestions={filteredSuggestions}
              onSuggestionClick={handleSuggestionClick}
              searchQuery={currentSearchQuery}
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
  currentContext: string
  getContextBadgeColor: () => string
  getStatusIndicatorColor: () => string
  totalCodes: number
  activeCodes: number
}

const IdleState = ({
  onFocus,
  currentContext,
  getContextBadgeColor,
  getStatusIndicatorColor,
  totalCodes,
  activeCodes,
}: IdleStateProps) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="flex items-center h-full px-3 cursor-text"
  >
    {/* Product status indicator */}
    <div className={cn("w-1.5 h-1.5 rounded-full flex-shrink-0 mr-2", getStatusIndicatorColor())} />

    {/* Main content */}
    <div className="flex items-center gap-2 flex-1 min-w-0" onClick={onFocus}>
      <Percent className="h-4 w-4 text-purple-400 flex-shrink-0" />
      <span className="truncate text-sm font-normal text-gray-300 hover:text-white">Codes Promo ({totalCodes})</span>
      <Badge variant="outline" className={cn("text-xs font-medium animate-pulse ml-auto", getContextBadgeColor())}>
        {currentContext}
      </Badge>
    </div>

    {/* Right section - Actions */}
    <div className="flex items-center gap-1 flex-shrink-0 ml-2">
      {/* More actions dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 hover:bg-white/10 rounded-md text-gray-300 hover:text-white"
          >
            <MoreHorizontal className="h-3.5 w-3.5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48 bg-gray-800 border-gray-700">
          <DropdownMenuItem className="text-gray-300 hover:text-white hover:bg-gray-700">
            <BarChart3 className="h-4 w-4 mr-2" />
            Voir les statistiques
          </DropdownMenuItem>
          <DropdownMenuItem className="text-gray-300 hover:text-white hover:bg-gray-700">
            <Users className="h-4 w-4 mr-2" />
            Codes les plus utilisés
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-gray-700" />
          <DropdownMenuItem className="text-gray-300 hover:text-white hover:bg-gray-700">
            <Lightbulb className="h-4 w-4 mr-2" />
            Conseils d'optimisation
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Separator */}
      <div className="w-px h-4 bg-gray-600 mx-1" />

      {/* Quick action button */}
      <div
        className="flex items-center gap-1 rounded-md border border-purple-400/30 bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 px-2 py-1 font-mono text-xs font-medium shadow-sm transition-all cursor-pointer"
        onClick={(e) => {
          e.stopPropagation()
          // Action rapide
        }}
      >
        <Plus className="h-3 w-3" />
        <span>Créer</span>
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
      placeholder="Rechercher des codes, filtrer par statut..."
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
            <Sparkles className="h-4 w-4 text-purple-400" />
            <span className="text-sm font-medium text-gray-200">Actions rapides</span>
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
                  <div className="text-xs text-purple-400 mt-1 font-medium">→ {suggestion.action}</div>
                </div>
                <ArrowRight className="h-4 w-4 text-gray-500 ml-2" />
              </motion.div>
            )
          })}
        </div>
      </>
    ) : (
      <div className="p-8 text-center">
        <Percent className="h-12 w-12 mx-auto text-gray-500 mb-3" />
        <div className="font-medium text-sm mb-1 text-gray-200">Aucune suggestion trouvée</div>
        <div className="text-xs text-gray-400">
          {searchQuery ? "Essayez un autre terme de recherche" : "Toutes les actions sont disponibles !"}
        </div>
      </div>
    )}
  </div>
)
