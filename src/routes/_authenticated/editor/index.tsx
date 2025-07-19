import { createFileRoute } from "@tanstack/react-router"
import ClientsPageComponent from "@/features/editor"

export const Route = createFileRoute("/_authenticated/editor/")({
  component: ClientsPageComponent,
})
