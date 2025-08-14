/**
 * Utilitaires pour gérer les liens vers les boutiques
 */

import { API_BASE_URL, BOUTIQUE_CLIENT_BASE_URL, getApiUrl, getBoutiqueUrl } from './environment'

/**
 * Récupère le slug d'une boutique par son ID depuis l'API
 */
export async function getStoreSlug(storeId: string): Promise<string | null> {
  try {
    const response = await fetch(getApiUrl(`/api/boutique/slug/${storeId}`))
    if (response.ok) {
      const storeData = await response.json()
      return storeData.slug
    } else {
      console.error('Erreur lors de la récupération du slug de la boutique')
      return null
    }
  } catch (error) {
    console.error('Erreur lors de la récupération du slug:', error)
    return null
  }
}

/**
 * Génère l'URL complète d'une boutique basée sur son slug
 */
export function generateBoutiqueUrl(storeSlug: string): string {
  // En développement, utiliser le format localhost
  if (process.env.NODE_ENV === 'development') {
    return getBoutiqueUrl(storeSlug)
  }
  
  // En production, utiliser le format sous-domaine
  return `https://${storeSlug}.wozif.store`
}

/**
 * Ouvre une boutique dans un nouvel onglet
 */
export async function openBoutique(storeId: string): Promise<void> {
  console.log('Opening boutique with storeId:', storeId)
  
  if (!storeId) {
    console.error('storeId is undefined or null')
    return
  }
  
  try {
    const storeSlug = await getStoreSlug(storeId)
    if (storeSlug) {
      const boutiqueUrl = generateBoutiqueUrl(storeSlug)
      console.log('Boutique URL:', boutiqueUrl)
      window.open(boutiqueUrl, '_blank')
    } else {
      // Fallback vers store-123
      const fallbackUrl = generateBoutiqueUrl('store-123')
      console.log('Using fallback URL:', fallbackUrl)
      window.open(fallbackUrl, '_blank')
    }
  } catch (error) {
    console.error('Erreur lors de l\'ouverture de la boutique:', error)
    // Fallback vers store-123
    const fallbackUrl = generateBoutiqueUrl('store-123')
    window.open(fallbackUrl, '_blank')
  }
}

/**
 * URL de fallback pour les boutiques
 */
export const FALLBACK_BOUTIQUE_URL = generateBoutiqueUrl('store-123')
