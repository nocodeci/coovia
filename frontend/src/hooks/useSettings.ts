import { useState, useEffect } from 'react'
import apiService from '@/lib/api'

export interface Settings {
  [key: string]: any
}

export interface UserProfile {
  id?: number
  user_id: string
  first_name?: string
  last_name?: string
  display_name?: string
  bio?: string
  avatar?: string
  cover_image?: string
  website?: string
  company?: string
  job_title?: string
  location?: string
  timezone?: string
  language?: string
  currency?: string
  social_links?: {
    linkedin?: string
    twitter?: string
    facebook?: string
    instagram?: string
    youtube?: string
  }
  preferences?: {
    notifications?: {
      email: boolean
      sms: boolean
      push: boolean
    }
    privacy?: {
      profile_visible: boolean
      show_email: boolean
      show_phone: boolean
    }
    theme?: 'light' | 'dark' | 'auto'
  }
  address?: {
    street?: string
    city?: string
    state?: string
    country?: string
    postal_code?: string
  }
  birth_date?: string
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say'
  nationality?: string
  id_number?: string
  tax_id?: string
  is_verified?: boolean
  verified_at?: string
  created_at?: string
  updated_at?: string
}

export interface StoreSettings {
  [key: string]: any
}

interface ApiResponse<T = any> {
  success: boolean
  message: string
  data?: T
  error?: string
}

// Hook pour les paramètres globaux
export function useGlobalSettings() {
  const [settings, setSettings] = useState<Settings>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchPublicSettings()
  }, [])

  const fetchPublicSettings = async () => {
    try {
      setLoading(true)
      const response = await apiService.get('/settings/public') as ApiResponse<Settings>
      if (response.success) {
        setSettings(response.data || {})
      } else {
        setError(response.message || 'Erreur lors du chargement des paramètres')
      }
    } catch (err) {
      setError('Erreur de connexion')
      console.error('Erreur lors du chargement des paramètres:', err)
    } finally {
      setLoading(false)
    }
  }

  const getSetting = (key: string, defaultValue: any = null) => {
    return settings[key] ?? defaultValue
  }

  const refreshSettings = () => {
    fetchPublicSettings()
  }

  return {
    settings,
    loading,
    error,
    getSetting,
    refreshSettings
  }
}

// Hook pour les paramètres par groupe
export function useSettingsByGroup(group: string) {
  const [settings, setSettings] = useState<Settings>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (group) {
      fetchSettingsByGroup()
    }
  }, [group])

  const fetchSettingsByGroup = async () => {
    try {
      setLoading(true)
      const response = await apiService.get(`/settings/by-group?group=${group}`) as ApiResponse<Settings>
      if (response.success) {
        setSettings(response.data || {})
      } else {
        setError(response.message || 'Erreur lors du chargement des paramètres')
      }
    } catch (err) {
      setError('Erreur de connexion')
      console.error('Erreur lors du chargement des paramètres:', err)
    } finally {
      setLoading(false)
    }
  }

  const getSetting = (key: string, defaultValue: any = null) => {
    return settings[key] ?? defaultValue
  }

  const refreshSettings = () => {
    fetchSettingsByGroup()
  }

  return {
    settings,
    loading,
    error,
    getSetting,
    refreshSettings
  }
}

