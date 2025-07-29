<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Store;
use Illuminate\Http\Request;
use Carbon\Carbon;

class DashboardController extends Controller
{
    /**
     * Obtenir les statistiques du dashboard pour une boutique spécifique
     */
    public function storeStats(Request $request, Store $store)
    {
        try {
            // Vérifier que l'utilisateur est propriétaire de la boutique
            if ($store->owner_id !== $request->user()->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Accès non autorisé à cette boutique',
                    'error' => 'unauthorized'
                ], 403);
            }

            // Données mockées pour l'instant
            $mockData = [
                'store' => [
                    'id' => $store->id,
                    'name' => $store->name,
                    'description' => $store->description,
                    'logo' => $store->logo,
                    'status' => $store->status,
                    'category' => $store->category,
                    'contact' => $store->contact,
                    'address' => $store->address,
                    'settings' => $store->settings,
                    'created_at' => $store->created_at,
                    'updated_at' => $store->updated_at,
                ],
                'stats' => [
                    'revenue' => [
                        'current' => 1500000,
                        'growth' => 12.5,
                    ],
                    'orders' => [
                        'current' => 45,
                        'growth' => 8.3,
                    ],
                    'sales' => [
                        'current' => 38,
                        'growth' => 15.2,
                    ],
                    'active' => [
                        'current' => 7,
                        'recent' => 3,
                    ],
                ],
                'overview' => [
                    'totalProducts' => 125,
                    'totalOrders' => 234,
                    'totalRevenue' => 8750000,
                    'totalCustomers' => 89,
                    'conversionRate' => 3.2,
                    'averageOrderValue' => 37400,
                ],
            ];

            return response()->json([
                'success' => true,
                'message' => 'Statistiques récupérées avec succès',
                'data' => $mockData
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des statistiques',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtenir les commandes récentes pour une boutique
     */
    public function recentOrders(Request $request, Store $store)
    {
        try {
            // Vérifier que l'utilisateur est propriétaire de la boutique
            if ($store->owner_id !== $request->user()->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Accès non autorisé à cette boutique',
                    'error' => 'unauthorized'
                ], 403);
            }

            // Données mockées pour l'instant
            $mockOrders = [
                [
                    'id' => 1,
                    'customer_name' => 'Jean Dupont',
                    'status' => 'completed',
                    'payment_status' => 'paid',
                    'total' => 45000,
                    'payment_gateway' => 'Orange Money',
                    'payment_method' => 'Mobile Money',
                    'created_at' => now()->subHours(2),
                ],
                [
                    'id' => 2,
                    'customer_name' => 'Marie Martin',
                    'status' => 'processing',
                    'payment_status' => 'paid',
                    'total' => 32000,
                    'payment_gateway' => 'Moov Money',
                    'payment_method' => 'Mobile Money',
                    'created_at' => now()->subHours(4),
                ],
                [
                    'id' => 3,
                    'customer_name' => 'Pierre Durand',
                    'status' => 'completed',
                    'payment_status' => 'paid',
                    'total' => 78000,
                    'payment_gateway' => 'CinetPay',
                    'payment_method' => 'Carte Bancaire',
                    'created_at' => now()->subHours(6),
                ],
            ];

            return response()->json([
                'success' => true,
                'message' => 'Commandes récentes récupérées avec succès',
                'data' => $mockOrders
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des commandes récentes',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtenir les statistiques de vente par période
     */
    public function salesChart(Request $request, Store $store)
    {
        try {
            // Vérifier que l'utilisateur est propriétaire de la boutique
            if ($store->owner_id !== $request->user()->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Accès non autorisé à cette boutique',
                    'error' => 'unauthorized'
                ], 403);
            }

            // Données mockées pour l'instant
            $mockSales = [
                ['date' => '2025-07-25', 'orders' => 12, 'revenue' => 450000],
                ['date' => '2025-07-26', 'orders' => 15, 'revenue' => 520000],
                ['date' => '2025-07-27', 'orders' => 8, 'revenue' => 280000],
                ['date' => '2025-07-28', 'orders' => 20, 'revenue' => 750000],
                ['date' => '2025-07-29', 'orders' => 18, 'revenue' => 680000],
            ];

            return response()->json([
                'success' => true,
                'message' => 'Données de vente récupérées avec succès',
                'data' => $mockSales
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des données de vente',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}