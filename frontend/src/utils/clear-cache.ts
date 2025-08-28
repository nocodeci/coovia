/**
 * Utilitaires pour nettoyer le cache et forcer la reconnexion
 */

import { cache, CACHE_KEYS } from '@/lib/cache'

/**
 * Vide tous les caches et force la reconnexion
 */
export const clearAllCaches = () => {
  console.log('🧹 Nettoyage de tous les caches...')
  
  // Vider le cache des utilisateurs
  cache.delete(CACHE_KEYS.USER)
  
  // Vider le cache des boutiques
  cache.delete(CACHE_KEYS.STORES)
  
  // Vider le cache des tokens
  localStorage.removeItem('sanctum_token')
  localStorage.removeItem('selectedStoreId')
  
  // Vider le cache des stats
  const keysToDelete = []
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key && key.startsWith('store_stats_')) {
      keysToDelete.push(key)
    }
  }
  
  keysToDelete.forEach(key => {
    localStorage.removeItem(key)
    cache.delete(key)
  })
  
  console.log('✅ Tous les caches ont été vidés')
}

/**
 * Force la déconnexion et vide tous les caches
 */
export const forceLogout = () => {
  console.log('🚪 Déconnexion forcée...')
  
  // Vider tous les caches
  clearAllCaches()
  
  // Rediriger vers la page de connexion
  if (typeof window !== 'undefined') {
    window.location.href = '/sign-in'
  }
}

/**
 * Vérifie si l'utilisateur est authentifié
 */
export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem('sanctum_token')
  const user = cache.get(CACHE_KEYS.USER)
  
  return !!(token && user)
}

/**
 * Obtient le token d'authentification
 */
export const getAuthToken = (): string | null => {
  return localStorage.getItem('sanctum_token')
}
