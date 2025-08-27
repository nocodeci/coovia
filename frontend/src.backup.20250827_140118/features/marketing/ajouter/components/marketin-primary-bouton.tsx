"use client"

import { Percent } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useNavigate } from "@tanstack/react-router"

export function MarketingPrimaryButtons() {
  const navigate = useNavigate()

  const handleAddPromoCode = () => {
    navigate({ to: "/marketing/ajouter" })
  }

  return (
    <div className="flex items-center space-x-2">
      <Button
        onClick={handleAddPromoCode}
        size="sm"
        className="bg-[oklch(0.5_0.3_100)] text-foreground hover:bg-[oklch(0.4_0.3_100)]"
      >
        <Percent className="mr-2 h-4 w-4" />
        Créer un code promo
      </Button>
    </div>
  )
}
