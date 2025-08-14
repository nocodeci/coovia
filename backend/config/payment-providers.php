<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Configuration des Providers de Paiement
    |--------------------------------------------------------------------------
    |
    | Ce fichier définit les providers de paiement disponibles par pays
    | et méthode de paiement, avec leur ordre de priorité.
    |
    */

    'providers' => [
        'CIV' => [ // Côte d'Ivoire
            'MTN_MOMO_CIV' => [
                'primary' => 'pawapay',
                'fallback' => 'paydunya',
                'enabled' => true
            ],
            'ORANGE_CIV' => [
                'primary' => 'pawapay',
                'fallback' => 'paydunya',
                'enabled' => true
            ],
            'MOOV_CI' => [
                'primary' => 'paydunya',
                'fallback' => null,
                'enabled' => true
            ],
            'MTN_CI' => [
                'primary' => 'paydunya',
                'fallback' => null,
                'enabled' => true
            ],
            'WAVE_CI' => [
                'primary' => 'paydunya',
                'fallback' => null,
                'enabled' => true
            ],
            'ORANGE_MONEY_CI' => [
                'primary' => 'paydunya',
                'fallback' => null,
                'enabled' => true
            ],
            // Clés frontend pour Côte d'Ivoire
            'moov-ci' => [
                'primary' => 'paydunya',
                'fallback' => null,
                'enabled' => true
            ],
            'mtn-ci' => [
                'primary' => 'paydunya',
                'fallback' => null,
                'enabled' => true
            ],
            'wave-ci' => [
                'primary' => 'paydunya',
                'fallback' => null,
                'enabled' => true
            ],
            'orange-money-ci' => [
                'primary' => 'paydunya',
                'fallback' => null,
                'enabled' => true
            ]
        ],
        'CI' => [ // Côte d'Ivoire (alias)
            'MTN_MOMO_CIV' => [
                'primary' => 'pawapay',
                'fallback' => 'paydunya',
                'enabled' => true
            ],
            'ORANGE_CIV' => [
                'primary' => 'pawapay',
                'fallback' => 'paydunya',
                'enabled' => true
            ],
            'MOOV_CI' => [
                'primary' => 'paydunya',
                'fallback' => null,
                'enabled' => true
            ],
            'MTN_CI' => [
                'primary' => 'paydunya',
                'fallback' => null,
                'enabled' => true
            ],
            'WAVE_CI' => [
                'primary' => 'paydunya',
                'fallback' => null,
                'enabled' => true
            ],
            'ORANGE_MONEY_CI' => [
                'primary' => 'paydunya',
                'fallback' => null,
                'enabled' => true
            ],
            // Clés frontend pour Côte d'Ivoire
            'moov-ci' => [
                'primary' => 'paydunya',
                'fallback' => null,
                'enabled' => true
            ],
            'mtn-ci' => [
                'primary' => 'paydunya',
                'fallback' => null,
                'enabled' => true
            ],
            'wave-ci' => [
                'primary' => 'paydunya',
                'fallback' => null,
                'enabled' => true
            ],
            'orange-money-ci' => [
                'primary' => 'paydunya',
                'fallback' => null,
                'enabled' => true
            ]
        ],
        'SN' => [ // Sénégal
            'E_MONEY_SN' => [
                'primary' => 'paydunya',
                'fallback' => null,
                'enabled' => true
            ],
            'WIZALL_SN' => [
                'primary' => 'paydunya',
                'fallback' => null,
                'enabled' => true
            ],
            'WAVE_SN' => [
                'primary' => 'paydunya',
                'fallback' => null,
                'enabled' => true
            ],
            'FREE_MONEY_SN' => [
                'primary' => 'paydunya',
                'fallback' => null,
                'enabled' => true
            ],
            'ORANGE_MONEY_SN' => [
                'primary' => 'paydunya',
                'fallback' => null,
                'enabled' => true
            ]
        ],
        'TG' => [ // Togo
            'TOGOCEL_TG' => [
                'primary' => 'paydunya',
                'fallback' => null,
                'enabled' => true
            ]
        ],
        'ZMB' => [ // Zambie
            'MTN_MOMO_ZMB' => [
                'primary' => 'pawapay',
                'fallback' => null,
                'enabled' => true
            ],
            'AIRTEL_MONEY_ZMB' => [
                'primary' => 'pawapay',
                'fallback' => null,
                'enabled' => true
            ],
            'ZAMTEL_MONEY_ZMB' => [
                'primary' => 'pawapay',
                'fallback' => null,
                'enabled' => true
            ]
        ],
        'UG' => [ // Ouganda
            'MTN_MOMO_UG' => [
                'primary' => 'pawapay',
                'fallback' => null,
                'enabled' => true
            ],
            'AIRTEL_MONEY_UG' => [
                'primary' => 'pawapay',
                'fallback' => null,
                'enabled' => true
            ]
        ],
        'TZ' => [ // Tanzanie
            'MPESA_TZ' => [
                'primary' => 'pawapay',
                'fallback' => null,
                'enabled' => true
            ],
            'AIRTEL_MONEY_TZ' => [
                'primary' => 'pawapay',
                'fallback' => null,
                'enabled' => true
            ],
            'TIGO_PESA_TZ' => [
                'primary' => 'pawapay',
                'fallback' => null,
                'enabled' => true
            ]
        ],
        'KE' => [ // Kenya
            'MPESA_KE' => [
                'primary' => 'pawapay',
                'fallback' => null,
                'enabled' => true
            ],
            'AIRTEL_MONEY_KE' => [
                'primary' => 'pawapay',
                'fallback' => null,
                'enabled' => true
            ]
        ],
        'CM' => [ // Cameroun
            'MTN_MOMO_CM' => [
                'primary' => 'pawapay',
                'fallback' => null,
                'enabled' => true
            ],
            'ORANGE_CM' => [
                'primary' => 'pawapay',
                'fallback' => null,
                'enabled' => true
            ]
        ],
        'CD' => [ // République Démocratique du Congo
            'AIRTEL_CD' => [
                'primary' => 'pawapay',
                'fallback' => null,
                'enabled' => true
            ],
            'ORANGE_CD' => [
                'primary' => 'pawapay',
                'fallback' => null,
                'enabled' => true
            ],
            'VODACOM_MPESA_CD' => [
                'primary' => 'pawapay',
                'fallback' => null,
                'enabled' => true
            ]
        ],
        'CG' => [ // Congo
            'AIRTEL_CG' => [
                'primary' => 'pawapay',
                'fallback' => null,
                'enabled' => true
            ],
            'MTN_MOMO_CG' => [
                'primary' => 'pawapay',
                'fallback' => null,
                'enabled' => true
            ]
        ],
        'GA' => [ // Gabon
            'AIRTEL_GA' => [
                'primary' => 'pawapay',
                'fallback' => null,
                'enabled' => true
            ]
        ],
        'RW' => [ // Rwanda
            'AIRTEL_RW' => [
                'primary' => 'pawapay',
                'fallback' => null,
                'enabled' => true
            ],
            'MTN_MOMO_RW' => [
                'primary' => 'pawapay',
                'fallback' => null,
                'enabled' => true
            ]
        ],
        'NG' => [ // Nigeria
            'MTN_MOMO_NG' => [
                'primary' => 'pawapay',
                'fallback' => null,
                'enabled' => true
            ],
            'AIRTEL_MONEY_NG' => [
                'primary' => 'pawapay',
                'fallback' => null,
                'enabled' => true
            ]
        ],
        'BF' => [ // Burkina Faso
            'ORANGE_MONEY_BF' => [
                'primary' => 'paydunya',
                'fallback' => null,
                'enabled' => true
            ],
            'MOOV_MONEY_BF' => [
                'primary' => 'paydunya',
                'fallback' => null,
                'enabled' => true
            ],
            // Clés frontend pour Burkina Faso
            'orange-money-burkina' => [
                'primary' => 'paydunya',
                'fallback' => null,
                'enabled' => true
            ],
            'moov-money-burkina' => [
                'primary' => 'paydunya',
                'fallback' => null,
                'enabled' => true
            ]
        ],
        'ML' => [ // Mali
            'ORANGE_MONEY_ML' => [
                'primary' => 'paydunya',
                'fallback' => null,
                'enabled' => true
            ],
            'MOOV_MONEY_ML' => [
                'primary' => 'paydunya',
                'fallback' => null,
                'enabled' => true
            ],
            // Clés frontend pour Mali
            'orange-money-mali' => [
                'primary' => 'paydunya',
                'fallback' => null,
                'enabled' => true
            ],
            'moov-money-mali' => [
                'primary' => 'paydunya',
                'fallback' => null,
                'enabled' => true
            ]
        ]
    ],

    /*
    |--------------------------------------------------------------------------
    | Configuration des Services
    |--------------------------------------------------------------------------
    |
    | Configuration spécifique pour chaque service de paiement
    |
    */

    'services' => [
        'paydunya' => [
            'enabled' => true,
            'max_retries' => 3,
            'timeout' => 30,
            'countries' => ['CIV', 'SN', 'TG', 'BF', 'ML']
        ],
        'pawapay' => [
            'enabled' => true,
            'max_retries' => 3,
            'timeout' => 30,
            'countries' => ['CIV', 'ZMB', 'UG', 'TZ', 'KE', 'NG', 'BF', 'ML']
        ]
    ],

    /*
    |--------------------------------------------------------------------------
    | Configuration des Erreurs de Fallback
    |--------------------------------------------------------------------------
    |
    | Définit les types d'erreurs qui déclenchent un fallback
    |
    */

    'fallback_triggers' => [
        'network_errors' => [
            'timeout',
            'connection_refused',
            'network_unreachable'
        ],
        'api_errors' => [
            'service_unavailable',
            'provider_temporarily_unavailable',
            'rate_limit_exceeded'
        ],
        'validation_errors' => [
            'invalid_phone_format',
            'invalid_amount',
            'unsupported_currency'
        ]
    ]
]; 