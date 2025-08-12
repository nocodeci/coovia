import { useStore } from "@/context/store-context"
import { useSanctumAuth } from "@/hooks/useSanctumAuth"

export function DebugStoreInfo() {
  const { stores, isLoading, error, hasLoaded } = useStore()
  const { user, isLoading: authLoading } = useSanctumAuth()

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-4 rounded-lg text-xs max-w-sm z-50">
      <h3 className="font-bold mb-2">Debug Store Info</h3>
      <div className="space-y-1">
        <div>User: {user ? '✅' : '❌'}</div>
        <div>Auth Loading: {authLoading ? '🔄' : '✅'}</div>
        <div>Store Loading: {isLoading ? '🔄' : '✅'}</div>
        <div>Has Loaded: {hasLoaded ? '✅' : '❌'}</div>
        <div>Stores Count: {stores.length}</div>
        <div>Error: {error || 'None'}</div>
        <div>Token: {localStorage.getItem('auth_token') ? '✅' : '❌'}</div>
      </div>
    </div>
  )
} 