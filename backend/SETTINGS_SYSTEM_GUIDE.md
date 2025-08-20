# Guide du Système de Paramètres - Coovia

## Vue d'ensemble

Le système de paramètres de Coovia permet de gérer de manière centralisée et flexible tous les paramètres de l'application, des profils utilisateurs et des boutiques.

## Architecture

### 1. Paramètres Globaux (`Settings`)
- **Table**: `settings`
- **Modèle**: `App\Models\Settings`
- **Contrôleur**: `App\Http\Controllers\Api\SettingsController`
- **Service**: `App\Services\SettingsService`

### 2. Profils Utilisateurs (`UserProfile`)
- **Table**: `user_profiles`
- **Modèle**: `App\Models\UserProfile`
- **Contrôleur**: `App\Http\Controllers\Api\ProfileController`

### 3. Paramètres des Boutiques (`StoreSettings`)
- **Table**: `store_settings`
- **Modèle**: `App\Models\StoreSettings`
- **Contrôleur**: `App\Http\Controllers\Api\StoreSettingsController`

## Utilisation

### Paramètres Globaux

#### Via le Service
```php
use App\Services\SettingsService;

// Récupérer un paramètre
$appName = SettingsService::get('app_name', 'Coovia');

// Définir un paramètre
SettingsService::set('app_name', 'Nouveau Nom', 'string', 'general', 'Nom de l\'application', true);

// Récupérer une configuration complète
$appConfig = SettingsService::getAppConfig();
$paymentConfig = SettingsService::getPaymentConfig();
$securityConfig = SettingsService::getSecurityConfig();
```

#### Via l'API
```bash
# Récupérer les paramètres publics
GET /api/settings/public

# Récupérer les paramètres par groupe
GET /api/settings/by-group?group=payment

# Récupérer un paramètre spécifique
GET /api/settings/get?key=app_name

# Définir un paramètre (Admin seulement)
POST /api/settings/set
{
    "key": "app_name",
    "value": "Nouveau Nom",
    "type": "string",
    "group": "general",
    "description": "Nom de l'application",
    "is_public": true
}
```

### Profils Utilisateurs

#### Via l'API
```bash
# Récupérer le profil de l'utilisateur connecté
GET /api/profile

# Mettre à jour le profil
PUT /api/profile
{
    "first_name": "John",
    "last_name": "Doe",
    "display_name": "John Doe",
    "bio": "Développeur passionné",
    "website": "https://example.com",
    "company": "Ma Société",
    "job_title": "Développeur Full-Stack",
    "location": "Abidjan, Côte d'Ivoire",
    "timezone": "Africa/Abidjan",
    "language": "fr",
    "currency": "XOF",
    "social_links": {
        "linkedin": "https://linkedin.com/in/johndoe",
        "twitter": "https://twitter.com/johndoe"
    },
    "preferences": {
        "notifications": {
            "email": true,
            "sms": false,
            "push": true
        },
        "privacy": {
            "profile_visible": true,
            "show_email": false,
            "show_phone": false
        },
        "theme": "light"
    }
}

# Uploader un avatar
POST /api/profile/avatar
Content-Type: multipart/form-data
avatar: [fichier]

# Uploader une image de couverture
POST /api/profile/cover-image
Content-Type: multipart/form-data
cover_image: [fichier]

# Mettre à jour les préférences
PUT /api/profile/preferences
{
    "preferences": {
        "notifications": {
            "email": true,
            "sms": false,
            "push": true
        },
        "privacy": {
            "profile_visible": true,
            "show_email": false,
            "show_phone": false
        },
        "theme": "dark"
    }
}

# Récupérer un profil public
GET /api/profile/public/{userId}
```

### Paramètres des Boutiques

