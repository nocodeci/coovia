import React, { useState, useCallback, useEffect } from 'react'
import { 
  Upload, 
  Folder, 
  Image, 
  File, 
  Trash2, 
  Download, 
  Eye, 
  Search, 
  Filter, 
  Grid, 
  List, 
  AlertCircle,
  MoreVertical,
  Calendar,
  HardDrive,
  FileImage,
  FileVideo,
  FileAudio,
  FileText,
  Plus,
  X,
  Check,
  Loader2
} from 'lucide-react'
import { mediaService, MediaItem, MediaStats } from '@/services/mediaService'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog'
import MediaPreview from '@/components/MediaPreview'

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
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)
  const [previewMedia, setPreviewMedia] = useState<MediaItem | null>(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)

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

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setError(null)
    }
  }, [])

  const handleUpload = useCallback(async () => {
    if (!storeId || !selectedFile) {
      setError('Veuillez sélectionner un fichier')
      return
    }

    setIsUploading(true)
    setUploadProgress(0)
    setError(null)
    
    try {
      const response = await mediaService.uploadMedia(storeId, [selectedFile], (progress) => {
        setUploadProgress(progress)
      })
      
      // Ajouter les nouveaux médias au début de la liste
      if (response.data && response.data.length > 0) {
        setMediaItems(prevMedias => [...response.data, ...prevMedias])
      }
      
      // Recharger les stats
      await loadMedia()
      
      // Réinitialiser les états
      setSelectedFile(null)
      setIsUploading(false)
      setUploadProgress(0)
      setIsUploadDialogOpen(false)
      
      // Réinitialiser l'input file
      const fileInput = document.getElementById('file-upload') as HTMLInputElement
      if (fileInput) {
        fileInput.value = ''
      }
      
      console.log('Upload réussi:', response.message)
    } catch (error) {
      console.error('Erreur lors de l\'upload:', error)
      setError('Erreur lors de l\'upload du fichier')
      setIsUploading(false)
      setUploadProgress(0)
    }
  }, [storeId, selectedFile, loadMedia])

  const handleDelete = useCallback(async (id: string) => {
    // Demander confirmation à l'utilisateur
    const isConfirmed = window.confirm("Êtes-vous sûr de vouloir supprimer ce fichier ?")
    if (!isConfirmed) {
      return
    }

    try {
      await mediaService.deleteMedia(storeId, id)
      
      // Mettre à jour la liste locale instantanément
      setMediaItems(prev => prev.filter(item => item.id !== id))
      setSelectedItems(prev => prev.filter(item => item !== id))
      
      // Recharger les stats
      await loadMedia()
      
      console.log('Fichier supprimé avec succès')
    } catch (error) {
      console.error('Erreur lors de la suppression:', error)
      setError('Erreur lors de la suppression du fichier')
    }
  }, [storeId, loadMedia])

  const handleSelect = useCallback((id: string) => {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    )
  }, [])

  const handlePreview = useCallback((media: MediaItem) => {
    setPreviewMedia(media)
    setIsPreviewOpen(true)
  }, [])

  const handleSelectAll = useCallback(() => {
    if (selectedItems.length === mediaItems.length) {
      setSelectedItems([])
    } else {
      setSelectedItems(mediaItems.map(item => item.id))
    }
  }, [selectedItems.length, mediaItems])

  const handleBulkDelete = useCallback(async () => {
    const isConfirmed = window.confirm(`Êtes-vous sûr de vouloir supprimer ${selectedItems.length} fichier(s) ?`)
    if (!isConfirmed) {
      return
    }

    try {
      // Supprimer tous les fichiers sélectionnés
      await Promise.all(selectedItems.map(id => mediaService.deleteMedia(storeId, id)))
      
      // Mettre à jour la liste locale
      setMediaItems(prev => prev.filter(item => !selectedItems.includes(item.id)))
      setSelectedItems([])
      
      // Recharger les stats
      await loadMedia()
      
      console.log('Fichiers supprimés avec succès')
    } catch (error) {
      console.error('Erreur lors de la suppression en masse:', error)
      setError('Erreur lors de la suppression en masse')
    }
  }, [selectedItems, storeId, loadMedia])

  // Les données sont déjà filtrées par l'API
  const filteredItems = mediaItems

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image': return <FileImage className="w-5 h-5 text-blue-500" />
      case 'video': return <FileVideo className="w-5 h-5 text-red-500" />
      case 'audio': return <FileAudio className="w-5 h-5 text-purple-500" />
      default: return <FileText className="w-5 h-5 text-green-500" />
    }
  }

  const getFileTypeColor = (type: string) => {
    switch (type) {
      case 'image': return 'bg-blue-100 text-blue-800'
      case 'video': return 'bg-red-100 text-red-800'
      case 'audio': return 'bg-purple-100 text-purple-800'
      default: return 'bg-green-100 text-green-800'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
                Bibliothèque Media
              </h1>
              <p className="text-slate-600 mt-2 flex items-center">
                <HardDrive className="w-4 h-4 mr-2" />
                Store ID: {storeId}
              </p>
            </div>
            
            <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
              <DialogTrigger asChild>
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter un fichier
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Ajouter un fichier</DialogTitle>
                  <DialogDescription>
                    Sélectionnez un fichier à uploader dans votre bibliothèque media.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Input
                      id="file-upload"
                      type="file"
                      onChange={handleFileSelect}
                      className="cursor-pointer"
                    />
                  </div>
                  
                  {selectedFile && (
                    <Card>
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <File className="w-4 h-4 text-blue-600" />
                            <span className="text-sm font-medium">{selectedFile.name}</span>
                            <Badge variant="secondary">{mediaService.formatFileSize(selectedFile.size)}</Badge>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedFile(null)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                  
                  {isUploading && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Upload en cours...</span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <Progress value={uploadProgress} className="w-full" />
                    </div>
                  )}
                  
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => setIsUploadDialogOpen(false)}
                      disabled={isUploading}
                    >
                      Annuler
                    </Button>
                    <Button
                      onClick={handleUpload}
                      disabled={isUploading || !selectedFile}
                    >
                      {isUploading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Upload...
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4 mr-2" />
                          Upload
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600">Total Fichiers</p>
                    <p className="text-3xl font-bold text-blue-900">{stats.total_files}</p>
                  </div>
                  <Folder className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-600">Espace Utilisé</p>
                    <p className="text-3xl font-bold text-green-900">{mediaService.formatFileSize(stats.total_size)}</p>
                  </div>
                  <HardDrive className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-600">Images</p>
                    <p className="text-3xl font-bold text-purple-900">{stats.files_by_type.image}</p>
                  </div>
                  <FileImage className="w-8 h-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-red-600">Vidéos</p>
                    <p className="text-3xl font-bold text-red-900">{stats.files_by_type.video}</p>
                  </div>
                  <FileVideo className="w-8 h-8 text-red-600" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Toolbar */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {/* Search */}
                <div className="relative w-80">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <Input
                    type="text"
                    placeholder="Rechercher des fichiers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Filter */}
                <Select value={filterType} onValueChange={(value: any) => setFilterType(value)}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filtrer par type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les types</SelectItem>
                    <SelectItem value="image">Images</SelectItem>
                    <SelectItem value="video">Vidéos</SelectItem>
                    <SelectItem value="document">Documents</SelectItem>
                    <SelectItem value="audio">Audio</SelectItem>
                  </SelectContent>
                </Select>
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
          </CardContent>
        </Card>

        {/* Error Display */}
        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">{error}</AlertDescription>
          </Alert>
        )}

        {/* Bulk Actions */}
        {selectedItems.length > 0 && (
          <Card className="mb-6 border-blue-200 bg-blue-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    {selectedItems.length} élément(s) sélectionné(s)
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSelectAll}
                  >
                    {selectedItems.length === mediaItems.length ? 'Désélectionner tout' : 'Sélectionner tout'}
                  </Button>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedItems([])}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Annuler
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleBulkDelete}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Supprimer ({selectedItems.length})
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Content */}
        {isLoading ? (
          <Card>
            <CardContent className="p-12">
              <div className="text-center">
                <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900 mb-2">Chargement des médias...</h3>
                <p className="text-slate-500">Veuillez patienter</p>
              </div>
            </CardContent>
          </Card>
        ) : filteredItems.length === 0 ? (
          <Card>
            <CardContent className="p-12">
              <div className="text-center">
                <Folder className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900 mb-2">Aucun fichier trouvé</h3>
                <p className="text-slate-500 mb-4">Aucun fichier ne correspond à votre recherche.</p>
                <Button onClick={() => setIsUploadDialogOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter votre premier fichier
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : 'space-y-2'}>
            {filteredItems.map((item) => (
              <Card
                key={item.id}
                className={`group cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] ${
                  selectedItems.includes(item.id) ? 'ring-2 ring-blue-500 shadow-lg' : ''
                }`}
                onClick={() => handleSelect(item.id)}
              >
                {viewMode === 'grid' ? (
                  // Grid View
                  <div className="relative">
                    <div className="aspect-square bg-gradient-to-br from-slate-100 to-slate-200 relative overflow-hidden rounded-t-lg">
                      {(() => {
                        const imageUrl = item.thumbnail || item.url;
                        return imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={item.name}
                            className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            {getFileIcon(item.type)}
                          </div>
                        );
                      })()}
                      
                      {/* Overlay Actions */}
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <div className="flex space-x-2">
                          <Button 
                            size="sm" 
                            variant="secondary" 
                            className="h-8 w-8 p-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePreview(item);
                            }}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
                            <Download className="w-4 h-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive" 
                            className="h-8 w-8 p-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(item.id);
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Selection Indicator */}
                      {selectedItems.includes(item.id) && (
                        <div className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      )}

                      {/* File Type Badge */}
                      <div className="absolute top-2 left-2">
                        <Badge className={getFileTypeColor(item.type)}>
                          {item.type}
                        </Badge>
                      </div>
                    </div>
                    
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-slate-900 truncate">{item.name}</h3>
                          <div className="flex items-center space-x-2 mt-1">
                            <p className="text-sm text-slate-500">
                              {mediaService.formatFileSize(item.size)}
                            </p>
                            <span className="text-slate-300">•</span>
                            <p className="text-sm text-slate-500 flex items-center">
                              <Calendar className="w-3 h-3 mr-1" />
                              {formatDate(item.created_at)}
                            </p>
                          </div>
                        </div>
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                                                     <DropdownMenuContent align="end">
                             <DropdownMenuItem onClick={(e) => {
                               e.stopPropagation();
                               handlePreview(item);
                             }}>
                               <Eye className="w-4 h-4 mr-2" />
                               Aperçu
                             </DropdownMenuItem>
                             <DropdownMenuItem>
                               <Download className="w-4 h-4 mr-2" />
                               Télécharger
                             </DropdownMenuItem>
                             <DropdownMenuItem className="text-red-600" onClick={(e) => {
                               e.stopPropagation();
                               handleDelete(item.id);
                             }}>
                               <Trash2 className="w-4 h-4 mr-2" />
                               Supprimer
                             </DropdownMenuItem>
                           </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardContent>
                  </div>
                ) : (
                  // List View
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-slate-100 to-slate-200 rounded flex items-center justify-center">
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
                        
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={selectedItems.includes(item.id)}
                            onChange={() => handleSelect(item.id)}
                            className="w-4 h-4 text-blue-600 bg-white border-slate-300 rounded focus:ring-blue-500"
                          />
                          <Badge className={getFileTypeColor(item.type)}>
                            {item.type}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-slate-900 truncate">{item.name}</h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <p className="text-sm text-slate-500">
                            {mediaService.formatFileSize(item.size)}
                          </p>
                          <span className="text-slate-300">•</span>
                          <p className="text-sm text-slate-500 flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            {formatDate(item.created_at)}
                          </p>
                        </div>
                      </div>
                      
                                             <div className="flex items-center space-x-2">
                         <Button 
                           variant="ghost" 
                           size="sm"
                           onClick={(e) => {
                             e.stopPropagation();
                             handlePreview(item);
                           }}
                         >
                           <Eye className="w-4 h-4" />
                         </Button>
                         <Button variant="ghost" size="sm">
                           <Download className="w-4 h-4" />
                         </Button>
                         <Button 
                           variant="ghost" 
                           size="sm"
                           onClick={(e) => {
                             e.stopPropagation();
                             handleDelete(item.id);
                           }}
                         >
                           <Trash2 className="w-4 h-4" />
                         </Button>
                       </div>
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        )}

        {/* Media Preview */}
        {previewMedia && (
          <MediaPreview
            media={previewMedia}
            isOpen={isPreviewOpen}
            onClose={() => {
              setIsPreviewOpen(false)
              setPreviewMedia(null)
            }}
          />
        )}
      </div>
    </div>
  )
} 