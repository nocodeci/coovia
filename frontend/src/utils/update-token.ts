// Utility to update the authentication token
export function updateAuthToken(newToken: string) {
  localStorage.setItem('auth_token', newToken)
  console.log('🔑 Token mis à jour:', newToken)
}

// Get current token
export function getCurrentToken(): string | null {
  return localStorage.getItem('auth_token')
}

// Clear token
export function clearAuthToken() {
  localStorage.removeItem('auth_token')
  console.log('🗑️ Token supprimé')
} 