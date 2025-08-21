# 🔒 Configuration SSL pour Supabase

## 📋 Configuration de Base

### 1. Modifier config/database.php

Ajouter la configuration SSL pour PostgreSQL :

```php
'pgsql' => [
    'driver' => 'pgsql',
    'url' => env('DB_URL'),
    'host' => env('DB_HOST', '127.0.0.1'),
    'port' => env('DB_PORT', '5432'),
    'database' => env('DB_DATABASE', 'laravel'),
    'username' => env('DB_USERNAME', 'root'),
    'password' => env('DB_PASSWORD', ''),
    'charset' => env('DB_CHARSET', 'utf8'),
    'prefix' => '',
    'prefix_indexes' => true,
    'search_path' => 'public',
    'sslmode' => 'require', // Ajouter cette ligne
],
```

### 2. Variables d'Environnement SSL

Dans Render, ajouter ces variables :

```
# SSL Configuration pour Supabase
DB_SSLMODE=require
DB_SSL_CERT=
DB_SSL_KEY=
DB_SSL_CA=
```

## 🚨 Erreurs SSL Courantes

### Erreur: "SSL connection required"

**Solution**: Ajouter `'sslmode' => 'require'` dans la config PostgreSQL.

### Erreur: "Certificate verification failed"

**Solution**: Utiliser `'sslmode' => 'prefer'` au lieu de `'require'`.

### Erreur: "Connection timeout"

**Solution**: Vérifier que le host Supabase est correct.

## 🔧 Test de Connexion SSL

```bash
# Tester la connexion avec SSL
php artisan tinker --execute="
try {
    DB::connection()->getPdo();
    echo '✅ Connexion SSL OK';
} catch(Exception \$e) {
    echo '❌ Erreur SSL: ' . \$e->getMessage();
}
"
```

## 📊 Monitoring SSL

### Vérifier les Logs SSL
```bash
# Dans les logs Render
grep -i ssl storage/logs/laravel.log
```

### Tester la Connexion
```bash
# Test simple
curl https://coovia-backend.onrender.com/api/health

# Test avec verbose
curl -v https://coovia-backend.onrender.com/api/health
```

## 🔒 Bonnes Pratiques SSL

1. **Toujours utiliser SSL** avec Supabase
2. **Vérifier les certificats** régulièrement
3. **Monitorer les erreurs SSL** dans les logs
4. **Tester la connexion** après chaque déploiement

## 📞 Support SSL

- **Supabase**: Dashboard → Settings → Database
- **Render**: Logs → Runtime Logs
- **Laravel**: `storage/logs/laravel.log`
