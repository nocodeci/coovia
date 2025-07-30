-- Ajouter des données de test pour le dashboard
-- Clients de test
INSERT INTO public.customers (store_id, email, first_name, last_name, phone, total_spent, orders_count, created_at, updated_at) VALUES
(1, 'jean.dupont@email.com', 'Jean', 'Dupont', '+225 07 12 34 56 78', 45000, 2, NOW() - INTERVAL '30 days', NOW()),
(1, 'marie.martin@email.com', 'Marie', 'Martin', '+225 01 23 45 67 89', 32000, 1, NOW() - INTERVAL '25 days', NOW()),
(1, 'pierre.durand@email.com', 'Pierre', 'Durand', '+225 05 98 76 54 32', 78000, 3, NOW() - INTERVAL '20 days', NOW()),
(1, 'sophie.leroy@email.com', 'Sophie', 'Leroy', '+225 07 55 44 33 22', 125000, 4, NOW() - INTERVAL '15 days', NOW()),
(1, 'lucas.moreau@email.com', 'Lucas', 'Moreau', '+225 01 11 22 33 44', 95000, 2, NOW() - INTERVAL '10 days', NOW()),
(1, 'emma.petit@email.com', 'Emma', 'Petit', '+225 05 66 77 88 99', 67000, 1, NOW() - INTERVAL '5 days', NOW()),
(1, 'thomas.roux@email.com', 'Thomas', 'Roux', '+225 07 99 88 77 66', 89000, 3, NOW() - INTERVAL '3 days', NOW()),
(1, 'julie.lefevre@email.com', 'Julie', 'Lefevre', '+225 01 44 55 66 77', 156000, 5, NOW() - INTERVAL '2 days', NOW()),
(1, 'antoine.leroux@email.com', 'Antoine', 'Leroux', '+225 05 33 44 55 66', 112000, 2, NOW() - INTERVAL '1 day', NOW()),
(1, 'camille.duval@email.com', 'Camille', 'Duval', '+225 07 22 33 44 55', 234000, 6, NOW() - INTERVAL '12 hours', NOW());

