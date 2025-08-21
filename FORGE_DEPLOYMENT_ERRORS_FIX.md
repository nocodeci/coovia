# Guide de Résolution des Erreurs de Déploiement Forge

## 🚨 Erreurs Rencontrées et Solutions

### 1. Erreur npm : package-lock.json manquant

**Erreur :**
```
npm error The `npm ci` command can only install with an existing package-lock.json
```

**Solution :**
- ✅ Ajout d'un `package.json` minimal
- ✅ Le backend Laravel n'a pas besoin de dépendances npm complexes
- ✅ Utilisation de Laravel Mix pour les assets si nécessaire

### 2. Erreur de Migration : Colonne dupliquée

**Erreur :**
```
SQLSTATE[42S21]: Column already exists: 1060 Duplicate column name 'address'
```

**Solution :**
- ✅ Création d'une migration de correction
- ✅ Vérification de l'existence des colonnes avant ajout
- ✅ Migration sécurisée qui ne plante pas si les colonnes existent

## 🛠️ Script de Déploiement Corrigé

### Utilisation du Script Amélioré

```bash
# Sur le serveur Forge
chmod +x deploy-forge-fixed.sh
./deploy-forge-fixed.sh
```

### Étapes du Script

1. **Pull du code** depuis la branche `backend-laravel-clean`
2. **Installation Composer** avec optimisation
3. **Configuration environnement** automatique
4. **Création dossiers cache** avec bonnes permissions
5. **Migrations sécurisées** avec gestion d'erreurs
6. **Optimisation Laravel** (cache config, routes, views)
7. **Redémarrage services** (PHP-FPM, Nginx)

## 🔧 Configuration Forge Recommandée

### Variables d'Environnement

```env
APP_NAME="Coovia Backend"
APP_ENV=production
APP_KEY=base64:...
APP_DEBUG=false
APP_URL=https://votre-domaine.com

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=coovia
DB_USERNAME=forge
DB_PASSWORD=...

# Auth0
AUTH0_DOMAIN=your-domain.auth0.com
AUTH0_CLIENT_ID=your-client-id
AUTH0_CLIENT_SECRET=your-client-secret

# Cloudflare R2
R2_ACCESS_KEY_ID=your-access-key
R2_SECRET_ACCESS_KEY=your-secret-key
R2_BUCKET=your-bucket
R2_ENDPOINT=your-endpoint
```

### Script de Déploiement Forge

Dans l'interface Forge, utilisez ce script :

```bash
cd /home/forge/default
git pull origin backend-laravel-clean
composer install --no-dev --optimize-autoloader
php artisan migrate --force
php artisan config:cache
php artisan route:cache
php artisan view:cache
sudo systemctl reload php8.2-fpm
```

## 🚀 Commandes de Diagnostic

### Vérification de l'État du Serveur

```bash
# Statut des services
sudo systemctl status php8.2-fpm
sudo systemctl status nginx
sudo systemctl status mysql

# Logs d'erreur
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/php8.2-fpm.log

# Permissions des dossiers
ls -la storage/
ls -la bootstrap/cache/
```

### Test de l'Application

```bash
# Test de l'API
curl -I https://votre-domaine.com/api

# Test de la page d'accueil
curl -I https://votre-domaine.com

# Vérification des migrations
php artisan migrate:status
```

## ✅ Checklist de Déploiement

- [ ] Code pullé depuis la bonne branche
- [ ] Dépendances Composer installées
- [ ] Fichier .env configuré
- [ ] Clé d'application générée
- [ ] Dossiers de cache créés avec bonnes permissions
- [ ] Migrations exécutées sans erreur
- [ ] Cache Laravel optimisé
- [ ] Services redémarrés
- [ ] Application accessible via HTTPS

## 🆘 Résolution de Problèmes

### Si les migrations échouent encore

```bash
# Vérifier l'état de la base de données
php artisan migrate:status

# Forcer la migration
php artisan migrate --force

# Si problème persiste, rollback et remigrate
php artisan migrate:rollback
php artisan migrate
```

### Si l'application ne répond pas

```bash
# Vérifier les logs
tail -f storage/logs/laravel.log

# Redémarrer les services
sudo systemctl restart php8.2-fpm
sudo systemctl restart nginx

# Vérifier les permissions
chmod -R 775 storage bootstrap/cache
chown -R forge:forge storage bootstrap/cache
```

## 🎯 Résultat Attendu

Après application de ces corrections :
- ✅ Déploiement sans erreurs npm
- ✅ Migrations exécutées avec succès
- ✅ Application Laravel fonctionnelle
- ✅ API accessible et opérationnelle
- ✅ Services stables et performants
