import React, { useState } from 'react'
import { IconDownload, IconTrash, IconEdit, IconEye, IconDotsVertical } from '@tabler/icons-react'
import { MediaGridProps, MediaFile } from '../types/media'

export const MediaGrid: React.FC<MediaGridProps> = ({
  files,
  onDelete,
  onRename,
  onDownload,
  selectedFiles,
  onSelectFile
}) => {
  const [editingFile, setEditingFile] = useState<string | null>(null)
  const [editName, setEditName] = useState('')

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date)
  }

  const getFileIcon = (file: MediaFile) => {
    const iconClass = "h-8 w-8"
    switch (file.type) {
      case 'image':
        return <IconEye className={`${iconClass} text-blue-500`} />
      case 'video':
        return <IconEye className={`${iconClass} text-red-500`} />
      case 'audio':
        return <IconEye className={`${iconClass} text-green-500`} />
      default:
        return <IconEye className={`${iconClass} text-gray-500`} />
    }
  }

  const handleRename = (file: MediaFile) => {
    setEditingFile(file.id)
    setEditName(file.name)
  }

  const handleSaveRename = () => {
    if (editingFile && editName.trim()) {
      onRename(editingFile, editName.trim())
      setEditingFile(null)
      setEditName('')
    }
  }

  const handleCancelRename = () => {
    setEditingFile(null)
    setEditName('')
  }

  if (files.length === 0) {
    return (
      <div className="text-center py-12">
        <IconEye className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun fichier trouvé</h3>
        <p className="text-gray-500">Aucun fichier ne correspond à vos critères de recherche.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
      {files.map((file) => (
        <div
          key={file.id}
          className={`relative group bg-white rounded-lg border-2 transition-all duration-200 hover:shadow-md ${
            selectedFiles.includes(file.id)
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          {/* Selection Checkbox */}
          <div className="absolute top-2 left-2 z-10">
            <input
              type="checkbox"
              checked={selectedFiles.includes(file.id)}
              onChange={() => onSelectFile(file.id)}
              className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
            />
          </div>

          {/* File Preview */}
          <div className="aspect-square rounded-t-lg overflow-hidden bg-gray-100 relative">
            {file.type === 'image' && file.thumbnail ? (
              <img
                src={file.thumbnail}
                alt={file.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                {getFileIcon(file)}
              </div>
            )}

            {/* Overlay Actions */}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-2">
                <button
                  onClick={() => onDownload(file)}
                  className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
                >
                  <IconDownload className="h-4 w-4 text-gray-700" />
                </button>
                <button
                  onClick={() => handleRename(file)}
                  className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
                >
                  <IconEdit className="h-4 w-4 text-gray-700" />
                </button>
                <button
                  onClick={() => onDelete(file.id)}
                  className="p-2 bg-white rounded-full shadow-lg hover:bg-red-100 transition-colors"
                >
                  <IconTrash className="h-4 w-4 text-red-600" />
                </button>
              </div>
            </div>
          </div>

          {/* File Info */}
          <div className="p-4">
            {editingFile === file.id ? (
              <div className="space-y-2">
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  autoFocus
                />
                <div className="flex space-x-2">
                  <button
                    onClick={handleSaveRename}
                    className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Sauvegarder
                  </button>
                  <button
                    onClick={handleCancelRename}
                    className="px-2 py-1 text-xs bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                  >
                    Annuler
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <h3 className="text-sm font-medium text-gray-900 truncate" title={file.name}>
                  {file.name}
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  {formatFileSize(file.size)} • {formatDate(file.uploadedAt)}
                </p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
} 