import { createFileRoute } from '@tanstack/react-router'
import Apps from '@/features/apps'

export const Route = createFileRoute('/_authenticated/$storeId/apps')({
  component: AppsPage,
})

function AppsPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Applications</h2>
      </div>
      <Apps />
    </div>
  )
} 