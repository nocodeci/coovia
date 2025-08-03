<?php

return [
    /*
    |--------------------------------------------------------------------------
    | PayDunya Configuration
    |--------------------------------------------------------------------------
    |
    | Configuration pour l'intégration PayDunya
    |
    */

    'environment' => env('PAYDUNYA_ENVIRONMENT', 'live'), // Changé de 'test' à 'live'

    // Clés de production PayDunya
    'master_key' => env('PAYDUNYA_MASTER_KEY', '4fhx3AZI-ZycL-s9v5-mLbW-jzGmb5ibuzeD'),
    'private_key' => env('PAYDUNYA_PRIVATE_KEY', 'live_private_qDtW1ZLTcKngCiCuWCRUVkPJPF3'),
    'public_key' => env('PAYDUNYA_PUBLIC_KEY', 'live_public_Sii5AvDzUkVgFhvpUM0yIlopF9E'),
    'token' => env('PAYDUNYA_TOKEN', 'r7qGblLaOZKlqYCJdTa2'),

    // URLs de webhook
    'webhook_url' => env('PAYDUNYA_WEBHOOK_URL', 'http://localhost:8000/api/paydunya/webhook'),
    'success_url' => env('PAYDUNYA_SUCCESS_URL', 'http://localhost:5173/payment/success'),
    'cancel_url' => env('PAYDUNYA_CANCEL_URL', 'http://localhost:5173/payment/cancel'),

    // Configuration des méthodes de paiement supportées
    'supported_methods' => [
        'orange_money_senegal' => [
            'qr_code' => true,
            'otp_code' => true,
        ],
        'free_money_senegal' => true,
        'wave_senegal' => true,
        'expresso_senegal' => true,
        'wizall_senegal' => true,
        'orange_money_ci' => true,
        'mtn_ci' => true,
        'moov_ci' => true,
        'wave_ci' => true,
        'orange_money_burkina' => true,
        'moov_burkina' => true,
        'moov_benin' => true,
        'mtn_benin' => true,
        't_money_togo' => true,
        'moov_togo' => true,
        'orange_money_mali' => true,
        'moov_mali' => true,
        'paydunya' => true,
        'card' => true, // Nécessite certification PCI-DSS
    ],

    // Configuration des frais par méthode
    'fees' => [
        'orange_money_senegal' => 100,
        'free_money_senegal' => 100,
        'wave_senegal' => 100,
        'expresso_senegal' => 100,
        'wizall_senegal' => 100,
        'orange_money_ci' => 100,
        'mtn_ci' => 100,
        'moov_ci' => 100,
        'wave_ci' => 100,
        'orange_money_burkina' => 100,
        'moov_burkina' => 100,
        'moov_benin' => 100,
        'mtn_benin' => 100,
        't_money_togo' => 100,
        'moov_togo' => 100,
        'orange_money_mali' => 100,
        'moov_mali' => 100,
        'paydunya' => 100,
        'card' => 100,
    ],

    // Configuration des devises supportées
    'currencies' => [
        'XOF' => 'Franc CFA',
        'XAF' => 'Franc CFA',
        'EUR' => 'Euro',
        'USD' => 'Dollar US',
    ],

    // Configuration des pays supportés
    'supported_countries' => [
        'Sénégal' => [
            'orange_money_senegal',
            'free_money_senegal',
            'wave_senegal',
            'expresso_senegal',
            'wizall_senegal',
        ],
        'Côte d\'Ivoire' => [
            'orange_money_ci',
            'mtn_ci',
            'moov_ci',
            'wave_ci',
        ],
        'Burkina Faso' => [
            'orange_money_burkina',
            'moov_burkina',
        ],
        'Bénin' => [
            'moov_benin',
            'mtn_benin',
        ],
        'Togo' => [
            't_money_togo',
            'moov_togo',
        ],
        'Mali' => [
            'orange_money_mali',
            'moov_mali',
        ],
    ],
]; 