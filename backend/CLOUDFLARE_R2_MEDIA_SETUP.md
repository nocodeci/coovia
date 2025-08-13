# 🚀 Configuration Cloudflare R2 pour les Médias

## 📋 État Actuel

Vos fichiers média sont actuellement stockés **localement** dans :
```
backend/storage/app/public/media/{store_id}/
```

## 🎯 Objectif

Migrer tous les fichiers média vers **Cloudflare R2** pour :
- ✅ **Performance** : Distribution mondiale
- ✅ **Coût** : 90% moins cher qu'AWS S3
- ✅ **Fiabilité** : Infrastructure Cloudflare
- ✅ **Scalabilité** : Illimitée

## 🔧 Configuration Étape par Étape

### 1. **Vérifier les Clés Cloudflare R2**

Vos clés actuelles (dans `.do/app.yaml`) :
```yaml
CLOUDFLARE_R2_ACCESS_KEY_ID: d8bd4ac4100f9d1af000d8b59c0d5810
CLOUDFLARE_R2_SECRET_ACCESS_KEY: 67482928c8d1093677ad71131d0d63dcbf886d4e7385f1b904e7958af159ac1c
CLOUDFLARE_R2_BUCKET: coovia-files
CLOUDFLARE_R2_URL: https://coovia-files.abf701097f61a1d3954f38fcc6b41e83.r2.cloudflarestorage.com
CLOUDFLARE_R2_ENDPOINT: https://abf701097f61a1d3954f38fcc6b41e83.r2.cloudflarestorage.com
```

### 2. **Créer de Nouvelles Clés API**

Si les clés actuelles ne fonctionnent pas :

