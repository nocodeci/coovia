import * as React from 'react'
import { ChevronsUpDown, Store, Plus } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'
import { useStore } from '@/context/store-context'

export function TeamSwitcher({
  teams,
}: {
  teams: {
    name: string
    logo: React.ElementType
    plan: string
  }[]
}) {
  const { isMobile } = useSidebar()
  const navigate = useNavigate()
  const { stores, currentStore, isLoading } = useStore()
  const [activeStore, setActiveStore] = React.useState(currentStore || stores[0])

  // Mettre à jour la boutique active quand currentStore change
  React.useEffect(() => {
    if (currentStore) {
      setActiveStore(currentStore)
    } else if (stores.length > 0 && !activeStore) {
      // Si pas de boutique active mais des boutiques disponibles
      setActiveStore(stores[0])
    }
  }, [currentStore, stores, activeStore])

  const handleStoreSelect = (store: any) => {
    setActiveStore(store)
    navigate({ to: `/${store.id}/dashboard` })
  }

  const handleBackToStoreSelection = () => {
    navigate({ to: '/store-selection' })
  }

  if (!activeStore) {
    return (
      <div className="team-switcher-container">
        <div className="flex items-center justify-center mb-4">
          <img 
            src="/assets/images/logo.svg" 
            alt="coovia" 
            width="120" 
            height="32" 
            className="h-8 w-auto team-switcher-logo"
          />
        </div>
        <Button 
          variant="outline" 
          className="team-switcher-button w-full justify-start gap-2 h-12"
          onClick={handleBackToStoreSelection}
        >
          <div className="team-switcher-avatar flex aspect-square size-8 items-center justify-center rounded-lg">
            <Store className="size-4" />
          </div>
          <div className="flex-1 text-left">
            <div className="text-sm font-semibold">
              {isLoading ? 'Chargement...' : 'Sélectionner une boutique'}
            </div>
            <div className="text-xs text-muted-foreground">
              {isLoading ? 'Vérification des boutiques' : 'Cliquez pour choisir'}
            </div>
          </div>
        </Button>
      </div>
    )
  }

  return (
    <div className="team-switcher-container">
      <div className="flex items-center justify-center mb-4">
        <img 
          src="/assets/images/logo.svg" 
          alt="coovia" 
          width="120" 
          height="32" 
          className="h-8 w-auto team-switcher-logo"
        />
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="team-switcher-button w-full justify-start gap-2 h-12 group"
          >
            <div className="team-switcher-avatar flex aspect-square size-8 items-center justify-center rounded-lg overflow-hidden">
              {activeStore.logo ? (
                <img 
                  src={activeStore.logo} 
                  alt={activeStore.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const fallback = target.parentElement?.querySelector('.store-fallback');
                    if (fallback) {
                      (fallback as HTMLElement).style.display = 'flex';
                    }
                  }}
                />
              ) : null}
              <div className="store-fallback flex items-center justify-center w-full h-full" style={{ display: activeStore.logo ? 'none' : 'flex' }}>
                <div className="w-full h-full bg-gradient-to-br from-primary/50 to-primary/30 rounded-lg flex items-center justify-center">
                  <Store className="size-4 text-primary" />
                </div>
              </div>
            </div>
            <div className="flex-1 text-left">
              <div className="text-sm font-semibold truncate">
                {activeStore.name}
              </div>
              <div className="text-xs text-muted-foreground team-switcher-active-indicator">
                Actif
              </div>
            </div>
            <ChevronsUpDown className="team-switcher-chevron ml-auto h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
          <DropdownMenuContent
            className="team-switcher-dropdown w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            side={isMobile ? 'bottom' : 'right'}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-muted-foreground text-xs font-semibold">
              Vos boutiques
            </DropdownMenuLabel>
            {stores.map((store) => (
              <DropdownMenuItem
                key={store.id}
                onClick={() => handleStoreSelect(store)}
                className={`team-switcher-item gap-2 p-2 ${store.id === activeStore.id ? 'data-[active=true]' : ''}`}
                title={store.logo ? `Logo: ${store.logo}` : 'Aucun logo'}
              >
                <div className="team-switcher-avatar flex size-6 items-center justify-center rounded-sm border overflow-hidden">
                  {store.logo ? (
                    <img 
                      src={store.logo} 
                      alt={store.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const fallback = target.parentElement?.querySelector('.store-item-fallback');
                        if (fallback) {
                          (fallback as HTMLElement).style.display = 'flex';
                        }
                      }}
                    />
                  ) : null}
                  <div className="store-item-fallback flex items-center justify-center w-full h-full" style={{ display: store.logo ? 'none' : 'flex' }}>
                    <div className="w-full h-full bg-gradient-to-br from-primary/40 to-primary/20 rounded-sm flex items-center justify-center">
                      <Store className="size-3 shrink-0 text-primary" />
                    </div>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <span className="truncate font-medium block">{store.name}</span>
                  {store.logo && (
                    <span className="text-xs text-muted-foreground truncate block">
                      Logo disponible
                    </span>
                  )}
                </div>
                {store.id === activeStore.id && (
                  <DropdownMenuShortcut className="team-switcher-active-indicator">✓</DropdownMenuShortcut>
                )}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="team-switcher-item gap-2 p-2" onClick={handleBackToStoreSelection}>
              <div className="bg-background flex size-6 items-center justify-center rounded-md border">
                <Plus className="size-4" />
              </div>
              <div className="text-muted-foreground font-medium">Changer de boutique</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    )
  }
