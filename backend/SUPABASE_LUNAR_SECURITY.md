# 🔒 Sécurisation des Tables Lunar dans Supabase

## 🚨 Problème Identifié

Vos tables Lunar ont actuellement des politiques de sécurité "unrestricted", ce qui signifie que **toutes les données sont accessibles à tous les utilisateurs** sans aucune restriction.

## ✅ Solution : Politiques de Sécurité RLS

### 1. Activer RLS (Row Level Security)

Dans l'interface Supabase, pour chaque table Lunar :

1. Aller dans **Table Editor**
2. Sélectionner la table (ex: `lunar_products`)
3. Cliquer sur **Settings** (⚙️)
4. Activer **Enable Row Level Security (RLS)**

### 2. Appliquer les Politiques de Sécurité

#### Table `lunar_channels`

```sql
-- Politique de lecture publique
CREATE POLICY "Channels are viewable by everyone" ON lunar_channels
    FOR SELECT USING (true);

-- Politique de gestion pour propriétaires et admins
CREATE POLICY "Channels are manageable by store owners and admins" ON lunar_channels
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM stores s 
            WHERE s.user_id = auth.uid() 
            OR auth.uid() IN (
                SELECT user_id FROM user_roles 
                WHERE role = 'admin'
            )
        )
    );
```

#### Table `lunar_customers`

```sql
-- Politique de lecture pour le client et propriétaire
CREATE POLICY "Customers can view their own data" ON lunar_customers
    FOR SELECT USING (
        user_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM stores s 
            WHERE s.user_id = auth.uid()
        )
    );

-- Politique de gestion pour le client
CREATE POLICY "Customers can manage their own data" ON lunar_customers
    FOR ALL USING (user_id = auth.uid());

-- Politique de suppression pour propriétaires
CREATE POLICY "Store owners can delete customer data" ON lunar_customers
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM stores s 
            WHERE s.user_id = auth.uid()
        )
    );
```

#### Table `lunar_products`

```sql
-- Politique de lecture publique pour produits actifs
CREATE POLICY "Active products are viewable by everyone" ON lunar_products
    FOR SELECT USING (is_active = true);

-- Politique de lecture pour tous les produits (propriétaires)
CREATE POLICY "Store owners can view all their products" ON lunar_products
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM stores s 
            WHERE s.id = lunar_products.store_id 
            AND s.user_id = auth.uid()
        )
    );

-- Politique de gestion pour propriétaires
CREATE POLICY "Store owners can manage their products" ON lunar_products
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM stores s 
            WHERE s.id = lunar_products.store_id 
            AND s.user_id = auth.uid()
        )
    );
```

#### Table `lunar_orders`

```sql
-- Politique de lecture pour client et propriétaire
CREATE POLICY "Orders are viewable by customer and store owner" ON lunar_orders
    FOR SELECT USING (
        user_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM stores s 
            WHERE s.id = lunar_orders.store_id 
            AND s.user_id = auth.uid()
        )
    );

-- Politique de création pour utilisateurs authentifiés
CREATE POLICY "Authenticated users can create orders" ON lunar_orders
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Politique de modification pour propriétaires
CREATE POLICY "Store owners can update order status" ON lunar_orders
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM stores s 
            WHERE s.id = lunar_orders.store_id 
            AND s.user_id = auth.uid()
        )
    );

-- Politique de suppression pour propriétaires
CREATE POLICY "Store owners can delete orders" ON lunar_orders
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM stores s 
            WHERE s.id = lunar_orders.store_id 
            AND s.user_id = auth.uid()
        )
    );
```

#### Table `lunar_product_variants`

```sql
-- Politique de lecture publique pour variantes actives
CREATE POLICY "Active product variants are viewable by everyone" ON lunar_product_variants
    FOR SELECT USING (is_active = true);

-- Politique de gestion pour propriétaires
CREATE POLICY "Store owners can manage variants" ON lunar_product_variants
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM lunar_products p 
            JOIN stores s ON s.id = p.store_id 
            WHERE p.id = lunar_product_variants.product_id 
            AND s.user_id = auth.uid()
        )
    );
```

#### Table `lunar_collections`

```sql
-- Politique de lecture publique pour collections actives
CREATE POLICY "Active collections are viewable by everyone" ON lunar_collections
    FOR SELECT USING (is_active = true);

-- Politique de gestion pour admins
CREATE POLICY "Collections are manageable by admins" ON lunar_collections
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_roles 
            WHERE user_id = auth.uid() 
            AND role = 'admin'
        )
    );
```

#### Table `lunar_collection_product`

```sql
-- Politique de lecture publique
CREATE POLICY "Collection products are viewable by everyone" ON lunar_collection_product
    FOR SELECT USING (true);

-- Politique de gestion pour admins
CREATE POLICY "Collection products are manageable by admins" ON lunar_collection_product
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_roles 
            WHERE user_id = auth.uid() 
            AND role = 'admin'
        )
    );
```

## 🚀 Application Automatique

### Option 1 : Script Shell

```bash
# Rendre le script exécutable
chmod +x scripts/apply-lunar-security.sh

# Exporter les variables d'environnement
export SUPABASE_URL="https://votre-projet.supabase.co"
export SUPABASE_ANON_KEY="votre-clé-anon"

# Exécuter le script
./scripts/apply-lunar-security.sh
```

### Option 2 : Interface Supabase

1. Aller dans **SQL Editor**
2. Copier-coller le contenu de `supabase/migrations/010_lunar_security_policies.sql`
3. Exécuter le script

## 🔍 Vérification

Après application, vérifiez dans **Table Editor** que :

- ✅ RLS est activé sur toutes les tables
- ✅ Les politiques sont listées dans l'onglet **Policies**
- ✅ Plus de politique "unrestricted"

## 📊 Résultat Attendu

- **Visiteurs** : Peuvent voir les produits/collections actifs
- **Clients** : Peuvent gérer leurs données et créer des commandes
- **Propriétaires** : Peuvent gérer leurs boutiques et produits
- **Admins** : Accès complet à toutes les fonctionnalités

## 🚨 Important

- **Testez** toutes les fonctionnalités après application
- **Vérifiez** que les utilisateurs ont les bonnes permissions
- **Sauvegardez** votre base avant modification
- **Surveillez** les logs pour détecter d'éventuels problèmes

## 🆘 En Cas de Problème

Si une politique bloque l'accès :

1. Vérifiez les logs Supabase
2. Testez avec un utilisateur admin
3. Vérifiez la syntaxe des politiques
4. Désactivez temporairement RLS si nécessaire
