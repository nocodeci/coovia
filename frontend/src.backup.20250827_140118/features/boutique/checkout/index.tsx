import React, { useState } from 'react'
import { useNavigate, useParams } from '@tanstack/react-router'
import { ArrowLeft, Check, CreditCard, Truck, User, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useCart } from '../hooks/useCart'

interface CheckoutForm {
  // Informations personnelles
  firstName: string
  lastName: string
  email: string
  phone: string
  
  // Adresse de livraison
  address: string
  city: string
  postalCode: string
  country: string
  
  // Méthode de livraison
  shippingMethod: 'standard' | 'express' | 'pickup'
  
  // Méthode de paiement
  paymentMethod: 'card' | 'paypal'
  cardNumber: string
  cardExpiry: string
  cardCvc: string
  cardName: string
}

export default function CheckoutPage() {
  const navigate = useNavigate()
  const { storeId } = useParams({ from: '/_authenticated/$storeId/boutique/checkout' })
  const { cartItems, cartTotal, clearCart } = useCart()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<CheckoutForm>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'France',
    shippingMethod: 'standard',
    paymentMethod: 'card',
    cardNumber: '',
    cardExpiry: '',
    cardCvc: '',
    cardName: ''
  })

  const shippingMethods = [
    {
      id: 'standard',
      name: 'Livraison standard',
      price: 5.99,
      time: '3-5 jours ouvrés',
      free: cartTotal > 50
    },
    {
      id: 'express',
      name: 'Livraison express',
      price: 12.99,
      time: '1-2 jours ouvrés'
    },
    {
      id: 'pickup',
      name: 'Point relais',
      price: 3.99,
      time: '2-3 jours ouvrés'
    }
  ]

  const selectedShipping = shippingMethods.find(m => m.id === formData.shippingMethod)
  const shippingCost = selectedShipping?.free ? 0 : selectedShipping?.price || 0
  const totalWithShipping = cartTotal + shippingCost

  const updateForm = (field: keyof CheckoutForm, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = () => {
    // Simulation de paiement
          setTimeout(() => {
        clearCart()
        navigate({ to: `/${storeId}/boutique/checkout/success` })
      }, 2000)
  }

  const steps = [
    { id: 1, title: 'Informations', icon: User },
    { id: 2, title: 'Livraison', icon: Truck },
    { id: 3, title: 'Paiement', icon: CreditCard }
  ]

      if (cartItems.length === 0) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-500 mb-4">Votre panier est vide</p>
            <Button onClick={() => navigate({ to: `/${storeId}/boutique` })}>
              Retourner à la boutique
            </Button>
          </div>
        </div>
      )
    }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate({ to: `/${storeId}/boutique` })}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
            
            <div className="flex items-center space-x-4">
              <Lock className="h-4 w-4 text-green-600" />
              <span className="text-sm text-gray-600">Paiement sécurisé</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Étapes */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                  currentStep >= step.id 
                    ? 'bg-green-600 border-green-600 text-white' 
                    : 'border-gray-300 text-gray-500'
                }`}>
                  {currentStep > step.id ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <step.icon className="h-4 w-4" />
                  )}
                </div>
                <span className={`ml-2 text-sm font-medium ${
                  currentStep >= step.id ? 'text-green-600' : 'text-gray-500'
                }`}>
                  {step.title}
                </span>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-0.5 mx-4 ${
                    currentStep > step.id ? 'bg-green-600' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulaire principal */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>
                  {currentStep === 1 && 'Informations personnelles'}
                  {currentStep === 2 && 'Adresse de livraison'}
                  {currentStep === 3 && 'Paiement'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Étape 1: Informations personnelles */}
                {currentStep === 1 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">Prénom</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => updateForm('firstName', e.target.value)}
                        placeholder="Votre prénom"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Nom</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => updateForm('lastName', e.target.value)}
                        placeholder="Votre nom"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => updateForm('email', e.target.value)}
                        placeholder="votre@email.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Téléphone</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => updateForm('phone', e.target.value)}
                        placeholder="06 12 34 56 78"
                      />
                    </div>
                  </div>
                )}

                {/* Étape 2: Adresse de livraison */}
                {currentStep === 2 && (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="address">Adresse</Label>
                      <Input
                        id="address"
                        value={formData.address}
                        onChange={(e) => updateForm('address', e.target.value)}
                        placeholder="123 Rue de la Paix"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="city">Ville</Label>
                        <Input
                          id="city"
                          value={formData.city}
                          onChange={(e) => updateForm('city', e.target.value)}
                          placeholder="Paris"
                        />
                      </div>
                      <div>
                        <Label htmlFor="postalCode">Code postal</Label>
                        <Input
                          id="postalCode"
                          value={formData.postalCode}
                          onChange={(e) => updateForm('postalCode', e.target.value)}
                          placeholder="75001"
                        />
                      </div>
                      <div>
                        <Label htmlFor="country">Pays</Label>
                        <Input
                          id="country"
                          value={formData.country}
                          onChange={(e) => updateForm('country', e.target.value)}
                        />
                      </div>
                    </div>

                    <div>
                      <Label className="text-base font-medium">Méthode de livraison</Label>
                      <RadioGroup
                        value={formData.shippingMethod}
                        onValueChange={(value) => updateForm('shippingMethod', value)}
                        className="mt-2"
                      >
                        {shippingMethods.map((method) => (
                          <div key={method.id} className="flex items-center space-x-2">
                            <RadioGroupItem value={method.id} id={method.id} />
                            <Label htmlFor={method.id} className="flex-1 cursor-pointer">
                              <div className="flex justify-between items-center">
                                <div>
                                  <div className="font-medium">{method.name}</div>
                                  <div className="text-sm text-gray-500">{method.time}</div>
                                </div>
                                <div className="text-right">
                                  {method.free ? (
                                    <span className="text-green-600 font-medium">Gratuit</span>
                                  ) : (
                                    <span>{method.price.toFixed(2)} €</span>
                                  )}
                                </div>
                              </div>
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                  </div>
                )}

                {/* Étape 3: Paiement */}
                {currentStep === 3 && (
                  <div className="space-y-4">
                    <div>
                      <Label className="text-base font-medium">Méthode de paiement</Label>
                      <RadioGroup
                        value={formData.paymentMethod}
                        onValueChange={(value) => updateForm('paymentMethod', value)}
                        className="mt-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="card" id="card" />
                          <Label htmlFor="card" className="cursor-pointer">
                            Carte bancaire
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="paypal" id="paypal" />
                          <Label htmlFor="paypal" className="cursor-pointer">
                            PayPal
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>

                    {formData.paymentMethod === 'card' && (
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="cardName">Nom sur la carte</Label>
                          <Input
                            id="cardName"
                            value={formData.cardName}
                            onChange={(e) => updateForm('cardName', e.target.value)}
                            placeholder="Jean Dupont"
                          />
                        </div>
                        <div>
                          <Label htmlFor="cardNumber">Numéro de carte</Label>
                          <Input
                            id="cardNumber"
                            value={formData.cardNumber}
                            onChange={(e) => updateForm('cardNumber', e.target.value)}
                            placeholder="1234 5678 9012 3456"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="cardExpiry">Date d'expiration</Label>
                            <Input
                              id="cardExpiry"
                              value={formData.cardExpiry}
                              onChange={(e) => updateForm('cardExpiry', e.target.value)}
                              placeholder="MM/AA"
                            />
                          </div>
                          <div>
                            <Label htmlFor="cardCvc">CVC</Label>
                            <Input
                              id="cardCvc"
                              value={formData.cardCvc}
                              onChange={(e) => updateForm('cardCvc', e.target.value)}
                              placeholder="123"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Navigation */}
                <div className="flex justify-between pt-6">
                  {currentStep > 1 && (
                    <Button variant="outline" onClick={prevStep}>
                      Précédent
                    </Button>
                  )}
                  
                  {currentStep < 3 ? (
                    <Button onClick={nextStep} className="ml-auto">
                      Suivant
                    </Button>
                  ) : (
                    <Button onClick={handleSubmit} className="ml-auto">
                      Confirmer la commande
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Résumé de la commande */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Résumé de la commande</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Articles */}
                <div className="space-y-3">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between items-center">
                      <div className="flex items-center space-x-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-10 h-10 object-cover rounded"
                        />
                        <div>
                          <p className="font-medium text-sm">{item.name}</p>
                          <p className="text-xs text-gray-500">Quantité: {item.quantity}</p>
                        </div>
                      </div>
                      <span className="font-medium">
                        {(item.price * item.quantity).toFixed(2)} €
                      </span>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Totaux */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Sous-total</span>
                    <span>{cartTotal.toFixed(2)} €</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Livraison</span>
                    <span>
                      {shippingCost === 0 ? (
                        <span className="text-green-600">Gratuit</span>
                      ) : (
                        `${shippingCost.toFixed(2)} €`
                      )}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>{totalWithShipping.toFixed(2)} €</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
} 