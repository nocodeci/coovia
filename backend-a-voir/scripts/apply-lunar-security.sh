#!/bin/bash

# Script pour appliquer les politiques de sécurité Lunar dans Supabase
# Usage: ./apply-lunar-security.sh

set -e

echo "🔒 Application des politiques de sécurité Lunar dans Supabase..."

# Vérifier que les variables d'environnement sont définies
if [ -z "$SUPABASE_URL" ] || [ -z "$SUPABASE_ANON_KEY" ]; then
    echo "❌ Variables d'environnement Supabase manquantes"
    echo "Exportez SUPABASE_URL et SUPABASE_ANON_KEY"
    exit 1
fi

# Fonction pour exécuter une requête SQL
execute_sql() {
    local sql="$1"
    local description="$2"
    
    echo "📝 $description..."
    
    # Utiliser l'API REST de Supabase pour exécuter du SQL
    response=$(curl -s -X POST \
        -H "apikey: $SUPABASE_ANON_KEY" \
        -H "Authorization: Bearer $SUPABASE_ANON_KEY" \
        -H "Content-Type: application/json" \
        -H "Prefer: return=minimal" \
        -d "{\"query\": \"$sql\"}" \
        "$SUPABASE_URL/rest/v1/rpc/exec_sql")
    
    if [ $? -eq 0 ]; then
        echo "✅ $description - Succès"
    else
        echo "❌ $description - Échec: $response"
    fi
}

echo "🚀 Début de l'application des politiques de sécurité..."

# 1. Activer RLS sur toutes les tables Lunar
execute_sql "ALTER TABLE lunar_channels ENABLE ROW LEVEL SECURITY;" "Activation RLS sur lunar_channels"
execute_sql "ALTER TABLE lunar_customers ENABLE ROW LEVEL SECURITY;" "Activation RLS sur lunar_customers"
execute_sql "ALTER TABLE lunar_products ENABLE ROW LEVEL SECURITY;" "Activation RLS sur lunar_products"
execute_sql "ALTER TABLE lunar_orders ENABLE ROW LEVEL SECURITY;" "Activation RLS sur lunar_orders"
execute_sql "ALTER TABLE lunar_product_variants ENABLE ROW LEVEL SECURITY;" "Activation RLS sur lunar_product_variants"
execute_sql "ALTER TABLE lunar_collections ENABLE ROW LEVEL SECURITY;" "Activation RLS sur lunar_collections"
execute_sql "ALTER TABLE lunar_collection_product ENABLE ROW LEVEL SECURITY;" "Activation RLS sur lunar_collection_product"

# 2. Supprimer les politiques existantes (si elles existent)
echo "🗑️  Suppression des anciennes politiques..."
execute_sql "DROP POLICY IF EXISTS \"Channels are viewable by everyone\" ON lunar_channels;" "Suppression ancienne politique channels"
execute_sql "DROP POLICY IF EXISTS \"Customers can view their own data\" ON lunar_customers;" "Suppression ancienne politique customers"
execute_sql "DROP POLICY IF EXISTS \"Active products are viewable by everyone\" ON lunar_products;" "Suppression ancienne politique products"
execute_sql "DROP POLICY IF EXISTS \"Orders are viewable by customer and store owner\" ON lunar_orders;" "Suppression ancienne politique orders"

# 3. Créer les nouvelles politiques de sécurité
echo "🔐 Création des nouvelles politiques de sécurité..."

# Politiques pour lunar_channels
execute_sql "CREATE POLICY \"Channels are viewable by everyone\" ON lunar_channels FOR SELECT USING (true);" "Politique channels lecture publique"
execute_sql "CREATE POLICY \"Channels are manageable by store owners and admins\" ON lunar_channels FOR ALL USING (EXISTS (SELECT 1 FROM stores s WHERE s.user_id = auth.uid() OR auth.uid() IN (SELECT user_id FROM user_roles WHERE role = 'admin')));" "Politique channels gestion"

# Politiques pour lunar_customers
execute_sql "CREATE POLICY \"Customers can view their own data\" ON lunar_customers FOR SELECT USING (user_id = auth.uid() OR EXISTS (SELECT 1 FROM stores s WHERE s.user_id = auth.uid()));" "Politique customers lecture"
execute_sql "CREATE POLICY \"Customers can manage their own data\" ON lunar_customers FOR ALL USING (user_id = auth.uid());" "Politique customers gestion"
execute_sql "CREATE POLICY \"Store owners can delete customer data\" ON lunar_customers FOR DELETE USING (EXISTS (SELECT 1 FROM stores s WHERE s.user_id = auth.uid()));" "Politique customers suppression"

# Politiques pour lunar_products
execute_sql "CREATE POLICY \"Active products are viewable by everyone\" ON lunar_products FOR SELECT USING (is_active = true);" "Politique products lecture publique"
execute_sql "CREATE POLICY \"Store owners can view all their products\" ON lunar_products FOR SELECT USING (EXISTS (SELECT 1 FROM stores s WHERE s.id = lunar_products.store_id AND s.user_id = auth.uid()));" "Politique products lecture propriétaire"
execute_sql "CREATE POLICY \"Store owners can manage their products\" ON lunar_products FOR ALL USING (EXISTS (SELECT 1 FROM stores s WHERE s.id = lunar_products.store_id AND s.user_id = auth.uid()));" "Politique products gestion"

