import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/lib/react-query-client'
import apiService from '@/lib/api'

// Interface pour l'utilisateur
export interface User {
  id: string
  name: string
  email: string
  role: string
  created_at: string
  updated_at: string
}

// Hook pour vérifier l'authentification
export const useAuth = () => {
  return useQuery({
    queryKey: queryKeys.auth.check,
    queryFn: async (): Promise<User | null> => {
      const response = await apiService.checkAuth()
      if (!response.success || !response.user) {
        return null
      }
      return response.user as User
    },
    staleTime: 60 * 60 * 1000, // 1 heure
    gcTime: 2 * 60 * 60 * 1000, // 2 heures
    retry: 1,
    retryDelay: 1000,
  })
}

// Hook pour la connexion
export const useLogin = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      const response = await apiService.login(credentials)
      if (!response.success || !response.user) {
        throw new Error(response.message || 'Échec de la connexion')
      }
      return response.user as User
    },
    onSuccess: (user) => {
      // Mettre à jour le cache d'authentification
      queryClient.setQueryData(queryKeys.auth.check, user)
      queryClient.setQueryData(queryKeys.auth.user, user)
    },
  })
}

// Hook pour la déconnexion
export const useLogout = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      const response = await apiService.logout()
      if (!response.success) {
        throw new Error(response.message || 'Erreur lors de la déconnexion')
      }
      return response
    },
    onSuccess: () => {
      // Nettoyer tous les caches
      queryClient.clear()
    },
  })
}

// Hook pour l'inscription
export const useRegister = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (userData: any) => {
      const response = await apiService.register(userData)
      if (!response.success || !response.user) {
        throw new Error(response.message || 'Échec de l\'inscription')
      }
      return response.user as User
    },
    onSuccess: (user) => {
      // Mettre à jour le cache d'authentification
      queryClient.setQueryData(queryKeys.auth.check, user)
      queryClient.setQueryData(queryKeys.auth.user, user)
    },
  })
}

// Hook pour rafraîchir l'authentification
export const useRefreshAuth = () => {
  const queryClient = useQueryClient()

  return {
    refreshAuth: () => queryClient.invalidateQueries({ queryKey: queryKeys.auth.check }),
  }
} 