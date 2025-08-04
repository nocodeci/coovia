import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { ArrowRight, CheckCircle, AlertCircle, ChevronDown, Phone, Mail, User } from "lucide-react"
import { CircleFlag } from 'react-circle-flags'

// Utility functions
function cn(...inputs: (string | undefined | null | boolean | number)[]): string {
  return inputs.filter(Boolean).join(' ')
}

function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Modern UI Components
const Button = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
}>(({ className, variant = 'primary', size = 'md', ...props }, ref) => {
  const baseClasses = "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
  const variants = {
    primary: "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl",
    secondary: "bg-gray-100 hover:bg-gray-200 text-gray-900",
    outline: "border-2 border-gray-200 hover:border-gray-300 bg-white text-gray-900"
  }
  const sizes = {
    sm: "h-9 px-4 py-2",
    md: "h-12 px-6 py-3",
    lg: "h-14 px-8 py-4"
  }
  
  return (
    <button
      className={cn(baseClasses, variants[variant], sizes[size], className)}
      ref={ref}
      {...props}
    />
  )
})

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement> & {
  icon?: React.ReactNode
}>(({ className, icon, ...props }, ref) => {
  return (
    <div className="relative">
      {icon && (
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          {icon}
        </div>
      )}
      <input
        className={cn(
          "flex h-12 w-full rounded-lg border-2 border-gray-200 bg-white px-4 py-3 text-sm transition-all duration-200 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20",
          icon ? "pl-10" : "",
          className
        )}
        ref={ref}
        {...props}
      />
    </div>
  )
})

// Interfaces
interface Country {
  name: string
  code: string
  flag: string
  currency: string
  currencySymbol: string
}

interface PhoneCountry {
  name: string
  code: string
  flag: string
  phoneCode: string
}

interface PaymentMethod {
  id: string
  name: string
  logo: string
  type: string
  country: string
  enabled: boolean
}

interface FormData {
  email: string
  firstName: string
  lastName: string
  phone: string
}

interface FormErrors {
  [key: string]: string
}

// Data
const countries: Country[] = [
  { name: "Côte d'Ivoire", code: "CI", flag: "ci", currency: "XOF", currencySymbol: "F CFA" },
  { name: "Sénégal", code: "SN", flag: "sn", currency: "XOF", currencySymbol: "F CFA" },
  { name: "Burkina Faso", code: "BF", flag: "bf", currency: "XOF", currencySymbol: "F CFA" },
  { name: "Bénin", code: "BJ", flag: "bj", currency: "XOF", currencySymbol: "F CFA" },
  { name: "Togo", code: "TG", flag: "tg", currency: "XOF", currencySymbol: "F CFA" },
  { name: "Mali", code: "ML", flag: "ml", currency: "XOF", currencySymbol: "F CFA" },
]

const phoneCountries: PhoneCountry[] = [
  { name: "Côte d'Ivoire", code: "CI", flag: "ci", phoneCode: "225" },
  { name: "Sénégal", code: "SN", flag: "sn", phoneCode: "221" },
  { name: "Burkina Faso", code: "BF", flag: "bf", phoneCode: "226" },
  { name: "Bénin", code: "BJ", flag: "bj", phoneCode: "229" },
  { name: "Togo", code: "TG", flag: "tg", phoneCode: "228" },
  { name: "Mali", code: "ML", flag: "ml", phoneCode: "223" },
  { name: "France", code: "FR", flag: "fr", phoneCode: "33" },
  { name: "États-Unis", code: "US", flag: "us", phoneCode: "1" },
  { name: "Canada", code: "CA", flag: "ca", phoneCode: "1" },
  { name: "Royaume-Uni", code: "GB", flag: "gb", phoneCode: "44" },
]

