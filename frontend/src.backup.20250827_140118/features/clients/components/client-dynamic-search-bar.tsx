"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { AnimatePresence, motion } from "framer-motion"
import {
  ArrowLeft,
  MoreHorizontal,
  Search,
  Plus,
  Download,
  Mail,
  Users,
  Filter,
  UserCheck,
  UserX,
  Crown,
  Star,
  Calendar,
  MapPin,
  Sparkles,
  ArrowRight,
  Gift,
  Edit,
  Trash2,
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
  type: "search" | "filter" | "action" | "bulk-action" | "quick-action" | "segment"
  title: string
  description: string
  action: string
  icon: React.ComponentType<{ className?: string }>
  color: string
  value?: string
  priority: number
}

interface ClientsDynamicSearchBarProps {
  searchTerm: string
  selectedClients: string[]
  totalClients: number
  onSearchChange: (term: string) => void
  onFilterChange: (filters: any) => void
  onClearFilters: () => void
  onBack: () => void
  onExport?: () => void
  onAddClient?: () => void
  onBulkAction?: (action: string) => void
  className?: string
}

const segments = ["Nouveau", "Standard", "Premium", "VIP"]
const statuses = ["Actif", "Inactif", "Bloqué"]

export function ClientsDynamicSearchBar({
  searchTerm,
  selectedClients,
  totalClients,
  onSearchChange,
  onFilterChange,
  onBack,
  onExport,
  onAddClient,
  onBulkAction,
  className = "",
}: ClientsDynamicSearchBarProps) {
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
        id: "search-clients",
        type: "search",
        title: "Rechercher des clients",
        description: "Rechercher par nom, email, téléphone ou localisation",
        action: "Commencer la recherche",
        icon: Search,
        color: "text-blue-400",
        priority: 10,
      })
    }

    // Actions rapides
    newSuggestions.push({
      id: "add-client",
      type: "quick-action",
      title: "Ajouter un nouveau client",
      description: "Créer un nouveau profil client",
      action: "Créer un client",
      icon: Plus,
      color: "text-green-400",
      priority: 9,
    })

    newSuggestions.push({
      id: "export-clients",
      type: "action",
      title: "Exporter les clients",
      description: "Télécharger la liste des clients",
      action: "Exporter",
      icon: Download,
      color: "text-purple-400",
      priority: 8,
    })

    // Filtres par segment
    segments.forEach((segment, index) => {
      newSuggestions.push({
        id: `filter-segment-${segment}`,
        type: "segment",
        title: `Clients ${segment}`,
        description: `Voir uniquement les clients ${segment.toLowerCase()}`,
        action: `Filtrer par ${segment}`,
        icon: segment === "VIP" ? Crown : segment === "Premium" ? Star : segment === "Standard" ? UserCheck : Users,
        color:
          segment === "VIP"
            ? "text-purple-400"
            : segment === "Premium"
              ? "text-blue-400"
              : segment === "Standard"
                ? "text-green-400"
                : "text-orange-400",
        value: segment.toLowerCase(),
        priority: 7 - index,
      })
    })

    // Filtres par statut
    statuses.forEach((status, index) => {
      newSuggestions.push({
        id: `filter-status-${status}`,
        type: "filter",
        title: `Clients ${status.toLowerCase()}s`,
        description: `Voir les clients avec le statut ${status.toLowerCase()}`,
        action: `Filtrer par ${status}`,
        icon: status === "Actif" ? UserCheck : status === "Inactif" ? Users : UserX,
        color: status === "Actif" ? "text-green-400" : status === "Inactif" ? "text-gray-400" : "text-red-400",
        value: status.toLowerCase(),
        priority: 5 - index,
      })
    })

    // Actions en lot si des clients sont sélectionnés
    if (selectedClients.length > 0) {
      newSuggestions.push({
        id: "bulk-email",
        type: "bulk-action",
        title: `Envoyer un email à ${selectedClients.length} client(s)`,
        description: "Envoyer un email groupé aux clients sélectionnés",
        action: "Envoyer l'email",
        icon: Mail,
        color: "text-blue-400",
        priority: 10,
      })

      newSuggestions.push({
        id: "bulk-discount",
        type: "bulk-action",
        title: `Offrir une réduction à ${selectedClients.length} client(s)`,
        description: "Créer une offre spéciale pour les clients sélectionnés",
        action: "Créer l'offre",
        icon: Gift,
        color: "text-green-400",
        priority: 9,
      })

      newSuggestions.push({
        id: "bulk-delete",
        type: "bulk-action",
        title: `Supprimer ${selectedClients.length} client(s)`,
        description: "Supprimer définitivement les clients sélectionnés",
        action: "Supprimer",
        icon: Trash2,
        color: "text-red-400",
        priority: 2,
      })
    }

    // Suggestions de recherche avancée
    newSuggestions.push({
      id: "filter-location",
      type: "filter",
      title: "Filtrer par localisation",
      description: "Rechercher des clients par ville ou pays",
      action: "Filtrer par lieu",
      icon: MapPin,
      color: "text-cyan-400",
      priority: 4,
    })

    newSuggestions.push({
      id: "filter-recent",
      type: "filter",
      title: "Nouveaux clients ce mois",
      description: "Voir les clients inscrits récemment",
      action: "Voir les nouveaux",
      icon: Calendar,
      color: "text-orange-400",
      priority: 3,
    })

    // Trier par priorité
    setSuggestions(newSuggestions.sort((a, b) => b.priority - a.priority))

    // Définir le contexte actuel
    if (selectedClients.length > 0) {
      setCurrentContext(`${selectedClients.length} sélectionné(s)`)
    } else if (searchTerm) {
      setCurrentContext(`Recherche: "${searchTerm}"`)
    } else {
      setCurrentContext(`${totalClients} clients`)
    }
  }, [searchQuery, selectedClients, totalClients, searchTerm])

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
      case "segment":
      case "filter":
        if (suggestion.value) {
          onFilterChange({ [suggestion.type]: suggestion.value })
        }
        break
      case "action":
        if (suggestion.id === "export-clients" && onExport) {
          onExport()
        }
        break
      case "quick-action":
        if (suggestion.id === "add-client" && onAddClient) {
          onAddClient()
        }
        break
      case "bulk-action":
        if (onBulkAction) {
          onBulkAction(suggestion.id)
        }
        break
      case "search":
        // Activer la recherche
        setTimeout(() => searchInputRef.current?.focus(), 100)
        break
    }

    setIsActive(false)
    setShowSuggestions(false)
    setSearchQuery(searchTerm)

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
    if (selectedClients.length > 0) return "bg-blue-500/20 text-blue-300 border-blue-400/30"
    if (searchTerm) return "bg-green-500/20 text-green-300 border-green-400/30"
    return "bg-gray-500/20 text-gray-300 border-gray-400/30"
  }

  return (
    <div className={cn("relative flex flex-col items-center", className)} ref={containerRef} >
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
              selectedClients={selectedClients}
              onBack={onBack}
              onExport={onExport}
              onAddClient={onAddClient}
              onBulkAction={onBulkAction}
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
  selectedClients: string[]
  onBack: () => void
  onExport?: () => void
  onAddClient?: () => void
  onBulkAction?: (action: string) => void
}

