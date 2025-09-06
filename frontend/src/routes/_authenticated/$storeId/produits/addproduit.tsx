import { createFileRoute } from '@tanstack/react-router'
import AddProduct from '@/features/produits/addproduit'

export const Route = createFileRoute('/_authenticated/$storeId/produits/addproduit')({
  component: AddProductPage,
})

function AddProductPage() {
  const { storeId } = Route.useParams()
  return <AddProduct storeId={storeId} />
}