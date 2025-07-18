import type { PaymentGateway } from "../types/payment"

export const cinetpayGateway: PaymentGateway = {
  id: "cinetpay",
  name: "CinetPay",
  type: "cinetpay",
  country: "Multi-pays Afrique de l'Ouest",
  countryCode: "MULTI",
  logo: "/placeholder.svg?height=40&width=40&text=CinetPay",
  isActive: true,
  supportedMethods: [
    {
      id: "moov-money-tg",
      name: "Moov Money Togo",
      type: "mobile-money",
      country: "Togo",
      countryCode: "TG",
      provider: "Moov",
      details: "+228 XX XX XX XX",
      logo: "/placeholder.svg?height=24&width=24&text=MV",
      isActive: true,
    },
    {
      id: "orange-money-bf",
      name: "Orange Money Burkina Faso",
      type: "mobile-money",
      country: "Burkina Faso",
      countryCode: "BF",
      provider: "Orange",
      details: "+226 XX XX XX XX",
      logo: "/placeholder.svg?height=24&width=24&text=OM",
      isActive: true,
    },
    {
      id: "mtn-money-gh",
      name: "MTN Mobile Money Ghana",
      type: "mobile-money",
      country: "Ghana",
      countryCode: "GH",
      provider: "MTN",
      details: "+233 XX XXX XXXX",
      logo: "/placeholder.svg?height=24&width=24&text=MTN",
      isActive: true,
    },
    {
      id: "visa-cinetpay",
      name: "Visa Card",
      type: "card",
      country: "International",
      countryCode: "INTL",
      provider: "Visa",
      details: "**** **** **** XXXX",
      logo: "/placeholder.svg?height=24&width=24&text=VISA",
      isActive: true,
    },
  ],
}
