import { createFileRoute } from '@tanstack/react-router'
import MediaLibrary from '@/features/media'

export const Route = createFileRoute('/_authenticated/$storeId/media/')({
  component: MediaIndexPage,
})

function MediaIndexPage() {
  const { storeId } = Route.useParams()
  return <MediaLibrary storeId={storeId} />
} 