"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import apiService from "@/lib/api"
import type { Category } from "@/types/categorie"

export function useCategorie() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchCategories = async () => {
    setIsLoading(true)
    setError(null)

    try {
      console.log("🔄 Chargement des catégories depuis l'API...")
      const response = await apiService.getCategories()
      console.log("📡 Réponse API catégories:", response)
      
      if (response.success && response.data) {
        setCategories(response.data as Category[])
      } else {
        console.error("❌ Erreur API catégories:", response.message)
        setError(response.message || "Une erreur est survenue lors du chargement des catégories")
        toast.error("Erreur", {
          description: "Impossible de charger les catégories",
        })
      }
    } catch (err: any) {
      console.error("🚨 Erreur lors du chargement des catégories:", err)
      setError(err.message || "Une erreur est survenue lors du chargement des catégories")
      toast.error("Erreur", {
        description: "Impossible de charger les catégories",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const createCategory = async (categoryData: { name: string; description?: string }) => {
    setIsLoading(true)
    try {
      console.log("🔄 Création de la catégorie:", categoryData)
      const response = await apiService.createCategory(categoryData)
      console.log("📡 Réponse API création catégorie:", response)
      
      if (response.success && response.data) {
        setCategories((prev) => [...prev, response.data as Category])
        toast.success("Catégorie créée", {
          description: `La catégorie ${(response.data as Category).name} a été créée avec succès`,
        })
        return response.data
      } else {
        throw new Error(response.message || "Impossible de créer la catégorie")
      }
    } catch (err: any) {
      console.error("🚨 Erreur lors de la création de la catégorie:", err)
      toast.error("Erreur", {
        description: err.message || "Impossible de créer la catégorie",
      })
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const updateCategory = async (categoryId: string, categoryData: Partial<Category>) => {
    setIsLoading(true)
    try {
      console.log("🔄 Mise à jour de la catégorie:", categoryId, categoryData)
      const response = await apiService.updateCategory(categoryId, categoryData)
      console.log("📡 Réponse API mise à jour catégorie:", response)
      
      if (response.success && response.data) {
        setCategories((prev) => prev.map((category) => (category.id === categoryId ? response.data as Category : category)))
        toast.success("Catégorie mise à jour", {
          description: `La catégorie ${(response.data as Category).name} a été mise à jour avec succès`,
        })
        return response.data
      } else {
        throw new Error(response.message || "Impossible de mettre à jour la catégorie")
      }
    } catch (err: any) {
      console.error("🚨 Erreur lors de la mise à jour de la catégorie:", err)
      toast.error("Erreur", {
        description: err.message || "Impossible de mettre à jour la catégorie",
      })
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const deleteCategory = async (categoryId: string) => {
    setIsLoading(true)
    try {
      console.log("🔄 Suppression de la catégorie:", categoryId)
      const response = await apiService.deleteCategory(categoryId)
      console.log("📡 Réponse API suppression catégorie:", response)
      
      if (response.success) {
        setCategories((prev) => prev.filter((category) => category.id !== categoryId))
        toast.success("Catégorie supprimée", {
          description: "La catégorie a été supprimée avec succès",
        })
      } else {
        throw new Error(response.message || "Impossible de supprimer la catégorie")
      }
    } catch (err: any) {
      console.error("🚨 Erreur lors de la suppression de la catégorie:", err)
      toast.error("Erreur", {
        description: err.message || "Impossible de supprimer la catégorie",
      })
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  return {
    categories,
    isLoading,
    error,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
  }
}
