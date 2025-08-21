<?php

// Charger l'autoloader de Laravel
require_once __DIR__ . '/vendor/autoload.php';

// Charger l'application Laravel
$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\Store;
use App\Services\SubdomainService;
use Illuminate\Support\Facades\Log;

echo "🧹 Nettoyage des boutiques de test avec timestamps\n";
echo "================================================\n\n";

// Trouver les boutiques avec des timestamps dans le slug
$storesWithTimestamps = Store::where('slug', 'like', '%-%')
    ->whereRaw("slug ~ '[0-9]{10,}$'") // Timestamps de 10+ chiffres à la fin
    ->get();

echo "📋 Boutiques trouvées avec timestamps: " . $storesWithTimestamps->count() . "\n\n";

if ($storesWithTimestamps->count() === 0) {
    echo "✅ Aucune boutique avec timestamp à nettoyer\n";
    exit(0);
}

$subdomainService = new SubdomainService();
$deletedCount = 0;
$errorCount = 0;

foreach ($storesWithTimestamps as $store) {
    echo "🗑️ Suppression de: {$store->name} (slug: {$store->slug})\n";
    
    try {
        // Supprimer le sous-domaine de Vercel
        $subdomainDeleted = $subdomainService->deleteSubdomain($store->slug);
        if ($subdomainDeleted) {
            echo "  ✅ Sous-domaine supprimé de Vercel\n";
        } else {
            echo "  ⚠️ Échec de suppression du sous-domaine\n";
        }
        
        // Supprimer la boutique de la base de données
        $store->delete();
        echo "  ✅ Boutique supprimée de la base de données\n";
        $deletedCount++;
        
    } catch (\Exception $e) {
        echo "  ❌ Erreur: " . $e->getMessage() . "\n";
        $errorCount++;
    }
    
    echo "\n";
}

echo "📊 Résumé du nettoyage:\n";
echo "  ✅ Boutiques supprimées: $deletedCount\n";
echo "  ❌ Erreurs: $errorCount\n";
echo "  📋 Total traité: " . $storesWithTimestamps->count() . "\n\n";

if ($deletedCount > 0) {
    echo "🎉 Nettoyage terminé avec succès!\n";
    echo "📝 Les boutiques avec timestamps ont été supprimées\n";
    echo "🔍 Les sous-domaines correspondants ont été nettoyés\n";
} else {
    echo "⚠️ Aucune boutique n'a pu être supprimée\n";
}

echo "\n💡 Conseil: Utilisez maintenant des slugs propres sans timestamps\n";
echo "🌐 Exemple: 'nocodeci' au lieu de 'nocodeci-1755027264477'\n";
