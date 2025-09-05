// Script de test pour vérifier les redirections d'authentification
// À exécuter dans la console du navigateur

console.log('🧪 Test de Protection d\'Authentification');

// Fonction pour tester une route
async function testRoute(route) {
  console.log(`\n🔍 Test de la route: ${route}`);
  
  try {
    // Sauvegarder l'URL actuelle
    const currentUrl = window.location.href;
    
    // Essayer d'accéder à la route
    window.location.href = route;
    
    // Attendre un peu pour voir la redirection
    setTimeout(() => {
      const newUrl = window.location.href;
      if (newUrl.includes('/sign-in')) {
        console.log(`✅ SUCCESS: ${route} → Redirection vers /sign-in`);
      } else if (newUrl === currentUrl) {
        console.log(`⚠️  WARNING: ${route} → Pas de redirection (déjà connecté?)`);
      } else {
        console.log(`❌ ERROR: ${route} → Redirection inattendue vers ${newUrl}`);
      }
    }, 1000);
    
  } catch (error) {
    console.log(`❌ ERROR: ${route} → ${error.message}`);
  }
}

// Routes à tester
const protectedRoutes = [
  '/create-store',
  '/store-selection', 
  '/dashboard',
  '/test-store/dashboard'
];

// Instructions pour l'utilisateur
console.log('\n📋 Instructions:');
console.log('1. Ouvrez une fenêtre de navigation privée');
console.log('2. Allez sur http://localhost:5174');
console.log('3. Exécutez ce script dans la console');
console.log('4. Vérifiez que toutes les routes redirigent vers /sign-in');

// Fonction pour exécuter tous les tests
function runAllTests() {
  console.log('\n🚀 Démarrage des tests...');
  protectedRoutes.forEach((route, index) => {
    setTimeout(() => {
      testRoute(route);
    }, index * 1500); // Espacer les tests
  });
}

// Exporter les fonctions pour utilisation manuelle
window.testAuthProtection = {
  testRoute,
  runAllTests,
  protectedRoutes
};

console.log('\n💡 Utilisation:');
console.log('- testAuthProtection.testRoute("/create-store")');
console.log('- testAuthProtection.runAllTests()');
