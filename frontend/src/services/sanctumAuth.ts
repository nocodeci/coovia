import { useAuthStore } from '../stores/authStore';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: {
    id: number;
    name: string;
    email: string;
    role: string;
    created_at: string;
    updated_at: string;
  };
  errors?: any;
  temp_token?: string;
  otp_token?: string;
  step?: string;
  is_new_user?: boolean;
  redirect_to?: string;
}

class SanctumAuthService {
  private baseUrl: string;
  private token: string | null = null;

  constructor() {
    this.baseUrl = import.meta.env.VITE_API_URL || 'http://api.wozif.com/api';
    this.token = localStorage.getItem('sanctum_token');
  }

  private async request<T>(endpoint: string, options: RequestInit = {}, skipRefresh = false): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
      credentials: 'include', // Nécessaire pour Sanctum
    });

    if (!response.ok) {
      if (response.status === 401 && !skipRefresh && this.token) {
        // Token expiré, essayer de rafraîchir (mais pas pour les routes publiques)
        const refreshSuccess = await this.refreshTokenDirect();
        if (refreshSuccess && this.token) {
          headers['Authorization'] = `Bearer ${this.token}`;
          const retryResponse = await fetch(url, {
            ...options,
            headers,
            credentials: 'include',
          });
          
          if (!retryResponse.ok) {
            throw new Error(`HTTP error! status: ${retryResponse.status}`);
          }
          
          return retryResponse.json();
        }
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Étape 1: Validation de l'email
  async validateEmail(email: string): Promise<AuthResponse> {
    try {
      const response = await this.request<AuthResponse>('/auth/validate-email', {
        method: 'POST',
        body: JSON.stringify({ email }),
      }, true); // skipRefresh = true car c'est une route publique

      return response;
    } catch (error) {
      console.error('Erreur validation email:', error);
      throw error;
    }
  }

  // Étape 2: Validation du mot de passe
  async validatePassword(email: string, password: string, tempToken: string): Promise<AuthResponse> {
    try {
      const response = await this.request<AuthResponse>('/auth/validate-password', {
        method: 'POST',
        body: JSON.stringify({ 
          email, 
          password, 
          temp_token: tempToken 
        }),
      }, true); // skipRefresh = true car c'est une route publique

      return response;
    } catch (error) {
      console.error('Erreur validation mot de passe:', error);
      throw error;
    }
  }

  // Étape 3: Connexion avec OTP
  async login(email: string, otp: string, otpToken: string): Promise<AuthResponse> {
    try {
      const response = await this.request<AuthResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ 
          email, 
          otp, 
          otp_token: otpToken 
        }),
      }, true); // skipRefresh = true car c'est une route publique

      if (response.success && response.token) {
        this.token = response.token;
        localStorage.setItem('sanctum_token', response.token);
        
        // Mettre à jour le store
        if (response.user) {
          useAuthStore.getState().login(response.user, response.token);
        }
      }

      return response;
    } catch (error) {
      console.error('Erreur connexion OTP:', error);
      throw error;
    }
  }

  // Méthode legacy pour compatibilité (à supprimer plus tard)
  async loginLegacy(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await this.request<AuthResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      }, true); // skipRefresh = true car c'est une route publique

      if (response.success && response.token) {
        this.token = response.token;
        localStorage.setItem('sanctum_token', response.token);
        
        // Mettre à jour le store
        if (response.user) {
          useAuthStore.getState().login(response.user, response.token);
        }
      }

      return response;
    } catch (error) {
      console.error('Erreur connexion legacy:', error);
      throw error;
    }
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const response = await this.request<AuthResponse>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(data),
      }, true); // skipRefresh = true car c'est une route publique

      if (response.success && response.token) {
        this.token = response.token;
        localStorage.setItem('sanctum_token', response.token);
        
        // Mettre à jour le store
        if (response.user) {
          useAuthStore.getState().login(response.user, response.token);
        }
      }

      return response;
    } catch (error) {
      console.error('Erreur inscription:', error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      // Seulement appeler l'API si on a un token
      if (this.token) {
        await this.request('/auth/logout', {
          method: 'POST',
        }, true); // skipRefresh = true
      }

      this.token = null;
      localStorage.removeItem('sanctum_token');
      useAuthStore.getState().logout();
    } catch (error) {
      console.error('Erreur déconnexion:', error);
      // Même en cas d'erreur, on nettoie côté client
      this.token = null;
      localStorage.removeItem('sanctum_token');
      useAuthStore.getState().logout();
    }
  }

  async logoutAll(): Promise<void> {
    try {
      await this.request('/auth/logout-all', {
        method: 'POST',
      });

      this.token = null;
      localStorage.removeItem('sanctum_token');
      useAuthStore.getState().logout();
    } catch (error) {
      console.error('Erreur déconnexion globale:', error);
      // Même en cas d'erreur, on nettoie côté client
      this.token = null;
      localStorage.removeItem('sanctum_token');
      useAuthStore.getState().logout();
    }
  }

  async refreshToken(): Promise<boolean> {
    return this.refreshTokenDirect();
  }

  private async refreshTokenDirect(): Promise<boolean> {
    try {
      const url = `${this.baseUrl}/auth/refresh`;
      
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      };

      if (this.token) {
        headers['Authorization'] = `Bearer ${this.token}`;
      }

      const response = await fetch(url, {
        method: 'POST',
        headers,
        credentials: 'include',
      });

      if (!response.ok) {
        // Si le refresh échoue, on nettoie le token
        this.token = null;
        localStorage.removeItem('sanctum_token');
        useAuthStore.getState().logout();
        return false;
      }

      const data = await response.json();

      if (data.success && data.token) {
        this.token = data.token;
        localStorage.setItem('sanctum_token', data.token);
        
        if (data.user) {
          useAuthStore.getState().updateUser(data.user);
        }
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Erreur rafraîchissement token:', error);
      // En cas d'erreur, on nettoie le token
      this.token = null;
      localStorage.removeItem('sanctum_token');
      useAuthStore.getState().logout();
      return false;
    }
  }

  async getUser(): Promise<AuthResponse> {
    try {
      const response = await this.request<AuthResponse>('/auth/me', {}, true); // skipRefresh = true
      
      if (response.success && response.user) {
        useAuthStore.getState().updateUser(response.user);
      }
      
      return response;
    } catch (error) {
      console.error('Erreur récupération utilisateur:', error);
      throw error;
    }
  }

  async checkAuth(): Promise<AuthResponse> {
    try {
      const response = await this.request<AuthResponse>('/auth/check', {}, true); // skipRefresh = true
      
      if (response.success && response.user) {
        useAuthStore.getState().updateUser(response.user);
      }
      
      return response;
    } catch (error) {
      console.error('Erreur vérification authentification:', error);
      throw error;
    }
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  getToken(): string | null {
    return this.token;
  }

  setToken(token: string): void {
    this.token = token;
    localStorage.setItem('sanctum_token', token);
  }
}

export const sanctumAuthService = new SanctumAuthService();
