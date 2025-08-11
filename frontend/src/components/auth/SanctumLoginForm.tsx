"use client"

import React, { useState } from 'react'
import { useSanctumAuth } from '@/hooks/useSanctumAuth'

interface SanctumLoginFormProps {
  onSuccess?: () => void
  onSwitchToAuth0?: () => void
}

export function SanctumLoginForm({ onSuccess, onSwitchToAuth0 }: SanctumLoginFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [otp, setOtp] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isRegistering, setIsRegistering] = useState(false)
  const [name, setName] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')

  const { 
    validateEmail, 
    validatePassword, 
    loginWithOtp, 
    loginLegacy, 
    register, 
    isLoading, 
    error, 
    clearError, 
    authStep,
    resetAuthStep 
  } = useSanctumAuth()

  // Étape 1: Validation de l'email
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    clearError()

    if (!email.trim()) {
      return
    }

    const result = await validateEmail(email)
    if (result.success) {
      // L'étape suivante sera automatiquement activée
    }
  }

  // Étape 2: Validation du mot de passe
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    clearError()

    if (!password.trim()) {
      return
    }

    const result = await validatePassword(password)
    if (result.success) {
      // L'étape OTP sera automatiquement activée
    }
  }

  // Étape 3: Connexion avec OTP
  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    clearError()

    if (!otp.trim() || otp.length !== 6) {
      return
    }

    const result = await loginWithOtp(otp)
    if (result.success) {
      onSuccess?.()
    }
  }

  // Méthode legacy pour l'inscription
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    clearError()

    if (!name.trim() || !email.trim() || !password.trim() || !passwordConfirmation.trim()) {
      return
    }

    if (password !== passwordConfirmation) {
      return
    }

    const result = await register({
      name,
      email,
      password,
      password_confirmation: passwordConfirmation
    })
    
    if (result.success) {
      onSuccess?.()
    }
  }

  const handleBackToEmail = () => {
    resetAuthStep()
    setEmail('')
    setPassword('')
    setOtp('')
  }

  const handleBackToPassword = () => {
    // Pour simplifier, on revient à l'étape email
    resetAuthStep()
    setPassword('')
    setOtp('')
  }

  const toggleMode = () => {
    setIsRegistering(!isRegistering)
    resetAuthStep()
    setEmail('')
    setPassword('')
    setOtp('')
    setName('')
    setPasswordConfirmation('')
  }

  // Mode inscription
  if (isRegistering) {
    return (
      <div className="w-full max-w-xs">
        <div className="text-left">
          <div className="text-2xl font-bold text-neutral-900 mb-2">Créer un compte</div>
          <div className="text-sm text-neutral-500 mb-6">
            <span className="mr-1">Déjà un compte ?</span>
            <button
              onClick={toggleMode}
              className="text-sm font-medium text-primary hover:underline"
            >
              Se connecter
            </button>
          </div>
        </div>

        <form onSubmit={handleRegisterSubmit} className="space-y-4">
          <div className="grid gap-2">
            <label className="text-sm font-medium text-neutral-900 mb-1 block">
              Nom complet<span className="text-red-500 ml-1">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-neutral-400">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
                             <input
                 type="text"
                 value={name}
                 onChange={(e) => setName(e.target.value)}
                 className="flex w-full min-w-0 border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] pl-10 h-12 rounded-xl border-neutral-200 focus:border-primary focus:ring-primary text-neutral-900"
                 placeholder="Votre nom complet"
                 required
               />
            </div>
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium text-neutral-900 mb-1 block">
              Adresse email<span className="text-red-500 ml-1">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-neutral-400">
                  <path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7"></path>
                  <rect x="2" y="4" width="20" height="16" rx="2"></rect>
                </svg>
              </div>
                             <input
                 type="email"
                 value={email}
                 onChange={(e) => setEmail(e.target.value)}
                 className="flex w-full min-w-0 border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] pl-10 h-12 rounded-xl border-neutral-200 focus:border-primary focus:ring-primary text-neutral-900"
                 placeholder="nom@exemple.com"
                 required
               />
            </div>
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium text-neutral-900 mb-1 block">
              Mot de passe<span className="text-red-500 ml-1">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-neutral-400">
                  <rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
              </div>
                             <input
                 type="password"
                 value={password}
                 onChange={(e) => setPassword(e.target.value)}
                 className="flex w-full min-w-0 border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] pl-10 pr-10 h-12 rounded-xl border-neutral-200 focus:border-primary focus:ring-primary text-neutral-900"
                 placeholder="Votre mot de passe"
                 required
               />
            </div>
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium text-neutral-900 mb-1 block">
              Confirmer le mot de passe<span className="text-red-500 ml-1">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-neutral-400">
                  <rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
              </div>
                             <input
                 type="password"
                 value={passwordConfirmation}
                 onChange={(e) => setPasswordConfirmation(e.target.value)}
                 className="flex w-full min-w-0 border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] pl-10 h-12 rounded-xl border-neutral-200 focus:border-primary focus:ring-primary text-neutral-900"
                 placeholder="Confirmer le mot de passe"
                 required
               />
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm">{error}</div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm transition-all disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] shadow-xs px-4 py-2 w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
          >
            {isLoading ? 'Création...' : 'Créer le compte'}
          </button>
        </form>
      </div>
    )
  }

  // Mode connexion en 3 étapes - Design moderne inspiré
  return (
    <div className="w-full max-w-xs">
      <div className="text-left">
        <div className="text-2xl font-bold text-neutral-900 mb-2">Se connecter</div>
        <div className="text-sm text-neutral-500 mb-6">
          <span className="mr-1">Pas encore de compte ?</span>
          <button
            onClick={toggleMode}
            className="text-sm font-medium text-primary hover:underline"
          >
            Créer un compte
          </button>
        </div>
      </div>

      <form onSubmit={
        authStep.step === 'email' ? handleEmailSubmit :
        authStep.step === 'password' ? handlePasswordSubmit :
        handleOtpSubmit
      } className="space-y-4">
        
        {/* Champ email - toujours visible */}
        <div className="grid gap-2">
          <label className="text-sm font-medium text-neutral-900 mb-1 block">
            Adresse email<span className="text-red-500 ml-1">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-neutral-400">
                <path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7"></path>
                <rect x="2" y="4" width="20" height="16" rx="2"></rect>
              </svg>
            </div>
                         <input
               type="email"
               value={email}
               onChange={(e) => setEmail(e.target.value)}
               className="flex w-full min-w-0 border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] pl-10 h-12 rounded-xl border-neutral-200 focus:border-primary focus:ring-primary text-neutral-900"
               placeholder="nom@exemple.com"
               disabled={authStep.step !== 'email'}
               required
             />
          </div>
        </div>

        {/* Champ mot de passe - visible à partir de l'étape password */}
        {authStep.step !== 'email' && (
          <div className="grid gap-2">
            <label className="text-sm font-medium text-neutral-900 mb-1 block">
              Mot de passe<span className="text-red-500 ml-1">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-neutral-400">
                  <rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
              </div>
                             <input
                 type={showPassword ? 'text' : 'password'}
                 value={password}
                 onChange={(e) => setPassword(e.target.value)}
                 className="flex w-full min-w-0 border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] pl-10 pr-10 h-12 rounded-xl border-neutral-200 focus:border-primary focus:ring-primary text-neutral-900"
                 placeholder="Votre mot de passe"
                 disabled={authStep.step === 'otp'}
                 required
               />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] hover:text-accent-foreground rounded-md gap-1.5 absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                  <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Champ OTP - visible seulement à l'étape OTP */}
        {authStep.step === 'otp' && (
          <div className="grid gap-2">
            <label className="text-sm font-medium text-neutral-900 mb-1 block">
              Code de vérification<span className="text-red-500 ml-1">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-neutral-400">
                  <path d="M9 12l2 2 4-4"></path>
                  <path d="M21 12c-1 0-2-1-2-2s1-2 2-2 2 1 2 2-1 2-2 2z"></path>
                  <path d="M3 12c1 0 2-1 2-2s-1-2-2-2-2 1-2 2 1 2 2 2z"></path>
                  <path d="M12 3c0 1-1 2-2 2s-2-1-2-2 1-2 2-2 2 1 2 2z"></path>
                  <path d="M12 21c0-1 1-2 2-2s2 1 2 2-1 2-2 2-2-1-2-2z"></path>
                </svg>
              </div>
                             <input
                 type="text"
                 value={otp}
                 onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                 className="flex w-full min-w-0 border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] pl-10 h-12 rounded-xl border-neutral-200 focus:border-primary focus:ring-primary text-center text-lg text-neutral-900"
                 placeholder="000000"
                 maxLength={6}
                 required
               />
            </div>
            <p className="text-xs text-neutral-500 mt-1">
              Code envoyé à votre email
            </p>
          </div>
        )}

        {/* Messages d'erreur */}
        {error && (
          <div className="text-red-500 text-sm">{error}</div>
        )}

        {/* Bouton principal */}
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm transition-all disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] shadow-xs px-4 py-2 w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
        >
          {isLoading ? 'Vérification...' : 
           authStep.step === 'email' ? 'Continuer' :
           authStep.step === 'password' ? 'Continuer' :
           'Se connecter'}
        </button>
      </form>

      <div className="flex flex-col items-center justify-center mt-6">
        <div className="text-sm text-neutral-500">Avez-vous précédemment acheté sur Coovia ?</div>
        <div className="text-sm">
          <span className="text-neutral-500">Accéder à vos achats</span>
          <a href="https://portal.coovia.com" className="text-primary font-medium ml-1 hover:underline">ici</a>
        </div>
      </div>
    </div>
  )
}
