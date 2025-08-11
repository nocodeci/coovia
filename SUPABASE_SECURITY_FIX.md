# 🔒 Correction de Sécurité Supabase - Tables "Unrestricted"

## 🚨 Problème Identifié

Votre base de données Supabase présente un problème de sécurité critique : **certaines tables ont RLS (Row Level Security) activé mais aucune politique de sécurité définie**, ce qui les rend "unrestricted" (non restreintes).

### ❌ Conséquences du Problème

- **Accès non autorisé** aux données sensibles
- **Violation de la confidentialité** des utilisateurs
- **Risque de fuite de données** entre boutiques
- **Non-conformité** aux standards de sécurité

## 🔍 Diagnostic

### Tables Affectées

Les tables suivantes ont RLS activé mais pas de politiques :
- `users` - Profils utilisateurs
- `stores` - Boutiques
- `products` - Produits
- `customers` - Clients
- `orders` - Commandes
- `payment_gateways` - Passerelles de paiement
- `mfa_tokens` - Tokens MFA
- `login_attempts` - Tentatives de connexion

### Vérification

Exécutez ce script pour identifier les problèmes :

```sql
-- Vérifier les tables sans politiques
SELECT 
    t.tablename,
    t.rowsecurity as rls_enabled,
    COUNT(p.policyname) as policy_count
FROM pg_tables t
LEFT JOIN pg_policies p ON t.tablename = p.tablename 
WHERE t.schemaname = 'public' 
AND t.rowsecurity = true
GROUP BY t.tablename, t.rowsecurity
HAVING COUNT(p.policyname) = 0;
```

## ✅ Solution

### 1. Migration de Sécurité

Une migration complète a été créée : `backend/supabase/migrations/011_complete_security_policies.sql`

Cette migration :
- ✅ Supprime les anciennes politiques non sécurisées
- ✅ Crée des politiques appropriées pour chaque table
- ✅ Respecte le principe de moindre privilège
- ✅ Sépare les accès par boutique

### 2. Politiques Appliquées

#### Table `users`
- **Lecture** : Utilisateur peut voir son propre profil
- **Modification** : Utilisateur peut modifier son propre profil
- **Administration** : Admins peuvent voir tous les utilisateurs

#### Table `stores`
- **Lecture** : Propriétaire peut voir ses boutiques
- **Gestion** : Propriétaire peut gérer ses boutiques
- **Administration** : Admins peuvent voir toutes les boutiques

#### Table `products`
- **Lecture publique** : Produits actifs visibles par tous
- **Gestion** : Propriétaire de boutique peut gérer ses produits

#### Tables `customers`, `orders`, `payment_*`
- **Isolation** : Chaque propriétaire ne voit que ses données
- **Sécurité** : Aucun accès croisé entre boutiques

## 🚀 Application de la Correction

### Option 1 : Script Automatique (Recommandé)

```bash
# Depuis le répertoire racine du projet
cd backend/supabase/scripts
./apply_security_fix.sh
```

### Option 2 : Manuel

```bash
# Démarrer Supabase
supabase start

# Appliquer la migration
supabase db reset --linked

# Vérifier l'état
supabase db reset --linked
```

### Option 3 : Via Supabase Studio

1. Ouvrir http://localhost:54323
2. Aller dans l'onglet "SQL Editor"
3. Exécuter le contenu de `011_complete_security_policies.sql`

## 🔍 Vérification Post-Correction

### Script de Vérification

Utilisez le script : `backend/supabase/scripts/verify_security_policies.sql`

```bash
# Exécuter dans Supabase Studio ou via CLI
supabase db reset --linked
```

### Résultat Attendu

```
✅  POLITIQUES EXISTANTES
tablename    | policy_count | security_status
-------------|--------------|------------------
users        | 4            | ✅ Bien sécurisé
stores       | 3            | ✅ Bien sécurisé
products     | 3            | ✅ Bien sécurisé
customers    | 2            | ✅ Bien sécurisé
orders       | 2            | ✅ Bien sécurisé
...
```

## 🛡️ Principes de Sécurité Appliqués

### 1. **Isolation des Données**
- Chaque boutique ne voit que ses propres données
- Aucun accès croisé entre utilisateurs

### 2. **Principe de Moindre Privilège**
- Utilisateurs : accès uniquement à leurs données
- Propriétaires : accès à leurs boutiques et données associées
- Admins : accès global (avec restrictions appropriées)

### 3. **Authentification Supabase**
- Utilisation de `auth.uid()` pour l'identification
- Vérification des rôles et permissions

### 4. **Séparation des Responsabilités**
- Tables publiques : lecture seule pour les visiteurs
- Tables privées : accès restreint aux propriétaires

## ⚠️ Points d'Attention

### 1. **Redémarrage de l'Application**
Après application des corrections, **redémarrez votre application** pour que les changements prennent effet.

### 2. **Tests de Fonctionnalité**
Vérifiez que :
- Les utilisateurs peuvent toujours accéder à leurs données
- Les boutiques sont correctement isolées
- Les fonctionnalités d'administration fonctionnent

### 3. **Monitoring**
Surveillez les logs pour détecter d'éventuelles erreurs d'accès.

## 🔧 Dépannage

### Problème : "Policy does not exist"
```sql
-- Recréer la politique manquante
CREATE POLICY "Nom de la politique" ON table_name
    FOR SELECT USING (condition);
```

### Problème : Accès refusé
```sql
-- Vérifier l'utilisateur connecté
SELECT auth.uid(), auth.role();

-- Vérifier les politiques actives
SELECT * FROM pg_policies WHERE tablename = 'nom_table';
```

### Problème : Performance dégradée
```sql
-- Ajouter des index sur les colonnes utilisées dans les politiques
CREATE INDEX idx_table_column ON table_name(column_name);
```

## 📚 Ressources

- [Documentation Supabase RLS](https://supabase.com/docs/guides/auth/row-level-security)
- [Meilleures Pratiques de Sécurité](https://supabase.com/docs/guides/auth/row-level-security#best-practices)
- [Guide des Politiques](https://supabase.com/docs/guides/auth/row-level-security#policies)

## 🆘 Support

En cas de problème :
1. Vérifiez les logs Supabase
2. Exécutez le script de vérification
3. Consultez la documentation officielle
4. Contactez l'équipe de développement

---

**⚠️ IMPORTANT : Cette correction est critique pour la sécurité de votre application. Appliquez-la dès que possible.**
