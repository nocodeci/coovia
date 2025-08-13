import axios from 'axios'

const API_BASE_URL = 'http://localhost:8000/api'

export interface MediaItem {
  id: string
  store_id: string
  name: string
  type: 'image' | 'video' | 'document' | 'audio'
  size: number
  url: string
  thumbnail?: string
  mime_type: string
  metadata: any
  created_at: string
  updated_at: string
}

export interface MediaStats {
  total_files: number
  total_size: number
  storage_limit: number
  files_by_type: {
    image: number
    video: number
    document: number
    audio: number
  }
}

export interface MediaResponse {
  success: boolean
  data: {
    data: MediaItem[]
    current_page: number
    last_page: number
    per_page: number
    total: number
  }
  stats: MediaStats
}

export interface UploadResponse {
  success: boolean
  message: string
  data: MediaItem[]
}

class MediaService {
  private getAuthHeaders() {
    const token = localStorage.getItem('auth_token')
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    }
  }

  private getJsonHeaders() {
    const token = localStorage.getItem('auth_token')
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
  }

  /**
   * Récupérer tous les médias d'un store
   */
  async getMedia(storeId: string, params?: {
    search?: string
    type?: string
    sort_by?: string
    sort_order?: 'asc' | 'desc'
    per_page?: number
  }): Promise<MediaResponse> {
    try {
      const response = await axios.get(`${API_BASE_URL}/public/stores/${storeId}/media`, {
        params
      })
      return response.data
    } catch (error) {
      console.error('Erreur lors de la récupération des médias:', error)
      throw error
    }
  }

  /**
   * Upload de fichiers
   */
  async uploadMedia(storeId: string, files: File[], onProgress?: (progress: number) => void): Promise<UploadResponse> {
    try {
      const formData = new FormData()
      files.forEach(file => {
        formData.append('files[]', file)
      })

      const response = await axios.post(`${API_BASE_URL}/public/stores/${storeId}/media`, formData, {
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1))
          if (onProgress) {
            onProgress(percentCompleted)
          }
          console.log('Upload progress:', percentCompleted)
        }
      })
      return response.data
    } catch (error) {
      console.error('Erreur lors de l\'upload:', error)
      throw error
    }
  }

  /**
   * Supprimer un média
   */
  async deleteMedia(storeId: string, mediaId: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await axios.delete(`${API_BASE_URL}/public/stores/${storeId}/media/${mediaId}`)
      return response.data
    } catch (error) {
      console.error('Erreur lors de la suppression:', error)
      throw error
    }
  }

  /**
   * Mettre à jour un média
   */
  async updateMedia(storeId: string, mediaId: string, data: { name: string }): Promise<{ success: boolean; data: MediaItem }> {
    try {
      const response = await axios.put(`${API_BASE_URL}/public/stores/${storeId}/media/${mediaId}`, data)
      return response.data
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error)
      throw error
    }
  }

  /**
   * Obtenir l'URL complète d'un fichier
   */
  getFileUrl(url: string): string {
    return `${API_BASE_URL.replace('/api', '')}/storage/${url}`
  }

  /**
   * Obtenir l'URL complète d'une thumbnail
   */
  getThumbnailUrl(thumbnail: string): string {
    return `${API_BASE_URL.replace('/api', '')}/storage/${thumbnail}`
  }

  /**
   * Formater la taille d'un fichier
   */
  formatFileSize(bytes: number): string {
    const units = ['B', 'KB', 'MB', 'GB']
    let size = bytes
    let unitIndex = 0

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024
      unitIndex++
    }

    return `${size.toFixed(1)} ${units[unitIndex]}`
  }

  /**
   * Obtenir le type de fichier à partir du MIME type
   */
  getFileType(mimeType: string): 'image' | 'video' | 'document' | 'audio' {
    if (mimeType.startsWith('image/')) return 'image'
    if (mimeType.startsWith('video/')) return 'video'
    if (mimeType.startsWith('audio/')) return 'audio'
    return 'document'
  }
}

export const mediaService = new MediaService() 