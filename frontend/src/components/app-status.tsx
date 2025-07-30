import { Badge } from "@/components/ui/badge"
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react"

interface AppStatusProps {
  isLoading?: boolean
  error?: string | null
  tokenValid?: boolean
}

export function AppStatus({ isLoading, error, tokenValid }: AppStatusProps) {
  if (isLoading) {
    return (
      <Badge variant="secondary" className="flex items-center gap-1">
        <Loader2 className="h-3 w-3 animate-spin" />
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