import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { AlertTriangle, RefreshCw } from "lucide-react"
import { forceTokenUpdate } from "@/utils/force-token-update"

export function TokenWarning() {
  const currentToken = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null
  const isInvalidToken = currentToken === "6|yPCjSmhuLmJ9I7UT5yHqzdbvEChLPoAbgiiyyX3cc3e89da3"

  if (!isInvalidToken) return null

  return (
    <Alert className="border-red-200 bg-red-50 text-red-800">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Token d'authentification invalide</AlertTitle>
      <AlertDescription className="mt-2">
        <p className="mb-3">
          Votre token d'authentification est invalide. Cela peut causer des erreurs dans l'application.
        </p>
        <div className="flex gap-2">
          <Button 
            onClick={forceTokenUpdate} 
            size="sm" 
            variant="outline"
            className="border-red-300 text-red-700 hover:bg-red-100"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Corriger automatiquement
          </Button>
          <Button 
            onClick={() => window.location.reload()} 
            size="sm" 
            variant="outline"
          >
            Recharger la page
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  )
} 