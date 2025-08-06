import React, { useState } from 'react'


interface MTNMomoUgandaFormProps {
  paymentToken: string
  customerName: string
  customerEmail: string
  customerPhone: string
  amount: number
  currency: string
  onSuccess: (response: any) => void
  onError: (error: any) => void
}

export default function MTNMomoUgandaForm({ 
  paymentToken,
  customerName,
  customerEmail,
  customerPhone, 
  amount,
  currency,
  onSuccess, 
  onError 
}: MTNMomoUgandaFormProps) {
  const [phone, setPhone] = useState(customerPhone.replace('+256', ''))
  const [isLoading, setIsLoading] = useState(false)


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/pawapay/process/UG/mtn-momo-uganda', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone_number: `+256${phone}`,
          amount: amount,
          customer_name: customerName,
          customer_email: customerEmail
        }),
      })

      const data = await response.json()

      if (data.success) {
        alert('Paiement MTN MoMo Uganda réussi ! ' + data.message)
        onSuccess(data)
      } else {
        const errorMessage = data.message || 'Erreur lors du paiement MTN MoMo Uganda'
        alert('Erreur de paiement MTN MoMo Uganda: ' + errorMessage)
        onError({ message: errorMessage })
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Erreur de communication avec MTN MoMo Uganda'
      alert('Erreur de paiement MTN MoMo Uganda: ' + errorMessage)
              onError({ message: errorMessage })
    } finally {
      setIsLoading(false)
    }
  }

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-UG', {
      style: 'currency',
      currency: currency
    }).format(amount)
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center mb-6">
        <img 
          src="https://assets.cdn.moneroo.io/icons/circle/mtn_momo.svg" 
          alt="MTN MoMo Uganda" 
          className="w-8 h-8 mr-3"
        />
        <div>
          <h3 className="text-lg font-semibold text-gray-900">MTN MoMo Uganda</h3>
          <p className="text-sm text-gray-600">Paiement mobile via MTN Mobile Money</p>
        </div>
      </div>

      <div className="mb-6 p-4 bg-yellow-50 rounded-lg">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-700">Montant à payer :</span>
          <span className="text-lg font-bold text-yellow-600">{formatAmount(amount, currency)}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
            Numéro de téléphone MTN MoMo
          </label>
          <div className="flex">
            <button
              type="button"
              className="flex items-center space-x-2 px-4 py-3 bg-white border-2 border-r-0 border-gray-200 rounded-l-lg hover:border-gray-300 transition-all duration-200"
            >
              <img 
                src="https://react-circle-flags.pages.dev/ug.svg" 
                alt="Uganda" 
                className="w-4 h-4 rounded-full"
              />
              <span className="text-sm font-medium text-gray-900">+256</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-down w-3 h-3 text-gray-400">
                <path d="m6 9 6 6 6-6"></path>
              </svg>
            </button>
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="7xxxxxxxx"
              className="flex-1 rounded-r-lg border-2 border-l-0 border-gray-200 px-4 py-3 text-sm focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/20"
              required
            />
          </div>
          <p className="text-xs text-gray-500 mt-1 flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            Numéro pré-rempli depuis le checkout
          </p>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-yellow-600 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <div className="text-sm text-yellow-800">
              <p className="font-medium mb-1">Instructions de paiement :</p>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li>Assurez-vous d'avoir un compte MTN MoMo actif</li>
                <li>Vous recevrez un SMS de confirmation</li>
                <li>Entrez votre code PIN MTN MoMo pour confirmer</li>
                <li>Le montant sera débité de votre compte MTN MoMo</li>
              </ul>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-yellow-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Traitement en cours...
            </div>
          ) : (
            `Payer ${formatAmount(amount, currency)} avec MTN MoMo`
          )}
        </button>
      </form>
    </div>
  )
} 