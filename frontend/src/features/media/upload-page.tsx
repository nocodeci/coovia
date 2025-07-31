import React, { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { MediaUpload } from './components/MediaUpload'
import { MediaFile } from './types/media'

interface MediaUploadPageProps {
  storeId: string
}

export default function MediaUploadPage({ storeId }: MediaUploadPageProps) {
  const [uploadedFiles, setUploadedFiles] = useState<MediaFile[]>([])

  const handleFilesUploaded = (files: File[]) => {
    const newFiles: MediaFile[] = files.map((file, index) => ({
      id: `new-${Date.now()}-${index}`,
      name: file.name,
      type: getFileType(file.type),
      size: file.size,
      url: URL.createObjectURL(file),
      thumbnail: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
      uploadedAt: new Date(),
      lastModified: new Date(),
      mimeType: file.type
    }))

    setUploadedFiles(prev => [...newFiles, ...prev])
  }

  const getFileType = (mimeType: string): MediaFile['type'] => {
    if (mimeType.startsWith('image/')) return 'image'
    if (mimeType.startsWith('video/')) return 'video'
    if (mimeType.startsWith('audio/')) return 'audio'
    return 'document'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <button
              onClick={() => window.history.back()}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </button>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Ajouter des Médias</h1>
          <p className="text-gray-600">Téléchargez vos fichiers multimédias pour les utiliser dans votre boutique</p>
        </div>

        {/* Upload Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Télécharger des fichiers</h2>
          <MediaUpload onFilesUploaded={handleFilesUploaded} />
        </div>

        {/* Uploaded Files Preview */}
        {uploadedFiles.length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Fichiers téléchargés</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {uploadedFiles.map((file) => (
                <div key={file.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="aspect-square bg-gray-100 rounded mb-3 overflow-hidden">
                    {file.type === 'image' && file.thumbnail ? (
                      <img
                        src={file.thumbnail}
                        alt={file.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-gray-500 text-sm">{file.type.toUpperCase()}</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="font-medium text-sm truncate">{file.name}</h4>
                    <p className="text-xs text-gray-500">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 