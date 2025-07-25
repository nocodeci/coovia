"use client"

import { useState, useEffect, createContext, useContext, type ReactNode } from "react"
import { apiClient } from "@/lib/api"
import { toast } from "sonner"

interface User {
  id: string
  name: string
  email: string
  phone?: string
  avatar?: string
  email_verified_at?: string
  created_at: string
  updated_at: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  register: (userData: {
    name: string
    email: string
    password: string
    password_confirmation: string
    phone?: string
  }) => Promise<void>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const isAuthenticated = !!user

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true)
      const response = await apiClient.login({ email, password })

      apiClient.setToken(response.data.token)
      setUser(response.data.user)

      toast.success("Connexion réussie", {
        description: `Bienvenue ${response.data.user.name}!`,
      })
    } catch (error: any) {
      toast.error("Erreur de connexion", {
        description: error.message || "Vérifiez vos identifiants",
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (userData: {
    name: string
    email: string
    password: string
    password_confirmation: string
    phone?: string
  }) => {
    try {
      setIsLoading(true)
      const response = await apiClient.register(userData)

      apiClient.setToken(response.data.token)
      setUser(response.data.user)

      toast.success("Inscription réussie", {
        description: `Bienvenue ${response.data.user.name}!`,
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
      toast.info("Déconnexion réussie")
    }
  }

  const refreshUser = async () => {
    try {
      const response = await apiClient.getProfile()
      setUser(response.data)
    } catch (error) {
      console.error("Failed to refresh user:", error)
      // Si l'utilisateur n'est plus valide, on le déconnecte
      apiClient.removeToken()
      setUser(null)
    }
  }

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("auth_token")
      if (token) {
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
        login,
        register,
        logout,
        refreshUser,
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
