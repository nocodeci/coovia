"use client"

import React, { useState } from "react"
import { useNavigate } from "@tanstack/react-router"
import { useAuth } from "@/hooks/useAuthQuery"
import { storeService } from "@/services/storeService"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"

import { CheckCircle2, ArrowLeft, ArrowRight, Store, Plus } from "lucide-react"

export function CreateStore() {
  const navigate = useNavigate()
  const { data: user, isLoading: authLoading } = useAuth()
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [slugAvailability, setSlugAvailability] = useState<{
    checking: boolean
    available: boolean | null
    suggestions: string[]
  }>({
    checking: false,
    available: null,
    suggestions: []
  })

  // Debounce pour éviter les appels trop fréquents
  const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(null)
  
  // Form data
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    logo: null as File | null,
    category: "digital",
    productType: "",
    productCategories: [] as string[],
    address: {
      street: "",
      city: "",
      country: "Côte d'Ivoire",
    },
    contact: {
      email: "",
      phone: "",
    },
    settings: {
      digitalDelivery: true,
      autoDelivery: true,
      paymentMethods: ["wozif"],
      currency: "XOF",
      monneroo: {
        enabled: false,
        secretKey: "",
        environment: "sandbox",
      },
    },
  })

  // Rediriger silencieusement si l'utilisateur n'est pas connecté
  React.useEffect(() => {
    if (!authLoading && !user) {
      navigate({ to: '/sign-in' })
    }
  }, [user, authLoading, navigate])

  // Cleanup du timeout au démontage du composant
  React.useEffect(() => {
    return () => {
      if (debounceTimeout) {
        clearTimeout(debounceTimeout)
      }
    }
  }, [debounceTimeout])

  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const updateNestedField = (parent: string, field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [parent]: {
        ...(prev[parent as keyof typeof prev] as any),
        [field]: value,
      },
    }))
  }

  // Générer automatiquement un slug basé sur le nom
  const generateSlug = (name: string) => {
    return name.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
  }

  // Vérifier la disponibilité du slug
  const checkSlugAvailability = async (slug: string) => {
    if (!slug.trim() || slug.length < 3) {
      return { available: false, message: 'Slug trop court' }
    }

    // Si l'utilisateur n'est pas encore authentifié, ne pas vérifier
    if (!user || authLoading) {
      return { available: null, message: 'Vérification en cours...' }
    }

    try {
      const token = localStorage.getItem('sanctum_token')
      const headers: Record<string, string> = {
          'Accept': 'application/json'
        }
      
      // Ajouter le token d'authentification si disponible
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }
      
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://api.wozif.com/api'}/stores/subdomain/${slug}/check`, {
        headers
      })
      
      if (!response.ok) {
        if (response.status === 401) {
          return { available: null, message: 'Authentification requise' }
        }
        throw new Error(`Erreur de vérification (${response.status})`)
      }
      
      const data = await response.json()
      
      console.log('🔍 Réponse vérification slug:', data)
      
      return {
        available: data.success && !data.data?.exists,
        message: data.data?.message || 'Vérification terminée'
      }
    } catch (error) {
      console.error('Erreur lors de la vérification du slug:', error)
      return { available: null, message: 'Erreur de vérification' }
    }
  }

  // Générer des suggestions de slugs
  const generateSuggestions = (baseSlug: string): string[] => {
    const suggestions = []
    const base = baseSlug.replace(/-[0-9]+$/, '') // Enlever les chiffres à la fin
    
    // Ajouter des suffixes numériques
    for (let i = 1; i <= 5; i++) {
      suggestions.push(`${base}-${i}`)
    }
    
    // Ajouter des suffixes descriptifs
    const suffixes = ['pro', 'store', 'shop', 'digital', 'online']
    suffixes.forEach(suffix => {
      suggestions.push(`${base}-${suffix}`)
    })
    
    return suggestions.slice(0, 8) // Limiter à 8 suggestions
  }

  // Vérifier la disponibilité et mettre à jour le state avec debounce
  const checkSlugAvailabilityAndUpdate = async (slug: string) => {
    // Annuler le timeout précédent
    if (debounceTimeout) {
      clearTimeout(debounceTimeout)
    }
    
    // Créer un nouveau timeout
    const timeout = setTimeout(async () => {
      if (!slug.trim() || slug.length < 3) {
        setSlugAvailability({
          checking: false,
          available: null,
          suggestions: []
        })
        return
      }
      
      setSlugAvailability(prev => ({ ...prev, checking: true }))
      
      try {
        const result = await checkSlugAvailability(slug)
        console.log('🔍 Résultat vérification:', result)
        
        if (result.available === true) {
          setSlugAvailability({
            checking: false,
            available: true,
            suggestions: []
          })
        } else if (result.available === false) {
          // Générer des suggestions si le slug n'est pas disponible
          const suggestions = generateSuggestions(slug)
          setSlugAvailability({
            checking: false,
            available: false,
            suggestions
          })
        } else {
          // Cas où available est null (erreur ou vérification en cours)
          setSlugAvailability({
            checking: false,
            available: null,
            suggestions: []
          })
        }
      } catch (error) {
        console.error('❌ Erreur lors de la vérification:', error)
        setSlugAvailability({
          checking: false,
          available: null,
          suggestions: []
        })
      }
    }, 500) // Attendre 500ms avant de vérifier
    
    setDebounceTimeout(timeout)
  }

  const nextStep = () => {
    // Validation pour l'étape 1
    if (currentStep === 1) {
      if (!formData.name.trim()) {
        toast.error('Nom de boutique requis', {
          description: 'Veuillez saisir le nom de votre boutique.'
        })
        return
      }
      if (!formData.slug.trim()) {
        toast.error('Sous-domaine requis', {
          description: 'Veuillez saisir le sous-domaine de votre boutique.'
        })
        return
      }
      // Ne pas bloquer si l'utilisateur n'est pas encore authentifié
      if (user && slugAvailability.available === false) {
        toast.error('Sous-domaine indisponible', {
          description: 'Veuillez choisir un autre sous-domaine.'
        })
        return
      }
    }
    
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    
    try {
      // Validation finale avant création
      if (!formData.name.trim()) {
        throw new Error('Le nom de la boutique est requis')
      }
      
      if (!formData.slug.trim()) {
        throw new Error('Le sous-domaine de la boutique est requis')
      }
      
      if (slugAvailability.available === false) {
        throw new Error('Le sous-domaine sélectionné n\'est pas disponible')
      }
      
      // Vérifier l'authentification
      const token = localStorage.getItem('sanctum_token')
      if (!token || !user) {
        toast.error('Authentification requise', {
          description: 'Veuillez vous connecter pour créer une boutique.'
        })
        navigate({ to: '/sign-in' })
        return
      }
      
      // Préparer les données pour l'envoi
      const storeData = { ...formData }
      
      // Si un logo a été sélectionné, l'uploader vers Cloudflare d'abord
      if (formData.logo) {
        try {
          console.log("📤 Upload du logo vers Cloudflare...")
          
          // Créer un FormData pour l'upload du logo
          const logoFormData = new FormData()
          logoFormData.append('image', formData.logo)
          logoFormData.append('path', 'stores/logos')
          
          // Upload vers l'API Cloudflare
          const uploadResponse = await fetch(`${import.meta.env.VITE_API_URL || 'http://api.wozif.com/api'}/files/upload-image`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Accept': 'application/json',
            },
            body: logoFormData
          })
          
          if (!uploadResponse.ok) {
            const errorText = await uploadResponse.text()
            console.error("❌ Erreur upload response:", uploadResponse.status, errorText)
            
            if (uploadResponse.status === 401) {
              throw new Error('Session expirée. Veuillez vous reconnecter.')
            } else if (uploadResponse.status === 500) {
              throw new Error('Erreur serveur lors de l\'upload. Veuillez réessayer.')
      } else {
              throw new Error(`Erreur lors de l'upload du logo (${uploadResponse.status})`)
            }
          }
          
          const uploadResult = await uploadResponse.json()
          
          if (uploadResult.success) {
            // Remplacer le File par l'URL Cloudflare
            storeData.logo = uploadResult.original_url
            console.log("✅ Logo uploadé avec succès:", uploadResult.original_url)
        } else {
            throw new Error(uploadResult.message || 'Erreur lors de l\'upload du logo')
          }
        } catch (uploadError) {
          console.error("❌ Erreur upload logo:", uploadError)
          
          // Si l'upload échoue, on peut continuer sans logo
          console.log("⚠️ Continuation sans logo...")
          storeData.logo = null
          
          // Ne pas bloquer la création si l'upload échoue
          // throw new Error(`Impossible d'uploader le logo: ${uploadError.message}`)
        }
      }
      
      // Créer la boutique avec les données mises à jour
      console.log("🏪 Création de la boutique...")
      const response = await storeService.createStore(storeData)
      
      if (response.success) {
        console.log("✅ Boutique créée avec succès!")
        toast.success('Boutique créée avec succès!', {
          description: `Votre boutique "${formData.name}" est maintenant active.`
        })
        navigate({ to: '/store-selection' })
      } else {
        console.error("❌ Erreur lors de la création:", response.message)
        throw new Error(response.message || 'Erreur lors de la création de la boutique')
      }
    } catch (error) {
      console.error("❌ Erreur création boutique:", error)
      toast.error('Erreur lors de la création', {
        description: error.message || 'Une erreur est survenue lors de la création de la boutique'
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Afficher le formulaire même pendant la vérification d'authentification
  // L'authentification sera vérifiée lors de la soumission

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
            {/* Éléments décoratifs animés */}
            <div className="absolute inset-0">
              <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute top-3/4 right-1/4 w-48 h-48 bg-purple-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
              <div className="absolute bottom-1/4 left-1/3 w-56 h-56 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
              <div className="absolute top-1/2 right-1/3 w-40 h-40 bg-orange-500/20 rounded-full blur-3xl animate-pulse delay-500"></div>
              <div className="absolute bottom-1/3 right-1/2 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1500"></div>
            </div>

            <div className="absolute inset-0 opacity-5 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIxIi8+PC9nPjwvZz48L3N2Zz4=')]"></div>

            <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
              {/* Logo en haut à gauche */}
              <div className="absolute top-4 left-4">
                <img
                  src="/assets/images/logo.svg"
                  alt="Coovia"
                  className="h-8 w-auto"
                  onError={(e) => {
                    console.error('Erreur de chargement du logo')
                    const target = e.target as HTMLImageElement
                    target.style.display = 'none'
                    const fallback = document.createElement('div')
                    fallback.className = 'h-8 flex items-center justify-center text-lg font-bold text-white bg-white/10 px-3 rounded-lg'
                    fallback.textContent = 'COOVIA'
                    target.parentNode?.appendChild(fallback)
                  }}
                />
              </div>
              
              <div className="w-full max-w-md space-y-6 bg-white rounded-xl p-6 shadow-2xl">
            <div className="text-center space-y-2">
                  <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden border border-gray-200">
                {formData.logo ? (
                  <img
                        src={URL.createObjectURL(formData.logo) || "/placeholder.svg"}
                    alt="Logo de la boutique"
                    className="w-full h-full object-cover"
                  />
                ) : (
                      <Store className="w-6 h-6 text-gray-600" />
                )}
              </div>
                  <h2 className="text-xl font-semibold tracking-tight text-gray-900">Créer votre boutique</h2>
                  <p className="text-sm text-gray-600">Informations de base</p>
            </div>

                <Card className="bg-white border border-gray-200 shadow-sm">
                  <CardContent className="p-4 space-y-4">
                <div className="space-y-2">
                      <Label htmlFor="logo" className="text-sm text-gray-700">
                        Logo
                      </Label>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden border border-gray-200">
                      {formData.logo ? (
                        <img
                              src={URL.createObjectURL(formData.logo) || "/placeholder.svg"}
                          alt="Logo de la boutique"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                            <Store className="w-6 h-6 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <Input
                        id="logo"
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                                updateFormData("logo", file)
                          }
                        }}
                            className="text-xs"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                      <Label htmlFor="name" className="text-sm text-gray-700">
                        Nom de la boutique *
                      </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => {
                      const name = e.target.value
                          updateFormData("name", name)
                          
                          // Générer automatiquement le slug si le nom est saisi
                          if (name.trim()) {
                            const generatedSlug = generateSlug(name)
                            updateFormData("slug", generatedSlug)
                            
                            // Vérifier la disponibilité du slug généré
                            if (generatedSlug.length >= 3) {
                              checkSlugAvailabilityAndUpdate(generatedSlug)
                            }
                          }
                        }}
                        placeholder="Ma Boutique"
                        className="text-sm"
                  />
                </div>

                <div className="space-y-2">
                      <Label htmlFor="slug" className="text-sm text-gray-700">
                        Sous-domaine *
                      </Label>
                  <div className="flex items-center">
                    <Input
                      id="slug"
                      value={formData.slug}
                      onChange={(e) => {
                            const slug = e.target.value
                              .toLowerCase()
                              .replace(/[^a-z0-9-]/g, "-")
                              .replace(/-+/g, "-")
                              .replace(/^-|-$/g, "")
                            updateFormData("slug", slug)
                            
                            // Vérifier la disponibilité quand l'utilisateur modifie le slug
                            if (slug.length >= 3) {
                              checkSlugAvailabilityAndUpdate(slug)
                            } else {
                              setSlugAvailability({
                                checking: false,
                                available: null,
                                suggestions: []
                              })
                            }
                      }}
                      placeholder="ma-boutique"
                          className={`rounded-r-none text-sm ${
                            slugAvailability.available === false ? 'border-red-400' : 
                            slugAvailability.available === true ? 'border-green-400' : ''
                      }`}
                    />
                        <div className="px-2 py-2 bg-gray-50 border border-l-0 border-gray-300 rounded-r-md text-xs text-gray-600">
                      .wozif.store
                    </div>
                  </div>
                  
                  {/* Indicateur de disponibilité */}
                  {formData.slug.length >= 3 && (
                    <div className="flex items-center gap-2">
                      {slugAvailability.checking ? (
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                          Vérification en cours...
                        </div>
                      ) : slugAvailability.available === true ? (
                        <div className="flex items-center gap-2 text-sm text-green-600">
                          <CheckCircle2 className="w-4 h-4" />
                          Disponible
                        </div>
                      ) : slugAvailability.available === false ? (
                            <div className="flex items-center gap-2 text-sm text-red-600">
                              <div className="w-4 h-4 text-red-600">✕</div>
                          Déjà pris
                        </div>
                      ) : null}
                    </div>
                  )}

                  {/* Suggestions */}
                      {slugAvailability.suggestions.length > 0 && (
                    <div className="space-y-2">
                          <p className="text-xs text-gray-600">Suggestions disponibles :</p>
                      <div className="flex flex-wrap gap-2">
                        {slugAvailability.suggestions.map((suggestion, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => {
                                  updateFormData("slug", suggestion)
                                  checkSlugAvailabilityAndUpdate(suggestion)
                            }}
                                className="px-2 py-1 text-xs bg-blue-50 text-blue-700 border border-blue-200 rounded hover:bg-blue-100 transition-colors"
                          >
                                {suggestion}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                      <Label htmlFor="description" className="text-sm text-gray-700">
                        Description
                      </Label>
                  <Textarea
                    id="description"
                      value={formData.description}
                        onChange={(e) => updateFormData("description", e.target.value)}
                        placeholder="Décrivez votre boutique..."
                        rows={2}
                        className="text-sm resize-none"
                    />
                </div>
              </CardContent>
            </Card>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={prevStep} disabled={currentStep === 1}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Précédent
                  </Button>
                  <Button onClick={nextStep}>
                    Suivant
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
            {/* Éléments décoratifs animés */}
            <div className="absolute inset-0">
              <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute top-3/4 right-1/4 w-48 h-48 bg-purple-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
              <div className="absolute bottom-1/4 left-1/3 w-56 h-56 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
              <div className="absolute top-1/2 right-1/3 w-40 h-40 bg-orange-500/20 rounded-full blur-3xl animate-pulse delay-500"></div>
              <div className="absolute bottom-1/3 right-1/2 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1500"></div>
            </div>

            <div className="absolute inset-0 opacity-5 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIxIi8+PC9nPjwvZz48L3N2Zz4=')]"></div>

            <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
              {/* Logo en haut à gauche */}
              <div className="absolute top-4 left-4">
                <img
                  src="/assets/images/logo.svg"
                  alt="Coovia"
                  className="h-8 w-auto"
                  onError={(e) => {
                    console.error('Erreur de chargement du logo')
                    const target = e.target as HTMLImageElement
                    target.style.display = 'none'
                    const fallback = document.createElement('div')
                    fallback.className = 'h-8 flex items-center justify-center text-lg font-bold text-white bg-white/10 px-3 rounded-lg'
                    fallback.textContent = 'COOVIA'
                    target.parentNode?.appendChild(fallback)
                  }}
                />
                        </div>
              
              <div className="w-full max-w-md space-y-6 bg-white rounded-xl p-6 shadow-2xl">
                <div className="text-center space-y-2">
                  <h2 className="text-xl font-semibold tracking-tight text-gray-900">Type de produits</h2>
                  <p className="text-sm text-gray-600">Choisissez votre spécialisation</p>
                </div>

                                <Card className="bg-white border border-gray-200 shadow-sm">
                  <CardContent className="p-4 space-y-4">
                    <div className="mv-personal-demo__create-demo--radio-group space-y-3">
                      <div className="mv-personal-demo__create-demo--radio-group__btn">
                        <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-gray-300 hover:bg-gray-50 transition-all">
                          <input 
                            type="radio" 
                            value="formations" 
                            checked={formData.productType === "formations"}
                            onChange={(e) => updateFormData("productType", e.target.value)}
                            name="productType"
                            className="mr-3"
                          />
                          <div className="flex items-center space-x-3">
                            <div className="text-lg">🎓</div>
                            <div>
                              <h4 className="text-sm font-medium text-gray-900">Formations et éducation</h4>
                              <p className="text-xs text-gray-600">Cours en ligne, tutoriels, certifications</p>
                            </div>
                      </div>
                        </label>
                    </div>

                      <div className="mv-personal-demo__create-demo--radio-group__btn">
                        <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-gray-300 hover:bg-gray-50 transition-all">
                          <input 
                            type="radio" 
                            value="logiciels" 
                            checked={formData.productType === "logiciels"}
                            onChange={(e) => updateFormData("productType", e.target.value)}
                            name="productType"
                            className="mr-3"
                          />
                          <div className="flex items-center space-x-3">
                            <div className="text-lg">💻</div>
                            <div>
                              <h4 className="text-sm font-medium text-gray-900">Logiciels et applications</h4>
                              <p className="text-xs text-gray-600">Apps mobiles, logiciels desktop, extensions</p>
                    </div>
                          </div>
                        </label>
                  </div>
                  
                      <div className="mv-personal-demo__create-demo--radio-group__btn">
                        <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-gray-300 hover:bg-gray-50 transition-all">
                          <input 
                            type="radio" 
                            value="contenus" 
                            checked={formData.productType === "contenus"}
                            onChange={(e) => updateFormData("productType", e.target.value)}
                            name="productType"
                            className="mr-3"
                          />
                          <div className="flex items-center space-x-3">
                            <div className="text-lg">📚</div>
                            <div>
                              <h4 className="text-sm font-medium text-gray-900">Contenus et médias</h4>
                              <p className="text-xs text-gray-600">E-books, musique, vidéos, podcasts</p>
                    </div>
                  </div>
                        </label>
                </div>

                      <div className="mv-personal-demo__create-demo--radio-group__btn">
                        <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-gray-300 hover:bg-gray-50 transition-all">
                          <input 
                            type="radio" 
                            value="design" 
                            checked={formData.productType === "design"}
                            onChange={(e) => updateFormData("productType", e.target.value)}
                            name="productType"
                            className="mr-3"
                          />
                          <div className="flex items-center space-x-3">
                            <div className="text-lg">🎨</div>
                  <div>
                              <h4 className="text-sm font-medium text-gray-900">Design et créativité</h4>
                              <p className="text-xs text-gray-600">Templates, thèmes, ressources graphiques</p>
                      </div>
                        </div>
                        </label>
                      </div>
                      
                      <div className="mv-personal-demo__create-demo--radio-group__btn">
                        <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-gray-300 hover:bg-gray-50 transition-all">
                          <input 
                            type="radio" 
                            value="jeux" 
                            checked={formData.productType === "jeux"}
                            onChange={(e) => updateFormData("productType", e.target.value)}
                            name="productType"
                            className="mr-3"
                          />
                          <div className="flex items-center space-x-3">
                            <div className="text-lg">🎮</div>
                            <div>
                              <h4 className="text-sm font-medium text-gray-900">Jeux et divertissement</h4>
                              <p className="text-xs text-gray-600">Jeux vidéo, applications de divertissement</p>
                        </div>
                          </div>
                        </label>
                      </div>
                      
                      <div className="mv-personal-demo__create-demo--radio-group__btn">
                        <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-gray-300 hover:bg-gray-50 transition-all">
                          <input 
                            type="radio" 
                            value="outils" 
                            checked={formData.productType === "outils"}
                            onChange={(e) => updateFormData("productType", e.target.value)}
                            name="productType"
                            className="mr-3"
                          />
                          <div className="flex items-center space-x-3">
                            <div className="text-lg">🛠️</div>
                            <div>
                              <h4 className="text-sm font-medium text-gray-900">Outils et productivité</h4>
                              <p className="text-xs text-gray-600">Outils de travail, applications business</p>
                        </div>
                    </div>
                        </label>
                      </div>
                      
                      <div className="mv-personal-demo__create-demo--radio-group__btn">
                        <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-gray-300 hover:bg-gray-50 transition-all">
                          <input 
                            type="radio" 
                            value="mixte" 
                            checked={formData.productType === "mixte"}
                            onChange={(e) => updateFormData("productType", e.target.value)}
                            name="productType"
                            className="mr-3"
                          />
                          <div className="flex items-center space-x-3">
                            <div className="text-lg">🛍️</div>
                            <div>
                              <h4 className="text-sm font-medium text-gray-900">Mixte - Tous produits digitaux</h4>
                              <p className="text-xs text-gray-600">Combinaison de plusieurs catégories</p>
                        </div>
                      </div>
                        </label>
                        </div>
                  </div>
                  </CardContent>
                </Card>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={prevStep}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Précédent
                  </Button>
                  <Button onClick={nextStep}>
                    Suivant
                    <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                </div>
          </div>
        )

      case 3:
        return (
          <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
            {/* Éléments décoratifs animés */}
            <div className="absolute inset-0">
              <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute top-3/4 right-1/4 w-48 h-48 bg-purple-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
              <div className="absolute bottom-1/4 left-1/3 w-56 h-56 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
              <div className="absolute top-1/2 right-1/3 w-40 h-40 bg-orange-500/20 rounded-full blur-3xl animate-pulse delay-500"></div>
              <div className="absolute bottom-1/3 right-1/2 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1500"></div>
            </div>

            <div className="absolute inset-0 opacity-5 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIxIi8+PC9nPjwvZz48L3N2Zz4=')]"></div>

            <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
              {/* Logo en haut à gauche */}
              <div className="absolute top-4 left-4">
                <img
                  src="/assets/images/logo.svg"
                  alt="Coovia"
                  className="h-8 w-auto"
                  onError={(e) => {
                    console.error('Erreur de chargement du logo')
                    const target = e.target as HTMLImageElement
                    target.style.display = 'none'
                    const fallback = document.createElement('div')
                    fallback.className = 'h-8 flex items-center justify-center text-lg font-bold text-white bg-white/10 px-3 rounded-lg'
                    fallback.textContent = 'COOVIA'
                    target.parentNode?.appendChild(fallback)
                  }}
                />
                    </div>
                    
              <div className="w-full max-w-md space-y-6 bg-white rounded-xl p-6 shadow-2xl">
                <div className="text-center space-y-2">
                  <h2 className="text-xl font-semibold tracking-tight text-gray-900">Configuration</h2>
                  <p className="text-sm text-gray-600">Paramètres de paiement</p>
                  </div>
                  
                <Card className="bg-white border border-gray-200 shadow-sm">
                  <CardContent className="p-4 space-y-4">
                  <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-3">Méthodes de paiement</h4>
                  <div className="space-y-3">
                        <div className="border border-gray-200 p-3 rounded-lg bg-gray-50">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                              <span className="text-white font-bold text-sm">W</span>
                    </div>
                            <div className="flex-1">
                              <div className="text-sm font-medium text-gray-900">Wozif</div>
                              <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                          Par défaut
                        </Badge>
                      </div>
                    </div>
                      
                          <p className="text-xs text-gray-600 mb-3">Paiements Mobile Money et cartes bancaires</p>

                          <Button type="button" size="sm" className="w-full bg-green-600 hover:bg-green-700 text-xs">
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            Connecté
                          </Button>
                </div>

                        <div className="border border-gray-200 p-3 rounded-lg bg-gray-50">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                              <span className="text-white font-bold text-sm">M</span>
                        </div>
                            <div className="flex-1">
                              <div className="text-sm font-medium text-gray-900">Monneroo</div>
                              <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-xs">
                          Beta
                        </Badge>
                        </div>
                      </div>

                          <p className="text-xs text-gray-600 mb-3">Votre propre compte Monneroo</p>

                          <Button type="button" variant="outline" size="sm" className="w-full text-xs bg-transparent">
                            <Plus className="w-3 h-3 mr-1" />
                            Connecter
                          </Button>
                        </div>
                  </div>
                </div>
              </CardContent>
            </Card>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={prevStep}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Précédent
                  </Button>
                  <Button onClick={nextStep}>
                    Suivant
                    <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                  </div>
                  </div>
                </div>
          </div>
        )

      case 4:
        return (
          <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
            {/* Éléments décoratifs animés */}
            <div className="absolute inset-0">
              <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute top-3/4 right-1/4 w-48 h-48 bg-purple-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
              <div className="absolute bottom-1/4 left-1/3 w-56 h-56 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
              <div className="absolute top-1/2 right-1/3 w-40 h-40 bg-orange-500/20 rounded-full blur-3xl animate-pulse delay-500"></div>
              <div className="absolute bottom-1/3 right-1/2 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1500"></div>
            </div>

            <div className="absolute inset-0 opacity-5 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIxIi8+PC9nPjwvZz48L3N2Zz4=')]"></div>

            <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
              {/* Logo en haut à gauche */}
              <div className="absolute top-4 left-4">
          <img
            src="/assets/images/logo.svg"
            alt="Coovia"
                  className="h-8 w-auto"
            onError={(e) => {
              console.error('Erreur de chargement du logo')
              const target = e.target as HTMLImageElement
              target.style.display = 'none'
              const fallback = document.createElement('div')
                    fallback.className = 'h-8 flex items-center justify-center text-lg font-bold text-white bg-white/10 px-3 rounded-lg'
              fallback.textContent = 'COOVIA'
              target.parentNode?.appendChild(fallback)
            }}
          />
        </div>

              <div className="w-full max-w-md space-y-6 bg-white rounded-xl p-6 shadow-2xl">
                <div className="text-center space-y-2">
                  <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center border border-gray-200">
                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                    </div>
                  <h2 className="text-xl font-semibold tracking-tight text-gray-900">Finalisation</h2>
                  <p className="text-sm text-gray-600">Créez votre boutique</p>
                    </div>

                <Card className="bg-white border border-gray-200 shadow-sm">
                  <CardContent className="p-4 space-y-4">
                  <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm font-medium text-gray-900">Nom</span>
                        <span className="text-sm text-gray-600">{formData.name || "Non renseigné"}</span>
            </div>

                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm font-medium text-gray-900">Sous-domaine</span>
                        <span className="text-sm text-gray-600">{formData.slug || "Non renseigné"}</span>
                  </div>
            </div>
          </CardContent>
        </Card>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={prevStep}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Précédent
              </Button>
                  <Button onClick={handleSubmit} disabled={isLoading}>
                    {isLoading ? "Création..." : "Créer la boutique"}
              </Button>
            </div>
          </div>
        </div>
    </div>
  )

      default:
        return null
    }
  }

  return <div>{renderStepContent()}</div>
}
