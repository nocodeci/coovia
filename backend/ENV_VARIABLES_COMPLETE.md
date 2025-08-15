# Variables d'environnement complètes pour Laravel Cloud

## Variables que vous avez déjà configurées
```bash
APP_NAME="coovia"
APP_ENV=production
APP_DEBUG=false
APP_URL="https://coovia-cursor-ozzf9a.laravel.cloud"
LOG_CHANNEL=laravel-cloud-socket
LOG_STDERR_FORMATTER=Monolog\Formatter\JsonFormatter
SESSION_DRIVER=cookie
VITE_APP_NAME="${APP_NAME}"
```

## Variables CRITIQUES manquantes à ajouter

### 1. Clé d'application (OBLIGATOIRE)
```bash
APP_KEY=base64:oSEId0eiMYbFGFE2lsoFGGybp/OXD1oSUlsWHXhD13E=
```

### 2. Configuration de base de données (OBLIGATOIRE)
```bash
DB_CONNECTION=mysql
DB_HOST=VOTRE_HOST_DB
DB_PORT=3306
DB_DATABASE=VOTRE_DATABASE
DB_USERNAME=VOTRE_USERNAME
DB_PASSWORD=VOTRE_PASSWORD
```

### 3. Configuration du cache et sessions (RECOMMANDÉ)
```bash
CACHE_DRIVER=file
QUEUE_CONNECTION=sync
FILESYSTEM_DISK=local
```

## Configuration complète finale

Copiez cette configuration complète dans votre dashboard Laravel Cloud :

```bash
# Variables essentielles
APP_NAME="coovia"
APP_ENV=production
APP_DEBUG=false
APP_URL="https://coovia-cursor-ozzf9a.laravel.cloud"
APP_KEY=base64:oSEId0eiMYbFGFE2lsoFGGybp/OXD1oSUlsWHXhD13E=

# Logs
LOG_CHANNEL=laravel-cloud-socket
LOG_STDERR_FORMATTER=Monolog\Formatter\JsonFormatter

# Sessions
SESSION_DRIVER=cookie

# Cache et queue
CACHE_DRIVER=file
QUEUE_CONNECTION=sync
FILESYSTEM_DISK=local

# Base de données (remplacez par vos vraies valeurs)
DB_CONNECTION=mysql
DB_HOST=VOTRE_HOST_DB
DB_PORT=3306
DB_DATABASE=VOTRE_DATABASE
DB_USERNAME=VOTRE_USERNAME
DB_PASSWORD=VOTRE_PASSWORD

# Frontend
VITE_APP_NAME="${APP_NAME}"
```

## Instructions

1. **Connectez-vous à votre dashboard Laravel Cloud**
2. **Allez dans les paramètres de votre application**
3. **Ajoutez les variables manquantes** (surtout APP_KEY et DB_*)
4. **Redéployez l'application**
5. **Testez l'URL** : `https://coovia-cursor-ozzf9a.laravel.cloud/test`

## Vérification

Après avoir ajouté toutes les variables, testez :
- `https://coovia-cursor-ozzf9a.laravel.cloud/test`
- `https://coovia-cursor-ozzf9a.laravel.cloud/`

## Si vous n'avez pas de base de données

Si vous n'avez pas encore configuré de base de données, utilisez SQLite temporairement :

```bash
DB_CONNECTION=sqlite
DB_DATABASE=/tmp/database.sqlite
```

Puis créez le fichier de base de données :
```bash
touch /tmp/database.sqlite
```
