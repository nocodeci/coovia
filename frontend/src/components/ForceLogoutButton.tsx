"use client"

import { Button } from "@/components/ui/button"
import { forceLogout } from "@/utils/clear-cache"

export const ForceLogoutButton = () => {
  const handleForceLogout = () => {
    console.log('🚪 Déconnexion forcée...')
    forceLogout()
  }

  return (
    <Button
      onClick={handleForceLogout}
      variant="destructive"
      size="sm"
      className="ml-2"
    >
      🔄 Forcer Reconnexion
    </Button>
  )
}
