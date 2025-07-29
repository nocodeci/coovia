import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import { authService } from "../services/api"
import { toast } from "sonner"
import type { User, LoginCredentials, RegisterData } from "@/types/store"

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

interface AuthActions {
  login: (credentials: LoginCredentials) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => Promise<void>
  checkAuth: () => Promise<void>
  clearError: () => void
}

type AuthStore = AuthState & AuthActions

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      // État initial
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Actions
      login: async (credentials: LoginCredentials) => {
        try {
          set({ isLoading: true, error: null })

          const response = await authService.login(credentials)
          const { user, token } = response.data

          // Sauvegarder le token
          localStorage.setItem("auth_token", token)

          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          })

          toast.success("Connexion réussie!")
        } catch (error: any) {
          const message = error.response?.data?.message || "Erreur de connexion"
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: message,
          })
          toast.error(message)
          throw error
        }
      },

      register: async (data: RegisterData) => {
        try {
          set({ isLoading: true, error: null })

          const response = await authService.register(data)
          const { user, token } = response.data

          // Sauvegarder le token
          localStorage.setItem("auth_token", token)

          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          })

          toast.success("Inscription réussie!")
        } catch (error: any) {
          const message = error.response?.data?.message || "Erreur d'inscription"
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: message,
          })
          toast.error(message)
          throw error
        }
      },

      logout: async () => {
        try {
          await authService.logout()
        } catch (error) {
          // Ignorer les erreurs de logout côté serveur
          console.warn("Erreur lors du logout côté serveur:", error)
        } finally {
          // Nettoyer côté client dans tous les cas
          localStorage.removeItem("auth_token")
          localStorage.removeItem("user")
          localStorage.removeItem("current_store")
          localStorage.removeItem("selectedStoreId")

          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          })

          toast.success("Déconnexion réussie!")
        }
      },

      checkAuth: async () => {
        const token = localStorage.getItem("auth_token")
        if (!token) {
          set({ isAuthenticated: false, user: null, token: null })
          return
        }

        try {
          set({ isLoading: true })
          const response = await authService.me()
          const user = response.data

          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          })
        } catch (error) {
          // Token invalide, nettoyer
          localStorage.removeItem("auth_token")
          localStorage.removeItem("user")
          localStorage.removeItem("current_store")
          localStorage.removeItem("selectedStoreId")

          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          })
        }
      },

      clearError: () => {
        set({ error: null })
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
)
