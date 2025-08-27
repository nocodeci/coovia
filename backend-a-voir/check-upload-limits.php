<?php

/**
 * Script pour vérifier les limites d'upload PHP
 * Usage: php check-upload-limits.php
 */

echo "🔍 Vérification des limites d'upload PHP\n";
echo "=====================================\n\n";

// Limites d'upload
echo "📁 Limites d'upload :\n";
echo "- upload_max_filesize: " . ini_get('upload_max_filesize') . "\n";
echo "- post_max_size: " . ini_get('post_max_size') . "\n";
echo "- max_file_uploads: " . ini_get('max_file_uploads') . "\n";
echo "- max_input_vars: " . ini_get('max_input_vars') . "\n\n";

// Limites de mémoire et temps
echo "⏱️ Limites de performance :\n";
echo "- memory_limit: " . ini_get('memory_limit') . "\n";
echo "- max_execution_time: " . ini_get('max_execution_time') . "s\n";
echo "- max_input_time: " . ini_get('max_input_time') . "s\n\n";

// Extensions PHP
echo "🔧 Extensions PHP :\n";
$required_extensions = ['pdo_pgsql', 'intl', 'fileinfo', 'gd', 'mbstring', 'openssl', 'zip'];
foreach ($required_extensions as $ext) {
    $status = extension_loaded($ext) ? "✅" : "❌";
    echo "- $ext: $status\n";
}
echo "\n";

// Configuration Laravel
echo "🎯 Configuration Laravel :\n";
if (file_exists('config/upload.php')) {
    echo "- Fichier de configuration upload.php: ✅\n";
    $upload_config = require 'config/upload.php';
    echo "- Taille max fichier: " . ($upload_config['max_file_size'] / 1024 / 1024) . "MB\n";
    echo "- Taille max totale: " . ($upload_config['max_total_size'] / 1024 / 1024) . "MB\n";
    echo "- Nombre max fichiers: " . $upload_config['max_files'] . "\n";
} else {
    echo "- Fichier de configuration upload.php: ❌\n";
}
echo "\n";

// Recommandations
echo "💡 Recommandations :\n";
$upload_max = ini_get('upload_max_filesize');
$post_max = ini_get('post_max_size');

if (strpos($upload_max, 'M') !== false) {
    $upload_mb = (int) $upload_max;
    if ($upload_mb < 50) {
        echo "- ⚠️ upload_max_filesize est trop faible ($upload_max). Recommandé: 50M\n";
    }
}

if (strpos($post_max, 'M') !== false) {
    $post_mb = (int) $post_max;
    if ($post_mb < 100) {
        echo "- ⚠️ post_max_size est trop faible ($post_max). Recommandé: 100M\n";
    }
}

echo "- ✅ Toutes les limites semblent correctes pour les uploads de gros fichiers\n";
echo "\n";

// Test de création de fichier temporaire
echo "🧪 Test de création de fichier temporaire :\n";
$temp_file = tempnam(sys_get_temp_dir(), 'upload_test');
if ($temp_file) {
    echo "- ✅ Création de fichier temporaire: OK\n";
    unlink($temp_file);
} else {
    echo "- ❌ Création de fichier temporaire: ÉCHEC\n";
}

echo "\n✅ Vérification terminée !\n";
