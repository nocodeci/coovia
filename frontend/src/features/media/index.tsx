import React, { useState, useCallback, useEffect } from 'react'
import { Upload, Folder, Image, File, Trash2, Download, Eye, Search, Filter, Grid, List, AlertCircle } from 'lucide-react'
import { mediaService, MediaItem, MediaStats } from '@/services/mediaService'

interface MediaLibraryProps {
  storeId: string
}

export default function MediaLibrary({ storeId }: MediaLibraryProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'image' | 'video' | 'document' | 'audio'>('all')
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([])
  const [stats, setStats] = useState<MediaStats | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)

  // Charger les médias au montage du composant
  useEffect(() => {
    loadMedia()
  }, [storeId, searchTerm, filterType])

  const loadMedia = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const response = await mediaService.getMedia(storeId, {
        search: searchTerm || undefined,
        type: filterType === 'all' ? undefined : filterType,
        sort_by: 'created_at',
        sort_order: 'desc'
      })

      setMediaItems(response.data.data)
      setStats(response.stats)
    } catch (error) {
      console.error('Erreur lors du chargement des médias:', error)
      setError('Erreur lors du chargement des médias')
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    setIsUploading(true)
    setUploadProgress(0)
    
    try {
      const response = await mediaService.uploadMedia(storeId, Array.from(files))
      
      // Recharger les médias après upload
      await loadMedia()
      
      // Afficher un message de succès
      console.log(response.message)
    } catch (error) {
      console.error('Erreur lors de l\'upload:', error)
      setError('Erreur lors de l\'upload des fichiers')
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
      // Réinitialiser l'input file
      event.target.value = ''
    }
  }, [storeId])

  const handleDelete = useCallback(async (id: string) => {
    try {
      await mediaService.deleteMedia(storeId, id)
      
      // Mettre à jour la liste locale
      setMediaItems(prev => prev.filter(item => item.id !== id))
      setSelectedItems(prev => prev.filter(item => item !== id))
      
      // Recharger les stats
      await loadMedia()
    } catch (error) {
      console.error('Erreur lors de la suppression:', error)
      setError('Erreur lors de la suppression du fichier')
    }
  }, [storeId])

  const handleSelect = useCallback((id: string) => {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    )
  }, [])

  // Les données sont déjà filtrées par l'API
  const filteredItems = mediaItems

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image': return <Image className="w-5 h-5 text-blue-500" />
      case 'video': return <File className="w-5 h-5 text-red-500" />
      case 'audio': return <File className="w-5 h-5 text-purple-500" />
      default: return <File className="w-5 h-5 text-green-500" />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Bibliothèque Media</h1>
              <p className="text-gray-600 mt-2">Store ID: {storeId}</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => document.getElementById('file-upload')?.click()}
                disabled={isUploading}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                <Upload className="w-4 h-4 mr-2" />
                {isUploading ? 'Upload en cours...' : 'Upload Fichiers'}
              </button>
              <input
                id="file-upload"
                type="file"
                multiple
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          </div>
        </div>

        {/* Stats */}
        {stats && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.total_files}</div>
                <div className="text-sm text-gray-600">Total Fichiers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{mediaService.formatFileSize(stats.total_size)}</div>
                <div className="text-sm text-gray-600">Espace Utilisé</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{stats.files_by_type.image}</div>
                <div className="text-sm text-gray-600">Images</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{stats.files_by_type.video}</div>
                <div className="text-sm text-gray-600">Vidéos</div>
              </div>
            </div>
          </div>
        )}

        {/* Toolbar */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
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

        {/* Error Display */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
              <span className="text-red-700">{error}</span>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Chargement des médias...</h3>
            <p className="text-gray-500">Veuillez patienter</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <Folder className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun fichier trouvé</h3>
            <p className="text-gray-500">Aucun fichier ne correspond à votre recherche.</p>
          </div>
        ) : (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : 'space-y-2'}>
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className={`bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow ${
                  selectedItems.includes(item.id) ? 'ring-2 ring-blue-500' : ''
                }`}
              >
                {viewMode === 'grid' ? (
                  // Grid View
                  <div className="relative group">
                    <div className="aspect-square bg-gray-100 relative">
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
                      
                      {/* Overlay Actions */}
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <div className="flex space-x-2">
                          <button className="p-2 bg-white rounded-full hover:bg-gray-100">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-2 bg-white rounded-full hover:bg-gray-100">
                            <Download className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete(item.id)}
                            className="p-2 bg-white rounded-full hover:bg-red-100 text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Selection Checkbox */}
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(item.id)}
                        onChange={() => handleSelect(item.id)}
                        className="absolute top-2 left-2 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                      />
                    </div>
                    
                    <div className="p-4">
                      <h3 className="font-medium text-gray-900 truncate">{item.name}</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {mediaService.formatFileSize(item.size)} • {new Date(item.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ) : (
                  // List View
                  <div className="flex items-center p-4 hover:bg-gray-50">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item.id)}
                      onChange={() => handleSelect(item.id)}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 mr-4"
                    />
                    
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
                    
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-gray-400 hover:text-gray-600">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-gray-600">
                        <Download className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(item.id)}
                        className="p-2 text-gray-400 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Bulk Actions */}
        {selectedItems.length > 0 && (
          <div className="fixed bottom-6 right-6 bg-white rounded-lg shadow-lg border border-gray-200 p-4">
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {selectedItems.length} élément(s) sélectionné(s)
              </span>
              <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                <Trash2 className="w-4 h-4 inline mr-2" />
                Supprimer
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                <Download className="w-4 h-4 inline mr-2" />
                Télécharger
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 