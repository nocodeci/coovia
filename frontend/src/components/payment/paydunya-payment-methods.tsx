"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, CreditCard, Smartphone, QrCode, Key } from "lucide-react"
import { toast } from "sonner"
import paydunyaService, { PayDunyaPaymentData } from "@/services/paydunyaService"

interface PayDunyaPaymentMethodsProps {
  amount: number
  currency?: string
  description: string
  customerInfo: {
    firstName: string
    lastName: string
    email: string
    phone: string
  }
  onPaymentSuccess?: (result: any) => void
  onPaymentError?: (error: string) => void
  className?: string
}

export function PayDunyaPaymentMethods({ 
  amount, 
  currency = 'XOF', 
  description, 
  customerInfo,
  onPaymentSuccess,
  onPaymentError,
  className 
}: PayDunyaPaymentMethodsProps) {
  const [selectedCountry, setSelectedCountry] = useState<string>('Sénégal')
  const [selectedMethod, setSelectedMethod] = useState<string>('')
  const [availableMethods, setAvailableMethods] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isCreatingInvoice, setIsCreatingInvoice] = useState(false)
  const [invoiceToken, setInvoiceToken] = useState<string>('')
  const [showOTPInput, setShowOTPInput] = useState(false)
  const [otpCode, setOtpCode] = useState<string>('')

  // Charger les méthodes disponibles pour le pays sélectionné
  useEffect(() => {
    const methods = paydunyaService.getPaymentMethodsByCountry(selectedCountry)
    setAvailableMethods(methods)
    setSelectedMethod(methods[0] || '')
  }, [selectedCountry])

  // Créer une facture PayDunya
  const createInvoice = async () => {
    setIsCreatingInvoice(true)
    
    try {
      const invoiceData = {
        amount,
        currency,
        description,
        store_name: 'Ma Boutique',
        customer_info: {
          firstName: customerInfo.firstName,
          lastName: customerInfo.lastName,
          email: customerInfo.email,
          phone: customerInfo.phone
        }
      }

      const result = await paydunyaService.createInvoice(invoiceData)
      
      if (result.success && result.token) {
        setInvoiceToken(result.token)
        toast.success('Facture créée avec succès')
        return result.token
      } else {
        throw new Error(result.error || 'Erreur lors de la création de la facture')
      }
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de la création de la facture')
      onPaymentError?.(error.message)
      return null
    } finally {
      setIsCreatingInvoice(false)
    }
  }

  // Effectuer un paiement
  const processPayment = async () => {
    if (!selectedMethod) {
      toast.error('Veuillez sélectionner une méthode de paiement')
      return
    }

    setIsLoading(true)

    try {
      let token = invoiceToken
      
      // Créer une facture si nécessaire
      if (!token) {
        token = await createInvoice()
        if (!token) return
      }

      const paymentData: PayDunyaPaymentData = {
        customer_name: `${customerInfo.firstName} ${customerInfo.lastName}`,
        customer_email: customerInfo.email,
        phone_number: customerInfo.phone,
        invoice_token: token
      }

      let result

      switch (selectedMethod) {
        case 'orange_money_senegal':
          if (showOTPInput && otpCode) {
            // Paiement OTP
            result = await paydunyaService.payWithOrangeMoneyOTP({
              ...paymentData,
              authorization_code: otpCode
            })
          } else {
            // Paiement QR Code
            result = await paydunyaService.payWithOrangeMoneyQR(paymentData)
            if (result.success && result.url) {
              paydunyaService.redirectToPayment(result.url)
              return
            }
          }
          break

        case 'free_money_senegal':
          result = await paydunyaService.payWithFreeMoney(paymentData)
          break

        case 'wave_senegal':
          result = await paydunyaService.payWithWave(paymentData)
          if (result.success && result.url) {
            paydunyaService.redirectToPayment(result.url)
            return
          }
          break

        default:
          // Pour les autres méthodes, rediriger vers la facture PayDunya
          const invoiceResult = await paydunyaService.createInvoice({
            amount,
            currency,
            description,
            store_name: 'Ma Boutique',
            customer_info: {
              firstName: customerInfo.firstName,
              lastName: customerInfo.lastName,
              email: customerInfo.email,
              phone: customerInfo.phone
            }
          })

          if (invoiceResult.success && invoiceResult.invoice_url) {
            paydunyaService.redirectToPayment(invoiceResult.invoice_url)
            return
          }
          break
      }

      if (result?.success) {
        toast.success(result.message || 'Paiement effectué avec succès')
        onPaymentSuccess?.(result)
      } else {
        throw new Error(result?.error || 'Erreur lors du paiement')
      }

    } catch (error: any) {
      toast.error(error.message || 'Erreur lors du paiement')
      onPaymentError?.(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  // Gérer le changement de méthode de paiement
  const handleMethodChange = (method: string) => {
    setSelectedMethod(method)
    setShowOTPInput(method === 'orange_money_senegal')
    setOtpCode('')
  }

  const formatAmount = (amount: number, currency: string) => {
    return paydunyaService.formatAmount(amount, currency)
  }

  return (
    <div className={`space-y-6 ${className}`}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Méthodes de paiement PayDunya
          </CardTitle>
          <CardDescription>
            Sélectionnez votre pays et votre méthode de paiement préférée
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Sélection du pays */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Pays</label>
            <Select value={selectedCountry} onValueChange={setSelectedCountry}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Sénégal">Sénégal</SelectItem>
                <SelectItem value="Côte d'Ivoire">Côte d'Ivoire</SelectItem>
                <SelectItem value="Burkina Faso">Burkina Faso</SelectItem>
                <SelectItem value="Bénin">Bénin</SelectItem>
                <SelectItem value="Togo">Togo</SelectItem>
                <SelectItem value="Mali">Mali</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Méthodes de paiement disponibles */}
          {availableMethods.length > 0 && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Méthode de paiement</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {availableMethods.map((method) => (
                  <Button
                    key={method}
                    variant={selectedMethod === method ? "default" : "outline"}
                    className="justify-start h-auto p-4"
                    onClick={() => handleMethodChange(method)}
                  >
                    <div className="flex items-center gap-3 w-full">
                      <div className={`w-8 h-8 rounded-full ${paydunyaService.getPaymentMethodColor(method)} flex items-center justify-center text-white text-sm`}>
                        {paydunyaService.getPaymentMethodIcon(method)}
                      </div>
                      <div className="flex-1 text-left">
                        <div className="font-medium">
                          {paydunyaService.getPaymentMethodName(method)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {method.includes('orange_money') && method.includes('senegal') && (
                            <span className="flex items-center gap-1">
                              <QrCode className="h-3 w-3" />
                              QR Code ou OTP
                            </span>
                          )}
                          {method.includes('wave') && (
                            <span className="flex items-center gap-1">
                              <Smartphone className="h-3 w-3" />
                              Application mobile
                            </span>
                          )}
                          {method.includes('card') && (
                            <span className="flex items-center gap-1">
                              <CreditCard className="h-3 w-3" />
                              Carte bancaire
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Code OTP pour Orange Money */}
          {showOTPInput && selectedMethod === 'orange_money_senegal' && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Code OTP Orange Money</label>
              <div className="space-y-2">
                <Alert>
                  <Key className="h-4 w-4" />
                  <AlertDescription>
                    Composez <strong>#144#391*VOTRE_CODE_SECRET#</strong> sur votre téléphone pour générer un code de paiement
                  </AlertDescription>
                </Alert>
                <input
                  type="text"
                  placeholder="Ex: 152347"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                  maxLength={6}
                />
              </div>
            </div>
          )}

          {/* Résumé du paiement */}
          <div className="p-4 bg-muted rounded-lg">
            <h3 className="font-semibold mb-2">Résumé du paiement</h3>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Montant:</span>
                <span className="font-semibold">{formatAmount(amount, currency)}</span>
              </div>
              <div className="flex justify-between">
                <span>Méthode:</span>
                <span>{selectedMethod ? paydunyaService.getPaymentMethodName(selectedMethod) : 'Non sélectionnée'}</span>
              </div>
              <div className="flex justify-between">
                <span>Pays:</span>
                <span>{selectedCountry}</span>
              </div>
            </div>
          </div>

          {/* Bouton de paiement */}
          <Button
            onClick={processPayment}
            disabled={isLoading || isCreatingInvoice || !selectedMethod}
            className="w-full"
            size="lg"
          >
            {isLoading || isCreatingInvoice ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {isCreatingInvoice ? 'Création de la facture...' : 'Traitement du paiement...'}
              </>
            ) : (
              <>
                <CreditCard className="h-4 w-4 mr-2" />
                Payer {formatAmount(amount, currency)}
              </>
            )}
          </Button>

          {/* Informations de sécurité */}
          <Alert>
            <AlertDescription>
              <strong>Sécurité :</strong> Vos informations de paiement sont protégées et transmises de manière sécurisée via PayDunya.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  )
} 