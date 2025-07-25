"use client"

import { useState, useEffect } from "react"
import { apiClient } from "@/lib/api"
import { toast } from "sonner"

interface Category {
  id: string
  name: string
  description?: string
  created_at: string
  updated_at: string
}

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchCategories = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await apiClient.getCategories()
      setCategories(response.data)
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue lors du chargement des catégories")
      toast.error("Erreur", {
        description: "Impossible de charger les catégories",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const createCategory = async (categoryData: { name: string; description?: string }) => {
    try {
      const response = await apiClient.createCategory(categoryData)
      setCategories((prev) => [...prev, response.data])
      toast.success("Catégorie créée", {
        description: `La catégorie ${response.data.name} a été créée avec succès`,
      })
      return response.data
    } catch (err: any) {
      toast.error("Erreur", {
        description: err.message || "Impossible de créer la catégorie",
      })
      throw err
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
  }
}
