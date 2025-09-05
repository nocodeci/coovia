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
          <div className='flex flex-1 min-h-0'>
            <aside className='w-64 flex-shrink-0 pr-6'>
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
    title: 'Paramètres',
    icon: <IconSettings size={18} />,
    href: '/settings',
  },
  {
    title: 'Profil',
    icon: <IconUser size={18} />,
    href: '/settings/profile',
  },
  {
    title: 'Compte',
    icon: <IconTool size={18} />,
    href: '/settings/account',
  },
  {
    title: 'Apparence',
    icon: <IconPalette size={18} />,
    href: '/settings/appearance',
  },
  {
    title: 'Notifications',
    icon: <IconNotification size={18} />,
    href: '/settings/notifications',
  },
  {
    title: 'Affichage',
    icon: <IconBrowserCheck size={18} />,
    href: '/settings/display',
  },
]
