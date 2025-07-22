import { createFileRoute } from "@tanstack/react-router"
import { StoresManagement } from "@/features/stores"

export const Route = createFileRoute("/_authenticated/stores/")({
  component: StoresManagement,
})