1. **Allez sur [Cloudflare R2 API Tokens](https://dash.cloudflare.com/r2/api-tokens)**
2. **Cliquez sur "Create API token"**
3. **Configurez :**
   - **Name** : `Coovia Media R2`
   - **Permissions** : `Object Read & Write`
   - **Resources** : `coovia-files` bucket

### 3. **Mettre à Jour le Fichier .env**

```bash
# CLOUDFLARE R2 CONFIGURATION
CLOUDFLARE_R2_ACCESS_KEY_ID=votre_nouvelle_access_key_id
CLOUDFLARE_R2_SECRET_ACCESS_KEY=votre_nouvelle_secret_access_key
CLOUDFLARE_R2_BUCKET=coovia-files
CLOUDFLARE_R2_URL=https://coovia-files.abf701097f61a1d3954f38fcc6b41e83.r2.cloudflarestorage.com
CLOUDFLARE_R2_ENDPOINT=https://abf701097f61a1d3954f38fcc6b41e83.r2.cloudflarestorage.com

# Configuration par défaut pour les fichiers
FILESYSTEM_DISK=r2
```

### 4. **Tester la Configuration**

```bash
cd backend
php setup-cloudflare-r2-media.php
```

### 5. **Activer Cloudflare R2**

Une fois le test réussi :

```bash
# Modifier .env pour utiliser R2
sed -i '' 's/FILESYSTEM_DISK=public/FILESYSTEM_DISK=r2/' .env

# Redémarrer le serveur
php artisan config:clear
php artisan cache:clear
```

## 🔄 Migration des Fichiers Existants

### **Script de Migration Automatique**

Le script `setup-cloudflare-r2-media.php` va :

1. **Tester** la connexion R2
2. **Migrer** tous les fichiers existants
3. **Mettre à jour** les URLs en base de données
4. **Générer** les nouvelles URLs Cloudflare

### **Migration Manuelle**

Si vous préférez migrer manuellement :

```bash
# 1. Lister les fichiers à migrer
find storage/app/public/media -type f -name "*.jpg" -o -name "*.png" -o -name "*.mp4"

# 2. Migrer chaque fichier
php artisan tinker
```

```php
// Dans tinker
use Illuminate\Support\Facades\Storage;
use App\Models\StoreMedia;

$media = StoreMedia::all();
foreach ($media as $item) {
    // Migrer le fichier principal
    if (!str_starts_with($item->url, 'http')) {
        $oldPath = 'public/' . $item->url;
        $newPath = $item->url;
        
        if (Storage::disk('public')->exists($oldPath)) {
            $content = Storage::disk('public')->get($oldPath);
            Storage::disk('r2')->put($newPath, $content);
            $item->url = Storage::disk('r2')->url($newPath);
        }
    }
    
    // Migrer le thumbnail
    if ($item->thumbnail && !str_starts_with($item->thumbnail, 'http')) {
        $oldThumbPath = 'public/' . $item->thumbnail;
        $newThumbPath = $item->thumbnail;
        
        if (Storage::disk('public')->exists($oldThumbPath)) {
            $content = Storage::disk('public')->get($oldThumbPath);
            Storage::disk('r2')->put($newThumbPath, $content);
            $item->thumbnail = Storage::disk('r2')->url($newThumbPath);
        }
    }
    
    $item->save();
}
```

## 📁 Structure Finale dans Cloudflare R2

```
coovia-files/
├── media/
│   ├── {store_id}/
│   │   ├── IMG_1228.JPG
│   │   ├── IMG_1256.JPG
│   │   └── thumbnails/
│   │       ├── thumb_IMG_1228.JPG
│   │       └── thumb_IMG_1256.JPG
├── store-logos/
│   └── {store_slug}/
└── products/
    ├── original/
    ├── thumbnail/
    └── medium/
```

## 🌐 URLs d'Accès

Après migration, vos images seront accessibles via :

```
https://coovia-files.abf701097f61a1d3954f38fcc6b41e83.r2.cloudflarestorage.com/media/{store_id}/IMG_1228.JPG
```

## 🧪 Tests de Validation

### **Test d'Upload**

```bash
# Test via API
curl -X POST http://localhost:8000/api/stores/{store_id}/media \
  -H "Authorization: Bearer {token}" \
  -F "files[]=@test-image.jpg"
```

### **Test d'Affichage**

1. **Ouvrir** votre application
2. **Aller** dans la bibliothèque média
3. **Vérifier** que les images s'affichent
4. **Tester** l'upload de nouveaux fichiers

## 🔍 Monitoring

### **Dashboard Cloudflare R2**

- **URL** : https://dash.cloudflare.com/r2
- **Métriques** : Storage, Bandwidth, Requests

### **Logs Laravel**

```bash
tail -f storage/logs/laravel.log | grep "Cloudflare\|R2"
```

## 🚨 Dépannage

### **Problèmes Courants**

1. **Erreur SignatureDoesNotMatch**
   - Vérifiez les clés API
   - Régénérez les clés si nécessaire

2. **Fichiers non trouvés**
   - Vérifiez les chemins de migration
   - Relancez la migration

3. **URLs malformées**
   - Vérifiez la configuration R2
   - Redémarrez le serveur

### **Rollback**

Si nécessaire, revenez au stockage local :

```bash
# Modifier .env
FILESYSTEM_DISK=public

# Redémarrer
php artisan config:clear
```

## 🎉 Avantages de la Migration

- ✅ **Performance** : Réseau global Cloudflare
- ✅ **Coût** : 90% moins cher qu'AWS S3
- ✅ **Fiabilité** : Infrastructure enterprise
- ✅ **CDN** : Distribution mondiale automatique
- ✅ **Sécurité** : Chiffrement en transit et au repos
- ✅ **Scalabilité** : Illimitée

## 📞 Support

- **Documentation** : [Cloudflare R2 Docs](https://developers.cloudflare.com/r2/)
- **Dashboard** : [Cloudflare R2](https://dash.cloudflare.com/r2)
- **Community** : [Cloudflare Community](https://community.cloudflare.com/)