// Configuration des méthodes de paiement par pays (basée sur Paydunya)
const paymentMethodsByCountry: Record<string, PaymentMethod[]> = {
  'CI': [ // Côte d'Ivoire
    {
      id: "orange-money-ci",
      name: "Orange Money CI",
      logo: "https://assets.cdn.moneroo.io/icons/circle/orange_money.svg",
      type: "mobile_money",
      country: "CI",
      enabled: true
    },
    {
      id: "mtn-ci",
      name: "MTN MoMo CI",
      logo: "https://assets.cdn.moneroo.io/icons/circle/momo.svg",
      type: "mobile_money",
      country: "CI",
      enabled: true
    },
    {
      id: "moov-ci",
      name: "Moov Money CI",
      logo: "https://assets.cdn.moneroo.io/icons/circle/moov_money.svg",
      type: "mobile_money",
      country: "CI",
      enabled: true
    },
    {
      id: "wave-ci",
      name: "Wave CI",
      logo: "https://assets.cdn.moneroo.io/icons/circle/wave.svg",
      type: "mobile_money",
      country: "CI",
      enabled: true
    }
  ],
  'SN': [ // Sénégal
    {
      id: "orange-money-senegal",
      name: "Orange Money SN",
      logo: "https://assets.cdn.moneroo.io/icons/circle/orange_money.svg",
      type: "mobile_money",
      country: "SN",
      enabled: true
    },
    {
      id: "free-money-senegal",
      name: "Free Money SN",
      logo: "https://assets.cdn.moneroo.io/icons/circle/free_money.svg",
      type: "mobile_money",
      country: "SN",
      enabled: true
    },
    {
      id: "wave-senegal",
      name: "Wave SN",
      logo: "https://assets.cdn.moneroo.io/icons/circle/wave.svg",
      type: "mobile_money",
      country: "SN",
      enabled: true
    },
    {
      id: "expresso-senegal",
      name: "Expresso SN",
      logo: "https://assets.cdn.moneroo.io/icons/circle/expresso.svg",
      type: "mobile_money",
      country: "SN",
      enabled: true
    },
    {
      id: "wizall-senegal",
      name: "Wizall SN",
      logo: "https://assets.cdn.moneroo.io/icons/circle/wizall.svg",
      type: "mobile_money",
      country: "SN",
      enabled: true
    }
  ],
  'BF': [ // Burkina Faso
    {
      id: "orange-money-burkina",
      name: "Orange Money BF",
      logo: "https://assets.cdn.moneroo.io/icons/circle/orange_money.svg",
      type: "mobile_money",
      country: "BF",
      enabled: true
    },
    {
      id: "moov-burkina",
      name: "Moov Money BF",
      logo: "https://assets.cdn.moneroo.io/icons/circle/moov_money.svg",
      type: "mobile_money",
      country: "BF",
      enabled: true
    }
  ],
  'BJ': [ // Bénin
    {
      id: "moov-benin",
      name: "Moov Money BJ",
      logo: "https://assets.cdn.moneroo.io/icons/circle/moov_money.svg",
      type: "mobile_money",
      country: "BJ",
      enabled: true
    },
    {
      id: "mtn-benin",
      name: "MTN MoMo BJ",
      logo: "https://assets.cdn.moneroo.io/icons/circle/momo.svg",
      type: "mobile_money",
      country: "BJ",
      enabled: true
    }
  ],
  'TG': [ // Togo
    {
      id: "t-money-togo",
      name: "T-Money TG",
      logo: "https://assets.cdn.moneroo.io/icons/circle/t_money.svg",
      type: "mobile_money",
      country: "TG",
      enabled: true
    },
    {
      id: "moov-togo",
      name: "Moov Money TG",
      logo: "https://assets.cdn.moneroo.io/icons/circle/moov_money.svg",
      type: "mobile_money",
      country: "TG",
      enabled: true
    }
  ],
  'ML': [ // Mali
    {
      id: "orange-money-mali",
      name: "Orange Money ML",
      logo: "https://assets.cdn.moneroo.io/icons/circle/orange_money.svg",
      type: "mobile_money",
      country: "ML",
      enabled: true
    },
    {
      id: "moov-mali",
      name: "Moov Money ML",
      logo: "https://assets.cdn.moneroo.io/icons/circle/moov_money.svg",
      type: "mobile_money",
      country: "ML",
      enabled: true
    }
  ]
}

