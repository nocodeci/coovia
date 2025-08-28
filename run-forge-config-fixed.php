<?php

require_once __DIR__ . '/vendor/autoload.php';

use Laravel\Forge\Forge;

// =========================================
// CHARGEMENT DE LA CONFIGURATION
// =========================================
echo "🔧 CHARGEMENT DE LA CONFIGURATION FORGE\n";
echo "======================================\n\n";

$configFile = __DIR__ . '/forge-config.php';

if (!file_exists($configFile)) {
    echo "❌ ERREUR: Fichier forge-config.php non trouvé !\n";
    echo "📋 Créez d'abord ce fichier avec vos informations Forge\n";
    exit(1);
}

$config = require $configFile;

// Vérification des valeurs requises
$requiredKeys = ['token', 'server_id', 'site_name', 'php_version'];
foreach ($requiredKeys as $key) {
    if (!isset($config[$key]) || $config[$key] === 'VOTRE_TOKEN_FORGE_ICI' || $config[$key] === 'VOTRE_SERVER_ID') {
        echo "❌ ERREUR: Configuration manquante pour '{$key}'\n";
        echo "📋 Modifiez le fichier forge-config.php avec vos vraies informations\n";
        exit(1);
    }
}

echo "✅ Configuration chargée:\n";
echo "   - Token: " . substr($config['token'], 0, 10) . "...\n";
echo "   - Server ID: {$config['server_id']}\n";
echo "   - Site: {$config['site_name']}\n";
echo "   - PHP: {$config['php_version']}\n\n";

