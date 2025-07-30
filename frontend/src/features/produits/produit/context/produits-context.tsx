"use client"

import type React from "react"
import { createContext, useContext, useState, useCallback } from "react"

interface ProductState {
  productName: string
  selectedType: string
  category: string
  price: string
  description: string
  promotionalPrice: string
  uploadedFiles: any[]
  featuredImage: string | null
  isFormValid: boolean
  hasUnsavedChanges: boolean
}

interface ProductContextValue {
  productState: ProductState
  updateProductName: (name: string) => void
  updateSelectedType: (type: string) => void
  updateCategory: (category: string) => void
  updatePrice: (price: string) => void
  updateDescription: (description: string) => void
  updatePromotionalPrice: (price: string) => void
  updateUploadedFiles: (files: any[]) => void
  updateFeaturedImage: (image: string | null) => void
  updateFormValidity: (isValid: boolean) => void
  markAsChanged: () => void
  resetForm: () => void
  saveProduct: () => void
}

const ProductContext = createContext<ProductContextValue | undefined>(undefined)

const initialState: ProductState = {
  productName: "",
  selectedType: "telechargeable",
  category: "",
  price: "",
  description: "",
  promotionalPrice: "",
  uploadedFiles: [],
  featuredImage: null,
  isFormValid: false,
  hasUnsavedChanges: false,
}

export function ProductProvider({ children }: { children: React.ReactNode }) {
  const [productState, setProductState] = useState<ProductState>(initialState)

  const updateProductName = useCallback((name: string) => {
    setProductState((prev) => ({
      ...prev,
      productName: name,
      hasUnsavedChanges: true,
      isFormValid: !!(name && prev.category && prev.selectedType),
    }))
  }, [])

  const updateSelectedType = useCallback((type: string) => {
    setProductState((prev) => ({
      ...prev,
      selectedType: type,
      hasUnsavedChanges: true,
      isFormValid: !!(prev.productName && prev.category && type),
    }))
  }, [])

  const updateCategory = useCallback((category: string) => {
    setProductState((prev) => ({
      ...prev,
      category,
      hasUnsavedChanges: true,
      isFormValid: !!(prev.productName && category && prev.selectedType),
    }))
  }, [])

  const updatePrice = useCallback((price: string) => {
    setProductState((prev) => ({
      ...prev,
      price,
      hasUnsavedChanges: true,
    }))
  }, [])

  const updateDescription = useCallback((description: string) => {
    setProductState((prev) => ({
      ...prev,
      description,
      hasUnsavedChanges: true,
    }))
  }, [])

  const updatePromotionalPrice = useCallback((price: string) => {
    setProductState((prev) => ({
      ...prev,
      promotionalPrice: price,
      hasUnsavedChanges: true,
    }))
  }, [])

  const updateUploadedFiles = useCallback((files: any[]) => {
    setProductState((prev) => ({
      ...prev,
      uploadedFiles: files,
      hasUnsavedChanges: true,
    }))
  }, [])

  const updateFeaturedImage = useCallback((image: string | null) => {
    setProductState((prev) => ({
      ...prev,
      featuredImage: image,
      hasUnsavedChanges: true,
    }))
  }, [])

  const updateFormValidity = useCallback((isValid: boolean) => {
    setProductState((prev) => ({
      ...prev,
      isFormValid: isValid,
    }))
  }, [])

  const markAsChanged = useCallback(() => {
    setProductState((prev) => ({
      ...prev,
      hasUnsavedChanges: true,
    }))
  }, [])

  const resetForm = useCallback(() => {
    setProductState(initialState)
  }, [])

  const saveProduct = useCallback(() => {
    setProductState((prev) => ({
      ...prev,
      hasUnsavedChanges: false,
    }))
  }, [])

  const value: ProductContextValue = {
    productState,
    updateProductName,
    updateSelectedType,
    updateCategory,
    updatePrice,
    updateDescription,
    updatePromotionalPrice,
    updateUploadedFiles,
    updateFeaturedImage,
    updateFormValidity,
    markAsChanged,
    resetForm,
    saveProduct,
  }

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>
}

export function useProductContext(): ProductContextValue {
  const context = useContext(ProductContext)
  if (!context) {
    throw new Error("useProductContext must be used within a ProductProvider")
  }
  return context
}
