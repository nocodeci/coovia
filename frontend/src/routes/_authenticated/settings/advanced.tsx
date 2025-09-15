import { createFileRoute } from '@tanstack/react-router'
import AdvancedSettings from '@/features/settings/advanced'

export const Route = createFileRoute('/_authenticated/settings/advanced')({
  component: AdvancedSettings,
})