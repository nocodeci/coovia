import React, { useState, useEffect } from 'react'
import { X, Upload, Search, Grid, List, Check, Plus } from 'lucide-react'
import { mediaService, MediaItem } from '@/services/mediaService'

interface MediaSelectorProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (media: MediaItem) => void
  storeId: string
  title?: string
  allowMultiple?: boolean
  selectedMedia?: MediaItem[]
}

export default function MediaSelector({
  isOpen,
  onClose,
  onSelect,
  storeId,
  title = "Sélectionner un média",
  allowMultiple = false,
  selectedMedia = []
}: MediaSelectorProps) {
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
      case 'image': return <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center text-blue-600">🖼️</div>
      case 'video': return <div className="w-8 h-8 bg-red-100 rounded flex items-center justify-center text-red-600">🎥</div>
      case 'audio': return <div className="w-8 h-8 bg-purple-100 rounded flex items-center justify-center text-purple-600">🎵</div>
      default: return <div className="w-8 h-8 bg-green-100 rounded flex items-center justify-center text-green-600">📄</div>
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
            {allowMultiple && selectedItems.length > 0 && (
              <p className="text-sm text-gray-600 mt-1">
                {selectedItems.length} élément(s) sélectionné(s)
              </p>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {allowMultiple && selectedItems.length > 0 && (
              <button
                onClick={handleConfirmMultiple}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Confirmer ({selectedItems.length})
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Rechercher des fichiers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Filter */}
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Tous les types</option>
                <option value="image">Images</option>
                <option value="video">Vidéos</option>
                <option value="document">Documents</option>
                <option value="audio">Audio</option>
              </select>

              {/* Upload Button */}
              <button
                onClick={() => document.getElementById('media-upload')?.click()}
                disabled={isUploading}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                <Upload className="w-4 h-4 mr-2" />
                {isUploading ? 'Upload...' : 'Ajouter'}
              </button>
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
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-400'}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-400'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
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
            <div className={viewMode === 'grid' ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4' : 'space-y-2'}>
              {mediaItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  className={`relative cursor-pointer rounded-lg border-2 transition-all hover:shadow-md ${
                    isSelected(item.id) 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {viewMode === 'grid' ? (
                    // Grid View
                    <div className="p-4">
                      <div className="aspect-square bg-gray-100 rounded-lg relative overflow-hidden mb-3">
                        {item.thumbnail ? (
                          <img
                            src={mediaService.getThumbnailUrl(item.thumbnail)}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            {getFileIcon(item.type)}
                          </div>
                        )}
                        
                        {/* Selection Indicator */}
                        {isSelected(item.id) && (
                          <div className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </div>
                      
                      <div>
                        <h3 className="font-medium text-gray-900 text-sm truncate">{item.name}</h3>
                        <p className="text-xs text-gray-500 mt-1">
                          {mediaService.formatFileSize(item.size)}
                        </p>
                      </div>
                    </div>
                  ) : (
                    // List View
                    <div className="flex items-center p-4 hover:bg-gray-50">
                      <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center mr-4">
                        {item.thumbnail ? (
                          <img
                            src={mediaService.getThumbnailUrl(item.thumbnail)}
                            alt={item.name}
                            className="w-full h-full object-cover rounded"
                          />
                        ) : (
                          getFileIcon(item.type)
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{item.name}</h3>
                        <p className="text-sm text-gray-500">
                          {mediaService.formatFileSize(item.size)} • {new Date(item.created_at).toLocaleDateString()}
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

        {/* Footer */}
        <div className="p-6 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              {mediaItems.length} fichier(s) disponible(s)
            </p>
            <div className="flex items-center space-x-2">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 