#### Via le Service
```php
use App\Services\SettingsService;

// Récupérer un paramètre de boutique
$storeName = SettingsService::getStoreSetting($storeId, 'store_name', 'Ma Boutique');

// Définir un paramètre de boutique
SettingsService::setStoreSetting($storeId, 'store_name', 'Nouvelle Boutique', 'string', 'general', 'Nom de la boutique');

// Récupérer tous les paramètres d'une boutique
$allSettings = SettingsService::getStoreSettings($storeId);

// Récupérer les paramètres par groupe
$paymentSettings = SettingsService::getStoreSettingsByGroup($storeId, 'payment');

// Initialiser les paramètres par défaut
SettingsService::initializeStoreDefaults($storeId);
```

#### Via l'API
```bash
# Récupérer tous les paramètres d'une boutique
GET /api/store-settings/{storeId}

# Récupérer les paramètres par groupe
GET /api/store-settings/{storeId}/by-group?group=payment

# Récupérer un paramètre spécifique
GET /api/store-settings/{storeId}/get?key=store_name

# Définir un paramètre
POST /api/store-settings/{storeId}/set
{
    "key": "store_name",
    "value": "Nouvelle Boutique",
    "type": "string",
    "group": "general",
    "description": "Nom de la boutique"
}

# Mettre à jour plusieurs paramètres
POST /api/store-settings/{storeId}/update-multiple
{
    "settings": [
        {
            "key": "store_name",
            "value": "Nouvelle Boutique",
            "type": "string",
            "group": "general"
        },
        {
            "key": "payment_methods",
            "value": ["orange_money", "moov_money"],
            "type": "json",
            "group": "payment"
        }
    ]
}

# Supprimer un paramètre
DELETE /api/store-settings/{storeId}/delete
{
    "key": "old_setting"
}

# Initialiser les paramètres par défaut
POST /api/store-settings/{storeId}/initialize-defaults
```

## Types de Paramètres

### Types Supportés
- `string`: Chaîne de caractères
- `integer`: Nombre entier
- `float`: Nombre décimal
- `boolean`: Vrai/Faux
- `json`: Données JSON
- `array`: Tableau (stocké en JSON)

### Groupes de Paramètres

#### Paramètres Globaux
- `general`: Paramètres généraux de l'application
- `payment`: Configuration des paiements
- `email`: Configuration des emails
- `sms`: Configuration des SMS
- `security`: Paramètres de sécurité
- `files`: Configuration des fichiers
- `notifications`: Configuration des notifications
- `seo`: Paramètres SEO

#### Paramètres des Boutiques
- `general`: Paramètres généraux de la boutique
- `payment`: Configuration des paiements de la boutique
- `shipping`: Configuration de la livraison
- `notifications`: Configuration des notifications de la boutique
- `security`: Paramètres de sécurité de la boutique
- `seo`: Paramètres SEO de la boutique

## Configuration par Défaut

### Paramètres Globaux
Les paramètres par défaut sont définis dans `database/seeders/SettingsSeeder.php` et incluent :

- **Général**: Nom, description, logo, favicon, fuseau horaire, langue, devise
- **Paiement**: Passerelles de paiement, devise, capture automatique
- **Email**: Expéditeur, templates
- **SMS**: Fournisseur, numéro d'envoi
- **Sécurité**: Longueur des mots de passe, tentatives de connexion, durée des sessions
- **Fichiers**: Taille maximale, types autorisés, disque de stockage
- **Notifications**: Activation par canal
- **SEO**: Titre, description, mots-clés par défaut

### Paramètres des Boutiques
Les paramètres par défaut sont définis dans `App\Models\StoreSettings::getDefaults()` et incluent :

- **Général**: Nom, description, logo, bannière, thème, devise, langue, fuseau horaire
- **Paiement**: Méthodes de paiement, devise, capture automatique, webhook
- **Livraison**: Activation, méthodes, seuil gratuit, coût par défaut
- **Notifications**: Activation par canal, types de notifications
- **Sécurité**: MFA, timeout de session, tentatives de connexion
- **SEO**: Titre, description, mots-clés, image OG

## Cache

Le système utilise le cache Laravel pour optimiser les performances :

- **Cache des paramètres globaux**: `setting_{key}`
- **Cache des paramètres de boutique**: `store_setting_{storeId}_{key}`
- **Durée de cache**: 1 heure (3600 secondes)

