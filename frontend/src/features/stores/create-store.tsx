"use client"

import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useAuth } from '@/hooks/useAuthQuery'
import { storeService } from '@/services/storeService'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Alert, AlertDescription } from '@/components/ui/alert'

import { 
  Building2, 
  Package, 
  CreditCard, 
  CheckCircle2, 
  ArrowLeft, 
  ArrowRight,
  Store,
  Mail,
  Phone,
  MapPin,
  Globe,
  Zap,
  X,
  Info,
  Key,
  Settings,
  AlertTriangle,
  Plus
} from 'lucide-react'
import { toast } from 'sonner'

export function CreateStore() {
  const navigate = useNavigate()
  const { data: user } = useAuth()
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

  const [showMonnerooAlert, setShowMonnerooAlert] = useState(false)
  
  // Form data
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    logo: null as File | null,
    category: 'digital',
    productType: '',
    productCategories: [] as string[],
    address: {
      street: '',
      city: '',
      country: 'Côte d\'Ivoire'
    },
    contact: {
      email: '',
      phone: ''
    },
    settings: {
      digitalDelivery: true,
      autoDelivery: true,
      paymentMethods: ['wozif'],
      currency: 'XOF',
      monneroo: {
        enabled: false,
        secretKey: '',
        environment: 'sandbox' // 'sandbox' ou 'production'
      }
    }
  })

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const updateNestedField = (parent: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...(prev[parent as keyof typeof prev] as any),
        [field]: value
      }
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
      setSlugAvailability({
        checking: false,
        available: null,
        suggestions: []
      })
      return
    }

    setSlugAvailability(prev => ({ ...prev, checking: true }))

    try {
      // Simulation de vérification - à remplacer par l'appel API réel
      const response = await fetch(`/api/stores/check/${slug}`)
      const data = await response.json()
      
      if (data.exists) {
        // Générer des suggestions
        const suggestions = generateSuggestions(slug)
        setSlugAvailability({
          checking: false,
          available: false,
          suggestions
        })
      } else {
        setSlugAvailability({
          checking: false,
          available: true,
          suggestions: []
        })
      }
    } catch (error) {
      // En cas d'erreur, on considère que c'est disponible
      setSlugAvailability({
        checking: false,
        available: true,
        suggestions: []
      })
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

  // Debounce pour la vérification
  const debouncedCheckSlug = (() => {
    let timeoutId: NodeJS.Timeout
    return (slug: string) => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        checkSlugAvailability(slug)
      }, 500) // Attendre 500ms après la dernière frappe
    }
  })()

  // Types de produits et leurs catégories
  const productTypes = [
    {
      id: 'formations',
      name: 'Formations & Éducation',
      icon: '🎓',
      description: 'Cours en ligne, formations professionnelles, tutoriels',
      categories: [
        'Cours en ligne',
        'Formations professionnelles',
        'Tutoriels vidéo',
        'Webinaires',
        'Certifications',
        'Coaching personnalisé',
        'E-books éducatifs',
        'Ressources pédagogiques'
      ]
    },
    {
      id: 'logiciels',
      name: 'Logiciels & Applications',
      icon: '💻',
      description: 'Applications, logiciels, outils numériques',
      categories: [
        'Applications mobiles',
        'Logiciels desktop',
        'Extensions navigateur',
        'Plugins WordPress',
        'Templates et thèmes',
        'Outils de productivité',
        'Jeux vidéo',
        'Applications web'
      ]
    },
    {
      id: 'contenus',
      name: 'Contenus & Médias',
      icon: '📱',
      description: 'E-books, musique, vidéos, podcasts',
      categories: [
        'E-books',
        'Livres audio',
        'Musique',
        'Podcasts',
        'Vidéos',
        'Photos et images',
        'Templates créatifs',
        'Contenus exclusifs'
      ]
    }
  ]

  const nextStep = () => {
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
      // Préparer les données pour l'envoi
      const storeData = {
        name: formData.name,
        slug: formData.slug,
        description: formData.description,
        logo: formData.logo,
        productType: formData.productType,
        productCategories: formData.productCategories,
        address: {
          city: formData.address.city
        },
        contact: {
          email: formData.contact.email,
          phone: formData.contact.phone
        },
        settings: {
          paymentMethods: formData.settings.paymentMethods,
          currency: 'XOF',
          monneroo: formData.settings.monneroo
        }
      }

      const response = await storeService.createStore(storeData)
      
      if (response.success) {
        toast.success('Boutique créée avec succès!', {
          description: `Votre boutique "${formData.name}" est maintenant active sur ${formData.slug}.wozif.store`
        })
        
        // Rediriger vers la sélection de boutique ou le dashboard
        navigate({ to: '/store-selection' })
      } else {
        toast.error('Erreur lors de la création', {
          description: response.message || 'Une erreur est survenue lors de la création de la boutique'
        })
      }
    } catch (error: any) {
      console.error('Erreur création boutique:', error)
      toast.error('Erreur de connexion', {
        description: error.message || 'Impossible de créer la boutique. Vérifiez votre connexion.'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const steps = [
    { id: 1, title: 'Informations de base', icon: Building2, description: 'Nom et description' },
    { id: 2, title: 'Type de produits', icon: Package, description: 'Spécialisation digitale' },
    { id: 3, title: 'Configuration', icon: CreditCard, description: 'Contact et paiement' },
    { id: 4, title: 'Finalisation', icon: CheckCircle2, description: 'Vérification' }
  ]

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center overflow-hidden">
                {formData.logo ? (
                  <img
                    src={URL.createObjectURL(formData.logo)}
                    alt="Logo de la boutique"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Store className="w-8 h-8 text-primary" />
                )}
              </div>
              <h2 className="text-2xl font-semibold tracking-tight">Créer votre boutique digitale</h2>
              <p className="text-muted-foreground">
                Commençons par les informations de base de votre boutique
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="w-5 h-5" />
                  Informations de base
                </CardTitle>
                <CardDescription>
                  Définissez le nom et la description de votre boutique
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="logo">Logo de la boutique</Label>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center overflow-hidden border-2 border-dashed border-primary/20">
                      {formData.logo ? (
                        <img
                          src={URL.createObjectURL(formData.logo)}
                          alt="Logo de la boutique"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Store className="w-8 h-8 text-primary" />
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
                            updateFormData('logo', file)
                          }
                        }}
                        className="cursor-pointer"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Formats acceptés: JPG, PNG, SVG (max 2MB)
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">Nom de la boutique *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => {
                      const name = e.target.value
                      updateFormData('name', name)
                      // Générer automatiquement un slug si le champ slug est vide
                      if (!formData.slug.trim()) {
                        updateFormData('slug', generateSlug(name))
                      }
                    }}
                    placeholder="Ma Boutique Digitale"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug">Sous-domaine de la boutique *</Label>
                  <div className="flex items-center">
                    <Input
                      id="slug"
                      value={formData.slug}
                      onChange={(e) => {
                        const slug = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')
                        updateFormData('slug', slug)
                        debouncedCheckSlug(slug)
                      }}
                      placeholder="ma-boutique"
                      className={`rounded-r-none ${
                        slugAvailability.available === false ? 'border-destructive' : 
                        slugAvailability.available === true ? 'border-green-500' : ''
                      }`}
                    />
                    <div className="px-3 py-2 bg-muted border border-l-0 rounded-r-md text-sm text-muted-foreground">
                      .wozif.store
                    </div>
                  </div>
                  
                  {/* Indicateur de disponibilité */}
                  {formData.slug.length >= 3 && (
                    <div className="flex items-center gap-2">
                      {slugAvailability.checking ? (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                          Vérification en cours...
                        </div>
                      ) : slugAvailability.available === true ? (
                        <div className="flex items-center gap-2 text-sm text-green-600">
                          <CheckCircle2 className="w-4 h-4" />
                          Disponible
                        </div>
                      ) : slugAvailability.available === false ? (
                        <div className="flex items-center gap-2 text-sm text-destructive">
                          <X className="w-4 h-4" />
                          Déjà pris
                        </div>
                      ) : null}
                    </div>
                  )}

                  {/* Suggestions */}
                  {slugAvailability.available === false && slugAvailability.suggestions.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs text-muted-foreground">Suggestions disponibles :</p>
                      <div className="flex flex-wrap gap-2">
                        {slugAvailability.suggestions.map((suggestion, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => {
                              updateFormData('slug', suggestion)
                              debouncedCheckSlug(suggestion)
                            }}
                            className="px-3 py-1 text-xs bg-primary/10 text-primary border border-primary/20 rounded-md hover:bg-primary/20 transition-colors"
                          >
                            {suggestion}.wozif.store
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <p className="text-xs text-muted-foreground">
                    Votre boutique sera accessible à l'adresse : <span className="font-mono text-primary">{formData.slug || 'ma-boutique'}.wozif.store</span>
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                      value={formData.description}
                      onChange={(e) => updateFormData('description', e.target.value)}
                      placeholder="Décrivez votre boutique et vos produits digitaux..."
                      rows={3}
                    />
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-semibold tracking-tight">Spécialisation digitale</h2>
              <p className="text-muted-foreground">
                Choisissez le type de produits que vous souhaitez vendre
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Type de produits
                </CardTitle>
                <CardDescription>
                  Sélectionnez le type principal de votre boutique
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Types de produits */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {productTypes.map((type) => (
                    <div
                      key={type.id}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                        formData.productType === type.id
                          ? 'border-blue-500 bg-blue-50 shadow-md'
                          : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                      }`}
                      onClick={() => {
                        updateFormData('productType', type.id)
                        updateFormData('productCategories', [])
                      }}
                    >
                      <div className="text-center space-y-3">
                        <div className="text-3xl">{type.icon}</div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{type.name}</h4>
                          <p className="text-sm text-gray-600 mt-1">{type.description}</p>
                        </div>
                        {formData.productType === type.id && (
                          <Badge variant="default" className="bg-blue-500">
                            Sélectionné
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Catégories de produits */}
                {formData.productType && (
                  <div className="space-y-4">
                    <Separator />
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">
                        Catégories de produits
                      </h4>
                      <p className="text-sm text-gray-600 mb-4">
                        Sélectionnez les catégories qui correspondent à vos produits
                      </p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {productTypes
                          .find(type => type.id === formData.productType)
                          ?.categories.map((category) => (
                            <div key={category} className="flex items-center space-x-2">
                              <Checkbox
                                id={category}
                                checked={formData.productCategories.includes(category)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    updateFormData('productCategories', [...formData.productCategories, category])
                                  } else {
                                    updateFormData('productCategories', formData.productCategories.filter(c => c !== category))
                                  }
                                }}
                              />
                              <Label
                                htmlFor={category}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                              >
                                {category}
                              </Label>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Avantages */}
                <Separator />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg bg-green-50 border-green-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="w-4 h-4 text-green-600" />
                      <span className="font-medium text-sm text-green-800">Livraison automatique</span>
                    </div>
                    <p className="text-xs text-green-700">
                      Les produits sont livrés instantanément après paiement
                    </p>
                  </div>
                  
                  <div className="p-4 border rounded-lg bg-blue-50 border-blue-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Globe className="w-4 h-4 text-blue-600" />
                      <span className="font-medium text-sm text-blue-800">Vente mondiale</span>
                    </div>
                    <p className="text-xs text-blue-700">
                      Vendez partout dans le monde sans contraintes logistiques
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-semibold tracking-tight">Configuration</h2>
              <p className="text-muted-foreground">
                Paramètres de contact et de paiement
              </p>
            </div>



            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Méthodes de paiement
                </CardTitle>
                <CardDescription>
                  Configurez les moyens de paiement acceptés par votre boutique
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Méthodes de paiement */}
                  <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Méthodes de paiement</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Wozif - Méthode par défaut */}
                    <div className="border border-neutral-200 flex flex-col justify-between relative overflow-hidden p-6 rounded-lg bg-white shadow-sm">
                      <div className="absolute top-3 right-3">
                        <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200 font-medium">
                          Par défaut
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-xl">W</span>
                        </div>
                        <div className="font-semibold text-lg text-gray-900">Wozif</div>
                      </div>
                      
                      <div className="text-gray-600 text-sm mb-6">
                        <div className="line-clamp-3 mb-2">
                          Acceptez les paiements en Côte d'Ivoire avec Mobile Money, cartes bancaires et virements via notre plateforme sécurisée
                        </div>
                        <span className="text-blue-600 cursor-pointer hover:underline">En savoir plus</span>
                      </div>
                      
                      <Button
                        type="button"
                        variant={formData.settings.paymentMethods.includes('wozif') ? "default" : "outline"}
                        className={`w-full ${formData.settings.paymentMethods.includes('wozif') ? 'bg-green-600 hover:bg-green-700' : 'border-green-200 text-green-700 hover:bg-green-50'}`}
                        onClick={() => {
                          if (!formData.settings.paymentMethods.includes('wozif')) {
                            // Désactiver Monneroo et activer Wozif
                            updateNestedField('settings', 'monneroo', {
                              ...formData.settings.monneroo,
                              enabled: false
                            })
                            updateNestedField('settings', 'paymentMethods', ['wozif'])
                          }
                        }}
                      >
                        <div className="flex items-center justify-center gap-2">
                          <span className="font-medium">
                            {formData.settings.paymentMethods.includes('wozif') ? 'Connecté' : 'Connecter Wozif'}
                          </span>
                          {formData.settings.paymentMethods.includes('wozif') ? (
                            <CheckCircle2 className="w-5 h-5" />
                          ) : (
                            <Plus className="w-5 h-5" />
                          )}
                        </div>
                      </Button>
                    </div>

                    {/* Monneroo - Option alternative */}
                    <div className="border border-neutral-200 flex flex-col justify-between relative overflow-hidden p-6 rounded-lg bg-white shadow-sm">
                      <div className="absolute top-3 right-3">
                        <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-blue-200 font-medium">
                          Beta
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-xl">M</span>
                        </div>
                        <div className="font-semibold text-lg text-gray-900">Monneroo</div>
                      </div>
                      
                      <div className="text-gray-600 text-sm mb-6">
                        <div className="line-clamp-3 mb-2">
                          Acceptez les paiements directement sur votre compte Monneroo avec vos propres moyens de paiement
                        </div>
                        <span className="text-blue-600 cursor-pointer hover:underline">En savoir plus</span>
                  </div>
                  
                      <Button
                        type="button"
                        variant={formData.settings.monneroo.enabled ? "default" : "outline"}
                        className={`w-full ${formData.settings.monneroo.enabled ? 'bg-blue-600 hover:bg-blue-700' : 'border-blue-200 text-blue-700 hover:bg-blue-50'}`}
                        onClick={() => {
                          if (!formData.settings.monneroo.enabled) {
                            setShowMonnerooAlert(true)
                          }
                        }}
                      >
                        <div className="flex items-center justify-center gap-2">
                          <span className="font-medium">
                            {formData.settings.monneroo.enabled ? 'Connecté' : 'Connecter Monneroo'}
                          </span>
                          {formData.settings.monneroo.enabled ? (
                            <CheckCircle2 className="w-5 h-5" />
                          ) : (
                            <Plus className="w-5 h-5" />
                          )}
                        </div>
                      </Button>
                    </div>
                  </div>
                </div>


              </CardContent>
            </Card>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-semibold tracking-tight">Finalisation</h2>
              <p className="text-muted-foreground">
                Vérifiez les informations et créez votre boutique
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Récapitulatif</CardTitle>
                <CardDescription>
                  Vérifiez que toutes les informations sont correctes
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                    <span className="font-medium">Nom de la boutique</span>
                      <span className="text-muted-foreground">{formData.name || 'Non renseigné'}</span>
                    </div>
                    
                    <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                      <span className="font-medium">Type de produits</span>
                      <Badge variant="secondary">Produits digitaux</Badge>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                      <span className="font-medium">Email de contact</span>
                      <span className="text-muted-foreground">{formData.contact.email || 'Non renseigné'}</span>
                    </div>
                    
                    <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                      <span className="font-medium">Méthodes de paiement</span>
                      <div className="flex items-center gap-2">
                        {formData.settings.paymentMethods.includes('wozif') && (
                          <Badge variant="default" className="bg-green-600">Wozif</Badge>
                        )}
                        {formData.settings.monneroo.enabled && (
                          <Badge variant="outline" className="border-blue-300 text-blue-700">Monneroo</Badge>
                        )}
                        {!formData.settings.paymentMethods.includes('wozif') && !formData.settings.monneroo.enabled && (
                          <span className="text-muted-foreground">Aucune sélectionnée</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {formData.settings.monneroo.enabled && (
                  <div className="space-y-3">
                    <Separator />
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <h4 className="font-semibold text-blue-900 mb-2">Configuration Monneroo</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-blue-700">Environnement:</span>
                          <span className="text-blue-900 font-medium">
                            {formData.settings.monneroo.environment === 'sandbox' ? '🟡 Sandbox' : '🟢 Production'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-blue-700">Clé API:</span>
                          <span className="text-blue-900 font-medium">
                            {formData.settings.monneroo.secretKey ? '✅ Configurée' : '❌ Manquante'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <Separator />

                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-blue-600" />
                    <p className="text-sm text-blue-700">
                      Votre boutique sera optimisée pour la vente de produits digitaux avec livraison automatique
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  Coordonnées
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">Ville</Label>
                    <Input
                      id="city"
                      value={formData.address.city}
                      onChange={(e) => updateNestedField('address', 'city', e.target.value)}
                      placeholder="Abidjan"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Téléphone</Label>
                    <Input
                      id="phone"
                      value={formData.contact.phone}
                      onChange={(e) => updateNestedField('contact', 'phone', e.target.value)}
                      placeholder="+2250123456789"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    value={formData.contact.email}
                    onChange={(e) => updateNestedField('contact', 'email', e.target.value)}
                    placeholder="contact@maboutique.com"
                    type="email"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        )

      default:
        return null
    }
  }

  const progress = (currentStep / steps.length) * 100

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Logo */}
        <div className="flex justify-center mb-8">
            <img
              src="/assets/images/logo.svg"
              alt="Coovia"
              className="h-8 w-auto"
            />
        </div>



        {/* Content */}
        <Card className="border-0 shadow-lg">
          <CardContent className="p-8">
          {/* Progress Steps */}
          <div className="mb-8">
              <div className="relative flex items-center justify-between mb-4">
                {steps.map((step, index) => (
                  <div key={step.id} className="flex flex-col items-center relative">
                    <div className={`flex items-center justify-center w-10 h-10 rounded-lg border-2 text-sm font-medium transition-all duration-200 ${
                      currentStep >= step.id 
                        ? 'bg-primary border-primary text-primary-foreground shadow-sm' 
                        : 'bg-muted/50 border-muted text-muted-foreground'
                    }`}>
                      {currentStep > step.id ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : (
                        step.id
                      )}
                    </div>
                    <div className="mt-2 text-center">
                      <p className={`text-xs font-medium ${
                        currentStep >= step.id ? 'text-foreground' : 'text-muted-foreground'
                      }`}>
                        {step.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {step.description}
                      </p>
                    </div>
                    {index < steps.length - 1 && (
                      <div className={`absolute top-5 left-full w-16 h-0.5 ${
                        currentStep > step.id ? 'bg-primary' : 'bg-muted'
                      }`} style={{ transform: 'translateX(50%)' }} />
                    )}
                </div>
              ))}
            </div>
              <Progress value={progress} className="h-1" />
          </div>

              {renderStepContent()}

          {/* Navigation */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
                className="gap-2"
            >
                <ArrowLeft className="w-4 h-4" />
              Précédent
            </Button>

              {currentStep < 4 ? (
                <Button
                  onClick={nextStep}
                  disabled={
                    !formData.name.trim() || 
                    !formData.slug.trim() || 
                    slugAvailability.available === false ||
                    (currentStep === 2 && (!formData.productType || formData.productCategories.length === 0))
                  }
                  className="gap-2"
                >
                  Continuer
                  <ArrowRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={
                    isLoading || 
                    !formData.name.trim() || 
                    !formData.slug.trim() || 
                    slugAvailability.available === false ||
                    !formData.productType ||
                    formData.productCategories.length === 0
                  }
                  className="gap-2"
                >
                  {isLoading ? 'Création...' : 'Créer ma boutique'}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerte Monneroo */}
      {showMonnerooAlert && (
        <div className="fixed inset-0 bg-white/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">M</span>
              </div>
              <div>
                <h3 className="font-semibold text-lg text-gray-900">Configuration Monneroo</h3>
                <p className="text-sm text-gray-600">Intégrez votre clé API</p>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div className="space-y-2">
                <Label htmlFor="monneroo_secret_key">Clé API Monneroo</Label>
                <Input
                  id="monneroo_secret_key"
                  type="password"
                  value={formData.settings.monneroo.secretKey}
                  onChange={(e) => {
                    updateNestedField('settings', 'monneroo', {
                      ...formData.settings.monneroo,
                      secretKey: e.target.value
                    })
                  }}
                  placeholder="sk_test_..."
                />
                <p className="text-xs text-gray-500">
                  Trouvez votre clé API dans votre tableau de bord Monneroo
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="monneroo_environment">Environnement</Label>
                <select
                  id="monneroo_environment"
                  value={formData.settings.monneroo.environment}
                  onChange={(e) => {
                    updateNestedField('settings', 'monneroo', {
                      ...formData.settings.monneroo,
                      environment: e.target.value
                    })
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="sandbox">🟡 Sandbox (Test)</option>
                  <option value="production">🟢 Production (Live)</option>
                </select>
                <p className="text-xs text-gray-500">
                  Utilisez Sandbox pour les tests, Production pour les vrais paiements
                </p>
              </div>

              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Important :</strong> Vos clés secrètes ne seront jamais affichées en clair et sont stockées de manière sécurisée.
                  Utilisez l'environnement Sandbox pour tester avant de passer en production.
                </AlertDescription>
              </Alert>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowMonnerooAlert(false)}
                className="flex-1"
              >
                Annuler
              </Button>
              <Button
                onClick={() => {
                  if (formData.settings.monneroo.secretKey.trim()) {
                    // Désactiver Wozif et activer Monneroo
                    updateNestedField('settings', 'paymentMethods', [])
                    updateNestedField('settings', 'monneroo', {
                      ...formData.settings.monneroo,
                      enabled: true
                    })
                    setShowMonnerooAlert(false)
                    toast.success('Monneroo configuré avec succès !')
                  } else {
                    toast.error('Veuillez saisir votre clé API Monneroo')
                  }
                }}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                Connecter Monneroo
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