// Components
function CountrySelector({ selectedCountry, onCountrySelect }: { selectedCountry: string, onCountrySelect: (country: string) => void }) {
  const [isOpen, setIsOpen] = useState(false)
  const selected = countries.find(c => c.code === selectedCountry) || countries[0]

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-lg hover:border-gray-300 transition-all duration-200"
      >
        <div className="flex items-center space-x-3">
          <CircleFlag countryCode={selected.flag} className="w-5 h-5 rounded-full" />
          <span className="text-sm font-medium text-gray-900">{selected.name}</span>
        </div>
        <ChevronDown className="w-4 h-4 text-gray-400" />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border-2 border-gray-200 rounded-lg shadow-xl z-50 max-h-60 overflow-y-auto">
          {countries.map((country) => (
            <button
              key={country.code}
              onClick={() => {
                onCountrySelect(country.code)
                setIsOpen(false)
              }}
              className="flex items-center space-x-3 w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors"
            >
              <CircleFlag countryCode={country.flag} className="w-5 h-5 rounded-full" />
              <span className="text-sm text-gray-900">{country.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function PaymentMethods({ selectedMethod, onMethodSelect, selectedCountry }: { 
  selectedMethod: string, 
  onMethodSelect: (methodId: string) => void,
  selectedCountry: string 
}) {
  const availableMethods = paymentMethodsByCountry[selectedCountry] || paymentMethodsByCountry['CI']
  
  return (
    <div className="grid grid-cols-2 gap-3">
      {availableMethods.map((method) => (
        <button
          key={method.id}
          onClick={() => onMethodSelect(method.id)}
          className={`flex flex-col items-center p-4 rounded-lg border-2 transition-all duration-200 ${
            selectedMethod === method.id
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-200 bg-white hover:border-gray-300'
          }`}
        >
          <img src={method.logo} alt={method.name} className="w-8 h-8 mb-2" />
          <span className="text-xs font-medium text-gray-900 text-center">{method.name}</span>
          {selectedMethod === method.id && (
            <CheckCircle className="w-4 h-4 text-blue-500 mt-1" />
          )}
        </button>
      ))}
    </div>
  )
}

function PhoneInput({ value, onChange, selectedCountry, onCountrySelect }: {
  value: string
  onChange: (value: string) => void
  selectedCountry: string
  onCountrySelect: (country: string) => void
}) {
  const [isPhoneCountryOpen, setIsPhoneCountryOpen] = useState(false)
  const selectedPhoneCountry = phoneCountries.find(c => c.code === selectedCountry) || phoneCountries[0]

  return (
    <div className="relative">
      <div className="flex">
        <button
          type="button"
          onClick={() => setIsPhoneCountryOpen(!isPhoneCountryOpen)}
          className="flex items-center space-x-2 px-4 py-3 bg-white border-2 border-r-0 border-gray-200 rounded-l-lg hover:border-gray-300 transition-all duration-200"
        >
          <CircleFlag countryCode={selectedPhoneCountry.flag} className="w-4 h-4 rounded-full" />
          <span className="text-sm font-medium text-gray-900">+{selectedPhoneCountry.phoneCode}</span>
          <ChevronDown className="w-3 h-3 text-gray-400" />
        </button>
        <input
          type="tel"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="0123456789"
          className="flex-1 rounded-r-lg border-2 border-l-0 border-gray-200 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        />
      </div>

      {isPhoneCountryOpen && createPortal(
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/20" onClick={() => setIsPhoneCountryOpen(false)} />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 bg-white border-2 border-gray-200 rounded-lg shadow-xl max-h-60 overflow-y-auto">
            {phoneCountries.map((country) => (
              <button
                key={country.code}
                onClick={() => {
                  onCountrySelect(country.code)
                  setIsPhoneCountryOpen(false)
                }}
                className="flex items-center space-x-3 w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors"
              >
                <CircleFlag countryCode={country.flag} className="w-4 h-4 rounded-full" />
                <span className="text-sm text-gray-900 flex-1">{country.name}</span>
                <span className="text-xs text-gray-500">+{country.phoneCode}</span>
              </button>
            ))}
          </div>
        </div>,
        document.body
      )}
    </div>
  )
}

function LoadingSpinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  }

  return (
    <div className={`animate-spin rounded-full border-2 border-gray-300 border-t-blue-600 ${sizes[size]}`} />
  )
}

// Main Component
interface CheckoutCompleteProps {
  storeId?: string;
  productId?: string;
  productName?: string;
  price?: number;
}

export default function CheckoutComplete({ 
  storeId, 
  productId, 
  productName, 
  price 
}: CheckoutCompleteProps = {}) {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    firstName: '',
    lastName: '',
    phone: ''
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [selectedCountry, setSelectedCountry] = useState('CI')
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('orange-money-ci')

  // Changer automatiquement la méthode de paiement quand le pays change
  useEffect(() => {
    const availableMethods = paymentMethodsByCountry[selectedCountry] || paymentMethodsByCountry['CI']
    if (availableMethods.length > 0) {
      setSelectedPaymentMethod(availableMethods[0].id)
    }
  }, [selectedCountry])
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [checkoutData, setCheckoutData] = useState<any>(null)

  useEffect(() => {
    const data = sessionStorage.getItem('checkoutData')
    if (data) {
      const parsed = JSON.parse(data)
      setCheckoutData(parsed)
      setFormData({
        email: parsed.customer?.email || '',
        firstName: parsed.customer?.firstName || '',
        lastName: parsed.customer?.lastName || '',
        phone: parsed.customer?.phone || ''
      })
    }
  }, [])

  const validateField = (field: string, value: string): string | null => {
    switch (field) {
      case 'email':
        return !value ? 'Email requis' : !validateEmail(value) ? 'Email invalide' : null
      case 'firstName':
        return !value ? 'Prénom requis' : value.length < 2 ? 'Prénom trop court' : null
      case 'lastName':
        return !value ? 'Nom requis' : value.length < 2 ? 'Nom trop court' : null
      case 'phone':
        return !value ? 'Téléphone requis' : value.length < 8 ? 'Téléphone invalide' : null
      default:
        return null
    }
  }

  const handleFieldChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    const error = validateField(field, value)
    setErrors(prev => ({ ...prev, [field]: error || '' }))
  }

  const validateAllFields = (): boolean => {
    const newErrors: FormErrors = {}
    let isValid = true

    Object.keys(formData).forEach(field => {
      const error = validateField(field, formData[field as keyof FormData])
      if (error) {
        newErrors[field] = error
        isValid = false
      }
    })

    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = async () => {
    if (!validateAllFields()) {
      return
    }

    setIsProcessing(true)

    try {
      const paymentData = {
        storeId: checkoutData?.storeId || storeId,
        productId: checkoutData?.productId || productId,
        productName: checkoutData?.productName || productName,
        amount: checkoutData?.price || price,
        currency: 'XOF',
        customer: {
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: `+${phoneCountries.find(c => c.code === selectedCountry)?.phoneCode}${formData.phone}`
        },
        paymentMethod: selectedPaymentMethod,
        paymentCountry: countries.find(c => c.code === selectedCountry)?.name || 'Côte d\'Ivoire'
      }

      const response = await fetch('http://localhost:8000/api/payment/initialize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData)
      })
      
      const result = await response.json()
      
      if (result.success) {
        const lastPayment = {
          ...paymentData,
          timestamp: new Date().toISOString(),
          status: 'initialized',
          method: selectedPaymentMethod,
          paymentUrl: result.data.payment_url,
          token: result.data.token
        }
        
        sessionStorage.setItem('lastPayment', JSON.stringify(lastPayment))
        
        if (result.data.payment_url) {
          window.location.href = result.data.payment_url
        } else {
          setIsProcessing(false)
          setIsSubmitted(true)
        }
      } else {
        alert('Erreur lors de l\'initialisation du paiement: ' + result.message)
        setIsProcessing(false)
      }
    } catch (error) {
      console.error('Erreur lors du paiement:', error)
      alert('Erreur lors du paiement. Veuillez réessayer.')
      setIsProcessing(false)
    }
  }

  if (isSubmitted) {
    const lastPayment = sessionStorage.getItem('lastPayment')
    const paymentInfo = lastPayment ? JSON.parse(lastPayment) : null

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
          <div className="text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Paiement Réussi !</h2>
            <p className="text-gray-600 mb-6">Votre paiement a été traité avec succès.</p>
            
            {paymentInfo && (
              <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
                <div className="space-y-2 text-sm">
                  <div><span className="font-medium">Produit:</span> {paymentInfo.productName}</div>
                  <div><span className="font-medium">Montant:</span> {paymentInfo.amount} F CFA</div>
                  <div><span className="font-medium">Méthode:</span> {paymentInfo.paymentMethod}</div>
                  <div><span className="font-medium">Client:</span> {paymentInfo.customer.firstName} {paymentInfo.customer.lastName}</div>
                  <div><span className="font-medium">Email:</span> {paymentInfo.customer.email}</div>
                  <div><span className="font-medium">Téléphone:</span> {paymentInfo.customer.phone}</div>
                </div>
              </div>
            )}
            
            <Button
              onClick={() => {
                sessionStorage.removeItem('lastPayment')
                window.location.href = `/${checkoutData?.storeId || storeId}`
              }}
              className="w-full"
            >
              Retour à la Boutique
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Left Column - Order Summary */}
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                      <span className="text-lg font-bold">N</span>
                    </div>
                    <span className="text-xl font-bold">NOCODE2</span>
                  </div>
                  <div className="flex items-center space-x-1 text-sm">
                    <span>FR</span>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </div>

                <div className="mb-6">
                  <h1 className="text-2xl font-bold mb-2">Bienvenue, {formData.firstName || 'Utilisateur'} !</h1>
                  <p className="text-blue-100">Choisissez votre moyen de paiement</p>
                </div>

                <div className="mb-6">
                  <div className="text-sm text-blue-200 mb-1">Total</div>
                  <div className="text-3xl font-bold">
                    {checkoutData?.price || price} F CFA
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-blue-200">Sous-total</span>
                    <span>{(checkoutData?.price || price) - 100} F CFA</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-blue-200">Frais</span>
                    <span>100 F CFA</span>
                  </div>
                  <div className="border-t border-blue-500 pt-4">
                    <div className="flex items-center justify-between font-bold">
                      <span>Total</span>
                      <span>{checkoutData?.price || price} F CFA</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Payment Form */}
              <div className="p-8">
                <div className="mb-6">
                  <div className="text-sm text-gray-600 mb-2">Votre pays</div>
                  <CountrySelector
                    selectedCountry={selectedCountry}
                    onCountrySelect={setSelectedCountry}
                  />
                </div>

                <div className="mb-6">
                  <div className="text-sm font-semibold text-gray-900 mb-3">Moyen de paiement</div>
                  <PaymentMethods
                    selectedMethod={selectedPaymentMethod}
                    onMethodSelect={setSelectedPaymentMethod}
                    selectedCountry={selectedCountry}
                  />
                </div>

                <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Prénom <span className="text-red-500">*</span>
                    </label>
                    <Input
                      icon={<User className="w-4 h-4" />}
                      value={formData.firstName}
                      onChange={(e) => handleFieldChange('firstName', e.target.value)}
                      placeholder="Votre prénom"
                      className={errors.firstName ? 'border-red-500' : ''}
                    />
                    {errors.firstName && (
                      <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nom <span className="text-red-500">*</span>
                    </label>
                    <Input
                      icon={<User className="w-4 h-4" />}
                      value={formData.lastName}
                      onChange={(e) => handleFieldChange('lastName', e.target.value)}
                      placeholder="Votre nom"
                      className={errors.lastName ? 'border-red-500' : ''}
                    />
                    {errors.lastName && (
                      <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <Input
                      icon={<Mail className="w-4 h-4" />}
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleFieldChange('email', e.target.value)}
                      placeholder="votre@email.com"
                      className={errors.email ? 'border-red-500' : ''}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Numéro de téléphone <span className="text-red-500">*</span>
                    </label>
                    <PhoneInput
                      value={formData.phone}
                      onChange={(value) => handleFieldChange('phone', value)}
                      selectedCountry={selectedCountry}
                      onCountrySelect={setSelectedCountry}
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full"
                    size="lg"
                  >
                    {isProcessing ? (
                      <div className="flex items-center space-x-2">
                        <LoadingSpinner size="sm" />
                        <span>Traitement du paiement...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center space-x-2">
                        <span>Payer {checkoutData?.price || price} F CFA</span>
                        <ArrowRight className="w-5 h-5" />
                      </div>
                    )}
                  </Button>

                  <p className="text-xs text-gray-500 text-center">
                    <span className="text-red-500">*</span> Des frais supplémentaires peuvent s'appliquer
                  </p>
                </form>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center mt-8">
            <a href="https://moneroo.io" className="flex items-center space-x-2 text-gray-500 hover:text-gray-700 transition-colors">
              <span className="text-sm">Propulsé par</span>
              <img src="https://cdn.axazara.com/brand/moneroo/logo.svg" alt="moneroo" className="h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  )
} 