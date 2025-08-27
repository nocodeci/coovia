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

// Animation variants pour les commandes
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
const IdleView = ({ onViewChange }: { onViewChange: (view: View) => void }) => (
  <motion.div
    className="flex w-96 items-center gap-3 px-4 py-2"
    layout
  >
    <ShoppingCart className="h-5 w-5 text-orange-400" />
    <div className="flex-1">
      <p className="text-sm font-medium text-white">Commandes</p>
      <p className="text-xs text-white opacity-70">Gestion des commandes</p>
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
      placeholder="Rechercher des commandes..."
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
      <p className="text-xs text-white opacity-70">Statut: Téléchargées</p>
    </div>
    <div className="flex gap-1">
      <button className="rounded-full bg-green-500/20 px-2 py-1 text-xs text-green-400">
        Téléchargées
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

const ActionsView = ({ onViewChange, onAddOrder, onExport }: { 
  onViewChange: (view: View) => void
  onAddOrder?: () => void
  onExport?: () => void
}) => {
  const [isExporting, setIsExporting] = useState(false)
  const [exportStatus, setExportStatus] = useState<"idle" | "exporting" | "success">("idle")

  const handleExport = async () => {
    if (isExporting) return
    
    setIsExporting(true)
    setExportStatus("exporting")
    
    // Simuler un délai d'export
    setTimeout(() => {
      setIsExporting(false)
      setExportStatus("success")
      onExport?.()
      
      // Afficher le succès pendant 2 secondes puis retourner à idle
      setTimeout(() => {
        setExportStatus("idle")
        onViewChange("idle")
      }, 2000)
    }, 2000)
  }

           return (
           <div className="flex w-96 items-center gap-3 px-4 py-2">
      <Zap className="h-5 w-5 text-yellow-400" />
      <div className="flex-1">
        {exportStatus === "exporting" ? (
          <>
            <p className="text-sm font-medium text-white">Export en cours</p>
            <p className="text-xs text-white opacity-70">Préparation des données...</p>
          </>
        ) : exportStatus === "success" ? (
          <>
            <p className="text-sm font-medium text-white">Export réussi</p>
            <p className="text-xs text-white opacity-70">Les données ont été exportées</p>
          </>
        ) : (
          <>
            <p className="text-sm font-medium text-white">Actions rapides</p>
            <p className="text-xs text-white opacity-70">Créer, exporter, gérer</p>
          </>
        )}
      </div>
      <div className="flex gap-1">
        {exportStatus === "idle" && (
          <>
            <button
              onClick={onAddOrder}
              className="rounded-full bg-yellow-500/20 px-2 py-1 text-xs text-yellow-400"
            >
              <Plus className="h-3 w-3 mr-1" />
              Ajouter
            </button>
            <button
              onClick={handleExport}
              disabled={isExporting}
              data-export-button
              className={cn(
                "rounded-full px-2 py-1 text-xs transition-all",
                isExporting 
                  ? "bg-yellow-500/40 text-yellow-300 cursor-not-allowed" 
                  : "bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30"
              )}
            >
              {isExporting ? (
                <>
                  <div className="h-3 w-3 mr-1 animate-spin rounded-full border border-yellow-400 border-t-transparent" />
                  Export...
                </>
              ) : (
                <>
                  <Download className="h-3 w-3 mr-1" />
                  Export
                </>
              )}
            </button>
          </>
        )}
        {exportStatus === "exporting" && (
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 animate-spin rounded-full border border-yellow-400 border-t-transparent" />
            <span className="text-xs text-yellow-400">Export en cours...</span>
          </div>
        )}
        {exportStatus === "success" && (
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-400" />
            <span className="text-xs text-green-400">Export réussi</span>
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
      <p className="text-xs text-white opacity-70">4 téléchargées • 1 annulée</p>
    </div>
    <div className="h-1 w-16 overflow-hidden rounded-full bg-white/20">
      <motion.div
        className="h-full bg-purple-400"
        initial={{ width: "0%" }}
        animate={{ width: "80%" }}
        transition={{ duration: 1, ease: "ease-out" }}
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
      <p className="text-sm font-medium text-white">Nouvelle commande</p>
      <p className="text-xs text-white opacity-70">ORD-006 • Jean Dupont</p>
    </div>
    <span className="rounded-full bg-red-400/20 px-2 py-0.5 text-xs text-red-400">
      Nouveau
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
  type: "navigation" | "action" | "quick-action" | "search" | "filter"
  title: string
  description: string
  action: string
  icon: React.ComponentType<{ className?: string }>
  color: string
  value?: string
  priority: number
}

interface CommandesDynamicSearchBarProps {
  onBack: () => void
  onExport?: () => void
  onAddOrder?: () => void
  onNavigate?: (section: string) => void
  className?: string
  // Props pour contrôler le Dynamic Island depuis l'extérieur
  currentView?: View
  onViewChange?: (view: View) => void
  onSearchTrigger?: () => void
  onFilterTrigger?: () => void
  onActionsTrigger?: () => void
  onAnalyticsTrigger?: () => void
  onNotificationsTrigger?: () => void
}

export function CommandesDynamicSearchBar({
  onBack,
  onExport,
  onAddOrder,
  onNavigate,
  className = "",
  currentView: externalCurrentView,
  onViewChange: externalOnViewChange,
  onSearchTrigger,
  onFilterTrigger,
  onActionsTrigger,
  onAnalyticsTrigger,
  onNotificationsTrigger,
}: CommandesDynamicSearchBarProps) {
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

  // Générer les suggestions intelligentes pour les commandes
  useEffect(() => {
    const newSuggestions: Suggestion[] = []

    // Suggestions de recherche
    newSuggestions.push({
      id: "search-orders",
      type: "search",
      title: "Rechercher des commandes",
      description: "Rechercher par numéro, client ou statut",
      action: "Commencer la recherche",
      icon: Search,
      color: "text-blue-400",
      priority: 10,
    })

    // Actions rapides
    newSuggestions.push({
      id: "add-order",
      type: "quick-action",
      title: "Nouvelle commande",
      description: "Créer une nouvelle commande manuellement",
      action: "Créer une commande",
      icon: Plus,
      color: "text-green-400",
      priority: 9,
    })

    newSuggestions.push({
      id: "export-orders",
      type: "action",
      title: "Exporter les commandes",
      description: "Télécharger un rapport des commandes",
      action: "Exporter",
      icon: Download,
      color: "text-purple-400",
      priority: 8,
    })

    // Filtres et tri
    newSuggestions.push({
      id: "filter-pending",
      type: "filter",
      title: "Filtrer par statut",
      description: "Afficher les commandes par statut",
      action: "Filtrer",
      icon: Filter,
      color: "text-orange-400",
      priority: 7,
    })

    newSuggestions.push({
      id: "sort-orders",
      type: "action",
      title: "Trier les commandes",
      description: "Trier par date, montant ou statut",
      action: "Trier",
      icon: SortAsc,
      color: "text-indigo-400",
      priority: 6,
    })

    // Navigation vers les sections
    newSuggestions.push({
      id: "nav-customers",
      type: "navigation",
      title: "Gérer les clients",
      description: "Accéder à la gestion des clients",
      action: "Aller aux clients",
      icon: Users,
      color: "text-cyan-400",
      value: "customers",
      priority: 5,
    })

    newSuggestions.push({
      id: "nav-products",
      type: "navigation",
      title: "Gérer les produits",
      description: "Accéder à la gestion des produits",
      action: "Aller aux produits",
      icon: Package,
      color: "text-yellow-400",
      value: "products",
      priority: 4,
    })

    // Actions de gestion des commandes
    newSuggestions.push({
      id: "view-pending",
      type: "filter",
      title: "Commandes en attente",
      description: "Voir les commandes en attente de traitement",
      action: "Voir les en attente",
      icon: Clock,
      color: "text-yellow-400",
      priority: 3,
    })

    newSuggestions.push({
      id: "view-completed",
      type: "filter",
      title: "Commandes terminées",
      description: "Voir les commandes terminées",
      action: "Voir les terminées",
      icon: CheckCircle,
      color: "text-green-400",
      priority: 2,
    })

    newSuggestions.push({
      id: "view-cancelled",
      type: "filter",
      title: "Commandes annulées",
      description: "Voir les commandes annulées",
      action: "Voir les annulées",
      icon: XCircle,
      color: "text-red-400",
      priority: 1,
    })

    // Trier par priorité
    setSuggestions(newSuggestions.sort((a, b) => b.priority - a.priority))

    // Définir le contexte actuel
    setCurrentContext("Commandes • Gestion")
  }, [])

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
        // Déclencher automatiquement l'export après un délai
        setTimeout(() => {
          const exportButton = document.querySelector('[data-export-button]') as HTMLButtonElement
          if (exportButton) {
            exportButton.click()
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
        if (suggestion.value && onNavigate) {
          onNavigate(suggestion.value)
        }
        break
      case "action":
        if (suggestion.id === "export-orders" && onExport) {
          onExport()
        }
        break
      case "quick-action":
        if (suggestion.id === "add-order" && onAddOrder) {
          onAddOrder()
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

    setCurrentView("idle")
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
        return <ActionsView onViewChange={handleViewChange} onAddOrder={onAddOrder} onExport={onExport} />
      case "analytics":
        return <AnalyticsView onViewChange={handleViewChange} />
      case "notifications":
        return <NotificationsView onViewChange={handleViewChange} />
      default:
        return <IdleView onViewChange={handleViewChange} />
    }
  }, [currentView, searchQuery, onAddOrder, onExport])

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

 