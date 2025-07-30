// Script de console pour corriger le token manuellement
export function fixTokenFromConsole() {
  const validToken = "8|HlK1BE5SOSSHJKdssfkJdhqubqE5XNrsTAxkNOkba69b8f29"
  
  console.log('🔧 Correction manuelle du token...')
  console.log('Token actuel:', localStorage.getItem('auth_token'))
  
  localStorage.setItem('auth_token', validToken)
  
  console.log('✅ Token mis à jour:', validToken)
  console.log('🔄 Rechargement de la page...')
  
  window.location.reload()
}

// Exposer la fonction globalement pour l'utiliser depuis la console
if (typeof window !== 'undefined') {
  // @ts-ignore
  window.fixToken = fixTokenFromConsole
  console.log('💡 Tapez "fixToken()" dans la console pour corriger le token')
} 