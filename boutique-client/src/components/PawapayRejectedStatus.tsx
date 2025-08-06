import React from 'react'

interface PawapayRejectedStatusProps {
  depositId: string
  failureReason?: {
    failureCode: string
    failureMessage: string
  }
  amount?: string
  currency?: string
  customerName?: string
  createdAt?: string
  provider?: string
}

export default function PawapayRejectedStatus({
  depositId,
  failureReason,
  amount,
  currency,
  customerName,
  createdAt,
  provider
}: PawapayRejectedStatusProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getFailureIcon = (failureCode: string) => {
    const icons = {
      'PROVIDER_TEMPORARILY_UNAVAILABLE': (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
        </svg>
      ),
      'INSUFFICIENT_BALANCE': (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
        </svg>
      ),
      'INVALID_PAYER_FORMAT': (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
        </svg>
      ),
      'default': (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      )
    }
    return icons[failureCode as keyof typeof icons] || icons.default
  }

  const getFailureColor = (failureCode: string) => {
    const colors = {
      'PROVIDER_TEMPORARILY_UNAVAILABLE': 'bg-yellow-50 border-yellow-200 text-yellow-800',
      'INSUFFICIENT_BALANCE': 'bg-red-50 border-red-200 text-red-800',
      'INVALID_PAYER_FORMAT': 'bg-orange-50 border-orange-200 text-orange-800',
      'default': 'bg-red-50 border-red-200 text-red-800'
    }
    return colors[failureCode as keyof typeof colors] || colors.default
  }

  const getFailureTitle = (failureCode: string) => {
    const titles = {
      'PROVIDER_TEMPORARILY_UNAVAILABLE': 'Provider Temporairement Indisponible',
      'INSUFFICIENT_BALANCE': 'Solde Insuffisant',
      'INVALID_PAYER_FORMAT': 'Format de Numéro Invalide',
      'default': 'Erreur de Paiement'
    }
    return titles[failureCode as keyof typeof titles] || titles.default
  }

  const getFailureDescription = (failureCode: string) => {
    const descriptions = {
      'PROVIDER_TEMPORARILY_UNAVAILABLE': 'Le service mobile money est temporairement indisponible. Veuillez réessayer plus tard.',
      'INSUFFICIENT_BALANCE': 'Le solde du compte mobile money est insuffisant pour effectuer ce paiement.',
      'INVALID_PAYER_FORMAT': 'Le format du numéro de téléphone est invalide. Veuillez vérifier le numéro.',
      'default': 'Une erreur est survenue lors du traitement du paiement.'
    }
    return descriptions[failureCode as keyof typeof descriptions] || descriptions.default
  }

  const getSuggestedActions = (failureCode: string) => {
    const actions = {
      'PROVIDER_TEMPORARILY_UNAVAILABLE': [
        'Attendre quelques minutes et réessayer',
        'Essayer un autre provider mobile money',
        'Consulter la page de statut des providers',
        'Contacter le support si le problème persiste'
      ],
      'INSUFFICIENT_BALANCE': [
        'Recharger le compte mobile money',
        'Essayer avec un montant inférieur',
        'Utiliser un autre compte mobile money',
        'Contacter le provider pour plus d\'informations'
      ],
      'INVALID_PAYER_FORMAT': [
        'Vérifier le format du numéro de téléphone',
        'S\'assurer que le préfixe pays est inclus',
        'Supprimer les espaces et caractères spéciaux',
        'Utiliser un autre numéro de téléphone'
      ],
      'default': [
        'Vérifier les informations de paiement',
        'Réessayer le paiement',
        'Contacter le support client',
        'Essayer une autre méthode de paiement'
      ]
    }
    return actions[failureCode as keyof typeof actions] || actions.default
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      {/* Header avec statut */}
      <div className="flex items-center mb-6">
        <div className="p-3 bg-red-50 border border-red-200 rounded-full">
          <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
        <div className="ml-4">
          <h2 className="text-xl font-semibold text-gray-900">Paiement Rejeté</h2>
          <p className="text-sm text-red-600 font-medium">Erreur lors du traitement</p>
        </div>
      </div>

      {/* Message d'erreur principal */}
      {failureReason && (
        <div className={`p-4 rounded-lg border ${getFailureColor(failureReason.failureCode)} mb-6`}>
          <div className="flex items-start">
            <div className="flex-shrink-0">
              {getFailureIcon(failureReason.failureCode)}
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium">
                {getFailureTitle(failureReason.failureCode)}
              </h3>
              <p className="text-sm mt-1">
                {getFailureDescription(failureReason.failureCode)}
              </p>
              {provider && (
                <p className="text-sm mt-2 font-medium">
                  Provider affecté : <span className="font-bold">{provider}</span>
                </p>
              )}
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
                <span className="text-sm text-red-600 font-semibold">REJECTED</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Code d'Erreur</span>
                <span className="text-sm text-gray-900 font-mono">
                  {failureReason?.failureCode || 'UNKNOWN'}
                </span>
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

        {/* Actions suggérées */}
        {failureReason && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-blue-900 mb-3">
              Actions Suggérées
            </h4>
            <ul className="space-y-2">
              {getSuggestedActions(failureReason.failureCode).map((action, index) => (
                <li key={index} className="flex items-start">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-sm text-blue-800">{action}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Actions */}
        <div className="flex space-x-3">
          <button
            onClick={() => {
              // Fonction pour réessayer le paiement
              console.log('Réessayer le paiement pour:', depositId)
            }}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Réessayer le Paiement
          </button>
          <button
            onClick={() => {
              // Fonction pour contacter le support
              console.log('Contacter le support pour:', depositId)
            }}
            className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Contacter le Support
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

              {/* Étape 3: Paiement rejeté (actuel) */}
              <div className="relative flex items-center">
                <div className="absolute left-0 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <div className="ml-12">
                  <p className="text-sm font-medium text-red-900">Paiement rejeté</p>
                  <p className="text-xs text-red-600">
                    {failureReason?.failureCode === 'PROVIDER_TEMPORARILY_UNAVAILABLE' 
                      ? 'Provider temporairement indisponible'
                      : 'Erreur lors du traitement'
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 