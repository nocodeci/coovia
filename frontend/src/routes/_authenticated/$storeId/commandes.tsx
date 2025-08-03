import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/$storeId/commandes')({
  component: CommandesLayout,
})

function CommandesLayout() {
  return <Outlet />
} 