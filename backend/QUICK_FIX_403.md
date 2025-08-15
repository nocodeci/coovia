# 🔥 RÉSOLUTION RAPIDE - Erreur 403 Forbidden

## Problème
```
directory index of "/var/www/html/public/" is forbidden
```

## Solution immédiate

### 1. Vérifier que le fichier index.php existe
Le problème principal est que nginx ne trouve pas le fichier `index.php` dans le dossier `public`.

### 2. Utiliser FrankenPHP directement
Laravel Cloud utilise nginx par défaut, mais notre application utilise FrankenPHP. Nous devons forcer l'utilisation de FrankenPHP.

### 3. Configuration requise

**Variables d'environnement OBLIGATOIRES dans Laravel Cloud :**

```bash
APP_NAME=Coovia
APP_ENV=production
APP_DEBUG=false
APP_URL=https://coovia-cursor-ozzf9a.laravel.cloud
APP_KEY=base64:VOTRE_CLE_GENEREE

# Base de données
DB_CONNECTION=mysql
DB_HOST=VOTRE_HOST
DB_PORT=3306
DB_DATABASE=VOTRE_DB
DB_USERNAME=VOTRE_USER
DB_PASSWORD=VOTRE_PASSWORD

# Cache
CACHE_DRIVER=file
SESSION_DRIVER=file
QUEUE_CONNECTION=sync
FILESYSTEM_DISK=local
```

### 4. Étapes de résolution

1. **Générer une clé d'application :**
   ```bash
   cd backend
   php artisan key:generate
   ```

2. **Configurer les variables dans Laravel Cloud Dashboard**

3. **Redéployer :**
   ```bash
   laravel cloud deploy
   ```

4. **Tester :**
   - `https://coovia-cursor-ozzf9a.laravel.cloud/test`
   - `https://coovia-cursor-ozzf9a.laravel.cloud/`

### 5. Si le problème persiste

Utilisez le script de diagnostic :
```bash
php debug-nginx-issue.php
```

### 6. Alternative : Configuration simple

Si rien ne fonctionne, utilisez la configuration simple :
```bash
cp Procfile.simple Procfile
git add Procfile
git commit -m "Configuration simple FrankenPHP"
git push
```

## Vérifications rapides

- ✅ Le fichier `public/index.php` existe
- ✅ Les permissions sont correctes (755)
- ✅ Les variables d'environnement sont configurées
- ✅ La base de données est accessible
- ✅ FrankenPHP démarre correctement

## Logs utiles

```bash
# Voir tous les logs
laravel cloud logs

# Voir les logs d'erreur
laravel cloud logs --type=error

# Voir les logs nginx
laravel cloud logs --type=nginx
```
