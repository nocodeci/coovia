"use client"

import React, { createContext, useContext, ReactNode } from 'react'
import { useSanctumAuth } from '@/hooks/useSanctumAuth'

// Créer le contexte Sanctum
const SanctumContext = createContext<ReturnType<typeof useSanctumAuth> | null>(null)

// Hook pour utiliser le contexte Sanctum
export const useSanctumContext = () => {
  const context = useContext(SanctumContext)
  if (!context) {
    throw new Error('useSanctumContext doit être utilisé dans un SanctumProvider')
  }
  return context
}

// Provider Sanctum
interface SanctumProviderProps {
  children: ReactNode
}

export function SanctumProvider({ children }: SanctumProviderProps) {
  const sanctumAuth = useSanctumAuth()

  return (
    <SanctumContext.Provider value={sanctumAuth}>
      {children}
    </SanctumContext.Provider>
  )
}
