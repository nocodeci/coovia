import { CircleLoader } from "@/components/ui/circle-loader"

interface LoadingScreenProps {
  message?: string
  size?: "sm" | "md" | "lg"
}

export function LoadingScreen({ message = "Chargement en cours...", size = "md" }: LoadingScreenProps) {
  const sizeMap = {
    sm: "sm" as const,
    md: "md" as const,
    lg: "lg" as const
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <CircleLoader size={sizeMap[size]} message={message} />
    </div>
  )
} 