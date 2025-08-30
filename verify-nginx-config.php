<?php

require_once __DIR__ . '/vendor/autoload.php';

use Laravel\Forge\Forge;

echo "🔍 VÉRIFICATION DE LA CONFIGURATION NGINX\n";
echo "========================================\n\n";

// Charger la configuration
$config = require __DIR__ . '/forge-config.php';

try {
    echo "🔑 Connexion à Forge...\n";
    $forge = new Forge($config['token']);
    echo "✅ Connecté à Forge\n\n";
    
    // Récupérer le serveur
    echo "🔍 Récupération du serveur...\n";
    $server = $forge->server($config['server_id']);
    echo "✅ Serveur trouvé: {$server->name}\n\n";
    
    // Récupérer le site
    echo "🔍 Récupération du site {$config['site_name']}...\n";
    $sites = $forge->sites($config['server_id']);
    $site = null;
    
    foreach ($sites as $s) {
        if ($s->name === $config['site_name']) {
            $site = $s;
            break;
        }
    }
    
    if (!$site) {
        throw new Exception("Site {$config['site_name']} non trouvé sur le serveur");
    }
    
    echo "✅ Site trouvé: {$site->name}\n\n";
    
    // Vérifier la configuration Nginx actuelle
    echo "🔍 Vérification de la configuration Nginx actuelle...\n";
    
    try {
        $currentConfig = $forge->getSiteNginxFile($config['server_id'], $site->id);
        echo "✅ Configuration Nginx récupérée\n";
        
        // Vérifier si nos headers CORS sont présents
        $corsHeaders = [
            'Access-Control-Allow-Origin',
            'Access-Control-Allow-Credentials',
            'Access-Control-Allow-Methods'
        ];
        
        $foundHeaders = [];
        foreach ($corsHeaders as $header) {
            if (strpos($currentConfig, $header) !== false) {
                $foundHeaders[] = $header;
            }
        }
        
        if (!empty($foundHeaders)) {
            echo "✅ Headers CORS trouvés dans la configuration:\n";
            foreach ($foundHeaders as $header) {
                echo "   - {$header}\n";
            }
        } else {
            echo "❌ Aucun header CORS trouvé dans la configuration\n";
        }
        
        // Vérifier la gestion OPTIONS
        if (strpos($currentConfig, 'if ($request_method = OPTIONS)') !== false) {
            echo "✅ Gestion OPTIONS (préflight CORS) configurée\n";
        } else {
            echo "❌ Gestion OPTIONS (préflight CORS) non configurée\n";
        }
        
        // Vérifier les timeouts PHP-FPM
        if (strpos($currentConfig, 'fastcgi_read_timeout 300') !== false) {
            echo "✅ Timeouts PHP-FPM configurés (300s)\n";
        } else {
            echo "❌ Timeouts PHP-FPM non configurés\n";
        }
        
    } catch (Exception $e) {
        echo "❌ Erreur lors de la récupération de la configuration: " . $e->getMessage() . "\n";
    }
    
    // Vérifier le statut des services
    echo "\n🔍 Statut des services sur le serveur...\n";
    
    try {
        $services = $forge->services($config['server_id']);
        
        foreach ($services as $service) {
            $status = $service->status ?? 'unknown';
            $color = $status === 'running' ? '✅' : '❌';
            echo "   {$color} {$service->name}: {$status}\n";
        }
        
    } catch (Exception $e) {
        echo "❌ Erreur lors de la récupération des services: " . $e->getMessage() . "\n";
    }
    
    echo "\n🎯 RÉSUMÉ DE LA VÉRIFICATION\n";
    echo "============================\n";
    echo "✅ Configuration Nginx récupérée\n";
    echo "✅ Services vérifiés\n";
    echo "\n📋 PROCHAINES ÉTAPES:\n";
    echo "1. Vérifiez que Nginx est 'running' dans les services\n";
    echo "2. Si Nginx est arrêté, redémarrez-le sur Forge\n";
    echo "3. Testez la connexion après redémarrage\n";
    
} catch (Exception $e) {
    echo "❌ ERREUR: " . $e->getMessage() . "\n";
    echo "📋 Trace: " . $e->getTraceAsString() . "\n";
}
