export type PaymentGatewayType = "paydunya" | "fedapay" | "pawapay" | "cinetpay" | "paystack" | "flutterwave"

export type PaymentMethodType = "card" | "mobile-money" | "bank-transfer" | "digital-wallet"

export interface PaymentMethod {
  id: string
  name: string
  type: PaymentMethodType
  country: string
  countryCode: string
  provider: string
  details: string
  logo?: string
  isActive: boolean
}

export interface PaymentGateway {
  id: string
  name: string
  type: PaymentGatewayType
  country: string
  countryCode: string
  logo: string
  supportedMethods: PaymentMethod[]
  isActive: boolean
}

export interface PaymentTransaction {
  id: string
  storeId: string
  clientName: string
  status: "Initié" | "En Attente" | "Succès" | "Échec"
  location: string
  verified: boolean
  paymentGateway: PaymentGateway
  paymentMethod: PaymentMethod
  value: number
  progression: number
  joinDate: string
}
