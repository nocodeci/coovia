import { useMemo } from 'react'

// Stack de z-index pour gérer les couches d'interface
const Z_INDEX_STACK = {
  // Couches de base
  base: 0,
  content: 1,
  
  // Éléments interactifs
  dropdown: 10,
  tooltip: 20,
  popover: 30,
  
  // Overlays et modales
  overlay: 40,
  modal: 50,
  notification: 60,
  
  // Chargement et états critiques
  loading: 70,
  critical: 80,
  
  // Maximum pour les cas d'urgence
  max: 100
} as const

type ZIndexLayer = keyof typeof Z_INDEX_STACK

interface UseZIndexOptions {
  layer: ZIndexLayer
  offset?: number
  custom?: number
}

/**
 * Hook pour gérer les z-index de manière centralisée
 * Évite les conflits et assure une hiérarchie cohérente
 */
export function useZIndex({ layer, offset = 0, custom }: UseZIndexOptions) {
  return useMemo(() => {
    if (custom !== undefined) {
      return custom
    }
    
    const baseZIndex = Z_INDEX_STACK[layer]
    return baseZIndex + offset
  }, [layer, offset, custom])
}

/**
 * Hook spécialisé pour les overlays de chargement
 * Gère automatiquement la priorité selon le type
 */
export function useLoadingZIndex(type: 'overlay' | 'content' | 'indicator' = 'overlay') {
  return useMemo(() => {
    switch (type) {
      case 'overlay':
        return useZIndex({ layer: 'loading' })
      case 'content':
        return useZIndex({ layer: 'overlay', offset: -5 })
      case 'indicator':
        return useZIndex({ layer: 'content', offset: 5 })
      default:
        return useZIndex({ layer: 'loading' })
    }
  }, [type])
}

/**
 * Constantes exportées pour usage direct
 */
export const Z_INDEX = Z_INDEX_STACK
