<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class StoreController extends Controller
{
    /**
     * Afficher les informations d'une boutique
     */
    public function show(string $storeId): JsonResponse
    {
        // Simuler des données de boutique pour différents storeId
        $stores = [
            'store-123' => [
                'name' => 'Boutique Premium',
                'logo' => 'B'
            ],
            'store-456' => [
                'name' => 'Shop Élégance',
                'logo' => 'S'
            ],
            'test-store' => [
                'name' => 'Test Boutique',
                'logo' => 'T'
            ],
            'nocodeci' => [
                'name' => 'NOCODE CI',
                'logo' => 'N'
            ],
            'default' => [
                'name' => 'Ma Boutique',
                'logo' => 'M'
            ]
        ];

        // Récupérer les informations de la boutique ou utiliser les valeurs par défaut
        $storeInfo = $stores[$storeId] ?? $stores['default'];

        return response()->json([
            'success' => true,
            'data' => [
                'id' => $storeId,
                'name' => $storeInfo['name'],
                'logo' => $storeInfo['logo']
            ]
        ]);
    }

    /**
     * Lister toutes les boutiques
     */
    public function index(): JsonResponse
    {
        $stores = [
            [
                'id' => 'store-123',
                'name' => 'Boutique Premium',
                'logo' => 'B'
            ],
            [
                'id' => 'store-456',
                'name' => 'Shop Élégance',
                'logo' => 'S'
            ],
            [
                'id' => 'test-store',
                'name' => 'Test Boutique',
                'logo' => 'T'
            ],
            [
                'id' => 'nocodeci',
                'name' => 'NOCODE CI',
                'logo' => 'N'
            ]
        ];

        return response()->json([
            'success' => true,
            'data' => $stores
        ]);
    }
} 