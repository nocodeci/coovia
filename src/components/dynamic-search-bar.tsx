"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { IconSearch, IconFilter, IconBell, IconPlus, IconArrowRight } from "@tabler/icons-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface SearchState {
  id: string
  label: string
  dimensions: { w: number; h: number; r: number }
  context: string
}

interface DynamicSearchBarProps {
  currentPage?: string
  className?: string
  onSearch?: (query: string) => void
  onFilter?: () => void
  onNotification?: () => void
  onQuickAction?: () => void
}

const searchStates: Record<string, SearchState[]> = {
  dashboard: [
    {
      id: "idle",
      label: "Rechercher...",
      dimensions: { w: 320, h: 42, r: 21 },
      context: "dashboard",
    },
    {
      id: "active",
      label: "Recherche active",
      dimensions: { w: 480, h: 48, r: 24 },
      context: "dashboard",
    },
    {
      id: "suggestions",
      label: "Avec suggestions",
      dimensions: { w: 520, h: 180, r: 28 },
      context: "dashboard",
    },
    {
      id: "filters",
      label: "Avec filtres",
      dimensions: { w: 600, h: 120, r: 28 },
      context: "dashboard",
    },
  ],
  products: [
    {
      id: "idle",
      label: "Rechercher des produits...",
      dimensions: { w: 360, h: 42, r: 21 },
      context: "products",
    },
    {
      id: "active",
      label: "Recherche produits",
      dimensions: { w: 500, h: 48, r: 24 },
      context: "products",
    },
    {
      id: "categories",
      label: "Par catégories",
      dimensions: { w: 580, h: 140, r: 28 },
      context: "products",
    },
  ],
  customers: [
    {
      id: "idle",
      label: "Rechercher des clients...",
      dimensions: { w: 340, h: 42, r: 21 },
      context: "customers",
    },
    {
      id: "active",
      label: "Recherche clients",
      dimensions: { w: 480, h: 48, r: 24 },
      context: "customers",
    },
    {
      id: "recent",
      label: "Clients récents",
      dimensions: { w: 560, h: 160, r: 28 },
      context: "customers",
    },
  ],
}

