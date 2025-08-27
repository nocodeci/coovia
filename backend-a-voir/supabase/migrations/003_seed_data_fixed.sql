-- Nettoyer les données existantes dans l'ordre correct (contraintes de clés étrangères)
DELETE FROM public.payment_methods;
DELETE FROM public.payment_gateways;
DELETE FROM public.order_items;
DELETE FROM public.orders;
DELETE FROM public.customers;
DELETE FROM public.products;
DELETE FROM public.stores;
DELETE FROM public.login_attempts;
DELETE FROM public.mfa_tokens;
DELETE FROM public.users;

-- Réinitialiser les séquences
ALTER SEQUENCE users_id_seq RESTART WITH 1;
ALTER SEQUENCE stores_id_seq RESTART WITH 1;
ALTER SEQUENCE products_id_seq RESTART WITH 1;
ALTER SEQUENCE customers_id_seq RESTART WITH 1;
ALTER SEQUENCE orders_id_seq RESTART WITH 1;
ALTER SEQUENCE order_items_id_seq RESTART WITH 1;
ALTER SEQUENCE payment_gateways_id_seq RESTART WITH 1;
ALTER SEQUENCE payment_methods_id_seq RESTART WITH 1;
ALTER SEQUENCE payment_transactions_id_seq RESTART WITH 1;
ALTER SEQUENCE mfa_tokens_id_seq RESTART WITH 1;
ALTER SEQUENCE login_attempts_id_seq RESTART WITH 1;

