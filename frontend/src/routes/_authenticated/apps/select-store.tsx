import { createFileRoute } from "@tanstack/react-router"
import { StoreSelection } from "@/components/StoreSelection"

export const Route = createFileRoute("/_authenticated/apps/select-store")({
  component: StoreSelectionPage,
})

function StoreSelectionPage() {
  return <StoreSelection />
}
