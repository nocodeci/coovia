"use client"

import { useState, useEffect } from "react"
import { apiClient } from "@/lib/api"
import { toast } from "sonner"
import type { Product, ProductFilters } from "@/types/store"

export function useProducts(storeId: string) {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<ProductFilters>({})

  const fetchProducts = async (newFilters: ProductFilters = {}) => {
    if (!storeId) return

    setIsLoading(true)
    setError(null)

    try {
      const params: Record<string, string> = {}

      if (newFilters.search) params.search = newFilters.search
      if (newFilters.category) params.category = newFilters.category
      if (newFilters.status) params.status = newFilters.status
      if (newFilters.min_price) params.min_price = newFilters.min_price.toString()
      if (newFilters.max_price) params.max_price = newFilters.max_price.toString()
      if (newFilters.in_stock !== undefined) params.in_stock = newFilters.in_stock.toString()
      if (newFilters.is_featured !== undefined) params.is_featured = newFilters.is_featured.toString()
      if (newFilters.type) params.type = newFilters.type
      if (newFilters.sort_by) params.sort_by = newFilters.sort_by
      if (newFilters.sort_direction) params.sort_direction = newFilters.sort_direction

      const response = await apiClient.getProducts(storeId, params)
      setProducts(response.data)
    } catch (err: any) {
      const errorMessage = err.message || "Une erreur est survenue lors du chargement des produits"
      setError(errorMessage)
      toast.error("Erreur", {
        description: "Impossible de charger les produits",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const createProduct = async (productData: Omit<Product, "id" | "created_at" | "updated_at">) => {
    setIsLoading(true)
    try {
      const response = await apiClient.createProduct(storeId, productData)
      setProducts((prev) => [...prev, response.data])
      toast.success("Produit créé", {
        description: `Le produit ${response.data.name} a été créé avec succès`,
      })
      return response.data
    } catch (err: any) {
      toast.error("Erreur", {
        description: err.message || "Impossible de créer le produit",
      })
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const updateProduct = async (productId: string, productData: Partial<Product>) => {
    setIsLoading(true)
    try {
      const response = await apiClient.updateProduct(storeId, productId, productData)
      setProducts((prev) => prev.map((product) => (product.id === productId ? response.data : product)))
      toast.success("Produit mis à jour", {
        description: `Le produit ${response.data.name} a été mis à jour avec succès`,
      })
      return response.data
    } catch (err: any) {
      toast.error("Erreur", {
        description: err.message || "Impossible de mettre à jour le produit",
      })
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const deleteProduct = async (productId: string) => {
    setIsLoading(true)
    try {
      await apiClient.deleteProduct(storeId, productId)
      setProducts((prev) => prev.filter((product) => product.id !== productId))
      toast.success("Produit supprimé", {
        description: "Le produit a été supprimé avec succès",
      })
    } catch (err: any) {
      toast.error("Erreur", {
        description: err.message || "Impossible de supprimer le produit",
      })
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const uploadProductImage = async (productId: string, file: File) => {
    try {
      const response = await apiClient.uploadProductImage(storeId, productId, file)
      toast.success("Image téléchargée", {
        description: "L'image du produit a été téléchargée avec succès",
      })
      return response.data.url
    } catch (err: any) {
      toast.error("Erreur", {
        description: err.message || "Impossible de télécharger l'image",
      })
      throw err
    }
  }

  const uploadProductFiles = async (productId: string, files: File[]) => {
    try {
      const response = await apiClient.uploadProductFiles(storeId, productId, files)
      toast.success("Fichiers téléchargés", {
        description: `${files.length} fichier(s) téléchargé(s) avec succès`,
      })
      return response.data.files
    } catch (err: any) {
      toast.error("Erreur", {
        description: err.message || "Impossible de télécharger les fichiers",
      })
      throw err
    }
  }

  const applyFilters = (newFilters: ProductFilters) => {
    const updatedFilters = { ...filters, ...newFilters }
    setFilters(updatedFilters)
    fetchProducts(updatedFilters)
  }

  const clearFilters = () => {
    setFilters({})
    fetchProducts({})
  }

  useEffect(() => {
    if (storeId) {
      fetchProducts(filters)
    }
  }, [storeId])

  return {
    products,
    isLoading,
    error,
    filters,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    uploadProductImage,
    uploadProductFiles,
    applyFilters,
    clearFilters,
  }
}
