// Script de test pour vérifier la configuration Auth0
// Exécutez ce script dans la console du navigateur sur votre application

console.log('=== Test de configuration Auth0 ===');

// Vérifier que la configuration est chargée
try {
  // Importer la configuration (cela peut ne pas fonctionner dans la console)
  console.log('Configuration de l\'application chargée');
  
  // Vérifier les variables d'environnement
  console.log('Variables d\'environnement:');
  console.log('- VITE_AUTH0_DOMAIN:', import.meta.env?.VITE_AUTH0_DOMAIN || 'Non définie');
  console.log('- VITE_AUTH0_CLIENT_ID:', import.meta.env?.VITE_AUTH0_CLIENT_ID || 'Non définie');
  console.log('- VITE_AUTH0_AUDIENCE:', import.meta.env?.VITE_AUTH0_AUDIENCE || 'Non définie');
  
  // Vérifier la configuration Auth0
  if (window.Auth0Provider) {
    console.log('✅ Auth0Provider est disponible');
  } else {
    console.log('❌ Auth0Provider n\'est pas disponible');
  }
  
  // Vérifier le contexte d'authentification
  if (window.useAuth) {
    console.log('✅ Hook useAuth est disponible');
  } else {
    console.log('❌ Hook useAuth n\'est pas disponible');
  }
  
} catch (error) {
  console.error('Erreur lors de la vérification de la configuration:', error);
}

// Vérifier la configuration Auth0 dans le dashboard
console.log('\n=== Configuration Auth0 Dashboard ===');
console.log('Vérifiez dans votre dashboard Auth0:');
console.log('1. Application Type: Single Page Application (SPA)');
console.log('2. Allowed Callback URLs: http://localhost:3000, http://localhost:3000/callback');
console.log('3. Allowed Logout URLs: http://localhost:3000');
console.log('4. Allowed Web Origins: http://localhost:3000');
console.log('5. API Audience: https://api.coovia.com');
console.log('6. Scopes: openid profile email read:stores write:stores read:products write:products');

console.log('\n=== Test terminé ===');
