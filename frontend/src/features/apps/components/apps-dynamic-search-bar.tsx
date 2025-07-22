"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { AnimatePresence, motion } from "framer-motion"
import {
  ArrowLeft,
  MoreHorizontal,
  Search,
  RefreshCw,
  Plug,
  PlugZap,
  Unplug,
  ArrowUpDown,
  Filter,
  Settings,
  Zap,
  Globe,
  Shield,
  Sparkles,
  ArrowRight,
  Star,
  CheckCircle,
  XCircle,
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
  type: "search" | "filter" | "action" | "sort" | "quick-action" | "app-suggestion"
  title: string
  description: string
  action: string
  icon: React.ComponentType<{ className?: string }>
  color: string
  value?: string
  priority: number
}

interface AppsDynamicSearchBarProps {
  searchTerm: string
  appType: string
  sort: string
  totalApps: number
  connectedApps: number
  onSearchChange: (term: string) => void
  onFilterChange: (filters: any) => void
  onSortChange: (sort: string) => void
  onClearFilters: () => void
  onBack: () => void
  onConnectAll?: () => void
  onRefresh?: () => void
  onBulkAction?: (action: string) => void
  className?: string
}

const appTypes = [
  { value: "all", label: "Toutes les applications" },
  { value: "connected", label: "Connectées" },
  { value: "notConnected", label: "Non connectées" },
]

const sortOptions = [
  { value: "ascending", label: "A-Z" },
  { value: "descending", label: "Z-A" },
]

const popularApps = [
  { name: "Stripe", category: "Paiement" },
  { name: "PayPal", category: "Paiement" },
  { name: "Mailchimp", category: "Email" },
  { name: "Slack", category: "Communication" },
  { name: "Google Analytics", category: "Analytics" },
]

