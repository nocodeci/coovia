// Configuration des variables d'environnement
export const env = {
  // Configuration Auth0
  AUTH0_DOMAIN: import.meta.env.VITE_AUTH0_DOMAIN || 'your-tenant.auth0.com',
  AUTH0_CLIENT_ID: import.meta.env.VITE_AUTH0_CLIENT_ID || 'your_client_id_here',
  AUTH0_CLIENT_SECRET: import.meta.env.VITE_AUTH0_CLIENT_SECRET || 'your_client_secret_here',
  AUTH0_CALLBACK_URL: import.meta.env.VITE_AUTH0_CALLBACK_URL || 'http://localhost:3000/callback',
  AUTH0_LOGOUT_URL: import.meta.env.VITE_AUTH0_LOGOUT_URL || 'http://localhost:3000',
  API_AUDIENCE: import.meta.env.VITE_API_AUDIENCE || 'https://api.coovia.com',

  // Configuration de l'application
  APP_NAME: import.meta.env.VITE_APP_NAME || 'Wozif',
  APP_VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',
  APP_ENV: import.meta.env.VITE_APP_ENV || 'development',

  // Configuration API
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'https://api.wozif.com/api',
  API_TIMEOUT: parseInt(import.meta.env.VITE_API_TIMEOUT || '30000'),

  // Configuration des fonctionnalités
  ENABLE_ANALYTICS: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
  ENABLE_DEBUG: import.meta.env.VITE_ENABLE_DEBUG === 'true',
  ENABLE_SENTRY: import.meta.env.VITE_ENABLE_SENTRY === 'true',

  // Configuration Sentry (optionnel)
  SENTRY_DSN: import.meta.env.VITE_SENTRY_DSN || '',
  SENTRY_ENVIRONMENT: import.meta.env.VITE_SENTRY_ENVIRONMENT || 'development',

  // Configuration Cloudflare (optionnel)
  CLOUDFLARE_ACCOUNT_ID: import.meta.env.VITE_CLOUDFLARE_ACCOUNT_ID || '',
  CLOUDFLARE_API_TOKEN: import.meta.env.VITE_CLOUDFLARE_API_TOKEN || '',

  // Configuration des paiements (optionnel)
  STRIPE_PUBLISHABLE_KEY: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '',
  PAYPAL_CLIENT_ID: import.meta.env.VITE_PAYPAL_CLIENT_ID || '',

  // Configuration des fonctionnalités avancées
  ENABLE_MFA: import.meta.env.VITE_ENABLE_MFA === 'true',
  ENABLE_SSO: import.meta.env.VITE_ENABLE_SSO === 'true',
  ENABLE_ROLE_BASED_ACCESS: import.meta.env.VITE_ENABLE_ROLE_BASED_ACCESS !== 'false',
} as const

// Types pour les variables d'environnement
export type Environment = typeof env
export type EnvironmentKey = keyof Environment

// Vérification de la configuration
export function validateEnvironment(): { isValid: boolean; errors: string[] } {
  const errors: string[] = []
  const required = [
    'AUTH0_DOMAIN',
    'AUTH0_CLIENT_ID',
    'AUTH0_CLIENT_SECRET',
    'AUTH0_CALLBACK_URL',
    'API_AUDIENCE'
  ]

  required.forEach(key => {
    const value = env[key as EnvironmentKey]
    if (!value || value.includes('your-') || value.includes('localhost')) {
      errors.push(`${key} n'est pas configuré correctement`)
    }
  })

  return {
    isValid: errors.length === 0,
    errors
  }
}

// Configuration de développement
export const isDevelopment = env.APP_ENV === 'development'
export const isProduction = env.APP_ENV === 'production'
export const isTest = env.APP_ENV === 'test'

// Configuration des fonctionnalités conditionnelles
export const features = {
  auth: {
    enabled: true,
    mfa: env.ENABLE_MFA,
    sso: env.ENABLE_SSO,
    roleBasedAccess: env.ENABLE_ROLE_BASED_ACCESS
  },
  api: {
    baseUrl: env.API_BASE_URL,
    timeout: env.API_TIMEOUT,
    retryAttempts: 3
  },
  monitoring: {
    sentry: env.ENABLE_SENTRY,
    analytics: env.ENABLE_ANALYTICS,
    debug: env.ENABLE_DEBUG
  }
} as const

// Messages d'aide pour la configuration
export const configHelp = {
  AUTH0_DOMAIN: 'Votre domaine Auth0 (ex: myapp.auth0.com)',
  AUTH0_CLIENT_ID: 'ID client de votre application Auth0',
  AUTH0_CLIENT_SECRET: 'Secret client de votre application Auth0',
  AUTH0_CALLBACK_URL: 'URL de callback après authentification',
  API_AUDIENCE: 'Audience de votre API (ex: https://api.coovia.com)',
  API_BASE_URL: 'URL de base de votre API backend'
}

// Fonction pour obtenir l'aide de configuration
export function getConfigHelp(key: EnvironmentKey): string {
  return configHelp[key] || 'Aucune aide disponible pour cette configuration'
}

// Fonction pour vérifier si une fonctionnalité est activée
export function isFeatureEnabled(feature: keyof typeof features): boolean {
  return features[feature]?.enabled !== false
}

// Fonction pour obtenir la configuration d'une fonctionnalité
export function getFeatureConfig<T extends keyof typeof features>(
  feature: T
): typeof features[T] {
  return features[feature]
}
