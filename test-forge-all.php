<?php
/**
 * Script principal de test du backend Laravel sur Forge
 * Lance tous les tests disponibles
 */

echo "🚀 TESTS COMPLETS DU BACKEND FORGE - COOVIA\n";
echo "===========================================\n\n";

echo "Ce script va lancer tous les tests disponibles pour vérifier\n";
echo "le bon fonctionnement de votre backend Laravel sur Forge.\n\n";

echo "Tests disponibles:\n";
echo "1. Test rapide (30 secondes)\n";
echo "2. Test complet (2-3 minutes)\n";
echo "3. Test d'authentification\n";
echo "4. Test des fonctionnalités\n";
echo "5. Test de la base de données\n";
echo "6. Tous les tests\n\n";

echo "Voulez-vous continuer ? (y/n): ";
$handle = fopen("php://stdin", "r");
$input = trim(fgets($handle));
fclose($handle);

if (strtolower($input) !== 'y' && strtolower($input) !== 'yes' && strtolower($input) !== 'oui') {
    echo "❌ Test annulé.\n";
    exit(0);
}

echo "\nQuel test souhaitez-vous exécuter ?\n";
echo "1. Test rapide\n";
echo "2. Test complet\n";
echo "3. Test d'authentification\n";
echo "4. Test des fonctionnalités\n";
echo "5. Test de la base de données\n";
echo "6. Tous les tests\n";
echo "7. Quitter\n\n";

echo "Votre choix (1-7): ";
$handle = fopen("php://stdin", "r");
$choice = trim(fgets($handle));
fclose($handle);

echo "\n";

switch ($choice) {
    case '1':
        echo "🧪 Lancement du test rapide...\n";
        echo "================================\n\n";
        include 'test-forge-quick.php';
        break;
        
    case '2':
        echo "🧪 Lancement du test complet...\n";
        echo "================================\n\n";
        include 'test-forge-backend.php';
        break;
        
    case '3':
        echo "🧪 Lancement du test d'authentification...\n";
        echo "==========================================\n\n";
        include 'test-forge-auth.php';
        break;
        
    case '4':
        echo "🧪 Lancement du test des fonctionnalités...\n";
        echo "===========================================\n\n";
        include 'test-forge-features.php';
        break;
        
    case '5':
        echo "🧪 Lancement du test de la base de données...\n";
        echo "=============================================\n\n";
        include 'test-forge-database.php';
        break;
        
    case '6':
        echo "🧪 Lancement de tous les tests...\n";
        echo "=================================\n\n";
        
        echo "📋 EXÉCUTION DE TOUS LES TESTS\n";
        echo "==============================\n\n";
        
        $startTime = microtime(true);
        
        // Test rapide
        echo "1️⃣ TEST RAPIDE\n";
        echo "==============\n";
        include 'test-forge-quick.php';
        echo "\n" . str_repeat("=", 50) . "\n\n";
        
        // Test d'authentification
        echo "2️⃣ TEST D'AUTHENTIFICATION\n";
        echo "==========================\n";
        include 'test-forge-auth.php';
        echo "\n" . str_repeat("=", 50) . "\n\n";
        
        // Test des fonctionnalités
        echo "3️⃣ TEST DES FONCTIONNALITÉS\n";
        echo "===========================\n";
        include 'test-forge-features.php';
        echo "\n" . str_repeat("=", 50) . "\n\n";
        
        // Test de la base de données
        echo "4️⃣ TEST DE LA BASE DE DONNÉES\n";
        echo "=============================\n";
        include 'test-forge-database.php';
        echo "\n" . str_repeat("=", 50) . "\n\n";
        
        // Test complet
        echo "5️⃣ TEST COMPLET\n";
        echo "===============\n";
        include 'test-forge-backend.php';
        
        $endTime = microtime(true);
        $totalTime = ($endTime - $startTime) / 60; // en minutes
        
        echo "\n" . str_repeat("=", 50) . "\n";
        echo "🏁 TOUS LES TESTS TERMINÉS !\n";
        echo "⏱️ Temps total d'exécution: " . round($totalTime, 2) . " minutes\n";
        echo "📅 Terminé à: " . date('Y-m-d H:i:s') . "\n";
        echo str_repeat("=", 50) . "\n";
        break;
        
    case '7':
        echo "👋 Au revoir !\n";
        exit(0);
        break;
        
    default:
        echo "❌ Choix invalide. Veuillez choisir un nombre entre 1 et 7.\n";
        exit(1);
}

echo "\n🏁 Test(s) terminé(s) !\n";
echo "Merci d'avoir testé votre backend Forge.\n";