export function AppsDynamicSearchBar({
  searchTerm,
  appType,
  sort,
  totalApps,
  connectedApps,
  onSearchChange,
  onFilterChange,
  onSortChange,
  onClearFilters,
  onBack,
  onConnectAll,
  onRefresh,
  onBulkAction,
  className = "",
}: AppsDynamicSearchBarProps) {
  const [isActive, setIsActive] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [searchQuery, setSearchQuery] = useState(searchTerm)
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
        setSearchQuery(searchTerm)
      }, 4000)
      return () => clearTimeout(timer)
    }
  }, [isActive, searchTerm])

  // Générer les suggestions intelligentes
  useEffect(() => {
    const newSuggestions: Suggestion[] = []

    // Suggestions de recherche
    if (!searchQuery) {
      newSuggestions.push({
        id: "search-apps",
        type: "search",
        title: "Rechercher des applications",
        description: "Rechercher par nom ou catégorie d'application",
        action: "Commencer la recherche",
        icon: Search,
        color: "text-blue-400",
        priority: 10,
      })
    }

    // Actions rapides
    newSuggestions.push({
      id: "refresh-apps",
      type: "quick-action",
      title: "Actualiser les applications",
      description: "Recharger la liste des applications disponibles",
      action: "Actualiser",
      icon: RefreshCw,
      color: "text-green-400",
      priority: 9,
    })

    // Actions de connexion en masse
    const disconnectedApps = totalApps - connectedApps
    if (disconnectedApps > 0) {
      newSuggestions.push({
        id: "connect-all",
        type: "action",
        title: `Connecter ${disconnectedApps} application(s)`,
        description: "Connecter toutes les applications non connectées",
        action: "Connecter toutes",
        icon: PlugZap,
        color: "text-green-400",
        priority: 8,
      })
    }

    if (connectedApps > 0) {
      newSuggestions.push({
        id: "disconnect-all",
        type: "action",
        title: `Déconnecter ${connectedApps} application(s)`,
        description: "Déconnecter toutes les applications connectées",
        action: "Déconnecter toutes",
        icon: Unplug,
        color: "text-red-400",
        priority: 7,
      })
    }

    // Filtres par type
    appTypes.forEach((type, index) => {
      if (type.value !== appType) {
        newSuggestions.push({
          id: `filter-${type.value}`,
          type: "filter",
          title: `Voir ${type.label.toLowerCase()}`,
          description: `Filtrer pour afficher ${type.label.toLowerCase()}`,
          action: `Filtrer par ${type.label}`,
          icon: type.value === "connected" ? CheckCircle : type.value === "notConnected" ? XCircle : Globe,
          color:
            type.value === "connected"
              ? "text-green-400"
              : type.value === "notConnected"
                ? "text-red-400"
                : "text-blue-400",
          value: type.value,
          priority: 6 - index,
        })
      }
    })

    // Options de tri
    const currentSortLabel = sortOptions.find((s) => s.value === sort)?.label
    const otherSort = sortOptions.find((s) => s.value !== sort)
    if (otherSort) {
      newSuggestions.push({
        id: `sort-${otherSort.value}`,
        type: "sort",
        title: `Trier par ${otherSort.label}`,
        description: `Changer le tri de ${currentSortLabel} vers ${otherSort.label}`,
        action: `Trier par ${otherSort.label}`,
        icon: ArrowUpDown,
        color: "text-purple-400",
        value: otherSort.value,
        priority: 5,
      })
    }

    // Suggestions d'applications populaires
    popularApps.forEach((app, index) => {
      newSuggestions.push({
        id: `app-${app.name}`,
        type: "app-suggestion",
        title: `Connecter ${app.name}`,
        description: `Application ${app.category} populaire`,
        action: `Rechercher ${app.name}`,
        icon: app.category === "Paiement" ? Zap : app.category === "Email" ? Globe : Star,
        color: "text-orange-400",
        value: app.name,
        priority: 4 - index * 0.1,
      })
    })

    // Actions de gestion
    newSuggestions.push({
      id: "manage-integrations",
      type: "action",
      title: "Gérer les intégrations",
      description: "Configurer les paramètres d'intégration",
      action: "Ouvrir les paramètres",
      icon: Settings,
      color: "text-gray-400",
      priority: 3,
    })

    newSuggestions.push({
      id: "security-review",
      type: "action",
      title: "Révision de sécurité",
      description: "Vérifier les permissions des applications",
      action: "Vérifier la sécurité",
      icon: Shield,
      color: "text-yellow-400",
      priority: 2,
    })

    // Trier par priorité
    setSuggestions(newSuggestions.sort((a, b) => b.priority - a.priority))

    // Définir le contexte actuel
    if (searchTerm) {
      setCurrentContext(`Recherche: "${searchTerm}"`)
    } else {
      const typeLabel = appTypes.find((t) => t.value === appType)?.label || "Toutes"
      const sortLabel = sortOptions.find((s) => s.value === sort)?.label || "A-Z"
      setCurrentContext(`${typeLabel} • ${sortLabel}`)
    }
  }, [searchQuery, appType, sort, totalApps, connectedApps, searchTerm])

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
    onSearchChange(query)
  }

  const handleSuggestionClick = (suggestion: Suggestion) => {
    switch (suggestion.type) {
      case "filter":
        if (suggestion.value) {
          onFilterChange({ appType: suggestion.value })
        }
        break
      case "sort":
        if (suggestion.value) {
          onSortChange(suggestion.value)
        }
        break
      case "action":
        if (suggestion.id === "connect-all" && onConnectAll) {
          onConnectAll()
        } else if (suggestion.id === "disconnect-all" && onBulkAction) {
          onBulkAction("disconnect-all")
        }
        break
      case "quick-action":
        if (suggestion.id === "refresh-apps" && onRefresh) {
          onRefresh()
        }
        break
      case "app-suggestion":
        if (suggestion.value) {
          onSearchChange(suggestion.value)
          setSearchQuery(suggestion.value)
        }
        break
      case "search":
        // Activer la recherche
        setTimeout(() => searchInputRef.current?.focus(), 100)
        break
    }

    setIsActive(false)
    setShowSuggestions(false)
    if (suggestion.type !== "app-suggestion") {
      setSearchQuery(searchTerm)
    }

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
    if (searchTerm) return "bg-green-500/20 text-green-300 border-green-400/30"
    if (appType === "connected") return "bg-green-500/20 text-green-300 border-green-400/30"
    if (appType === "notConnected") return "bg-red-500/20 text-red-300 border-red-400/30"
    return "bg-blue-500/20 text-blue-300 border-blue-400/30"
  }

  const hasActiveFilters = searchTerm || appType !== "all"

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
              currentContext={currentContext}
              getContextBadgeColor={getContextBadgeColor}
              hasActiveFilters={true}
              connectedApps={connectedApps}
              totalApps={totalApps}
              onBack={onBack}
              onRefresh={onRefresh}
              onConnectAll={onConnectAll}
              sort={sort}
              onSortChange={onSortChange}
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
  currentContext: string
  getContextBadgeColor: () => string
  hasActiveFilters: boolean
  connectedApps: number
  totalApps: number
  onBack: () => void
  onRefresh?: () => void
  onConnectAll?: () => void
  sort: string
  onSortChange: (sort: string) => void
}

