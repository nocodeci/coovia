import React from 'react'
import WaveCIForm from './paydunya/WaveCIForm'
import OrangeMoneyCIForm from './paydunya/OrangeMoneyCIForm'
import MTNCIForm from './paydunya/MTNCIForm'
import MoovCIForm from './paydunya/MoovCIForm'
import OrangeMoneyBurkinaForm from './paydunya/OrangeMoneyBurkinaForm'
import OrangeMoneySenegalForm from './paydunya/OrangeMoneySenegalForm'
import FreeMoneySenegalForm from './paydunya/FreeMoneySenegalForm'
import ExpressoSenegalForm from './paydunya/ExpressoSenegalForm'
import WaveSenegalForm from './paydunya/WaveSenegalForm'
import MoovBeninForm from './paydunya/MoovBeninForm'
import MTNBeninForm from './paydunya/MTNBeninForm'
import TMoneyTogoForm from './paydunya/TMoneyTogoForm'
import OrangeMoneyMaliForm from './paydunya/OrangeMoneyMaliForm'
import MoovMaliForm from './paydunya/MoovMaliForm'
import EMoneySenegalForm from './paydunya/EMoneySenegalForm'
import WizallSenegalForm from './paydunya/WizallSenegalForm'
import TogocelTogoForm from './paydunya/TogocelTogoForm'
import MTNMomoZambiaForm from './pawapay/MTNMomoZambiaForm'
import AirtelMoneyZambiaForm from './pawapay/AirtelMoneyZambiaForm'
import ZamtelMoneyZambiaForm from './pawapay/ZamtelMoneyZambiaForm'
import MTNMomoUgandaForm from './pawapay/MTNMomoUgandaForm'

interface PaymentFormRendererProps {
  selectedMethod: string
  paymentToken: string
  customerName: string
  customerEmail: string
  customerPhone: string
  amount: number
  currency: string
  onSuccess: (response: any) => void
  onError: (error: any) => void
}

const PaymentFormRenderer: React.FC<PaymentFormRendererProps> = ({
  selectedMethod,
  paymentToken,
  customerName,
  customerEmail,
  customerPhone,
  amount,
  currency,
  onSuccess,
  onError
}) => {
  // Props communes pour tous les formulaires
  const commonProps = {
    paymentToken,
    customerName,
    customerEmail,
    customerPhone,
    amount,
    currency,
    onSuccess,
    onError
  }

  switch (selectedMethod) {
    case 'wave-ci':
      return <WaveCIForm {...commonProps} />
    
    case 'orange-money-ci':
      return <OrangeMoneyCIForm {...commonProps} />
    
    case 'mtn-ci':
      return <MTNCIForm {...commonProps} />
    
    case 'moov-ci':
      return <MoovCIForm {...commonProps} />
    
    case 'orange-money-burkina':
      return <OrangeMoneyBurkinaForm {...commonProps} />
    
    case 'orange-money-senegal':
      return <OrangeMoneySenegalForm {...commonProps} />
    
    case 'free-money-senegal':
      return <FreeMoneySenegalForm {...commonProps} />
    
    case 'expresso-senegal':
      return <ExpressoSenegalForm {...commonProps} />
    
    case 'wave-senegal':
      return <WaveSenegalForm {...commonProps} />
    
    case 'e-money-senegal':
      return <EMoneySenegalForm {...commonProps} />
    
    case 'wizall-senegal':
      return <WizallSenegalForm {...commonProps} />
    
    case 'moov-benin':
      return <MoovBeninForm {...commonProps} />
    
    case 'mtn-benin':
      return <MTNBeninForm {...commonProps} />
    
    case 'togocel-togo':
      return <TogocelTogoForm {...commonProps} />
    
    case 't-money-togo':
      return <TMoneyTogoForm {...commonProps} />
    
    case 'mtn-momo-zambia':
      return <MTNMomoZambiaForm {...commonProps} />
    
    case 'airtel-money-zambia':
      return <AirtelMoneyZambiaForm {...commonProps} />
    
    case 'zamtel-money-zambia':
      return <ZamtelMoneyZambiaForm {...commonProps} />
    
    case 'mtn-momo-uganda':
      return <MTNMomoUgandaForm {...commonProps} />
    
    case 'orange-money-mali':
      return <OrangeMoneyMaliForm {...commonProps} />
    
    case 'moov-mali':
      return <MoovMaliForm {...commonProps} />
    
    default:
      return (
        <div className="text-center p-6">
          <p className="text-gray-600">Méthode de paiement non supportée</p>
        </div>
      )
  }
}

export default PaymentFormRenderer 