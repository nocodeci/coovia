import { createFileRoute } from '@tanstack/react-router'
import { StoreSelectionMigrated } from "@/features/stores/store-selection-migrated"

export const Route = createFileRoute('/_authenticated/store-selection')({
  component: StoreSelectionMigrated,
})