-- Insert sample users FIRST
INSERT INTO public.users (name, email, password, phone, role, email_verified_at, created_at, updated_at) VALUES
('Admin User', 'admin@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '+225 07 12 34 56 78', 'admin', NOW(), NOW(), NOW()),
('John Doe', 'john@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '+225 01 23 45 67 89', 'user', NOW(), NOW(), NOW()),
('Marie Kouassi', 'marie@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '+225 05 12 34 56 78', 'user', NOW(), NOW(), NOW()),
('Pierre Diabaté', 'pierre@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '+225 07 98 76 54 32', 'user', NOW(), NOW(), NOW());

-- Insert sample stores AFTER users
INSERT INTO public.stores (owner_id, name, description, email, phone, address, settings, is_active, created_at, updated_at) VALUES
(1, 'Ma Boutique Premium', 'Boutique de vente en ligne de produits premium', 'contact@maboutique.com', '+225 07 12 34 56 78',
 '{"street": "Rue des Jardins, Cocody", "city": "Abidjan", "country": "Côte d''Ivoire", "postal_code": "01 BP 1234"}',
 '{"currency": "XOF", "language": "fr", "timezone": "Africa/Abidjan", "tax_rate": 18}',
 true, NOW(), NOW()),

(2, 'John Tech Store', 'Magasin de technologie de John Doe', 'john@johnstore.com', '+225 01 23 45 67 89',
 '{"street": "Boulevard Lagunaire, Marcory", "city": "Abidjan", "country": "Côte d''Ivoire", "postal_code": "01 BP 5678"}',
 '{"currency": "XOF", "language": "fr", "timezone": "Africa/Abidjan", "tax_rate": 18}',
 true, NOW(), NOW()),

(3, 'Marie Fashion', 'Boutique de mode féminine', 'marie@mariefashion.com', '+225 05 12 34 56 78',
 '{"street": "Rue de la Mode, Treichville", "city": "Abidjan", "country": "Côte d''Ivoire", "postal_code": "01 BP 9012"}',
 '{"currency": "XOF", "language": "fr", "timezone": "Africa/Abidjan", "tax_rate": 18}',
 true, NOW(), NOW());

-- Insert payment gateways AFTER stores exist
INSERT INTO public.payment_gateways (store_id, name, provider, config, is_active, is_test_mode, supported_currencies, created_at, updated_at) VALUES
-- Pour Ma Boutique Premium (store_id = 1)
(1, 'PayStack', 'paystack', '{"public_key": "pk_test_xxx", "secret_key": "sk_test_xxx"}', true, true, '["NGN", "USD", "GHS"]', NOW(), NOW()),
(1, 'Flutterwave', 'flutterwave', '{"public_key": "FLWPUBK_TEST-xxx", "secret_key": "FLWSECK_TEST-xxx"}', true, true, '["NGN", "USD", "GHS", "KES", "UGX", "TZS"]', NOW(), NOW()),
(1, 'CinetPay', 'cinetpay', '{"api_key": "xxx", "site_id": "xxx"}', true, true, '["XOF", "XAF", "GNF", "USD"]', NOW(), NOW()),

-- Pour John Tech Store (store_id = 2)
(2, 'FedaPay', 'fedapay', '{"public_key": "pk_sandbox_xxx", "secret_key": "sk_sandbox_xxx"}', true, true, '["XOF", "NGN", "USD"]', NOW(), NOW()),
(2, 'PayStack', 'paystack', '{"public_key": "pk_test_yyy", "secret_key": "sk_test_yyy"}', true, true, '["NGN", "USD", "GHS"]', NOW(), NOW()),

-- Pour Marie Fashion (store_id = 3)
(3, 'CinetPay', 'cinetpay', '{"api_key": "yyy", "site_id": "yyy"}', true, true, '["XOF", "XAF", "GNF", "USD"]', NOW(), NOW()),
(3, 'PayDunya', 'paydunya', '{"master_key": "xxx", "private_key": "xxx", "public_key": "xxx", "token": "xxx"}', false, true, '["XOF", "GHS", "USD"]', NOW(), NOW());

-- Insert payment methods AFTER payment gateways
INSERT INTO public.payment_methods (gateway_id, name, type, config, is_active, created_at, updated_at) VALUES
-- PayStack methods (gateway_id = 1)
(1, 'Carte bancaire', 'card', '{}', true, NOW(), NOW()),
(1, 'Virement bancaire', 'bank_transfer', '{}', true, NOW(), NOW()),
(1, 'USSD', 'ussd', '{}', true, NOW(), NOW()),

-- Flutterwave methods (gateway_id = 2)
(2, 'Carte bancaire', 'card', '{}', true, NOW(), NOW()),
(2, 'Mobile Money', 'mobile_money', '{}', true, NOW(), NOW()),
(2, 'Virement bancaire', 'bank_transfer', '{}', true, NOW(), NOW()),
(2, 'USSD', 'ussd', '{}', true, NOW(), NOW()),

-- CinetPay methods (gateway_id = 3)
(3, 'Orange Money', 'mobile_money', '{"provider": "orange"}', true, NOW(), NOW()),
(3, 'MTN Mobile Money', 'mobile_money', '{"provider": "mtn"}', true, NOW(), NOW()),
(3, 'Moov Money', 'mobile_money', '{"provider": "moov"}', true, NOW(), NOW()),
(3, 'Wave', 'mobile_money', '{"provider": "wave"}', true, NOW(), NOW()),
(3, 'Carte bancaire', 'card', '{}', true, NOW(), NOW()),

-- FedaPay methods (gateway_id = 4)
(4, 'Mobile Money', 'mobile_money', '{}', true, NOW(), NOW()),
(4, 'Carte bancaire', 'card', '{}', true, NOW(), NOW()),

-- PayStack methods pour John Tech Store (gateway_id = 5)
(5, 'Carte bancaire', 'card', '{}', true, NOW(), NOW()),
(5, 'Virement bancaire', 'bank_transfer', '{}', true, NOW(), NOW()),

-- CinetPay methods pour Marie Fashion (gateway_id = 6)
(6, 'Orange Money', 'mobile_money', '{"provider": "orange"}', true, NOW(), NOW()),
(6, 'MTN Mobile Money', 'mobile_money', '{"provider": "mtn"}', true, NOW(), NOW()),

-- PayDunya methods (gateway_id = 7)
(7, 'MTN Mobile Money', 'mobile_money', '{"provider": "mtn"}', true, NOW(), NOW()),
(7, 'Vodafone Cash', 'mobile_money', '{"provider": "vodafone"}', true, NOW(), NOW());

-- Insert sample products
INSERT INTO public.products (store_id, name, description, price, compare_price, sku, track_inventory, inventory_quantity, status, featured, created_at, updated_at) VALUES
-- Produits pour Ma Boutique Premium
(1, 'T-shirt Premium Blanc', 'T-shirt en coton bio blanc de qualité premium', 15000.00, 18000.00, 'TSH-WHT-001', true, 50, 'active', true, NOW(), NOW()),
(1, 'Jean Designer Bleu', 'Jean bleu délavé coupe droite de créateur', 35000.00, 42000.00, 'JEA-BLU-001', true, 25, 'active', false, NOW(), NOW()),
(1, 'Sneakers Limited Edition', 'Chaussures de sport édition limitée', 65000.00, 75000.00, 'SNK-LTD-001', true, 15, 'active', true, NOW(), NOW()),

-- Produits pour John Tech Store
(2, 'Smartphone Pro Max', 'Téléphone intelligent dernière génération avec 5G', 250000.00, 280000.00, 'PHN-PRO-001', true, 10, 'active', true, NOW(), NOW()),
(2, 'Écouteurs Sans Fil Pro', 'Écouteurs sans fil Bluetooth avec réduction de bruit', 45000.00, 55000.00, 'EAR-PRO-001', true, 30, 'active', false, NOW(), NOW()),
(2, 'Tablette 12 pouces', 'Tablette haute performance pour professionnels', 180000.00, 200000.00, 'TAB-PRO-001', true, 8, 'active', true, NOW(), NOW()),

-- Produits pour Marie Fashion
(3, 'Robe Africaine Élégante', 'Robe en wax authentique avec motifs traditionnels', 45000.00, 55000.00, 'ROB-AFR-001', true, 20, 'active', true, NOW(), NOW()),
(3, 'Sac à Main Cuir', 'Sac à main en cuir véritable fait main', 35000.00, 42000.00, 'SAC-CUI-001', true, 12, 'active', false, NOW(), NOW()),
(3, 'Bijoux Traditionnels', 'Ensemble de bijoux traditionnels africains', 25000.00, 30000.00, 'BIJ-TRA-001', true, 15, 'active', true, NOW(), NOW());

-- Insert sample customers
INSERT INTO public.customers (store_id, email, first_name, last_name, phone, addresses, created_at, updated_at) VALUES
-- Clients pour Ma Boutique Premium
(1, 'client1@example.com', 'Aminata', 'Koné', '+225 05 12 34 56 78',
 '[{"type": "home", "street": "Rue de la Paix, Marcory", "city": "Abidjan", "country": "Côte d''Ivoire", "is_default": true}]',
 NOW(), NOW()),
(1, 'client2@example.com', 'Seydou', 'Traoré', '+225 07 98 76 54 32',
 '[{"type": "home", "street": "Boulevard Lagunaire, Cocody", "city": "Abidjan", "country": "Côte d''Ivoire", "is_default": true}]',
 NOW(), NOW()),

-- Clients pour John Tech Store
(2, 'tech1@example.com', 'Fatou', 'Diabaté', '+225 01 11 22 33 44',
 '[{"type": "home", "street": "Rue de la Technologie, Plateau", "city": "Abidjan", "country": "Côte d''Ivoire", "is_default": true}]',
 NOW(), NOW()),
(2, 'tech2@example.com', 'Moussa', 'Sanogo', '+225 05 55 66 77 88',
 '[{"type": "home", "street": "Avenue de l''Innovation, Cocody", "city": "Abidjan", "country": "Côte d''Ivoire", "is_default": true}]',
 NOW(), NOW()),

-- Clients pour Marie Fashion
(3, 'fashion1@example.com', 'Aïcha', 'Ouattara', '+225 07 44 55 66 77',
 '[{"type": "home", "street": "Rue de la Mode, Treichville", "city": "Abidjan", "country": "Côte d''Ivoire", "is_default": true}]',
 NOW(), NOW());

-- Insert sample orders avec order_number généré automatiquement
INSERT INTO public.orders (store_id, customer_id, order_number, status, financial_status, currency, subtotal, tax_amount, shipping_amount, total_amount, customer_info, shipping_address, billing_address, created_at, updated_at) VALUES
-- Commandes pour Ma Boutique Premium
(1, 1, generate_order_number(1), 'delivered', 'paid', 'XOF', 15000.00, 2700.00, 2000.00, 19700.00,
 '{"first_name": "Aminata", "last_name": "Koné", "email": "client1@example.com", "phone": "+225 05 12 34 56 78"}',
 '{"first_name": "Aminata", "last_name": "Koné", "street": "Rue de la Paix, Marcory", "city": "Abidjan", "country": "Côte d''Ivoire", "phone": "+225 05 12 34 56 78"}',
 '{"first_name": "Aminata", "last_name": "Koné", "street": "Rue de la Paix, Marcory", "city": "Abidjan", "country": "Côte d''Ivoire", "phone": "+225 05 12 34 56 78"}',
 NOW() - INTERVAL '5 days', NOW() - INTERVAL '3 days'),

(1, 2, generate_order_number(1), 'processing', 'paid', 'XOF', 35000.00, 6300.00, 3000.00, 44300.00,
 '{"first_name": "Seydou", "last_name": "Traoré", "email": "client2@example.com", "phone": "+225 07 98 76 54 32"}',
 '{"first_name": "Seydou", "last_name": "Traoré", "street": "Boulevard Lagunaire, Cocody", "city": "Abidjan", "country": "Côte d''Ivoire", "phone": "+225 07 98 76 54 32"}',
 '{"first_name": "Seydou", "last_name": "Traoré", "street": "Boulevard Lagunaire, Cocody", "city": "Abidjan", "country": "Côte d''Ivoire", "phone": "+225 07 98 76 54 32"}',
 NOW() - INTERVAL '2 days', NOW() - INTERVAL '1 day'),

-- Commandes pour John Tech Store
(2, 3, generate_order_number(2), 'confirmed', 'paid', 'XOF', 250000.00, 45000.00, 5000.00, 300000.00,
 '{"first_name": "Fatou", "last_name": "Diabaté", "email": "tech1@example.com", "phone": "+225 01 11 22 33 44"}',
 '{"first_name": "Fatou", "last_name": "Diabaté", "street": "Rue de la Technologie, Plateau", "city": "Abidjan", "country": "Côte d''Ivoire", "phone": "+225 01 11 22 33 44"}',
 '{"first_name": "Fatou", "last_name": "Diabaté", "street": "Rue de la Technologie, Plateau", "city": "Abidjan", "country": "Côte d''Ivoire", "phone": "+225 01 11 22 33 44"}',
 NOW() - INTERVAL '1 day', NOW()),

-- Commandes pour Marie Fashion
(3, 5, generate_order_number(3), 'pending', 'pending', 'XOF', 45000.00, 8100.00, 2500.00, 55600.00,
 '{"first_name": "Aïcha", "last_name": "Ouattara", "email": "fashion1@example.com", "phone": "+225 07 44 55 66 77"}',
 '{"first_name": "Aïcha", "last_name": "Ouattara", "street": "Rue de la Mode, Treichville", "city": "Abidjan", "country": "Côte d''Ivoire", "phone": "+225 07 44 55 66 77"}',
 '{"first_name": "Aïcha", "last_name": "Ouattara", "street": "Rue de la Mode, Treichville", "city": "Abidjan", "country": "Côte d''Ivoire", "phone": "+225 07 44 55 66 77"}',
 NOW(), NOW());

-- Insert order items
INSERT INTO public.order_items (order_id, product_id, product_name, product_sku, quantity, price, total, product_data, created_at, updated_at) VALUES
-- Items pour la première commande
(1, 1, 'T-shirt Premium Blanc', 'TSH-WHT-001', 1, 15000.00, 15000.00, '{"color": "blanc", "size": "M"}', NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days'),

-- Items pour la deuxième commande
(2, 2, 'Jean Designer Bleu', 'JEA-BLU-001', 1, 35000.00, 35000.00, '{"color": "bleu", "size": "32"}', NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days'),

-- Items pour la troisième commande
(3, 4, 'Smartphone Pro Max', 'PHN-PRO-001', 1, 250000.00, 250000.00, '{"color": "noir", "storage": "256GB"}', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'),

-- Items pour la quatrième commande
(4, 7, 'Robe Africaine Élégante', 'ROB-AFR-001', 1, 45000.00, 45000.00, '{"pattern": "kente", "size": "L"}', NOW(), NOW());

-- Insert sample payment transactions
INSERT INTO public.payment_transactions (store_id, order_id, gateway_id, transaction_id, gateway_transaction_id, amount, currency, status, gateway_response, processed_at, created_at, updated_at) VALUES
-- Transaction pour la première commande (réussie)
(1, 1, 1, 'TXN_' || EXTRACT(EPOCH FROM NOW())::TEXT || '_1', 'PS_' || EXTRACT(EPOCH FROM NOW())::TEXT, 19700.00, 'XOF', 'completed',
 '{"status": "success", "reference": "PS_123456", "message": "Payment successful"}',
 NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days'),

-- Transaction pour la deuxième commande (réussie)
(1, 2, 2, 'TXN_' || EXTRACT(EPOCH FROM NOW())::TEXT || '_2', 'FLW_' || EXTRACT(EPOCH FROM NOW())::TEXT, 44300.00, 'XOF', 'completed',
 '{"status": "successful", "tx_ref": "FLW_789012", "message": "Payment completed"}',
 NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days'),

-- Transaction pour la troisième commande (réussie)
(2, 3, 4, 'TXN_' || EXTRACT(EPOCH FROM NOW())::TEXT || '_3', 'FEDA_' || EXTRACT(EPOCH FROM NOW())::TEXT, 300000.00, 'XOF', 'completed',
 '{"status": "approved", "reference": "FEDA_345678", "message": "Transaction approved"}',
 NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'),

-- Transaction pour la quatrième commande (en attente)
(3, 4, 6, 'TXN_' || EXTRACT(EPOCH FROM NOW())::TEXT || '_4', NULL, 55600.00, 'XOF', 'pending',
 '{"status": "pending", "message": "Payment initiated"}',
 NULL, NOW(), NOW());

-- Message de confirmation
SELECT 'Données de test insérées avec succès!' as message;
