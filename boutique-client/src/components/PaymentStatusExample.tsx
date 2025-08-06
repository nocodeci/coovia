import React from 'react'
import PaymentStatusDisplay from './PaymentStatusDisplay'

export default function PaymentStatusExample() {
  // Exemple de données de paiement complété (basé sur votre réponse)
  const paymentData = {
    status: "COMPLETED",
    statusInfo: {
      title: "Paiement Complété",
      description: "Le paiement a été complété avec succès",
      color: "green",
      icon: "check-circle"
    },
    amount: "123.00",
    currency: "ZMW",
    transactionId: "8917c345-4791-4285-a416-62f24b6982db",
    providerTransactionId: "12356789",
    createdAt: "2020-10-19T08:17:01Z"
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Exemple d'Affichage du Statut de Paiement
      </h2>
      
      <PaymentStatusDisplay
        status={paymentData.status}
        statusInfo={paymentData.statusInfo}
        amount={paymentData.amount}
        currency={paymentData.currency}
        transactionId={paymentData.transactionId}
        providerTransactionId={paymentData.providerTransactionId}
        createdAt={paymentData.createdAt}
      />

      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">
          Données JSON Reçues
        </h3>
        <pre className="text-sm text-blue-800 overflow-auto">
          {JSON.stringify({
            "status": "FOUND",
            "data": {
              "depositId": "8917c345-4791-4285-a416-62f24b6982db",
              "status": "COMPLETED",
              "amount": "123.00",
              "currency": "ZMW",
              "country": "ZMB",
              "payer": {
                "type": "MMO",
                "accountDetails": {
                  "phoneNumber": "260763456789",
                  "provider": "MTN_MOMO_ZMB"
                }
              },
              "customerMessage": "To ACME company",
              "clientReferenceId": "REF-987654321",
              "created": "2020-10-19T08:17:01Z",
              "providerTransactionId": "12356789",
              "metadata": {
                "orderId": "ORD-123456789",
                "customerId": "customer@email.com"
              }
            }
          }, null, 2)}
        </pre>
      </div>
    </div>
  )
} 