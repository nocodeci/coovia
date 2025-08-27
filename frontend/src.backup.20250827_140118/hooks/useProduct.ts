"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { toast } from "sonner"
import apiService from "@/lib/api"

interface Product {
  id: string
  name: string
  description: string
  price: number
  compare_price?: number
  sale_price?: number
  sku?: string
  stock_quantity?: number
  min_stock_level?: number
  images: string[]
  files?: string[]
  category: string
  tags: string[]
  status: "active" | "inactive" | "draft"
  inventory: {
    quantity: number
    low_stock_threshold: number
  }
  store_id: string
  created_at: string
  updated_at: string
  attributes?: any
  seo?: any
}

export function useProduct(storeId?: string) {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const isFetchingRef = useRef(false)

  const fetchProducts = useCallback(async () => {
    if (!storeId) return
    
    // Éviter les appels répétés
    if (isFetchingRef.current) return
    
    isFetchingRef.current = true
    setIsLoading(true)
    setError(null)

    try {
      console.log("🔄 Chargement des produits pour la boutique:", storeId)
      const response = await apiService.getStoreProducts(storeId)
      console.log("📡 Réponse API produits:", response)
      
      if (response.success && response.data) {
        setProducts(response.data as Product[])
      } else {
        console.error("❌ Erreur API produits:", response.message)
        setError(response.message || "Une erreur est survenue lors du chargement des produits")
        toast.error("Erreur", {
          description: "Impossible de charger les produits",
        })
      }
    } catch (err: any) {
      console.error("🚨 Erreur lors du chargement des produits:", err)
      setError(err.message || "Une erreur est survenue lors du chargement des produits")
      toast.error("Erreur", {
        description: "Impossible de charger les produits",
      })
    } finally {
      setIsLoading(false)
      isFetchingRef.current = false
    }
  }, [storeId])

  const createProduct = async (productData: Omit<Product, "id" | "created_at" | "updated_at" | "store_id">) => {
    if (!storeId) throw new Error("Store ID is required")

    setIsLoading(true)
    try {
      console.log("🔄 Création du produit:", productData)
      const response = await apiService.createProduct(storeId, productData)
      console.log("📡 Réponse API création produit:", response)
      
      if (response.success && response.data) {
        setProducts((prev) => [...prev, response.data as Product])
        toast.success("Produit créé", {
          description: `Le produit ${(response.data as Product).name} a été créé avec succès`,
        })
        return response.data
      } else {
        throw new Error(response.message || "Impossible de créer le produit")
      }
    } catch (err: any) {
      console.error("🚨 Erreur lors de la création du produit:", err)
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
      console.log("🔄 Mise à jour du produit:", productId, productData)
      const response = await apiService.updateProduct(productId, productData)
      console.log("📡 Réponse API mise à jour produit:", response)
      
      if (response.success && response.data) {
        setProducts((prev) => prev.map((product) => (product.id === productId ? response.data as Product : product)))
        toast.success("Produit mis à jour", {
          description: `Le produit ${(response.data as Product).name} a été mis à jour avec succès`,
        })
        return response.data
      } else {
        throw new Error(response.message || "Impossible de mettre à jour le produit")
      }
    } catch (err: any) {
      console.error("🚨 Erreur lors de la mise à jour du produit:", err)
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
      console.log("🔄 Suppression du produit:", productId)
      const response = await apiService.deleteProduct(productId)
      console.log("📡 Réponse API suppression produit:", response)
      
      if (response.success) {
        setProducts((prev) => prev.filter((product) => product.id !== productId))
        toast.success("Produit supprimé", {
          description: "Le produit a été supprimé avec succès",
        })
      } else {
        throw new Error(response.message || "Impossible de supprimer le produit")
      }
    } catch (err: any) {
      console.error("🚨 Erreur lors de la suppression du produit:", err)
      toast.error("Erreur", {
        description: err.message || "Impossible de supprimer le produit",
      })
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (storeId) {
      fetchProducts()
    }
  }, [storeId, fetchProducts])

  const uploadProductImage = async (productId: string, file: File) => {
    // Placeholder implementation
    console.log("🔄 Upload image for product:", productId, file.name)
    return "https://example.com/image.jpg"
  }

  const uploadProductFiles = async (productId: string, files: File[]) => {
    // Placeholder implementation
    console.log("🔄 Upload files for product:", productId, files.length, "files")
    return files.map(file => `https://example.com/files/${file.name}`)
  }

  return {
    products,
    isLoading,
    error,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    uploadProductImage,
    uploadProductFiles,
  }
}
