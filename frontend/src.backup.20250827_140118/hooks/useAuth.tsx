"use client"

import { createContext, useContext, useEffect, useState, ReactNode, useRef } from "react"
import { toast } from "sonner"
import apiService from "@/lib/api"
import { cache, CACHE_KEYS } from "@/lib/cache"

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
  mfaRequired: boolean
  hasCheckedAuth: boolean
  login: (credentials: { email: string; password: string }) => Promise<void>
  logout: () => Promise<void>
  register: (userData: any) => Promise<void>
  verifyMfa: (code: string) => Promise<void>
  setupMfa: () => Promise<any>
  enableMfa: (code: string) => Promise<any>
  disableMfa: (password: string) => Promise<any>
  regenerateBackupCodes: () => Promise<any>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [mfaRequired, setMfaRequired] = useState(false)
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false)
  const checkAuthInProgress = useRef(false)

  // Vérifier l'authentification au montage - OPTIMISÉ
  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    // Éviter les vérifications simultanées
    if (checkAuthInProgress.current || hasCheckedAuth) return
    
    checkAuthInProgress.current = true
    
    try {
      // Vérifier le cache d'abord pour un chargement instantané
      const cachedUser = cache.get<User>(CACHE_KEYS.USER)
      if (cachedUser) {
        setUser(cachedUser)
        setIsLoading(false)
        setHasCheckedAuth(true)
        return
      }
      
      // Vérifier si un token existe
      const token = localStorage.getItem("auth_token")
      if (!token) {
        setIsLoading(false)
        setHasCheckedAuth(true)
        return
      }
      
      // Vérifier si on a déjà vérifié récemment (dans les 5 dernières minutes)
      const lastCheck = localStorage.getItem("auth_last_check")
      const now = Date.now()
      if (lastCheck && (now - parseInt(lastCheck)) < 5 * 60 * 1000) {
        // Utiliser le cache si la vérification est récente
        const cachedUser = cache.get<User>(CACHE_KEYS.USER)
        if (cachedUser) {
          setUser(cachedUser)
          setIsLoading(false)
          setHasCheckedAuth(true)
          return
        }
      }
      
      const response = await apiService.checkAuth()

      if (response.success && response.user) {
        const user = response.user as User
        setUser(user)
        
        // Mettre en cache l'utilisateur avec TTL plus long
        cache.set(CACHE_KEYS.USER, user, 60 * 60 * 1000) // 1 heure
        localStorage.setItem("auth_last_check", now.toString())
      } else {
        // Token invalide, nettoyer
        localStorage.removeItem("auth_token")
        localStorage.removeItem("auth_last_check")
        apiService.setToken("")
        cache.delete(CACHE_KEYS.USER)
      }
    } catch (error) {
      // Erreur réseau ou token invalide
      localStorage.removeItem("auth_token")
      localStorage.removeItem("auth_last_check")
      apiService.setToken("")
      cache.delete(CACHE_KEYS.USER)
    } finally {
      setIsLoading(false)
      setHasCheckedAuth(true)
      checkAuthInProgress.current = false
    }
  }

  const login = async (credentials: { email: string; password: string }) => {
    try {
      setIsLoading(true)
      const response = await apiService.login(credentials)

      if (response.success && response.user) {
        const user = response.user as User
        setUser(user)
        
        // Mettre en cache l'utilisateur avec TTL plus long
        cache.set(CACHE_KEYS.USER, user, 60 * 60 * 1000) // 1 heure
        localStorage.setItem("auth_last_check", Date.now().toString())
        
        toast.success("Connexion réussie", {
          description: `Bienvenue ${user.name}`,
        })
      } else {
        throw new Error(response.message || "Échec de la connexion")
      }
    } catch (error: any) {
      toast.error("Erreur de connexion", {
        description: error.message || "Impossible de se connecter",
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      await apiService.logout()
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error)
    } finally {
      setUser(null)
      localStorage.removeItem("auth_token")
      localStorage.removeItem("auth_last_check")
      apiService.setToken("")
      
      // Nettoyer tous les caches
      cache.clear()
      
      toast.success("Déconnexion réussie")
    }
  }

  const register = async (userData: any) => {
    try {
      setIsLoading(true)
      const response = await apiService.register(userData)
      if (response.success) {
        toast.success("Inscription réussie", {
          description: "Votre compte a été créé avec succès",
        })
      }
    } catch (error: any) {
      toast.error("Erreur d'inscription", {
        description: error.message || "Impossible de créer le compte",
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const verifyMfa = async (code: string) => {
    try {
      setIsLoading(true)
      const response = await apiService.verifyMfa(code)
      if (response.success) {
        setMfaRequired(false)
        toast.success("Code MFA vérifié")
      }
    } catch (error: any) {
      toast.error("Erreur MFA", {
        description: error.message || "Code MFA invalide",
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const setupMfa = async () => {
    try {
      return await apiService.setupMfa()
    } catch (error: any) {
      toast.error("Erreur MFA", {
        description: error.message || "Impossible de configurer MFA",
      })
      throw error
    }
  }

  const enableMfa = async (code: string) => {
    try {
      const response = await apiService.enableMfa(code)
      if (response.success) {
        toast.success("MFA activé")
      }
    } catch (error: any) {
      toast.error("Erreur MFA", {
        description: error.message || "Impossible d'activer MFA",
      })
      throw error
    }
  }

  const disableMfa = async (password: string) => {
    try {
      const response = await apiService.disableMfa(password)
      if (response.success) {
        toast.success("MFA désactivé")
      }
    } catch (error: any) {
      toast.error("Erreur MFA", {
        description: error.message || "Impossible de désactiver MFA",
      })
      throw error
    }
  }

  const regenerateBackupCodes = async () => {
    try {
      return await apiService.regenerateBackupCodes()
    } catch (error: any) {
      toast.error("Erreur MFA", {
        description: error.message || "Impossible de régénérer les codes",
      })
      throw error
    }
  }

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    mfaRequired,
    hasCheckedAuth,
    login,
    logout,
    register,
    verifyMfa,
    setupMfa,
    enableMfa,
    disableMfa,
    regenerateBackupCodes,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
