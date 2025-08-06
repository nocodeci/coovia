import React, { useState, useEffect } from 'react'


interface PawapayConfiguration {
  countries?: any[]
  providers?: any[]
  currencies?: any[]
  languages?: any[]
  retrieved_at?: string
  environment?: string
}

export default function PawapayConfigurationViewer() {
  const [configuration, setConfiguration] = useState<PawapayConfiguration | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)


  const fetchConfiguration = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/pawapay/active-configuration', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      })

      const data = await response.json()

      if (data.success) {
        setConfiguration(data.data)
        alert('Succès: Configuration active récupérée avec succès')
      } else {
        setError(data.message || "Erreur lors de la récupération de la configuration")
        alert('Erreur: ' + (data.message || "Erreur lors de la récupération de la configuration"))
      }
    } catch (error) {
      console.error('Erreur lors de la récupération de la configuration:', error)
      setError("Erreur de communication avec le serveur")
      alert('Erreur: Erreur de communication avec le serveur')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchConfiguration()
  }, [])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center space-x-2">
            <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="text-lg font-medium text-gray-700">Chargement de la configuration...</span>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center">
            <svg className="w-6 h-6 text-red-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
            </svg>
            <div>
              <h3 className="text-lg font-medium text-red-900">Erreur</h3>
              <p className="text-red-700 mt-1">{error}</p>
            </div>
          </div>
          <button
            onClick={fetchConfiguration}
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Réessayer
          </button>
        </div>
      </div>
    )
  }

  if (!configuration) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-12">
          <p className="text-gray-500">Aucune configuration disponible</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Configuration Active Pawapay
        </h1>
        <p className="text-gray-600">
          Informations sur les pays, providers, devises et langues supportés
        </p>
        
        {/* Informations générales */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span className="text-sm font-medium text-blue-900">Environnement</span>
            </div>
            <p className="text-lg font-semibold text-blue-800 mt-1">
              {configuration.environment === 'sandbox' ? 'Sandbox' : 'Production'}
            </p>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span className="text-sm font-medium text-green-900">Pays Supportés</span>
            </div>
            <p className="text-lg font-semibold text-green-800 mt-1">
              {configuration.countries?.length || 0}
            </p>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-purple-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span className="text-sm font-medium text-purple-900">Providers</span>
            </div>
            <p className="text-lg font-semibold text-purple-800 mt-1">
              {configuration.providers?.length || 0}
            </p>
          </div>
        </div>

        {configuration.retrieved_at && (
          <div className="mt-4 text-sm text-gray-500">
            Dernière mise à jour : {formatDate(configuration.retrieved_at)}
          </div>
        )}
      </div>

      {/* Pays supportés */}
      {configuration.countries && configuration.countries.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Pays Supportés</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {configuration.countries.map((country: any, index: number) => (
              <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">{country.name || country.code}</h3>
                    <p className="text-sm text-gray-500">{country.code}</p>
                  </div>
                  {country.flag && (
                    <img 
                      src={country.flag} 
                      alt={`Drapeau ${country.name}`}
                      className="w-6 h-6 rounded"
                    />
                  )}
                </div>
                {country.currency && (
                  <p className="text-sm text-gray-600 mt-1">
                    Devise : {country.currency}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Providers */}
      {configuration.providers && configuration.providers.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Providers Mobile Money</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {configuration.providers.map((provider: any, index: number) => (
              <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">{provider.name}</h3>
                    <p className="text-sm text-gray-500">{provider.code}</p>
                  </div>
                  {provider.logo && (
                    <img 
                      src={provider.logo} 
                      alt={`Logo ${provider.name}`}
                      className="w-8 h-8 rounded"
                    />
                  )}
                </div>
                {provider.country && (
                  <p className="text-sm text-gray-600 mt-1">
                    Pays : {provider.country}
                  </p>
                )}
                {provider.status && (
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-2 ${
                    provider.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {provider.status === 'active' ? 'Actif' : 'Inactif'}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Devises */}
      {configuration.currencies && configuration.currencies.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Devises Supportées</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {configuration.currencies.map((currency: any, index: number) => (
              <div key={index} className="bg-white border border-gray-200 rounded-lg p-3 text-center">
                <div className="font-medium text-gray-900">{currency.code}</div>
                <div className="text-sm text-gray-500">{currency.name}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Langues */}
      {configuration.languages && configuration.languages.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Langues Supportées</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {configuration.languages.map((language: any, index: number) => (
              <div key={index} className="bg-white border border-gray-200 rounded-lg p-3 text-center">
                <div className="font-medium text-gray-900">{language.code}</div>
                <div className="text-sm text-gray-500">{language.name}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Configuration complète */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Configuration Complète</h2>
        <div className="bg-gray-50 rounded-lg p-4">
          <pre className="text-sm text-gray-800 overflow-auto max-h-96">
            {JSON.stringify(configuration, null, 2)}
          </pre>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-8 flex space-x-4">
        <button
          onClick={fetchConfiguration}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Actualiser la Configuration
        </button>
        <button
          onClick={() => {
            if (configuration) {
              navigator.clipboard.writeText(JSON.stringify(configuration, null, 2))
              alert('Copié: Configuration copiée dans le presse-papiers')
            }
          }}
          className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        >
          Copier la Configuration
        </button>
      </div>
    </div>
  )
} 