import { createFileRoute } from '@tanstack/react-router'
import BoutiquePage from '@/features/boutique'
import { BoutiqueLayout } from '@/components/layout/boutique-layout'

export const Route = createFileRoute('/boutique/$storeId')({
  component: () => (
    <BoutiqueLayout>
      <BoutiquePage />
    </BoutiqueLayout>
  ),
}) 