"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useAuthStore } from "@/stores/authStore"
import apiService from "@/lib/api"

export const AuthTestComponent = () => {
  const { isAuthenticated, user, token } = useAuthStore()
  const [testResults, setTestResults] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  const testAuth = async () => {
    setIsLoading(true)
    setTestResults(null)
    
    try {
      console.log('🧪 Test d\'authentification en cours...')
      
      // Test 1: Vérifier l'état du store Zustand
      const zustandState = {
        isAuthenticated,
        hasUser: !!user,
        hasToken: !!token,
        userInfo: user ? { id: user.id, name: user.name, email: user.email } : null
      }
      
      // Test 2: Vérifier localStorage
      const localStorageState = {
        sanctumToken: localStorage.getItem('sanctum_token'),
        authStorage: localStorage.getItem('auth-storage')
      }
      
      // Test 3: Tester l'API avec le token actuel
      let apiTest = null
      try {
        const response = await apiService.getStores()
        apiTest = {
          success: response.success,
          status: 'success',
          data: response.data,
          message: response.message
        }
      } catch (error: any) {
        apiTest = {
          success: false,
          status: 'error',
          error: error.message,
          details: error
        }
      }
      
      // Test 4: Tester l'API sans token (pour comparaison)
      let publicApiTest = null
      try {
        const response = await apiService.getPublicStores()
        publicApiTest = {
          success: response.success,
          status: 'success',
          data: response.data,
          message: response.message
        }
      } catch (error: any) {
        publicApiTest = {
          success: false,
          status: 'error',
          error: error.message,
          details: error
        }
      }
      
      setTestResults({
        zustandState,
        localStorageState,
        apiTest,
        publicApiTest,
        timestamp: new Date().toISOString()
      })
      
      console.log('✅ Test d\'authentification terminé:', {
        zustandState,
        localStorageState,
        apiTest,
        publicApiTest
      })
      
    } catch (error) {
      console.error('❌ Erreur lors du test:', error)
      setTestResults({
        error: error.message,
        timestamp: new Date().toISOString()
      })
    } finally {
      setIsLoading(false)
    }
  }

  const clearAll = () => {
    localStorage.clear()
    sessionStorage.clear()
    window.location.reload()
  }

  const forceLogin = () => {
    // Simuler un login
    useAuthStore.getState().login({
      id: 1,
      name: 'Test User',
      email: 'test@example.com',
      role: 'user',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }, 'test_token_123')
    
    // Mettre le token dans localStorage
    localStorage.setItem('sanctum_token', 'test_token_123')
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-w-md z-50">
      <h3 className="font-semibold text-sm mb-3">🧪 Test d'Authentification</h3>
      
      <div className="space-y-2 mb-3">
        <div className="text-xs">
          <span className="font-medium">État Zustand:</span> 
          <span className={`ml-2 px-2 py-1 rounded text-xs ${isAuthenticated ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {isAuthenticated ? 'Connecté' : 'Non connecté'}
          </span>
        </div>
        
        <div className="text-xs space-y-1">
          <div>👤 User: {user ? 'OUI' : 'NON'}</div>
          <div>🔑 Token: {token ? 'OUI' : 'NON'}</div>
        </div>
      </div>

      <div className="space-y-2">
        <Button onClick={testAuth} size="sm" className="w-full text-xs" disabled={isLoading}>
          {isLoading ? '⏳ Test...' : '🧪 Tester Auth'}
        </Button>
        <Button onClick={forceLogin} size="sm" variant="outline" className="w-full text-xs">
          🔑 Force Login
        </Button>
        <Button onClick={clearAll} size="sm" variant="destructive" className="w-full text-xs">
          🧹 Nettoyer
        </Button>
      </div>

      {testResults && (
        <div className="mt-4 p-3 bg-gray-50 rounded text-xs">
          <div className="font-medium mb-2">📊 Résultats du Test:</div>
          
          <div className="space-y-2">
            <div>
              <span className="font-medium">Zustand:</span>
              <pre className="text-xs bg-white p-1 rounded mt-1">
                {JSON.stringify(testResults.zustandState, null, 2)}
              </pre>
            </div>
            
            <div>
              <span className="font-medium">LocalStorage:</span>
              <pre className="text-xs bg-white p-1 rounded mt-1">
                {JSON.stringify(testResults.localStorageState, null, 2)}
              </pre>
            </div>
            
            <div>
              <span className="font-medium">API Test (avec token):</span>
              <pre className="text-xs bg-white p-1 rounded mt-1">
                {JSON.stringify(testResults.apiTest, null, 2)}
              </pre>
            </div>
            
            <div>
              <span className="font-medium">API Test (sans token):</span>
              <pre className="text-xs bg-white p-1 rounded mt-1">
                {JSON.stringify(testResults.publicApiTest, null, 2)}
              </pre>
            </div>
          </div>
          
          <div className="text-xs text-gray-500 mt-2">
            Testé à: {new Date(testResults.timestamp).toLocaleTimeString()}
          </div>
        </div>
      )}
    </div>
  )
}
