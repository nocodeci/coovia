// Script pour forcer la mise à jour du token
export function forceTokenUpdate() {
  // Token valide pour Yvan
  const newToken = "8|HlK1BE5SOSSHJKdssfkJdhqubqE5XNrsTAxkNOkba69b8f29"
  
  // Mettre à jour le token dans localStorage
  localStorage.setItem('auth_token', newToken)
  
  // Mettre à jour le token dans l'API service
  if (typeof window !== 'undefined') {
    // @ts-ignore - Accès global à l'API service
    if (window.apiService) {
      // @ts-ignore
      window.apiService.setToken(newToken)
    }
  }
  
  console.log('🔑 Token forcé mis à jour:', newToken)
  
  // Recharger la page
  window.location.reload()
}

// Fonction pour exécuter depuis la console
export function updateTokenFromConsole() {
  forceTokenUpdate()
} 