import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { IconSettings } from '@tabler/icons-react'

interface ContentSectionProps {
  title: string
  desc: string
  children: React.ReactNode
  icon?: React.ComponentType<{ className?: string }>
  badge?: string
}

export default function ContentSection({
  title,
  desc,
  children,
  icon: Icon = IconSettings,
  badge,
}: ContentSectionProps) {
  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Icon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
              {badge && (
                <Badge variant="secondary" className="ml-2">
                  {badge}
                </Badge>
              )}
            </div>
          </div>
          <p className="text-muted-foreground max-w-2xl leading-relaxed">
            {desc}
          </p>
        </div>
      </div>

      <Separator className="my-6" />

      {/* Content Section */}
      <div className="space-y-6 pb-8">
        {children}
      </div>
    </div>
  )
}
