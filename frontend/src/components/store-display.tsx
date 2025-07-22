import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useStore } from "@/context/store-context"
import { cn } from "@/lib/utils"

interface StoreDisplayProps {
  showName?: boolean
  size?: "sm" | "md" | "lg"
  className?: string
}

// Fonction pour générer une couleur basée sur l'ID de la boutique
const getStoreColor = (storeId: string): string => {
  const colors = [
    "bg-purple-500",
    "bg-blue-500",
    "bg-green-500",
    "bg-orange-500",
    "bg-pink-500",
    "bg-indigo-500",
    "bg-red-500",
    "bg-teal-500",
  ]

  // Utilise l'ID pour générer un index consistant
  const hash = storeId.split("").reduce((a, b) => {
    a = (a << 5) - a + b.charCodeAt(0)
    return a & a
  }, 0)

  return colors[Math.abs(hash) % colors.length]
}

// Fonction pour obtenir les initiales du nom de la boutique
const getStoreInitials = (name: string): string => {
  return name
    .split(" ")
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

export function StoreDisplay({ showName = true, size = "md", className }: StoreDisplayProps) {
  const { selectedStore, isLoading } = useStore()

  const sizeClasses = {
    sm: "h-6 w-6 text-xs",
    md: "h-8 w-8 text-sm",
    lg: "h-10 w-10 text-base",
  }

  const textSizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  }

  if (isLoading) {
    return (
      <div className={cn("flex items-center gap-3", className)}>
        <div className={cn("animate-pulse rounded-full bg-muted", sizeClasses[size])} />
        {showName && <div className="h-5 w-32 animate-pulse rounded bg-muted" />}
      </div>
    )
  }

  const storeName = selectedStore?.name || "Ma Boutique"
  const storeInitials = selectedStore ? getStoreInitials(selectedStore.name) : "MB"
  const storeColorClass = selectedStore ? getStoreColor(selectedStore.id) : "bg-purple-500"

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <Avatar className={sizeClasses[size]}>
        <AvatarFallback className={cn("text-white font-semibold", storeColorClass)}>{storeInitials}</AvatarFallback>
      </Avatar>

      {showName && <span className={cn("font-semibold text-foreground", textSizeClasses[size])}>{storeName}</span>}
    </div>
  )
}
