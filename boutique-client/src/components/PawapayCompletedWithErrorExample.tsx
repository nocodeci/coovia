import React from 'react'
import PawapayCompletedWithError from './PawapayCompletedWithError'

export default function PawapayCompletedWithErrorExample() {
  // Exemple de données basées sur votre réponse
  const paymentData = {
    depositId: "f4401bd2-1568-4140-bf2d-eb77d2b2b639",
    status: "COMPLETED",
    amount: "15",
    currency: "ZMW",
    country: "ZMB",
    payer: {
      type: "MMO",
      accountDetails: {
        phoneNumber: "260763456789",
        provider: "MTN_MOMO_ZMB"
      }
    },
    customerMessage: "Note of 4 to 22 chars",
    created: "2020-02-21T17:32:29Z",
    providerTransactionId: "ABC123",
    failureReason: {
      failureCode: "INSUFFICIENT_BALANCE",
      failureMessage: "The customer does not have enough funds to complete this payment."
    },
    metadata: {
      orderId: "ORD-123456789",
      customerId: "customer@email.com"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Exemple - Paiement COMPLETED avec Erreur Résolue
          </h1>
          <p className="text-gray-600">
            Affichage d'un paiement complété avec des informations sur un problème résolu
          </p>
        </div>

        <PawapayCompletedWithError
          depositId={paymentData.depositId}
          status={paymentData.status}
          amount={paymentData.amount}
          currency={paymentData.currency}
          country={paymentData.country}
          payer={paymentData.payer}
          customerMessage={paymentData.customerMessage}
          created={paymentData.created}
          providerTransactionId={paymentData.providerTransactionId}
          failureReason={paymentData.failureReason}
          metadata={paymentData.metadata}
        />

        <div className="mt-8 p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Données JSON Reçues
          </h2>
          <div className="bg-gray-50 rounded-lg p-4">
            <pre className="text-sm text-gray-800 overflow-auto">
              {JSON.stringify({
                "depositId": "f4401bd2-1568-4140-bf2d-eb77d2b2b639",
                "status": "COMPLETED",
                "amount": "15",
                "currency": "ZMW",
                "country": "ZMB",
                "payer": {
                  "type": "MMO",
                  "accountDetails": {
                    "phoneNumber": "260763456789",
                    "provider": "MTN_MOMO_ZMB"
                  }
                },
                "customerMessage": "Note of 4 to 22 chars",
                "created": "2020-02-21T17:32:29Z",
                "providerTransactionId": "ABC123",
                "failureReason": {
                  "failureCode": "INSUFFICIENT_BALANCE",
                  "failureMessage": "The customer does not have enough funds to complete this payment."
                },
                "metadata": {
                  "orderId": "ORD-123456789",
                  "customerId": "customer@email.com"
                }
              }, null, 2)}
            </pre>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Analyse du Paiement
            </h3>
            <div className="space-y-3">
              <div className="flex items-start">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Statut final : COMPLETED</p>
                  <p className="text-xs text-gray-600">Le paiement a été complété avec succès</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Problème initial : INSUFFICIENT_BALANCE</p>
                  <p className="text-xs text-gray-600">Solde insuffisant qui a été résolu</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Provider : MTN MoMo Zambia</p>
                  <p className="text-xs text-gray-600">Service mobile money utilisé</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Montant : 15 ZMW</p>
                  <p className="text-xs text-gray-600">Montant transféré avec succès</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Informations de Transaction
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">ID de Dépôt</span>
                <span className="text-sm text-gray-900 font-mono">f4401bd2-1568-4140-bf2d-eb77d2b2b639</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">ID Transaction</span>
                <span className="text-sm text-gray-900 font-mono">ABC123</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Numéro</span>
                <span className="text-sm text-gray-900">260763456789</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Date</span>
                <span className="text-sm text-gray-900">21 février 2020, 17:32</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Commande</span>
                <span className="text-sm text-gray-900 font-mono">ORD-123456789</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 p-6 bg-green-50 rounded-lg">
          <h3 className="text-lg font-semibold text-green-900 mb-3">
            Points Importants
          </h3>
          <div className="space-y-2 text-sm text-green-800">
            <p>• Le statut <strong>COMPLETED</strong> indique que le paiement a été complété avec succès</p>
            <p>• La présence de <strong>failureReason</strong> indique qu'un problème initial a été résolu</p>
            <p>• Le <strong>providerTransactionId</strong> confirme la transaction côté provider</p>
            <p>• Les <strong>métadonnées</strong> permettent de tracer la transaction</p>
            <p>• Le client peut maintenant télécharger un reçu et partager la confirmation</p>
          </div>
        </div>

        <div className="mt-8 p-6 bg-blue-50 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">
            Cas d'Usage
          </h3>
          <div className="space-y-2 text-sm text-blue-800">
            <p>• <strong>Paiement avec problème résolu</strong> : Le client a rechargé son compte</p>
            <p>• <strong>Retry automatique</strong> : Le système a réessayé après l'erreur initiale</p>
            <p>• <strong>Confirmation de succès</strong> : Même avec des erreurs précédentes, le paiement est final</p>
            <p>• <strong>Traçabilité complète</strong> : Toutes les étapes sont documentées</p>
            <p>• <strong>Actions post-paiement</strong> : Téléchargement de reçu, partage de confirmation</p>
          </div>
        </div>
      </div>
    </div>
  )
} 