import { createFileRoute } from '@tanstack/react-router'
import MediaUploadPage from '@/features/media/upload-page'

export const Route = createFileRoute('/_authenticated/$storeId/media/upload')({
  component: MediaUploadPageComponent,
})

function MediaUploadPageComponent() {
  const { storeId } = Route.useParams()
  return <MediaUploadPage storeId={storeId} />
} 