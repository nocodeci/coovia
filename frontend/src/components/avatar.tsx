import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"

const avatarVariants = cva(
  "inline-flex items-center justify-center rounded-full bg-muted text-muted-foreground font-medium",
  {
    variants: {
      size: {
        sm: "h-8 w-8 text-xs",
        md: "h-10 w-10 text-sm",
        lg: "h-12 w-12 text-base",
        xl: "h-16 w-16 text-lg",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
)

interface AvatarProps extends VariantProps<typeof avatarVariants> {
  name: string
  image?: string
  className?: string
}

export function Avatar({ name, image, size, className }: AvatarProps) {
  // Obtenir les initiales du nom (maximum 2 caractères)
  const getInitials = (name: string) => {
    const parts = name.split(" ")
    if (parts.length === 1) {
      return parts[0].charAt(0).toUpperCase()
    }
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase()
  }

  // Générer une couleur de fond cohérente basée sur le nom
  const getColorFromName = (name: string) => {
    const colors = [
      "bg-blue-100 text-blue-800",
      "bg-green-100 text-green-800",
      "bg-yellow-100 text-yellow-800",
      "bg-red-100 text-red-800",
      "bg-purple-100 text-purple-800",
      "bg-pink-100 text-pink-800",
      "bg-indigo-100 text-indigo-800",
      "bg-gray-100 text-gray-800",
    ]

    // Utiliser la somme des codes de caractères pour déterminer l'index de couleur
    const charSum = name.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0)
    return colors[charSum % colors.length]
  }

  const colorClass = getColorFromName(name)
  const initials = getInitials(name)

  return (
    <div className={cn(avatarVariants({ size }), colorClass, className)}>
      {image ? (
        <img
          src={image || "/placeholder.svg"}
          alt={name}
          className="h-full w-full object-cover rounded-full"
          onError={(e) => {
            // Fallback to initials if image fails to load
            e.currentTarget.style.display = "none"
          }}
        />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  )
}
