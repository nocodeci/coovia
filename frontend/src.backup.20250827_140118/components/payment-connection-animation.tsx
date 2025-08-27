"use client"

import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"

interface PaymentConnectionAnimationProps {
  paymentMethodLogo: string
  paymentGatewayLogo: string
  paymentMethodName: string
  paymentGatewayName: string
  status: string
}

export function PaymentConnectionAnimation({
  paymentMethodLogo,
  paymentGatewayLogo,
  paymentMethodName,
  paymentGatewayName,
  status,
}: PaymentConnectionAnimationProps) {
  const [animationState, setAnimationState] = useState<"idle" | "animating" | "completed">("idle")

  useEffect(() => {
    // Démarrer l'animation après le montage du composant
    setAnimationState("animating")

    // Simuler la fin de l'animation après 1.5 secondes
    const timer = setTimeout(() => {
      setAnimationState("completed")
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-blue-500"
      case "processing":
        return "bg-yellow-500"
      case "completed":
        return "bg-emerald-500"
      case "failed":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="flex items-center justify-center w-full h-full">
      <div className="flex items-center gap-2 relative">
        {/* Logo de la méthode de paiement */}
        <div className="relative">
          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200">
            <img
              src={paymentMethodLogo || "/placeholder.svg"}
              alt={paymentMethodName}
              className="w-5 h-5 object-contain"
            />
          </div>
          <span className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 text-xs text-gray-500 whitespace-nowrap">
            {paymentMethodName}
          </span>
        </div>

        {/* Ligne de connexion */}
        <div className="relative w-16 h-0.5 bg-gray-200">
          {/* Indicateur de progression */}
          <div
            className={cn(
              "absolute top-0 left-0 h-full transition-all duration-1000",
              getStatusColor(status),
              animationState === "idle" ? "w-0" : animationState === "completed" ? "w-full" : "w-1/2",
            )}
          />

          {/* Cercle de progression */}
          <div
            className={cn(
              "absolute top-1/2 transform -translate-y-1/2 w-2 h-2 rounded-full transition-all duration-1000",
              getStatusColor(status),
              animationState === "idle"
                ? "left-0"
                : animationState === "completed"
                  ? "left-full -translate-x-full"
                  : "left-1/2 -translate-x-1/2",
            )}
          />
        </div>

        {/* Logo de la passerelle de paiement */}
        <div className="relative">
          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200">
            <img
              src={paymentGatewayLogo || "/placeholder.svg"}
              alt={paymentGatewayName}
              className="w-5 h-5 object-contain"
            />
          </div>
          <span className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 text-xs text-gray-500 whitespace-nowrap">
            {paymentGatewayName}
          </span>
        </div>
      </div>
    </div>
  )
}
