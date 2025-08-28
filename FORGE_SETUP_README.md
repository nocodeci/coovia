# 🚀 Configuration Automatique Forge - CORS + PHP-FPM

Ce script configure automatiquement votre serveur Forge pour résoudre les problèmes CORS et PHP-FPM.

## 📋 Prérequis

- ✅ Laravel Forge SDK installé (`composer require laravel/forge-sdk`)
- ✅ Accès à votre dashboard Forge
- ✅ Token d'API Forge
- ✅ ID de votre serveur

## 🔧 Configuration

### 1. Modifiez le fichier `forge-config.php`

```php
return [
    // Token d'API Forge (trouvez-le dans votre dashboard Forge)
    'token' => 'VOTRE_VRAI_TOKEN_ICI',
    
    // ID du serveur (trouvez-le dans l'URL de votre serveur sur Forge)
    'server_id' => 'VOTRE_VRAI_SERVER_ID',
    
    // Nom du site (votre domaine)
    'site_name' => 'api.wozif.com',
    
    // Version PHP (83 = PHP 8.3)
    'php_version' => '83',
];
```

### 2. Comment trouver ces informations

#### Token Forge
1. Allez sur [https://forge.laravel.com](https://forge.laravel.com)
2. Cliquez sur votre profil (en haut à droite)
3. Cliquez sur "API Tokens"
4. Créez un nouveau token ou copiez un existant

#### Server ID
1. Dans votre dashboard Forge
2. Cliquez sur votre serveur
3. L'ID est dans l'URL: `https://forge.laravel.com/servers/123456`
4. Le nombre `123456` est votre `server_id`

#### Site Name
- C'est votre domaine: `api.wozif.com`

#### PHP Version
- `83` = PHP 8.3
- `82` = PHP 8.2
- `81` = PHP 8.1

## 🚀 Exécution

### Option 1: Script complet (recommandé)
```bash
php run-forge-config.php
```

### Option 2: Scripts séparés
```bash
# Configuration PHP-FPM uniquement
php configure-forge-php.php

# Configuration Nginx uniquement
php configure-forge-cors.php
```

## 🎯 Ce que fait le script

### 1. Configuration PHP-FPM
- ✅ Timeouts augmentés à 300 secondes
- ✅ Optimisation des processus
- ✅ Configuration Supabase
- ✅ Optimisations mémoire et performance

### 2. Configuration Nginx
- ✅ Headers CORS forcés sur toutes les routes
- ✅ Gestion OPTIONS (préflight CORS)
- ✅ Timeouts PHP-FPM synchronisés
- ✅ Headers CORS même en cas d'erreur

## 🔍 Vérification

Après exécution, testez immédiatement :

### 1. Test API
```bash
# Test CORS sur une route POST
curl -v "https://api.wozif.com/api/auth/validate-email" \
  -H "Origin: https://app.wozif.store" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com"}'
```

### 2. Test Frontend
1. Allez sur [https://app.wozif.store/sign-in](https://app.wozif.store/sign-in)
2. Entrez un email
3. Vérifiez qu'il n'y a plus d'erreur CORS dans la console

## 🚨 En cas d'erreur

### Erreur de configuration
```
❌ ERREUR: Configuration manquante pour 'token'
📋 Modifiez le fichier forge-config.php avec vos vraies informations
```
**Solution** : Vérifiez que vous avez bien modifié `forge-config.php`

### Erreur de connexion
```
❌ ERREUR: Could not connect to Forge
```
**Solution** : Vérifiez votre token et votre connexion internet

### Erreur de serveur
```
❌ ERREUR: Server not found
```
**Solution** : Vérifiez votre `server_id`

## 📁 Fichiers créés

- `forge-config.php` - Configuration Forge
- `run-forge-config.php` - Script principal
- `configure-forge-cors.php` - Configuration Nginx uniquement
- `configure-forge-php.php` - Configuration PHP-FPM uniquement

## 🎉 Résultat attendu

Après exécution réussie :

```
🎉 CONFIGURATION TERMINÉE AVEC SUCCÈS !
========================================
✅ PHP-FPM: Timeouts à 300 secondes
✅ Nginx: Headers CORS forcés
✅ CORS: Fonctionne sur toutes les routes
✅ Frontend: Peut maintenant communiquer

🌐 Testez immédiatement sur: https://app.wozif.store/sign-in
🔍 Plus d'erreur CORS dans la console du navigateur
```

## 🔄 Rollback

Si quelque chose ne va pas, vous pouvez toujours :

1. **Revenir à la configuration précédente** via le dashboard Forge
2. **Restaurer** vos sauvegardes
3. **Contacter le support** Forge

## 📞 Support

- **Forge Documentation** : [https://forge.laravel.com/docs](https://forge.laravel.com/docs)
- **Laravel Forge SDK** : [https://github.com/laravel/forge-sdk](https://github.com/laravel/forge-sdk)

---

**⚠️ Important** : Ce script modifie la configuration de votre serveur de production. Testez d'abord sur un serveur de développement si possible.
