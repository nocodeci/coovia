# 🔧 Guide de résolution des problèmes du Backend Forge

## 📋 Problèmes identifiés

Votre backend Laravel sur Forge présente les problèmes suivants :
- ❌ **Erreur 500** sur la racine
- ❌ **Erreur 404** sur toutes les routes API
- ❌ **Message "Server Error"** retourné

## 🚨 Causes probables

### 1. Problème de déploiement Laravel
- Laravel n'est pas correctement déployé sur Forge
- Les fichiers de l'application sont manquants ou corrompus
- Le point d'entrée (index.php) n'est pas accessible

### 2. Problème de configuration Nginx
- Configuration Nginx incorrecte
- Point d'entrée mal configuré
- Redirection vers le mauvais dossier

### 3. Problème de permissions
- Dossiers `storage` et `bootstrap/cache` sans permissions
- Fichiers Laravel non accessibles par le serveur web

### 4. Problème de base de données
- Connexion à la base de données échoue
- Variables d'environnement manquantes ou incorrectes

## 🔍 Étapes de diagnostic et résolution

### Étape 1 : Vérifier le déploiement sur Forge

#### 1.1 Accéder au tableau de bord Forge
```bash
# Ouvrir https://forge.laravel.com
# Se connecter à votre compte
# Sélectionner votre serveur
# Aller dans l'onglet "Sites"
```

#### 1.2 Vérifier l'état du site
- ✅ **Site actif** : Le site doit être marqué comme "Active"
- ✅ **Dernier déploiement** : Vérifier la date du dernier déploiement
- ✅ **Statut du déploiement** : Doit être "Deployed successfully"

#### 1.3 Vérifier le dossier de déploiement
```bash
# Dans Forge, aller dans "Files" pour le site
# Vérifier que le dossier contient :
# - app/
# - bootstrap/
# - config/
# - database/
# - public/
# - resources/
# - routes/
# - storage/
# - vendor/
# - .env
# - artisan
# - composer.json
```

### Étape 2 : Vérifier la configuration Nginx

#### 2.1 Accéder à la configuration Nginx
```bash
# Dans Forge, aller dans "Files" > "Nginx Configuration"
# Vérifier le fichier de configuration
```

#### 2.2 Configuration Nginx attendue
```nginx
server {
    listen 80;
    listen [::]:80;
    server_name api.wozif.com;
    root /home/forge/api.wozif.com/public;

    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";

    index index.php;

    charset utf-8;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    error_page 404 /index.php;

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.1-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}
```

#### 2.3 Points clés à vérifier
- ✅ **Document root** : Doit pointer vers `/public`
- ✅ **FastCGI** : Doit être configuré pour PHP
- ✅ **Try files** : Doit inclure `/index.php?$query_string`

### Étape 3 : Vérifier les permissions des fichiers

#### 3.1 Permissions requises
```bash
# Dossiers
storage/          # 755 (rwxr-xr-x)
bootstrap/cache/  # 755 (rwxr-xr-x)
public/           # 755 (rwxr-xr-x)

# Fichiers
.env              # 644 (rw-r--r--)
artisan           # 755 (rwxr-xr-x)
```

#### 3.2 Commande de correction des permissions
```bash
# Se connecter en SSH au serveur Forge
ssh forge@VOTRE_IP_SERVEUR

# Aller dans le dossier du site
cd /home/forge/api.wozif.com

# Corriger les permissions
sudo chown -R forge:forge .
sudo chmod -R 755 storage bootstrap/cache
sudo chmod 644 .env
sudo chmod 755 artisan
```

### Étape 4 : Vérifier la configuration Laravel

#### 4.1 Vérifier le fichier .env
```bash
# Dans Forge, aller dans "Files" > ".env"
# Vérifier que les variables suivantes sont correctes :
```

```env
APP_NAME=Coovia
APP_ENV=production
APP_DEBUG=false
APP_URL=https://api.wozif.com

DB_CONNECTION=pgsql
DB_HOST=db.xxxxxxxxxxxxx.supabase.co
DB_PORT=5432
DB_DATABASE=postgres
DB_USERNAME=postgres
DB_PASSWORD=[MOT_DE_PASSE_SUPABASE]

CACHE_DRIVER=file
SESSION_DRIVER=file
QUEUE_CONNECTION=sync
```

