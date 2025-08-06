import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { ArrowRight, CheckCircle, AlertCircle, ChevronDown, Phone, Mail, User } from "lucide-react"
import { CircleFlag } from 'react-circle-flags'
import { useToast } from '../hooks/use-toast'

// Import des composants de paiement
import PaymentMethodSelector from './PaymentMethodSelector'
import PaydunyaPaymentMethodSelector from './paydunya/PaymentMethodSelector'
import PaymentFormRenderer from './PaymentFormRenderer'
import OTPInput from './OTPInput'

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

interface SavedCustomerData {
  email: string
  firstName: string
  lastName: string
  phone: string
  country: string
  lastUsed: Date
}

interface FormErrors {
  [key: string]: string
}

// Data
const countries: Country[] = [
  { name: 'Côte d\'Ivoire', code: 'CI', flag: 'ci', currency: 'XOF', currencySymbol: 'F CFA' },
  { name: 'Sénégal', code: 'SN', flag: 'sn', currency: 'XOF', currencySymbol: 'F CFA' },
  { name: 'Mali', code: 'ML', flag: 'ml', currency: 'XOF', currencySymbol: 'F CFA' },
  { name: 'Burkina Faso', code: 'BF', flag: 'bf', currency: 'XOF', currencySymbol: 'F CFA' },
  { name: 'Bénin', code: 'BJ', flag: 'bj', currency: 'XOF', currencySymbol: 'F CFA' },
  { name: 'Togo', code: 'TG', flag: 'tg', currency: 'XOF', currencySymbol: 'F CFA' }
]

const phoneCountries: PhoneCountry[] = [
  { name: 'Côte d\'Ivoire', code: 'CI', flag: 'ci', phoneCode: '225' },
  { name: 'Sénégal', code: 'SN', flag: 'sn', phoneCode: '221' },
  { name: 'Mali', code: 'ML', flag: 'ml', phoneCode: '223' },
  { name: 'Burkina Faso', code: 'BF', flag: 'bf', phoneCode: '226' },
  { name: 'Bénin', code: 'BJ', flag: 'bj', phoneCode: '229' },
  { name: 'Togo', code: 'TG', flag: 'tg', phoneCode: '228' }
]

const paymentMethodsByCountry: { [key: string]: PaymentMethod[] } = {
  'CI': [
    { id: 'orange-money-ci', name: 'Orange Money', logo: '/orange-money.png', type: 'mobile_money', country: 'CI', enabled: true },
    { id: 'wave-ci', name: 'Wave', logo: '/wave.png', type: 'mobile_money', country: 'CI', enabled: true },
    { id: 'mtn-ci', name: 'MTN Money', logo: '/mtn-money.png', type: 'mobile_money', country: 'CI', enabled: true },
    { id: 'moov-ci', name: 'Moov Money', logo: '/moov-money.png', type: 'mobile_money', country: 'CI', enabled: true }
  ],
  'SN': [
    { id: 'e-money-senegal', name: 'E-Money', logo: 'https://assets.cdn.moneroo.io/icons/circle/e_money_sn.svg', type: 'mobile_money', country: 'SN', enabled: true },
    { id: 'wizall-senegal', name: 'Wizall', logo: 'https://assets.cdn.moneroo.io/icons/circle/wizall_sn.svg', type: 'mobile_money', country: 'SN', enabled: true },
    { id: 'wave-senegal', name: 'Wave', logo: 'https://assets.cdn.moneroo.io/icons/circle/wave.svg', type: 'mobile_money', country: 'SN', enabled: true },
    { id: 'free-money-senegal', name: 'Free Money', logo: 'https://assets.cdn.moneroo.io/icons/circle/freemoney_sn.svg', type: 'mobile_money', country: 'SN', enabled: true },
    { id: 'orange-money-senegal', name: 'Orange Money', logo: 'https://assets.cdn.moneroo.io/icons/circle/orange_money.svg', type: 'mobile_money', country: 'SN', enabled: true }
  ],
  'TG': [
    { id: 'togocel-togo', name: 'Togocel Money', logo: 'https://assets.cdn.moneroo.io/icons/circle/togocel.svg', type: 'mobile_money', country: 'TG', enabled: true },
    { id: 't-money-togo', name: 'T-Money', logo: '/t-money.png', type: 'mobile_money', country: 'TG', enabled: true }
  ]
}

