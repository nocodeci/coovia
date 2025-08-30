<?php

require_once __DIR__ . '/vendor/autoload.php';

use Laravel\Forge\Forge;

echo "🔑 TEST DE CONNEXION FORGE\n";
echo "==========================\n\n";

// Charger la configuration
$config = require __DIR__ . '/forge-config.php';

echo "✅ Configuration chargée:\n";
echo "   - Token: " . substr($config['token'], 0, 20) . "...\n";
echo "   - Server ID: {$config['server_id']}\n";
echo "   - Site: {$config['site_name']}\n";
echo "   - PHP: {$config['php_version']}\n\n";

// Test de connexion
try {
    echo "🔑 Test de connexion à Forge...\n";
    $forge = new Forge($config['token']);
    
    echo "✅ Connexion réussie !\n\n";
    
    // Lister les serveurs disponibles
    echo "🔍 Récupération de vos serveurs...\n";
    $servers = $forge->servers();
    
    if (empty($servers)) {
        echo "❌ Aucun serveur trouvé\n";
    } else {
        echo "✅ Serveurs trouvés:\n";
        foreach ($servers as $server) {
            echo "   - ID: {$server->id} | Nom: {$server->name} | Région: {$server->region}\n";
        }
        echo "\n";
        
        // Si un seul serveur, l'utiliser automatiquement
        if (count($servers) === 1) {
            $server = $servers[0];
            echo "🎯 Serveur unique détecté, mise à jour automatique de la configuration...\n";
            
            // Mettre à jour le fichier de configuration
            $configContent = file_get_contents(__DIR__ . '/forge-config.php');
            $configContent = str_replace(
                "'server_id' => 'VOTRE_SERVER_ID',",
                "'server_id' => '{$server->id}',",
                $configContent
            );
            file_put_contents(__DIR__ . '/forge-config.php', $configContent);
            
            echo "✅ Configuration mise à jour avec server_id: {$server->id}\n";
        }
    }
    
} catch (Exception $e) {
    echo "❌ Erreur de connexion: " . $e->getMessage() . "\n";
    echo "📋 Type d'erreur: " . get_class($e) . "\n";
}
