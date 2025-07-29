import { createFileRoute, redirect } from "@tanstack/react-router"
import { AuthenticatedLayout } from "@/components/layout/authenticated-layout"

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: async ({ context, location }) => {
    // Vérifier si l'utilisateur est authentifié
    const token = localStorage.getItem("auth_token")
    if (!token) {
      throw redirect({
        to: "/sign-in",
        search: {
          redirect: location.href,
        },
      })
    }

    // Vérifier la validité du token en appelant l'API
    try {
      const response = await fetch("http://localhost:8000/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      })

      if (!response.ok) {
        // Token invalide, supprimer et rediriger
        localStorage.removeItem("auth_token")
        localStorage.removeItem("user")
        localStorage.removeItem("current_store")

        throw redirect({
          to: "/sign-in",
          search: {
            redirect: location.href,
          },
        })
      }
    } catch (error) {
      // Erreur de réseau ou token invalide
      localStorage.removeItem("auth_token")
      localStorage.removeItem("user")
      localStorage.removeItem("current_store")

      throw redirect({
        to: "/sign-in",
        search: {
          redirect: location.href,
        },
      })
    }
  },
  component: AuthenticatedLayout,
})
