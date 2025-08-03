"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { 
  Plug, 
  Settings, 
  ExternalLink,
  CheckCircle,
  XCircle,
  Wifi
} from "lucide-react"
import { MonerooIntegration } from "./moneroo-integration"
import { monerooConfigService, MonerooConfig } from "@/services/monerooConfigService"

interface AppCardProps {
  app: {
    name: string
    logo: React.ReactNode
    connected: boolean
    desc: string
  }
  onConnect: (appName: string) => void
  onDisconnect: (appName: string) => void
}

export function AppCard({ app, onConnect, onDisconnect }: AppCardProps) {
  const [showMonerooConfig, setShowMonerooConfig] = useState(false)
  const [isLoadingConfig, setIsLoadingConfig] = useState(false)
  const [monerooConfig, setMonerooConfig] = useState<MonerooConfig>({
    secretKey: '',
    environment: 'sandbox',
    webhookUrl: '',
    isConnected: false
  })

  // Charger la configuration existante au montage du composant
  React.useEffect(() => {
    if (app.name === 'Moneroo') {
      loadMonerooConfig()
    }
  }, [app.name])

  // Recharger la configuration quand le modal se ferme
  React.useEffect(() => {
    if (app.name === 'Moneroo' && !showMonerooConfig) {
      loadMonerooConfig()
    }
  }, [showMonerooConfig, app.name])

  const loadMonerooConfig = async () => {
    try {
      setIsLoadingConfig(true)
      const result = await monerooConfigService.getConfig()
      if (result.success && result.data) {
        setMonerooConfig(result.data)
      }
    } catch (error) {
      console.error('Erreur lors du chargement de la configuration Moneroo:', error)
    } finally {
      setIsLoadingConfig(false)
    }
  }

  const handleConnect = () => {
    if (app.name === 'Moneroo') {
      setShowMonerooConfig(true)
    } else {
      onConnect(app.name)
    }
  }

  const handleDisconnect = () => {
    onDisconnect(app.name)
  }

  const handleMonerooConnect = (config: any) => {
    setMonerooConfig(config)
    onConnect(app.name)
  }

    return (
    <>
      <div data-slot="card" className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm hover:shadow-md transition-shadow">
        <div data-slot="card-header" className="@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6 pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-muted">
                {app.logo}
              </div>
              <div>
                <div data-slot="card-title" className="font-semibold text-lg">{app.name}</div>
                <div data-slot="card-description" className="text-muted-foreground text-sm">
                  {app.desc}
                </div>
              </div>
            </div>
            <span data-slot="badge" className="inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90">
              {app.name === 'Moneroo' ? (
                isLoadingConfig ? (
                  <div className="flex items-center gap-1">
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                    Chargement...
                  </div>
                ) : monerooConfig.isConnected ? (
                  <div className="flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" />
                    Connecté
                  </div>
                ) : (
                  <div className="flex items-center gap-1">
                    <XCircle className="h-3 w-3" />
                    Non connecté
                  </div>
                )
              ) : (
                app.connected ? (
                  <div className="flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" />
                    Connecté
                  </div>
                ) : (
                  <div className="flex items-center gap-1">
                    <XCircle className="h-3 w-3" />
                    Non connecté
                  </div>
                )
              )}
            </span>
          </div>
        </div>
        
        <div data-slot="card-content" className="px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              {app.name === 'Moneroo' ? (
                isLoadingConfig ? (
                  <>
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-gray-500"></div>
                    Chargement...
                  </>
                ) : monerooConfig.isConnected ? (
                  <Wifi className="h-4 w-4 text-green-500" />
                ) : (
                  <Plug className="h-4 w-4" />
                )
              ) : (
                app.connected ? (
                  <Wifi className="h-4 w-4 text-green-500" />
                ) : (
                  <Plug className="h-4 w-4" />
                )
              )}
              {app.name === 'Moneroo' ? (
                isLoadingConfig ? "Chargement..." : (
                  monerooConfig.isConnected ? "Intégration active" : "Intégration disponible"
                )
              ) : (
                app.connected ? "Intégration active" : "Intégration disponible"
              )}
            </div>
            
            <div className="flex gap-2">
              {app.name === 'Moneroo' ? (
                isLoadingConfig ? (
                  <Button size="sm" disabled>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-1"></div>
                    Chargement...
                  </Button>
                ) : monerooConfig.isConnected ? (
                  <>
                    <button data-slot="button" className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5" onClick={handleConnect}>
                      <Settings className="h-4 w-4 mr-1" />
                      Configurer
                    </button>
                    <button data-slot="button" className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5" onClick={handleDisconnect}>
                      Déconnecter
                    </button>
                  </>
                ) : (
                  <Button size="sm" onClick={handleConnect}>
                    <Plug className="h-4 w-4 mr-1" />
                    Connecter
                  </Button>
                )
              ) : (
                app.connected ? (
                  <>
                    <button data-slot="button" className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5" onClick={handleConnect}>
                      <Settings className="h-4 w-4 mr-1" />
                      Configurer
                    </button>
                    <button data-slot="button" className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5" onClick={handleDisconnect}>
                      Déconnecter
                    </button>
                  </>
                ) : (
                  <Button size="sm" onClick={handleConnect}>
                    <Plug className="h-4 w-4 mr-1" />
                    Connecter
                  </Button>
                )
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal de configuration Moneroo */}
      {app.name === 'Moneroo' && (
        <MonerooIntegration
          isOpen={showMonerooConfig}
          onClose={() => setShowMonerooConfig(false)}
          onConnect={handleMonerooConnect}
          currentConfig={monerooConfig}
        />
      )}
    </>
  )
} 