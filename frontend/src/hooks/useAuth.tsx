"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { toast } from "sonner"
import apiService from "@/lib/api"
import type { User } from "@/types/auth"

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  mfaRequired: boolean
  login: (credentials: { email: string; password: string }) => Promise<void>
  logout: () => Promise<void>
  register: (userData: any) => Promise<void>
  verifyMfa: (code: string) => Promise<void>
  setupMfa: () => Promise<any>
  enableMfa: (code: string) => Promise<any>
  disableMfa: (password: string) => Promise<any>
  regenerateBackupCodes: () => Promise<any>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [mfaRequired, setMfaRequired] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      apiService.setToken(token)
      checkAuth()
    } else {
      setIsLoading(false)
    }
  }, [])

  const checkAuth = async () => {
    try {
      console.log("🔍 checkAuth - Token présent:", !!localStorage.getItem('auth_token'))
      const response = await apiService.checkAuth()
      console.log("📡 checkAuth - Réponse API:", response)
      
      if (response.success && response.user) {
        console.log("✅ checkAuth - Utilisateur trouvé:", response.user)
        setUser(response.user as User)
      } else {
        console.log("❌ checkAuth - Pas d'utilisateur ou échec")
        localStorage.removeItem('auth_token')
        apiService.setToken('')
      }
    } catch (error) {
      console.error('🚨 checkAuth - Erreur:', error)
      localStorage.removeItem('auth_token')
      apiService.setToken('')
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (credentials: { email: string; password: string }) => {
    try {
      setIsLoading(true)
      console.log('🔐 Tentative de connexion avec:', credentials)
      
      const response = await apiService.login(credentials)
      console.log('📡 Réponse API:', response)
      
      if (response.success && response.user) {
        setUser(response.user as User)
        console.log('✅ Connexion réussie:', response.user)
        toast.success("Connexion réussie", {
          description: `Bienvenue ${response.user.name}`,
        })
        
        // Redirection immédiate vers la page de sélection de boutique
        console.log('🔄 Redirection vers /store-selection après connexion')
        window.location.replace('/store-selection')
      } else {
        console.error('❌ Échec de la connexion:', response)
        throw new Error(response.message || "Échec de la connexion")
      }
    } catch (error: any) {
      console.error('🚨 Erreur de connexion:', error)
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
      console.error('Erreur lors de la déconnexion:', error)
    } finally {
      setUser(null)
      localStorage.removeItem('auth_token')
      apiService.setToken('')
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
      return response
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
      return response
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
    login,
    logout,
    register,
    verifyMfa,
    setupMfa,
    enableMfa,
    disableMfa,
    regenerateBackupCodes,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
