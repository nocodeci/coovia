import React, { useState } from 'react'


export default function PawapayCallbackTester() {
  const [depositId, setDepositId] = useState('')
  const [loading, setLoading] = useState(false)


  const handleResendCallback = async () => {
    if (!depositId.trim()) {
      alert('Erreur: Veuillez entrer un ID de dépôt')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/pawapay/resend-callback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          deposit_id: depositId.trim()
        })
      })

      const data = await response.json()

      if (data.success) {
        alert('Succès: ' + (data.message || "Callback renvoyé avec succès"))
      } else {
        alert('Erreur: ' + (data.message || "Erreur lors du renvoi de callback"))
      }
    } catch (error) {
      console.error('Erreur lors du renvoi de callback:', error)
      alert('Erreur: Erreur de communication avec le serveur')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Test de Renvoi de Callback Pawapay
      </h2>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="depositId" className="block text-sm font-medium text-gray-700 mb-2">
            ID de Dépôt
          </label>
          <input
            type="text"
            id="depositId"
            value={depositId}
            onChange={(e) => setDepositId(e.target.value)}
            placeholder="Ex: 8917c345-4791-4285-a416-62f24b6982db"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <p className="text-xs text-gray-500 mt-1">
            Entrez l'ID de dépôt pour renvoyer le callback
          </p>
        </div>

        <button
          onClick={handleResendCallback}
          disabled={loading || !depositId.trim()}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Renvoi en cours...
            </div>
          ) : (
            'Renvoyer le Callback'
          )}
        </button>

        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <h3 className="text-sm font-medium text-blue-900 mb-2">
            Informations sur le Callback
          </h3>
          <ul className="text-xs text-blue-800 space-y-1">
            <li>• Le callback sera renvoyé à l'URL configurée</li>
            <li>• Utile si le callback initial a échoué</li>
            <li>• Permet de recevoir les notifications de statut</li>
            <li>• Fonctionne pour tous les types de statut</li>
          </ul>
        </div>

        <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
          <h3 className="text-sm font-medium text-yellow-900 mb-2">
            Exemple d'ID de Dépôt
          </h3>
          <p className="text-xs text-yellow-800 font-mono">
            8917c345-4791-4285-a416-62f24b6982db
          </p>
        </div>
      </div>
    </div>
  )
} 