// =========================================
// CONFIGURATION NGINX AVEC CORS
// =========================================
$newNginxConfig = <<<'NGINX'
# FORGE CONFIG (DO NOT REMOVE!)
include forge-conf/{{ SITE }}/before/*;

server {
    listen {{ PORT }};
    listen {{ PORT_V6 }};
    server_name {{ DOMAINS }};
    server_tokens off;
    root {{ PATH }};

    # FORGE SSL (DO NOT REMOVE!)
    # ssl_certificate;
    # ssl_certificate_key;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_dhparam /etc/nginx/dhparams.pem;

    # =========================================
    # HEADERS CORS FORCÉS POUR TOUTES LES ROUTES
    # =========================================
    add_header 'Access-Control-Allow-Origin' 'https://app.wozif.store' always;
    add_header 'Access-Control-Allow-Credentials' 'true' always;
    add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS, PATCH' always;
    add_header 'Access-Control-Allow-Headers' 'Origin, Content-Type, Accept, Authorization, X-Requested-With, X-CSRF-TOKEN, X-API-Key' always;
    add_header 'Vary' 'Origin' always;

    # =========================================
    # GESTION OPTIONS (PRÉFLIGHT CORS)
    # =========================================
    if ($request_method = OPTIONS) {
        add_header 'Access-Control-Allow-Origin' 'https://app.wozif.store' always;
        add_header 'Access-Control-Allow-Credentials' 'true' always;
        add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS, PATCH' always;
        add_header 'Access-Control-Allow-Headers' 'Origin, Content-Type, Accept, Authorization, X-Requested-With, X-CSRF-TOKEN, X-API-Key' always;
        add_header 'Access-Control-Max-Age' '86400' always;
        return 204;
    }

    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-XSS-Protection "1; mode=block";
    add_header X-Content-Type-Options "nosniff";

    index index.html index.htm index.php;

    charset utf-8;

    # FORGE CONFIG (DO NOT REMOVE!)
    include forge-conf/{{ SITE }}/server/*;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    access_log off;
    error_log  /var/log/nginx/{{ SITE }}-error.log error;

    error_page 404 /index.php;

    # =========================================
    # CONFIGURATION PHP-FPM AVEC TIMEOUTS ET CORS
    # =========================================
    location ~ \.php$ {
        fastcgi_split_path_info ^(.+\.php)(/.+)$;
        fastcgi_pass {{ PROXY_PASS }};
        fastcgi_index index.php;
        include fastcgi_params;
        
        # =========================================
        # TIMEOUTS CRITIQUES POUR ÉVITER LES CRASHES
        # =========================================
        fastcgi_read_timeout 300;
        fastcgi_connect_timeout 300;
        fastcgi_send_timeout 300;
        
        # =========================================
        # BUFFERS POUR ÉVITER LES TIMEOUTS
        # =========================================
        fastcgi_buffer_size 128k;
        fastcgi_buffers 4 256k;
        fastcgi_busy_buffers_size 256k;
        fastcgi_temp_file_write_size 256k;
        
        # =========================================
        # HEADERS CORS FORCÉS MÊME EN CAS D'ERREUR
        # =========================================
        add_header 'Access-Control-Allow-Origin' 'https://app.wozif.store' always;
        add_header 'Access-Control-Allow-Credentials' 'true' always;
        add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS, PATCH' always;
        add_header 'Access-Control-Allow-Headers' 'Origin, Content-Type, Accept, Authorization, X-Requested-With, X-CSRF-TOKEN, X-API-Key' always;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}

# FORGE CONFIG (DO NOT REMOVE!)
include forge-conf/{{ SITE }}/after/*;
NGINX;

// =========================================
// SCRIPT PRINCIPAL
// =========================================
echo "🚀 CONFIGURATION AUTOMATIQUE FORGE - CORS + PHP-FPM\n";
echo "==================================================\n\n";

try {
    echo "🔑 Connexion à Forge...\n";
    
    // Créer l'instance Forge
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
    
    // =========================================
    // ÉTAPE 1: Configuration PHP-FPM (via SSH)
    // =========================================
    echo "🔧 ÉTAPE 1: Configuration PHP-FPM...\n";
    echo "   - Note: PHP-FPM sera configuré manuellement via le dashboard Forge\n";
    echo "   - Les timeouts doivent être augmentés à 300 secondes\n";
    echo "   - Voir FORGE_SETUP_README.md pour les détails\n\n";
    
    // =========================================
    // ÉTAPE 2: CONFIGURATION NGINX
    // =========================================
    echo "🔧 ÉTAPE 2: Configuration Nginx...\n";
    echo "   - Headers CORS forcés\n";
    echo "   - Gestion OPTIONS (préflight)\n";
    echo "   - Timeouts PHP-FPM synchronisés\n";
    
    $forge->updateSiteNginxFile($config['server_id'], $site->id, $newNginxConfig);
    echo "✅ Configuration Nginx mise à jour\n\n";
    
    // Redémarrer Nginx
    echo "🔄 Redémarrage de Nginx...\n";
    $forge->restartNginx($config['server_id']);
    echo "✅ Nginx redémarré\n\n";
    
    // =========================================
    // RÉSULTAT FINAL
    // =========================================
    echo "🎉 CONFIGURATION Nginx TERMINÉE AVEC SUCCÈS !\n";
    echo "==============================================\n";
    echo "✅ Nginx: Headers CORS forcés\n";
    echo "✅ CORS: Fonctionne sur toutes les routes\n";
    echo "✅ Frontend: Peut maintenant communiquer\n\n";
    
    echo "⚠️  CONFIGURATION PHP-FPM MANUELLE REQUISE:\n";
    echo "1. Allez sur votre dashboard Forge\n";
    echo "2. Sélectionnez votre serveur\n";
    echo "3. Cliquez sur 'PHP'\n";
    echo "4. Modifiez PHP 8.3 et augmentez les timeouts à 300s\n";
    echo "5. Redémarrez PHP-FPM\n\n";
    
    echo "🌐 Testez immédiatement sur: https://app.wozif.store/sign-in\n";
    echo "🔍 Plus d'erreur CORS dans la console du navigateur\n";
    
} catch (Exception $e) {
    echo "❌ ERREUR: " . $e->getMessage() . "\n";
    echo "📋 Trace: " . $e->getTraceAsString() . "\n";
}
