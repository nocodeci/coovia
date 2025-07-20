"use client"

import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SimpleNavProps {
  title: string
  onBack?: () => void
  showBackButton?: boolean
}

export function SimpleNav({ title, onBack, showBackButton = true }: SimpleNavProps) {
  return (
    <div className="flex items-center gap-3">
      {showBackButton && (
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200"
          onClick={onBack}
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="sr-only">Retour</span>
        </Button>
      )}

      <div className="flex flex-col">
        <span className="text-sm font-semibold text-gray-900 leading-none">{title}</span>
        <span className="text-xs text-gray-500 leading-none mt-0.5">Gestion de boutique</span>
      </div>
    </div>
  )
}
