import { Button } from "@/components/ui/button"
import { Store } from "lucide-react"
import { openBoutique } from "@/utils/store-links"
import { cn } from "@/lib/utils"

interface ViewStoreButtonProps {
  storeId: string
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
  children?: React.ReactNode
}

export function ViewStoreButton({ 
  storeId, 
  variant = "outline", 
  size = "default",
  className,
  children 
}: ViewStoreButtonProps) {
  const handleClick = () => {
    openBoutique(storeId)
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleClick}
      className={cn("flex items-center gap-2", className)}
    >
      <Store className="h-4 w-4" />
      {children || "Voir la boutique"}
    </Button>
  )
}
