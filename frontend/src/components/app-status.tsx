import { Badge } from "@/components/ui/badge"
import { CheckCircle, AlertCircle } from "lucide-react"
import { CircleLoader } from "@/components/ui/circle-loader"

interface AppStatusProps {
  isLoading?: boolean
  error?: string | null
  tokenValid?: boolean
}

export function AppStatus({ isLoading, error, tokenValid }: AppStatusProps) {
  if (isLoading) {
    return (
      <Badge variant="secondary" className="flex items-center gap-1">
        <CircleLoader size="sm" className="!flex-row" />
        Chargement...
      </Badge>
    )
  }

  if (error) {
    return (
      <Badge variant="destructive" className="flex items-center gap-1">
        <AlertCircle className="h-3 w-3" />
        Erreur
      </Badge>
    )
  }

  if (tokenValid === false) {
    return (
      <Badge variant="destructive" className="flex items-center gap-1">
        <AlertCircle className="h-3 w-3" />
        Token invalide
      </Badge>
    )
  }

  return (
    <Badge variant="default" className="flex items-center gap-1">
      <CheckCircle className="h-3 w-3" />
      Connecté
    </Badge>
  )
} 