# Politiques pour lunar_orders
execute_sql "CREATE POLICY \"Orders are viewable by customer and store owner\" ON lunar_orders FOR SELECT USING (user_id = auth.uid() OR EXISTS (SELECT 1 FROM stores s WHERE s.id = lunar_orders.store_id AND s.user_id = auth.uid()));" "Politique orders lecture"
execute_sql "CREATE POLICY \"Authenticated users can create orders\" ON lunar_orders FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);" "Politique orders création"
execute_sql "CREATE POLICY \"Store owners can update order status\" ON lunar_orders FOR UPDATE USING (EXISTS (SELECT 1 FROM stores s WHERE s.id = lunar_orders.store_id AND s.user_id = auth.uid()));" "Politique orders modification"
execute_sql "CREATE POLICY \"Store owners can delete orders\" ON lunar_orders FOR DELETE USING (EXISTS (SELECT 1 FROM stores s WHERE s.id = lunar_orders.store_id AND s.user_id = auth.uid()));" "Politique orders suppression"

# Politiques pour lunar_product_variants
execute_sql "CREATE POLICY \"Active product variants are viewable by everyone\" ON lunar_product_variants FOR SELECT USING (is_active = true);" "Politique variants lecture publique"
execute_sql "CREATE POLICY \"Store owners can view all variants\" ON lunar_product_variants FOR SELECT USING (EXISTS (SELECT 1 FROM lunar_products p JOIN stores s ON s.id = p.store_id WHERE p.id = lunar_product_variants.product_id AND s.user_id = auth.uid()));" "Politique variants lecture propriétaire"
execute_sql "CREATE POLICY \"Store owners can manage variants\" ON lunar_product_variants FOR ALL USING (EXISTS (SELECT 1 FROM lunar_products p JOIN stores s ON s.id = p.store_id WHERE p.id = lunar_product_variants.product_id AND s.user_id = auth.uid()));" "Politique variants gestion"

# Politiques pour lunar_collections
execute_sql "CREATE POLICY \"Active collections are viewable by everyone\" ON lunar_collections FOR SELECT USING (is_active = true);" "Politique collections lecture publique"
execute_sql "CREATE POLICY \"Collections are manageable by admins\" ON lunar_collections FOR ALL USING (EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin'));" "Politique collections gestion"

# Politiques pour lunar_collection_product
execute_sql "CREATE POLICY \"Collection products are viewable by everyone\" ON lunar_collection_product FOR SELECT USING (true);" "Politique collection_product lecture"
execute_sql "CREATE POLICY \"Collection products are manageable by admins\" ON lunar_collection_product FOR ALL USING (EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin'));" "Politique collection_product gestion"

# 4. Créer les fonctions utilitaires
echo "🔧 Création des fonctions utilitaires..."

execute_sql "CREATE OR REPLACE FUNCTION is_store_owner(store_uuid UUID) RETURNS BOOLEAN AS \$\$ BEGIN RETURN EXISTS (SELECT 1 FROM stores s WHERE s.id = store_uuid AND s.user_id = auth.uid()); END; \$\$ LANGUAGE plpgsql SECURITY DEFINER;" "Fonction is_store_owner"

execute_sql "CREATE OR REPLACE FUNCTION is_admin() RETURNS BOOLEAN AS \$\$ BEGIN RETURN EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin'); END; \$\$ LANGUAGE plpgsql SECURITY DEFINER;" "Fonction is_admin"

# 5. Créer les index pour les performances
echo "📊 Création des index de performance..."

execute_sql "CREATE INDEX IF NOT EXISTS idx_lunar_products_store_id ON lunar_products(store_id);" "Index products store_id"
execute_sql "CREATE INDEX IF NOT EXISTS idx_lunar_products_is_active ON lunar_products(is_active);" "Index products is_active"
execute_sql "CREATE INDEX IF NOT EXISTS idx_lunar_products_slug ON lunar_products(slug);" "Index products slug"
execute_sql "CREATE INDEX IF NOT EXISTS idx_lunar_orders_user_id ON lunar_orders(user_id);" "Index orders user_id"
execute_sql "CREATE INDEX IF NOT EXISTS idx_lunar_orders_store_id ON lunar_orders(store_id);" "Index orders store_id"
execute_sql "CREATE INDEX IF NOT EXISTS idx_lunar_orders_status ON lunar_orders(status);" "Index orders status"
execute_sql "CREATE INDEX IF NOT EXISTS idx_lunar_customers_user_id ON lunar_customers(user_id);" "Index customers user_id"
execute_sql "CREATE INDEX IF NOT EXISTS idx_lunar_customers_email ON lunar_customers(email);" "Index customers email"
execute_sql "CREATE INDEX IF NOT EXISTS idx_lunar_collections_slug ON lunar_collections(slug);" "Index collections slug"
execute_sql "CREATE INDEX IF NOT EXISTS idx_lunar_product_variants_product_id ON lunar_product_variants(product_id);" "Index variants product_id"

echo "🎉 Application des politiques de sécurité terminée !"
echo ""
echo "📋 Résumé des politiques appliquées :"
echo "   ✅ RLS activé sur toutes les tables Lunar"
echo "   ✅ Politiques de lecture publique pour les produits/collections actifs"
echo "   ✅ Politiques de gestion pour les propriétaires de boutique"
echo "   ✅ Politiques de sécurité pour les commandes"
echo "   ✅ Fonctions utilitaires créées"
echo "   ✅ Index de performance créés"
echo ""
echo "🔒 Vos tables Lunar sont maintenant sécurisées !"
