# 🔧 Guide de Résolution - Upload Cloudflare

## 🚨 **Problème Identifié**

L'endpoint `/api/cloudflare/upload` retourne une erreur 500 avec le message :
```
"Undefined array key 'public_url'"
```

## 🔍 **Cause du Problème**

Le service `CloudflareUploadService` fait référence à des clés de configuration qui n'existent pas :
- `$this->config['r2']['public_url']` → devrait être `$this->config['r2']['url']`
- `$this->config['upload']['thumbnail_sizes']` → devrait être `$this->config['upload']['thumbnails']`
- `$this->config['upload']['image_quality']` → n'existe pas

## ✅ **Corrections Appliquées**

### 1. **Fichier Modifié** : `app/Services/CloudflareUploadService.php`

```php
// AVANT (ligne 219)
$publicUrl = $this->config['r2']['public_url'];

// APRÈS
$publicUrl = $this->config['r2']['url'] ?? $this->config['r2']['public_url'] ?? null;
```

```php
// AVANT (ligne 170)
$sizes = $this->config['upload']['thumbnail_sizes'];

// APRÈS
$sizes = $this->config['upload']['thumbnails'] ?? [];
```

```php
// AVANT (ligne 185)
$thumbnailData = $thumbnail->toJpeg($this->config['upload']['image_quality']);

// APRÈS
$thumbnailData = $thumbnail->toJpeg(80); // Qualité par défaut
```

```php
// AVANT (ligne 160)
$imageTypes = $this->config['upload']['allowed_types']['image'];

// APRÈS
$imageTypes = $this->config['upload']['allowed_types']['images'] ?? [];
```

## 🚀 **Étapes de Déploiement**

### **1. Redémarrer le Serveur Forge**

Les modifications ont été poussées sur GitHub, mais le serveur Forge doit être redémarré :

```bash
# Sur le serveur Forge
sudo systemctl restart php8.2-fpm
sudo systemctl restart nginx
```

### **2. Vérifier la Configuration**

Assurez-vous que les variables d'environnement sont correctement configurées :

```env
CLOUDFLARE_R2_ACCESS_KEY_ID=your_access_key
CLOUDFLARE_R2_SECRET_ACCESS_KEY=your_secret_key
CLOUDFLARE_R2_BUCKET=your_bucket_name
CLOUDFLARE_R2_URL=https://your-bucket.your-subdomain.r2.cloudflarestorage.com
CLOUDFLARE_R2_PUBLIC_URL=https://your-public-domain.com
```

### **3. Test de Validation**

Après le redémarrage, testez l'upload :

```bash
curl -X POST https://api.wozif.com/api/cloudflare/upload \
  -F "file=@test-file.txt" \
  -F "type=document" \
  -F "store_id=9fbbeec1-6aab-4de3-a152-9cf8ae719f62" \
  -H "Origin: https://app.wozif.store"
```

## 📋 **Structure de Configuration Attendue**

### **`config/cloudflare.php`**
```php
'r2' => [
    'driver' => 's3',
    'key' => env('CLOUDFLARE_R2_ACCESS_KEY_ID'),
    'secret' => env('CLOUDFLARE_R2_SECRET_ACCESS_KEY'),
    'region' => 'auto',
    'bucket' => env('CLOUDFLARE_R2_BUCKET'),
    'url' => env('CLOUDFLARE_R2_URL'),           // ← Utilisé par le service
    'endpoint' => env('CLOUDFLARE_R2_ENDPOINT'),
    'use_path_style_endpoint' => false,
],
```

### **`config/filesystems.php`**
```php
'r2' => [
    'driver' => 's3',
    'key' => env('CLOUDFLARE_ACCESS_KEY_ID'),
    'secret' => env('CLOUDFLARE_SECRET_ACCESS_KEY'),
    'region' => 'auto',
    'bucket' => env('CLOUDFLARE_R2_BUCKET'),
    'url' => env('CLOUDFLARE_R2_PUBLIC_URL'),    // ← Utilisé par le disque
    'endpoint' => env('CLOUDFLARE_R2_ENDPOINT'),
    'use_path_style_endpoint' => false,
    'throw' => false,
    'visibility' => 'public',
],
```

## 🔧 **Dépannage Supplémentaire**

### **Si l'erreur persiste après redémarrage :**

1. **Vérifier les logs Laravel** :
   ```bash
   tail -f /var/www/coovia/storage/logs/laravel.log
   ```

2. **Vérifier la configuration en temps réel** :
   ```bash
   php artisan config:cache --clear
   php artisan config:show cloudflare
   ```

3. **Tester la connexion R2** :
   ```bash
   php artisan tinker
   Storage::disk('r2')->listContents('/', false);
   ```

## 📝 **Notes Importantes**

- **Redémarrage obligatoire** : Les modifications de code ne prennent effet qu'après redémarrage du serveur
- **Configuration cohérente** : Assurez-vous que les variables d'environnement correspondent aux clés utilisées dans le code
- **Logs détaillés** : Le service logge toutes les erreurs pour faciliter le débogage

## 🎯 **Résultat Attendu**

Après application des corrections et redémarrage du serveur :
- ✅ Upload de fichiers vers Cloudflare R2 fonctionnel
- ✅ Génération automatique de thumbnails pour les images
- ✅ URLs publiques correctement générées
- ✅ Intégration complète avec le frontend
