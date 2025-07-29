import { create } from "zustand"
import { storeService } from "../services/api"
import type { Store, StoreStats, CreateStoreData, UpdateStoreData } from "@/types/store"

interface StoreState {
  stores: Store[]
  currentStore: Store | null
  storeStats: StoreStats | null
  loading: boolean
  error: string | null
}

interface StoreActions {
  fetchStores: () => Promise<void>
  fetchStore: (id: string) => Promise<void>
  createStore: (data: CreateStoreData) => Promise<Store>
  updateStore: (id: string, data: UpdateStoreData) => Promise<void>
  deleteStore: (id: string) => Promise<void>
  toggleStoreStatus: (id: string) => Promise<void>
  fetchStoreDashboard: (id: string) => Promise<void>
  setCurrentStore: (store: Store | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  clearError: () => void
}

type StoreStore = StoreState & StoreActions

export const useStoreStore = create<StoreStore>((set, get) => ({
  // État initial
  stores: [],
  currentStore: null,
  storeStats: null,
  loading: false,
  error: null,

  // Actions
  fetchStores: async () => {
    try {
      set({ loading: true, error: null })
      const stores = await storeService.getStores()
      set({ stores, loading: false })
    } catch (error: any) {
      set({
        loading: false,
        error: error.response?.data?.message || "Erreur lors du chargement des boutiques",
      })
      throw error
    }
  },

  fetchStore: async (id: string) => {
    try {
      set({ loading: true, error: null })
      const store = await storeService.getStore(id)
      set({ currentStore: store, loading: false })
    } catch (error: any) {
      set({
        loading: false,
        error: error.response?.data?.message || "Erreur lors du chargement de la boutique",
      })
      throw error
    }
  },

  createStore: async (data: CreateStoreData) => {
    try {
      set({ loading: true, error: null })
      const newStore = await storeService.createStore(data)
      const { stores } = get()
      set({
        stores: [...stores, newStore],
        loading: false,
      })
      return newStore
    } catch (error: any) {
      set({
        loading: false,
        error: error.response?.data?.message || "Erreur lors de la création de la boutique",
      })
      throw error
    }
  },

  updateStore: async (id: string, data: UpdateStoreData) => {
    try {
      set({ loading: true, error: null })
      const updatedStore = await storeService.updateStore(id, data)
      const { stores } = get()
      set({
        stores: stores.map((store) => (store.id.toString() === id ? updatedStore : store)),
        currentStore: updatedStore,
        loading: false,
      })
    } catch (error: any) {
      set({
        loading: false,
        error: error.response?.data?.message || "Erreur lors de la mise à jour de la boutique",
      })
      throw error
    }
  },

  deleteStore: async (id: string) => {
    try {
      set({ loading: true, error: null })
      await storeService.deleteStore(id)
      const { stores } = get()
      set({
        stores: stores.filter((store) => store.id.toString() !== id),
        loading: false,
      })
    } catch (error: any) {
      set({
        loading: false,
        error: error.response?.data?.message || "Erreur lors de la suppression de la boutique",
      })
      throw error
    }
  },

  toggleStoreStatus: async (id: string) => {
    try {
      set({ loading: true, error: null })
      const updatedStore = await storeService.toggleStoreStatus(id)
      const { stores } = get()
      set({
        stores: stores.map((store) => (store.id.toString() === id ? updatedStore : store)),
        loading: false,
      })
    } catch (error: any) {
      set({
        loading: false,
        error: error.response?.data?.message || "Erreur lors du changement de statut",
      })
      throw error
    }
  },

  fetchStoreDashboard: async (id: string) => {
    try {
      set({ loading: true, error: null })
      const storeStats = await storeService.getStoreDashboard(id)
      set({ storeStats, loading: false })
    } catch (error: any) {
      set({
        loading: false,
        error: error.response?.data?.message || "Erreur lors du chargement du dashboard",
      })
      throw error
    }
  },

  setCurrentStore: (store: Store | null) => set({ currentStore: store }),
  setLoading: (loading: boolean) => set({ loading }),
  setError: (error: string | null) => set({ error }),
  clearError: () => set({ error: null }),
}))
