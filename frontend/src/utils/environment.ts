/**
 * Configuration des environnements
 */

// Détecter l'environnement
const isDevelopment = process.env.NODE_ENV === 'development'
const isProduction = process.env.NODE_ENV === 'production'

// URLs de base selon l'environnement
export const API_BASE_URL = isDevelopment 
  ? 'http://localhost:8000' 
  : 'https://api.wozif.com'

export const BOUTIQUE_CLIENT_BASE_URL = isDevelopment 
  ? 'http://localhost:3000' 
  : 'https://wozif.store'

export const FRONTEND_BASE_URL = isDevelopment 
  ? 'http://localhost:5173' 
  : 'https://app.wozif.com'

// Configuration de l'environnement
export const ENV_CONFIG = {
  isDevelopment,
  isProduction,
  API_BASE_URL,
  BOUTIQUE_CLIENT_BASE_URL,
  FRONTEND_BASE_URL,
}

// Fonction pour obtenir l'URL de l'API
export function getApiUrl(endpoint: string): string {
  return `${API_BASE_URL}${endpoint}`
}

// Fonction pour obtenir l'URL de la boutique
// En développement: http://localhost:3000/{slug} (boutique-client-next)
// En production: https://{slug}.wozif.store (sous-domaines Vercel)
export function getBoutiqueUrl(slug: string): string {
  // En développement, utiliser le format localhost
  if (isDevelopment) {
    return `${BOUTIQUE_CLIENT_BASE_URL}/${slug}`
  }
  
  // En production, utiliser le format sous-domaine
  return `https://${slug}.wozif.store`
}
