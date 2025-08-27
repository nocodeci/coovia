import axios, { AxiosInstance, AxiosResponse } from 'axios';

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: User;
}

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

class SanctumService {
  private api: AxiosInstance;
  private token: string | null = null;

  constructor() {
    this.api = axios.create({
      baseURL: import.meta.env.VITE_API_URL || 'http://api.wozif.com/api',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      withCredentials: true, // Important pour Sanctum
    });

    // Intercepteur pour ajouter le token à chaque requête
    this.api.interceptors.request.use(
      (config) => {
        const token = this.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Intercepteur pour gérer les erreurs d'authentification
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          this.clearToken();
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );

    // Récupérer le token depuis le localStorage au démarrage
    this.token = this.getToken();
  }

  // Récupérer le token depuis le localStorage
  private getToken(): string | null {
    return localStorage.getItem('sanctum_token');
  }

  // Sauvegarder le token dans le localStorage
  private setToken(token: string): void {
    this.token = token;
    localStorage.setItem('sanctum_token', token);
  }

  // Supprimer le token
  private clearToken(): void {
    this.token = null;
    localStorage.removeItem('sanctum_token');
  }

  // Vérifier si l'utilisateur est connecté
  public isAuthenticated(): boolean {
    return !!this.token;
  }

  // Connexion
  public async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response: AxiosResponse<AuthResponse> = await this.api.post('/auth/login', credentials);
      
      if (response.data.success && response.data.token) {
        this.setToken(response.data.token);
      }
      
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data;
      }
      throw new Error('Erreur de connexion');
    }
  }

  // Inscription
  public async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const response: AxiosResponse<AuthResponse> = await this.api.post('/auth/register', data);
      
      if (response.data.success && response.data.token) {
        this.setToken(response.data.token);
      }
      
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data;
      }
      throw new Error('Erreur d\'inscription');
    }
  }

  // Déconnexion
  public async logout(): Promise<void> {
    try {
      await this.api.post('/auth/logout');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    } finally {
      this.clearToken();
    }
  }

  // Récupérer les informations de l'utilisateur connecté
  public async me(): Promise<User | null> {
    try {
      const response: AxiosResponse<AuthResponse> = await this.api.get('/auth/me');
      return response.data.user || null;
    } catch (error) {
      console.error('Erreur lors de la récupération des informations utilisateur:', error);
      return null;
    }
  }

  // Vérifier l'authentification
  public async checkAuth(): Promise<AuthResponse> {
    try {
      const response: AxiosResponse<AuthResponse> = await this.api.get('/auth/check');
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data;
      }
      throw new Error('Erreur de vérification d\'authentification');
    }
  }

  // Rafraîchir le token
  public async refresh(): Promise<AuthResponse> {
    try {
      const response: AxiosResponse<AuthResponse> = await this.api.post('/auth/refresh');
      
      if (response.data.success && response.data.token) {
        this.setToken(response.data.token);
      }
      
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data;
      }
      throw new Error('Erreur de rafraîchissement du token');
    }
  }

  // Obtenir l'instance axios configurée
  public getApi(): AxiosInstance {
    return this.api;
  }

  // Obtenir le token actuel
  public getCurrentToken(): string | null {
    return this.token;
  }
}

// Instance singleton
export const sanctumService = new SanctumService();
export default sanctumService;
