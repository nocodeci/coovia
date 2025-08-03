import { createFileRoute } from '@tanstack/react-router'
import { NouvelleCommandePage } from '@/features/commandes/commande/pages/nouvelle-commande'

export const Route = createFileRoute('/_authenticated/$storeId/commandes/nouvelle')({
  component: NouvelleCommandePage,
}) 