// Hook pour le profil utilisateur
export function useUserProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      setLoading(true)
      const response = await apiService.get('/profile') as ApiResponse<{ profile: UserProfile }>
      if (response.success && response.data) {
        setProfile(response.data.profile)
      } else {
        setError(response.message || 'Erreur lors du chargement du profil')
      }
    } catch (err) {
      setError('Erreur de connexion')
      console.error('Erreur lors du chargement du profil:', err)
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async (profileData: Partial<UserProfile>) => {
    try {
      setLoading(true)
      const response = await apiService.put('/profile', profileData) as ApiResponse<UserProfile>
      if (response.success && response.data) {
        setProfile(response.data)
        return { success: true, data: response.data }
      } else {
        setError(response.message || 'Erreur lors de la mise à jour du profil')
        return { success: false, error: response.message }
      }
    } catch (err) {
      const errorMsg = 'Erreur de connexion'
      setError(errorMsg)
      console.error('Erreur lors de la mise à jour du profil:', err)
      return { success: false, error: errorMsg }
    } finally {
      setLoading(false)
    }
  }

  const uploadAvatar = async (file: File) => {
    try {
      setLoading(true)
      const formData = new FormData()
      formData.append('avatar', file)

      const response = await apiService.post('/profile/avatar', formData) as ApiResponse<{ avatar_path: string }>

      if (response.success && response.data) {
        // Mettre à jour le profil avec la nouvelle URL d'avatar
        if (profile) {
          setProfile({
            ...profile,
            avatar: response.data.avatar_path
          })
        }
        return { success: true, data: response.data }
      } else {
        setError(response.message || 'Erreur lors de l\'upload de l\'avatar')
        return { success: false, error: response.message }
      }
    } catch (err) {
      const errorMsg = 'Erreur de connexion'
      setError(errorMsg)
      console.error('Erreur lors de l\'upload de l\'avatar:', err)
      return { success: false, error: errorMsg }
    } finally {
      setLoading(false)
    }
  }

  const uploadCoverImage = async (file: File) => {
    try {
      setLoading(true)
      const formData = new FormData()
      formData.append('cover_image', file)

      const response = await apiService.post('/profile/cover-image', formData) as ApiResponse<{ cover_image_path: string }>

      if (response.success && response.data) {
        // Mettre à jour le profil avec la nouvelle URL d'image de couverture
        if (profile) {
          setProfile({
            ...profile,
            cover_image: response.data.cover_image_path
          })
        }
        return { success: true, data: response.data }
      } else {
        setError(response.message || 'Erreur lors de l\'upload de l\'image de couverture')
        return { success: false, error: response.message }
      }
    } catch (err) {
      const errorMsg = 'Erreur de connexion'
      setError(errorMsg)
      console.error('Erreur lors de l\'upload de l\'image de couverture:', err)
      return { success: false, error: errorMsg }
    } finally {
      setLoading(false)
    }
  }

  const updatePreferences = async (preferences: UserProfile['preferences']) => {
    try {
      setLoading(true)
      const response = await apiService.put('/profile/preferences', { preferences }) as ApiResponse<UserProfile['preferences']>
      if (response.success && response.data) {
        // Mettre à jour le profil avec les nouvelles préférences
        if (profile) {
          setProfile({
            ...profile,
            preferences: response.data
          })
        }
        return { success: true, data: response.data }
      } else {
        setError(response.message || 'Erreur lors de la mise à jour des préférences')
        return { success: false, error: response.message }
      }
    } catch (err) {
      const errorMsg = 'Erreur de connexion'
      setError(errorMsg)
      console.error('Erreur lors de la mise à jour des préférences:', err)
      return { success: false, error: errorMsg }
    } finally {
      setLoading(false)
    }
  }

  const refreshProfile = () => {
    fetchProfile()
  }

  return {
    profile,
    loading,
    error,
    updateProfile,
    uploadAvatar,
    uploadCoverImage,
    updatePreferences,
    refreshProfile
  }
}

