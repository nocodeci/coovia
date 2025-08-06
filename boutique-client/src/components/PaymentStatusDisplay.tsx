import React from 'react'

interface PaymentStatusDisplayProps {
  status: string
  statusInfo?: {
    title: string
    description: string
    color: string
    icon: string
  }
  amount?: string
  currency?: string
  transactionId?: string
  createdAt?: string
  providerTransactionId?: string
}

export default function PaymentStatusDisplay({
  status,
  statusInfo,
  amount,
  currency,
  transactionId,
  createdAt,
  providerTransactionId
}: PaymentStatusDisplayProps) {
  const getStatusColor = (color: string) => {
    const colors = {
      green: 'bg-green-50 border-green-200 text-green-800',
      blue: 'bg-blue-50 border-blue-200 text-blue-800',
      yellow: 'bg-yellow-50 border-yellow-200 text-yellow-800',
      red: 'bg-red-50 border-red-200 text-red-800',
      gray: 'bg-gray-50 border-gray-200 text-gray-800'
    }
    return colors[color as keyof typeof colors] || colors.gray
  }

  const getStatusIcon = (icon: string) => {
    const icons = {
      'check-circle': (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      ),
      'clock': (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      ),
      'x-circle': (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      ),
      'help-circle': (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      )
    }
    return icons[icon as keyof typeof icons] || icons['help-circle']
  }

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
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center mb-4">
        <div className={`p-2 rounded-full ${getStatusColor(statusInfo?.color || 'gray')}`}>
          {getStatusIcon(statusInfo?.icon || 'help-circle')}
        </div>
        <div className="ml-3">
          <h3 className="text-lg font-semibold text-gray-900">
            {statusInfo?.title || `Statut: ${status}`}
          </h3>
          <p className="text-sm text-gray-600">
            {statusInfo?.description || 'Statut du paiement'}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Informations de base */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="text-sm font-medium text-gray-500">Statut</span>
            <p className="text-sm text-gray-900 font-semibold">{status}</p>
          </div>
          {amount && currency && (
            <div>
              <span className="text-sm font-medium text-gray-500">Montant</span>
              <p className="text-sm text-gray-900 font-semibold">
                {new Intl.NumberFormat('fr-FR', {
                  style: 'currency',
                  currency: currency
                }).format(parseFloat(amount))}
              </p>
            </div>
          )}
        </div>

        {/* Informations de transaction */}
        {(transactionId || providerTransactionId) && (
          <div className="border-t pt-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Informations de Transaction</h4>
            <div className="space-y-2">
              {transactionId && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">ID Transaction</span>
                  <span className="text-sm text-gray-900 font-mono">{transactionId}</span>
                </div>
              )}
              {providerTransactionId && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">ID Provider</span>
                  <span className="text-sm text-gray-900 font-mono">{providerTransactionId}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Date de création */}
        {createdAt && (
          <div className="border-t pt-4">
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Créé le</span>
              <span className="text-sm text-gray-900">{formatDate(createdAt)}</span>
            </div>
          </div>
        )}

        {/* Message de statut */}
        {status === 'COMPLETED' && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <div>
                <p className="text-sm font-medium text-green-800">Paiement Complété</p>
                <p className="text-sm text-green-700">Votre paiement a été traité avec succès</p>
              </div>
            </div>
          </div>
        )}

        {status === 'FAILED' && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <div>
                <p className="text-sm font-medium text-red-800">Paiement Échoué</p>
                <p className="text-sm text-red-700">Le paiement n'a pas pu être traité</p>
              </div>
            </div>
          </div>
        )}

        {status === 'PENDING' && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-yellow-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <div>
                <p className="text-sm font-medium text-yellow-800">Paiement en Attente</p>
                <p className="text-sm text-yellow-700">Veuillez patienter pendant le traitement</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 