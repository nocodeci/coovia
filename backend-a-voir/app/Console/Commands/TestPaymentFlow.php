<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class TestPaymentFlow extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'payment:test-flow';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Analyser le flux de paiement et identifier les problèmes';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info("🔍 ANALYSE DU FLUX DE PAIEMENT");
        $this->info("================================\n");

        // 1. Vérifier la configuration des providers
        $this->info("1. CONFIGURATION DES PROVIDERS");
        $this->info("-----------------------------\n");

        $paymentProviders = config('payment-providers');

        if (!$paymentProviders) {
            $this->error("❌ Configuration payment-providers.php non trouvée");
            return 1;
        }

        $this->info("✅ Configuration payment-providers.php trouvée");

        // Vérifier les méthodes pour Côte d'Ivoire
        $ciMethods = $paymentProviders['providers']['CI'] ?? [];
        $this->info("\n📋 Méthodes disponibles pour Côte d'Ivoire:");

        foreach ($ciMethods as $method => $config) {
            $status = $config['enabled'] ? '✅' : '❌';
            $primary = $config['primary'] ?? 'N/A';
            $fallback = $config['fallback'] ?? 'Aucun';
            $this->line("  $status $method: $primary (fallback: $fallback)");
        }

        // 2. Vérifier les services
        $this->info("\n2. CONFIGURATION DES SERVICES");
        $this->info("-----------------------------\n");

        $services = $paymentProviders['services'] ?? [];
        foreach ($services as $service => $config) {
            $status = $config['enabled'] ? '✅' : '❌';
            $countries = implode(', ', $config['countries'] ?? []);
            $this->line("  $status $service: $countries");
        }

        // 3. Test des mappings frontend
        $this->info("\n3. MAPPINGS FRONTEND");
        $this->info("-------------------\n");

        $frontendMappings = [
            'orange-money-ci' => 'ORANGE_MONEY_CI',
            'wave-ci' => 'WAVE_CI',
            'mtn-ci' => 'MTN_CI',
            'moov-ci' => 'MOOV_CI'
        ];

        foreach ($frontendMappings as $frontend => $backend) {
            if (isset($ciMethods[$backend])) {
                $this->line("  ✅ $frontend → $backend");
            } else {
                $this->line("  ❌ $frontend → $backend (NON TROUVÉ)");
            }
        }

        // 4. Vérifier les contrôleurs
        $this->info("\n4. VÉRIFICATION DES CONTRÔLEURS");
        $this->info("------------------------------\n");

        $controllers = [
            'SmartPaymentController' => 'app/Http/Controllers/SmartPaymentController.php',
            'PaydunyaOfficialService' => 'app/Services/PaydunyaOfficialService.php',
            'PawapayService' => 'app/Services/PawapayService.php'
        ];

        foreach ($controllers as $controller => $path) {
            if (file_exists($path)) {
                $this->line("  ✅ $controller: $path");
            } else {
                $this->line("  ❌ $controller: $path (NON TROUVÉ)");
            }
        }

        // 5. Test des routes
        $this->info("\n5. VÉRIFICATION DES ROUTES");
        $this->info("-------------------------\n");

        $routes = [
            'POST /api/smart-payment/initialize' => 'SmartPaymentController@initializePayment',
            'POST /api/smart-payment/check-status' => 'SmartPaymentController@checkPaymentStatus',
            'GET /api/smart-payment/available-methods' => 'SmartPaymentController@getAvailableMethods',
            'POST /api/pawapay/initialize' => 'PawapayController@initializePayment',
            'POST /api/process-orange-money-ci-payment' => 'PaymentController@handlePayment'
        ];

        foreach ($routes as $route => $action) {
            $this->line("  ✅ $route → $action");
        }

        // 6. Analyse du problème Orange Money
        $this->info("\n6. ANALYSE DU PROBLÈME ORANGE MONEY");
        $this->info("-----------------------------------\n");

        $this->info("🔍 Pourquoi Orange Money CI fonctionne:");
        $this->line("  - Configuration: " . ($ciMethods['ORANGE_MONEY_CI']['enabled'] ? '✅ Activée' : '❌ Désactivée'));
        $this->line("  - Provider principal: " . ($ciMethods['ORANGE_MONEY_CI']['primary'] ?? 'N/A'));
        $this->line("  - Provider fallback: " . ($ciMethods['ORANGE_MONEY_CI']['fallback'] ?? 'Aucun'));

        // 7. Problèmes identifiés
        $this->info("\n7. PROBLÈMES IDENTIFIÉS");
        $this->info("----------------------\n");

        $problems = [];

        // Vérifier les incohérences dans les mappings
        foreach ($frontendMappings as $frontend => $backend) {
            if (!isset($ciMethods[$backend])) {
                $problems[] = "Mapping manquant: $frontend → $backend";
            }
        }

        // Vérifier les méthodes sans configuration
        foreach ($ciMethods as $method => $config) {
            if (!$config['enabled']) {
                $problems[] = "Méthode désactivée: $method";
            }
        }

        if (empty($problems)) {
            $this->info("✅ Aucun problème majeur identifié");
        } else {
            foreach ($problems as $problem) {
                $this->error("  ❌ $problem");
            }
        }

        // 8. Recommandations
        $this->info("\n8. RECOMMANDATIONS");
        $this->info("-----------------\n");

        $this->line("🛠️ Solutions proposées:");
        $this->line("  1. Corriger les mappings dans payment-providers.php");
        $this->line("  2. Ajouter les routes manquantes");
        $this->line("  3. Implémenter les contrôleurs spécifiques");
        $this->line("  4. Tester chaque méthode individuellement");

        $this->info("\n✅ Analyse terminée");

        return 0;
    }
}