-- Commandes de test
INSERT INTO public.orders (store_id, customer_id, order_number, status, total_amount, currency, payment_status, shipping_address, billing_address, notes, created_at, updated_at) VALUES
(1, 1, 'ORD-001-001', 'completed', 25000, 'XOF', 'paid', '{"street": "Rue des Fleurs", "city": "Abidjan"}', '{"street": "Rue des Fleurs", "city": "Abidjan"}', 'Livraison express', NOW() - INTERVAL '30 days', NOW()),
(1, 1, 'ORD-001-002', 'completed', 20000, 'XOF', 'paid', '{"street": "Avenue de la Paix", "city": "Abidjan"}', '{"street": "Avenue de la Paix", "city": "Abidjan"}', '', NOW() - INTERVAL '25 days', NOW()),
(1, 2, 'ORD-001-003', 'completed', 32000, 'XOF', 'paid', '{"street": "Boulevard de la République", "city": "Abidjan"}', '{"street": "Boulevard de la République", "city": "Abidjan"}', '', NOW() - INTERVAL '20 days', NOW()),
(1, 3, 'ORD-001-004', 'completed', 45000, 'XOF', 'paid', '{"street": "Rue du Commerce", "city": "Abidjan"}', '{"street": "Rue du Commerce", "city": "Abidjan"}', 'Livraison gratuite', NOW() - INTERVAL '18 days', NOW()),
(1, 3, 'ORD-001-005', 'completed', 33000, 'XOF', 'paid', '{"street": "Avenue Noguès", "city": "Abidjan"}', '{"street": "Avenue Noguès", "city": "Abidjan"}', '', NOW() - INTERVAL '15 days', NOW()),
(1, 4, 'ORD-001-006', 'completed', 35000, 'XOF', 'paid', '{"street": "Rue des Banques", "city": "Abidjan"}', '{"street": "Rue des Banques", "city": "Abidjan"}', '', NOW() - INTERVAL '12 days', NOW()),
(1, 4, 'ORD-001-007', 'completed', 40000, 'XOF', 'paid', '{"street": "Boulevard Roume", "city": "Abidjan"}', '{"street": "Boulevard Roume", "city": "Abidjan"}', 'Cadeau', NOW() - INTERVAL '10 days', NOW()),
(1, 4, 'ORD-001-008', 'completed', 30000, 'XOF', 'paid', '{"street": "Avenue Chardy", "city": "Abidjan"}', '{"street": "Avenue Chardy", "city": "Abidjan"}', '', NOW() - INTERVAL '8 days', NOW()),
(1, 4, 'ORD-001-009', 'completed', 30000, 'XOF', 'paid', '{"street": "Rue du Plateau", "city": "Abidjan"}', '{"street": "Rue du Plateau", "city": "Abidjan"}', '', NOW() - INTERVAL '6 days', NOW()),
(1, 5, 'ORD-001-010', 'completed', 55000, 'XOF', 'paid', '{"street": "Boulevard de Marseille", "city": "Abidjan"}', '{"street": "Boulevard de Marseille", "city": "Abidjan"}', 'Livraison express', NOW() - INTERVAL '5 days', NOW()),
(1, 5, 'ORD-001-011', 'completed', 40000, 'XOF', 'paid', '{"street": "Avenue 16", "city": "Abidjan"}', '{"street": "Avenue 16", "city": "Abidjan"}', '', NOW() - INTERVAL '4 days', NOW()),
(1, 6, 'ORD-001-012', 'completed', 67000, 'XOF', 'paid', '{"street": "Rue des Jardins", "city": "Abidjan"}', '{"street": "Rue des Jardins", "city": "Abidjan"}', '', NOW() - INTERVAL '3 days', NOW()),
(1, 7, 'ORD-001-013', 'completed', 35000, 'XOF', 'paid', '{"street": "Boulevard de la Corniche", "city": "Abidjan"}', '{"street": "Boulevard de la Corniche", "city": "Abidjan"}', '', NOW() - INTERVAL '2 days', NOW()),
(1, 7, 'ORD-001-014', 'completed', 28000, 'XOF', 'paid', '{"street": "Avenue des Banques", "city": "Abidjan"}', '{"street": "Avenue des Banques", "city": "Abidjan"}', '', NOW() - INTERVAL '2 days', NOW()),
(1, 7, 'ORD-001-015', 'completed', 26000, 'XOF', 'paid', '{"street": "Rue du Commerce", "city": "Abidjan"}', '{"street": "Rue du Commerce", "city": "Abidjan"}', '', NOW() - INTERVAL '1 day', NOW()),
(1, 8, 'ORD-001-016', 'completed', 45000, 'XOF', 'paid', '{"street": "Boulevard de la République", "city": "Abidjan"}', '{"street": "Boulevard de la République", "city": "Abidjan"}', 'Livraison express', NOW() - INTERVAL '1 day', NOW()),
(1, 8, 'ORD-001-017', 'completed', 38000, 'XOF', 'paid', '{"street": "Avenue Noguès", "city": "Abidjan"}', '{"street": "Avenue Noguès", "city": "Abidjan"}', '', NOW() - INTERVAL '1 day', NOW()),
(1, 8, 'ORD-001-018', 'completed', 42000, 'XOF', 'paid', '{"street": "Rue des Fleurs", "city": "Abidjan"}', '{"street": "Rue des Fleurs", "city": "Abidjan"}', '', NOW() - INTERVAL '12 hours', NOW()),
(1, 8, 'ORD-001-019', 'completed', 31000, 'XOF', 'paid', '{"street": "Boulevard Roume", "city": "Abidjan"}', '{"street": "Boulevard Roume", "city": "Abidjan"}', '', NOW() - INTERVAL '12 hours', NOW()),
(1, 8, 'ORD-001-020', 'completed', 29000, 'XOF', 'paid', '{"street": "Avenue Chardy", "city": "Abidjan"}', '{"street": "Avenue Chardy", "city": "Abidjan"}', '', NOW() - INTERVAL '6 hours', NOW()),
(1, 9, 'ORD-001-021', 'completed', 56000, 'XOF', 'paid', '{"street": "Rue du Plateau", "city": "Abidjan"}', '{"street": "Rue du Plateau", "city": "Abidjan"}', '', NOW() - INTERVAL '6 hours', NOW()),
(1, 9, 'ORD-001-022', 'completed', 56000, 'XOF', 'paid', '{"street": "Boulevard de Marseille", "city": "Abidjan"}', '{"street": "Boulevard de Marseille", "city": "Abidjan"}', '', NOW() - INTERVAL '4 hours', NOW()),
(1, 10, 'ORD-001-023', 'completed', 45000, 'XOF', 'paid', '{"street": "Avenue 16", "city": "Abidjan"}', '{"street": "Avenue 16", "city": "Abidjan"}', 'Livraison express', NOW() - INTERVAL '3 hours', NOW()),
(1, 10, 'ORD-001-024', 'completed', 38000, 'XOF', 'paid', '{"street": "Rue des Jardins", "city": "Abidjan"}', '{"street": "Rue des Jardins", "city": "Abidjan"}', '', NOW() - INTERVAL '2 hours', NOW()),
(1, 10, 'ORD-001-025', 'completed', 42000, 'XOF', 'paid', '{"street": "Boulevard de la Corniche", "city": "Abidjan"}', '{"street": "Boulevard de la Corniche", "city": "Abidjan"}', '', NOW() - INTERVAL '1 hour', NOW()),
(1, 10, 'ORD-001-026', 'completed', 35000, 'XOF', 'paid', '{"street": "Avenue des Banques", "city": "Abidjan"}', '{"street": "Avenue des Banques", "city": "Abidjan"}', '', NOW() - INTERVAL '30 minutes', NOW()),
(1, 10, 'ORD-001-027', 'completed', 29000, 'XOF', 'paid', '{"street": "Rue du Commerce", "city": "Abidjan"}', '{"street": "Rue du Commerce", "city": "Abidjan"}', '', NOW() - INTERVAL '15 minutes', NOW()),
(1, 10, 'ORD-001-028', 'completed', 31000, 'XOF', 'paid', '{"street": "Boulevard de la République", "city": "Abidjan"}', '{"street": "Boulevard de la République", "city": "Abidjan"}', '', NOW() - INTERVAL '5 minutes', NOW());

