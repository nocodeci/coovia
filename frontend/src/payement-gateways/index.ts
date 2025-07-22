import { paydunyaGateway } from "./paydunya"
import { fedapayGateway } from "./fedapay"
import { pawapayGateway } from "./pawapay"
import { cinetpayGateway } from "./cinetpay"
import { paystackGateway } from "./paystack"
import { flutterwaveGateway } from "./flutterwave"
import type { PaymentGateway } from "../types/payment"

export const paymentGateways: PaymentGateway[] = [
  paydunyaGateway,
  fedapayGateway,
  pawapayGateway,
  cinetpayGateway,
  paystackGateway,
  flutterwaveGateway,
]

export const getGatewayById = (id: string): PaymentGateway | undefined => {
  return paymentGateways.find((gateway) => gateway.id === id)
}

export const getGatewaysByCountry = (countryCode: string): PaymentGateway[] => {
  return paymentGateways.filter((gateway) => gateway.countryCode === countryCode || gateway.countryCode === "MULTI")
}

export const getPaymentMethodsByGateway = (gatewayId: string) => {
  const gateway = getGatewayById(gatewayId)
  return gateway?.supportedMethods || []
}
