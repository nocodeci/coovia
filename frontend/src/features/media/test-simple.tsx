import React from 'react'

interface MediaLibraryProps {
  storeId: string
}

export default function MediaLibrary({ storeId }: MediaLibraryProps) {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Test Media</h1>
          <p className="text-gray-600">Store ID: {storeId}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Page Media de Test
          </h2>
          <p className="text-gray-600">
            Cette page fonctionne ! L'intégration Media est en cours de développement.
          </p>
        </div>
      </div>
    </div>
  )
} 