### Gestion du Cache
```php
// Vider le cache des paramètres globaux
SettingsService::clearAllCaches();

// Vider le cache d'une boutique spécifique
StoreSettings::clearCache($storeId);
```

## Sécurité

### Authentification
- Toutes les routes de paramètres et profils nécessitent une authentification
- Seuls les administrateurs peuvent modifier les paramètres globaux
- Les propriétaires de boutiques peuvent modifier les paramètres de leurs boutiques

### Validation
- Validation stricte des types de données
- Validation des valeurs selon le type
- Protection contre les injections SQL

### Permissions
- **Paramètres globaux**: Lecture publique, écriture admin seulement
- **Profils**: Lecture/écriture par l'utilisateur propriétaire, lecture publique limitée
- **Paramètres de boutique**: Lecture/écriture par le propriétaire de la boutique

## Exemples d'Utilisation

### Frontend (React/Vue.js)
```javascript
// Récupérer les paramètres publics
const publicSettings = await fetch('/api/settings/public').then(r => r.json());

// Récupérer le profil utilisateur
const profile = await fetch('/api/profile', {
    headers: { 'Authorization': `Bearer ${token}` }
}).then(r => r.json());

// Mettre à jour un paramètre de boutique
await fetch(`/api/store-settings/${storeId}/set`, {
    method: 'POST',
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        key: 'store_name',
        value: 'Nouvelle Boutique',
        type: 'string',
        group: 'general'
    })
});
```

### Backend (Laravel)
```php
// Dans un contrôleur
use App\Services\SettingsService;

public function index()
{
    $appConfig = SettingsService::getAppConfig();
    $paymentConfig = SettingsService::getPaymentConfig();
    
    return view('dashboard', compact('appConfig', 'paymentConfig'));
}

// Dans un service
public function processPayment($amount, $currency = null)
{
    $currency = $currency ?? SettingsService::get('payment_currency', 'XOF');
    $autoCapture = SettingsService::get('payment_auto_capture', true);
    
    // Logique de paiement...
}
```

## Migration et Maintenance

### Ajouter de Nouveaux Paramètres
1. Ajouter le paramètre dans le seeder approprié
2. Exécuter le seeder : `php artisan db:seed --class=SettingsSeeder`
3. Mettre à jour la documentation

### Modifier des Paramètres Existants
1. Utiliser l'API ou le service pour mettre à jour
2. Vider le cache si nécessaire
3. Tester les fonctionnalités dépendantes

### Supprimer des Paramètres
1. Supprimer via l'API ou directement en base
2. Mettre à jour le code qui utilise ces paramètres
3. Vider le cache

## Bonnes Pratiques

1. **Utiliser le service** plutôt que d'accéder directement aux modèles
2. **Toujours fournir des valeurs par défaut** lors de la récupération
3. **Valider les types** avant de stocker
4. **Utiliser le cache** pour les performances
5. **Documenter** les nouveaux paramètres
6. **Tester** les modifications de paramètres
7. **Sauvegarder** avant les modifications importantes

## Dépannage

### Problèmes Courants

1. **Paramètre non trouvé**
   - Vérifier que le paramètre existe en base
   - Vérifier la casse de la clé
   - Vider le cache

2. **Type incorrect**
   - Vérifier le type déclaré vs la valeur
   - Utiliser `SettingsService::validateSettingValue()`

3. **Cache obsolète**
   - Vider le cache : `SettingsService::clearAllCaches()`
   - Vérifier la durée de cache

4. **Permissions insuffisantes**
   - Vérifier le rôle de l'utilisateur
   - Vérifier la propriété de la boutique

### Commandes Utiles
```bash
# Vider le cache des paramètres
php artisan cache:clear

# Réinitialiser les paramètres par défaut
php artisan db:seed --class=SettingsSeeder

# Vérifier les paramètres en base
php artisan tinker
>>> App\Models\Settings::all()->pluck('key', 'value');
```
