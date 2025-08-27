"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  CreditCard, 
  Key, 
  Settings, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Eye,
  EyeOff,
  Copy,
  ExternalLink
} from "lucide-react"
import { toast } from "sonner"
import { monerooConfigService, MonerooConfig } from "@/services/monerooConfigService"



interface MonerooIntegrationProps {
  isOpen: boolean
  onClose: () => void
  onConnect: (config: MonerooConfig) => void
  currentConfig?: MonerooConfig
}

export function MonerooIntegration({ isOpen, onClose, onConnect, currentConfig }: MonerooIntegrationProps) {
  const [config, setConfig] = useState<MonerooConfig>({
    publicKey: currentConfig?.publicKey || '',
    secretKey: currentConfig?.secretKey || '',
    environment: currentConfig?.environment || 'sandbox',
    webhookUrl: currentConfig?.webhookUrl || '',
    isConnected: currentConfig?.isConnected || false
  })

  const [showSecretKey, setShowSecretKey] = useState(false)
  const [isTesting, setIsTesting] = useState(false)
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null)

  const handleSave = async () => {
    if (!config.secretKey) {
      toast.error("Veuillez remplir la clé secrète")
      return
    }

    try {
      const result = await monerooConfigService.saveConfig({
        secretKey: config.secretKey,
        environment: config.environment,
        webhookUrl: config.webhookUrl,
      })

      if (result.success) {
        onConnect({ ...config, isConnected: true })
        toast.success(config.isConnected ? "Configuration mise à jour" : "Connexion Moneroo réussie !")
        onClose()
      } else {
        // Afficher les détails de l'erreur si disponibles
        const errorMessage = result.details ? `${result.message}: ${result.details}` : result.message
        toast.error(errorMessage || "Erreur lors de la sauvegarde")
      }
    } catch (error) {
      toast.error("Erreur lors de la sauvegarde de la configuration")
    }
  }

  const handleTestConnection = async () => {
    setIsTesting(true)
    setTestResult(null)

    try {
      const result = await monerooConfigService.testConfig({
        secretKey: config.secretKey,
        environment: config.environment,
      })

      if (result.success) {
        setTestResult({ success: true, message: "Connexion Moneroo réussie !" })
        toast.success("Test de connexion réussi")
      } else {
        setTestResult({ success: false, message: result.message || "Échec de la connexion. Vérifiez vos clés." })
        toast.error("Test de connexion échoué")
      }
    } catch (error) {
      setTestResult({ success: false, message: "Erreur de connexion" })
      toast.error("Erreur lors du test de connexion")
    } finally {
      setIsTesting(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success("Copié dans le presse-papiers")
  }

  const generateWebhookUrl = () => {
    const webhookUrl = `${window.location.origin}/api/moneroo/webhook`
    setConfig(prev => ({ ...prev, webhookUrl }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            {config.isConnected ? 'Configuration Moneroo' : 'Connexion Moneroo'}
          </DialogTitle>
          <DialogDescription>
            {config.isConnected 
              ? 'Modifiez votre configuration Moneroo existante.'
              : 'Configurez votre clé API Moneroo pour recevoir les paiements directement sur votre compte.'
            }
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Statut de connexion */}
          <div className="flex items-center gap-2">
            <Badge variant={config.isConnected ? "default" : "secondary"}>
              {config.isConnected ? "Connecté" : "Non connecté"}
            </Badge>
            {config.isConnected && <CheckCircle className="h-4 w-4 text-green-500" />}
          </div>

          {/* Clé API */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-4 w-4" />
                Clé API
              </CardTitle>
              <CardDescription>
                Obtenez votre clé secrète depuis votre dashboard Moneroo
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="secretKey">Clé secrète</Label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Input
                      id="secretKey"
                      type={showSecretKey ? "text" : "password"}
                      value={config.secretKey}
                      onChange={(e) => setConfig(prev => ({ ...prev, secretKey: e.target.value }))}
                      placeholder="sk_test_..."
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
                      onClick={() => setShowSecretKey(!showSecretKey)}
                    >
                      {showSecretKey ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                    </Button>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(config.secretKey)}
                    disabled={!config.secretKey}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Cette clé est utilisée pour authentifier vos requêtes API. Gardez-la secrète.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Environnement</Label>
                <div className="flex gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="sandbox"
                      checked={config.environment === 'sandbox'}
                      onCheckedChange={(checked) => 
                        setConfig(prev => ({ ...prev, environment: checked ? 'sandbox' : 'live' }))
                      }
                    />
                    <Label htmlFor="sandbox">Sandbox (Test)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="live"
                      checked={config.environment === 'live'}
                      onCheckedChange={(checked) => 
                        setConfig(prev => ({ ...prev, environment: checked ? 'live' : 'sandbox' }))
                      }
                    />
                    <Label htmlFor="live">Production</Label>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="webhookUrl">URL Webhook</Label>
                <div className="flex gap-2">
                  <Input
                    id="webhookUrl"
                    value={config.webhookUrl}
                    onChange={(e) => setConfig(prev => ({ ...prev, webhookUrl: e.target.value }))}
                    placeholder="https://votre-site.com/api/moneroo/webhook"
                  />
                  <Button variant="outline" size="sm" onClick={generateWebhookUrl}>
                    Générer
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  URL pour recevoir les notifications de paiement
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Test de connexion */}
          <Card>
            <CardHeader>
              <CardTitle>Test de connexion</CardTitle>
              <CardDescription>
                Testez votre configuration avant de sauvegarder
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={handleTestConnection} 
                disabled={isTesting || !config.secretKey}
                className="w-full"
              >
                {isTesting ? "Test en cours..." : "Tester la connexion"}
              </Button>

              {testResult && (
                <Alert className={`mt-4 ${testResult.success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
                  {testResult.success ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-600" />
                  )}
                  <AlertDescription className={testResult.success ? 'text-green-800' : 'text-red-800'}>
                    {testResult.message}
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Informations importantes */}
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Important :</strong> Vos clés secrètes ne seront jamais affichées en clair et sont stockées de manière sécurisée.
              Utilisez l'environnement Sandbox pour tester avant de passer en production.
            </AlertDescription>
          </Alert>
        </div>

                       <DialogFooter>
                 <Button variant="outline" onClick={onClose}>
                   Annuler
                 </Button>
                 <Button onClick={handleSave} disabled={!config.secretKey}>
                   {config.isConnected ? 'Mettre à jour' : 'Connexion'}
                 </Button>
               </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 