"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { updateAuthToken, getCurrentToken, clearAuthToken } from "@/utils/update-token"
import { forceTokenUpdate } from "@/utils/force-token-update"

export function DebugTokenUpdater() {
  const [newToken, setNewToken] = useState("")
  const [currentToken, setCurrentToken] = useState(getCurrentToken() || "")

  const handleUpdateToken = () => {
    if (newToken.trim()) {
      updateAuthToken(newToken.trim())
      setCurrentToken(newToken.trim())
      setNewToken("")
      window.location.reload() // Reload to test the new token
    }
  }

  const handleClearToken = () => {
    clearAuthToken()
    setCurrentToken("")
    window.location.reload()
  }

  return (
    <div className="p-4 border rounded-lg bg-yellow-50">
      <h3 className="text-lg font-semibold mb-4">🔧 Debug: Mise à jour du token</h3>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="current-token">Token actuel:</Label>
          <Input
            id="current-token"
            value={currentToken}
            readOnly
            className="font-mono text-xs"
          />
        </div>

        <div>
          <Label htmlFor="new-token">Nouveau token:</Label>
          <Input
            id="new-token"
            value={newToken}
            onChange={(e) => setNewToken(e.target.value)}
            placeholder="7|b9ZfsVSIZFM0qvOMIuyFre2UJEhUsIFsclwdiV7A297251ab"
            className="font-mono text-xs"
          />
        </div>

        <div className="flex gap-2">
          <Button onClick={handleUpdateToken} disabled={!newToken.trim()}>
            Mettre à jour le token
          </Button>
          <Button onClick={handleClearToken} variant="destructive">
            Effacer le token
          </Button>
          <Button onClick={forceTokenUpdate} variant="outline" className="bg-red-50 text-red-700 border-red-200 hover:bg-red-100">
            🔥 Token d'urgence (Yvan)
          </Button>
        </div>
      </div>
    </div>
  )
} 