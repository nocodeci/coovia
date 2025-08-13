<?php

require_once 'vendor/autoload.php';

use App\Models\Media;
use Illuminate\Support\Facades\Storage;

// Charger la configuration Laravel
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "=== Test Proxy Média ===\n\n";

// Récupérer le premier média de la base de données
$media = Media::first();

if (!$media) {
    echo "❌ Aucun média trouvé dans la base de données\n";
    exit(1);
}

echo "📁 Média trouvé:\n";
echo "- ID: {$media->id}\n";
echo "- Nom: {$media->name}\n";
echo "- Type: {$media->type}\n";
echo "- Store ID: {$media->store_id}\n";
echo "- URL Cloudflare: {$media->url}\n";
echo "- URL Proxy: {$media->proxy_url}\n";
echo "- Thumbnail Proxy: {$media->proxy_thumbnail_url}\n\n";

// Tester l'accès au fichier via le proxy
echo "🔗 Test d'accès au proxy:\n";
$proxyUrl = $media->proxy_url;
echo "URL du proxy: {$proxyUrl}\n";

// Tester avec curl
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $proxyUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HEADER, true);
curl_setopt($ch, CURLOPT_NOBODY, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 10);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpCode === 200) {
    echo "✅ Proxy fonctionne correctement (HTTP {$httpCode})\n";
} else {
    echo "❌ Proxy échoue (HTTP {$httpCode})\n";
    echo "Réponse: " . substr($response, 0, 200) . "...\n";
}

echo "\n=== Fin du test ===\n";
