import { useAuth } from '@/context/auth0-context'
import { auth0Roles, auth0Permissions, type Auth0Role, type Auth0Permission } from '@/config/auth0.config'

export function useAuth0() {
  const auth = useAuth()

  // Vérifier si l'utilisateur a un rôle spécifique
  const hasRole = (role: Auth0Role): boolean => {
    if (!auth.user) return false
    const userRoles = auth.user['https://coovia.com/roles'] || []
    return userRoles.includes(role)
  }

  // Vérifier si l'utilisateur a au moins un des rôles spécifiés
  const hasAnyRole = (roles: Auth0Role[]): boolean => {
    if (!auth.user) return false
    const userRoles = auth.user['https://coovia.com/roles'] || []
    return roles.some(role => userRoles.includes(role))
  }

  // Vérifier si l'utilisateur a tous les rôles spécifiés
  const hasAllRoles = (roles: Auth0Role[]): boolean => {
    if (!auth.user) return false
    const userRoles = auth.user['https://coovia.com/roles'] || []
    return roles.every(role => userRoles.includes(role))
  }

  // Vérifier si l'utilisateur a une permission spécifique
  const hasPermission = (permission: Auth0Permission): boolean => {
    if (!auth.user) return false
    const userPermissions = auth.user['https://coovia.com/permissions'] || []
    return userPermissions.includes(permission)
  }

  // Vérifier si l'utilisateur a au moins une des permissions spécifiées
  const hasAnyPermission = (permissions: Auth0Permission[]): boolean => {
    if (!auth.user) return false
    const userPermissions = auth.user['https://coovia.com/permissions'] || []
    return permissions.some(permission => userPermissions.includes(permission))
  }

  // Vérifier si l'utilisateur a toutes les permissions spécifiées
  const hasAllPermissions = (permissions: Auth0Permission[]): boolean => {
    if (!auth.user) return false
    const userPermissions = auth.user['https://coovia.com/permissions'] || []
    return permissions.every(permission => userPermissions.includes(permission))
  }

  // Obtenir tous les rôles de l'utilisateur
  const getUserRoles = (): Auth0Role[] => {
    if (!auth.user) return []
    return auth.user['https://coovia.com/roles'] || []
  }

  // Obtenir toutes les permissions de l'utilisateur
  const getUserPermissions = (): Auth0Permission[] => {
    if (!auth.user) return []
    return auth.user['https://coovia.com/permissions'] || []
  }

  // Vérifier si l'utilisateur est un administrateur
  const isAdmin = (): boolean => {
    return hasAnyRole([auth0Roles.ADMIN, auth0Roles.SUPER_ADMIN])
  }

  // Vérifier si l'utilisateur est un super administrateur
  const isSuperAdmin = (): boolean => {
    return hasRole(auth0Roles.SUPER_ADMIN)
  }

  // Vérifier si l'utilisateur est un manager
  const isManager = (): boolean => {
    return hasAnyRole([auth0Roles.MANAGER, auth0Roles.ADMIN, auth0Roles.SUPER_ADMIN])
  }

  // Vérifier si l'utilisateur est propriétaire de boutique
  const isStoreOwner = (): boolean => {
    return hasAnyRole([auth0Roles.STORE_OWNER, auth0Roles.ADMIN, auth0Roles.SUPER_ADMIN])
  }

  // Vérifier si l'utilisateur peut gérer les boutiques
  const canManageStores = (): boolean => {
    return hasPermission(auth0Permissions.WRITE_STORES)
  }

  // Vérifier si l'utilisateur peut gérer les produits
  const canManageProducts = (): boolean => {
    return hasPermission(auth0Permissions.WRITE_PRODUCTS)
  }

  // Vérifier si l'utilisateur peut gérer les commandes
  const canManageOrders = (): boolean => {
    return hasPermission(auth0Permissions.WRITE_ORDERS)
  }

  // Vérifier si l'utilisateur peut gérer les clients
  const canManageCustomers = (): boolean => {
    return hasPermission(auth0Permissions.WRITE_CUSTOMERS)
  }

  // Vérifier si l'utilisateur peut gérer les utilisateurs
  const canManageUsers = (): boolean => {
    return hasPermission(auth0Permissions.WRITE_USERS)
  }

  // Vérifier si l'utilisateur peut voir les analytics
  const canViewAnalytics = (): boolean => {
    return hasPermission(auth0Permissions.READ_ANALYTICS)
  }

  // Obtenir le nom d'affichage de l'utilisateur
  const getDisplayName = (): string => {
    if (!auth.user) return 'Utilisateur'
    return auth.user.name || auth.user.email || 'Utilisateur'
  }

  // Obtenir l'email de l'utilisateur
  const getUserEmail = (): string => {
    if (!auth.user) return ''
    return auth.user.email || ''
  }

  // Obtenir l'image de profil de l'utilisateur
  const getUserPicture = (): string => {
    if (!auth.user) return ''
    return auth.user.picture || ''
  }

  // Obtenir l'ID unique de l'utilisateur
  const getUserId = (): string => {
    if (!auth.user) return ''
    return auth.user.sub || auth.user.user_id || ''
  }

  // Vérifier si l'utilisateur a un profil complet
  const hasCompleteProfile = (): boolean => {
    if (!auth.user) return false
    return !!(auth.user.name && auth.user.email)
  }

  // Obtenir les informations de profil de l'utilisateur
  const getUserProfile = () => {
    if (!auth.user) return null
    
    return {
      id: getUserId(),
      name: getDisplayName(),
      email: getUserEmail(),
      picture: getUserPicture(),
      roles: getUserRoles(),
      permissions: getUserPermissions(),
      isAdmin: isAdmin(),
      isSuperAdmin: isSuperAdmin(),
      isManager: isManager(),
      isStoreOwner: isStoreOwner(),
      hasCompleteProfile: hasCompleteProfile(),
      metadata: auth.user['https://coovia.com/user_metadata'] || {},
      appMetadata: auth.user['https://coovia.com/app_metadata'] || {}
    }
  }

  return {
    ...auth,
    // Méthodes de vérification des rôles
    hasRole,
    hasAnyRole,
    hasAllRoles,
    
    // Méthodes de vérification des permissions
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    
    // Méthodes utilitaires
    getUserRoles,
    getUserPermissions,
    isAdmin,
    isSuperAdmin,
    isManager,
    isStoreOwner,
    
    // Méthodes de vérification des capacités
    canManageStores,
    canManageProducts,
    canManageOrders,
    canManageCustomers,
    canManageUsers,
    canViewAnalytics,
    
    // Méthodes d'informations utilisateur
    getDisplayName,
    getUserEmail,
    getUserPicture,
    getUserId,
    hasCompleteProfile,
    getUserProfile
  }
}
