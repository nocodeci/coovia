// Export des composants d'authentification
export { LoginForm } from './components/LoginForm';
export { RegisterForm } from './components/RegisterForm';
export {
  AuthGuard,
  RequireAuth,
  RequireGuest,
  RequireRole,
  RequireAdmin,
  RequireVendor,
  RequireCustomer
} from './components/AuthGuard';
export { AuthNavbar } from './components/AuthNavbar';

// Export des pages
export { LoginPage } from './pages/LoginPage';

// Export des hooks
export { useAuth } from './hooks/useAuth';

// Export des services
export { sanctumService } from './services/sanctum';

// Export des types et interfaces
export type { 
  LoginCredentials, 
  RegisterData, 
  User, 
  AuthResponse 
} from './services/sanctum';

// Export de la configuration
export { API_CONFIG, AXIOS_CONFIG, DEFAULT_ERROR_MESSAGES } from './config/api';
export type { ApiEndpoint, StatusCode } from './config/api';
