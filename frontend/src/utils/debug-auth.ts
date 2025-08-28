/**
 * Script de debug pour vérifier l'état d'authentification
 */

import { cache, CACHE_KEYS } from '@/lib/cache'

/**
 * Affiche toutes les informations de debug sur l'authentification
 */
export const debugAuth = () => {
  console.log('🔍 === DEBUG AUTHENTIFICATION ===')
  
  // Vérifier localStorage
  const token = localStorage.getItem('sanctum_token')
  const selectedStoreId = localStorage.getItem('selectedStoreId')
  
  console.log('🔑 Token:', token ? `${token.substring(0, 20)}...` : 'AUCUN')
  console.log('🏪 Store sélectionné:', selectedStoreId || 'AUCUN')
  
  // Vérifier le cache
  const cachedUser = cache.get(CACHE_KEYS.USER)
  const cachedStores = cache.get(CACHE_KEYS.STORES)
  
  console.log('👤 Utilisateur en cache:', cachedUser ? 'OUI' : 'NON')
  console.log('🏪 Boutiques en cache:', cachedStores ? `${cachedStores.length} boutiques` : 'AUCUNE')
  
  // Vérifier isAuthenticated
  const isAuth = !!(token && cachedUser)
  console.log('🔐 Est authentifié:', isAuth)
  
  // Vérifier la taille du localStorage
  console.log('📦 Taille localStorage:', localStorage.length)
  
  // Lister toutes les clés localStorage
  const allKeys = []
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key) allKeys.push(key)
  }
  console.log('🔑 Clés localStorage:', allKeys)
  
  console.log('🔍 === FIN DEBUG ===')
  
  return {
    token: !!token,
    user: !!cachedUser,
    stores: !!cachedStores,
    isAuthenticated: isAuth,
    localStorageKeys: allKeys
  }
}

/**
 * Force la redirection vers la page de connexion
 */
export const forceRedirectToLogin = () => {
  console.log('🔄 Force redirection vers /sign-in...')
  
  // Vider tous les caches
  localStorage.clear()
  sessionStorage.clear()
  
  // Rediriger
  if (typeof window !== 'undefined') {
    window.location.href = '/sign-in'
  }
}

/**
 * Test de la fonction isAuthenticated
 */
export const testIsAuthenticated = () => {
  const token = localStorage.getItem('sanctum_token')
  const user = cache.get(CACHE_KEYS.USER)
  
  console.log('🧪 Test isAuthenticated:')
  console.log('  - Token présent:', !!token)
  console.log('  - User en cache:', !!user)
  console.log('  - Résultat:', !!(token && user))
  
  return !!(token && user)
}
