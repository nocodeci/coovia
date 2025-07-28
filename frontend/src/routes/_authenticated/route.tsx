import { createFileRoute, redirect } from "@tanstack/react-router"
import { AuthenticatedLayout } from "@/components/layout/authenticated-layout"

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: ({ context }) => {
    // Vérifier si l'utilisateur est authentifié
    const token = localStorage.getItem("auth_token")
    if (!token) {
      throw redirect({
        to: "/sign-in",
      })
    }
  },
  component: AuthenticatedLayout,
})
