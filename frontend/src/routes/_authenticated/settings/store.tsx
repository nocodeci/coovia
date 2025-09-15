import { createFileRoute } from '@tanstack/react-router'
import StoreSettings from '@/features/settings/store'

export const Route = createFileRoute('/_authenticated/settings/store')({
  component: StoreSettings,
})