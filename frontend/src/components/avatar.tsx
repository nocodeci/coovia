import { cn } from "@/lib/utils"

interface AvatarProps {
  name: string
  size?: "sm" | "md" | "lg"
  className?: string
}

// Fonction pour extraire les initiales du nom
const getInitials = (name: string): string => {
  return name
    .split(" ")
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

// Fonction pour générer une couleur basée sur le nom
const getAvatarColor = (name: string): string => {
  const colors = [
    "bg-blue-500",
    "bg-green-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-indigo-500",
    "bg-yellow-500",
    "bg-red-500",
    "bg-teal-500",
    "bg-orange-500",
    "bg-cyan-500",
  ]

  const charCode = name.charCodeAt(0)
  return colors[charCode % colors.length]
}

const sizeVariants = {
  sm: "h-6 w-6 text-xs",
  md: "h-8 w-8 text-sm",
  lg: "h-10 w-10 text-base",
}

export const Avatar = ({ name, size = "md", className }: AvatarProps) => {
  const initials = getInitials(name)
  const colorClass = getAvatarColor(name)

  return (
    <div
      className={cn(
        "rounded-full flex items-center justify-center text-white font-semibold select-none",
        sizeVariants[size],
        colorClass,
        className,
      )}
    >
      {initials}
    </div>
  )
}
