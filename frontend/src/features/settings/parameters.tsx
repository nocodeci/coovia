import { useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'

export default function SettingsParameters() {
  const navigate = useNavigate()

  useEffect(() => {
    // Rediriger vers la page des paramètres généraux
    navigate({ to: '/settings/parameters' })
  }, [navigate])

  return (
    <div className="flex items-center justify-center p-8">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p>Redirection vers les paramètres...</p>
      </div>
    </div>
  )
}
