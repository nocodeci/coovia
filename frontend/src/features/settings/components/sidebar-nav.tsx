import { useState, type JSX } from 'react'
import { useLocation, useNavigate } from '@tanstack/react-router'
import { Link } from '@tanstack/react-router'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    href: string
    title: string
    icon: JSX.Element
  }[]
}

export default function SidebarNav({
  className,
  items,
  ...props
}: SidebarNavProps) {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const [val, setVal] = useState(pathname ?? '/settings')

  const handleSelect = (e: string) => {
    setVal(e)
    navigate({ to: e })
  }

  return (
    <>
      <div className='p-1 md:hidden'>
        <Select value={val} onValueChange={handleSelect}>
          <SelectTrigger className='h-12 sm:w-48'>
            <SelectValue placeholder='Theme' />
          </SelectTrigger>
          <SelectContent>
            {items.map((item) => (
              <SelectItem key={item.href} value={item.href}>
                <div className='flex gap-x-4 px-2 py-1'>
                  <span className='scale-125'>{item.icon}</span>
                  <span className='text-md'>{item.title}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className='bg-background w-full min-w-40 px-2 py-2 block rounded-lg border border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-background to-muted/20 backdrop-blur-sm relative z-10'>
        <nav
          className={cn(
            'flex flex-col space-y-1',
            className
          )}
          {...props}
        >
          {items.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                'inline-flex items-center gap-2 whitespace-nowrap rounded-md text-xs font-medium transition-all duration-200',
                'disabled:pointer-events-none disabled:opacity-50 outline-none',
                'focus-visible:ring-1 focus-visible:ring-primary/50 focus-visible:ring-offset-1',
                'h-8 px-3 py-1 justify-start',
                pathname === item.href
                  ? 'bg-primary text-primary-foreground shadow-sm hover:bg-primary/90'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50 hover:shadow-sm'
              )}
            >
              <span className='flex h-3 w-3 items-center justify-center'>{item.icon}</span>
              {item.title}
            </Link>
          ))}
        </nav>
      </div>
    </>
  )
}
