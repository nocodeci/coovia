import { useState, useEffect } from 'react';
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
}

export function useSanctumAuth() {
  const { user, token, isAuthenticated, isLoading, error, login: storeLogin, logout: storeLogout, updateUser, setLoading, setError, clearError } = useAuthStore();
  const [authStep, setAuthStep] = useState<AuthStep>({ step: 'email' });

  // Étape 1: Validation de l'email
  const validateEmail = async (email: string) => {
    setLoading(true);
    clearError();
    
    try {
      const response = await sanctumAuthService.validateEmail(email);
      
      if (response.success) {
        setAuthStep({
          step: 'password',
          email,
          tempToken: response.temp_token
        });
        return { success: true };
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

  // Étape 2: Validation du mot de passe
  const validatePassword = async (password: string) => {
    if (authStep.step !== 'password' || !authStep.email || !authStep.tempToken) {
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
          otpToken: response.otp_token
        });
        return { success: true };
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

  // Étape 3: Connexion avec OTP
  const loginWithOtp = async (otp: string) => {
    if (authStep.step !== 'otp' || !authStep.email || !authStep.otpToken) {
      setError('Étape invalide');
      return { success: false, message: 'Étape invalide' };
    }

    setLoading(true);
    clearError();
    
    try {
      const response = await sanctumAuthService.login(
        authStep.email,
        otp,
        authStep.otpToken
      );
      
      if (response.success) {
        setAuthStep({ step: 'complete' });
        return { success: true };
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

  // Vérifier l'authentification au chargement
  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        try {
          await getUser();
        } catch (error) {
          // Token invalide, nettoyer
          logout();
        }
      }
    };

    checkAuth();
  }, []);

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
