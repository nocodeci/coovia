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
import apiService from "@/lib/api"
import { Store, Plus, MapPin, Phone, Mail, Building2, Sparkles } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

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
      console.log("🔄 Création de la boutique:", formData)
      
      const storeData = {
        name: formData.name,
        description: formData.description,
        category: formData.category,
        address: {
          street: formData.address,
          city: formData.city,
          country: "Côte d'Ivoire",
        },
        contact: {
          email: formData.email,
          phone: formData.phone,
        },
        settings: {
          currency: "XOF",
          language: "fr",
          timezone: "Africa/Abidjan",
        },
      }

      const response = await apiService.createStore(storeData)
      console.log("📡 Réponse API création boutique:", response)
      
      if (response.success && response.data) {
        onStoreCreated(response.data)
        onOpenChange(false)

        toast.success("Boutique créée avec succès!", {
          description: "Votre boutique a été créée et est maintenant active.",
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
      } else {
        throw new Error(response.message || "Erreur lors de la création de la boutique")
      }
    } catch (error: any) {
      console.error("🚨 Erreur lors de la création de la boutique:", error)
      toast.error("Erreur lors de la création", {
        description: error.message || "Une erreur est survenue lors de la création de votre boutique.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-center pb-6">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
            <Store className="w-8 h-8 text-white" />
          </div>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Créer votre boutique
          </DialogTitle>
          <DialogDescription className="text-gray-600 max-w-md mx-auto">
            Donnez vie à votre vision commerciale en créant votre boutique en ligne personnalisée
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Informations de base */}
          <Card className="border-0 shadow-sm bg-gradient-to-r from-blue-50 to-purple-50">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Building2 className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-gray-900">Informations de base</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                    Nom de la boutique <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="Ma Super Boutique"
                    className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category" className="text-sm font-medium text-gray-700">
                    Catégorie <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
                    required
                  >
                    <SelectTrigger className="border-gray-200 focus:border-blue-500 focus:ring-blue-500">
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

              <div className="space-y-2 mt-6">
                <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Décrivez votre boutique, vos produits et votre vision..."
                  rows={3}
                  className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 resize-none"
                />
              </div>
            </CardContent>
          </Card>

          {/* Informations de contact */}
          <Card className="border-0 shadow-sm bg-gradient-to-r from-green-50 to-blue-50">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Mail className="w-5 h-5 text-green-600" />
                <h3 className="font-semibold text-gray-900">Informations de contact</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Email de contact <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                      placeholder="contact@maboutique.com"
                      className="pl-10 border-gray-200 focus:border-green-500 focus:ring-green-500"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                    Téléphone
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                      placeholder="+225 01 02 03 04 05"
                      className="pl-10 border-gray-200 focus:border-green-500 focus:ring-green-500"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Adresse */}
          <Card className="border-0 shadow-sm bg-gradient-to-r from-orange-50 to-red-50">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-5 h-5 text-orange-600" />
                <h3 className="font-semibold text-gray-900">Adresse</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="address" className="text-sm font-medium text-gray-700">
                    Adresse
                  </Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
                    placeholder="123 Rue de Commerce"
                    className="border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city" className="text-sm font-medium text-gray-700">
                    Ville
                  </Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => setFormData((prev) => ({ ...prev, city: e.target.value }))}
                    placeholder="Abidjan"
                    className="border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Badge d'information */}
          <div className="flex items-center justify-center p-4 bg-blue-50 rounded-lg border border-blue-200">
            <Sparkles className="w-5 h-5 text-blue-600 mr-2" />
            <p className="text-sm text-blue-700">
              Votre boutique sera créée avec les paramètres par défaut optimisés pour la Côte d'Ivoire
            </p>
          </div>

          <DialogFooter className="pt-6 border-t border-gray-200">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)} 
              disabled={isLoading}
              className="px-6 py-2"
            >
              Annuler
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading}
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Création...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Créer la boutique
                </div>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
