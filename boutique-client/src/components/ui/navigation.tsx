import * as React from "react"
import { cn } from "../../lib/utils"

interface NavigationProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode
}

const Navigation = React.forwardRef<HTMLElement, NavigationProps>(
  ({ className, children, ...props }, ref) => (
    <nav
      ref={ref}
      className={cn(
        "flex items-center space-x-4 lg:space-x-6",
        className
      )}
      {...props}
    >
      {children}
    </nav>
  )
)
Navigation.displayName = "Navigation"

interface NavigationItemProps extends React.HTMLAttributes<HTMLAnchorElement> {
  href: string
  isActive?: boolean
  children: React.ReactNode
}

const NavigationItem = React.forwardRef<HTMLAnchorElement, NavigationItemProps>(
  ({ className, isActive, children, ...props }, ref) => (
    <a
      ref={ref}
      className={cn(
        "text-sm font-medium transition-colors hover:text-primary",
        isActive ? "text-primary" : "text-muted-foreground",
        className
      )}
      {...props}
    >
      {children}
    </a>
  )
)
NavigationItem.displayName = "NavigationItem"

export { Navigation, NavigationItem }

