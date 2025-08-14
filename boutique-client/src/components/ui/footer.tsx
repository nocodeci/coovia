import * as React from "react"
import { cn } from "../../lib/utils"

interface FooterProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode
}

const Footer = React.forwardRef<HTMLElement, FooterProps>(
  ({ className, children, ...props }, ref) => (
    <footer
      ref={ref}
      className={cn(
        "border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        className
      )}
      {...props}
    >
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
          <span>© 2024 Wozif Store. Tous droits réservés.</span>
        </div>
        <div className="flex items-center space-x-4">
          {children}
        </div>
      </div>
    </footer>
  )
)
Footer.displayName = "Footer"

export { Footer }