// Hook pour les paramètres des boutiques
export function useStoreSettings(storeId: string) {
  const [settings, setSettings] = useState<StoreSettings>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (storeId) {
      fetchStoreSettings()
    }
  }, [storeId])

  const fetchStoreSettings = async () => {
    try {
      setLoading(true)
      const response = await apiService.get(`/store-settings/${storeId}`) as ApiResponse<StoreSettings>
      if (response.success) {
        setSettings(response.data || {})
      } else {
        setError(response.message || 'Erreur lors du chargement des paramètres de la boutique')
      }
    } catch (err) {
      setError('Erreur de connexion')
      console.error('Erreur lors du chargement des paramètres de la boutique:', err)
    } finally {
      setLoading(false)
    }
  }

  const getSetting = (key: string, defaultValue: any = null) => {
    return settings[key] ?? defaultValue
  }

  const setSetting = async (key: string, value: any, type: string = 'string', group: string = 'general', description?: string) => {
    try {
      setLoading(true)
      const response = await apiService.post(`/store-settings/${storeId}/set`, {
        key,
        value,
        type,
        group,
        description
      }) as ApiResponse<any>

      if (response.success) {
        // Mettre à jour les paramètres locaux
        setSettings(prev => ({
          ...prev,
          [key]: value
        }))
        return { success: true, data: response.data }
      } else {
        setError(response.message || 'Erreur lors de la mise à jour du paramètre')
        return { success: false, error: response.message }
      }
    } catch (err) {
      const errorMsg = 'Erreur de connexion'
      setError(errorMsg)
      console.error('Erreur lors de la mise à jour du paramètre:', err)
      return { success: false, error: errorMsg }
    } finally {
      setLoading(false)
    }
  }

  const updateMultipleSettings = async (settingsData: Array<{
    key: string
    value: any
    type: string
    group: string
    description?: string
  }>) => {
    try {
      setLoading(true)
      const response = await apiService.post(`/store-settings/${storeId}/update-multiple`, {
        settings: settingsData
      }) as ApiResponse<any>

      if (response.success) {
        // Mettre à jour les paramètres locaux
        const newSettings = { ...settings }
        settingsData.forEach(setting => {
          newSettings[setting.key] = setting.value
        })
        setSettings(newSettings)
        return { success: true, data: response.data }
      } else {
        setError(response.message || 'Erreur lors de la mise à jour des paramètres')
        return { success: false, error: response.message }
      }
    } catch (err) {
      const errorMsg = 'Erreur de connexion'
      setError(errorMsg)
      console.error('Erreur lors de la mise à jour des paramètres:', err)
      return { success: false, error: errorMsg }
    } finally {
      setLoading(false)
    }
  }

  const deleteSetting = async (key: string) => {
    try {
      setLoading(true)
      const response = await apiService.delete(`/store-settings/${storeId}/delete`, {
        body: JSON.stringify({ key })
      }) as ApiResponse<any>

      if (response.success) {
        // Supprimer le paramètre des paramètres locaux
        const newSettings = { ...settings }
        delete newSettings[key]
        setSettings(newSettings)
        return { success: true }
      } else {
        setError(response.message || 'Erreur lors de la suppression du paramètre')
        return { success: false, error: response.message }
      }
    } catch (err) {
      const errorMsg = 'Erreur de connexion'
      setError(errorMsg)
      console.error('Erreur lors de la suppression du paramètre:', err)
      return { success: false, error: errorMsg }
    } finally {
      setLoading(false)
    }
  }

  const initializeDefaults = async () => {
    try {
      setLoading(true)
      const response = await apiService.post(`/store-settings/${storeId}/initialize-defaults`) as ApiResponse<any>
      if (response.success) {
        // Recharger les paramètres
        await fetchStoreSettings()
        return { success: true }
      } else {
        setError(response.message || 'Erreur lors de l\'initialisation des paramètres par défaut')
        return { success: false, error: response.message }
      }
    } catch (err) {
      const errorMsg = 'Erreur de connexion'
      setError(errorMsg)
      console.error('Erreur lors de l\'initialisation des paramètres par défaut:', err)
      return { success: false, error: errorMsg }
    } finally {
      setLoading(false)
    }
  }

  const refreshSettings = () => {
    fetchStoreSettings()
  }

  return {
    settings,
    loading,
    error,
    getSetting,
    setSetting,
    updateMultipleSettings,
    deleteSetting,
    initializeDefaults,
    refreshSettings
  }
}

// Hook pour les paramètres de boutique par groupe
export function useStoreSettingsByGroup(storeId: string, group: string) {
  const [settings, setSettings] = useState<StoreSettings>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (storeId && group) {
      fetchStoreSettingsByGroup()
    }
  }, [storeId, group])

  const fetchStoreSettingsByGroup = async () => {
    try {
      setLoading(true)
      const response = await apiService.get(`/store-settings/${storeId}/by-group?group=${group}`) as ApiResponse<StoreSettings>
      if (response.success) {
        setSettings(response.data || {})
      } else {
        setError(response.message || 'Erreur lors du chargement des paramètres de la boutique')
      }
    } catch (err) {
      setError('Erreur de connexion')
      console.error('Erreur lors du chargement des paramètres de la boutique:', err)
    } finally {
      setLoading(false)
    }
  }

  const getSetting = (key: string, defaultValue: any = null) => {
    return settings[key] ?? defaultValue
  }

  const refreshSettings = () => {
    fetchStoreSettingsByGroup()
  }

  return {
    settings,
    loading,
    error,
    getSetting,
    refreshSettings
  }
}
