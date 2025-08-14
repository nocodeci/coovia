import { redirect } from 'next/navigation'
import { headers } from 'next/headers'

export default async function HomePage() {
  const headersList = await headers()
  const hostname = headersList.get('host') || ''
  
  // Extraire le storeId du sous-domaine
  const storeIdMatch = hostname.match(/^([^.]+)\.wozif\.store$/)
  
  if (storeIdMatch) {
    const storeId = storeIdMatch[1]
    redirect(`/${storeId}`)
  }
  
  // Si pas de sous-domaine, afficher une page par défaut
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Bienvenue sur Wozif Store
        </h1>
        <p className="text-gray-600 mb-8">
          Accédez à votre boutique via votre sous-domaine personnalisé
        </p>
        <div className="bg-white rounded-lg p-6 shadow-lg">
          <p className="text-sm text-gray-500">
            Exemple : <code className="bg-gray-100 px-2 py-1 rounded">votre-boutique.wozif.store</code>
          </p>
        </div>
      </div>
    </div>
  )
}
