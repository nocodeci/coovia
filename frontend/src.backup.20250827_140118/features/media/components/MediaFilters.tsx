import React from 'react'
import { IconSearch, IconGrid, IconList, IconFilter } from '@tabler/icons-react'
import { MediaFiltersProps } from '../types/media'

export const MediaFilters: React.FC<MediaFiltersProps> = ({
  searchTerm,
  onSearchChange,
  selectedType,
  onTypeChange,
  viewMode,
  onViewModeChange,
  sortBy,
  onSortChange,
  totalFiles,
  selectedCount
}) => {
  const fileTypes = [
    { value: 'all', label: 'Tous les types' },
    { value: 'image', label: 'Images' },
    { value: 'video', label: 'Vidéos' },
    { value: 'document', label: 'Documents' },
    { value: 'audio', label: 'Audio' }
  ]

  const sortOptions = [
    { value: 'date', label: 'Date' },
    { value: 'name', label: 'Nom' },
    { value: 'size', label: 'Taille' }
  ]

  return (
    <div className="space-y-4">
      {/* Search and View Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher des fichiers..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onViewModeChange('grid')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'grid'
                ? 'bg-blue-100 text-blue-600'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <IconGrid className="h-4 w-4" />
          </button>
          <button
            onClick={() => onViewModeChange('list')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'list'
                ? 'bg-blue-100 text-blue-600'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <IconList className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Filters and Sort */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* File Type Filter */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <IconFilter className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Type:</span>
          </div>
          <select
            value={selectedType}
            onChange={(e) => onTypeChange(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {fileTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {/* Sort Options */}
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium text-gray-700">Trier par:</span>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Results Count */}
        <div className="text-sm text-gray-500">
          {selectedCount > 0 ? (
            <span className="text-blue-600 font-medium">
              {selectedCount} sélectionné{selectedCount > 1 ? 's' : ''}
            </span>
          ) : (
            <span>{totalFiles} fichier{totalFiles > 1 ? 's' : ''}</span>
          )}
        </div>
      </div>
    </div>
  )
} 