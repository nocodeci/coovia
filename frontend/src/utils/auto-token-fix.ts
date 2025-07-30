// Script automatique pour corriger le token invalide
export function autoFixToken() {
  // Vérifier si on est dans le navigateur
  if (typeof window === 'undefined') return

  // Token valide pour Yvan
  const validToken = "8|HlK1BE5SOSSHJKdssfkJdhqubqE5XNrsTAxkNOkba69b8f29"
  
  // Token actuel
  const currentToken = localStorage.getItem('auth_token')
  
  // Si le token actuel est l'ancien token invalide, le remplacer
  if (currentToken === "6|yPCjSmhuLmJ9I7UT5yHqzdbvEChLPoAbgiiyyX3cc3e89da3") {
    console.log('🔧 Correction automatique du token invalide...')
    localStorage.setItem('auth_token', validToken)
    
    // Recharger la page après un court délai
    setTimeout(() => {
      window.location.reload()
    }, 1000)
    
    return true
  }
  
  return false
}

// Exécuter automatiquement au chargement
if (typeof window !== 'undefined') {
  // Attendre que le DOM soit chargé
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', autoFixToken)
  } else {
    autoFixToken()
  }
} 