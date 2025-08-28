"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useAuthStore } from "@/stores/authStore"
import { debugAuth } from "@/utils/debug-auth"

export const RealTimeAuthDebug = () => {
  const { isAuthenticated, user, token } = useAuthStore()
  const [debugInfo, setDebugInfo] = useState<any>(null)
  const [localStorageInfo, setLocalStorageInfo] = useState<any>(null)

  const runDebug = () => {
    console.log('🔍 Lancement du debug en temps réel...')
    const info = debugAuth()
    setDebugInfo(info)
    
    // Vérifier localStorage
    const token = localStorage.getItem('sanctum_token')
    const authStorage = localStorage.getItem('auth-storage')
    
    setLocalStorageInfo({
      sanctum_token: token ? `${token.substring(0, 20)}...` : 'AUCUN',
      auth_storage: authStorage ? 'PRÉSENT' : 'ABSENT',
      auth_storage_content: authStorage ? JSON.parse(authStorage) : null
    })
  }

  const clearAll = () => {
    console.log('🧹 Nettoyage complet...')
    localStorage.clear()
    sessionStorage.clear()
    window.location.reload()
  }

  const forceLogin = () => {
    console.log('🔑 Force login...')
    // Simuler un login
    useAuthStore.getState().login({
      id: 1,
      name: 'Test User',
      email: 'test@example.com',
      role: 'user',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }, 'test_token_123')
  }

  useEffect(() => {
    // Debug automatique au montage et à chaque changement
    runDebug()
    
    // Écouter les changements du store
    const unsubscribe = useAuthStore.subscribe((state) => {
      console.log('🔄 Store Zustand mis à jour:', state)
      runDebug()
    })
    
    return unsubscribe
  }, [])

  return (
    <div className="fixed bottom-4 left-4 bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-w-md z-50">
      <h3 className="font-semibold text-sm mb-3">🔍 Debug Auth Temps Réel</h3>
      
      <div className="space-y-2 mb-3">
        <div className="text-xs">
          <span className="font-medium">Store Zustand:</span> 
          <span className={`ml-2 px-2 py-1 rounded text-xs ${isAuthenticated ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {isAuthenticated ? 'Connecté' : 'Non connecté'}
          </span>
        </div>
        
        <div className="text-xs space-y-1">
          <div>👤 User: {user ? 'OUI' : 'NON'}</div>
          <div>🔑 Token: {token ? 'OUI' : 'NON'}</div>
          <div>🔐 isAuthenticated: {isAuthenticated ? 'true' : 'false'}</div>
        </div>
        
        {debugInfo && (
          <div className="text-xs space-y-1 border-t pt-2">
            <div className="font-medium">Debug Utils:</div>
            <div>🔑 Token: {debugInfo.token ? 'OUI' : 'NON'}</div>
            <div>👤 User: {debugInfo.user ? 'OUI' : 'NON'}</div>
            <div>🏪 Stores: {debugInfo.stores ? 'OUI' : 'NON'}</div>
          </div>
        )}
        
        {localStorageInfo && (
          <div className="text-xs space-y-1 border-t pt-2">
            <div className="font-medium">LocalStorage:</div>
            <div>🔑 sanctum_token: {localStorageInfo.sanctum_token}</div>
            <div>📦 auth-storage: {localStorageInfo.auth_storage}</div>
            {localStorageInfo.auth_storage_content && (
              <div className="text-xs bg-gray-100 p-1 rounded">
                {JSON.stringify(localStorageInfo.auth_storage_content, null, 2)}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Button onClick={runDebug} size="sm" className="w-full text-xs">
          🔍 Debug
        </Button>
        <Button onClick={forceLogin} size="sm" variant="outline" className="w-full text-xs">
          🔑 Force Login
        </Button>
        <Button onClick={clearAll} size="sm" variant="destructive" className="w-full text-xs">
          🧹 Nettoyer
        </Button>
      </div>
    </div>
  )
}
