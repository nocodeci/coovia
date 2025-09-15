import { Outlet } from '@tanstack/react-router'
import {
  IconBrowserCheck,
  IconNotification,
  IconPalette,
  IconTool,
  IconUser,
  IconSettings,
} from '@tabler/icons-react'
import { Separator } from '@/components/ui/separator'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import SidebarNav from './components/sidebar-nav'

export default function Settings() {
  return (
    <>
      <Main fixed>
        <div className='flex h-full flex-col'>
          {/* Header Section */}
          <div className='flex-shrink-0 space-y-0.5'>
            <h1 className='text-2xl font-bold tracking-tight md:text-3xl'>
              Paramètres
            </h1>
            <p className='text-muted-foreground'>
              Gérez vos paramètres de compte, préférences et configuration de l'application.
            </p>
          </div>
          
          <Separator className='my-4 lg:my-6' />
          
          {/* Content Section */}
          <div className='flex flex-1 min-h-0 overflow-visible'>
            <aside className='w-64 flex-shrink-0 pr-6 sticky top-4 self-start overflow-visible'>
              <SidebarNav items={sidebarNavItems} />
            </aside>
            
            <div className='flex-1 min-w-0'>
              <div className='h-full overflow-y-auto pr-6'>
                <Outlet />
              </div>
            </div>
          </div>
        </div>
      </Main>
    </>
  )
}

const sidebarNavItems = [
  {
    title: 'Paramètres de la boutique',
    icon: <IconSettings size={18} />,
    href: '/settings/store',
  },
  {
    title: 'Paramètres du compte',
    icon: <IconUser size={18} />,
    href: '/settings/account',
  },
  {
    title: 'Paramètres avancés',
    icon: <IconTool size={18} />,
    href: '/settings/advanced',
  },
]
