// Configuration de l'API
export const API_CONFIG = {
  // URL de base de l'API Laravel
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',

  // Configuration Sanctum
  SANCTUM: {
    STATEFUL_DOMAINS: import.meta.env.VITE_SANCTUM_STATEFUL_DOMAINS || 'localhost:3000,localhost:5173',
    TOKEN_NAME: 'sanctum_token',
    TOKEN_PREFIX: 'Bearer',
  },

  // Timeouts et tentatives
  TIMEOUT: 10000, // 10 secondes
  RETRY_ATTEMPTS: 3,

  // Headers par défaut
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },

  // Endpoints d'authentification
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      LOGOUT: '/auth/logout',
      LOGOUT_ALL: '/auth/logout-all',
      ME: '/auth/me',
      CHECK: '/auth/check',
      REFRESH: '/auth/refresh',
      VERIFY_MFA: '/auth/verify-mfa',
      SETUP_MFA: '/auth/setup',
      ENABLE_MFA: '/auth/enable',
      DISABLE_MFA: '/auth/disable',
      BACKUP_CODES: '/auth/backup-codes',
    },
    USER: {
      PROFILE: '/user/profile',
      UPDATE: '/user/update',
      PASSWORD: '/user/password',
      AVATAR: '/user/avatar',
    },
  },

  // Codes de statut HTTP
  STATUS_CODES: {
    SUCCESS: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    VALIDATION_ERROR: 422,
    SERVER_ERROR: 500,
  },
} as const;

// Types pour la configuration
export type ApiEndpoint = typeof API_CONFIG.ENDPOINTS;
export type StatusCode = typeof API_CONFIG.STATUS_CODES[keyof typeof API_CONFIG.STATUS_CODES];

// Fonctions utilitaires
export const buildApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

export const isSuccessStatus = (status: number): boolean => {
  return status >= 200 && status < 300;
};

export const isErrorStatus = (status: number): boolean => {
  return status >= 400;
};

export const isAuthError = (status: number): boolean => {
  return status === 401 || status === 403;
};

export const isValidationError = (status: number): boolean => {
  return status === 422;
};

export const isServerError = (status: number): boolean => {
  return status >= 500;
};

// Configuration des intercepteurs Axios
export const AXIOS_CONFIG = {
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.DEFAULT_HEADERS,
  withCredentials: true, // Important pour Sanctum
};

// Messages d'erreur par défaut
export const DEFAULT_ERROR_MESSAGES = {
  NETWORK_ERROR: 'Erreur de connexion au serveur',
  TIMEOUT_ERROR: 'La requête a pris trop de temps',
  VALIDATION_ERROR: 'Veuillez vérifier les informations saisies',
  AUTH_ERROR: 'Vous devez être connecté pour effectuer cette action',
  SERVER_ERROR: 'Erreur interne du serveur',
  UNKNOWN_ERROR: 'Une erreur inattendue s\'est produite',
} as const;
