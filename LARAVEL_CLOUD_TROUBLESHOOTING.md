# 🔧 Guide de Résolution des Problèmes - Laravel Cloud

## 🚨 Problème : "directory index of "/var/www/html/public/" is forbidden"

### Symptômes
```
2025/08/15 21:07:14 [error] 160#160: *19 directory index of "/var/www/html/public/" is forbidden
```

### Cause
Le serveur web (Apache/Nginx) ne peut pas accéder au fichier `index.php` dans le dossier `public/`.

### Solutions

#### Solution 1 : Vérifier les permissions
```bash
# Dans Laravel Cloud, exécutez :
chmod -R 755 storage bootstrap/cache
chmod 644 public/.htaccess
chmod 644 public/index.php
```

#### Solution 2 : Vérifier la structure
Assurez-vous que le fichier `public/index.php` existe et est accessible.

#### Solution 3 : Redéployer avec le script mis à jour
Le script `laravel-cloud-build.sh` a été mis à jour pour corriger automatiquement les permissions.

## 🚨 Problème : "composer.lock not found"

### Symptômes
```
The [composer.lock] file could not be found. Please ensure the file exists and is committed to the repository.
```

### Solution
1. Vérifiez que `composer.lock` est à la racine du repository
2. Commitez et poussez le fichier :
```bash
git add composer.lock
git commit -m "Add composer.lock for Laravel Cloud"
git push origin cursor
```

## 🚨 Problème : Erreurs de base de données

### Symptômes
```
SQLSTATE[HY000]: General error: 1 table "media" already exists
```

### Solution
1. Vérifiez les variables d'environnement de base de données
2. Assurez-vous que la base de données est accessible
3. Si nécessaire, réinitialisez les migrations :
```bash
php artisan migrate:fresh --force
```

## 🚨 Problème : Variables d'environnement manquantes

### Symptômes
```
APP_KEY is not set
```

### Solution
1. Dans Laravel Cloud, allez dans "Environment Variables"
2. Ajoutez toutes les variables depuis `backend/production.env`
3. Générez une nouvelle clé d'application :
```bash
php artisan key:generate --show
```

## 🚨 Problème : Lien de stockage manquant

### Symptômes
```
The link has already been created
```

### Solution
Le script de construction crée automatiquement le lien. Si le problème persiste :
```bash
php artisan storage:link --force
```

## 🔍 Diagnostic Automatique

Utilisez le script de diagnostic pour identifier les problèmes :

```bash
# Dans Laravel Cloud, exécutez :
./laravel-cloud-diagnostic.sh
```

## 📋 Checklist de Déploiement

### Avant le déploiement
- [ ] `composer.lock` est à la racine du repository
- [ ] `laravel-cloud-build.sh` est exécutable
- [ ] Toutes les variables d'environnement sont configurées
- [ ] La base de données est accessible

### Après le déploiement
- [ ] L'application répond sur l'URL fournie
- [ ] Les migrations ont été exécutées
- [ ] Les caches sont optimisés
- [ ] Les fichiers sont accessibles via Cloudflare R2

## 🛠️ Commandes Utiles

### Vérifier la structure
```bash
ls -la
ls -la public/
```

### Vérifier les logs
```bash
tail -f storage/logs/laravel.log
```

### Tester la base de données
```bash
php artisan migrate:status
```

### Régénérer les caches
```bash
php artisan config:clear
php artisan cache:clear
php artisan route:clear
php artisan view:clear
```

### Optimiser pour la production
```bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

## 📞 Support

### Logs à consulter
1. **Logs Laravel** : `storage/logs/laravel.log`
2. **Logs Apache/Nginx** : Dans l'interface Laravel Cloud
3. **Logs de construction** : Dans l'interface Laravel Cloud

### Variables critiques à vérifier
- `APP_KEY`
- `APP_ENV=production`
- `APP_DEBUG=false`
- `DB_CONNECTION`
- `DB_HOST`
- `DB_PASSWORD`

### Redéploiement
Si rien ne fonctionne, redéployez complètement :
1. Supprimez le projet dans Laravel Cloud
2. Recréez-le avec la même configuration
3. Redéployez

## 🎯 Solutions Rapides

### Problème persistant
1. Vérifiez que tous les fichiers sont commités
2. Redéployez avec le script mis à jour
3. Vérifiez les variables d'environnement
4. Consultez les logs de construction

### Performance
1. Activez les caches Laravel
2. Optimisez les requêtes de base de données
3. Utilisez Redis pour le cache
4. Configurez Cloudflare R2 pour les fichiers

## ✅ Vérification Finale

Après avoir appliqué les corrections :

1. **Test de l'application** : Visitez l'URL de votre application
2. **Test de l'API** : Testez un endpoint de votre API
3. **Test des fichiers** : Vérifiez l'upload de fichiers
4. **Test de la base de données** : Vérifiez les opérations CRUD

Si tout fonctionne, votre déploiement Laravel Cloud est réussi ! 🎉
