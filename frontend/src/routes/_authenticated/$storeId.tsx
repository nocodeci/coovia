import { createFileRoute, Outlet } from '@tanstack/react-router'
import { StoreGuard } from '@/components/layout/store-guard'

export const Route = createFileRoute('/_authenticated/$storeId')({
  component: StoreLayout,
})

function StoreLayout() {
  return (
    <StoreGuard>
      <div>
        <Outlet />
      </div>
    </StoreGuard>
  )
} 