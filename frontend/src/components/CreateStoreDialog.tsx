"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Building2, Globe, Tag, FileText, Plus } from "lucide-react"

interface CreateStoreDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onStoreCreated: (store: any) => void
}

export function CreateStoreDialog({ open, onOpenChange, onStoreCreated }: CreateStoreDialogProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    domain: "",
    category: "",
    website: "",
    phone: "",
    address: "",
  })

  const categories = [
    "Mode & Vêtements",
    "Électronique",
    "Maison & Jardin",
    "Beauté & Santé",
    "Sports & Loisirs",
    "Alimentation",
    "Livres & Médias",
    "Automobile",
    "Services",
    "Autre",
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    if (!formData.name.trim()) {
      setError("Le nom de la boutique est requis")
      setLoading(false)
      return
    }

    if (!formData.domain.trim()) {
      setError("Le domaine est requis")
      setLoading(false)
      return
    }

    try {
      const token = localStorage.getItem("auth_token")
      const response = await fetch("http://localhost:8000/api/stores", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const data = await response.json()
        onStoreCreated(data.data)
        setFormData({
          name: "",
          description: "",
          domain: "",
          category: "",
          website: "",
          phone: "",
          address: "",
        })
        onOpenChange(false)
      } else {
        const errorData = await response.json()
        setError(errorData.message || "Une erreur est survenue lors de la création.")
      }
    } catch (error) {
      setError("Une erreur est survenue lors de la création.")
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleCategoryChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      category: value,
    }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Créer une nouvelle boutique
          </DialogTitle>
          <DialogDescription>Remplissez les informations de base pour créer votre boutique</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="name">Nom de la boutique *</Label>
            <div className="relative">
              <Building2 className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="name"
                name="name"
                required
                className="pl-10"
                placeholder="Ma Super Boutique"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="domain">Domaine *</Label>
            <div className="relative">
              <Globe className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="domain"
                name="domain"
                required
                className="pl-10"
                placeholder="ma-boutique.com"
                value={formData.domain}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Textarea
                id="description"
                name="description"
                className="pl-10 min-h-[80px]"
                placeholder="Décrivez votre boutique..."
                value={formData.description}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Catégorie</Label>
            <div className="relative">
              <Tag className="absolute left-3 top-3 h-4 w-4 text-gray-400 z-10" />
              <Select value={formData.category} onValueChange={handleCategoryChange}>
                <SelectTrigger className="pl-10">
                  <SelectValue placeholder="Sélectionnez une catégorie" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="website">Site web</Label>
            <div className="relative">
              <Globe className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="website"
                name="website"
                type="url"
                className="pl-10"
                placeholder="https://www.monsite.com"
                value={formData.website}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Téléphone</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="+33 1 23 45 67 89"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Adresse</Label>
            <Input
              id="address"
              name="address"
              placeholder="123 Rue de la Paix, 75001 Paris"
              value={formData.address}
              onChange={handleChange}
            />
          </div>

          <DialogFooter className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
              Annuler
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Création...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Créer la boutique
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
