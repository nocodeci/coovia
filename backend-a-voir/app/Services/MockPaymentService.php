<?php

namespace App\Services;

use Illuminate\Support\Facades\Log;

class MockPaymentService
{
    /**
     * Créer un paiement mock
     */
    public function createMockPayment($data)
    {
        Log::info('MockPaymentService: Création de paiement mock', [
            'method' => $data['payment_method'] ?? 'unknown',
            'amount' => $data['amount'] ?? 0,
            'country' => $data['country'] ?? 'unknown'
        ]);

        $paymentId = 'MOCK-' . uniqid();
        
        return [
            'success' => true,
            'payment_id' => $paymentId,
            'deposit_id' => $paymentId,
            'status' => 'pending',
            'provider' => 'mock',
            'amount' => $data['amount'] ?? 0,
            'currency' => $data['currency'] ?? 'XOF',
            'message' => 'Paiement mock créé avec succès',
            'token' => 'mock_token_' . uniqid(),
            'url' => 'https://mock-payment.com/checkout/' . $paymentId,
            'fallback_used' => false
        ];
    }

    /**
     * Vérifier le statut d'un paiement mock
     */
    public function checkMockPaymentStatus($paymentId, $provider = 'mock')
    {
        Log::info('MockPaymentService: Vérification du statut mock', [
            'payment_id' => $paymentId,
            'provider' => $provider
        ]);

        // Simuler différents statuts
        $statuses = ['pending', 'success', 'failed'];
        $randomStatus = $statuses[array_rand($statuses)];

        return [
            'success' => true,
            'data' => [
                'status' => $randomStatus,
                'provider' => $provider,
                'amount' => 1000,
                'currency' => 'XOF',
                'transaction_id' => 'MOCK-TXN-' . uniqid(),
                'deposit_id' => $paymentId
            ],
            'message' => 'Statut mock récupéré avec succès'
        ];
    }

    /**
     * Traiter un paiement OTP mock (Orange Money CI)
     */
    public function processMockOTPPayment($data)
    {
        Log::info('MockPaymentService: Traitement OTP mock', [
            'phone' => $data['phone_number'] ?? 'unknown',
            'otp' => $data['otp'] ?? 'unknown'
        ]);

        // Simuler une validation OTP
        $isValidOTP = $data['otp'] === '123456' || $data['otp'] === '000000';

        if ($isValidOTP) {
            return [
                'success' => true,
                'message' => 'Paiement OTP mock validé avec succès',
                'transaction_id' => 'MOCK-OTP-' . uniqid(),
                'status' => 'success'
            ];
        } else {
            return [
                'success' => false,
                'message' => 'Code OTP mock invalide',
                'error' => 'Invalid OTP code'
            ];
        }
    }

    /**
     * Traiter un paiement Wave CI mock
     */
    public function processMockWavePayment($data)
    {
        Log::info('MockPaymentService: Traitement Wave CI mock', [
            'phone' => $data['phone_number'] ?? 'unknown'
        ]);

        return [
            'success' => true,
            'message' => 'Paiement Wave CI mock traité avec succès',
            'transaction_id' => 'MOCK-WAVE-' . uniqid(),
            'status' => 'success',
            'url' => 'https://mock-wave.com/success'
        ];
    }

    /**
     * Traiter un paiement MTN CI mock
     */
    public function processMockMTNPayment($data)
    {
        Log::info('MockPaymentService: Traitement MTN CI mock', [
            'phone' => $data['phone_number'] ?? 'unknown'
        ]);

        return [
            'success' => true,
            'message' => 'Paiement MTN CI mock traité avec succès',
            'transaction_id' => 'MOCK-MTN-' . uniqid(),
            'status' => 'success',
            'url' => 'https://mock-mtn.com/success'
        ];
    }

    /**
     * Traiter un paiement Moov CI mock
     */
    public function processMockMoovPayment($data)
    {
        Log::info('MockPaymentService: Traitement Moov CI mock', [
            'phone' => $data['phone_number'] ?? 'unknown'
        ]);

        return [
            'success' => true,
            'message' => 'Paiement Moov CI mock traité avec succès',
            'transaction_id' => 'MOCK-MOOV-' . uniqid(),
            'status' => 'success',
            'url' => 'https://mock-moov.com/success'
        ];
    }

    /**
     * Obtenir les méthodes disponibles mock
     */
    public function getMockAvailableMethods($country)
    {
        $methods = [
            'CI' => [
                'orange-money-ci' => [
                    'primary' => 'mock',
                    'fallback' => null,
                    'enabled' => true
                ],
                'wave-ci' => [
                    'primary' => 'mock',
                    'fallback' => null,
                    'enabled' => true
                ],
                'mtn-ci' => [
                    'primary' => 'mock',
                    'fallback' => null,
                    'enabled' => true
                ],
                'moov-ci' => [
                    'primary' => 'mock',
                    'fallback' => null,
                    'enabled' => true
                ]
            ],
            'BF' => [
                'orange-money-burkina' => [
                    'primary' => 'mock',
                    'fallback' => null,
                    'enabled' => true
                ],
                'moov-money-burkina' => [
                    'primary' => 'mock',
                    'fallback' => null,
                    'enabled' => true
                ]
            ],
            'ML' => [
                'orange-money-mali' => [
                    'primary' => 'mock',
                    'fallback' => null,
                    'enabled' => true
                ],
                'moov-money-mali' => [
                    'primary' => 'mock',
                    'fallback' => null,
                    'enabled' => true
                ]
            ]
        ];

        return $methods[$country] ?? [];
    }

    /**
     * Obtenir les statistiques mock
     */
    public function getMockStats()
    {
        return [
            'mock' => [
                'success_rate' => 95.5,
                'total_attempts' => 1000,
                'successful_attempts' => 955,
                'failed_attempts' => 45
            ]
        ];
    }
}
