import { createFileRoute } from '@tanstack/react-router'
import { StoreSelection } from "@/features/auth/store-selection"

export const Route = createFileRoute('/store-selection')({
  component: StoreSelection,
}) 