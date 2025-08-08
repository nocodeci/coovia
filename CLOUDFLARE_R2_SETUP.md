# 🚀 Configuration Cloudflare R2 pour Coovia

## 📋 Prérequis

1. **Compte Cloudflare** : Créez un compte sur [cloudflare.com](https://cloudflare.com)
2. **R2 Storage** : Activez R2 dans votre dashboard Cloudflare
3. **API Tokens** : Générez les tokens nécessaires

## 🔧 Configuration Cloudflare R2

### 1. Créer un Bucket R2

1. **Allez sur [Cloudflare R2](https://dash.cloudflare.com/r2)**
2. **Cliquez sur "Create bucket"**
3. **Nommez votre bucket** (ex: `coovia-files`)
4. **Choisissez la région** (ex: `auto`)

### 2. Créer un API Token

1. **Allez sur [API Tokens](https://dash.cloudflare.com/profile/api-tokens)**
2. **Cliquez sur "Create Token"**
3. **Utilisez le template "Custom token"**
4. **Configurez les permissions :**
   - **Zone Resources** : Include → All zones
   - **Account Resources** : Include → All accounts
   - **Permissions** :
     - Account → Cloudflare R2 → Edit
     - Zone → Cloudflare R2 → Edit

### 3. Obtenir les Informations de Connexion

1. **Access Key ID** : Dans R2 → Manage R2 API tokens
2. **Secret Access Key** : Copiez le secret généré
3. **Bucket Name** : Le nom de votre bucket
4. **Account ID** : Votre ID de compte Cloudflare

## 🔐 Variables d'Environnement

Ajoutez ces variables à votre fichier `.env` :

```bash
# Cloudflare R2 Configuration
CLOUDFLARE_R2_ACCESS_KEY_ID=your_access_key_id
CLOUDFLARE_R2_SECRET_ACCESS_KEY=your_secret_access_key
CLOUDFLARE_R2_BUCKET=your_bucket_name
CLOUDFLARE_R2_URL=https://your-bucket.your-subdomain.r2.cloudflarestorage.com
CLOUDFLARE_R2_ENDPOINT=https://your-account-id.r2.cloudflarestorage.com

# Configuration par défaut
FILESYSTEM_DISK=r2
```

## 🚀 Utilisation

### Upload de Fichier Simple

```php
use App\Helpers\FileUploadHelper;

// Upload un fichier
$file = $request->file('file');
$path = FileUploadHelper::uploadToR2($file, 'uploads');
$url = FileUploadHelper::getUrl($path);
```

### Upload d'Image avec Redimensionnement

```php
// Upload avec différentes tailles
$sizes = [
    'thumbnail' => [150, 150],
    'medium' => [300, 300],
    'large' => [800, 800]
];

$urls = FileUploadHelper::uploadImage($file, 'products', $sizes);
```

### API Endpoints

```bash
# Upload fichier
POST /api/files/upload
Content-Type: multipart/form-data
file: [fichier]
path: uploads

# Upload image
POST /api/files/upload-image
Content-Type: multipart/form-data
image: [image]
path: products
sizes: {"thumbnail":[150,150],"medium":[300,300]}

# Supprimer fichier
DELETE /api/files/delete
Content-Type: application/json
{
    "path": "uploads/filename.jpg"
}

# Lister fichiers
GET /api/files/list?path=uploads
```

## �� Avantages de Cloudflare R2

1. **💰 Coût réduit** : 90% moins cher qu'AWS S3
2. **⚡ Performance** : Réseau global Cloudflare
3. **🔒 Sécurité** : Chiffrement en transit et au repos
4. **🌍 CDN intégré** : Distribution mondiale
5. **📈 Scalabilité** : Illimitée

## 🛠️ Test de Configuration

```bash
# Tester l'upload
curl -X POST http://localhost:8000/api/files/upload \
  -F "file=@test.jpg" \
  -F "path=test"

# Tester l'upload d'image
curl -X POST http://localhost:8000/api/files/upload-image \
  -F "image=@product.jpg" \
  -F "path=products"
```

## 🔍 Monitoring

### Vérifier l'Usage

1. **Dashboard Cloudflare R2** : Voir l'utilisation
2. **Logs Laravel** : Surveiller les uploads
3. **Métriques** : Bandwidth, requests, storage

### Alertes

Configurez des alertes pour :
- **Usage storage** > 80%
- **Bandwidth** > limites
- **Erreurs d'upload** > seuil

## 🚨 Dépannage

### Problèmes Courants

1. **Erreur d'authentification**
   - Vérifiez les API tokens
   - Vérifiez les permissions

2. **Erreur de bucket**
   - Vérifiez le nom du bucket
   - Vérifiez la région

3. **Erreur d'upload**
   - Vérifiez la taille du fichier
   - Vérifiez les permissions du bucket

## 📝 Notes Importantes

1. **CORS** : Configurez CORS si nécessaire
2. **Cache** : Utilisez le cache Cloudflare
3. **Backup** : Configurez des sauvegardes
4. **Monitoring** : Surveillez l'usage

## 🎯 Prochaines Étapes

1. **Configurer le bucket** dans Cloudflare
2. **Ajouter les variables** d'environnement
3. **Tester l'upload** avec l'API
4. **Intégrer** dans vos formulaires
5. **Configurer le monitoring**
