import * as React from 'react'
import { Link, useLocation, useNavigate } from '@tanstack/react-router'
import { 
  ChevronRight, 
  Store, 
  Plus, 
  Settings, 
  Search,
  Bell,
  HelpCircle,
  Moon,
  Sun,
  Maximize2,
  Minimize2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
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
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarGroup,
  SidebarGroupLabel,
  useSidebar,
} from '@/components/ui/sidebar'
import { useStore } from '@/context/store-context'
import { getSidebarData } from './data/sidebar-data'
import { NavCollapsible, NavItem, NavLink, type NavGroup } from './types'

// Composant de recherche amélioré
function SidebarSearch() {
  const [searchTerm, setSearchTerm] = React.useState('')
  
  return (
    <div className="px-3 py-2">
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Rechercher..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-8 h-8 text-sm bg-background/50 border-border/50"
        />
      </div>
    </div>
  )
}

// Composant de notification avec badge
function NotificationButton() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="relative h-8 w-8 rounded-md"
          >
            <Bell className="h-4 w-4" />
            <Badge 
              className="absolute -top-1 -right-1 h-4 w-4 rounded-full p-0 text-xs"
              variant="destructive"
            >
              3
            </Badge>
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right">
          <p>Notifications</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

// Composant de thème avec toggle
function ThemeToggle() {
  const [isDark, setIsDark] = React.useState(false)
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-md"
            onClick={() => setIsDark(!isDark)}
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right">
          <p>{isDark ? 'Mode clair' : 'Mode sombre'}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

// Composant d'aide
function HelpButton() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-md"
          >
            <HelpCircle className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right">
          <p>Aide</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

// Team Switcher amélioré
function EnhancedTeamSwitcher({ teams }: { teams: any[] }) {
  const { isMobile } = useSidebar()
  const navigate = useNavigate()
  const { stores, currentStore, isLoading } = useStore()
  const [activeStore, setActiveStore] = React.useState(currentStore || stores[0])

  React.useEffect(() => {
    if (currentStore) {
      setActiveStore(currentStore)
    } else if (stores.length > 0 && !activeStore) {
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
      <div className="px-3 py-2">
        <div className="flex items-center justify-center mb-4">
          <img 
            src="/assets/images/logo.svg" 
            alt="coovia" 
            width="120" 
            height="32" 
            className="h-8 w-auto"
          />
        </div>
        <Button 
          variant="outline" 
          className="w-full justify-start gap-2 h-12"
          onClick={handleBackToStoreSelection}
        >
          <div className="bg-primary text-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
            <Store className="size-4" />
          </div>
          <div className="flex-1 text-left">
            <div className="text-sm font-semibold">
              {isLoading ? 'Préparation...' : 'Sélectionner une boutique'}
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
    <div className="px-3 py-2">
      <div className="flex items-center justify-center mb-4">
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
          <Button
            variant="outline"
            className="w-full justify-start gap-2 h-12 data-[state=open]:bg-accent"
          >
            <div className="bg-primary text-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg overflow-hidden">
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
                <Store className="size-4" />
              </div>
            </div>
            <div className="flex-1 text-left">
              <div className="text-sm font-semibold truncate">
                {activeStore.name}
              </div>
              <div className="text-xs text-muted-foreground">
                Actif
              </div>
            </div>
            <ChevronRight className="ml-auto h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
          align="start"
          side={isMobile ? 'bottom' : 'right'}
          sideOffset={4}
        >
          <DropdownMenuLabel className="text-muted-foreground text-xs">
            Vos boutiques
          </DropdownMenuLabel>
          {stores.map((store) => (
            <DropdownMenuItem
              key={store.id}
              onClick={() => handleStoreSelect(store)}
              className="gap-2 p-2"
            >
              <div className="flex size-6 items-center justify-center rounded-sm border overflow-hidden">
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
                  <Store className="size-3 shrink-0" />
                </div>
              </div>
              <span className="truncate">{store.name}</span>
              {store.id === activeStore.id && (
                <DropdownMenuShortcut>✓</DropdownMenuShortcut>
              )}
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem className="gap-2 p-2" onClick={handleBackToStoreSelection}>
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

// NavGroup amélioré avec animations et meilleure UX
function EnhancedNavGroup({ title, items }: NavGroup) {
  const { state, isMobile } = useSidebar()
  const href = useLocation({ select: (location) => location.href })
  
  return (
    <SidebarGroup>
      <SidebarGroupLabel className="text-xs font-medium text-muted-foreground">
        {title}
      </SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const key = `${item.title}-${'url' in item ? item.url : 'collapsible'}`

          if (!('items' in item) || !item.items)
            return <EnhancedSidebarMenuLink key={key} item={item as NavLink} href={href} isTopLevelLink={true} />

          if (state === 'collapsed' && !isMobile)
            return (
              <EnhancedSidebarMenuCollapsedDropdown key={key} item={item as NavCollapsible} href={href} />
            )

          return <EnhancedSidebarMenuCollapsible key={key} item={item as NavCollapsible} href={href} />
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}

// Badge amélioré
const EnhancedNavBadge = ({ children }: { children: React.ReactNode }) => (
  <Badge className="rounded-full px-1.5 py-0.5 text-xs font-medium bg-primary text-primary-foreground">
    {children}
  </Badge>
)

// Link amélioré avec meilleure UX
const EnhancedSidebarMenuLink = ({ 
  item, 
  href, 
  isTopLevelLink = false 
}: { 
  item: NavLink; 
  href: string; 
  isTopLevelLink?: boolean 
}) => {
  const { setOpenMobile } = useSidebar()
  const navigate = useNavigate()
  const isActive = checkIsActive(href, item, isTopLevelLink)
  
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    setOpenMobile(false)
    navigate({ to: item.url })
  }
  
  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        isActive={isActive}
        tooltip={item.title}
        className="group relative overflow-hidden"
      >
        <a href={item.url} onClick={handleClick}>
          {item.icon && (
            <div className="relative">
              <item.icon className="transition-transform group-hover:scale-110" />
              {isActive && (
                <div className="absolute inset-0 bg-primary/20 rounded-md" />
              )}
            </div>
          )}
          <span className="transition-colors">{item.title}</span>
          {item.badge && <EnhancedNavBadge>{item.badge}</EnhancedNavBadge>}
        </a>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}

// Collapsible amélioré avec animations
const EnhancedSidebarMenuCollapsible = ({
  item,
  href,
}: {
  item: NavCollapsible
  href: string
}) => {
  const { setOpenMobile } = useSidebar()
  const navigate = useNavigate()
  const isActive = checkIsActive(href, item, true)
  
  return (
    <Collapsible
      asChild
      defaultOpen={isActive}
      className="group/collapsible"
    >
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton 
            tooltip={item.title}
            isActive={isActive}
            className="group relative overflow-hidden"
          >
            {item.icon && (
              <div className="relative">
                <item.icon className="transition-transform group-hover:scale-110" />
                {isActive && (
                  <div className="absolute inset-0 bg-primary/20 rounded-md" />
                )}
              </div>
            )}
            <span className="transition-colors">{item.title}</span>
            {item.badge && <EnhancedNavBadge>{item.badge}</EnhancedNavBadge>}
            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent className="CollapsibleContent">
          <SidebarMenuSub>
            {item.items.map((subItem) => {
              const handleSubItemClick = (e: React.MouseEvent) => {
                e.preventDefault()
                setOpenMobile(false)
                navigate({ to: subItem.url })
              }
              
              return (
                <SidebarMenuSubItem key={subItem.title}>
                  <SidebarMenuSubButton
                    asChild
                    isActive={checkIsActive(href, subItem)}
                    className="group relative overflow-hidden"
                  >
                    <a href={subItem.url} onClick={handleSubItemClick}>
                      {subItem.icon && (
                        <div className="relative">
                          <subItem.icon className="transition-transform group-hover:scale-110" />
                        </div>
                      )}
                      <span className="transition-colors">{subItem.title}</span>
                      {subItem.badge && <EnhancedNavBadge>{subItem.badge}</EnhancedNavBadge>}
                    </a>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              )
            })}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  )
}

// Dropdown amélioré pour le mode collapsed
const EnhancedSidebarMenuCollapsedDropdown = ({
  item,
  href,
}: {
  item: NavCollapsible
  href: string
}) => {
  const navigate = useNavigate()
  
  return (
    <SidebarMenuItem>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarMenuButton
            tooltip={item.title}
            isActive={checkIsActive(href, item, true)}
            className="group relative overflow-hidden"
          >
            {item.icon && (
              <div className="relative">
                <item.icon className="transition-transform group-hover:scale-110" />
              </div>
            )}
            <span className="transition-colors">{item.title}</span>
            {item.badge && <EnhancedNavBadge>{item.badge}</EnhancedNavBadge>}
            <ChevronRight className="ml-auto transition-transform duration-200" />
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          side="right" 
          align="start" 
          sideOffset={4}
          className="w-56"
        >
          <DropdownMenuLabel className="flex items-center gap-2">
            {item.icon && <item.icon className="h-4 w-4" />}
            {item.title} {item.badge ? `(${item.badge})` : ''}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {item.items.map((sub) => {
            const handleSubClick = (e: React.MouseEvent) => {
              e.preventDefault()
              navigate({ to: sub.url })
            }
            
            return (
              <DropdownMenuItem key={`${sub.title}-${sub.url}`} asChild>
                <a
                  href={sub.url}
                  onClick={handleSubClick}
                  className={`flex items-center gap-2 ${checkIsActive(href, sub) ? 'bg-accent' : ''}`}
                >
                  {sub.icon && <sub.icon className="h-4 w-4" />}
                  <span className="max-w-52 text-wrap">{sub.title}</span>
                  {sub.badge && (
                    <span className="ml-auto text-xs">{sub.badge}</span>
                  )}
                </a>
              </DropdownMenuItem>
            )
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  )
}

// Footer amélioré avec actions rapides
function EnhancedSidebarFooter({ user }: { user: any }) {
  const { state } = useSidebar()
  
  return (
    <div className="px-3 py-2 space-y-2">
      <Separator />
      
      {/* Actions rapides */}
      <div className="flex items-center justify-between">
        <NotificationButton />
        <ThemeToggle />
        <HelpButton />
      </div>
      
      {/* Profil utilisateur */}
      <div className="flex items-center gap-2 p-2 rounded-md bg-accent/50">
        <div className="flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
          {user?.name?.charAt(0) || 'U'}
        </div>
        {state === 'expanded' && (
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium truncate">{user?.name || 'Utilisateur'}</div>
            <div className="text-xs text-muted-foreground truncate">{user?.email || 'user@example.com'}</div>
          </div>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <Settings className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="right" align="end">
            <DropdownMenuLabel>Paramètres</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profil</DropdownMenuItem>
            <DropdownMenuItem>Préférences</DropdownMenuItem>
            <DropdownMenuItem>Déconnexion</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

// Fonction utilitaire pour vérifier l'état actif
function checkIsActive(href: string, item: NavItem, mainNav = false) {
  const currentPath = href.split('?')[0] 
  const itemPath = 'url' in item ? item.url ?? '' : ''

  if (itemPath === '/') {
    return currentPath === '/'; 
  }

  if (currentPath === itemPath) return true

  if ('items' in item && item.items?.some((i) => currentPath === i.url)) return true

  if (mainNav && currentPath.startsWith(itemPath)) return true

  return false
}

// Composant principal du sidebar amélioré
export function EnhancedAppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { currentStore, isLoading } = useStore()
  const sidebarData = getSidebarData(currentStore?.id)

  return (
    <Sidebar collapsible={false} variant="floating" {...props}>
      <SidebarHeader>
        {isLoading ? (
          <div className="px-3 py-2">
            <div className="h-8 w-32 bg-muted animate-pulse rounded" />
          </div>
        ) : (
          <EnhancedTeamSwitcher teams={sidebarData.teams} />
        )}
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarSearch />
        <Separator />
        {sidebarData.navGroups.map((navGroup) => (
          <EnhancedNavGroup key={navGroup.title} {...navGroup} />
        ))}
      </SidebarContent>
      
      <SidebarFooter>
        <EnhancedSidebarFooter user={sidebarData.user} />
      </SidebarFooter>
    </Sidebar>
  )
} 
