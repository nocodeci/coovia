import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/$storeId/produits')({
  component: ProduitsLayout,
})

function ProduitsLayout() {
  return (
    <div>
      <Outlet />
    </div>
  )
} 