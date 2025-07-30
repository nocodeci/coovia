<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class DashboardController extends Controller
{
    /**
     * Récupérer les statistiques du dashboard pour une boutique
     */
    public function getStoreStats($storeId)
    {
        try {
            $now = Carbon::now();
            $lastMonth = $now->copy()->subMonth();
            $lastHour = $now->copy()->subHour();
            $previousMonth = $now->copy()->subMonths(2);

            // Transactions du mois actuel
            $currentMonthTransactions = DB::table('payment_transactions')
                ->where('store_id', $storeId)
                ->where('created_at', '>=', $lastMonth)
                ->get();

            // Transactions du mois précédent
            $previousMonthTransactions = DB::table('payment_transactions')
                ->where('store_id', $storeId)
                ->where('created_at', '>=', $previousMonth)
                ->where('created_at', '<', $lastMonth)
                ->get();

            // Revenus totaux (paiements réussis uniquement)
            $currentMonthRevenue = $currentMonthTransactions
                ->where('status', 'completed')
                ->sum('amount');
            
            $previousMonthRevenue = $previousMonthTransactions
                ->where('status', 'completed')
                ->sum('amount');
            
            $revenueGrowth = $previousMonthRevenue > 0 
                ? (($currentMonthRevenue - $previousMonthRevenue) / $previousMonthRevenue) * 100 
                : 100;

            // Total des transactions
            $currentMonthTotal = $currentMonthTransactions->count();
            $previousMonthTotal = $previousMonthTransactions->count();
            $totalGrowth = $previousMonthTotal > 0 
                ? (($currentMonthTotal - $previousMonthTotal) / $previousMonthTotal) * 100 
                : 100;

            // Ventes réussies
            $currentMonthSales = $currentMonthTransactions->where('status', 'completed')->count();
            $previousMonthSales = $previousMonthTransactions->where('status', 'completed')->count();
            $salesGrowth = $previousMonthSales > 0 
                ? (($currentMonthSales - $previousMonthSales) / $previousMonthSales) * 100 
                : 100;

            // Transactions actives (pending + processing)
            $activeTransactions = DB::table('payment_transactions')
                ->where('store_id', $storeId)
                ->whereIn('status', ['pending', 'processing'])
                ->count();

            // Nouvelles transactions depuis la dernière heure
            $recentTransactions = DB::table('payment_transactions')
                ->where('store_id', $storeId)
                ->where('created_at', '>=', $lastHour)
                ->count();

            // Données pour le graphique des revenus (30 derniers jours)
            $revenueChartData = DB::table('payment_transactions')
                ->where('store_id', $storeId)
                ->where('status', 'completed')
                ->where('created_at', '>=', $now->copy()->subDays(30))
                ->selectRaw('DATE(created_at) as date, SUM(amount) as revenus')
                ->groupBy('date')
                ->orderBy('date')
                ->get()
                ->map(function ($item) {
                    return [
                        'date' => $item->date,
                        'revenus' => (float) $item->revenus
                    ];
                });

            // Remplir les jours manquants avec 0
            $chartData = [];
            for ($i = 29; $i >= 0; $i--) {
                $date = $now->copy()->subDays($i)->format('Y-m-d');
                $existingData = $revenueChartData->where('date', $date)->first();
                $chartData[] = [
                    'date' => $date,
                    'revenus' => $existingData ? $existingData['revenus'] : 0
                ];
            }

            // Ventes récentes (10 dernières)
            $recentSales = DB::table('payment_transactions as pt')
                ->join('orders as o', 'pt.order_id', '=', 'o.id')
                ->join('customers as c', 'o.customer_id', '=', 'c.id')
                ->where('pt.store_id', $storeId)
                ->where('pt.status', 'completed')
                ->select([
                    'pt.id',
                    'pt.amount',
                    'pt.created_at',
                    'c.first_name',
                    'c.last_name',
                    'c.email',
                    'o.order_number'
                ])
                ->orderBy('pt.created_at', 'desc')
                ->limit(10)
                ->get();

            return response()->json([
                'success' => true,
                'data' => [
                    'stats' => [
                        'revenue' => [
                            'current' => $currentMonthRevenue,
                            'growth' => round($revenueGrowth, 1)
                        ],
                        'subscriptions' => [
                            'current' => $currentMonthTotal,
                            'growth' => round($totalGrowth, 1)
                        ],
                        'sales' => [
                            'current' => $currentMonthSales,
                            'growth' => round($salesGrowth, 1)
                        ],
                        'active' => [
                            'current' => $activeTransactions,
                            'recent' => $recentTransactions
                        ]
                    ],
                    'chartData' => $chartData,
                    'recentSales' => $recentSales
                ]
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
     * Récupérer les données pour le graphique des revenus
     */
    public function getRevenueChart($storeId, Request $request)
    {
        try {
            $timeRange = $request->get('timeRange', '30d');
            $now = Carbon::now();
            
            switch ($timeRange) {
                case '7d':
                    $startDate = $now->copy()->subDays(7);
                    break;
                case '30d':
                    $startDate = $now->copy()->subDays(30);
                    break;
                case '90d':
                    $startDate = $now->copy()->subDays(90);
                    break;
                default:
                    $startDate = $now->copy()->subDays(30);
            }

            $chartData = DB::table('payment_transactions')
                ->where('store_id', $storeId)
                ->where('status', 'completed')
                ->where('created_at', '>=', $startDate)
                ->selectRaw('DATE(created_at) as date, SUM(amount) as revenus')
                ->groupBy('date')
                ->orderBy('date')
                ->get()
                ->map(function ($item) {
                    return [
                        'date' => $item->date,
                        'revenus' => (float) $item->revenus
                    ];
                });

            return response()->json([
                'success' => true,
                'data' => $chartData
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des données du graphique',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}