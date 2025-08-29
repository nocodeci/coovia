import { createFileRoute } from '@tanstack/react-router'
import { StoreSelection } from "@/features/stores/store-selection"

export const Route = createFileRoute('/_authenticated/store-selection')({
  component: StoreSelection,
})
