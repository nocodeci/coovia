import { APP_CONFIG } from './app'

export const auth0Config = {
  domain: APP_CONFIG.auth0.domain,
  clientId: APP_CONFIG.auth0.clientId,
  clientSecret: 'GJuJcYYEHIw9xwLCn_RUV1B6QTvG2mgUgf9aECPJs4zhcBWsJ0UpK1ZPLFeK6wu8', // À déplacer en variable d'environnement en production
  callbackUrl: `${APP_CONFIG.appUrl}/callback`,
  logoutUrl: APP_CONFIG.appUrl,
  apiAudience: APP_CONFIG.auth0.audience,
  scope: APP_CONFIG.auth0.scope,
  responseType: 'code' as const,
  responseMode: 'query' as const,
}

export const auth0Roles = {
  ADMIN: 'admin',
  SUPER_ADMIN: 'super_admin',
  MANAGER: 'manager',
  STORE_OWNER: 'store_owner',
  CUSTOMER: 'customer',
  GUEST: 'guest'
} as const

export const auth0Permissions = {
  // Gestion des boutiques
  READ_STORES: 'read:stores',
  WRITE_STORES: 'write:stores',
  DELETE_STORES: 'delete:stores',
  
  // Gestion des produits
  READ_PRODUCTS: 'read:products',
  WRITE_PRODUCTS: 'write:products',
  DELETE_PRODUCTS: 'delete:products',
  
  // Gestion des commandes
  READ_ORDERS: 'read:orders',
  WRITE_ORDERS: 'write:orders',
  DELETE_ORDERS: 'delete:orders',
  
  // Gestion des clients
  READ_CUSTOMERS: 'read:customers',
  WRITE_CUSTOMERS: 'write:customers',
  DELETE_CUSTOMERS: 'delete:customers',
  
  // Gestion des utilisateurs
  READ_USERS: 'read:users',
  WRITE_USERS: 'write:users',
  DELETE_USERS: 'delete:users',
  
  // Analytics et rapports
  READ_ANALYTICS: 'read:analytics',
  WRITE_ANALYTICS: 'write:analytics',
  
  // Configuration système
  READ_CONFIG: 'read:config',
  WRITE_CONFIG: 'write:config'
} as const

export const rolePermissions = {
  [auth0Roles.SUPER_ADMIN]: Object.values(auth0Permissions),
  [auth0Roles.ADMIN]: [
    auth0Permissions.READ_STORES,
    auth0Permissions.WRITE_STORES,
    auth0Permissions.READ_PRODUCTS,
    auth0Permissions.WRITE_PRODUCTS,
    auth0Permissions.READ_ORDERS,
    auth0Permissions.WRITE_ORDERS,
    auth0Permissions.READ_CUSTOMERS,
    auth0Permissions.WRITE_CUSTOMERS,
    auth0Permissions.READ_USERS,
    auth0Permissions.READ_ANALYTICS,
    auth0Permissions.READ_CONFIG
  ],
  [auth0Roles.MANAGER]: [
    auth0Permissions.READ_STORES,
    auth0Permissions.READ_PRODUCTS,
    auth0Permissions.WRITE_PRODUCTS,
    auth0Permissions.READ_ORDERS,
    auth0Permissions.WRITE_ORDERS,
    auth0Permissions.READ_CUSTOMERS,
    auth0Permissions.READ_ANALYTICS
  ],
  [auth0Roles.STORE_OWNER]: [
    auth0Permissions.READ_STORES,
    auth0Permissions.WRITE_STORES,
    auth0Permissions.READ_PRODUCTS,
    auth0Permissions.WRITE_PRODUCTS,
    auth0Permissions.READ_ORDERS,
    auth0Permissions.WRITE_ORDERS,
    auth0Permissions.READ_CUSTOMERS,
    auth0Permissions.READ_ANALYTICS
  ],
  [auth0Roles.CUSTOMER]: [
    auth0Permissions.READ_PRODUCTS,
    auth0Permissions.READ_ORDERS,
    auth0Permissions.WRITE_ORDERS
  ],
  [auth0Roles.GUEST]: [
    auth0Permissions.READ_PRODUCTS
  ]
} as const

export type Auth0Role = typeof auth0Roles[keyof typeof auth0Roles]
export type Auth0Permission = typeof auth0Permissions[keyof typeof auth0Permissions]
