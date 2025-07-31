"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Upload, 
  Image, 
  Video, 
  File, 
  Music, 
  X,
  CheckCircle,
  AlertCircle,
  FileText,
  Play
} from "lucide-react"
import { toast } from "sonner"
import apiService from "@/lib/api"

interface UploadedFile {
  id: string
  file: File
  preview?: string
  progress: number
  status: 'uploading' | 'success' | 'error'
  error?: string
}

interface MediaUploadProps {
  storeId: string
}

export default function MediaUpload({ storeId }: MediaUploadProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [isUploading, setIsUploading] = useState(false)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles: UploadedFile[] = acceptedFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      progress: 0,
      status: 'uploading'
    }))

    setUploadedFiles(prev => [...prev, ...newFiles])
    
    // Simuler l'upload pour chaque fichier
    newFiles.forEach(file => {
      simulateUpload(file.id)
    })
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'],
      'video/*': ['.mp4', '.avi', '.mov', '.wmv'],
      'audio/*': ['.mp3', '.wav', '.ogg', '.m4a'],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    multiple: true,
    maxSize: 50 * 1024 * 1024 // 50MB max
  })

  const simulateUpload = async (fileId: string) => {
    const file = uploadedFiles.find(f => f.id === fileId)
    if (!file) return

    // Simuler la progression
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 200))
      setUploadedFiles(prev => 
        prev.map(f => 
          f.id === fileId 
            ? { ...f, progress: i }
            : f
        )
      )
    }

    // Simuler le succès
    setUploadedFiles(prev => 
      prev.map(f => 
        f.id === fileId 
          ? { ...f, status: 'success' as const }
          : f
      )
    )

    toast.success(`${file.file.name} uploadé avec succès`)
  }

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId))
  }

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return <Image className="h-6 w-6" />
    if (file.type.startsWith('video/')) return <Video className="h-6 w-6" />
    if (file.type.startsWith('audio/')) return <Music className="h-6 w-6" />
    return <File className="h-6 w-6" />
  }

  const getFileType = (file: File) => {
    if (file.type.startsWith('image/')) return 'image'
    if (file.type.startsWith('video/')) return 'video'
    if (file.type.startsWith('audio/')) return 'audio'
    return 'document'
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const handleUploadAll = async () => {
    setIsUploading(true)
    
    try {
      // TODO: Implémenter l'API d'upload
      // const response = await apiService.uploadMedia(storeId, uploadedFiles)
      
      toast.success(`${uploadedFiles.length} fichier(s) uploadé(s) avec succès`)
      
      // Rediriger vers la bibliothèque
      setTimeout(() => {
        window.location.href = `/${storeId}/media`
      }, 1000)
      
    } catch (error) {
      toast.error("Erreur lors de l'upload")
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Ajouter des Médias</h1>
        <p className="text-muted-foreground">
          Uploadez vos images, vidéos, audio et documents
        </p>
      </div>

      {/* Zone de drop */}
      <Card>
        <CardHeader>
          <CardTitle>Glisser-déposer vos fichiers</CardTitle>
          <CardDescription>
            Formats acceptés : Images (JPG, PNG, GIF, WebP), Vidéos (MP4, AVI, MOV), 
            Audio (MP3, WAV, OGG), Documents (PDF, DOC, DOCX)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            {isDragActive ? (
              <p className="text-lg font-medium text-blue-600">
                Déposez les fichiers ici...
              </p>
            ) : (
              <div>
                <p className="text-lg font-medium mb-2">
                  Glissez-déposez vos fichiers ici
                </p>
                <p className="text-muted-foreground mb-4">
                  ou cliquez pour sélectionner des fichiers
                </p>
                <Button variant="outline">
                  Sélectionner des fichiers
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Liste des fichiers uploadés */}
      {uploadedFiles.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Fichiers à uploader</CardTitle>
              <Button 
                onClick={handleUploadAll}
                disabled={isUploading || uploadedFiles.some(f => f.status === 'uploading')}
              >
                {isUploading ? 'Upload en cours...' : 'Uploader tous les fichiers'}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {uploadedFiles.map((file) => (
                <div key={file.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                  <div className="flex items-center space-x-3 flex-1">
                    {getFileIcon(file.file)}
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{file.file.name}</span>
                        <Badge variant="outline">{getFileType(file.file)}</Badge>
                        <span className="text-sm text-muted-foreground">
                          {formatFileSize(file.file.size)}
                        </span>
                      </div>
                      
                      {/* Barre de progression */}
                      {file.status === 'uploading' && (
                        <div className="mt-2">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${file.progress}%` }}
                            />
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {file.progress}% terminé
                          </div>
                        </div>
                      )}
                      
                      {/* Statut */}
                      {file.status === 'success' && (
                        <div className="flex items-center space-x-1 text-green-600 text-sm">
                          <CheckCircle className="h-4 w-4" />
                          <span>Uploadé avec succès</span>
                        </div>
                      )}
                      
                      {file.status === 'error' && (
                        <div className="flex items-center space-x-1 text-red-600 text-sm">
                          <AlertCircle className="h-4 w-4" />
                          <span>{file.error}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(file.id)}
                    disabled={file.status === 'uploading'}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Statistiques */}
      {uploadedFiles.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{uploadedFiles.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Images</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {uploadedFiles.filter(f => getFileType(f.file) === 'image').length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Vidéos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {uploadedFiles.filter(f => getFileType(f.file) === 'video').length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Taille totale</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatFileSize(uploadedFiles.reduce((acc, f) => acc + f.file.size, 0))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
} 