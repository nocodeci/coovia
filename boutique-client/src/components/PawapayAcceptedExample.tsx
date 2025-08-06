import React from 'react'
import PawapayAcceptedStatus from './PawapayAcceptedStatus'

export default function PawapayAcceptedExample() {
  // Exemple de données basées sur votre réponse
  const paymentData = {
    depositId: "f4401bd2-1568-4140-bf2d-eb77d2b2b639",
    status: "ACCEPTED",
    amount: "123.00",
    currency: "ZMW",
    customerName: "John Doe",
    createdAt: new Date().toISOString()
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Exemple - Statut ACCEPTED Pawapay
          </h1>
          <p className="text-gray-600">
            Affichage du statut ACCEPTED avec toutes les informations
          </p>
        </div>

        <PawapayAcceptedStatus
          depositId={paymentData.depositId}
          amount={paymentData.amount}
          currency={paymentData.currency}
          customerName={paymentData.customerName}
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
                "status": "ACCEPTED"
              }, null, 2)}
            </pre>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Prochaines Étapes
            </h3>
            <div className="space-y-3">
              <div className="flex items-start">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Attendre la confirmation</p>
                  <p className="text-xs text-gray-600">Le provider traite le paiement</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Vérifier le statut</p>
                  <p className="text-xs text-gray-600">Utiliser l'API de vérification</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Recevoir la notification</p>
                  <p className="text-xs text-gray-600">Callback ou webhook</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Statuts Possibles
            </h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">ACCEPTED</span>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Actuel</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">PENDING</span>
                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">En attente</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">COMPLETED</span>
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Succès</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">FAILED</span>
                <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">Échec</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">REJECTED</span>
                <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">Rejeté</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 p-6 bg-blue-50 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">
            Informations Importantes
          </h3>
          <div className="space-y-2 text-sm text-blue-800">
            <p>• Le statut <strong>ACCEPTED</strong> signifie que le paiement a été accepté par Pawapay</p>
            <p>• Le paiement est maintenant en cours de traitement par le provider mobile money</p>
            <p>• Le statut final sera <strong>COMPLETED</strong>, <strong>FAILED</strong>, ou <strong>REJECTED</strong></p>
            <p>• Vous pouvez vérifier le statut en utilisant l'ID de dépôt : <code className="bg-blue-100 px-1 rounded">{paymentData.depositId}</code></p>
          </div>
        </div>
      </div>
    </div>
  )
} 