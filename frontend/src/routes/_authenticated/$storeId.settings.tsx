import { createFileRoute } from '@tanstack/react-router'
import Settings from '@/features/settings'

export const Route = createFileRoute('/_authenticated/$storeId/settings')({
  component: SettingsPage,
})

function SettingsPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Paramètres</h2>
      </div>
      <Settings />
    </div>
  )
} 