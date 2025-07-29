import { createFileRoute } from '@tanstack/react-router'
import Tasks from '@/features/tasks'

export const Route = createFileRoute('/_authenticated/$storeId/tasks')({
  component: TasksPage,
})

function TasksPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Tâches</h2>
      </div>
      <Tasks />
    </div>
  )
} 