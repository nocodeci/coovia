-- Insert sample payment gateways
INSERT INTO public.payment_gateways (store_id, name, provider, config, is_active, is_test_mode, supported_currencies) VALUES
(1, 'PayStack', 'paystack', '{"public_key": "pk_test_xxx", "secret_key": "sk_test_xxx"}', true, true, '["NGN", "USD", "GHS"]'),
(1, 'Flutterwave', 'flutterwave', '{"public_key": "FLWPUBK_TEST-xxx", "secret_key": "FLWSECK_TEST-xxx"}', true, true, '["NGN", "USD", "GHS", "KES", "UGX", "TZS"]'),
(1, 'CinetPay', 'cinetpay', '{"api_key": "xxx", "site_id": "xxx"}', true, true, '["XOF", "XAF", "GNF", "USD"]'),
(1, 'FedaPay', 'fedapay', '{"public_key": "pk_sandbox_xxx", "secret_key": "sk_sandbox_xxx"}', true, true, '["XOF", "NGN", "USD"]'),
(1, 'PayDunya', 'paydunya', '{"master_key": "xxx", "private_key": "xxx", "public_key": "xxx", "token": "xxx"}', false, true, '["XOF", "GHS", "USD"]'),
(1, 'PawaPay', 'pawapay', '{"api_key": "xxx"}', false, true, '["UGX", "TZS", "RWF", "ZMW", "GHS", "KES", "XOF", "XAF"]');

-- Insert sample payment methods
INSERT INTO public.payment_methods (gateway_id, name, type, config, is_active) VALUES
-- PayStack methods
(1, 'Carte bancaire', 'card', '{}', true),
(1, 'Virement bancaire', 'bank_transfer', '{}', true),
(1, 'USSD', 'ussd', '{}', true),

-- Flutterwave methods
(2, 'Carte bancaire', 'card', '{}', true),
(2, 'Mobile Money', 'mobile_money', '{}', true),
(2, 'Virement bancaire', 'bank_transfer', '{}', true),
(2, 'USSD', 'ussd', '{}', true),

-- CinetPay methods
(3, 'Orange Money', 'mobile_money', '{"provider": "orange"}', true),
(3, 'MTN Mobile Money', 'mobile_money', '{"provider": "mtn"}', true),
(3, 'Moov Money', 'mobile_money', '{"provider": "moov"}', true),
(3, 'Wave', 'mobile_money', '{"provider": "wave"}', true),
(3, 'Carte bancaire', 'card', '{}', true),

-- FedaPay methods
(4, 'Mobile Money', 'mobile_money', '{}', true),
(4, 'Carte bancaire', 'card', '{}', true),

-- PayDunya methods
(5, 'MTN Mobile Money', 'mobile_money', '{"provider": "mtn"}', true),
(5, 'Vodafone Cash', 'mobile_money', '{"provider": "vodafone"}', true),
(5, 'AirtelTigo Money', 'mobile_money', '{"provider": "airteltigo"}', true),

-- PawaPay methods
(6, 'MTN Mobile Money', 'mobile_money', '{"provider": "mtn"}', true),
(6, 'Airtel Money', 'mobile_money', '{"provider": "airtel"}', true),
(6, 'Orange Money', 'mobile_money', '{"provider": "orange"}', true);

-- Insert sample user
INSERT INTO public.users (name, email, password, phone, role, email_verified_at) VALUES
('Admin User', 'admin@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '+225 07 12 34 56 78', 'admin', NOW()),
('John Doe', 'john@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '+225 01 23 45 67 89', 'user', NOW());

-- Insert sample store
INSERT INTO public.stores (owner_id, name, description, email, phone, is_active) VALUES
(1, 'Ma Boutique', 'Boutique de vente en ligne', 'contact@maboutique.com', '+225 07 12 34 56 78', true),
(2, 'John Store', 'Magasin de John Doe', 'john@johnstore.com', '+225 01 23 45 67 89', true);

-- Insert sample products
INSERT INTO public.products (store_id, name, description, price, sku, status, featured) VALUES
(1, 'T-shirt Blanc', 'T-shirt en coton blanc de qualité', 15000.00, 'TSH-WHT-001', 'active', true),
(1, 'Jean Bleu', 'Jean bleu délavé coupe droite', 25000.00, 'JEA-BLU-001', 'active', false),
(1, 'Sneakers', 'Chaussures de sport confortables', 45000.00, 'SNK-WHT-001', 'active', true),
(2, 'Smartphone', 'Téléphone intelligent dernière génération', 150000.00, 'PHN-SMT-001', 'active', true),
(2, 'Écouteurs', 'Écouteurs sans fil Bluetooth', 35000.00, 'EAR-BLU-001', 'active', false);

-- Insert sample customers
INSERT INTO public.customers (store_id, email, first_name, last_name, phone) VALUES
(1, 'marie@example.com', 'Marie', 'Kouassi', '+225 05 12 34 56 78'),
(1, 'pierre@example.com', 'Pierre', 'Diabaté', '+225 07 98 76 54 32'),
(2, 'fatou@example.com', 'Fatou', 'Traoré', '+225 01 11 22 33 44');
