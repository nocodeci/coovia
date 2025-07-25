"use client"

import { useState, useEffect } from "react"
import { apiClient } from "@/lib/api"
import { toast } from "sonner"

interface Product {
  id: string
  store_id: string
  name: string
  description: string
  price: number
  sale_price?: number | null
  cost_price?: number | null
  sku: string
  category: string
  subcategory?: string
  stock_quantity: number
  min_stock_level: number
  status: "active" | "inactive" | "draft"
  images: string[]
  files: Array<{
    name: string
    url: string
    size: number
    type: string
  }>
  attributes: Record<string, any>
  seo: {
    meta_title?: string
    meta_description?: string
  }
  created_at: string
  updated_at: string
}

interface ProductsFilter {
  search?: string
  category?: string
  status?: string
  min_price?: number
  max_price?: number
  in_stock?: boolean
  sort_by?: string
  sort_direction?: "asc" | "desc"
}

export function useProducts(storeId: string) {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<ProductsFilter>({})

  const fetchProducts = async (filters: ProductsFilter = {}) => {
    if (!storeId) return

    setIsLoading(true)
    setError(null)

    try {
      const params: Record<string, string> = {}

      if (filters.search) params.search = filters.search
      if (filters.category) params.category = filters.category
      if (filters.status) params.status = filters.status
      if (filters.min_price) params.min_price = filters.min_price.toString()
      if (filters.max_price) params.max_price = filters.max_price.toString()
      if (filters.in_stock !== undefined) params.in_stock = filters.in_stock.toString()
      if (filters.sort_by) params.sort_by = filters.sort_by
      if (filters.sort_direction) params.sort_direction = filters.sort_direction

      const response = await apiClient.getProducts(storeId, params)
      setProducts(response.data)
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue lors du chargement des produits")
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

  const applyFilters = (newFilters: ProductsFilter) => {
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
