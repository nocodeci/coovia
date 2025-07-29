import { createFileRoute, redirect } from "@tanstack/react-router"
import { useStore } from "@/context/store-context"
import { StoreSelection } from "@/components/StoreSelection"
import Dashboard from "@/features/dashboard"

export const Route = createFileRoute("/_authenticated/")({
  beforeLoad: ({ context }) => {
    // Vérifier si l'utilisateur est authentifié
    const token = localStorage.getItem("auth_token")
    if (!token) {
      throw redirect({
        to: "/sign-in",
      })
    }
  },
  component: DashboardPage,
})

function DashboardPage() {
  const { currentStore } = useStore()

  // Si aucune boutique n'est sélectionnée, afficher la page de sélection SANS sidebar
  if (!currentStore) {
    return <StoreSelection />
  }

  // Sinon, afficher le dashboard de la boutique sélectionnée AVEC sidebar
  return <Dashboard />
}
