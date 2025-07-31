import Cookies from 'js-cookie'
import { Outlet, useParams, useLocation } from '@tanstack/react-router'
import { cn } from '@/lib/utils'
import { SearchProvider } from '@/context/search-context'
import { StoreProvider } from '@/context/store-context'
import { SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/layout/app-sidebar'
import { StoreGuard } from '@/components/layout/store-guard'
import SkipToMain from '@/components/skip-to-main'
import { TokenWarning } from '@/components/token-warning'
import { useStore } from '@/context/store-context'
import { useAuth } from '@/hooks/useAuth'

interface Props {
  children?: React.ReactNode
}

export function AuthenticatedLayout({ children }: Props) {
  const defaultOpen = Cookies.get('sidebar_state') !== 'false'
  const location = useLocation()
  const { isLoading: storesLoading, hasLoaded } = useStore()
  const { isLoading: authLoading, hasCheckedAuth } = useAuth()
  
  // Ne pas afficher la sidebar sur store-selection, create-store et pendant le chargement
  const isStandalonePage = location.pathname === '/store-selection' || location.pathname === '/create-store'
  const isLoading = authLoading || storesLoading || !hasCheckedAuth || !hasLoaded
  
  return (
    <StoreProvider>
      <SearchProvider>
        <SidebarProvider defaultOpen={defaultOpen}>
          <SkipToMain />
          {!isStandalonePage && !isLoading && <AppSidebar />}
          <div
            id='content'
            className={cn(
              isStandalonePage || isLoading ? 'w-full' : 'ml-auto w-full max-w-full',
              !isStandalonePage && !isLoading && 'peer-data-[state=collapsed]:w-[calc(100%-var(--sidebar-width-icon)-1rem)]',
              !isStandalonePage && !isLoading && 'peer-data-[state=expanded]:w-[calc(100%-var(--sidebar-width))]',
              !isStandalonePage && !isLoading && 'sm:transition-[width] sm:duration-200 sm:ease-linear',
              'flex h-svh flex-col',
              'group-data-[scroll-locked=1]/body:h-full',
              'has-[main.fixed-main]:group-data-[scroll-locked=1]/body:h-svh'
            )}
          >
            <TokenWarning />
            <StoreGuard>
              {children ? children : <Outlet />}
            </StoreGuard>
          </div>
        </SidebarProvider>
      </SearchProvider>
    </StoreProvider>
  )
}
