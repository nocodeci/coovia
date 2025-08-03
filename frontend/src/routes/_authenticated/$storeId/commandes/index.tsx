import { createFileRoute } from '@tanstack/react-router'
import Commandes from '@/features/commandes/commande/index'

export const Route = createFileRoute('/_authenticated/$storeId/commandes/')({
  component: CommandesIndexPage,
})

function CommandesIndexPage() {
  const { storeId } = Route.useParams()
  return <Commandes storeId={storeId} />
} 