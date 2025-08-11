const fetch = require('node-fetch');

async function testAPI() {
    console.log('🧪 Test de connectivité API...\n');
    
    try {
        // Test de la route validate-email
        console.log('📧 Test de validate-email...');
        const response = await fetch('http://127.0.0.1:8000/api/auth/validate-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: 'test@example.com' })
        });
        
        const data = await response.json();
        console.log(`✅ Status: ${response.status}`);
        console.log(`✅ Réponse: ${JSON.stringify(data, null, 2)}\n`);
        
        // Test de la route validate-password
        console.log('🔐 Test de validate-password...');
        const response2 = await fetch('http://127.0.0.1:8000/api/auth/validate-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                email: 'test@example.com',
                password: 'password123'
            })
        });
        
        const data2 = await response2.json();
        console.log(`✅ Status: ${response2.status}`);
        console.log(`✅ Réponse: ${JSON.stringify(data2, null, 2)}\n`);
        
        console.log('🎉 Tous les tests sont passés avec succès !');
        
    } catch (error) {
        console.error('❌ Erreur lors du test:', error.message);
    }
}

testAPI();
