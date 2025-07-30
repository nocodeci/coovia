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

interface Props {
  children?: React.ReactNode
}

export function AuthenticatedLayout({ children }: Props) {
  const defaultOpen = Cookies.get('sidebar_state') !== 'false'
  const location = useLocation()
  
  // Ne pas afficher la sidebar sur store-selection et create-store
  const isStandalonePage = location.pathname === '/store-selection' || location.pathname === '/create-store'
  
  return (
    <StoreProvider>
      <SearchProvider>
        <SidebarProvider defaultOpen={defaultOpen}>
          <SkipToMain />
          {!isStandalonePage && <AppSidebar />}
          <div
            id='content'
            className={cn(
              isStandalonePage ? 'w-full' : 'ml-auto w-full max-w-full',
              !isStandalonePage && 'peer-data-[state=collapsed]:w-[calc(100%-var(--sidebar-width-icon)-1rem)]',
              !isStandalonePage && 'peer-data-[state=expanded]:w-[calc(100%-var(--sidebar-width))]',
              !isStandalonePage && 'sm:transition-[width] sm:duration-200 sm:ease-linear',
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
