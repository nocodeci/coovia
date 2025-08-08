# 🚀 Configuration Rapide Cloudflare R2

## ✅ Informations R2 Configurées

- **Account ID** : `abf701097f61a1d3954f38fcc6b41e83`
- **Bucket** : `coovia-files`
- **Endpoint** : `https://abf701097f61a1d3954f38fcc6b41e83.r2.cloudflarestorage.com`
- **URL** : `https://coovia-files.abf701097f61a1d3954f38fcc6b41e83.r2.cloudflarestorage.com`

## 🔐 Étapes pour Finaliser la Configuration

### 1. Créer un API Token R2

1. **Allez sur [Cloudflare R2 API Tokens](https://dash.cloudflare.com/r2/api-tokens)**
2. **Cliquez sur "Create API token"**
3. **Configurez :**
   - **Name** : `Coovia R2 Access`
   - **Permissions** : `Object Read & Write`
   - **Resources** : `coovia-files` bucket

### 2. Récupérer les Clés

Après création, vous obtiendrez :
- **Access Key ID** : `xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
- **Secret Access Key** : `xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

### 3. Configurer les Variables d'Environnement

Ajoutez à votre fichier `.env` :

```bash
CLOUDFLARE_R2_ACCESS_KEY_ID=your_access_key_id
CLOUDFLARE_R2_SECRET_ACCESS_KEY=your_secret_access_key
CLOUDFLARE_R2_BUCKET=coovia-files
CLOUDFLARE_R2_URL=https://coovia-files.abf701097f61a1d3954f38fcc6b41e83.r2.cloudflarestorage.com
CLOUDFLARE_R2_ENDPOINT=https://abf701097f61a1d3954f38fcc6b41e83.r2.cloudflarestorage.com
FILESYSTEM_DISK=r2
```

### 4. Tester la Connexion

```bash
# Avec vos vraies clés
php test-r2-connection.php
```

## 🌐 API Endpoints Prêts

### Upload Fichier
```bash
curl -X POST http://localhost:8000/api/files/upload \
  -F "file=@image.jpg" \
  -F "path=products"
```

### Upload Image avec Redimensionnement
```bash
curl -X POST http://localhost:8000/api/files/upload-image \
  -F "image=@product.jpg" \
  -F "path=products" \
  -F "sizes[thumbnail]=[150,150]" \
  -F "sizes[medium]=[300,300]"
```

### Supprimer Fichier
```bash
curl -X DELETE http://localhost:8000/api/files/delete \
  -H "Content-Type: application/json" \
  -d '{"path": "products/image.jpg"}'
```

### Lister Fichiers
```bash
curl -X GET "http://localhost:8000/api/files/list?path=products"
```

## 📁 Structure de Dossiers Recommandée

```
coovia-files/
├── products/
│   ├── original/
│   ├── thumbnail/
│   ├── medium/
│   └── large/
├── users/
│   └── avatars/
├── stores/
│   └── logos/
└── uploads/
    └── documents/
```

## 🎯 Utilisation dans le Code

### Upload Simple
```php
use App\Helpers\FileUploadHelper;

$file = $request->file('image');
$path = FileUploadHelper::uploadToR2($file, 'products');
$url = FileUploadHelper::getUrl($path);
```

### Upload avec Redimensionnement
```php
$sizes = [
    'thumbnail' => [150, 150],
    'medium' => [300, 300],
    'large' => [800, 800]
];

$urls = FileUploadHelper::uploadImage($file, 'products', $sizes);
// Retourne: ['original' => url, 'thumbnail' => url, 'medium' => url, 'large' => url]
```

## 🚀 Déploiement

### Variables DigitalOcean
Dans votre dashboard DigitalOcean, ajoutez :
- `CLOUDFLARE_R2_ACCESS_KEY_ID`
- `CLOUDFLARE_R2_SECRET_ACCESS_KEY`

### Variables Railway
Dans votre dashboard Railway, ajoutez les mêmes variables.

## 🔍 Monitoring

### Vérifier l'Usage
- **Dashboard R2** : [Cloudflare R2](https://dash.cloudflare.com/r2)
- **Métriques** : Storage, Bandwidth, Requests

### Logs Laravel
```bash
tail -f storage/logs/laravel.log | grep "FileUploadHelper"
```

## 🎉 Avantages

1. **💰 Coût** : 90% moins cher qu'AWS S3
2. **⚡ Performance** : Réseau global Cloudflare
3. **🔒 Sécurité** : Chiffrement automatique
4. **🌍 CDN** : Distribution mondiale
5. **📈 Scalabilité** : Illimitée

## 🚨 Support

- **Documentation** : [Cloudflare R2 Docs](https://developers.cloudflare.com/r2/)
- **Support** : Via dashboard Cloudflare
- **Community** : [Cloudflare Community](https://community.cloudflare.com/)
