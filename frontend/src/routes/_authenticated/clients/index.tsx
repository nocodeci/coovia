import { createFileRoute } from "@tanstack/react-router"
import ClientsPageComponent from "@/features/clients"

export const Route = createFileRoute("/_authenticated/clients/")({
  component: ClientsPageComponent,
})
