import React from 'react'
import PawapayRejectedStatus from './PawapayRejectedStatus'

export default function PawapayRejectedExample() {
  // Exemple de données basées sur votre réponse
  const paymentData = {
    depositId: "f4401bd2-1568-4140-bf2d-eb77d2b2b639",
    status: "REJECTED",
    failureReason: {
      failureCode: "PROVIDER_TEMPORARILY_UNAVAILABLE",
      failureMessage: "The provider 'MTN_MOMO_ZMB' is currently not able to process payments. Please consult our status page for downtime information on all providers. Programmatic access is also available, please consult our API docs."
    },
    amount: "15.00",
    currency: "ZMW",
    customerName: "John Doe",
    provider: "MTN_MOMO_ZMB",
    createdAt: new Date().toISOString()
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Exemple - Statut REJECTED Pawapay
          </h1>
          <p className="text-gray-600">
            Affichage du statut REJECTED avec gestion des erreurs spécifiques
          </p>
        </div>

        <PawapayRejectedStatus
          depositId={paymentData.depositId}
          failureReason={paymentData.failureReason}
          amount={paymentData.amount}
          currency={paymentData.currency}
          customerName={paymentData.customerName}
          provider={paymentData.provider}
          createdAt={paymentData.createdAt}
        />

        <div className="mt-8 p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Données JSON Reçues
          </h2>
          <div className="bg-gray-50 rounded-lg p-4">
            <pre className="text-sm text-gray-800 overflow-auto">
              {JSON.stringify({
                "depositId": "f4401bd2-1568-4140-bf2d-eb77d2b2b639",
                "status": "REJECTED",
                "failureReason": {
                  "failureCode": "PROVIDER_TEMPORARILY_UNAVAILABLE",
                  "failureMessage": "The provider 'MTN_MOMO_ZMB' is currently not able to process payments. Please consult our status page for downtime information on all providers. Programmatic access is also available, please consult our API docs."
                }
              }, null, 2)}
            </pre>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Codes d'Erreur Pawapay
            </h3>
            <div className="space-y-3">
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h4 className="text-sm font-medium text-yellow-900">PROVIDER_TEMPORARILY_UNAVAILABLE</h4>
                <p className="text-xs text-yellow-800 mt-1">Provider temporairement indisponible</p>
              </div>
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <h4 className="text-sm font-medium text-red-900">INSUFFICIENT_BALANCE</h4>
                <p className="text-xs text-red-800 mt-1">Solde insuffisant</p>
              </div>
              <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <h4 className="text-sm font-medium text-orange-900">INVALID_PAYER_FORMAT</h4>
                <p className="text-xs text-orange-800 mt-1">Format de numéro invalide</p>
              </div>
              <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                <h4 className="text-sm font-medium text-gray-900">UNKNOWN_ERROR</h4>
                <p className="text-xs text-gray-800 mt-1">Erreur inconnue</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Actions Recommandées
            </h3>
            <div className="space-y-3">
              <div className="flex items-start">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Attendre et réessayer</p>
                  <p className="text-xs text-gray-600">Pour les erreurs temporaires</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Changer de provider</p>
                  <p className="text-xs text-gray-600">Essayer un autre mobile money</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Vérifier les données</p>
                  <p className="text-xs text-gray-600">Format du numéro, montant, etc.</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Contacter le support</p>
                  <p className="text-xs text-gray-600">Si le problème persiste</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 p-6 bg-red-50 rounded-lg">
          <h3 className="text-lg font-semibold text-red-900 mb-3">
            Gestion des Erreurs REJECTED
          </h3>
          <div className="space-y-2 text-sm text-red-800">
            <p>• Le statut <strong>REJECTED</strong> indique que le paiement a été rejeté</p>
            <p>• Chaque rejet a un <strong>code d'erreur spécifique</strong> et un message explicatif</p>
            <p>• Les actions suggérées dépendent du <strong>type d'erreur</strong></p>
            <p>• Certaines erreurs sont <strong>temporaires</strong> et peuvent être résolues en réessayant</p>
            <p>• D'autres nécessitent une <strong>intervention manuelle</strong> (solde insuffisant, format invalide)</p>
          </div>
        </div>

        <div className="mt-8 p-6 bg-blue-50 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">
            Informations Techniques
          </h3>
          <div className="space-y-2 text-sm text-blue-800">
            <p>• <strong>Provider affecté</strong> : MTN_MOMO_ZMB (MTN MoMo Zambia)</p>
            <p>• <strong>Type d'erreur</strong> : Indisponibilité temporaire du service</p>
            <p>• <strong>Solution recommandée</strong> : Attendre et réessayer plus tard</p>
            <p>• <strong>Alternative</strong> : Essayer un autre provider (Airtel Money, Zamtel Money)</p>
            <p>• <strong>Monitoring</strong> : Consulter la page de statut des providers Pawapay</p>
          </div>
        </div>
      </div>
    </div>
  )
} 