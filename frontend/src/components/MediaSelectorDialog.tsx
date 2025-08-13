import React, { useState, useEffect } from 'react'
import { X, Upload, Search, Grid, List, Check, Plus, Image, File, Video, Music } from 'lucide-react'
import { MediaItem } from '@/services/mediaService'
import { mediaService } from '@/services/mediaService'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { cn } from '@/lib/utils'

interface MediaSelectorDialogProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (media: MediaItem) => void
  storeId: string
  title?: string
  allowMultiple?: boolean
  selectedMedia?: MediaItem[]
}

export default function MediaSelectorDialog({
  isOpen,
  onClose,
  onSelect,
  storeId,
  title = "Sélectionner un média",
  allowMultiple = false,
  selectedMedia = []
}: MediaSelectorDialogProps) {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'image' | 'video' | 'document' | 'audio'>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [isUploading, setIsUploading] = useState(false)
  const [selectedItems, setSelectedItems] = useState<string[]>([])

  // Charger les médias au montage du composant
  useEffect(() => {
    if (isOpen) {
      loadMedia()
    }
  }, [isOpen, storeId, searchTerm, filterType])

  const loadMedia = async () => {
    try {
      setIsLoading(true)
      
      const response = await mediaService.getMedia(storeId, {
        search: searchTerm || undefined,
        type: filterType === 'all' ? undefined : filterType,
        sort_by: 'created_at',
        sort_order: 'desc'
      })

      setMediaItems(response.data.data)
    } catch (error) {
      console.error('Erreur lors du chargement des médias:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    setIsUploading(true)
    
    try {
      await mediaService.uploadMedia(storeId, Array.from(files))
      await loadMedia()
    } catch (error) {
      console.error('Erreur lors de l\'upload:', error)
    } finally {
      setIsUploading(false)
      event.target.value = ''
    }
  }

  const handleSelect = (media: MediaItem) => {
    if (allowMultiple) {
      // Mode sélection multiple
      const isSelected = selectedItems.includes(media.id)
      if (isSelected) {
        setSelectedItems(prev => prev.filter(id => id !== media.id))
      } else {
        setSelectedItems(prev => [...prev, media.id])
      }
    } else {
      // Mode sélection unique
      onSelect(media)
      onClose()
    }
  }

  const handleConfirmMultiple = () => {
    const selectedMediaItems = mediaItems.filter(item => selectedItems.includes(item.id))
    selectedMediaItems.forEach(media => onSelect(media))
    onClose()
  }

  const isSelected = (mediaId: string) => {
    return selectedItems.includes(mediaId)
  }

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image': return <Image className="w-4 h-4" />
      case 'video': return <Video className="w-4 h-4" />
      case 'audio': return <Music className="w-4 h-4" />
      default: return <File className="w-4 h-4" />
    }
  }

  if (!isOpen) return null

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-[98vw] w-[98vw] max-h-[95vh] overflow-hidden">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center justify-between">
            <span>{title}</span>
            {allowMultiple && selectedItems.length > 0 && (
              <span className="text-sm text-muted-foreground">
                {selectedItems.length} sélectionné(s)
              </span>
            )}
          </AlertDialogTitle>
          <AlertDialogDescription>
            Sélectionnez des fichiers depuis votre bibliothèque média ou ajoutez de nouveaux fichiers.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {/* Toolbar */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Rechercher des fichiers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-56 lg:w-80"
                />
              </div>

              {/* Filter */}
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              >
                <option value="all">Tous les types</option>
                <option value="image">Images</option>
                <option value="video">Vidéos</option>
                <option value="document">Documents</option>
                <option value="audio">Audio</option>
              </select>

              {/* Upload Button */}
              <Button
                onClick={() => document.getElementById('media-upload')?.click()}
                disabled={isUploading}
                variant="outline"
                size="sm"
              >
                <Upload className="w-4 h-4 mr-2" />
                {isUploading ? 'Upload...' : 'Ajouter'}
              </Button>
              <input
                id="media-upload"
                type="file"
                multiple
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>

            <div className="flex items-center space-x-2">
              {/* View Mode */}
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[70vh]">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Chargement des médias...</p>
            </div>
          ) : mediaItems.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun média trouvé</h3>
              <p className="text-gray-500">Commencez par ajouter des fichiers</p>
            </div>
          ) : (
            <div className={viewMode === 'grid' ? 'grid grid-cols-3 gap-4' : 'space-y-2'}>
              {mediaItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  className={cn(
                    "relative cursor-pointer rounded-lg border-2 transition-all hover:shadow-md",
                    isSelected(item.id) 
                      ? "border-blue-500 bg-blue-50" 
                      : "border-gray-200 hover:border-gray-300"
                  )}
                >
                  {viewMode === 'grid' ? (
                    // Grid View
                    <div className="p-3">
                      <div className="aspect-square bg-gray-100 rounded-lg relative overflow-hidden mb-2">
                        {(() => {
                          const imageUrl = item.thumbnail || item.url;
                          return imageUrl ? (
                            <img
                              src={imageUrl}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              {getFileIcon(item.type)}
                            </div>
                          );
                        })()}
                        
                        {/* Selection Indicator */}
                        {isSelected(item.id) && (
                          <div className="absolute top-2 right-2 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                            <Check className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </div>
                      
                      <div>
                        <h3 className="font-medium text-gray-900 text-xs truncate">{item.name}</h3>
                        <p className="text-xs text-gray-500 mt-1">
                          {(item.size / 1024 / 1024).toFixed(1)} MB
                        </p>
                      </div>
                    </div>
                  ) : (
                    // List View
                    <div className="flex items-center p-4 hover:bg-gray-50">
                      <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center mr-4">
                        {(() => {
                          const imageUrl = item.thumbnail || item.url;
                          return imageUrl ? (
                            <img
                              src={imageUrl}
                              alt={item.name}
                              className="w-full h-full object-cover rounded"
                            />
                          ) : (
                            getFileIcon(item.type)
                          );
                        })()}
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{item.name}</h3>
                        <p className="text-sm text-gray-500">
                          {(item.size / 1024 / 1024).toFixed(1)} MB • {new Date(item.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      
                      {isSelected(item.id) && (
                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          {allowMultiple && selectedItems.length > 0 && (
            <AlertDialogAction onClick={handleConfirmMultiple}>
              Confirmer ({selectedItems.length})
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
} 