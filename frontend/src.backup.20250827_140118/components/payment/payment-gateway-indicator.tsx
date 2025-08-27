"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, CreditCard, CheckCircle, AlertCircle } from "lucide-react"
import paymentService from "@/services/paymentService"

interface PaymentGatewayIndicatorProps {
  className?: string
}

export function PaymentGatewayIndicator({ className }: PaymentGatewayIndicatorProps) {
  const [gatewayInfo, setGatewayInfo] = useState<{
    gateway: string
    priority: string
    message: string
  } | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    detectGateway()
  }, [])

  const detectGateway = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const result = await paymentService.detectGateway()
      
      if (result.success) {
        setGatewayInfo({
          gateway: result.gateway,
          priority: result.priority,
          message: result.message
        })
      } else {
        setError(result.message || 'Erreur lors de la détection de la passerelle')
      }
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la détection de la passerelle')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            Détection de la passerelle...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Vérification de votre configuration...
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-500" />
            Erreur de détection
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  if (!gatewayInfo) {
    return null
  }

  const isUserConfigured = gatewayInfo.priority === 'user_configured'
  const gatewayName = paymentService.getGatewayName(gatewayInfo.gateway)
  const gatewayColor = paymentService.getGatewayColor(gatewayInfo.gateway)
  const gatewayIcon = paymentService.getGatewayIcon(gatewayInfo.gateway)

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Passerelle de paiement
        </CardTitle>
        <CardDescription>
          Configuration automatique de votre système de paiement
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Indicateur de passerelle */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full ${gatewayColor} flex items-center justify-center text-white text-lg`}>
              {gatewayIcon}
            </div>
            <div>
              <div className="font-semibold">{gatewayName}</div>
              <div className="text-sm text-muted-foreground">
                {isUserConfigured ? 'Votre passerelle configurée' : 'Passerelle par défaut'}
              </div>
            </div>
          </div>
          
          <Badge variant={isUserConfigured ? "default" : "secondary"}>
            {isUserConfigured ? (
              <CheckCircle className="h-3 w-3 mr-1" />
            ) : (
              <CreditCard className="h-3 w-3 mr-1" />
            )}
            {isUserConfigured ? 'Configurée' : 'Par défaut'}
          </Badge>
        </div>

        {/* Message d'information */}
        <Alert>
          <AlertDescription>
            {gatewayInfo.message}
          </AlertDescription>
        </Alert>

        {/* Informations supplémentaires */}
        <div className="text-sm text-muted-foreground space-y-1">
          {isUserConfigured ? (
            <>
              <div>✅ Vos paiements passent par votre compte {gatewayName}</div>
              <div>✅ Vous recevez directement les fonds</div>
              <div>✅ Configuration personnalisée active</div>
            </>
          ) : (
            <>
              <div>💳 Utilisation des passerelles par défaut</div>
              <div>💳 PayDunya et Pawapay disponibles</div>
              <div>💳 Configuration simplifiée</div>
            </>
          )}
        </div>

        {/* Actions */}
        <div className="pt-2">
          {isUserConfigured ? (
            <div className="text-xs text-muted-foreground">
              Pour modifier votre configuration, allez dans Applications → {gatewayName}
            </div>
          ) : (
            <div className="text-xs text-muted-foreground">
              Pour utiliser votre propre passerelle, allez dans Applications → Moneroo
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
} 