import { createFileRoute } from '@tanstack/react-router'
import SettingsParameters from '@/features/settings/parameters'

export const Route = createFileRoute('/_authenticated/settings/')({
  component: SettingsParameters,
})
