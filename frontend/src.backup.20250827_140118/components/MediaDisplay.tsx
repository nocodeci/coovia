import React from 'react'
import { X, Image, File, Video, Music } from 'lucide-react'
import { MediaItem } from '@/services/mediaService'

interface MediaDisplayProps {
  media: MediaItem[]
  onRemove?: (mediaId: string) => void
  maxDisplay?: number
  showRemoveButton?: boolean
}

export default function MediaDisplay({ 
  media, 
  onRemove, 
  maxDisplay = 3,
  showRemoveButton = true 
}: MediaDisplayProps) {
  if (!media || media.length === 0) {
    return null
  }

  const displayMedia = media.slice(0, maxDisplay)
  const remainingCount = media.length - maxDisplay

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image': return <Image className="w-4 h-4" />
      case 'video': return <Video className="w-4 h-4" />
      case 'audio': return <Music className="w-4 h-4" />
      default: return <File className="w-4 h-4" />
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      {displayMedia.map((item) => (
        <div
          key={item.id}
          className="flex items-center space-x-2 bg-gray-50 rounded-lg px-3 py-2 border border-gray-200"
        >
          <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
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
          
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {item.name}
            </p>
            <p className="text-xs text-gray-500">
              {(item.size / 1024 / 1024).toFixed(1)} MB
            </p>
          </div>
          
          {showRemoveButton && onRemove && (
            <button
              onClick={() => onRemove(item.id)}
              className="p-1 text-gray-400 hover:text-red-500 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      ))}
      
      {remainingCount > 0 && (
        <div className="flex items-center space-x-2 bg-blue-50 rounded-lg px-3 py-2 border border-blue-200">
          <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
            <span className="text-blue-600 text-sm font-medium">+{remainingCount}</span>
          </div>
          <span className="text-sm text-blue-600 font-medium">
            {remainingCount} autre(s)
          </span>
        </div>
      )}
    </div>
  )
} 