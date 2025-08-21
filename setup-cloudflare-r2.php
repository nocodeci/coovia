<?php

echo "🔧 Configuration Cloudflare R2\n";
echo "==============================\n\n";

echo "📋 Variables d'environnement requises :\n";
echo "=======================================\n\n";

$requiredVars = [
    'CLOUDFLARE_R2_ACCESS_KEY_ID' => 'Clé d\'accès Cloudflare R2',
    'CLOUDFLARE_R2_SECRET_ACCESS_KEY' => 'Clé secrète Cloudflare R2', 
    'CLOUDFLARE_R2_BUCKET' => 'Nom du bucket R2',
    'CLOUDFLARE_R2_ENDPOINT' => 'Endpoint R2 (https://account-id.r2.cloudflarestorage.com)',
    'CLOUDFLARE_R2_URL' => 'URL publique R2 (https://pub-account-id.r2.dev)'
];

echo "Ajoutez ces variables à votre fichier .env :\n\n";

foreach ($requiredVars as $var => $description) {
    echo "# {$description}\n";
    echo "{$var}=\n\n";
}

echo "📖 Instructions de configuration :\n";
echo "==================================\n\n";

echo "1. 🌐 Allez sur https://dash.cloudflare.com\n";
echo "2. 📦 Créez un bucket R2 dans votre compte\n";
echo "3. 🔑 Générez des clés API R2\n";
echo "4. 📝 Copiez les informations dans votre .env\n\n";

echo "🔍 Vérification actuelle :\n";
echo "==========================\n\n";

// Charger les variables d'environnement
$envFile = '.env';
if (file_exists($envFile)) {
    $lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos($line, '=') !== false && strpos($line, '#') !== 0) {
            list($key, $value) = explode('=', $line, 2);
            $_ENV[trim($key)] = trim($value);
            putenv(trim($key) . '=' . trim($value));
        }
    }
}

$configOk = true;
foreach (array_keys($requiredVars) as $var) {
    $value = $_ENV[$var] ?? null;
    if ($value) {
        echo "  ✅ {$var}: " . substr($value, 0, 10) . "...\n";
    } else {
        echo "  ❌ {$var}: MANQUANT\n";
        $configOk = false;
    }
}

echo "\n";

if ($configOk) {
    echo "🎉 Configuration Cloudflare R2 complète !\n";
    echo "Vous pouvez maintenant tester avec :\n";
    echo "php test-media-cloudflare.php\n";
} else {
    echo "⚠️  Configuration incomplète.\n";
    echo "Ajoutez les variables manquantes à votre fichier .env\n";
}

echo "\n💡 Note : Le système fonctionne actuellement avec le stockage local\n";
echo "   comme fallback. Une fois Cloudflare R2 configuré, les fichiers\n";
echo "   seront automatiquement uploadés vers Cloudflare.\n\n";