export function DynamicSearchBar({
  currentPage = "dashboard",
  className,
  onSearch,
  onFilter,
  onNotification,
  onQuickAction,
}: DynamicSearchBarProps) {
  const [currentState, setCurrentState] = useState(0)
  const [isActive, setIsActive] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  const states = searchStates[currentPage] || searchStates.dashboard
  const activeState = states[currentState]

  // Auto-collapse after inactivity
  useEffect(() => {
    if (isActive && currentState > 0) {
      const timer = setTimeout(() => {
        setCurrentState(0)
        setIsActive(false)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [isActive, currentState])

  const handleFocus = () => {
    setIsActive(true)
    setCurrentState(1)
  }

  const handleBlur = () => {
    if (!searchQuery) {
      setTimeout(() => {
        setCurrentState(0)
        setIsActive(false)
      }, 200)
    }
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)

    if (query.length > 0) {
      setCurrentState(2) // Show suggestions
    } else {
      setCurrentState(1) // Back to active state
    }

    onSearch?.(query)
  }

  const showFilters = () => {
    setCurrentState(3)
    onFilter?.()
  }

  return (
    <div className={cn("relative flex justify-center", className)}>
      <motion.div
        initial={{ width: 320, height: 42, borderRadius: 21 }}
        animate={{
          width: activeState.dimensions.w,
          height: activeState.dimensions.h,
          borderRadius: activeState.dimensions.r,
        }}
        transition={{
          type: "spring",
          bounce: 0.3,
          damping: 15,
          stiffness: 200,
        }}
        className="bg-white/90 backdrop-blur-md border border-gray-200/50 shadow-lg relative overflow-hidden"
      >
        <AnimatePresence mode="wait">
          {currentState === 0 && <IdleState key="idle" onFocus={handleFocus} placeholder={activeState.label} />}
          {currentState === 1 && (
            <ActiveState
              key="active"
              searchQuery={searchQuery}
              onChange={handleSearch}
              onBlur={handleBlur}
              onFilter={showFilters}
              inputRef={inputRef}
            />
          )}
          {currentState === 2 && (
            <SuggestionsState
              key="suggestions"
              searchQuery={searchQuery}
              onChange={handleSearch}
              onBlur={handleBlur}
              currentPage={currentPage}
              inputRef={inputRef}
            />
          )}
          {currentState === 3 && (
            <FiltersState
              key="filters"
              searchQuery={searchQuery}
              onChange={handleSearch}
              onBlur={handleBlur}
              currentPage={currentPage}
              inputRef={inputRef}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

// État inactif
const IdleState = ({ onFocus, placeholder }: { onFocus: () => void; placeholder: string }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="flex items-center h-full px-4 cursor-text"
    onClick={onFocus}
  >
    <IconSearch size={18} className="text-gray-400 mr-3" />
    <span className="text-gray-500 text-sm">{placeholder}</span>
    <div className="ml-auto flex items-center gap-1">
      <kbd className="px-2 py-1 text-xs bg-gray-100 rounded border">⌘</kbd>
      <kbd className="px-2 py-1 text-xs bg-gray-100 rounded border">K</kbd>
    </div>
  </motion.div>
)

// État actif
const ActiveState = ({
  searchQuery,
  onChange,
  onBlur,
  onFilter,
  inputRef,
}: {
  searchQuery: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onBlur: () => void
  onFilter: () => void
  inputRef: React.RefObject<HTMLInputElement>
}) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="flex items-center h-full px-4"
  >
    <IconSearch size={18} className="text-gray-600 mr-3" />
    <input
      ref={inputRef}
      type="text"
      value={searchQuery}
      onChange={onChange}
      onBlur={onBlur}
      className="flex-1 bg-transparent outline-none text-sm placeholder-gray-400"
      placeholder="Tapez pour rechercher..."
      autoFocus
    />
    <Button variant="ghost" size="sm" onClick={onFilter} className="h-8 w-8 p-0 hover:bg-gray-100">
      <IconFilter size={16} />
    </Button>
  </motion.div>
)

// État avec suggestions
const SuggestionsState = ({
  searchQuery,
  onChange,
  onBlur,
  currentPage,
  inputRef,
}: {
  searchQuery: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onBlur: () => void
  currentPage: string
  inputRef: React.RefObject<HTMLInputElement>
}) => {
  const suggestions = getSuggestions(currentPage, searchQuery)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col h-full"
    >
      {/* Input area */}
      <div className="flex items-center px-4 py-3 border-b border-gray-100">
        <IconSearch size={18} className="text-gray-600 mr-3" />
        <input
          ref={inputRef}
          type="text"
          value={searchQuery}
          onChange={onChange}
          onBlur={onBlur}
          className="flex-1 bg-transparent outline-none text-sm"
          placeholder="Tapez pour rechercher..."
        />
      </div>

      {/* Suggestions */}
      <div className="flex-1 p-2">
        {suggestions.map((suggestion, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex items-center px-3 py-2 hover:bg-gray-50 rounded-lg cursor-pointer"
          >
            <suggestion.icon size={16} className="text-gray-400 mr-3" />
            <span className="text-sm">{suggestion.text}</span>
            <IconArrowRight size={14} className="ml-auto text-gray-300" />
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

// État avec filtres
const FiltersState = ({
  searchQuery,
  onChange,
  onBlur,
  currentPage,
  inputRef,
}: {
  searchQuery: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onBlur: () => void
  currentPage: string
  inputRef: React.RefObject<HTMLInputElement>
}) => {
  const filters = getFilters(currentPage)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col h-full"
    >
      {/* Input area */}
      <div className="flex items-center px-4 py-3 border-b border-gray-100">
        <IconSearch size={18} className="text-gray-600 mr-3" />
        <input
          ref={inputRef}
          type="text"
          value={searchQuery}
          onChange={onChange}
          onBlur={onBlur}
          className="flex-1 bg-transparent outline-none text-sm"
          placeholder="Rechercher avec filtres..."
        />
      </div>

      {/* Filters */}
      <div className="flex-1 p-3">
        <div className="flex flex-wrap gap-2">
          {filters.map((filter, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
            >
              <Badge variant="secondary" className="cursor-pointer hover:bg-gray-200 transition-colors">
                {filter}
              </Badge>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

// Fonctions utilitaires
function getSuggestions(page: string, query: string) {
  const baseSuggestions = {
    dashboard: [
      { icon: IconBell, text: "Notifications récentes" },
      { icon: IconPlus, text: "Ajouter un produit" },
      { icon: IconFilter, text: "Filtrer par date" },
    ],
    products: [
      { icon: IconSearch, text: "Produits en stock" },
      { icon: IconFilter, text: "Par catégorie" },
      { icon: IconPlus, text: "Nouveau produit" },
    ],
    customers: [
      { icon: IconSearch, text: "Clients actifs" },
      { icon: IconFilter, text: "Par localisation" },
      { icon: IconBell, text: "Clients récents" },
    ],
  }

  return baseSuggestions[page as keyof typeof baseSuggestions] || baseSuggestions.dashboard
}

function getFilters(page: string) {
  const baseFilters = {
    dashboard: ["Aujourd'hui", "Cette semaine", "Ce mois", "Revenus", "Ventes"],
    products: ["En stock", "Rupture", "Catégorie", "Prix", "Popularité"],
    customers: ["Actifs", "Nouveaux", "VIP", "Localisation", "Commandes"],
  }

  return baseFilters[page as keyof typeof baseFilters] || baseFilters.dashboard
}
