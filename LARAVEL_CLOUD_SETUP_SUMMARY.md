# 🚀 Configuration Laravel Cloud - Monorepo - Résumé

## ✅ Configuration Terminée

Votre monorepo est maintenant configuré pour le déploiement sur Laravel Cloud !

## 📁 Fichiers Créés

### À la racine du repository :
- ✅ `composer.json` - Configuration Composer (copié depuis backend/)
- ✅ `composer.lock` - Verrouillage des dépendances (copié depuis backend/)
- ✅ `laravel-cloud-build.sh` - Script de construction personnalisé
- ✅ `laravel-cloud-config.json` - Configuration Laravel Cloud
- ✅ `deploy-laravel-cloud.sh` - Script de déploiement interactif
- ✅ `test-laravel-cloud-build.sh` - Script de test local
- ✅ `LARAVEL_CLOUD_MONOREPO_GUIDE.md` - Guide complet

## 🔧 Comment ça fonctionne

1. **Détection** : Laravel Cloud détecte le `composer.lock` à la racine
2. **Construction** : Le script `laravel-cloud-build.sh` s'exécute
3. **Restructuration** : Le dossier `backend/` est déplacé à la racine
4. **Installation** : `composer install --no-dev` s'exécute
5. **Optimisation** : Laravel est optimisé pour la production
6. **Déploiement** : L'application est déployée

## 🚀 Déploiement Rapide

### Option 1 : Script interactif
```bash
./deploy-laravel-cloud.sh
```

### Option 2 : Manuel
1. Connectez-vous à [cloud.laravel.com](https://cloud.laravel.com)
2. Créez un nouveau projet
3. Sélectionnez votre repository `coovia`
4. Configurez le script de construction : `./laravel-cloud-build.sh`
5. Ajoutez vos variables d'environnement
6. Déployez !

## 🔍 Test Local

Testez la configuration avant le déploiement :
```bash
./test-laravel-cloud-build.sh
```

## 📋 Variables d'Environnement Requises

Copiez depuis `backend/production.env` :

```env
# Application
APP_NAME=Coovia
APP_ENV=production
APP_DEBUG=false
APP_URL=https://votre-app.laravel.cloud
APP_KEY=base64:votre_clé_32_caractères

# Base de données (Supabase)
DB_CONNECTION=pgsql
DB_HOST=db.xxxxxxxxxxxxx.supabase.co
DB_PORT=5432
DB_DATABASE=postgres
DB_USERNAME=postgres
DB_PASSWORD=votre_mot_de_passe_supabase

# Cloudflare R2
FILESYSTEM_DISK=r2
CLOUDFLARE_R2_ACCESS_KEY_ID=d8bd4ac4100f9d1af000d8b59c0d5810
CLOUDFLARE_R2_SECRET_ACCESS_KEY=67482928c8d1093677ad71131d0d63dcbf886d4e7385f1b904e7958af159ac1c
CLOUDFLARE_R2_BUCKET=coovia-files
CLOUDFLARE_R2_URL=https://coovia-files.abf701097f61a1d3954f38fcc6b41e83.r2.cloudflarestorage.com
CLOUDFLARE_R2_ENDPOINT=https://abf701097f61a1d3954f38fcc6b41e83.r2.cloudflarestorage.com

# Cache et Sessions
CACHE_DRIVER=redis
SESSION_DRIVER=cookie
SESSION_LIFETIME=120
QUEUE_CONNECTION=sqs

# Email
MAIL_MAILER=smtp
MAIL_HOST=mailpit
MAIL_PORT=1025
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_ENCRYPTION=null
MAIL_FROM_ADDRESS=noreply@coovia.com
MAIL_FROM_NAME=Coovia

# Frontend URL pour CORS
FRONTEND_URL=https://votre-frontend.com
SANCTUM_STATEFUL_DOMAINS=votre-frontend.com
SESSION_DOMAIN=.laravel.cloud
```

## 🎯 Avantages de cette Configuration

- ✅ **Monorepo supporté** : Déploiement depuis la racine
- ✅ **Automatisation** : Script de construction personnalisé
- ✅ **Test local** : Validation avant déploiement
- ✅ **Flexibilité** : Facilement modifiable
- ✅ **Documentation** : Guide complet inclus

## ⚠️ Notes Importantes

- **Support non officiel** : Cette solution n'est pas officiellement supportée
- **Risques** : L'assistance Laravel Cloud pourrait ne pas pouvoir vous aider
- **Test** : Testez toujours en environnement de développement
- **Backup** : Gardez une copie de votre configuration

## 🔄 Mises à jour

Pour mettre à jour votre application :

1. Poussez vos changements sur Git
2. Laravel Cloud détectera automatiquement les changements
3. Le script de construction s'exécutera à nouveau
4. L'application sera mise à jour

## 📞 Support

- **Documentation** : `LARAVEL_CLOUD_MONOREPO_GUIDE.md`
- **Test** : `./test-laravel-cloud-build.sh`
- **Déploiement** : `./deploy-laravel-cloud.sh`

## 🎉 Félicitations !

Votre monorepo est maintenant prêt pour le déploiement sur Laravel Cloud !
