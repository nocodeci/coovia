import { createFileRoute } from '@tanstack/react-router'
import { useStore } from '@/context/store-context'
import { useEffect } from 'react'

export const Route = createFileRoute('/_authenticated/')({
  component: AuthenticatedLayout,
})

function AuthenticatedLayout() {
  const { currentStore, isLoading } = useStore()

  useEffect(() => {
    if (!isLoading && currentStore) {
      // Rediriger vers le dashboard de la boutique sélectionnée
      window.location.href = `/${currentStore.id}/dashboard`
    }
  }, [currentStore, isLoading])

  // Afficher un loader pendant la vérification ou la redirection
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-neutral-600">
          {isLoading ? "Vérification de la boutique..." : "Redirection vers le dashboard..."}
        </p>
      </div>
    </div>
  )
}
