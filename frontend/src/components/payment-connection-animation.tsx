"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface PaymentConnectionAnimationProps {
  paymentMethodLogo: string
  paymentGatewayLogo: string
  paymentMethodName: string
  paymentGatewayName: string
  status: "Initié" | "En Attente" | "Succès" | "Échec"
}

export function PaymentConnectionAnimation({
  paymentMethodLogo,
  paymentGatewayLogo,
  paymentMethodName,
  paymentGatewayName,
  status,
}: PaymentConnectionAnimationProps) {
  const [animationActive, setAnimationActive] = useState(false)

  useEffect(() => {
    // Démarrer l'animation pour les statuts actifs
    if (status === "En Attente" || status === "Initié") {
      setAnimationActive(true)
    } else {
      setAnimationActive(false)
    }
  }, [status])

  const getAnimationColor = () => {
    switch (status) {
      case "Initié":
        return "from-blue-500 to-blue-300"
      case "En Attente":
        return "from-yellow-500 to-yellow-300"
      case "Succès":
        return "from-green-500 to-green-300"
      case "Échec":
        return "from-red-500 to-red-300"
      default:
        return "from-gray-500 to-gray-300"
    }
  }

  const getStatusIcon = () => {
    switch (status) {
      case "Succès":
        return "✓"
      case "Échec":
        return "✗"
      default:
        return "→"
    }
  }

  return (
    <div className="flex items-center justify-center gap-2 relative">
      {/* Passerelle de paiement */}
      <div className="relative">
        <div className="w-10 h-10 rounded-lg border overflow-hidden bg-white">
          <img
            src={paymentGatewayLogo || "/placeholder.svg"}
            alt={paymentGatewayName}
            className="w-full h-full object-cover"
          />
        </div>
        {/* Pulse effect pour passerelle */}
        {animationActive && (
          <div className="absolute inset-0 rounded-lg border-2 border-blue-400 animate-ping opacity-75"></div>
        )}
      </div>

      {/* Ligne de connexion animée */}
      <div className="relative flex items-center">
        <div className="w-16 h-0.5 bg-gray-200 relative overflow-hidden rounded-full">
          {/* Ligne de base */}
          <div className="absolute inset-0 bg-gray-200"></div>

          {/* Animation de flux */}
          {animationActive && (
            <div
              className={cn("absolute inset-0 bg-gradient-to-r opacity-80 animate-pulse", getAnimationColor())}
            ></div>
          )}

          {/* Particules animées */}
          {animationActive && (
            <>
              <div
                className={cn(
                  "absolute top-0 w-2 h-0.5 bg-gradient-to-r rounded-full animate-bounce",
                  getAnimationColor(),
                )}
                style={{
                  animation: "slideRight 2s infinite linear",
                }}
              ></div>
              <div
                className={cn("absolute top-0 w-1 h-0.5 bg-gradient-to-r rounded-full", getAnimationColor())}
                style={{
                  animation: "slideRight 2s infinite linear 0.5s",
                }}
              ></div>
            </>
          )}
        </div>

        {/* Icône de statut au centre */}
        <div
          className={cn(
            "absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2",
            "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white",
            status === "Succès" && "bg-green-500",
            status === "Échec" && "bg-red-500",
            status === "En Attente" && "bg-yellow-500 animate-pulse",
            status === "Initié" && "bg-blue-500 animate-pulse",
          )}
        >
          {getStatusIcon()}
        </div>
      </div>

      {/* Moyen de paiement */}
      <div className="relative">
        <div className="w-12 h-8 rounded-lg border overflow-hidden bg-white">
          <img
            src={paymentMethodLogo || "/placeholder.svg?height=32&width=48&text=Payment"}
            alt={paymentMethodName}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.src = "/placeholder.svg?height=32&width=48&text=Payment"
            }}
          />
        </div>
        {/* Pulse effect pour moyen de paiement */}
        {status === "Succès" && (
          <div className="absolute inset-0 rounded-lg border-2 border-green-400 animate-ping opacity-75"></div>
        )}
        {status === "En Attente" && (
          <div className="absolute inset-0 rounded-lg border-2 border-yellow-400 animate-pulse opacity-75"></div>
        )}
      </div>

      {/* Indicateur de montant (optionnel) */}
      {animationActive && (
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
          <div className="bg-black/80 text-white text-xs px-2 py-1 rounded-full animate-bounce">
            💰 Transfert en cours...
          </div>
        </div>
      )}
    </div>
  )
}
