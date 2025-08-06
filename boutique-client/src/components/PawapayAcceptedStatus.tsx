import React from 'react'

interface PawapayAcceptedStatusProps {
  depositId: string
  amount?: string
  currency?: string
  customerName?: string
  createdAt?: string
}

export default function PawapayAcceptedStatus({
  depositId,
  amount,
  currency,
  customerName,
  createdAt
}: PawapayAcceptedStatusProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      {/* Header avec statut */}
      <div className="flex items-center mb-6">
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-full">
          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
        <div className="ml-4">
          <h2 className="text-xl font-semibold text-gray-900">Paiement Accepté</h2>
          <p className="text-sm text-blue-600 font-medium">En cours de traitement</p>
        </div>
      </div>

      {/* Message principal */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-start">
          <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <div>
            <h3 className="text-sm font-medium text-blue-900 mb-1">
              Votre paiement a été accepté
            </h3>
            <p className="text-sm text-blue-700">
              Le paiement est en cours de traitement. Vous recevrez une notification dès que le traitement sera terminé.
            </p>
          </div>
        </div>
      </div>

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
              {amount && currency && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Montant</span>
                  <span className="text-sm text-gray-900 font-semibold">
                    {new Intl.NumberFormat('fr-FR', {
                      style: 'currency',
                      currency: currency
                    }).format(parseFloat(amount))}
                  </span>
                </div>
              )}
              {customerName && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Client</span>
                  <span className="text-sm text-gray-900">{customerName}</span>
                </div>
              )}
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Statut du Paiement</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Statut</span>
                <span className="text-sm text-blue-600 font-semibold">ACCEPTED</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Étape</span>
                <span className="text-sm text-gray-900">En cours de traitement</span>
              </div>
              {createdAt && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Créé le</span>
                  <span className="text-sm text-gray-900">{formatDate(createdAt)}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-yellow-600 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
            </svg>
            <div>
              <h4 className="text-sm font-medium text-yellow-900 mb-1">
                Que se passe-t-il maintenant ?
              </h4>
              <ul className="text-sm text-yellow-800 space-y-1">
                <li>• Le paiement est en cours de traitement par le provider</li>
                <li>• Vous recevrez une notification de statut final</li>
                <li>• Le statut peut changer vers COMPLETED, FAILED, ou REJECTED</li>
                <li>• Vérifiez régulièrement le statut pour les mises à jour</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex space-x-3">
          <button
            onClick={() => {
              // Fonction pour vérifier le statut
              console.log('Vérifier le statut du dépôt:', depositId)
            }}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Vérifier le Statut
          </button>
          <button
            onClick={() => {
              // Fonction pour renvoyer le callback
              console.log('Renvoyer le callback pour:', depositId)
            }}
            className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Renvoyer Callback
          </button>
        </div>

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

              {/* Étape 2: Paiement accepté (actuel) */}
              <div className="relative flex items-center">
                <div className="absolute left-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <div className="ml-12">
                  <p className="text-sm font-medium text-blue-900">Paiement accepté</p>
                  <p className="text-xs text-blue-600">En cours de traitement par le provider</p>
                </div>
              </div>

              {/* Étape 3: En attente */}
              <div className="relative flex items-center">
                <div className="absolute left-0 w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <div className="ml-12">
                  <p className="text-sm font-medium text-gray-500">Confirmation finale</p>
                  <p className="text-xs text-gray-400">En attente de la confirmation</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 