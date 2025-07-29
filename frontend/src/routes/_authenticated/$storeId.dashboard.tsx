import { createFileRoute } from '@tanstack/react-router'
import Dashboard from '@/features/dashboard'
import { StoreLayout } from '@/components/layout/store-layout'

export const Route = createFileRoute('/_authenticated/$storeId/dashboard')({
  component: () => (
    <StoreLayout>
      <Dashboard />
    </StoreLayout>
  ),
}) 