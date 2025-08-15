# Guide de Déploiement Railway pour Backend Laravel

## Prérequis

1. **Compte Railway** : Créez un compte sur [Railway.app](https://railway.app)
2. **GitHub Repository** : Assurez-vous que votre code est sur GitHub
3. **Variables d'environnement** : Préparez vos clés API et configurations

## Étape 1: Configuration Railway

### 1.1 Créer un nouveau projet Railway

1. Connectez-vous à Railway
2. Cliquez sur "New Project"
3. Sélectionnez "Deploy from GitHub repo"
4. Choisissez votre repository `coovia`
5. Sélectionnez le dossier `backend` comme source

### 1.2 Configuration du Build

Railway détectera automatiquement que c'est un projet PHP/Laravel grâce au `composer.json`.

## Étape 2: Configuration des Variables d'Environnement

Dans l'interface Railway, allez dans l'onglet "Variables" et ajoutez les variables suivantes :

### Configuration de Base
```env
APP_NAME=Coovia
APP_ENV=production
APP_DEBUG=false
APP_URL=https://votre-app.railway.app
APP_KEY=base64:votre_clé_32_caractères
```

### Base de Données (Supabase PostgreSQL)
```env
DB_CONNECTION=pgsql
DB_HOST=db.xxxxxxxxxxxxx.supabase.co
DB_PORT=5432
DB_DATABASE=postgres
DB_USERNAME=postgres
DB_PASSWORD=votre_mot_de_passe_supabase
```

### Cloudflare R2 (Stockage de fichiers)
```env
FILESYSTEM_DISK=r2
CLOUDFLARE_R2_ACCESS_KEY_ID=d8bd4ac4100f9d1af000d8b59c0d5810
CLOUDFLARE_R2_SECRET_ACCESS_KEY=67482928c8d1093677ad71131d0d63dcbf886d4e7385f1b904e7958af159ac1c
CLOUDFLARE_R2_BUCKET=coovia-files
CLOUDFLARE_R2_URL=https://coovia-files.abf701097f61a1d3954f38fcc6b41e83.r2.cloudflarestorage.com
CLOUDFLARE_R2_ENDPOINT=https://abf701097f61a1d3954f38fcc6b41e83.r2.cloudflarestorage.com
```

### Configuration Email
```env
MAIL_MAILER=smtp
MAIL_HOST=mailpit
MAIL_PORT=1025
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_ENCRYPTION=null
MAIL_FROM_ADDRESS=noreply@coovia.com
MAIL_FROM_NAME=Coovia
```

### CORS et Frontend
```env
FRONTEND_URL=https://votre-frontend.com
SANCTUM_STATEFUL_DOMAINS=votre-frontend.com
SESSION_DOMAIN=.railway.app
```

### Passerelles de Paiement (optionnel)
```env
PAYDUNYA_MASTER_KEY=votre_clé_master
PAYDUNYA_PUBLIC_KEY=votre_clé_publique
PAYDUNYA_PRIVATE_KEY=votre_clé_privée
PAYDUNYA_TOKEN=votre_token

MONEROO_PUBLIC_KEY=votre_clé_publique
MONEROO_SECRET_KEY=votre_clé_secrète
MONEROO_ENVIRONMENT=production
```

## Étape 3: Génération de la Clé d'Application

Avant le déploiement, générez une clé d'application Laravel :

```bash
php artisan key:generate --show
```

Copiez la clé générée dans la variable `APP_KEY` sur Railway.

## Étape 4: Configuration du Procfile

Le `Procfile` actuel utilise Apache. Pour Railway, nous pouvons utiliser Nginx ou Apache. Le fichier actuel devrait fonctionner :

```
web: vendor/bin/heroku-php-apache2 public/
```

## Étape 5: Scripts de Build et Déploiement

### 5.1 Script de Build (optionnel)

Créez un fichier `build.sh` dans le dossier backend :

```bash
#!/bin/bash
echo "🚀 Démarrage du build..."

# Installer les dépendances
composer install --no-dev --optimize-autoloader

# Générer la clé d'application si elle n'existe pas
php artisan key:generate --force

# Vider les caches
php artisan config:clear
php artisan cache:clear
php artisan route:clear
php artisan view:clear

# Optimiser l'application
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Exécuter les migrations
php artisan migrate --force

echo "✅ Build terminé avec succès!"
```

### 5.2 Configuration Railway Avancée

Mettez à jour le fichier `railway.json` :

```json
{
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "chmod +x build.sh && ./build.sh"
  },
  "deploy": {
    "numReplicas": 1,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10,
    "healthcheckPath": "/api/health",
    "healthcheckTimeout": 300
  }
}
```

## Étape 6: Route de Santé

Créez une route de santé pour Railway dans `routes/api.php` :

```php
Route::get('/health', function () {
    return response()->json([
        'status' => 'healthy',
        'timestamp' => now(),
        'version' => '1.0.0'
    ]);
});
```

## Étape 7: Déploiement

1. **Commit et Push** : Poussez vos modifications vers GitHub
2. **Déploiement Automatique** : Railway déploiera automatiquement
3. **Vérification** : Surveillez les logs dans l'interface Railway

## Étape 8: Configuration Post-Déploiement

### 8.1 Vérification des Logs

Dans l'interface Railway :
- Allez dans l'onglet "Deployments"
- Cliquez sur le dernier déploiement
- Vérifiez les logs pour détecter les erreurs

### 8.2 Test de l'API

Testez votre API avec curl :

```bash
curl https://votre-app.railway.app/api/health
```

### 8.3 Configuration du Domaine Personnalisé (optionnel)

1. Dans Railway, allez dans "Settings"
2. Cliquez sur "Domains"
3. Ajoutez votre domaine personnalisé
4. Configurez les DNS selon les instructions

## Étape 9: Monitoring et Maintenance

### 9.1 Variables d'Environnement de Production

Assurez-vous que toutes les variables sensibles sont configurées :

```env
# Logging
LOG_CHANNEL=stack
LOG_LEVEL=error
LOG_DEPRECATIONS_CHANNEL=null

# Cache et Sessions
CACHE_DRIVER=file
SESSION_DRIVER=file
SESSION_LIFETIME=120
QUEUE_CONNECTION=sync
```

### 9.2 Optimisations de Performance

1. **Cache des configurations** : `php artisan config:cache`
2. **Cache des routes** : `php artisan route:cache`
3. **Cache des vues** : `php artisan view:cache`

## Dépannage

### Erreurs Communes

1. **Erreur de clé d'application** :
   - Vérifiez que `APP_KEY` est défini
   - Régénérez la clé si nécessaire

2. **Erreur de base de données** :
   - Vérifiez les variables `DB_*`
   - Testez la connexion à Supabase

3. **Erreur de permissions** :
   - Vérifiez les permissions des dossiers `storage` et `bootstrap/cache`

### Commandes Utiles

```bash
# Voir les logs Railway
railway logs

# Redémarrer l'application
railway service restart

# Vérifier le statut
railway status
```

## Sécurité

1. **Variables sensibles** : Ne jamais commiter les clés API
2. **HTTPS** : Railway fournit automatiquement HTTPS
3. **CORS** : Configurez correctement les domaines autorisés
4. **Rate Limiting** : Activez la limitation de débit si nécessaire

## Support

- **Documentation Railway** : [docs.railway.app](https://docs.railway.app)
- **Documentation Laravel** : [laravel.com/docs](https://laravel.com/docs)
- **Support Railway** : Via l'interface ou Discord

---

**Note** : Ce guide suppose que vous utilisez Supabase comme base de données et Cloudflare R2 pour le stockage. Ajustez les configurations selon vos besoins spécifiques.
