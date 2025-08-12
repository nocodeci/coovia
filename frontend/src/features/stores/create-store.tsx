"use client"

import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useAuth } from '@/hooks/useAuthQuery'
import { storeService } from '@/services/storeService'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { toast } from 'sonner'

export function CreateStore() {
  const navigate = useNavigate()
  const { data: user } = useAuth()
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  
  // Form data
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'digital',
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
      paymentMethods: ['mobile_money', 'card'],
      currency: 'XOF'
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
      const response = await storeService.createStore(formData)
      
      if (response.success) {
        toast.success('Boutique créée avec succès!', {
          description: 'Votre boutique de produits digitaux est maintenant active.'
        })
        navigate({ to: '/store-selection' })
      } else {
        toast.error('Erreur lors de la création', {
          description: response.message || 'Une erreur est survenue'
        })
      }
    } catch (error: any) {
      toast.error('Erreur de connexion', {
        description: error.message || 'Impossible de créer la boutique'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900">
                Créer votre boutique digitale
              </h2>
              <p className="text-gray-600 mt-2">
                Commençons par les informations de base de votre boutique
              </p>
            </div>

            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Nom de la boutique <span className="text-red-500">*</span>
                    </label>
                    <Input
                      value={formData.name}
                      onChange={(e) => updateFormData('name', e.target.value)}
                      placeholder="Ma Boutique Digitale"
                      className="h-12"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => updateFormData('description', e.target.value)}
                      placeholder="Décrivez votre boutique et vos produits digitaux..."
                      rows={3}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900">
                Spécialisation digitale
              </h2>
              <p className="text-gray-600 mt-2">
                Configurez votre boutique pour les produits digitaux
              </p>
            </div>

            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-gray-900 mb-2">Produits digitaux</h4>
                  <p className="text-sm text-gray-600">
                    E-books, logiciels, cours en ligne, musique, etc.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900">
                Configuration
              </h2>
              <p className="text-gray-600 mt-2">
                Paramètres de paiement et de livraison
              </p>
            </div>

            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Email de contact
                    </label>
                    <Input
                      value={formData.contact.email}
                      onChange={(e) => updateNestedField('contact', 'email', e.target.value)}
                      placeholder="contact@maboutique.com"
                      type="email"
                      className="h-10"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Téléphone
                    </label>
                    <Input
                      value={formData.contact.phone}
                      onChange={(e) => updateNestedField('contact', 'phone', e.target.value)}
                      placeholder="+2250123456789"
                      className="h-10"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900">
                Finalisation
              </h2>
              <p className="text-gray-600 mt-2">
                Vérifiez les informations et créez votre boutique
              </p>
            </div>

            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <span className="font-medium">Nom de la boutique</span>
                    <span className="text-gray-600">{formData.name || 'Non renseigné'}</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <span className="font-medium">Type de produits</span>
                    <span className="text-green-600 font-medium">Produits digitaux</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <span className="font-medium">Email de contact</span>
                    <span className="text-gray-600">{formData.contact.email || 'Non renseigné'}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <img
              src="/assets/images/logo.svg"
              alt="Coovia"
              className="h-8 w-auto"
            />
            <span className="text-sm text-gray-500 hidden sm:inline">
              Création de boutique
            </span>
          </div>
          
          <Button
            variant="outline"
            onClick={() => navigate({ to: '/store-selection' })}
            className="rounded-lg"
          >
            Annuler
          </Button>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {[1, 2, 3, 4].map((step, index) => (
                <div key={step} className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    currentStep >= step 
                      ? 'bg-blue-600 border-blue-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-500'
                  }`}>
                    {step}
                  </div>
                  {index < 3 && (
                    <div className={`w-16 h-0.5 mx-2 ${
                      currentStep > step ? 'bg-blue-600' : 'bg-gray-300'
                    }`} />
                  )}
                </div>
              ))}
            </div>
            
            <div className="mt-4 text-center">
              <h3 className="text-lg font-semibold text-gray-900">
                Étape {currentStep} sur 4
              </h3>
            </div>
          </div>

          {/* Step Content */}
          <Card className="border-0 shadow-lg">
            <CardContent className="p-8">
              {renderStepContent()}
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="rounded-lg"
            >
              Précédent
            </Button>

            <div className="flex items-center gap-3">
              {currentStep < 4 ? (
                <Button
                  onClick={nextStep}
                  disabled={!formData.name.trim()}
                  className="rounded-lg bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Continuer
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={isLoading || !formData.name.trim()}
                  className="rounded-lg bg-green-600 hover:bg-green-700 text-white"
                >
                  {isLoading ? 'Création...' : 'Créer ma boutique'}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
