import React, { useState } from 'react';
import { RequireGuest } from '../components/AuthGuard';
import { LoginForm } from '../components/LoginForm';
import { RegisterForm } from '../components/RegisterForm';

export const LoginPage: React.FC = () => {
  const [isLoginMode, setIsLoginMode] = useState(true);

  const handleSuccess = () => {
    // Rediriger vers le tableau de bord après connexion/inscription réussie
    window.location.href = '/dashboard';
  };

  const switchToRegister = () => {
    setIsLoginMode(false);
  };

  const switchToLogin = () => {
    setIsLoginMode(true);
  };

  return (
    <RequireGuest>
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h1 className="text-center text-3xl font-extrabold text-gray-900 mb-2">
            {isLoginMode ? 'Connexion' : 'Inscription'}
          </h1>
          <p className="text-center text-sm text-gray-600">
            {isLoginMode 
              ? 'Connectez-vous à votre compte Coovia' 
              : 'Créez votre compte Coovia'
            }
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          {isLoginMode ? (
            <LoginForm 
              onSuccess={handleSuccess}
              onSwitchToRegister={switchToRegister}
            />
          ) : (
            <RegisterForm 
              onSuccess={handleSuccess}
              onSwitchToLogin={switchToLogin}
            />
          )}
        </div>

        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            En continuant, vous acceptez nos{' '}
            <a href="/terms" className="text-blue-600 hover:text-blue-800">
              conditions d'utilisation
            </a>{' '}
            et notre{' '}
            <a href="/privacy" className="text-blue-600 hover:text-blue-800">
              politique de confidentialité
            </a>
            .
          </p>
        </div>
      </div>
    </RequireGuest>
  );
};
