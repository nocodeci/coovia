"use client"

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { toast } from 'sonner'
import apiService from '@/lib/api'
import { cache, CACHE_KEYS } from '@/lib/cache'

interface User {
  id: string
  name: string
  email: string
  role: string
  created_at: string
  updated_at: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  hasCheckedAuth: boolean
  authStep: 'email' | 'password' | 'otp' | 'complete'
  email: string
  password: string
  otp: string
  setEmail: (email: string) => void
  setPassword: (password: string) => void
  setOtp: (otp: string) => void
  submitEmail: (email: string) => Promise<void>
  submitPassword: (password: string) => Promise<void>
  submitOtp: (otp: string) => Promise<void>
  logout: () => Promise<void>
  resetAuth: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

// Hook personnalisé pour l'authentification
function useAuthCustom() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false)
  const [authStep, setAuthStep] = useState<'email' | 'password' | 'otp' | 'complete'>('email')
  const [email, setEmailState] = useState('')
  const [password, setPasswordState] = useState('')
  const [otp, setOtpState] = useState('')

  // Vérifier l'authentification au montage
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true)
        
        // Vérifier d'abord le cache
        const cachedUser = cache.get(CACHE_KEYS.USER)
        if (cachedUser) {
          // Vérifier que l'utilisateur est toujours valide côté serveur
          try {
            const response = await apiService.request('/auth/check')
            if (response.success && response.user) {
              setUser(response.user as User)
              setAuthStep('complete')
              // Mettre à jour le cache avec les données fraîches
              cache.set(CACHE_KEYS.USER, response.user, 60 * 60 * 1000)
            } else {
              // L'utilisateur n'est plus valide, vider le cache
              cache.delete(CACHE_KEYS.USER)
              setUser(null)
              setAuthStep('email')
            }
          } catch (error) {
            console.error('Erreur lors de la vérification serveur:', error)
            // En cas d'erreur, vider le cache et rediriger vers la connexion
            cache.delete(CACHE_KEYS.USER)
            setUser(null)
            setAuthStep('email')
          }
        } else {
          // Pas d'utilisateur en cache, pas besoin de vérifier l'authentification
          setUser(null)
          setAuthStep('email')
        }
      } catch (error) {
        console.error('Erreur lors de la vérification du cache:', error)
        setUser(null)
        setAuthStep('email')
      } finally {
        setIsLoading(false)
        setHasCheckedAuth(true)
      }
    }

    checkAuth()
  }, [])

  const submitEmail = async (email: string) => {
    try {
      setIsLoading(true)
      setEmailState(email)
      
      // Appel API pour valider l'email
      const response = await apiService.validateEmail(email)
      
      if (response.success) {
        setAuthStep('password')
        toast.success('Email validé, veuillez saisir votre mot de passe')
      } else {
        toast.error(response.message || 'Email invalide')
      }
    } catch (error) {
      console.error('Erreur lors de la validation de l\'email:', error)
      toast.error('Erreur lors de la validation de l\'email')
    } finally {
      setIsLoading(false)
    }
  }

  const submitPassword = async (password: string) => {
    try {
      setIsLoading(true)
      setPasswordState(password)
      
      // Appel API pour valider le mot de passe
      const response = await apiService.validatePassword(email, password)
      
      if (response.success) {
        setAuthStep('otp')
        toast.success('Mot de passe validé, veuillez saisir le code OTP reçu par email')
      } else {
        toast.error(response.message || 'Mot de passe incorrect')
      }
    } catch (error) {
      console.error('Erreur lors de la validation du mot de passe:', error)
      toast.error('Erreur lors de la validation du mot de passe')
    } finally {
      setIsLoading(false)
    }
  }

  const submitOtp = async (otp: string) => {
    try {
      setIsLoading(true)
      setOtpState(otp)
      
      // Appel API pour valider l'OTP et finaliser la connexion
      const response = await apiService.validateOtp(email, password, otp)
      
      if (response.success && response.user) {
        const user = response.user as User
        setUser(user)
        setAuthStep('complete')
        cache.set(CACHE_KEYS.USER, user, 60 * 60 * 1000) // 1 heure
        toast.success(`Bienvenue ${user.name}`)
      } else {
        toast.error(response.message || 'Code OTP invalide')
      }
    } catch (error) {
      console.error('Erreur lors de la validation de l\'OTP:', error)
      toast.error('Erreur lors de la validation de l\'OTP')
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      await apiService.logout()
      setUser(null)
      setAuthStep('email')
      setEmailState('')
      setPasswordState('')
      setOtpState('')
      cache.delete(CACHE_KEYS.USER)
      toast.success('Déconnexion réussie')
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error)
      toast.error('Erreur lors de la déconnexion')
    }
  }

  const resetAuth = () => {
    setAuthStep('email')
    setEmailState('')
    setPasswordState('')
    setOtpState('')
  }

  const refreshAuth = async () => {
    try {
      setIsLoading(true)
      const response = await apiService.request('/auth/check')
      if (response.success && response.user) {
        setUser(response.user as User)
        setAuthStep('complete')
        cache.set(CACHE_KEYS.USER, response.user, 60 * 60 * 1000)
        return true
      } else {
        setUser(null)
        setAuthStep('email')
        cache.delete(CACHE_KEYS.USER)
        return false
      }
    } catch (error) {
      console.error('Erreur lors du rafraîchissement de l\'authentification:', error)
      setUser(null)
      setAuthStep('email')
      cache.delete(CACHE_KEYS.USER)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    hasCheckedAuth,
    authStep,
    email,
    password,
    otp,
    setEmail: setEmailState,
    setPassword: setPasswordState,
    setOtp: setOtpState,
    submitEmail,
    submitPassword,
    submitOtp,
    logout,
    resetAuth,
    refreshAuth
  }
}

// Provider principal
export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useAuthCustom()

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  )
}

// Hook pour utiliser l'authentification
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider')
  }
  return context
}
