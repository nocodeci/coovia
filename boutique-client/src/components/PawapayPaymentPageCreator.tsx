import React, { useState } from 'react'


export default function PawapayPaymentPageCreator() {
  const [formData, setFormData] = useState({
    deposit_id: 'f4401bd2-1568-4140-bf2d-eb77d2b2b639',
    amount: '15',
    currency: 'ZMW',
    phone_number: '260763456789',
    country: 'ZMB',
    return_url: 'https://coovia.com/payment-success',
    customer_message: 'Paiement Coovia',
    language: 'EN',
    reason: 'Ticket to festival'
  })
  const [loading, setLoading] = useState(false)
  const [paymentPageUrl, setPaymentPageUrl] = useState('')


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleCreatePaymentPage = async () => {
    setLoading(true)
    setPaymentPageUrl('')

    try {
      const response = await fetch('/api/pawapay/create-payment-page', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (data.success) {
        alert('Succès: Page de paiement créée avec succès')
        
        // Si l'API retourne une URL de page de paiement
        if (data.data?.paymentPageUrl) {
          setPaymentPageUrl(data.data.paymentPageUrl)
        }
      } else {
        alert('Erreur: ' + (data.message || "Erreur lors de la création de page de paiement"))
      }
    } catch (error) {
      console.error('Erreur lors de la création de page de paiement:', error)
      alert('Erreur: Erreur de communication avec le serveur')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        Créer une Page de Paiement Pawapay
      </h2>
      
      <div className="space-y-4">
        {/* Informations de base */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="deposit_id" className="block text-sm font-medium text-gray-700 mb-2">
              ID de Dépôt *
            </label>
            <input
              type="text"
              id="deposit_id"
              name="deposit_id"
              value={formData.deposit_id}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="f4401bd2-1568-4140-bf2d-eb77d2b2b639"
            />
          </div>

          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
              Montant *
            </label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="15"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-2">
              Devise *
            </label>
            <select
              id="currency"
              name="currency"
              value={formData.currency}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="ZMW">ZMW (Zambie)</option>
              <option value="UGX">UGX (Ouganda)</option>
              <option value="TZS">TZS (Tanzanie)</option>
              <option value="KES">KES (Kenya)</option>
              <option value="NGN">NGN (Nigeria)</option>
            </select>
          </div>

          <div>
            <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
              Pays *
            </label>
            <select
              id="country"
              name="country"
              value={formData.country}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="ZMB">ZMB (Zambie)</option>
              <option value="UG">UG (Ouganda)</option>
              <option value="TZ">TZ (Tanzanie)</option>
              <option value="KE">KE (Kenya)</option>
              <option value="NG">NG (Nigeria)</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700 mb-2">
            Numéro de Téléphone *
          </label>
          <input
            type="tel"
            id="phone_number"
            name="phone_number"
            value={formData.phone_number}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="260763456789"
          />
        </div>

        <div>
          <label htmlFor="return_url" className="block text-sm font-medium text-gray-700 mb-2">
            URL de Retour
          </label>
          <input
            type="url"
            id="return_url"
            name="return_url"
            value={formData.return_url}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="https://coovia.com/payment-success"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="customer_message" className="block text-sm font-medium text-gray-700 mb-2">
              Message Client (max 22 caractères)
            </label>
            <input
              type="text"
              id="customer_message"
              name="customer_message"
              value={formData.customer_message}
              onChange={handleInputChange}
              maxLength={22}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Paiement Coovia"
            />
          </div>

          <div>
            <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-2">
              Langue
            </label>
            <select
              id="language"
              name="language"
              value={formData.language}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="EN">EN (Anglais)</option>
              <option value="FR">FR (Français)</option>
              <option value="PT">PT (Portugais)</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-2">
            Raison du Paiement
          </label>
          <input
            type="text"
            id="reason"
            name="reason"
            value={formData.reason}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Ticket to festival"
          />
        </div>

        <button
          onClick={handleCreatePaymentPage}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Création en cours...
            </div>
          ) : (
            'Créer la Page de Paiement'
          )}
        </button>

        {/* URL de la page de paiement */}
        {paymentPageUrl && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <h3 className="text-sm font-medium text-green-900 mb-2">
              Page de Paiement Créée
            </h3>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={paymentPageUrl}
                readOnly
                className="flex-1 px-3 py-2 border border-green-300 rounded-md bg-white text-sm"
              />
              <button
                onClick={() => {
                  navigator.clipboard.writeText(paymentPageUrl)
                  alert('Copié: URL copiée dans le presse-papiers')
                }}
                className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
              >
                Copier
              </button>
              <a
                href={paymentPageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
              >
                Ouvrir
              </a>
            </div>
          </div>
        )}

        {/* Informations */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="text-sm font-medium text-blue-900 mb-2">
            Informations sur la Page de Paiement
          </h3>
          <ul className="text-xs text-blue-800 space-y-1">
            <li>• La page de paiement permet au client de payer directement</li>
            <li>• L'URL peut être partagée avec le client</li>
            <li>• Le client sera redirigé vers l'URL de retour après paiement</li>
            <li>• Supporte tous les providers mobile money du pays sélectionné</li>
          </ul>
        </div>

        {/* Exemple de requête */}
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-medium text-gray-900 mb-2">
            Exemple de Requête API
          </h3>
          <pre className="text-xs text-gray-800 overflow-auto">
{`curl --request POST \\
  --url https://api.sandbox.pawapay.io/v2/paymentpage \\
  --header 'Authorization: Bearer <token>' \\
  --header 'Content-Type: application/json' \\
  --data '{
  "depositId": "f4401bd2-1568-4140-bf2d-eb77d2b2b639",
  "returnUrl": "https://coovia.com/payment-success",
  "customerMessage": "Paiement Coovia",
  "amountDetails": {
    "amount": "15",
    "currency": "ZMW"
  },
  "phoneNumber": "260763456789",
  "language": "EN",
  "country": "ZMB",
  "reason": "Ticket to festival"
}'`}
          </pre>
        </div>
      </div>
    </div>
  )
} 