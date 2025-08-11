export const env = {
  // Configuration de l'API
  API_URL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  
  // Configuration Auth.js
  AUTH_SECRET: import.meta.env.VITE_AUTH_SECRET || 'your-super-secret-key-here-change-in-production',
  AUTH_URL: import.meta.env.VITE_AUTH_URL || 'http://localhost:5173',
  
  // Configuration de l'application
  APP_NAME: import.meta.env.VITE_APP_NAME || 'Coovia',
  APP_VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',
  
  // Mode de développement
  IS_DEV: import.meta.env.DEV,
  IS_PROD: import.meta.env.PROD,
} as const
