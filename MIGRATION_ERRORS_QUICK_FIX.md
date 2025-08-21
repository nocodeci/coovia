# Guide de Résolution Rapide - Erreurs de Migration

## 🚨 Erreur Actuelle

```
SQLSTATE[42S21]: Column already exists: 1060 Duplicate column name 'logo'
```

## ⚡ Solution Rapide

### 1. Script de Déploiement Sécurisé

Utilisez le script `forge-deploy-safe.sh` qui gère automatiquement les erreurs de migration.

### 2. Script de Déploiement Forge Recommandé

Dans l'interface Forge, utilisez ce script :

```bash
cd /home/forge/default
git pull origin backend-laravel-clean
composer install --no-dev --optimize-autoloader
npm install --production
php artisan migrate --force
php artisan config:cache
php artisan route:cache
php artisan view:cache
sudo systemctl reload php8.2-fpm
```

### 3. Si les Migrations Échouent Encore

Exécutez ces commandes manuellement sur le serveur :

```bash
# Aller dans le répertoire du site
cd /home/forge/default

# Vérifier l'état des migrations
php artisan migrate:status

# Forcer la migration
php artisan migrate --force

# Si erreur persiste, marquer les migrations comme exécutées
php artisan migrate:status | grep "| No" | awk '{print $2}' | xargs -I {} php artisan migrate:status --path=database/migrations/{}
```

### 4. Correction Manuelle des Colonnes

Si les migrations continuent d'échouer, exécutez ces commandes SQL directement :

```sql
-- Vérifier les colonnes existantes dans la table stores
DESCRIBE stores;

-- Si les colonnes existent déjà, les migrations peuvent être marquées comme exécutées
-- Pas besoin de les recréer
```

### 5. Marquer les Migrations Problématiques comme Exécutées

```bash
# Marquer la migration logo/banner comme exécutée
php artisan migrate:status --path=database/migrations/2025_08_12_043601_add_logo_and_banner_to_stores_table.php

# Marquer la migration address/contact/settings comme exécutée
php artisan migrate:status --path=database/migrations/2025_08_08_205440_add_address_contact_settings_to_stores_table.php

# Marquer la migration slug comme exécutée
php artisan migrate:status --path=database/migrations/2025_08_14_194258_add_slug_to_products_table.php
```

## 🔧 Migrations Corrigées

Les migrations suivantes ont été corrigées pour être sécurisées :

- ✅ `2025_08_08_205440_add_address_contact_settings_to_stores_table.php`
- ✅ `2025_08_12_043601_add_logo_and_banner_to_stores_table.php`
- ✅ `2025_08_14_194258_add_slug_to_products_table.php`

## 🚀 Déploiement Immédiat

1. **Pull du code corrigé** :
   ```bash
   git pull origin backend-laravel-clean
   ```

2. **Exécuter le script sécurisé** :
   ```bash
   chmod +x forge-deploy-safe.sh
   ./forge-deploy-safe.sh
   ```

3. **Ou utiliser le script Forge simple** :
   ```bash
   cd /home/forge/default
   git pull origin backend-laravel-clean
   composer install --no-dev --optimize-autoloader
   npm install --production
   php artisan migrate --force
   php artisan config:cache
   php artisan route:cache
   php artisan view:cache
   sudo systemctl reload php8.2-fpm
   ```

## ✅ Résultat Attendu

Après application de ces corrections :
- ✅ Plus d'erreur de colonnes dupliquées
- ✅ Migrations exécutées avec succès
- ✅ Application Laravel fonctionnelle
- ✅ Déploiement automatisé stable

## 🆘 Si Problème Persiste

1. **Vérifier les logs** :
   ```bash
   tail -f storage/logs/laravel.log
   ```

2. **Vérifier l'état de la base de données** :
   ```bash
   php artisan migrate:status
   ```

3. **Redémarrer les services** :
   ```bash
   sudo systemctl restart php8.2-fpm
   sudo systemctl restart nginx
   ```

4. **Contacter le support** avec les logs d'erreur complets.
