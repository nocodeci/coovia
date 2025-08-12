import * as React from 'react'
import { ChevronsUpDown, Store, Plus } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'
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
      <SidebarMenu>
        <SidebarMenuItem>
          <div className="flex items-center mb-6">
            <img 
              src="/assets/images/logo.svg" 
              alt="coovia" 
              width="120" 
              height="32" 
              className="h-8 w-auto"
            />
          </div>
          <SidebarMenuButton size='lg' onClick={handleBackToStoreSelection}>
            <div className='bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg'>
              <Store className='size-4' />
            </div>
            <div className='grid flex-1 text-left text-sm leading-tight'>
              <span className='truncate font-semibold'>
                {isLoading ? 'Chargement...' : 'Sélectionner une boutique'}
              </span>
              <span className='truncate text-xs'>
                {isLoading ? 'Vérification des boutiques' : 'Cliquez pour choisir'}
              </span>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    )
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
                  <div className="flex items-center mb-6">
            <img 
              src="/assets/images/logo.svg" 
              alt="coovia" 
              width="120" 
              height="32" 
              className="h-8 w-auto"
            />
          </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size='lg'
              className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
            >
              <div className='bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg overflow-hidden'>
                {activeStore.logo ? (
                  <img 
                    src={activeStore.logo} 
                    alt={activeStore.name}
                    className='w-full h-full object-cover'
                    onError={(e) => {
                      // Fallback vers l'icône Store si l'image ne charge pas
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const fallback = target.parentElement?.querySelector('.store-fallback');
                      if (fallback) {
                        (fallback as HTMLElement).style.display = 'flex';
                      }
                    }}
                  />
                ) : null}
                <div className='store-fallback flex items-center justify-center w-full h-full' style={{ display: activeStore.logo ? 'none' : 'flex' }}>
                  <Store className='size-4' />
                </div>
              </div>
              <div className='grid flex-1 text-left text-sm leading-tight'>
                <span className='truncate font-semibold'>
                  {activeStore.name}
                </span>
                <span className='truncate text-xs'>Actif</span>
              </div>
              <ChevronsUpDown className='ml-auto' />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className='w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg'
            align='start'
            side={isMobile ? 'bottom' : 'right'}
            sideOffset={4}
          >
            <DropdownMenuLabel className='text-muted-foreground text-xs'>
              Vos boutiques
            </DropdownMenuLabel>
            {stores.map((store) => (
              <DropdownMenuItem
                key={store.id}
                onClick={() => handleStoreSelect(store)}
                className='gap-2 p-2'
              >
                <div className='flex size-6 items-center justify-center rounded-sm border overflow-hidden'>
                  {store.logo ? (
                    <img 
                      src={store.logo} 
                      alt={store.name}
                      className='w-full h-full object-cover'
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
                  <div className='store-item-fallback flex items-center justify-center w-full h-full' style={{ display: store.logo ? 'none' : 'flex' }}>
                    <Store className='size-3 shrink-0' />
                  </div>
                </div>
                <span className='truncate'>{store.name}</span>
                {store.id === activeStore.id && (
                  <DropdownMenuShortcut>✓</DropdownMenuShortcut>
                )}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className='gap-2 p-2' onClick={handleBackToStoreSelection}>
              <div className='bg-background flex size-6 items-center justify-center rounded-md border'>
                <Plus className='size-4' />
              </div>
              <div className='text-muted-foreground font-medium'>Changer de boutique</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
