import React, { useState } from 'react'
import { X, Download, ZoomIn, ZoomOut, RotateCw, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog'
import { mediaService } from '@/services/mediaService'

interface MediaPreviewProps {
  media: {
    id: string
    name: string
    url: string
    thumbnail?: string
    type: string
    size: number
    created_at: string
    mime_type: string
  }
  isOpen: boolean
  onClose: () => void
}

export default function MediaPreview({ media, isOpen, onClose }: MediaPreviewProps) {
  const [zoom, setZoom] = useState(1)
  const [rotation, setRotation] = useState(0)

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.25, 3))
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.25, 0.5))
  const handleRotate = () => setRotation(prev => (prev + 90) % 360)
  const handleReset = () => {
    setZoom(1)
    setRotation(0)
  }

  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = media.url
    link.download = media.name
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getFileTypeColor = (type: string) => {
    switch (type) {
      case 'image': return 'bg-blue-100 text-blue-800'
      case 'video': return 'bg-red-100 text-red-800'
      case 'audio': return 'bg-purple-100 text-purple-800'
      default: return 'bg-green-100 text-green-800'
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center space-x-2">
              <span>{media.name}</span>
              <Badge className={getFileTypeColor(media.type)}>
                {media.type}
              </Badge>
            </DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Image Preview */}
          <div className="flex-1 min-h-0">
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="relative bg-slate-100 min-h-[400px] flex items-center justify-center overflow-hidden">
                  {media.type === 'image' ? (
                    <img
                      src={media.url}
                      alt={media.name}
                      className="max-w-full max-h-full object-contain transition-all duration-200"
                      style={{
                        transform: `scale(${zoom}) rotate(${rotation}deg)`,
                      }}
                    />
                  ) : (
                    <div className="text-center p-8">
                      <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
                        <ExternalLink className="w-8 h-8 text-slate-400" />
                      </div>
                      <p className="text-slate-600">Aperçu non disponible pour ce type de fichier</p>
                      <Button 
                        variant="outline" 
                        className="mt-4"
                        onClick={handleDownload}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Télécharger
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Image Controls */}
            {media.type === 'image' && (
              <div className="flex items-center justify-center space-x-2 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleZoomOut}
                  disabled={zoom <= 0.5}
                >
                  <ZoomOut className="w-4 h-4" />
                </Button>
                <Badge variant="secondary">
                  {Math.round(zoom * 100)}%
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleZoomIn}
                  disabled={zoom >= 3}
                >
                  <ZoomIn className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRotate}
                >
                  <RotateCw className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleReset}
                >
                  Reset
                </Button>
              </div>
            )}
          </div>

          {/* File Details */}
          <div className="w-full lg:w-80">
            <Card>
              <CardContent className="p-6 space-y-4">
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Informations du fichier</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-slate-600">Nom</p>
                      <p className="text-sm text-slate-900 truncate">{media.name}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-600">Type</p>
                      <p className="text-sm text-slate-900">{media.mime_type}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-600">Taille</p>
                      <p className="text-sm text-slate-900">{mediaService.formatFileSize(media.size)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-600">Date de création</p>
                      <p className="text-sm text-slate-900">{formatDate(media.created_at)}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200">
                  <div className="space-y-2">
                    <Button 
                      className="w-full" 
                      onClick={handleDownload}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Télécharger
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => window.open(media.url, '_blank')}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Ouvrir dans un nouvel onglet
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
