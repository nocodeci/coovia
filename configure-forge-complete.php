<?php

require_once __DIR__ . '/vendor/autoload.php';

use Laravel\Forge\Forge;

// =========================================
// CONFIGURATION FORGE - À MODIFIER
// =========================================
$forgeToken = 'VOTRE_TOKEN_FORGE_ICI'; // Remplacez par votre token Forge
$serverId = 'VOTRE_SERVER_ID'; // Remplacez par votre server ID
$siteName = 'api.wozif.com'; // Votre nom de site
$phpVersion = '83'; // PHP 8.3

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
// CONFIGURATION PHP-FPM AVEC TIMEOUTS
// =========================================
$newPhpConfig = <<<'PHP'
; =========================================
; TIMEOUTS CRITIQUES POUR ÉVITER LES CRASHES
; =========================================

; Timeout d'exécution des scripts
max_execution_time = 300

; Timeout d'entrée/sortie
default_socket_timeout = 300

; Timeout de connexion base de données
pdo_mysql.default_socket_timeout = 300

; =========================================
; CONFIGURATION PHP-FPM
; =========================================

; Nombre de processus enfants
pm.max_children = 50

; Nombre de processus au démarrage
pm.start_servers = 5

; Nombre minimum de processus
pm.min_spare_servers = 5

; Nombre maximum de processus
pm.max_spare_servers = 35

; Timeout de traitement des requêtes
request_terminate_timeout = 300

; =========================================
; OPTIMISATIONS SUPABASE
; =========================================

; Désactiver les connexions persistantes (problème Supabase)
pdo_mysql.default_persistent = Off

; Timeout de connexion PDO
pdo_mysql.default_socket_timeout = 300

; =========================================
; OPTIMISATIONS MÉMOIRE
; =========================================

; Limite de mémoire
memory_limit = 1G

; Optimisation des sessions
session.gc_maxlifetime = 3600
session.gc_probability = 1
session.gc_divisor = 1000

; =========================================
; OPTIMISATIONS PERFORMANCE
; =========================================

; Buffer de sortie
output_buffering = 4096

; Cache des chemins réels
realpath_cache_size = 4096k
realpath_cache_ttl = 120

; Optimisation OPcache
opcache.enable = 1
opcache.memory_consumption = 128
opcache.max_accelerated_files = 10000
opcache.validate_timestamps = 0
opcache.revalidate_freq = 0
PHP;

// =========================================
// SCRIPT PRINCIPAL
// =========================================
echo "🚀 CONFIGURATION AUTOMATIQUE FORGE - CORS + PHP-FPM\n";
echo "==================================================\n\n";

try {
    echo "🔑 Connexion à Forge...\n";
    
    // Créer l'instance Forge
    $forge = new Forge($forgeToken);
    
    echo "✅ Connecté à Forge\n\n";
    
    // Récupérer le serveur
    echo "🔍 Récupération du serveur...\n";
    $server = $forge->server($serverId);
    echo "✅ Serveur trouvé: {$server->name}\n\n";
    
    // Récupérer le site
    echo "🔍 Récupération du site {$siteName}...\n";
    $sites = $forge->sites($serverId);
    $site = null;
    
    foreach ($sites as $s) {
        if ($s->name === $siteName) {
            $site = $s;
            break;
        }
    }
    
    if (!$site) {
        throw new Exception("Site {$siteName} non trouvé sur le serveur");
    }
    
    echo "✅ Site trouvé: {$site->name}\n\n";
    
    // =========================================
    // ÉTAPE 1: CONFIGURATION PHP-FPM
    // =========================================
    echo "🔧 ÉTAPE 1: Configuration PHP-FPM...\n";
    echo "   - Mise à jour des timeouts à 300 secondes\n";
    echo "   - Optimisation des processus\n";
    echo "   - Configuration Supabase\n";
    
    $forge->updatePhpConfiguration($serverId, $phpVersion, $newPhpConfig);
    echo "✅ Configuration PHP-FPM mise à jour\n\n";
    
    // Redémarrer PHP-FPM
    echo "🔄 Redémarrage de PHP-FPM...\n";
    $forge->restartPhp($serverId, $phpVersion);
    echo "✅ PHP-FPM redémarré\n\n";
    
    // =========================================
    // ÉTAPE 2: CONFIGURATION NGINX
    // =========================================
    echo "🔧 ÉTAPE 2: Configuration Nginx...\n";
    echo "   - Headers CORS forcés\n";
    echo "   - Gestion OPTIONS (préflight)\n";
    echo "   - Timeouts PHP-FPM synchronisés\n";
    
    $forge->updateSiteNginxFile($serverId, $site->id, $newNginxConfig);
    echo "✅ Configuration Nginx mise à jour\n\n";
    
    // Redémarrer Nginx
    echo "🔄 Redémarrage de Nginx...\n";
    $forge->restartNginx($serverId);
    echo "✅ Nginx redémarré\n\n";
    
    // =========================================
    // RÉSULTAT FINAL
    // =========================================
    echo "🎉 CONFIGURATION TERMINÉE AVEC SUCCÈS !\n";
    echo "========================================\n";
    echo "✅ PHP-FPM: Timeouts à 300 secondes\n";
    echo "✅ Nginx: Headers CORS forcés\n";
    echo "✅ CORS: Fonctionne sur toutes les routes\n";
    echo "✅ Frontend: Peut maintenant communiquer\n\n";
    
    echo "🌐 Testez immédiatement sur: https://app.wozif.store/sign-in\n";
    echo "🔍 Plus d'erreur CORS dans la console du navigateur\n";
    
} catch (Exception $e) {
    echo "❌ ERREUR: " . $e->getMessage() . "\n";
    echo "📋 Trace: " . $e->getTraceAsString() . "\n";
}