-- Transactions de paiement de test (pour le dashboard)
INSERT INTO public.payment_transactions (store_id, order_id, gateway_id, transaction_id, gateway_transaction_id, amount, currency, status, gateway_response, metadata, processed_at, created_at, updated_at) VALUES
-- Transactions du mois actuel (succès)
(1, 1, 1, 'TXN-001-001', 'PS-001-001', 25000, 'XOF', 'completed', '{"status": "success", "gateway": "paystack"}', '{"payment_method": "card"}', NOW() - INTERVAL '30 days', NOW() - INTERVAL '30 days', NOW()),
(1, 2, 2, 'TXN-001-002', 'FLW-001-001', 20000, 'XOF', 'completed', '{"status": "success", "gateway": "flutterwave"}', '{"payment_method": "mobile_money"}', NOW() - INTERVAL '25 days', NOW() - INTERVAL '25 days', NOW()),
(1, 3, 3, 'TXN-001-003', 'CP-001-001', 32000, 'XOF', 'completed', '{"status": "success", "gateway": "cinetpay"}', '{"payment_method": "orange_money"}', NOW() - INTERVAL '20 days', NOW() - INTERVAL '20 days', NOW()),
(1, 4, 1, 'TXN-001-004', 'PS-001-002', 45000, 'XOF', 'completed', '{"status": "success", "gateway": "paystack"}', '{"payment_method": "card"}', NOW() - INTERVAL '18 days', NOW() - INTERVAL '18 days', NOW()),
(1, 5, 2, 'TXN-001-005', 'FLW-001-002', 33000, 'XOF', 'completed', '{"status": "success", "gateway": "flutterwave"}', '{"payment_method": "mobile_money"}', NOW() - INTERVAL '15 days', NOW() - INTERVAL '15 days', NOW()),
(1, 6, 3, 'TXN-001-006', 'CP-001-002', 35000, 'XOF', 'completed', '{"status": "success", "gateway": "cinetpay"}', '{"payment_method": "mtn_mobile_money"}', NOW() - INTERVAL '12 days', NOW() - INTERVAL '12 days', NOW()),
(1, 7, 1, 'TXN-001-007', 'PS-001-003', 40000, 'XOF', 'completed', '{"status": "success", "gateway": "paystack"}', '{"payment_method": "card"}', NOW() - INTERVAL '10 days', NOW() - INTERVAL '10 days', NOW()),
(1, 8, 2, 'TXN-001-008', 'FLW-001-003', 30000, 'XOF', 'completed', '{"status": "success", "gateway": "flutterwave"}', '{"payment_method": "mobile_money"}', NOW() - INTERVAL '8 days', NOW() - INTERVAL '8 days', NOW()),
(1, 9, 3, 'TXN-001-009', 'CP-001-003', 30000, 'XOF', 'completed', '{"status": "success", "gateway": "cinetpay"}', '{"payment_method": "moov_money"}', NOW() - INTERVAL '6 days', NOW() - INTERVAL '6 days', NOW()),
(1, 10, 1, 'TXN-001-010', 'PS-001-004', 55000, 'XOF', 'completed', '{"status": "success", "gateway": "paystack"}', '{"payment_method": "card"}', NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days', NOW()),
(1, 11, 2, 'TXN-001-011', 'FLW-001-004', 40000, 'XOF', 'completed', '{"status": "success", "gateway": "flutterwave"}', '{"payment_method": "mobile_money"}', NOW() - INTERVAL '4 days', NOW() - INTERVAL '4 days', NOW()),
(1, 12, 3, 'TXN-001-012', 'CP-001-004', 67000, 'XOF', 'completed', '{"status": "success", "gateway": "cinetpay"}', '{"payment_method": "wave"}', NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days', NOW()),
(1, 13, 1, 'TXN-001-013', 'PS-001-005', 35000, 'XOF', 'completed', '{"status": "success", "gateway": "paystack"}', '{"payment_method": "card"}', NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days', NOW()),
(1, 14, 2, 'TXN-001-014', 'FLW-001-005', 28000, 'XOF', 'completed', '{"status": "success", "gateway": "flutterwave"}', '{"payment_method": "mobile_money"}', NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days', NOW()),
(1, 15, 3, 'TXN-001-015', 'CP-001-005', 26000, 'XOF', 'completed', '{"status": "success", "gateway": "cinetpay"}', '{"payment_method": "orange_money"}', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day', NOW()),
(1, 16, 1, 'TXN-001-016', 'PS-001-006', 45000, 'XOF', 'completed', '{"status": "success", "gateway": "paystack"}', '{"payment_method": "card"}', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day', NOW()),
(1, 17, 2, 'TXN-001-017', 'FLW-001-006', 38000, 'XOF', 'completed', '{"status": "success", "gateway": "flutterwave"}', '{"payment_method": "mobile_money"}', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day', NOW()),
(1, 18, 3, 'TXN-001-018', 'CP-001-006', 42000, 'XOF', 'completed', '{"status": "success", "gateway": "cinetpay"}', '{"payment_method": "mtn_mobile_money"}', NOW() - INTERVAL '12 hours', NOW() - INTERVAL '12 hours', NOW()),
(1, 19, 1, 'TXN-001-019', 'PS-001-007', 31000, 'XOF', 'completed', '{"status": "success", "gateway": "paystack"}', '{"payment_method": "card"}', NOW() - INTERVAL '12 hours', NOW() - INTERVAL '12 hours', NOW()),
(1, 20, 2, 'TXN-001-020', 'FLW-001-007', 29000, 'XOF', 'completed', '{"status": "success", "gateway": "flutterwave"}', '{"payment_method": "mobile_money"}', NOW() - INTERVAL '6 hours', NOW() - INTERVAL '6 hours', NOW()),
(1, 21, 3, 'TXN-001-021', 'CP-001-007', 56000, 'XOF', 'completed', '{"status": "success", "gateway": "cinetpay"}', '{"payment_method": "moov_money"}', NOW() - INTERVAL '6 hours', NOW() - INTERVAL '6 hours', NOW()),
(1, 22, 1, 'TXN-001-022', 'PS-001-008', 56000, 'XOF', 'completed', '{"status": "success", "gateway": "paystack"}', '{"payment_method": "card"}', NOW() - INTERVAL '4 hours', NOW() - INTERVAL '4 hours', NOW()),
(1, 23, 2, 'TXN-001-023', 'FLW-001-008', 45000, 'XOF', 'completed', '{"status": "success", "gateway": "flutterwave"}', '{"payment_method": "mobile_money"}', NOW() - INTERVAL '3 hours', NOW() - INTERVAL '3 hours', NOW()),
(1, 24, 3, 'TXN-001-024', 'CP-001-008', 38000, 'XOF', 'completed', '{"status": "success", "gateway": "cinetpay"}', '{"payment_method": "wave"}', NOW() - INTERVAL '2 hours', NOW() - INTERVAL '2 hours', NOW()),
(1, 25, 1, 'TXN-001-025', 'PS-001-009', 42000, 'XOF', 'completed', '{"status": "success", "gateway": "paystack"}', '{"payment_method": "card"}', NOW() - INTERVAL '1 hour', NOW() - INTERVAL '1 hour', NOW()),
(1, 26, 2, 'TXN-001-026', 'FLW-001-009', 35000, 'XOF', 'completed', '{"status": "success", "gateway": "flutterwave"}', '{"payment_method": "mobile_money"}', NOW() - INTERVAL '30 minutes', NOW() - INTERVAL '30 minutes', NOW()),
(1, 27, 3, 'TXN-001-027', 'CP-001-009', 29000, 'XOF', 'completed', '{"status": "success", "gateway": "cinetpay"}', '{"payment_method": "orange_money"}', NOW() - INTERVAL '15 minutes', NOW() - INTERVAL '15 minutes', NOW()),
(1, 28, 1, 'TXN-001-028', 'PS-001-010', 31000, 'XOF', 'completed', '{"status": "success", "gateway": "paystack"}', '{"payment_method": "card"}', NOW() - INTERVAL '5 minutes', NOW() - INTERVAL '5 minutes', NOW()),

-- Transactions en attente (pour les statistiques actives)
(1, NULL, 1, 'TXN-001-029', 'PS-001-011', 25000, 'XOF', 'pending', '{"status": "pending", "gateway": "paystack"}', '{"payment_method": "card"}', NULL, NOW() - INTERVAL '2 hours', NOW()),
(1, NULL, 2, 'TXN-001-030', 'FLW-001-010', 18000, 'XOF', 'pending', '{"status": "pending", "gateway": "flutterwave"}', '{"payment_method": "mobile_money"}', NULL, NOW() - INTERVAL '1 hour', NOW()),
(1, NULL, 3, 'TXN-001-031', 'CP-001-010', 32000, 'XOF', 'processing', '{"status": "processing", "gateway": "cinetpay"}', '{"payment_method": "mtn_mobile_money"}', NULL, NOW() - INTERVAL '30 minutes', NOW()),
(1, NULL, 1, 'TXN-001-032', 'PS-001-012', 45000, 'XOF', 'pending', '{"status": "pending", "gateway": "paystack"}', '{"payment_method": "card"}', NULL, NOW() - INTERVAL '15 minutes', NOW()),
(1, NULL, 2, 'TXN-001-033', 'FLW-001-011', 28000, 'XOF', 'processing', '{"status": "processing", "gateway": "flutterwave"}', '{"payment_method": "mobile_money"}', NULL, NOW() - INTERVAL '10 minutes', NOW()),

-- Transactions échouées (pour montrer la diversité)
(1, NULL, 3, 'TXN-001-034', 'CP-001-011', 15000, 'XOF', 'failed', '{"status": "failed", "gateway": "cinetpay", "reason": "insufficient_funds"}', '{"payment_method": "orange_money"}', NULL, NOW() - INTERVAL '1 day', NOW()),
(1, NULL, 1, 'TXN-001-035', 'PS-001-013', 22000, 'XOF', 'failed', '{"status": "failed", "gateway": "paystack", "reason": "card_declined"}', '{"payment_method": "card"}', NULL, NOW() - INTERVAL '2 days', NOW()); 