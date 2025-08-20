"use client"

import React, { useState, useEffect, useRef } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import { useStore } from "@/context/store-context"
import { useNavigate } from "@tanstack/react-router"

interface StoreSelectorProps {
  className?: string
}

export function StoreSelector({ className = "" }: StoreSelectorProps) {
  const { currentStore, stores, setCurrentStore } = useStore()
  const [showStoreDropdown, setShowStoreDropdown] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  // Fonction pour obtenir les initiales d'une boutique
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  // Fonction pour gérer la sélection d'une boutique
  const handleStoreSelect = (store: any) => {
    // Éviter de changer si c'est la même boutique
    if (currentStore?.id === store.id) {
      setShowStoreDropdown(false)
      return
    }
    
    setCurrentStore(store)
    setShowStoreDropdown(false)
    
    // Rediriger vers le dashboard de la nouvelle boutique
    navigate({ to: `/${store.id}/dashboard` })
  }

  // Fermer le dropdown quand on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowStoreDropdown(false)
      }
    }

    if (showStoreDropdown) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showStoreDropdown])

  return (
    <div className={`flex items-center gap-2 relative ${className}`} ref={dropdownRef}>
      {/* Bouton de sélection de boutique */}
      <button
        onClick={() => setShowStoreDropdown(!showStoreDropdown)}
        className="flex items-center gap-2 hover:bg-gray-100 rounded-lg px-2 py-1 transition-colors"
      >
        <div
          className="polaris-avatar"
          style={{
            width: "2rem",
            height: "2rem",
            backgroundColor: "#7126FF",
            fontSize: "var(--p-font-size-275)",
          }}
        >
          <span style={{ color: "white" }}>
            {currentStore ? getInitials(currentStore.name) : "MS"}
          </span>
        </div>
        <span
          style={{
            fontSize: "var(--p-font-size-300)",
            fontWeight: "var(--p-font-weight-medium)",
            color: "var(--p-color-text)",
          }}
          className="hidden md:block"
        >
          {currentStore?.name || "Ma Boutique"}
        </span>
        {showStoreDropdown ? (
          <ChevronUp className="h-4 w-4 text-gray-500" />
        ) : (
          <ChevronDown className="h-4 w-4 text-gray-500" />
        )}
      </button>

      {/* Dropdown des boutiques */}
      {showStoreDropdown && (
        <div className="absolute top-full right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Sélectionner une boutique</h3>
            
            {/* Liste des boutiques (3 premières) */}
            <div className="space-y-2">
              {stores.slice(0, 3).map((store) => (
                <div
                  key={store.id}
                  onClick={() => handleStoreSelect(store)}
                  className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${
                    currentStore?.id === store.id 
                      ? 'bg-primary/10 border border-primary/20' 
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold"
                    style={{ backgroundColor: "#7126FF" }}
                  >
                    <span style={{ color: "white" }}>
                      {getInitials(store.name)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 truncate">
                      {store.name}
                    </div>
                    <div className="text-xs text-gray-500 truncate">
                      {store.slug ? `${store.slug}.wozif.store` : `${store.id}.wozif.store`}
                    </div>
                  </div>
                  {currentStore?.id === store.id && (
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                  )}
                </div>
              ))}
            </div>

            {/* Bouton pour voir plus de boutiques si nécessaire */}
            {stores.length > 3 && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                                    <button
                      onClick={() => {
                        // Naviguer vers la page de sélection de boutique
                        navigate({ to: '/store-selection' })
                      }}
                      className="w-full text-center text-sm text-primary hover:text-primary/80 font-medium"
                    >
                      Voir toutes les boutiques ({stores.length - 3} de plus)
                    </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
