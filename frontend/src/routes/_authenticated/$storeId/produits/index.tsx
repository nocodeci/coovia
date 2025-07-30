import { createFileRoute } from '@tanstack/react-router'
import Produits from '@/features/produits/produit'

export const Route = createFileRoute('/_authenticated/$storeId/produits/')({
  component: ProduitsIndexPage,
})

function ProduitsIndexPage() {
  const { storeId } = Route.useParams()
  return <Produits storeId={storeId} />
} 