// Components
function CountrySelector({ selectedCountry, onCountrySelect }: { selectedCountry: string, onCountrySelect: (country: string) => void }) {
  const [isOpen, setIsOpen] = useState(false)
  const selectedCountryData = countries.find(c => c.code === selectedCountry) || countries[0]

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-lg hover:border-gray-300 transition-all duration-200"
      >
        <CircleFlag countryCode={selectedCountryData.flag} className="w-5 h-5 rounded-full" />
        <span className="text-sm font-medium text-gray-900">{selectedCountryData.name}</span>
        <ChevronDown className="w-4 h-4 text-gray-400 ml-auto" />
      </button>

      {isOpen && createPortal(
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/20" onClick={() => setIsOpen(false)} />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 bg-white border-2 border-gray-200 rounded-lg shadow-xl max-h-60 overflow-y-auto">
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
                <span className="text-sm text-gray-900 flex-1">{country.name}</span>
                <span className="text-xs text-gray-500">{country.currencySymbol}</span>
              </button>
            ))}
          </div>
        </div>,
        document.body
      )}
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
  const { toast } = useToast()
  const [selectedCountry, setSelectedCountry] = useState('CI')
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('')
  const [formData, setFormData] = useState<FormData>({
    email: '',
    firstName: '',
    lastName: '',
    phone: ''
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [checkoutData, setCheckoutData] = useState<any>(null)
  const [paymentToken, setPaymentToken] = useState<string>('')
  const [showPaydunyaForm, setShowPaydunyaForm] = useState(false)
  const [showOtpStep, setShowOtpStep] = useState(false)
  const [otpCode, setOtpCode] = useState('')
  const [otpStatus, setOtpStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [otpMessage, setOtpMessage] = useState('')
  const [savedCustomers, setSavedCustomers] = useState<SavedCustomerData[]>([])
  const [showSavedCustomers, setShowSavedCustomers] = useState(false)
  const [selectedCustomerIndex, setSelectedCustomerIndex] = useState<number | null>(null)

  useEffect(() => {
    const storedData = sessionStorage.getItem('checkoutData')
    if (storedData) {
      setCheckoutData(JSON.parse(storedData))
    }
    
    // Charger les coordonnées sauvegardées
    loadSavedCustomers()
  }, [])

  // Fonction pour charger les coordonnées sauvegardées
  const loadSavedCustomers = () => {
    try {
      // 1. On vérifie localStorage en premier
      let saved = localStorage.getItem('savedCustomers')

      // 2. Si c'est vide, on vérifie les cookies
      if (!saved) {
        saved = loadFromCookies()

        // 3. Si on trouve dans les cookies, on "répare" localStorage
        if (saved) {
          localStorage.setItem('savedCustomers', saved)
        }
      }
      
      if (saved) {
        const parsed = JSON.parse(saved)
        setSavedCustomers(parsed.map((customer: any) => ({
          ...customer,
          lastUsed: new Date(customer.lastUsed)
        })))
      }
    } catch (error) {
      console.error('Erreur lors du chargement des coordonnées sauvegardées:', error)
    }
  }

  // Fonction pour sauvegarder les coordonnées
  const saveCustomerData = (customerData: SavedCustomerData) => {
    try {
      const existing = savedCustomers.filter(c => 
        c.email !== customerData.email || c.phone !== customerData.phone
      )
      const updated = [customerData, ...existing].slice(0, 5) // Garder max 5 entrées
      setSavedCustomers(updated)
      
      // Quand l'utilisateur enregistre ses coordonnées
      const dataToSave = JSON.stringify(updated)
      localStorage.setItem('savedCustomers', dataToSave)
      saveToCookies(dataToSave)
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des coordonnées:', error)
    }
  }

  // Fonction pour utiliser des coordonnées sauvegardées
  const handleUseSavedCustomer = (customer: SavedCustomerData, index: number) => {
    // Si le même client est déjà sélectionné, on le désélectionne
    if (selectedCustomerIndex === index) {
      setSelectedCustomerIndex(null)
      setFormData({
        email: '',
        firstName: '',
        lastName: '',
        phone: ''
      })
      setSelectedCountry('CI') // Retour au pays par défaut
    } else {
      // Sinon, on sélectionne le nouveau client
      setSelectedCustomerIndex(index)
      setFormData({
        email: customer.email,
        firstName: customer.firstName,
        lastName: customer.lastName,
        phone: customer.phone
      })
      setSelectedCountry(customer.country)
      
      // Mettre à jour la date d'utilisation
      const updatedCustomer = { ...customer, lastUsed: new Date() }
      const updated = savedCustomers.map((c, i) => 
        i === index ? updatedCustomer : c
      )
      setSavedCustomers(updated)
      
      // Quand l'utilisateur enregistre ses coordonnées
      const dataToSave = JSON.stringify(updated)
      localStorage.setItem('savedCustomers', dataToSave)
      saveToCookies(dataToSave)
    }
  }

  // Fonction pour masquer le numéro de téléphone
  const maskPhoneNumber = (phone: string) => {
    if (phone.length < 4) return phone
    const visible = phone.slice(-2)
    const hidden = '*'.repeat(phone.length - 4)
    return `${phone.slice(0, 2)}${hidden}${visible}`
  }

  // Fonction pour sauvegarder dans les cookies
  const saveToCookies = (data: string) => {
    try {
      // Sauvegarder dans un cookie avec expiration de 30 jours
      const expirationDate = new Date()
      expirationDate.setDate(expirationDate.getDate() + 30)
      document.cookie = `savedCustomers=${encodeURIComponent(data)}; expires=${expirationDate.toUTCString()}; path=/`
    } catch (error) {
      console.error('Erreur lors de la sauvegarde dans les cookies:', error)
    }
  }

  // Fonction pour charger depuis les cookies
  const loadFromCookies = (): string | null => {
    try {
      const cookies = document.cookie.split(';')
      const savedCustomersCookie = cookies.find(cookie => 
        cookie.trim().startsWith('savedCustomers=')
      )
      if (savedCustomersCookie) {
        return decodeURIComponent(savedCustomersCookie.split('=')[1])
      }
      return null
    } catch (error) {
      console.error('Erreur lors du chargement depuis les cookies:', error)
      return null
    }
  }

  // Réinitialiser la méthode de paiement quand le pays change
  useEffect(() => {
            handlePaymentMethodChange('')
  }, [selectedCountry])

  const validateField = (field: string, value: string): string | null => {
    switch (field) {
      case 'email':
        return !value ? 'Email requis' : !validateEmail(value) ? 'Email invalide' : null
      case 'firstName':
        return !value ? 'Prénom requis' : value.length < 2 ? 'Prénom trop court' : null
      case 'lastName':
        return !value ? 'Nom requis' : value.length < 2 ? 'Nom trop court' : null
      case 'phone':
        if (!value) return 'Téléphone requis'
        if (value.length < 8) return 'Téléphone invalide'
        
        // Validation spécifique selon le pays et la méthode de paiement
        if (selectedCountry === 'CI') {
          // Validation pour Côte d'Ivoire
          const phoneRegex = /^[0-9]{8,10}$/
          if (!phoneRegex.test(value)) {
            return 'Format invalide pour Côte d\'Ivoire'
          }
          
          // Validation spécifique selon la méthode de paiement
          if (selectedPaymentMethod) {
            if (selectedPaymentMethod === 'moov-ci') {
              // Moov CI: numéros commençant par 01, 02, 03, 04, 05, 06, 07, 08, 09
              const moovRegex = /^0[1-9][0-9]{6,7}$/
              if (!moovRegex.test(value)) {
                return 'Format Moov invalide (01xxxxxxxx)'
              }
            } else if (selectedPaymentMethod === 'mtn-ci') {
              // MTN CI: numéros commençant par 07, 08, 09
              const mtnRegex = /^0[7-9][0-9]{6,7}$/
              if (!mtnRegex.test(value)) {
                return 'Format MTN invalide (07xxxxxxxx)'
              }
            } else if (selectedPaymentMethod === 'orange-money-ci') {
              // Orange Money CI: numéros commençant par 01, 02, 03, 04, 05, 06, 07, 08, 09
              const orangeRegex = /^0[1-9][0-9]{6,7}$/
              if (!orangeRegex.test(value)) {
                return 'Format Orange Money invalide (01xxxxxxxx)'
              }
            } else if (selectedPaymentMethod === 'wave-ci') {
              // Wave CI: numéros commençant par 01, 02, 03, 04, 05, 06, 07, 08, 09
              const waveRegex = /^0[1-9][0-9]{6,7}$/
              if (!waveRegex.test(value)) {
                return 'Format Wave invalide (01xxxxxxxx)'
              }
            }
          }
        } else if (selectedCountry === 'SN') {
          // Validation pour Sénégal
          const phoneRegex = /^[0-9]{9}$/
          if (!phoneRegex.test(value)) {
            return 'Format invalide pour Sénégal'
          }
          
          // Validation spécifique selon la méthode de paiement
          if (selectedPaymentMethod) {
            if (selectedPaymentMethod === 'e-money-senegal') {
              // E-Money Sénégal: numéros commençant par 7
              const eMoneyRegex = /^7[0-9]{8}$/
              if (!eMoneyRegex.test(value)) {
                return 'Format E-Money invalide (7xxxxxxxx)'
              }
            } else if (selectedPaymentMethod === 'wizall-senegal') {
              // Wizall Sénégal: numéros commençant par 7
              const wizallRegex = /^7[0-9]{8}$/
              if (!wizallRegex.test(value)) {
                return 'Format Wizall invalide (7xxxxxxxx)'
              }
            } else if (selectedPaymentMethod === 'wave-senegal') {
              // Wave Sénégal: numéros commençant par 7
              const waveRegex = /^7[0-9]{8}$/
              if (!waveRegex.test(value)) {
                return 'Format Wave invalide (7xxxxxxxx)'
              }
            } else if (selectedPaymentMethod === 'free-money-senegal') {
              // Free Money Sénégal: numéros commençant par 7
              const freeMoneyRegex = /^7[0-9]{8}$/
              if (!freeMoneyRegex.test(value)) {
                return 'Format Free Money invalide (7xxxxxxxx)'
              }
            } else if (selectedPaymentMethod === 'orange-money-senegal') {
              // Orange Money Sénégal: numéros commençant par 7
              const orangeRegex = /^7[0-9]{8}$/
              if (!orangeRegex.test(value)) {
                return 'Format Orange Money invalide (7xxxxxxxx)'
              }
            }
          }
        } else if (selectedCountry === 'TG') {
          // Validation pour Togo
          const phoneRegex = /^[0-9]{8,9}$/
          if (!phoneRegex.test(value)) {
            return 'Format invalide pour Togo'
          }
          
          // Validation spécifique selon la méthode de paiement
          if (selectedPaymentMethod) {
            if (selectedPaymentMethod === 'togocel-togo') {
              // Togocel Togo: numéros commençant par 9
              const togocelRegex = /^9[0-9]{7,8}$/
              if (!togocelRegex.test(value)) {
                return 'Format Togocel invalide (9xxxxxxxx)'
              }
            } else if (selectedPaymentMethod === 't-money-togo') {
              // T-Money Togo: numéros commençant par 9
              const tMoneyRegex = /^9[0-9]{7,8}$/
              if (!tMoneyRegex.test(value)) {
                return 'Format T-Money invalide (9xxxxxxxx)'
              }
            }
          }
        }
        
        return null
      default:
        return null
    }
  }

  const handleFieldChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    const error = validateField(field, value)
    setErrors(prev => ({ ...prev, [field]: error || '' }))
  }

    // Re-valider le téléphone quand la méthode de paiement change
  const handlePaymentMethodChange = (method: string) => {
    setSelectedPaymentMethod(method)
    // Re-valider le téléphone avec la nouvelle méthode
    if (formData.phone) {
      const error = validateField('phone', formData.phone)
      setErrors(prev => ({ ...prev, phone: error || '' }))
    }
  }

  const validateAllFields = (): boolean => {
    const newErrors: FormErrors = {}
    Object.keys(formData).forEach(field => {
      const error = validateField(field, formData[field as keyof FormData])
      if (error) newErrors[field] = error
    })
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateAllFields()) {
      return
    }

    if (!selectedPaymentMethod) {
      toast({
        title: "Méthode de paiement requise",
        description: "Veuillez sélectionner une méthode de paiement",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)

    try {
      const paymentData = {
        storeId: checkoutData?.storeId || storeId,
        productId: checkoutData?.productId || productId,
        productName: checkoutData?.productName || productName,
        amount: checkoutData?.price || price || 1000, // Valeur par défaut de 1000 XOF
        currency: 'XOF',
        customer: {
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone
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
      
      if (response.ok) {
        const result = await response.json()
        setPaymentToken(result.data.token) // Correction : utiliser result.data.token
        
        // Sauvegarder les coordonnées après un paiement réussi
        const customerData: SavedCustomerData = {
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          country: selectedCountry,
          lastUsed: new Date()
        }
        saveCustomerData(customerData)

        if (selectedPaymentMethod === 'orange-money-ci') {
          setShowOtpStep(true)
        } else {
          // Pour les autres méthodes, afficher le formulaire spécifique
          setShowPaydunyaForm(true)
        }
        
        setIsProcessing(false) // Arrêter le loading
      } else {
        const errorData = await response.json()
        toast({
          title: "Erreur d'initialisation",
          description: errorData.message || 'Erreur lors de l\'initialisation du paiement',
          variant: "destructive",
        })
        setIsProcessing(false) // Arrêter le loading en cas d'erreur
      }
    } catch (error) {
      console.error('Erreur lors du paiement:', error)
      toast({
        title: "Erreur de paiement",
        description: "Erreur lors du paiement. Veuillez réessayer.",
        variant: "destructive",
      })
      setIsProcessing(false)
    }
  }

  const handleOtpSubmit = async () => {
    if (!otpCode || otpCode.length < 4) {
      setOtpMessage('Veuillez entrer un code OTP valide')
      return
    }

    setOtpStatus('loading')
    setOtpMessage('')

    try {
      const response = await fetch('http://localhost:8000/api/process-orange-money-ci-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone_number: formData.phone,
          otp: otpCode,
          payment_token: paymentToken,
          customer_name: `${formData.firstName} ${formData.lastName}`,
          customer_email: formData.email
        })
      })

      const result = await response.json()

      if (result.success) {
        setOtpStatus('success')
        setOtpMessage(result.message)
        setTimeout(() => {
          setIsSubmitted(true)
        }, 2000)
      } else {
        setOtpStatus('error')
        setOtpMessage(result.message || 'Erreur lors de la validation OTP')
      }
    } catch (error) {
      console.error('Erreur OTP:', error)
      setOtpStatus('error')
      setOtpMessage('Erreur lors de la validation OTP')
    }
  }

  const handlePaydunyaSuccess = (response: any) => {
    console.log('Paiement Paydunya réussi:', response)
    setIsSubmitted(true)
  }

  const handlePaydunyaError = (error: any) => {
    console.error('Erreur Paydunya:', error)
    
    // Extraire le message d'erreur de manière plus robuste
    let errorMessage = 'Erreur inconnue'
    
    if (error?.response?.data?.message) {
      errorMessage = error.response.data.message
    } else if (error?.message) {
      errorMessage = error.message
    } else if (typeof error === 'string') {
      errorMessage = error
    } else if (error?.paydunya_response?.message) {
      errorMessage = error.paydunya_response.message
    }
    
    toast({
      title: "Erreur de paiement",
      description: errorMessage,
      variant: "destructive",
    })
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
          <div className="text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Paiement Réussi !</h2>
            <p className="text-gray-600 mb-6">Votre paiement a été traité avec succès.</p>
            
            <Button
              onClick={() => {
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

  // Étape de validation OTP pour Orange Money CI
  if (showOtpStep && paymentToken) {
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
                    <h1 className="text-2xl font-bold mb-2">Validation OTP Orange Money</h1>
                    <p className="text-blue-100">Entrez le code reçu par SMS</p>
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

                {/* Right Column - OTP Form */}
                <div className="p-8">
                  <div className="w-full flex flex-col justify-center items-center max-w-sm mx-auto">
                    {/* Total et icône Orange Money */}
                    <div className="mt-6 mb-6">
                      <div className="text-center mb-1">
                        <div className="font-poppins text-caption text-neutral-60 mb-1">Total</div>
                        <span className="font-poppins text-primary-40 text-heading-01-sm-semibold">
                          {checkoutData?.price || price} F CFA
                        </span>
                      </div>
                      <div className="flex justify-center gap-2 items-center mb-4">
                        <img 
                          src="https://assets.cdn.moneroo.io/icons/circle/orange_money.svg" 
                          width="27" 
                          height="27" 
                          alt="Orange Money"
                        />
                        <div className="font-poppins text-caption text-neutral-60">
                          Orange Money CI
                        </div>
                      </div>
                    </div>

                    {/* Instructions */}
                    <div className="bg-neutral rounded-lg text-center mb-6 p-3 w-full">
                      <div className="font-poppins text-caption text-neutral-40 mb-2">
                        Entrez le code de vérification pour terminer
                      </div>
                      <p className="font-poppins text-critical-40 text-heading-06-sm-bold mt-1">
                        Composez <span className="text-red-600 font-bold">#144*82#</span> sur votre téléphone pour confirmer le paiement.
                      </p>
                    </div>

                    {/* Numéro utilisé */}
                    <div className="bg-gray-50 border border-gray-200 rounded-md p-4 mb-6 w-full">
                      <div className="flex items-center justify-center">
                        <svg className="w-5 h-5 text-gray-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
                        </svg>
                        <span className="text-sm text-gray-600">
                          Numéro utilisé : <span className="font-medium">+225 {formData.phone}</span>
                        </span>
                      </div>
                    </div>

                    {/* OTP Input */}
                    <div className="w-full mb-6">
                      <OTPInput
                        length={4}
                        onComplete={(code: string) => setOtpCode(code)}
                        disabled={otpStatus === 'loading'}
                        className="w-full"
                      />
                    </div>

                    {/* Bouton de validation */}
                    <button
                      onClick={handleOtpSubmit}
                      disabled={otpStatus === 'loading' || !otpCode || otpCode.length < 4}
                      className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400 text-white font-medium py-3 px-6 rounded-lg transition duration-200 ease-in-out disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      {otpStatus === 'loading' ? (
                        <div className="flex items-center space-x-2">
                          <LoadingSpinner size="sm" />
                          <span>Validation en cours...</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center space-x-2">
                          <span>Confirmer</span>
                          <ArrowRight className="w-5 h-5" />
                        </div>
                      )}
                    </button>

                    {/* Messages d'erreur/succès */}
                    {otpMessage && (
                      <div className={`mt-4 p-4 rounded-lg w-full ${
                        otpStatus === 'success' 
                          ? 'bg-green-50 border border-green-200 text-green-800' 
                          : 'bg-red-50 border border-red-200 text-red-800'
                      }`}>
                        <p className="text-sm text-center">{otpMessage}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (showPaydunyaForm && paymentToken) {
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
                    <h1 className="text-2xl font-bold mb-2">Finalisez votre paiement</h1>
                    <p className="text-blue-100">Choisissez votre méthode de paiement mobile</p>
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

                {/* Right Column - Paydunya Forms */}
                <div className="p-8">
                  <PaymentFormRenderer
                    selectedMethod={selectedPaymentMethod}
                    paymentToken={paymentToken}
                    customerName={`${formData.firstName} ${formData.lastName}`}
                    customerEmail={formData.email}
                    customerPhone={`+${phoneCountries.find(c => c.code === selectedCountry)?.phoneCode}${formData.phone}`}
                    amount={checkoutData?.price || price || 1000}
                    currency="XOF"
                    onSuccess={handlePaydunyaSuccess}
                    onError={handlePaydunyaError}
                  />
                </div>
              </div>
            </div>
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
                  <p className="text-blue-100">Remplissez vos informations pour continuer</p>
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

                {/* Sélecteur de méthodes de paiement - s'affiche automatiquement après la sélection du pays */}
                <PaymentMethodSelector
                  selectedCountry={countries.find(c => c.code === selectedCountry)?.name || 'Côte d\'Ivoire'}
                  onMethodSelect={handlePaymentMethodChange}
                  selectedMethod={selectedPaymentMethod}
                />

                {/* Coordonnées sauvegardées */}
                {savedCustomers.length > 0 && (
                  <div className="mb-6">
                    <div className="text-sm text-gray-600 mb-3">Coordonnées précédentes</div>
                    <div className="space-y-2">
                      {savedCustomers.slice(0, 3).map((customer, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => handleUseSavedCustomer(customer, index)}
                          className="w-full cursor-pointer group hover:bg-neutral p-2 pt-4 rounded-lg transition-all duration-200"
                        >
                          <div className="flex flex-row items-center gap-2">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <img 
                                src={`https://assets.cdn.moneroo.io/icons/circle/${customer.country === 'CI' ? 'orange_money' : 'wave'}.svg`}
                                alt="Payment Method"
                                className="w-5 h-5"
                              />
                            </div>
                            <div className="flex flex-row items-center justify-between w-full gap-2">
                              <div className="font-poppins text-caption-medium text-gray-700">
                                {maskPhoneNumber(customer.phone)}
                              </div>
                              <div className="flex items-center">
                                <div className={`w-4 h-4 border-2 rounded flex items-center justify-center transition-all duration-200 ${
                                  selectedCustomerIndex === index 
                                    ? 'bg-blue-600 border-blue-600' 
                                    : 'bg-gray-100 border-gray-300'
                                }`}>
                                  {selectedCustomerIndex === index && (
                                    <svg viewBox="0 0 10 7" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-2 h-2 text-white">
                                      <path d="M4 4.586L1.707 2.293A1 1 0 1 0 .293 3.707l3 3a.997.997 0 0 0 1.414 0l5-5A1 1 0 1 0 8.293.293L4 4.586z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                                    </svg>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="border-t border-gray-200 group-hover:opacity-0 mt-2 transition-opacity duration-200" role="separator"></div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

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
                    disabled={isProcessing || !selectedPaymentMethod}
                    className="w-full"
                    size="lg"
                  >
                    {isProcessing ? (
                      <div className="flex items-center space-x-2">
                        <LoadingSpinner size="sm" />
                        <span>Initialisation du paiement...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center space-x-2">
                        <span>Continuer vers le paiement</span>
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