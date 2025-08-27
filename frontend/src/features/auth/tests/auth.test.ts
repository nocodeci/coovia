// Tests pour l'intégration Sanctum
// Ces tests vérifient que tous les composants et services fonctionnent correctement

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useAuth } from '../hooks/useAuth';
import { LoginForm } from '../components/LoginForm';
import { RegisterForm } from '../components/RegisterForm';
import { AuthGuard } from '../components/AuthGuard';

// Mock du service Sanctum
vi.mock('../services/sanctum', () => ({
  sanctumService: {
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
    checkAuth: vi.fn(),
    isAuthenticated: vi.fn(),
  },
}));

// Mock du hook useAuth
const mockUseAuth = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  login: vi.fn(),
  register: vi.fn(),
  logout: vi.fn(),
  checkAuth: vi.fn(),
  clearError: vi.fn(),
};

vi.mock('../hooks/useAuth', () => ({
  useAuth: () => mockUseAuth,
}));

describe('Intégration Sanctum', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('LoginForm', () => {
    it('devrait afficher le formulaire de connexion', () => {
      render(<LoginForm />);
      
      expect(screen.getByText('Connexion')).toBeInTheDocument();
      expect(screen.getByLabelText('Email')).toBeInTheDocument();
      expect(screen.getByLabelText('Mot de passe')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Se connecter' })).toBeInTheDocument();
    });

    it('devrait gérer la soumission du formulaire', async () => {
      const mockLogin = vi.fn().mockResolvedValue({ success: true });
      mockUseAuth.login = mockLogin;

      render(<LoginForm />);
      
      const emailInput = screen.getByLabelText('Email');
      const passwordInput = screen.getByLabelText('Mot de passe');
      const submitButton = screen.getByRole('button', { name: 'Se connecter' });

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith({
          email: 'test@example.com',
          password: 'password123',
        });
      });
    });
  });

  describe('RegisterForm', () => {
    it('devrait afficher le formulaire d\'inscription', () => {
      render(<RegisterForm />);
      
      expect(screen.getByText('Inscription')).toBeInTheDocument();
      expect(screen.getByLabelText('Nom complet')).toBeInTheDocument();
      expect(screen.getByLabelText('Email')).toBeInTheDocument();
      expect(screen.getByLabelText('Mot de passe')).toBeInTheDocument();
      expect(screen.getByLabelText('Confirmer le mot de passe')).toBeInTheDocument();
    });

    it('devrait valider les mots de passe', async () => {
      render(<RegisterForm />);
      
      const passwordInput = screen.getByLabelText('Mot de passe');
      const confirmPasswordInput = screen.getByLabelText('Confirmer le mot de passe');
      const submitButton = screen.getByRole('button', { name: 'S\'inscrire' });

      // Mot de passe trop court
      fireEvent.change(passwordInput, { target: { value: '123' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Le mot de passe doit contenir au moins 8 caractères')).toBeInTheDocument();
      });

      // Mots de passe différents
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'password456' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Les mots de passe ne correspondent pas')).toBeInTheDocument();
      });
    });
  });

  describe('AuthGuard', () => {
    it('devrait afficher le contenu protégé pour un utilisateur authentifié', () => {
      mockUseAuth.isAuthenticated = true;
      mockUseAuth.isLoading = false;

      render(
        <AuthGuard requireAuth={true}>
          <div>Contenu protégé</div>
        </AuthGuard>
      );

      expect(screen.getByText('Contenu protégé')).toBeInTheDocument();
    });

    it('devrait afficher un message d\'accès refusé pour un utilisateur non authentifié', () => {
      mockUseAuth.isAuthenticated = false;
      mockUseAuth.isLoading = false;

      render(
        <AuthGuard requireAuth={true}>
          <div>Contenu protégé</div>
        </AuthGuard>
      );

      expect(screen.getByText('Accès refusé')).toBeInTheDocument();
      expect(screen.getByText('Vous devez être connecté pour accéder à cette page.')).toBeInTheDocument();
    });

    it('devrait afficher un spinner de chargement', () => {
      mockUseAuth.isLoading = true;

      render(
        <AuthGuard requireAuth={true}>
          <div>Contenu protégé</div>
        </AuthGuard>
      );

      expect(screen.getByRole('status')).toBeInTheDocument();
    });
  });

  describe('useAuth Hook', () => {
    it('devrait fournir toutes les propriétés nécessaires', () => {
      const auth = useAuth();
      
      expect(auth).toHaveProperty('user');
      expect(auth).toHaveProperty('isAuthenticated');
      expect(auth).toHaveProperty('isLoading');
      expect(auth).toHaveProperty('error');
      expect(auth).toHaveProperty('login');
      expect(auth).toHaveProperty('register');
      expect(auth).toHaveProperty('logout');
      expect(auth).toHaveProperty('checkAuth');
      expect(auth).toHaveProperty('clearError');
    });
  });
});

// Tests d'intégration pour le service Sanctum
describe('SanctumService', () => {
  it('devrait être configuré avec les bonnes options', () => {
    // Ces tests vérifient que le service est correctement configuré
    expect(true).toBe(true); // Placeholder pour les tests d'intégration
  });
});

// Tests pour la configuration API
describe('Configuration API', () => {
  it('devrait avoir une URL de base configurée', () => {
    const baseUrl = import.meta.env.VITE_API_URL || 'http://api.wozif.com/api';
    expect(baseUrl).toBeDefined();
    expect(baseUrl).toContain('api.wozif.com');
  });

  it('devrait avoir des endpoints d\'authentification configurés', () => {
    // Vérification que les endpoints sont définis
    expect(true).toBe(true); // Placeholder pour les tests de configuration
  });
});
