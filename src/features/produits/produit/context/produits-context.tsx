"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

type OpenType = "create" | "edit" | "delete" | null

interface ProduitsContextType {
  open: OpenType
  setOpen: (open: OpenType) => void
}

const ProduitsContext = createContext<ProduitsContextType | undefined>(undefined)

interface ProduitsProviderProps {
  children: ReactNode
}

export default function ProduitsProvider({ children }: ProduitsProviderProps) {
  const [open, setOpen] = useState<OpenType>(null)

  return <ProduitsContext.Provider value={{ open, setOpen }}>{children}</ProduitsContext.Provider>
}

export function useProduitsContext() {
  const context = useContext(ProduitsContext)
  if (context === undefined) {
    throw new Error("useProduitsContext must be used within a ProduitsProvider")
  }
  return context
}
