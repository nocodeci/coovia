<?php

require_once __DIR__ . '/vendor/autoload.php';

use Laravel\Forge\Forge;

// Configuration Forge
$forgeToken = 'VOTRE_TOKEN_FORGE_ICI'; // Remplacez par votre token
$serverId = 'VOTRE_SERVER_ID'; // Remplacez par votre server ID
$phpVersion = '83'; // PHP 8.3

// Nouvelle configuration PHP-FPM avec timeouts
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

try {
    echo "🚀 Connexion à Forge...\n";
    
    // Créer l'instance Forge
    $forge = new Forge($forgeToken);
    
    echo "✅ Connecté à Forge\n";
    
    // Récupérer le serveur
    echo "🔍 Récupération du serveur...\n";
    $server = $forge->server($serverId);
    echo "✅ Serveur trouvé: {$server->name}\n";
    
    // Mettre à jour la configuration PHP-FPM
    echo "🔧 Mise à jour de la configuration PHP-FPM...\n";
    $forge->updatePhpConfiguration($serverId, $phpVersion, $newPhpConfig);
    echo "✅ Configuration PHP-FPM mise à jour\n";
    
    // Redémarrer PHP-FPM
    echo "🔄 Redémarrage de PHP-FPM...\n";
    $forge->restartPhp($serverId, $phpVersion);
    echo "✅ PHP-FPM redémarré\n";
    
    echo "\n🎉 Configuration PHP-FPM appliquée avec succès !\n";
    echo "⚡ Les timeouts sont maintenant à 300 secondes\n";
    
} catch (Exception $e) {
    echo "❌ Erreur: " . $e->getMessage() . "\n";
    echo "📋 Trace: " . $e->getTraceAsString() . "\n";
}
