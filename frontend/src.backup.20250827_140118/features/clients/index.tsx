import { createFileRoute } from "@tanstack/react-router"
import ClientsPageComponent from "./ClientPage" // ou "./ClientPage" selon ton arborescence

export const Route = createFileRoute("/_authenticated/clients/")({
  component: ClientsPage,
})

export default function ClientsPage() {
  return <ClientsPageComponent />
}
