import React from 'react'
import { IconPhoto, IconVideo, IconFileText, IconMusic, IconDatabase } from '@tabler/icons-react'
import { MediaStatsComponentProps } from '../types/media'

export const MediaStatsComponent: React.FC<MediaStatsComponentProps> = ({ stats }) => {
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getStoragePercentage = (): number => {
    return (stats.totalSize / stats.storageLimit) * 100
  }

  const getStorageColor = (percentage: number): string => {
    if (percentage < 50) return 'bg-green-500'
    if (percentage < 80) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  const storagePercentage = getStoragePercentage()

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
      {/* Total Files */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <IconDatabase className="h-8 w-8 text-blue-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Total Fichiers</p>
            <p className="text-2xl font-bold text-gray-900">{stats.totalFiles}</p>
          </div>
        </div>
      </div>

      {/* Storage Usage */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <IconDatabase className="h-8 w-8 text-green-600" />
          </div>
          <div className="ml-4 flex-1">
            <p className="text-sm font-medium text-gray-500">Espace Utilisé</p>
            <p className="text-2xl font-bold text-gray-900">{formatFileSize(stats.totalSize)}</p>
            <div className="mt-2">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Stockage</span>
                <span>{storagePercentage.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${getStorageColor(storagePercentage)}`}
                  style={{ width: `${Math.min(storagePercentage, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Images */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <IconPhoto className="h-8 w-8 text-purple-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Images</p>
            <p className="text-2xl font-bold text-gray-900">{stats.filesByType.image}</p>
          </div>
        </div>
      </div>

      {/* Videos */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <IconVideo className="h-8 w-8 text-red-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Vidéos</p>
            <p className="text-2xl font-bold text-gray-900">{stats.filesByType.video}</p>
          </div>
        </div>
      </div>

      {/* Documents */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <IconFileText className="h-8 w-8 text-blue-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Documents</p>
            <p className="text-2xl font-bold text-gray-900">{stats.filesByType.document}</p>
          </div>
        </div>
      </div>
    </div>
  )
} 