const IdleState = ({
  onFocus,
  currentContext,
  getContextBadgeColor,
  selectedClients,
  onBack,
  onExport,
  onAddClient,
  onBulkAction,
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
        selectedClients.length > 0 ? "bg-blue-400" : "bg-gray-500",
      )}
    />

    {/* Clients context */}
    <div className="flex items-center gap-2 flex-1 min-w-0" onClick={onFocus}>
      <span className="truncate text-sm font-normal text-gray-300 hover:text-white">Clients</span>
      <Badge variant="outline" className={cn("text-xs font-medium animate-pulse ml-auto", getContextBadgeColor())}>
        {currentContext}
      </Badge>
    </div>

    {/* Right section - Actions */}
    <div className="flex items-center gap-1 flex-shrink-0 ml-2">
      {/* Bulk actions if clients selected */}
      {selectedClients.length > 0 && (
        <>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onBulkAction?.("bulk-email")}
            className="h-6 px-2 text-xs text-gray-400 hover:text-gray-200 hover:bg-white/10 rounded-md"
          >
            <Mail className="h-3 w-3 mr-1" />
            Email
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onBulkAction?.("bulk-discount")}
            className="h-6 px-2 text-xs text-gray-400 hover:text-gray-200 hover:bg-white/10 rounded-md"
          >
            <Gift className="h-3 w-3 mr-1" />
            Offre
          </Button>
        </>
      )}

      {/* Quick actions */}
      {selectedClients.length === 0 && (
        <>
          <Button
            variant="ghost"
            size="sm"
            onClick={onAddClient}
            className="h-6 px-2 text-xs text-gray-400 hover:text-gray-200 hover:bg-white/10 rounded-md"
          >
            <Plus className="h-3 w-3 mr-1" />
            Client
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={onExport}
            className="h-6 px-2 text-xs text-gray-400 hover:text-gray-200 hover:bg-white/10 rounded-md"
          >
            <Download className="h-3 w-3 mr-1" />
            Export
          </Button>
        </>
      )}

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
            <Filter className="h-4 w-4 mr-2" />
            Filtres avancés
          </DropdownMenuItem>
          <DropdownMenuItem className="text-gray-300 hover:text-white hover:bg-gray-700">
            <Users className="h-4 w-4 mr-2" />
            Segments
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
      placeholder="Rechercher des clients, filtrer, ou choisir une action..."
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
    segment: "Segments",
    filter: "Filtres",
    action: "Actions",
    "quick-action": "Actions rapides",
    "bulk-action": "Actions en lot",
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
          <Users className="h-12 w-12 mx-auto text-gray-500 mb-3" />
          <div className="font-medium text-sm mb-1 text-gray-200">Aucune suggestion trouvée</div>
          <div className="text-xs text-gray-400">
            {searchQuery ? "Essayez un autre terme de recherche" : "Commencez à taper pour voir les suggestions"}
          </div>
        </div>
      )}
    </div>
  )
}
