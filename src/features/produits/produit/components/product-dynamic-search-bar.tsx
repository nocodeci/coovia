"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { AnimatePresence, motion } from "framer-motion"
import {
  ArrowLeft,
  MoreHorizontal,
  Search,
  ArrowUpDown,
  X,
  Package,
  Tag,
  Archive,
  Sparkles,
  ArrowRight,
  Plus,
  Eye,
  Edit,
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

type TabType = "tous" | "actifs" | "brouillons" | "archives"

interface FilterState {
  searchTerm: string
  category: string
}

interface Suggestion {
  id: string
  type: "search" | "filter" | "action" | "tab" | "quick-action"
  title: string
  description: string
  action: string
  icon: React.ComponentType<{ className?: string }>
  color: string
  value?: string
  priority: number
}

interface ProductsDynamicSearchBarProps {
  activeTab: TabType
  filters: FilterState
  sortOrder: "asc" | "desc"
  onTabChange: (tab: TabType) => void
  onFiltersChange: (filters: FilterState) => void
  onClearFilters: () => void
  onToggleSort: () => void
  onBack: () => void
  className?: string
}

const categories = ["Œuvre d'art numérique", "Vêtements", "Accessoires"]

const tabLabels: Record<TabType, string> = {
  tous: "Tous",
  actifs: "Actifs",
  brouillons: "Brouillons",
  archives: "Archivés",
}

export function ProductsDynamicSearchBar({
  activeTab,
  filters,
  sortOrder,
  onTabChange,
  onFiltersChange,
  onClearFilters,
  onToggleSort,
  onBack,
  className = "",
}: ProductsDynamicSearchBarProps) {
  const [isActive, setIsActive] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
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
        setSearchQuery("")
      }, 4000)
      return () => clearTimeout(timer)
    }
  }, [isActive])

  // Générer les suggestions intelligentes
  useEffect(() => {
    const newSuggestions: Suggestion[] = []

    // Suggestions de recherche rapide
    if (!filters.searchTerm) {
      newSuggestions.push({
        id: "search-products",
        type: "search",
        title: "Rechercher des produits",
        description: "Rechercher par nom, description ou SKU",
        action: "Commencer la recherche",
        icon: Search,
        color: "text-blue-400",
        priority: 10,
      })
    }

    // Suggestions d'onglets
    const otherTabs = (["tous", "actifs", "brouillons", "archives"] as TabType[]).filter((tab) => tab !== activeTab)
    otherTabs.forEach((tab, index) => {
      newSuggestions.push({
        id: `tab-${tab}`,
        type: "tab",
        title: `Voir les produits ${tabLabels[tab].toLowerCase()}`,
        description: `Basculer vers l'onglet ${tabLabels[tab]}`,
        action: `Aller à ${tabLabels[tab]}`,
        icon: tab === "archives" ? Archive : Package,
        color: "text-green-400",
        value: tab,
        priority: 8 - index,
      })
    })

    // Suggestions de filtres
    if (!filters.category) {
      categories.forEach((category, index) => {
        newSuggestions.push({
          id: `filter-${category}`,
          type: "filter",
          title: `Filtrer par ${category}`,
          description: `Voir uniquement les produits de type ${category}`,
          action: `Appliquer le filtre`,
          icon: Tag,
          color: "text-purple-400",
          value: category,
          priority: 6 - index,
        })
      })
    }

    // Actions rapides
    newSuggestions.push({
      id: "add-product",
      type: "quick-action",
      title: "Ajouter un nouveau produit",
      description: "Créer un nouveau produit dans votre catalogue",
      action: "Créer un produit",
      icon: Plus,
      color: "text-green-400",
      priority: 9,
    })

    newSuggestions.push({
      id: "toggle-sort",
      type: "action",
      title: `Trier par ordre ${sortOrder === "asc" ? "décroissant" : "croissant"}`,
      description: `Changer l'ordre de tri actuel (${sortOrder === "asc" ? "A-Z" : "Z-A"})`,
      action: "Changer le tri",
      icon: ArrowUpDown,
      color: "text-orange-400",
      priority: 5,
    })

    // Suggestions de gestion
    if (filters.searchTerm || filters.category) {
      newSuggestions.push({
        id: "clear-filters",
        type: "action",
        title: "Effacer tous les filtres",
        description: "Supprimer tous les filtres actifs",
        action: "Effacer les filtres",
        icon: X,
        color: "text-red-400",
        priority: 7,
      })
    }

    // Trier par priorité
    setSuggestions(newSuggestions.sort((a, b) => b.priority - a.priority))

    // Définir le contexte actuel
    const hasFilters = filters.searchTerm || filters.category
    if (hasFilters) {
      const filterCount = (filters.searchTerm ? 1 : 0) + (filters.category ? 1 : 0)
      setCurrentContext(`${filterCount} filtre${filterCount > 1 ? "s" : ""} actif${filterCount > 1 ? "s" : ""}`)
    } else {
      setCurrentContext(`${tabLabels[activeTab]} • ${sortOrder === "asc" ? "A-Z" : "Z-A"}`)
    }
  }, [activeTab, filters, sortOrder])

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

    // Appliquer la recherche en temps réel
    onFiltersChange({
      ...filters,
      searchTerm: query,
    })
  }

  const handleSuggestionClick = (suggestion: Suggestion) => {
    switch (suggestion.type) {
      case "tab":
        if (suggestion.value) {
          onTabChange(suggestion.value as TabType)
        }
        break
      case "filter":
        if (suggestion.value) {
          onFiltersChange({
            ...filters,
            category: suggestion.value,
          })
        }
        break
      case "action":
        if (suggestion.id === "toggle-sort") {
          onToggleSort()
        } else if (suggestion.id === "clear-filters") {
          onClearFilters()
        }
        break
      case "quick-action":
        if (suggestion.id === "add-product") {
          window.location.href = "/add-product"
        }
        break
    }

    setIsActive(false)
    setShowSuggestions(false)
    setSearchQuery("")

    toast.success("Action effectuée", {
      description: suggestion.action,
    })
  }

  const filteredSuggestions = suggestions.filter(
    (suggestion) =>
      suggestion.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      suggestion.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const getContextBadgeColor = () => {
    const hasFilters = filters.searchTerm || filters.category
    if (hasFilters) return "bg-blue-500/20 text-blue-300 border-blue-400/30"
    return "bg-gray-500/20 text-gray-300 border-gray-400/30"
  }

  const hasActiveFilters = filters.searchTerm || filters.category

  return (
    <div className={cn("relative flex flex-col items-center", className)} ref={containerRef}>
      {/* Barre de recherche fixe */}
      <motion.div
        initial={{ width: 480, height: 40, borderRadius: 20 }}
        animate={{
          width: isActive ? 600 : 480,
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
              activeTab={activeTab}
              currentContext={currentContext}
              getContextBadgeColor={getContextBadgeColor}
              hasActiveFilters={true}
              onBack={onBack}
              onToggleSort={onToggleSort}
              sortOrder={sortOrder}
            />
          )}

          {isActive && (
            <ActiveState
              key="active"
              searchQuery={searchQuery}
              onChange={handleSearch}
              onBlur={handleBlur}
              inputRef={searchInputRef}
              onBack={onBack}
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
            className="absolute top-full mt-2 w-[700px] backdrop-blur-md border shadow-xl rounded-2xl overflow-hidden z-[9999]"
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
  activeTab: TabType
  currentContext: string
  getContextBadgeColor: () => string
  hasActiveFilters: boolean
  onBack: () => void
  onToggleSort: () => void
  sortOrder: "asc" | "desc"
}

const IdleState = ({
  onFocus,
  activeTab,
  currentContext,
  getContextBadgeColor,
  hasActiveFilters,
  onBack,
  onToggleSort,
  sortOrder,
}: IdleStateProps) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="flex items-center h-full px-3 cursor-text"
  >
    {/* Left section - Back button */}
    <Button
      variant="ghost"
      size="sm"
      onClick={onBack}
      className="h-6 w-6 p-0 flex-shrink-0 hover:bg-white/10 rounded-md mr-2 text-gray-300 hover:text-white"
    >
      <ArrowLeft className="h-3.5 w-3.5" />
    </Button>

    {/* Status indicator */}
    <div
      className={cn("w-1.5 h-1.5 rounded-full flex-shrink-0 mr-2", hasActiveFilters ? "bg-blue-400" : "bg-gray-500")}
    />

    {/* Tab and context */}
    <div className="flex items-center gap-2 flex-1 min-w-0" onClick={onFocus}>
      <span className="truncate text-sm font-normal text-gray-300 hover:text-white">
        Produits • {tabLabels[activeTab]}
      </span>
      <Badge variant="outline" className={cn("text-xs font-medium animate-pulse ml-auto", getContextBadgeColor())}>
        {currentContext}
      </Badge>
    </div>

    {/* Right section - Actions */}
    <div className="flex items-center gap-1 flex-shrink-0 ml-2">
      {/* Sort button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={onToggleSort}
        className="h-6 px-2 text-xs text-gray-400 hover:text-gray-200 hover:bg-white/10 rounded-md"
      >
        <ArrowUpDown className={cn("h-3 w-3 mr-1 transition-transform", sortOrder === "desc" ? "rotate-180" : "")} />
        {sortOrder === "asc" ? "A-Z" : "Z-A"}
      </Button>

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
            <Plus className="h-4 w-4 mr-2" />
            Nouveau produit
          </DropdownMenuItem>
          <DropdownMenuItem className="text-gray-300 hover:text-white hover:bg-gray-700">
            <Eye className="h-4 w-4 mr-2" />
            Aperçu boutique
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-gray-700" />
          <DropdownMenuItem className="text-gray-300 hover:text-white hover:bg-gray-700">
            <Edit className="h-4 w-4 mr-2" />
            Modification en lot
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  </motion.div>
)

// État actif
interface ActiveStateProps {
  searchQuery: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onBlur: (e: React.FocusEvent) => void
  inputRef: React.RefObject<HTMLInputElement | null>
  onBack: () => void
  onFocus: () => void
}

const ActiveState = ({ searchQuery, onChange, onBlur, inputRef, onBack, onFocus }: ActiveStateProps) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="group flex items-center h-full px-3 relative"
  >
    {/* Left section - Back button */}
    <Button
      variant="ghost"
      size="sm"
      onClick={onBack}
      className="h-6 w-6 p-0 flex-shrink-0 hover:bg-white/10 rounded-md mr-2 text-gray-300 hover:text-white"
    >
      <ArrowLeft className="h-3.5 w-3.5" />
    </Button>

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
      placeholder="Rechercher des produits, filtrer, ou choisir une action..."
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

const SuggestionsPanel = ({ suggestions, onSuggestionClick, searchQuery }: SuggestionsPanelProps) => {
  const groupedSuggestions = suggestions.reduce(
    (acc, suggestion) => {
      if (!acc[suggestion.type]) {
        acc[suggestion.type] = []
      }
      acc[suggestion.type].push(suggestion)
      return acc
    },
    {} as Record<string, Suggestion[]>,
  )

  const typeLabels = {
    search: "Recherche",
    tab: "Onglets",
    filter: "Filtres",
    action: "Actions",
    "quick-action": "Actions rapides",
  }

  return (
    <div className="max-h-80 overflow-y-auto">
      {suggestions.length > 0 ? (
        <>
          <div className="p-3 border-b border-gray-700/50 bg-gray-800/30">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-blue-400" />
              <span className="text-sm font-medium text-gray-200">Actions disponibles</span>
              <Badge variant="secondary" className="text-xs bg-gray-700/50 text-gray-300 border-gray-600">
                {suggestions.length}
              </Badge>
            </div>
          </div>
          <div className="p-2">
            {Object.entries(groupedSuggestions).map(([type, typeSuggestions]) => (
              <div key={type} className="mb-4 last:mb-0">
                <div className="px-3 py-1 text-xs font-medium text-gray-400 uppercase tracking-wide">
                  {typeLabels[type as keyof typeof typeLabels] || type}
                </div>
                <div className="space-y-1">
                  {typeSuggestions.map((suggestion, index) => {
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
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="p-8 text-center">
          <Search className="h-12 w-12 mx-auto text-gray-500 mb-3" />
          <div className="font-medium text-sm mb-1 text-gray-200">Aucune suggestion trouvée</div>
          <div className="text-xs text-gray-400">
            {searchQuery ? "Essayez un autre terme de recherche" : "Commencez à taper pour voir les suggestions"}
          </div>
        </div>
      )}
    </div>
  )
}
