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
import { toast } from "sonner"

interface CreateStoreDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onStoreCreated: (store: any) => void
}

const categories = [
  "Technologie",
  "Mode",
  "Maison & Jardin",
  "Sports & Loisirs",
  "Beauté & Santé",
  "Alimentation",
  "Livres & Médias",
  "Automobile",
  "Bijoux & Accessoires",
  "Autre",
]

export function CreateStoreDialog({ open, onOpenChange, onStoreCreated }: CreateStoreDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    email: "",
    phone: "",
    address: "",
    city: "",
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Simulation de création de boutique
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const newStore = {
        id: `store-${Date.now()}`,
        name: formData.name,
        slug: formData.name.toLowerCase().replace(/\s+/g, "-"),
        description: formData.description,
        ownerId: "user-1",
        ownerName: "Jean Dupont",
        category: formData.category,
        status: "pending" as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        settings: {
          currency: "FCFA",
          language: "fr",
          timezone: "Africa/Abidjan",
          allowReviews: true,
          requireApproval: false,
        },
        contact: {
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          country: "Côte d'Ivoire",
        },
        stats: {
          totalProducts: 0,
          totalOrders: 0,
          totalRevenue: 0,
          rating: 0,
          reviewCount: 0,
        },
      }

      onStoreCreated(newStore)
      onOpenChange(false)

      toast.success("Boutique créée avec succès!", {
        description: "Votre boutique a été créée et est en attente d'approbation.",
      })

      // Reset form
      setFormData({
        name: "",
        description: "",
        category: "",
        email: "",
        phone: "",
        address: "",
        city: "",
      })
    } catch (error) {
      toast.error("Erreur lors de la création", {
        description: "Une erreur est survenue lors de la création de votre boutique.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Créer une nouvelle boutique</DialogTitle>
          <DialogDescription>
            Remplissez les informations ci-dessous pour créer votre nouvelle boutique.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom de la boutique *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="Ma Super Boutique"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Catégorie *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une catégorie" />
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
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Décrivez votre boutique et ce que vous vendez..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email de contact *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                placeholder="contact@maboutique.com"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Téléphone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                placeholder="+225 01 02 03 04 05"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="address">Adresse</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
                placeholder="123 Rue de Commerce"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">Ville</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => setFormData((prev) => ({ ...prev, city: e.target.value }))}
                placeholder="Abidjan"
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
              Annuler
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Création..." : "Créer la boutique"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
