"use client"

import { useState, useEffect, createContext, useContext, type ReactNode } from "react"
import { apiClient } from "@/lib/api"
import { toast } from "sonner"
import type { User, LoginCredentials, RegisterData, MfaVerificationData, MfaSetupResponse } from "@/types/auth"

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  mfaRequired: boolean
  mfaToken: string | null
  backupCodesAvailable: boolean

  // Auth methods
  login: (credentials: LoginCredentials) => Promise<void>
  register: (userData: RegisterData) => Promise<void>
  verifyMfa: (data: MfaVerificationData) => Promise<void>
  logout: () => Promise<void>
  logoutAll: () => Promise<void>
  refreshUser: () => Promise<void>

  // MFA methods
  setupMfa: () => Promise<MfaSetupResponse>
  enableMfa: (code: string) => Promise<string[]>
  disableMfa: (password: string) => Promise<void>
  regenerateBackupCodes: () => Promise<string[]>

  // Reset MFA state
  resetMfaState: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [mfaRequired, setMfaRequired] = useState(false)
  const [mfaToken, setMfaToken] = useState<string | null>(null)
  const [backupCodesAvailable, setBackupCodesAvailable] = useState(false)

  const isAuthenticated = !!user && !mfaRequired

  const resetMfaState = () => {
    setMfaRequired(false)
    setMfaToken(null)
    setBackupCodesAvailable(false)
  }

  const login = async (credentials: LoginCredentials) => {
    try {
      setIsLoading(true)
      const response = await apiClient.login(credentials)

      if (response.mfa_required) {
        setMfaRequired(true)
        setMfaToken(response.mfa_token || null)
        setBackupCodesAvailable(response.backup_codes_available || false)

        toast.info("Code MFA requis", {
          description: "Veuillez entrer votre code d'authentification à deux facteurs",
        })
      } else {
        apiClient.setToken(response.token)
        setUser(response.user)
        resetMfaState()

        toast.success("Connexion réussie", {
          description: `Bienvenue ${response.user.name}!`,
        })
      }
    } catch (error: any) {
      toast.error("Erreur de connexion", {
        description: error.message || "Vérifiez vos identifiants",
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const verifyMfa = async (data: MfaVerificationData) => {
    try {
      setIsLoading(true)
      const response = await apiClient.verifyMfa(data)

      apiClient.setToken(response.token)
      setUser(response.user)
      resetMfaState()

      toast.success("Authentification réussie", {
        description: `Bienvenue ${response.user.name}!`,
      })
    } catch (error: any) {
      toast.error("Code invalide", {
        description: error.message || "Vérifiez votre code d'authentification",
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (userData: RegisterData) => {
    try {
      setIsLoading(true)
      const response = await apiClient.register(userData)

      // Si l'inscription retourne directement un token (pas de vérification email)
      if (response.token) {
        apiClient.setToken(response.token)
        setUser(response.user)
        resetMfaState()
      }

      toast.success("Inscription réussie", {
        description: response.message || `Bienvenue ${response.user.name}!`,
      })
    } catch (error: any) {
      toast.error("Erreur d'inscription", {
        description: error.message || "Vérifiez vos informations",
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      await apiClient.logout()
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      apiClient.removeToken()
      setUser(null)
      resetMfaState()
      toast.info("Déconnexion réussie")
    }
  }

  const logoutAll = async () => {
    try {
      await apiClient.logoutAll()
    } catch (error) {
      console.error("Logout all error:", error)
    } finally {
      apiClient.removeToken()
      setUser(null)
      resetMfaState()
      toast.info("Déconnexion de tous les appareils réussie")
    }
  }

  const refreshUser = async () => {
    try {
      const userData = await apiClient.getProfile()
      setUser(userData)
    } catch (error) {
      console.error("Failed to refresh user:", error)
      apiClient.removeToken()
      setUser(null)
      resetMfaState()
    }
  }

  const setupMfa = async (): Promise<MfaSetupResponse> => {
    try {
      const response = await apiClient.setupMfa()
      toast.info("Configuration MFA", {
        description: "Scannez le QR code avec votre application d'authentification",
      })
      return response
    } catch (error: any) {
      toast.error("Erreur configuration MFA", {
        description: error.message,
      })
      throw error
    }
  }

  const enableMfa = async (code: string): Promise<string[]> => {
    try {
      const response = await apiClient.enableMfa(code)

      // Refresh user to get updated mfa_enabled status
      await refreshUser()

      toast.success("MFA activé", {
        description: "Sauvegardez vos codes de récupération",
      })

      return response.backup_codes
    } catch (error: any) {
      toast.error("Erreur activation MFA", {
        description: error.message,
      })
      throw error
    }
  }

  const disableMfa = async (password: string): Promise<void> => {
    try {
      await apiClient.disableMfa(password)

      // Refresh user to get updated mfa_enabled status
      await refreshUser()

      toast.success("MFA désactivé", {
        description: "L'authentification à deux facteurs a été désactivée",
      })
    } catch (error: any) {
      toast.error("Erreur désactivation MFA", {
        description: error.message,
      })
      throw error
    }
  }

  const regenerateBackupCodes = async (): Promise<string[]> => {
    try {
      const response = await apiClient.regenerateBackupCodes()

      toast.success("Codes de récupération régénérés", {
        description: "Sauvegardez vos nouveaux codes de récupération",
      })

      return response.backup_codes
    } catch (error: any) {
      toast.error("Erreur régénération codes", {
        description: error.message,
      })
      throw error
    }
  }

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("auth_token")
      if (token) {
        apiClient.setToken(token)
        try {
          await refreshUser()
        } catch (error) {
          console.error("Auth initialization failed:", error)
        }
      }
      setIsLoading(false)
    }

    initAuth()
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated,
        mfaRequired,
        mfaToken,
        backupCodesAvailable,
        login,
        register,
        verifyMfa,
        logout,
        logoutAll,
        refreshUser,
        setupMfa,
        enableMfa,
        disableMfa,
        regenerateBackupCodes,
        resetMfaState,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
