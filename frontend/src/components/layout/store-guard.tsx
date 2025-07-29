import { ReactNode } from "react"

interface StoreGuardProps {
  children: ReactNode
}

export function StoreGuard({ children }: StoreGuardProps) {
  // Temporairement, permettre l'accès à tout
  return <>{children}</>
} 