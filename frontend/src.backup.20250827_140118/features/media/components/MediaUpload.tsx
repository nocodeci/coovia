import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { IconUpload, IconX, IconFile, IconPhoto, IconVideo, IconFileText, IconMusic } from '@tabler/icons-react'
import { MediaUploadProps } from '../types/media'

export const MediaUpload: React.FC<MediaUploadProps> = ({ onFilesUploaded }) => {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({})

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setUploadedFiles(prev => [...prev, ...acceptedFiles])
    
    // Simuler le progrès d'upload pour chaque fichier
    acceptedFiles.forEach(file => {
      setUploadProgress(prev => ({ ...prev, [file.name]: 0 }))
      
      // Simulation du progrès d'upload
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          const currentProgress = prev[file.name] || 0
          if (currentProgress >= 100) {
            clearInterval(interval)
            return prev
          }
          return { ...prev, [file.name]: currentProgress + 10 }
        })
      }, 200)
    })
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'],
      'video/*': ['.mp4', '.avi', '.mov', '.wmv'],
      'audio/*': ['.mp3', '.wav', '.flac', '.aac'],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
    },
    multiple: true
  })

  const removeFile = (fileName: string) => {
    setUploadedFiles(prev => prev.filter(file => file.name !== fileName))
    setUploadProgress(prev => {
      const newProgress = { ...prev }
      delete newProgress[fileName]
      return newProgress
    })
  }

  const handleUpload = () => {
    if (uploadedFiles.length === 0) return

    // Simuler l'upload complet
    setTimeout(() => {
      onFilesUploaded(uploadedFiles)
      setUploadedFiles([])
      setUploadProgress({})
    }, 1000)
  }

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return <IconPhoto className="h-6 w-6 text-blue-500" />
    if (file.type.startsWith('video/')) return <IconVideo className="h-6 w-6 text-red-500" />
    if (file.type.startsWith('audio/')) return <IconMusic className="h-6 w-6 text-green-500" />
    return <IconFileText className="h-6 w-6 text-gray-500" />
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="space-y-6">
      {/* Drop Zone */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragActive
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        <input {...getInputProps()} />
        <IconUpload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <p className="text-lg font-medium text-gray-700 mb-2">
          {isDragActive ? 'Déposez les fichiers ici...' : 'Glissez-déposez des fichiers ici'}
        </p>
        <p className="text-sm text-gray-500">
          ou cliquez pour sélectionner des fichiers
        </p>
        <p className="text-xs text-gray-400 mt-2">
          Images, vidéos, documents et fichiers audio acceptés
        </p>
      </div>

      {/* Uploaded Files List */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Fichiers à télécharger</h3>
          
          <div className="space-y-3">
            {uploadedFiles.map((file) => (
              <div key={file.name} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  {getFileIcon(file)}
                  <div>
                    <p className="text-sm font-medium text-gray-900">{file.name}</p>
                    <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {/* Progress Bar */}
                  <div className="w-24">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress[file.name] || 0}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  {/* Remove Button */}
                  <button
                    onClick={() => removeFile(file.name)}
                    className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <IconX className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Upload Button */}
          <div className="flex justify-end">
            <button
              onClick={handleUpload}
              disabled={Object.values(uploadProgress).some(progress => progress < 100)}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Télécharger {uploadedFiles.length} fichier{uploadedFiles.length > 1 ? 's' : ''}
            </button>
          </div>
        </div>
      )}
    </div>
  )
} 