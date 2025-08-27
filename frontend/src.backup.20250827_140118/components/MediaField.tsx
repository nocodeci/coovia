import React, { useState } from 'react'
import { Image, Plus, X } from 'lucide-react'
import { MediaItem } from '@/services/mediaService'
import MediaSelector from './MediaSelector'
import MediaDisplay from './MediaDisplay'

interface MediaFieldProps {
  label: string
  value: MediaItem[]
  onChange: (media: MediaItem[]) => void
  storeId: string
  allowMultiple?: boolean
  maxItems?: number
  placeholder?: string
  className?: string
}

export default function MediaField({
  label,
  value,
  onChange,
  storeId,
  allowMultiple = true,
  maxItems,
  placeholder = "Sélectionner des médias",
  className = ""
}: MediaFieldProps) {
  const [isSelectorOpen, setIsSelectorOpen] = useState(false)

  const handleAddMedia = (media: MediaItem) => {
    if (allowMultiple) {
      // Vérifier si le média n'est pas déjà sélectionné
      const isAlreadySelected = value.some(item => item.id === media.id)
      if (!isAlreadySelected) {
        // Vérifier la limite maximale
        if (maxItems && value.length >= maxItems) {
          alert(`Vous ne pouvez sélectionner que ${maxItems} média(x) maximum`)
          return
        }
        onChange([...value, media])
      }
    } else {
      // Mode sélection unique
      onChange([media])
    }
  }

  const handleRemoveMedia = (mediaId: string) => {
    onChange(value.filter(item => item.id !== mediaId))
  }

  const handleOpenSelector = () => {
    if (maxItems && value.length >= maxItems) {
      alert(`Vous ne pouvez sélectionner que ${maxItems} média(x) maximum`)
      return
    }
    setIsSelectorOpen(true)
  }

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
        {maxItems && (
          <span className="text-gray-500 ml-1">
            ({value.length}/{maxItems})
          </span>
        )}
      </label>

      {/* Bouton pour ouvrir le sélecteur */}
      <button
        type="button"
        onClick={handleOpenSelector}
        disabled={maxItems ? value.length >= maxItems : false}
        className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <div className="flex items-center justify-center space-x-2">
          <Image className="w-5 h-5 text-gray-400" />
          <span className="text-gray-600">{placeholder}</span>
          <Plus className="w-4 h-4 text-gray-400" />
        </div>
      </button>

      {/* Affichage des médias sélectionnés */}
      {value.length > 0 && (
        <div className="mt-4">
          <MediaDisplay
            media={value}
            onRemove={handleRemoveMedia}
            maxDisplay={5}
            showRemoveButton={true}
          />
        </div>
      )}

      {/* Sélecteur de médias */}
      <MediaSelector
        isOpen={isSelectorOpen}
        onClose={() => setIsSelectorOpen(false)}
        onSelect={handleAddMedia}
        storeId={storeId}
        title={allowMultiple ? "Sélectionner des médias" : "Sélectionner un média"}
        allowMultiple={allowMultiple}
      />
    </div>
  )
} 