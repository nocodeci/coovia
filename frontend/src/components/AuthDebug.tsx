"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { debugAuth, forceRedirectToLogin, testIsAuthenticated } from "@/utils/debug-auth"

export const AuthDebug = () => {
  const [debugInfo, setDebugInfo] = useState<any>(null)
  const [isAuth, setIsAuth] = useState<boolean>(false)

  const runDebug = () => {
    console.log('🔍 Lancement du debug...')
    const info = debugAuth()
    setDebugInfo(info)
    setIsAuth(info.isAuthenticated)
  }

  const testAuth = () => {
    console.log('🧪 Test de l\'authentification...')
    const result = testIsAuthenticated()
    setIsAuth(result)
  }

  const forceRedirect = () => {
    console.log('🔄 Force redirection...')
    forceRedirectToLogin()
  }

  const clearAll = () => {
    console.log('🧹 Nettoyage complet...')
    localStorage.clear()
    sessionStorage.clear()
    window.location.reload()
  }

  useEffect(() => {
    // Debug automatique au montage
    runDebug()
  }, [])

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-w-sm z-50">
      <h3 className="font-semibold text-sm mb-3">🔍 Debug Auth</h3>
      
      <div className="space-y-2 mb-3">
        <div className="text-xs">
          <span className="font-medium">Status:</span> 
          <span className={`ml-2 px-2 py-1 rounded text-xs ${isAuth ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {isAuth ? 'Connecté' : 'Non connecté'}
          </span>
        </div>
        
        {debugInfo && (
          <div className="text-xs space-y-1">
            <div>🔑 Token: {debugInfo.token ? 'OUI' : 'NON'}</div>
            <div>👤 User: {debugInfo.user ? 'OUI' : 'NON'}</div>
            <div>🏪 Stores: {debugInfo.stores ? 'OUI' : 'NON'}</div>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Button onClick={runDebug} size="sm" className="w-full text-xs">
          🔍 Debug
        </Button>
        <Button onClick={testAuth} size="sm" className="w-full text-xs">
          🧪 Test Auth
        </Button>
        <Button onClick={forceRedirect} size="sm" variant="outline" className="w-full text-xs">
          🔄 Rediriger
        </Button>
        <Button onClick={clearAll} size="sm" variant="destructive" className="w-full text-xs">
          🧹 Nettoyer
        </Button>
      </div>
    </div>
  )
}
