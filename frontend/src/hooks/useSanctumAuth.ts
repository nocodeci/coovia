import { useState, useEffect, useRef } from 'react';
import { sanctumAuthService } from '../services/sanctumAuth';
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

export interface AuthStep {
  step: 'email' | 'password' | 'otp' | 'complete';
  email?: string;
  tempToken?: string;
  otpToken?: string;
  isNewUser?: boolean;
}

export function useSanctumAuth() {
  const { user, token, isAuthenticated, isLoading, error, login: storeLogin, logout: storeLogout, updateUser, setLoading, setError, clearError } = useAuthStore();
  const [authStep, setAuthStep] = useState<AuthStep>({ step: 'email' });
  const hasCheckedAuth = useRef(false);

  // Étape 1: Validation de l'email avec Just-in-time registration
  const validateEmail = async (email: string) => {
    console.log('validateEmail appelé avec:', email);
    setLoading(true);
    clearError();
    
    try {
      const response = await sanctumAuthService.validateEmail(email);
      
      if (response.success) {
        console.log('Email validé, temp_token reçu:', response.temp_token);
        setAuthStep({
          step: 'password',
          email,
          tempToken: response.temp_token,
          isNewUser: response.is_new_user || false
        });
        return { 
          success: true, 
          isNewUser: response.is_new_user || false 
        };
      } else {
        setError(response.message || 'Erreur de validation email');
        return { success: false, message: response.message };
      }
    } catch (error: any) {
      const message = error.message || 'Erreur de validation email';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  // Étape 2: Validation du mot de passe avec Just-in-time registration
  const validatePassword = async (password: string) => {
    console.log('validatePassword appelé avec:', { password, authStep });
    
    if (authStep.step !== 'password' || !authStep.email || !authStep.tempToken) {
      console.log('Étape invalide:', { step: authStep.step, email: authStep.email, tempToken: authStep.tempToken });
      setError('Étape invalide');
      return { success: false, message: 'Étape invalide' };
    }

    setLoading(true);
    clearError();
    
    try {
      const response = await sanctumAuthService.validatePassword(
        authStep.email,
        password,
        authStep.tempToken
      );
      
      if (response.success) {
        setAuthStep({
          step: 'otp',
          email: authStep.email,
          otpToken: response.otp_token,
          isNewUser: response.is_new_user || authStep.isNewUser
        });
        return { 
          success: true, 
          isNewUser: response.is_new_user || authStep.isNewUser,
          message: response.message,
          otp_token: response.otp_token
        };
      } else {
        setError(response.message || 'Erreur de validation mot de passe');
        return { success: false, message: response.message };
      }
    } catch (error: any) {
      const message = error.message || 'Erreur de validation mot de passe';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  // Étape 3: Connexion avec OTP et gestion des nouveaux utilisateurs
  const loginWithOtp = async (otp: string, email?: string, otpToken?: string) => {
    const currentEmail = email || authStep.email;
    const currentOtpToken = otpToken || authStep.otpToken;
    
    if (!currentEmail || !currentOtpToken) {
      setError('Informations de session manquantes');
      return { success: false, message: 'Informations de session manquantes' };
    }

    setLoading(true);
    clearError();
    
    try {
      const response = await sanctumAuthService.login(
        currentEmail,
        otp,
        currentOtpToken
      );
      
      if (response.success) {
        setAuthStep({ step: 'complete' });
        return { 
          success: true, 
          isNewUser: response.is_new_user || authStep.isNewUser,
          redirectTo: response.redirect_to || 'dashboard'
        };
      } else {
        setError(response.message || 'Erreur de connexion OTP');
        return { success: false, message: response.message };
      }
    } catch (error: any) {
      const message = error.message || 'Erreur de connexion OTP';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  // Méthode legacy pour compatibilité
  const loginLegacy = async (credentials: LoginCredentials) => {
    setLoading(true);
    clearError();
    
    try {
      const response = await sanctumAuthService.loginLegacy(credentials);
      
      if (response.success) {
        return { success: true };
      } else {
        setError(response.message || 'Erreur de connexion');
        return { success: false, message: response.message };
      }
    } catch (error: any) {
      const message = error.message || 'Erreur de connexion';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    setLoading(true);
    clearError();
    
    try {
      const response = await sanctumAuthService.register(data);
      
      if (response.success) {
        return { success: true };
      } else {
        setError(response.message || 'Erreur d\'inscription');
        return { success: false, message: response.message };
      }
    } catch (error: any) {
      const message = error.message || 'Erreur d\'inscription';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    
    try {
      await sanctumAuthService.logout();
      setAuthStep({ step: 'email' });
      storeLogout(); // Appeler la fonction du store
    } catch (error) {
      console.error('Erreur déconnexion:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshToken = async () => {
    try {
      const success = await sanctumAuthService.refreshToken();
      return success;
    } catch (error) {
      console.error('Erreur rafraîchissement token:', error);
      return false;
    }
  };

  const getUser = async () => {
    try {
      const response = await sanctumAuthService.getUser();
      return response;
    } catch (error) {
      console.error('Erreur récupération utilisateur:', error);
      throw error;
    }
  };

  const resetAuthStep = () => {
    setAuthStep({ step: 'email' });
    clearError();
  };

  // Vérifier l'authentification au chargement de la page
  useEffect(() => {
    const checkAuth = async () => {
      // Éviter les vérifications multiples
      if (hasCheckedAuth.current || isLoading) return;
      
      hasCheckedAuth.current = true;
      
      // Vérifier si on a un token stocké
      const storedToken = sanctumAuthService.getToken();
      
      if (storedToken && !user) {
        try {
          console.log('Vérification automatique de l\'authentification...');
          const response = await getUser();
          if (response.success && response.user) {
            console.log('Utilisateur authentifié trouvé:', response.user);
            // Synchroniser avec le store Zustand
            storeLogin(response.user, storedToken);
          }
        } catch (error) {
          // Token invalide, nettoyer silencieusement
          console.log('Token invalide, nettoyage automatique');
          sanctumAuthService.setToken('');
          useAuthStore.getState().logout();
        }
      } else if (!storedToken && !user) {
        // Pas de token, ne pas vérifier la session côté serveur
        // Cela évite les appels API inutiles et les erreurs 401
        console.log('Pas de token stocké, pas de vérification serveur');
      }
    };

    checkAuth();
  }, [user, storeLogin]); // Ajouter storeLogin aux dépendances

  return {
    // État
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    authStep,
    
    // Actions d'authentification en 3 étapes
    validateEmail,
    validatePassword,
    loginWithOtp,
    resetAuthStep,
    
    // Actions legacy
    loginLegacy,
    register,
    logout,
    refreshToken,
    getUser,
    
    // Utilitaires
    clearError,
  };
}
