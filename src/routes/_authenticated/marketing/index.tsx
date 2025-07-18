import { createFileRoute } from "@tanstack/react-router"
import { PromoCodesPage } from "@/features/marketing"

export const Route = createFileRoute("/_authenticated/marketing/")({
  component: PromoCodesPage,
})
