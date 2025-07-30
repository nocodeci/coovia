import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/$storeId')({
  component: StoreLayout,
})

function StoreLayout() {
  return (
    <div>
      <Outlet />
    </div>
  )
} 