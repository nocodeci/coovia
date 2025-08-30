import { useEffect } from 'react'
import { IconCheck, IconSun } from '@tabler/icons-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function ThemeSwitch() {
  // Thème désactivé - toujours clair
  const theme = 'light'

  /* Update theme-color meta tag
   * when theme is updated */
  useEffect(() => {
    const themeColor = '#fff' // Toujours blanc
    const metaThemeColor = document.querySelector("meta[name='theme-color']")
    if (metaThemeColor) metaThemeColor.setAttribute('content', themeColor)
  }, [])

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' size='icon' className='scale-95 rounded-full' disabled>
          <IconSun className='size-[1.2rem] scale-100 rotate-0 transition-all' />
          <span className='sr-only'>Thème désactivé</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuItem disabled>
          <IconCheck size={14} className='ml-auto' />
          Thème clair (forcé)
        </DropdownMenuItem>
        <DropdownMenuItem disabled className='text-muted-foreground'>
          Mode sombre désactivé
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
