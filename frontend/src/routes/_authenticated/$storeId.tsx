import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/$storeId')({
  component: StoreLayout,
})

function StoreLayout() {
  // Le StoreGuard s'occupe de la vérification, on peut juste afficher le contenu
  return (
    <div>
      <Outlet />
    </div>
  )
} 