export interface MediaFile {
  id: string
  name: string
  type: 'image' | 'video' | 'document' | 'audio'
  size: number
  url: string
  thumbnail?: string
  uploadedAt: Date
  lastModified: Date
  mimeType: string
}

export interface MediaStats {
  totalFiles: number
  totalSize: number
  storageLimit: number
  filesByType: {
    image: number
    video: number
    document: number
    audio: number
  }
}

export interface MediaFiltersProps {
  searchTerm: string
  onSearchChange: (term: string) => void
  selectedType: MediaFile['type'] | 'all'
  onTypeChange: (type: MediaFile['type'] | 'all') => void
  viewMode: 'grid' | 'list'
  onViewModeChange: (mode: 'grid' | 'list') => void
  sortBy: 'name' | 'date' | 'size'
  onSortChange: (sort: 'name' | 'date' | 'size') => void
  totalFiles: number
  selectedCount: number
}

export interface MediaGridProps {
  files: MediaFile[]
  onDelete: (fileId: string) => void
  onRename: (fileId: string, newName: string) => void
  onDownload: (file: MediaFile) => void
  selectedFiles: string[]
  onSelectFile: (fileId: string) => void
}

export interface MediaUploadProps {
  onFilesUploaded: (files: File[]) => void
}

export interface MediaStatsComponentProps {
  stats: MediaStats
} 