#### 4.2 Vérifier la configuration de la base de données
```bash
# Tester la connexion à la base de données
# Dans Forge, aller dans "SSH" et exécuter :
cd /home/forge/api.wozif.com
php artisan tinker

# Tester la connexion
DB::connection()->getPdo();
```

### Étape 5 : Vérifier les logs Laravel

#### 5.1 Accéder aux logs
```bash
# Dans Forge, aller dans "Files" > "storage/logs"
# Vérifier le fichier laravel.log le plus récent
```

#### 5.2 Logs à rechercher
```bash
# Erreurs de base de données
"SQLSTATE[HY000] [2002] Connection refused"
"SQLSTATE[HY000] [1045] Access denied"

# Erreurs de permissions
"Permission denied"
"Failed to open stream"

# Erreurs de configuration
"Class not found"
"Undefined variable"
```

### Étape 6 : Redéployer l'application

#### 6.1 Déclencher un nouveau déploiement
```bash
# Dans Forge, aller dans "Sites" > "Deploy Now"
# Ou utiliser la CLI Forge :
forge deploy api.wozif.com
```

#### 6.2 Vérifier le processus de déploiement
```bash
# Surveiller les logs de déploiement
# Vérifier que toutes les étapes passent :
# ✅ Composer install
# ✅ NPM install (si applicable)
# ✅ Artisan commands
# ✅ Permissions
```

### Étape 7 : Tests post-résolution

#### 7.1 Test de base
```bash
# Tester la racine
curl -I https://api.wozif.com

# Tester un endpoint simple
curl https://api.wozif.com/test
```

#### 7.2 Test complet
```bash
# Lancer le diagnostic complet
php diagnostic-forge-backend.php

# Lancer les tests de fonctionnalité
php test-forge-quick.php
```

## 🛠️ Commandes de dépannage avancées

### Vérifier l'état des services
```bash
# Vérifier Nginx
sudo systemctl status nginx

# Vérifier PHP-FPM
sudo systemctl status php8.1-fpm

# Vérifier les logs système
sudo journalctl -u nginx -f
sudo journalctl -u php8.1-fpm -f
```

### Vérifier la configuration PHP
```bash
# Vérifier la version PHP
php -v

# Vérifier les extensions
php -m

# Vérifier la configuration
php --ini
```

### Vérifier la connectivité réseau
```bash
# Tester la connectivité à la base de données
telnet db.xxxxxxxxxxxxx.supabase.co 5432

# Tester DNS
nslookup api.wozif.com

# Tester SSL
openssl s_client -connect api.wozif.com:443
```

## 📞 Support et ressources

### Documentation officielle
- [Laravel Forge Documentation](https://forge.laravel.com/docs)
- [Laravel Deployment Guide](https://laravel.com/docs/deployment)
- [Nginx Configuration](https://nginx.org/en/docs/)

### Communauté
- [Laravel Forums](https://laracasts.com/discuss)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/laravel-forge)
- [Reddit r/laravel](https://reddit.com/r/laravel)

### Support Forge
- [Forge Support](https://forge.laravel.com/support)
- [Status Page](https://status.laravel.com)

## 🎯 Checklist de résolution

- [ ] Vérifier l'état du site dans Forge
- [ ] Vérifier la configuration Nginx
- [ ] Corriger les permissions des fichiers
- [ ] Vérifier le fichier .env
- [ ] Tester la connexion à la base de données
- [ ] Vérifier les logs Laravel
- [ ] Redéployer l'application
- [ ] Tester les endpoints
- [ ] Lancer les tests complets

## 🚀 Après résolution

Une fois les problèmes résolus :

1. **Lancez le test rapide** : `php test-forge-quick.php`
2. **Lancez le test complet** : `php test-forge-backend.php`
3. **Configurez la surveillance** : Intégrez les tests dans votre CI/CD
4. **Documentez la solution** : Notez les étapes pour éviter la récurrence

---

**💡 Conseil :** Commencez toujours par vérifier l'état du déploiement dans Forge, c'est souvent la cause principale des erreurs 500 et 404.
