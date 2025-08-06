import React from 'react'

interface PawapayCompletedWithErrorProps {
  depositId: string
  status: string
  amount: string
  currency: string
  country: string
  payer: {
    type: string
    accountDetails: {
      phoneNumber: string
      provider: string
    }
  }
  customerMessage?: string
  created: string
  providerTransactionId: string
  failureReason?: {
    failureCode: string
    failureMessage: string
  }
  metadata?: {
    orderId?: string
    customerId?: string
  }
}

export default function PawapayCompletedWithError({
  depositId,
  status,
  amount,
  currency,
  country,
  payer,
  customerMessage,
  created,
  providerTransactionId,
  failureReason,
  metadata
}: PawapayCompletedWithErrorProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getProviderName = (providerCode: string) => {
    const providers: { [key: string]: string } = {
      'MTN_MOMO_ZMB': 'MTN MoMo Zambia',
      'AIRTEL_MONEY_ZMB': 'Airtel Money Zambia',
      'ZAMTEL_MONEY_ZMB': 'Zamtel Money Zambia',
      'MTN_MOMO_UG': 'MTN MoMo Uganda',
      'M_PESA_TZ': 'M-Pesa Tanzania',
      'AIRTEL_MONEY_TZ': 'Airtel Money Tanzania',
      'TIGO_PESA_TZ': 'Tigo Pesa Tanzania',
      'M_PESA_KE': 'M-Pesa Kenya',
      'AIRTEL_MONEY_KE': 'Airtel Money Kenya',
      'MTN_MOMO_NG': 'MTN MoMo Nigeria',
      'AIRTEL_MONEY_NG': 'Airtel Money Nigeria'
    }
    return providers[providerCode] || providerCode
  }

  const getCountryName = (countryCode: string) => {
    const countries: { [key: string]: string } = {
      'ZMB': 'Zambie',
      'UG': 'Ouganda',
      'TZ': 'Tanzanie',
      'KE': 'Kenya',
      'NG': 'Nigeria'
    }
    return countries[countryCode] || countryCode
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      {/* Header avec statut */}
      <div className="flex items-center mb-6">
        <div className="p-3 bg-green-50 border border-green-200 rounded-full">
          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
        <div className="ml-4">
          <h2 className="text-xl font-semibold text-gray-900">Paiement Complété</h2>
          <p className="text-sm text-green-600 font-medium">Transaction réussie</p>
        </div>
      </div>

      {/* Message de succès principal */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
        <div className="flex items-start">
          <svg className="w-5 h-5 text-green-600 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <div>
            <h3 className="text-sm font-medium text-green-900 mb-1">
              Paiement traité avec succès
            </h3>
            <p className="text-sm text-green-700">
              Votre paiement a été complété avec succès. Les fonds ont été transférés.
            </p>
          </div>
        </div>
      </div>

      {/* Informations d'erreur précédente (si présente) */}
      {failureReason && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-yellow-600 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
            </svg>
            <div>
              <h3 className="text-sm font-medium text-yellow-900 mb-1">
                Problème résolu
              </h3>
              <p className="text-sm text-yellow-700">
                Un problème initial ({failureReason.failureCode}) a été résolu et le paiement a été complété.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Informations du paiement */}
      <div className="space-y-4">
        {/* Détails du paiement */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Informations de Transaction</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">ID de Dépôt</span>
                <span className="text-sm text-gray-900 font-mono">{depositId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Montant</span>
                <span className="text-sm text-gray-900 font-semibold">
                  {new Intl.NumberFormat('fr-FR', {
                    style: 'currency',
                    currency: currency
                  }).format(parseFloat(amount))}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Pays</span>
                <span className="text-sm text-gray-900">{getCountryName(country)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Provider</span>
                <span className="text-sm text-gray-900">{getProviderName(payer.accountDetails.provider)}</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Statut du Paiement</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Statut</span>
                <span className="text-sm text-green-600 font-semibold">COMPLETED</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">ID Transaction</span>
                <span className="text-sm text-gray-900 font-mono">{providerTransactionId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Numéro</span>
                <span className="text-sm text-gray-900">{payer.accountDetails.phoneNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Créé le</span>
                <span className="text-sm text-gray-900">{formatDate(created)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Métadonnées */}
        {metadata && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-blue-900 mb-2">Informations Supplémentaires</h4>
            <div className="space-y-2">
              {metadata.orderId && (
                <div className="flex justify-between">
                  <span className="text-sm text-blue-700">ID Commande</span>
                  <span className="text-sm text-blue-900 font-mono">{metadata.orderId}</span>
                </div>
              )}
              {metadata.customerId && (
                <div className="flex justify-between">
                  <span className="text-sm text-blue-700">ID Client</span>
                  <span className="text-sm text-blue-900">{metadata.customerId}</span>
                </div>
              )}
              {customerMessage && (
                <div className="flex justify-between">
                  <span className="text-sm text-blue-700">Message</span>
                  <span className="text-sm text-blue-900">{customerMessage}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Timeline */}
        <div className="mt-6">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Progression du Paiement</h4>
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
            <div className="space-y-4">
              {/* Étape 1: Paiement initié */}
              <div className="relative flex items-center">
                <div className="absolute left-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <div className="ml-12">
                  <p className="text-sm font-medium text-gray-900">Paiement initié</p>
                  <p className="text-xs text-gray-500">Le paiement a été créé avec succès</p>
                </div>
              </div>

              {/* Étape 2: Paiement accepté */}
              <div className="relative flex items-center">
                <div className="absolute left-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <div className="ml-12">
                  <p className="text-sm font-medium text-gray-900">Paiement accepté</p>
                  <p className="text-xs text-gray-500">En cours de traitement par le provider</p>
                </div>
              </div>

              {/* Étape 3: Problème résolu (si applicable) */}
              {failureReason && (
                <div className="relative flex items-center">
                  <div className="absolute left-0 w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                    </svg>
                  </div>
                  <div className="ml-12">
                    <p className="text-sm font-medium text-yellow-900">Problème résolu</p>
                    <p className="text-xs text-yellow-600">Le problème initial a été corrigé</p>
                  </div>
                </div>
              )}

              {/* Étape 4: Paiement complété (actuel) */}
              <div className="relative flex items-center">
                <div className="absolute left-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <div className="ml-12">
                  <p className="text-sm font-medium text-green-900">Paiement complété</p>
                  <p className="text-xs text-green-600">Transaction réussie avec succès</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex space-x-3">
          <button
            onClick={() => {
              // Fonction pour télécharger le reçu
              console.log('Télécharger le reçu pour:', depositId)
            }}
            className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            Télécharger le Reçu
          </button>
          <button
            onClick={() => {
              // Fonction pour partager la confirmation
              console.log('Partager la confirmation pour:', depositId)
            }}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Partager la Confirmation
          </button>
        </div>

        {/* Message de confirmation */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <div>
              <p className="text-sm font-medium text-green-800">Paiement confirmé</p>
              <p className="text-sm text-green-700">Vous recevrez un email de confirmation dans quelques minutes.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 