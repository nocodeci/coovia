"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { User, Mail, Phone, MapPin, CreditCard, Loader2, CheckCircle, AlertCircle } from "lucide-react"
import { toast } from "sonner"
import paymentService, { CustomerInfo, PaymentData } from "@/services/paymentService"

interface PaymentFormProps {
  amount: number
  currency?: string
  description: string
  storeId?: string
  items?: Array<{
    name: string
    quantity: number
    unit_price: number
    total_price: number
    description?: string
  }>
  onSuccess?: (result: any) => void
  onCancel?: () => void
  className?: string
}

export function PaymentForm({ 
  amount, 
  currency = 'XOF', 
  description, 
  storeId,
  items = [],
  onSuccess,
  onCancel,
  className 
}: PaymentFormProps) {
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: 'Sénégal',
    zipCode: ''
  })

  const [errors, setErrors] = useState<Partial<CustomerInfo>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [gatewayInfo, setGatewayInfo] = useState<{
    gateway: string
    priority: string
    message: string
  } | null>(null)

  // Détecter la passerelle au chargement
  useState(() => {
    detectGateway()
  })

  const detectGateway = async () => {
    try {
      const result = await paymentService.detectGateway()
      if (result.success) {
        setGatewayInfo({
          gateway: result.gateway,
          priority: result.priority,
          message: result.message
        })
      }
    } catch (error) {
      console.error('Gateway detection error:', error)
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<CustomerInfo> = {}

    if (!customerInfo.firstName.trim()) {
      newErrors.firstName = 'Le prénom est requis'
    }

    if (!customerInfo.lastName.trim()) {
      newErrors.lastName = 'Le nom est requis'
    }

    if (!customerInfo.email.trim()) {
      newErrors.email = 'L\'email est requis'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerInfo.email)) {
      newErrors.email = 'Format d\'email invalide'
    }

    if (!customerInfo.phone.trim()) {
      newErrors.phone = 'Le téléphone est requis'
    } else if (!/^(\+221|221)?[0-9]{9}$/.test(customerInfo.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Format de téléphone invalide'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    
    try {
      const paymentData: PaymentData = {
        amount,
        currency,
        description,
        store_id: storeId,
        customer_info: customerInfo,
        items: items.length > 0 ? items : undefined
      }

      const result = await paymentService.createPayment(paymentData)

      if (result.success) {
        toast.success('Paiement créé avec succès')
        
        if (onSuccess) {
          onSuccess(result)
        }

        // Rediriger vers la page de paiement
        if (result.redirect_url) {
          paymentService.redirectToPayment(result.redirect_url)
        }
      } else {
        toast.error(result.message || 'Erreur lors de la création du paiement')
      }
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de la création du paiement')
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatCurrency = (amount: number, currency: string) => {
    return paymentService.formatAmount(amount, currency)
  }

  const gatewayName = gatewayInfo ? paymentService.getGatewayName(gatewayInfo.gateway) : 'Détection...'
  const gatewayColor = gatewayInfo ? paymentService.getGatewayColor(gatewayInfo.gateway) : 'bg-gray-500'
  const gatewayIcon = gatewayInfo ? paymentService.getGatewayIcon(gatewayInfo.gateway) : '💳'

  return (
    <div className={`max-w-2xl mx-auto p-6 ${className}`}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Paiement sécurisé
          </CardTitle>
          <CardDescription>
            Remplissez vos informations pour procéder au paiement
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Résumé de la commande */}
          <div className="mb-6 p-4 bg-muted rounded-lg">
            <h3 className="font-semibold mb-2">Résumé de votre commande</h3>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Description:</span>
                <span>{description}</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span>Montant total:</span>
                <span>{formatCurrency(amount, currency)}</span>
              </div>
            </div>
          </div>

          {/* Indicateur de passerelle */}
          {gatewayInfo && (
            <div className="mb-6 p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full ${gatewayColor} flex items-center justify-center text-white text-sm`}>
                  {gatewayIcon}
                </div>
                <div className="flex-1">
                  <div className="font-medium">Paiement via {gatewayName}</div>
                  <div className="text-xs text-muted-foreground">
                    {gatewayInfo.message}
                  </div>
                </div>
                <Badge variant={gatewayInfo.priority === 'user_configured' ? "default" : "secondary"}>
                  {gatewayInfo.priority === 'user_configured' ? 'Configurée' : 'Par défaut'}
                </Badge>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Informations personnelles */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <User className="h-4 w-4" />
                Informations personnelles
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Prénom *</Label>
                  <Input
                    id="firstName"
                    value={customerInfo.firstName}
                    onChange={(e) => setCustomerInfo(prev => ({ ...prev, firstName: e.target.value }))}
                    placeholder="Votre prénom"
                    className={errors.firstName ? 'border-red-500' : ''}
                  />
                  {errors.firstName && (
                    <p className="text-sm text-red-500">{errors.firstName}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">Nom *</Label>
                  <Input
                    id="lastName"
                    value={customerInfo.lastName}
                    onChange={(e) => setCustomerInfo(prev => ({ ...prev, lastName: e.target.value }))}
                    placeholder="Votre nom"
                    className={errors.lastName ? 'border-red-500' : ''}
                  />
                  {errors.lastName && (
                    <p className="text-sm text-red-500">{errors.lastName}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Adresse email *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={customerInfo.email}
                    onChange={(e) => setCustomerInfo(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="votre.email@exemple.com"
                    className={`pl-10 ${errors.email ? 'border-red-500' : ''}`}
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Numéro de téléphone *</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    type="tel"
                    value={customerInfo.phone}
                    onChange={(e) => setCustomerInfo(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="+221 77 456 32 09"
                    className={`pl-10 ${errors.phone ? 'border-red-500' : ''}`}
                  />
                </div>
                {errors.phone && (
                  <p className="text-sm text-red-500">{errors.phone}</p>
                )}
              </div>
            </div>

            {/* Adresse (optionnelle) */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Adresse (optionnelle)
              </h3>
              
              <div className="space-y-2">
                <Label htmlFor="address">Adresse</Label>
                <Textarea
                  id="address"
                  value={customerInfo.address}
                  onChange={(e) => setCustomerInfo(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="123 Rue de la Paix"
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">Ville</Label>
                  <Input
                    id="city"
                    value={customerInfo.city}
                    onChange={(e) => setCustomerInfo(prev => ({ ...prev, city: e.target.value }))}
                    placeholder="Dakar"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="country">Pays</Label>
                  <Select
                    value={customerInfo.country}
                    onValueChange={(value) => setCustomerInfo(prev => ({ ...prev, country: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Sénégal">Sénégal</SelectItem>
                      <SelectItem value="Côte d'Ivoire">Côte d'Ivoire</SelectItem>
                      <SelectItem value="Mali">Mali</SelectItem>
                      <SelectItem value="Burkina Faso">Burkina Faso</SelectItem>
                      <SelectItem value="Guinée">Guinée</SelectItem>
                      <SelectItem value="Togo">Togo</SelectItem>
                      <SelectItem value="Bénin">Bénin</SelectItem>
                      <SelectItem value="Niger">Niger</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="zipCode">Code postal</Label>
                  <Input
                    id="zipCode"
                    value={customerInfo.zipCode}
                    onChange={(e) => setCustomerInfo(prev => ({ ...prev, zipCode: e.target.value }))}
                    placeholder="10000"
                  />
                </div>
              </div>
            </div>

            {/* Informations de sécurité */}
            <Alert>
              <AlertDescription>
                <strong>Sécurité :</strong> Vos informations personnelles sont protégées et ne seront utilisées que pour finaliser votre paiement.
              </AlertDescription>
            </Alert>

            {/* Boutons d'action */}
            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="flex-1"
                disabled={isSubmitting}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Traitement...
                  </>
                ) : (
                  <>
                    <CreditCard className="h-4 w-4 mr-2" />
                    Procéder au paiement
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
} 