// Configuration automatique de l'environnement
export const environment = {
  // Détection automatique de l'environnement
  isDevelopment: import.meta.env.DEV || window.location.hostname === 'localhost',
  isProduction: import.meta.env.PROD || window.location.hostname === 'wozif.com',
  
  // URLs d'API selon l'environnement
  apiUrl: (() => {
    if (import.meta.env.DEV || window.location.hostname === 'localhost') {
      return 'http://localhost:8000'; // Backend local
    } else {
      return 'https://api.wozif.com'; // API de production
    }
  })(),
  
  // Configuration Cloudflare
  cloudflare: {
    uploadUrl: (() => {
      if (import.meta.env.DEV || window.location.hostname === 'localhost') {
        return 'http://localhost:8000/api/cloudflare/upload'; // Backend local
      } else {
        return 'https://api.wozif.com/api/cloudflare/upload'; // API de production
      }
    })(),
  },
  
  // Logs de debug
  debug: (() => {
    if (import.meta.env.DEV || window.location.hostname === 'localhost') {
      return true; // Debug activé en local
    } else {
      return false; // Debug désactivé en production
    }
  })(),
};

// Log de l'environnement détecté
if (environment.debug) {
  console.log('🌍 Environnement détecté:', {
    isDevelopment: environment.isDevelopment,
    isProduction: environment.isProduction,
    apiUrl: environment.apiUrl,
    cloudflareUploadUrl: environment.cloudflare.uploadUrl,
    hostname: window.location.hostname,
    dev: import.meta.env.DEV,
    prod: import.meta.env.PROD
  });
}

export default environment;
