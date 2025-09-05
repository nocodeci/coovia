// Routes qui ne nécessitent pas de vérification de boutique
export const IGNORED_STORE_PATHS = [
  "/store-selection",
  "/create-store"
] as const

// Routes publiques (sans authentification)
export const PUBLIC_ROUTES = [
  "/login",
  "/register",
  "/forgot-password"
] as const

// Routes d'authentification
export const AUTH_ROUTES = [
  "/login",
  "/register", 
  "/forgot-password",
  "/reset-password"
] as const

// Routes de boutique (nécessitent une boutique sélectionnée)
export const STORE_ROUTES = [
  "/dashboard",
  "/produits",
  "/commandes",
  "/clients",
  "/media",
  "/settings"
] as const