const IdleState = ({
  onFocus,
  currentContext,
  getContextBadgeColor,
  hasActiveFilters,
  connectedApps,
  totalApps,
  onBack,
  onRefresh,
  onConnectAll,
  sort,
  onSortChange,
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
      className={cn(
        "w-1.5 h-1.5 rounded-full flex-shrink-0 mr-2",
        connectedApps === totalApps ? "bg-green-400" : connectedApps > 0 ? "bg-yellow-400" : "bg-gray-500",
      )}
    />

    {/* Apps context */}
    <div className="flex items-center gap-2 flex-1 min-w-0" onClick={onFocus}>
      <span className="truncate text-sm font-normal text-gray-300 hover:text-white">
        Applications • {connectedApps}/{totalApps}
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
        onClick={() => onSortChange(sort === "ascending" ? "descending" : "ascending")}
        className="h-6 px-2 text-xs text-gray-400 hover:text-gray-200 hover:bg-white/10 rounded-md"
      >
        <ArrowUpDown className={cn("h-3 w-3 mr-1 transition-transform", sort === "descending" ? "rotate-180" : "")} />
        {sort === "ascending" ? "A-Z" : "Z-A"}
      </Button>

      {/* Quick actions */}
      <Button
        variant="ghost"
        size="sm"
        onClick={onRefresh}
        className="h-6 px-2 text-xs text-gray-400 hover:text-gray-200 hover:bg-white/10 rounded-md"
      >
        <RefreshCw className="h-3 w-3 mr-1" />
        Actualiser
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
            <PlugZap className="h-4 w-4 mr-2" />
            Connecter toutes
          </DropdownMenuItem>
          <DropdownMenuItem className="text-gray-300 hover:text-white hover:bg-gray-700">
            <Filter className="h-4 w-4 mr-2" />
            Filtres avancés
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-gray-700" />
          <DropdownMenuItem className="text-gray-300 hover:text-white hover:bg-gray-700">
            <Settings className="h-4 w-4 mr-2" />
            Paramètres
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
      placeholder="Rechercher des applications, filtrer, ou choisir une action..."
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
    filter: "Filtres",
    sort: "Tri",
    action: "Actions",
    "quick-action": "Actions rapides",
    "app-suggestion": "Applications populaires",
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
          <Plug className="h-12 w-12 mx-auto text-gray-500 mb-3" />
          <div className="font-medium text-sm mb-1 text-gray-200">Aucune suggestion trouvée</div>
          <div className="text-xs text-gray-400">
            {searchQuery ? "Essayez un autre terme de recherche" : "Commencez à taper pour voir les suggestions"}
          </div>
        </div>
      )}
    </div>
  )
}
