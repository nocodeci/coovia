<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class DashboardTestDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $now = Carbon::now();

        // Ajouter des clients de test
        $customers = [
            ['store_id' => 1, 'email' => 'jean.dupont@email.com', 'first_name' => 'Jean', 'last_name' => 'Dupont', 'phone' => '+225 07 12 34 56 78', 'total_spent' => 45000, 'orders_count' => 2, 'created_at' => $now->copy()->subDays(30)],
            ['store_id' => 1, 'email' => 'marie.martin@email.com', 'first_name' => 'Marie', 'last_name' => 'Martin', 'phone' => '+225 01 23 45 67 89', 'total_spent' => 32000, 'orders_count' => 1, 'created_at' => $now->copy()->subDays(25)],
            ['store_id' => 1, 'email' => 'pierre.durand@email.com', 'first_name' => 'Pierre', 'last_name' => 'Durand', 'phone' => '+225 05 98 76 54 32', 'total_spent' => 78000, 'orders_count' => 3, 'created_at' => $now->copy()->subDays(20)],
            ['store_id' => 1, 'email' => 'sophie.leroy@email.com', 'first_name' => 'Sophie', 'last_name' => 'Leroy', 'phone' => '+225 07 55 44 33 22', 'total_spent' => 125000, 'orders_count' => 4, 'created_at' => $now->copy()->subDays(15)],
            ['store_id' => 1, 'email' => 'lucas.moreau@email.com', 'first_name' => 'Lucas', 'last_name' => 'Moreau', 'phone' => '+225 01 11 22 33 44', 'total_spent' => 95000, 'orders_count' => 2, 'created_at' => $now->copy()->subDays(10)],
            ['store_id' => 1, 'email' => 'emma.petit@email.com', 'first_name' => 'Emma', 'last_name' => 'Petit', 'phone' => '+225 05 66 77 88 99', 'total_spent' => 67000, 'orders_count' => 1, 'created_at' => $now->copy()->subDays(5)],
            ['store_id' => 1, 'email' => 'thomas.roux@email.com', 'first_name' => 'Thomas', 'last_name' => 'Roux', 'phone' => '+225 07 99 88 77 66', 'total_spent' => 89000, 'orders_count' => 3, 'created_at' => $now->copy()->subDays(3)],
            ['store_id' => 1, 'email' => 'julie.leroux@email.com', 'first_name' => 'Julie', 'last_name' => 'Lefevre', 'phone' => '+225 01 44 55 66 77', 'total_spent' => 156000, 'orders_count' => 5, 'created_at' => $now->copy()->subDays(2)],
            ['store_id' => 1, 'email' => 'antoine.leroux@email.com', 'first_name' => 'Antoine', 'last_name' => 'Leroux', 'phone' => '+225 05 33 44 55 66', 'total_spent' => 112000, 'orders_count' => 2, 'created_at' => $now->copy()->subDays(1)],
            ['store_id' => 1, 'email' => 'camille.duval@email.com', 'first_name' => 'Camille', 'last_name' => 'Duval', 'phone' => '+225 07 22 33 44 55', 'total_spent' => 234000, 'orders_count' => 6, 'created_at' => $now->copy()->subHours(12)],
        ];

        foreach ($customers as $customer) {
            DB::table('customers')->updateOrInsert(
                ['store_id' => $customer['store_id'], 'email' => $customer['email']],
                array_merge($customer, [
                    'updated_at' => $customer['created_at']
                ])
            );
        }

        // Ajouter des commandes de test
        $orders = [
            ['store_id' => 1, 'customer_id' => 1, 'order_number' => 'ORD-001-001', 'status' => 'delivered', 'total_amount' => 25000, 'currency' => 'XOF', 'financial_status' => 'paid', 'created_at' => $now->copy()->subDays(30)],
            ['store_id' => 1, 'customer_id' => 1, 'order_number' => 'ORD-001-002', 'status' => 'delivered', 'total_amount' => 20000, 'currency' => 'XOF', 'financial_status' => 'paid', 'created_at' => $now->copy()->subDays(25)],
            ['store_id' => 1, 'customer_id' => 2, 'order_number' => 'ORD-001-003', 'status' => 'delivered', 'total_amount' => 32000, 'currency' => 'XOF', 'financial_status' => 'paid', 'created_at' => $now->copy()->subDays(20)],
            ['store_id' => 1, 'customer_id' => 3, 'order_number' => 'ORD-001-004', 'status' => 'delivered', 'total_amount' => 45000, 'currency' => 'XOF', 'financial_status' => 'paid', 'created_at' => $now->copy()->subDays(18)],
            ['store_id' => 1, 'customer_id' => 3, 'order_number' => 'ORD-001-005', 'status' => 'delivered', 'total_amount' => 33000, 'currency' => 'XOF', 'financial_status' => 'paid', 'created_at' => $now->copy()->subDays(15)],
            ['store_id' => 1, 'customer_id' => 4, 'order_number' => 'ORD-001-006', 'status' => 'delivered', 'total_amount' => 35000, 'currency' => 'XOF', 'financial_status' => 'paid', 'created_at' => $now->copy()->subDays(12)],
            ['store_id' => 1, 'customer_id' => 4, 'order_number' => 'ORD-001-007', 'status' => 'delivered', 'total_amount' => 40000, 'currency' => 'XOF', 'financial_status' => 'paid', 'created_at' => $now->copy()->subDays(10)],
            ['store_id' => 1, 'customer_id' => 4, 'order_number' => 'ORD-001-008', 'status' => 'delivered', 'total_amount' => 30000, 'currency' => 'XOF', 'financial_status' => 'paid', 'created_at' => $now->copy()->subDays(8)],
            ['store_id' => 1, 'customer_id' => 4, 'order_number' => 'ORD-001-009', 'status' => 'delivered', 'total_amount' => 30000, 'currency' => 'XOF', 'financial_status' => 'paid', 'created_at' => $now->copy()->subDays(6)],
            ['store_id' => 1, 'customer_id' => 5, 'order_number' => 'ORD-001-010', 'status' => 'delivered', 'total_amount' => 55000, 'currency' => 'XOF', 'financial_status' => 'paid', 'created_at' => $now->copy()->subDays(5)],
            ['store_id' => 1, 'customer_id' => 5, 'order_number' => 'ORD-001-011', 'status' => 'delivered', 'total_amount' => 40000, 'currency' => 'XOF', 'financial_status' => 'paid', 'created_at' => $now->copy()->subDays(4)],
            ['store_id' => 1, 'customer_id' => 6, 'order_number' => 'ORD-001-012', 'status' => 'delivered', 'total_amount' => 67000, 'currency' => 'XOF', 'financial_status' => 'paid', 'created_at' => $now->copy()->subDays(3)],
            ['store_id' => 1, 'customer_id' => 7, 'order_number' => 'ORD-001-013', 'status' => 'delivered', 'total_amount' => 35000, 'currency' => 'XOF', 'financial_status' => 'paid', 'created_at' => $now->copy()->subDays(2)],
            ['store_id' => 1, 'customer_id' => 7, 'order_number' => 'ORD-001-014', 'status' => 'delivered', 'total_amount' => 28000, 'currency' => 'XOF', 'financial_status' => 'paid', 'created_at' => $now->copy()->subDays(2)],
            ['store_id' => 1, 'customer_id' => 7, 'order_number' => 'ORD-001-015', 'status' => 'delivered', 'total_amount' => 26000, 'currency' => 'XOF', 'financial_status' => 'paid', 'created_at' => $now->copy()->subDays(1)],
            ['store_id' => 1, 'customer_id' => 8, 'order_number' => 'ORD-001-016', 'status' => 'delivered', 'total_amount' => 45000, 'currency' => 'XOF', 'financial_status' => 'paid', 'created_at' => $now->copy()->subDays(1)],
            ['store_id' => 1, 'customer_id' => 8, 'order_number' => 'ORD-001-017', 'status' => 'delivered', 'total_amount' => 38000, 'currency' => 'XOF', 'financial_status' => 'paid', 'created_at' => $now->copy()->subDays(1)],
            ['store_id' => 1, 'customer_id' => 8, 'order_number' => 'ORD-001-018', 'status' => 'delivered', 'total_amount' => 42000, 'currency' => 'XOF', 'financial_status' => 'paid', 'created_at' => $now->copy()->subHours(12)],
            ['store_id' => 1, 'customer_id' => 8, 'order_number' => 'ORD-001-019', 'status' => 'delivered', 'total_amount' => 31000, 'currency' => 'XOF', 'financial_status' => 'paid', 'created_at' => $now->copy()->subHours(12)],
            ['store_id' => 1, 'customer_id' => 8, 'order_number' => 'ORD-001-020', 'status' => 'delivered', 'total_amount' => 29000, 'currency' => 'XOF', 'financial_status' => 'paid', 'created_at' => $now->copy()->subHours(6)],
            ['store_id' => 1, 'customer_id' => 9, 'order_number' => 'ORD-001-021', 'status' => 'delivered', 'total_amount' => 56000, 'currency' => 'XOF', 'financial_status' => 'paid', 'created_at' => $now->copy()->subHours(6)],
            ['store_id' => 1, 'customer_id' => 9, 'order_number' => 'ORD-001-022', 'status' => 'delivered', 'total_amount' => 56000, 'currency' => 'XOF', 'financial_status' => 'paid', 'created_at' => $now->copy()->subHours(4)],
            ['store_id' => 1, 'customer_id' => 10, 'order_number' => 'ORD-001-023', 'status' => 'delivered', 'total_amount' => 45000, 'currency' => 'XOF', 'financial_status' => 'paid', 'created_at' => $now->copy()->subHours(3)],
            ['store_id' => 1, 'customer_id' => 10, 'order_number' => 'ORD-001-024', 'status' => 'delivered', 'total_amount' => 38000, 'currency' => 'XOF', 'financial_status' => 'paid', 'created_at' => $now->copy()->subHours(2)],
            ['store_id' => 1, 'customer_id' => 10, 'order_number' => 'ORD-001-025', 'status' => 'delivered', 'total_amount' => 42000, 'currency' => 'XOF', 'financial_status' => 'paid', 'created_at' => $now->copy()->subHours(1)],
            ['store_id' => 1, 'customer_id' => 10, 'order_number' => 'ORD-001-026', 'status' => 'delivered', 'total_amount' => 35000, 'currency' => 'XOF', 'financial_status' => 'paid', 'created_at' => $now->copy()->subMinutes(30)],
            ['store_id' => 1, 'customer_id' => 10, 'order_number' => 'ORD-001-027', 'status' => 'delivered', 'total_amount' => 29000, 'currency' => 'XOF', 'financial_status' => 'paid', 'created_at' => $now->copy()->subMinutes(15)],
            ['store_id' => 1, 'customer_id' => 10, 'order_number' => 'ORD-001-028', 'status' => 'delivered', 'total_amount' => 31000, 'currency' => 'XOF', 'financial_status' => 'paid', 'created_at' => $now->copy()->subMinutes(5)],
        ];

        foreach ($orders as $order) {
            DB::table('orders')->updateOrInsert(
                ['store_id' => $order['store_id'], 'order_number' => $order['order_number']],
                array_merge($order, [
                    'shipping_address' => json_encode(['street' => 'Rue des Fleurs', 'city' => 'Abidjan']),
                    'billing_address' => json_encode(['street' => 'Rue des Fleurs', 'city' => 'Abidjan']),
                    'notes' => '',
                    'updated_at' => $order['created_at']
                ])
            );
        }

        // Récupérer les IDs des commandes créées
        $orderIds = DB::table('orders')
            ->where('store_id', 1)
            ->whereIn('order_number', array_column($orders, 'order_number'))
            ->pluck('id', 'order_number')
            ->toArray();

        // Ajouter des transactions de paiement de test
        $transactions = [
            // Transactions du mois actuel (succès)
            ['store_id' => 1, 'order_id' => $orderIds['ORD-001-001'] ?? null, 'gateway_id' => 1, 'transaction_id' => 'TXN-001-001', 'gateway_transaction_id' => 'PS-001-001', 'amount' => 25000, 'currency' => 'XOF', 'status' => 'completed', 'created_at' => $now->copy()->subDays(30)],
            ['store_id' => 1, 'order_id' => $orderIds['ORD-001-002'] ?? null, 'gateway_id' => 2, 'transaction_id' => 'TXN-001-002', 'gateway_transaction_id' => 'FLW-001-001', 'amount' => 20000, 'currency' => 'XOF', 'status' => 'completed', 'created_at' => $now->copy()->subDays(25)],
            ['store_id' => 1, 'order_id' => $orderIds['ORD-001-003'] ?? null, 'gateway_id' => 3, 'transaction_id' => 'TXN-001-003', 'gateway_transaction_id' => 'CP-001-001', 'amount' => 32000, 'currency' => 'XOF', 'status' => 'completed', 'created_at' => $now->copy()->subDays(20)],
            ['store_id' => 1, 'order_id' => $orderIds['ORD-001-004'] ?? null, 'gateway_id' => 1, 'transaction_id' => 'TXN-001-004', 'gateway_transaction_id' => 'PS-001-002', 'amount' => 45000, 'currency' => 'XOF', 'status' => 'completed', 'created_at' => $now->copy()->subDays(18)],
            ['store_id' => 1, 'order_id' => $orderIds['ORD-001-005'] ?? null, 'gateway_id' => 2, 'transaction_id' => 'TXN-001-005', 'gateway_transaction_id' => 'FLW-001-002', 'amount' => 33000, 'currency' => 'XOF', 'status' => 'completed', 'created_at' => $now->copy()->subDays(15)],
            ['store_id' => 1, 'order_id' => $orderIds['ORD-001-006'] ?? null, 'gateway_id' => 3, 'transaction_id' => 'TXN-001-006', 'gateway_transaction_id' => 'CP-001-002', 'amount' => 35000, 'currency' => 'XOF', 'status' => 'completed', 'created_at' => $now->copy()->subDays(12)],
            ['store_id' => 1, 'order_id' => $orderIds['ORD-001-007'] ?? null, 'gateway_id' => 1, 'transaction_id' => 'TXN-001-007', 'gateway_transaction_id' => 'PS-001-003', 'amount' => 40000, 'currency' => 'XOF', 'status' => 'completed', 'created_at' => $now->copy()->subDays(10)],
            ['store_id' => 1, 'order_id' => $orderIds['ORD-001-008'] ?? null, 'gateway_id' => 2, 'transaction_id' => 'TXN-001-008', 'gateway_transaction_id' => 'FLW-001-003', 'amount' => 30000, 'currency' => 'XOF', 'status' => 'completed', 'created_at' => $now->copy()->subDays(8)],
            ['store_id' => 1, 'order_id' => $orderIds['ORD-001-009'] ?? null, 'gateway_id' => 3, 'transaction_id' => 'TXN-001-009', 'gateway_transaction_id' => 'CP-001-003', 'amount' => 30000, 'currency' => 'XOF', 'status' => 'completed', 'created_at' => $now->copy()->subDays(6)],
            ['store_id' => 1, 'order_id' => $orderIds['ORD-001-010'] ?? null, 'gateway_id' => 1, 'transaction_id' => 'TXN-001-010', 'gateway_transaction_id' => 'PS-001-004', 'amount' => 55000, 'currency' => 'XOF', 'status' => 'completed', 'created_at' => $now->copy()->subDays(5)],
            ['store_id' => 1, 'order_id' => $orderIds['ORD-001-011'] ?? null, 'gateway_id' => 2, 'transaction_id' => 'TXN-001-011', 'gateway_transaction_id' => 'FLW-001-004', 'amount' => 40000, 'currency' => 'XOF', 'status' => 'completed', 'created_at' => $now->copy()->subDays(4)],
            ['store_id' => 1, 'order_id' => $orderIds['ORD-001-012'] ?? null, 'gateway_id' => 3, 'transaction_id' => 'TXN-001-012', 'gateway_transaction_id' => 'CP-001-004', 'amount' => 67000, 'currency' => 'XOF', 'status' => 'completed', 'created_at' => $now->copy()->subDays(3)],
            ['store_id' => 1, 'order_id' => $orderIds['ORD-001-013'] ?? null, 'gateway_id' => 1, 'transaction_id' => 'TXN-001-013', 'gateway_transaction_id' => 'PS-001-005', 'amount' => 35000, 'currency' => 'XOF', 'status' => 'completed', 'created_at' => $now->copy()->subDays(2)],
            ['store_id' => 1, 'order_id' => $orderIds['ORD-001-014'] ?? null, 'gateway_id' => 2, 'transaction_id' => 'TXN-001-014', 'gateway_transaction_id' => 'FLW-001-005', 'amount' => 28000, 'currency' => 'XOF', 'status' => 'completed', 'created_at' => $now->copy()->subDays(2)],
            ['store_id' => 1, 'order_id' => $orderIds['ORD-001-015'] ?? null, 'gateway_id' => 3, 'transaction_id' => 'TXN-001-015', 'gateway_transaction_id' => 'CP-001-005', 'amount' => 26000, 'currency' => 'XOF', 'status' => 'completed', 'created_at' => $now->copy()->subDays(1)],
            ['store_id' => 1, 'order_id' => $orderIds['ORD-001-016'] ?? null, 'gateway_id' => 1, 'transaction_id' => 'TXN-001-016', 'gateway_transaction_id' => 'PS-001-006', 'amount' => 45000, 'currency' => 'XOF', 'status' => 'completed', 'created_at' => $now->copy()->subDays(1)],
            ['store_id' => 1, 'order_id' => $orderIds['ORD-001-017'] ?? null, 'gateway_id' => 2, 'transaction_id' => 'TXN-001-017', 'gateway_transaction_id' => 'FLW-001-006', 'amount' => 38000, 'currency' => 'XOF', 'status' => 'completed', 'created_at' => $now->copy()->subDays(1)],
            ['store_id' => 1, 'order_id' => $orderIds['ORD-001-018'] ?? null, 'gateway_id' => 3, 'transaction_id' => 'TXN-001-018', 'gateway_transaction_id' => 'CP-001-006', 'amount' => 42000, 'currency' => 'XOF', 'status' => 'completed', 'created_at' => $now->copy()->subHours(12)],
            ['store_id' => 1, 'order_id' => $orderIds['ORD-001-019'] ?? null, 'gateway_id' => 1, 'transaction_id' => 'TXN-001-019', 'gateway_transaction_id' => 'PS-001-007', 'amount' => 31000, 'currency' => 'XOF', 'status' => 'completed', 'created_at' => $now->copy()->subHours(12)],
            ['store_id' => 1, 'order_id' => $orderIds['ORD-001-020'] ?? null, 'gateway_id' => 2, 'transaction_id' => 'TXN-001-020', 'gateway_transaction_id' => 'FLW-001-007', 'amount' => 29000, 'currency' => 'XOF', 'status' => 'completed', 'created_at' => $now->copy()->subHours(6)],
            ['store_id' => 1, 'order_id' => $orderIds['ORD-001-021'] ?? null, 'gateway_id' => 3, 'transaction_id' => 'TXN-001-021', 'gateway_transaction_id' => 'CP-001-007', 'amount' => 56000, 'currency' => 'XOF', 'status' => 'completed', 'created_at' => $now->copy()->subHours(6)],
            ['store_id' => 1, 'order_id' => $orderIds['ORD-001-022'] ?? null, 'gateway_id' => 1, 'transaction_id' => 'TXN-001-022', 'gateway_transaction_id' => 'PS-001-008', 'amount' => 56000, 'currency' => 'XOF', 'status' => 'completed', 'created_at' => $now->copy()->subHours(4)],
            ['store_id' => 1, 'order_id' => $orderIds['ORD-001-023'] ?? null, 'gateway_id' => 2, 'transaction_id' => 'TXN-001-023', 'gateway_transaction_id' => 'FLW-001-008', 'amount' => 45000, 'currency' => 'XOF', 'status' => 'completed', 'created_at' => $now->copy()->subHours(3)],
            ['store_id' => 1, 'order_id' => $orderIds['ORD-001-024'] ?? null, 'gateway_id' => 3, 'transaction_id' => 'TXN-001-024', 'gateway_transaction_id' => 'CP-001-008', 'amount' => 38000, 'currency' => 'XOF', 'status' => 'completed', 'created_at' => $now->copy()->subHours(2)],
            ['store_id' => 1, 'order_id' => $orderIds['ORD-001-025'] ?? null, 'gateway_id' => 1, 'transaction_id' => 'TXN-001-025', 'gateway_transaction_id' => 'PS-001-009', 'amount' => 42000, 'currency' => 'XOF', 'status' => 'completed', 'created_at' => $now->copy()->subHours(1)],
            ['store_id' => 1, 'order_id' => $orderIds['ORD-001-026'] ?? null, 'gateway_id' => 2, 'transaction_id' => 'TXN-001-026', 'gateway_transaction_id' => 'FLW-001-009', 'amount' => 35000, 'currency' => 'XOF', 'status' => 'completed', 'created_at' => $now->copy()->subMinutes(30)],
            ['store_id' => 1, 'order_id' => $orderIds['ORD-001-027'] ?? null, 'gateway_id' => 3, 'transaction_id' => 'TXN-001-027', 'gateway_transaction_id' => 'CP-001-009', 'amount' => 29000, 'currency' => 'XOF', 'status' => 'completed', 'created_at' => $now->copy()->subMinutes(15)],
            ['store_id' => 1, 'order_id' => $orderIds['ORD-001-028'] ?? null, 'gateway_id' => 1, 'transaction_id' => 'TXN-001-028', 'gateway_transaction_id' => 'PS-001-010', 'amount' => 31000, 'currency' => 'XOF', 'status' => 'completed', 'created_at' => $now->copy()->subMinutes(5)],

            // Transactions en attente (pour les statistiques actives)
            ['store_id' => 1, 'order_id' => null, 'gateway_id' => 1, 'transaction_id' => 'TXN-001-029', 'gateway_transaction_id' => 'PS-001-011', 'amount' => 25000, 'currency' => 'XOF', 'status' => 'pending', 'created_at' => $now->copy()->subHours(2)],
            ['store_id' => 1, 'order_id' => null, 'gateway_id' => 2, 'transaction_id' => 'TXN-001-030', 'gateway_transaction_id' => 'FLW-001-010', 'amount' => 18000, 'currency' => 'XOF', 'status' => 'pending', 'created_at' => $now->copy()->subHours(1)],
            ['store_id' => 1, 'order_id' => null, 'gateway_id' => 3, 'transaction_id' => 'TXN-001-031', 'gateway_transaction_id' => 'CP-001-010', 'amount' => 32000, 'currency' => 'XOF', 'status' => 'processing', 'created_at' => $now->copy()->subMinutes(30)],
            ['store_id' => 1, 'order_id' => null, 'gateway_id' => 1, 'transaction_id' => 'TXN-001-032', 'gateway_transaction_id' => 'PS-001-012', 'amount' => 45000, 'currency' => 'XOF', 'status' => 'pending', 'created_at' => $now->copy()->subMinutes(15)],
            ['store_id' => 1, 'order_id' => null, 'gateway_id' => 2, 'transaction_id' => 'TXN-001-033', 'gateway_transaction_id' => 'FLW-001-011', 'amount' => 28000, 'currency' => 'XOF', 'status' => 'processing', 'created_at' => $now->copy()->subMinutes(10)],

            // Transactions échouées (pour montrer la diversité)
            ['store_id' => 1, 'order_id' => null, 'gateway_id' => 3, 'transaction_id' => 'TXN-001-034', 'gateway_transaction_id' => 'CP-001-011', 'amount' => 15000, 'currency' => 'XOF', 'status' => 'failed', 'created_at' => $now->copy()->subDays(1)],
            ['store_id' => 1, 'order_id' => null, 'gateway_id' => 1, 'transaction_id' => 'TXN-001-035', 'gateway_transaction_id' => 'PS-001-013', 'amount' => 22000, 'currency' => 'XOF', 'status' => 'failed', 'created_at' => $now->copy()->subDays(2)],
        ];

        foreach ($transactions as $transaction) {
            DB::table('payment_transactions')->updateOrInsert(
                ['store_id' => $transaction['store_id'], 'transaction_id' => $transaction['transaction_id']],
                array_merge($transaction, [
                    'gateway_response' => json_encode(['status' => $transaction['status'], 'gateway' => 'test']),
                    'metadata' => json_encode(['payment_method' => 'test']),
                    'processed_at' => $transaction['status'] === 'completed' ? $transaction['created_at'] : null,
                    'updated_at' => $transaction['created_at']
                ])
            );
        }

        $this->command->info('Données de test du dashboard ajoutées avec succès !');
    }
} 