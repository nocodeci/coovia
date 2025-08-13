# 🚀 Guide d'Utilisation Cloudflare R2 Upload

## 📋 Vue d'ensemble

Ce guide explique comment utiliser le système d'upload Cloudflare R2 intégré dans votre application Coovia/Wozif.

## ✅ Configuration Actuelle

### **Variables d'environnement (.env)**
```env
CLOUDFLARE_ACCOUNT_ID=abf701097f61a1d3954f38fcc6b41e83
CLOUDFLARE_ACCESS_KEY_ID=d8bd4ac4100f9d1af000d8b59c0d5810
CLOUDFLARE_SECRET_ACCESS_KEY=8ea7901e6e17e1eca1995fdd72631ddc3bd44aeaf365954ba93ceb0885a89c5c
CLOUDFLARE_R2_BUCKET=coovia-files
CLOUDFLARE_R2_ENDPOINT=https://abf701097f61a1d3954f38fcc6b41e83.r2.cloudflarestorage.com
CLOUDFLARE_R2_PUBLIC_URL=https://coovia-files.abf701097f61a1d3954f38fcc6b41e83.r2.cloudflarestorage.com
```

### **Bucket existant**
- **Nom** : `coovia-files`
- **Fichiers** : 49 fichiers déjà présents
- **Structure** : Organisé par stores et types

## 🔌 Routes API Disponibles

### **1. Upload Simple**
```http
POST /api/cloudflare/upload
Content-Type: multipart/form-data

file: [fichier]
directory: string (optionnel)
```

### **2. Upload Multiple**
```http
POST /api/cloudflare/upload-multiple
Content-Type: multipart/form-data

files[]: [fichier1]
files[]: [fichier2]
directory: string (optionnel)
```

### **3. Upload Frontend (Recommandé)**
```http
POST /api/cloudflare/upload-frontend
Content-Type: multipart/form-data

file: [fichier]
type: image|video|document|avatar|product
store_id: number (optionnel)
```

### **4. Supprimer un fichier**
```http
DELETE /api/cloudflare/delete
Content-Type: application/json

{
  "path": "chemin/vers/fichier.jpg"
}
```

### **5. Informations sur un fichier**
```http
GET /api/cloudflare/info?path=chemin/vers/fichier.jpg
```

## 🎯 Utilisation Frontend

### **Composant React CloudflareUpload**

```tsx
import { CloudflareUpload } from '../components/CloudflareUpload';

// Upload simple
<CloudflareUpload
  onUploadSuccess={(result) => console.log('Succès:', result)}
  onUploadError={(error) => console.error('Erreur:', error)}
  directory="products"
  type="image"
  storeId={1}
/>

// Upload multiple
<CloudflareUpload
  multiple={true}
  accept="image/*"
  maxSize={5 * 1024 * 1024} // 5MB
  directory="galleries"
  type="image"
/>
```

### **Propriétés du composant**
- `multiple` : Upload multiple (défaut: false)
- `accept` : Types de fichiers acceptés
- `maxSize` : Taille maximale en bytes
- `directory` : Répertoire de destination
- `type` : Type de fichier (image, video, document, avatar, product)
- `storeId` : ID de la boutique (optionnel)

## 📁 Structure des Répertoires

### **Organisation recommandée**
```
coovia-files/
├── stores/
│   ├── {store_id}/
│   │   ├── products/          # Images de produits
│   │   ├── avatars/           # Avatars utilisateurs
│   │   ├── galleries/         # Galeries photos
│   │   └── documents/         # Documents
├── global/
│   ├── logos/                 # Logos système
│   ├── banners/               # Bannières
│   └── icons/                 # Icônes
└── temp/                      # Fichiers temporaires
```

## 🖼️ Gestion des Images

### **Thumbnails automatiques**
Les images génèrent automatiquement des thumbnails :
- **Small** : 150x150px
- **Medium** : 300x300px
- **Large** : 600x600px

### **URLs disponibles**
```json
{
  "urls": {
    "original": "https://coovia-files.../image.jpg",
    "cdn": "https://coovia-files.../image.jpg",
    "thumbnails": {
      "small": "https://coovia-files.../thumbnails/image_small.jpg",
      "medium": "https://coovia-files.../thumbnails/image_medium.jpg",
      "large": "https://coovia-files.../thumbnails/image_large.jpg"
    }
  }
}
```

## 🔒 Sécurité

### **Types de fichiers autorisés**
- **Images** : jpg, jpeg, png, gif, webp, svg
- **Vidéos** : mp4, avi, mov, wmv, flv, webm
- **Documents** : pdf, doc, docx, txt

### **Limitations**
- **Taille maximale** : 10MB par fichier
- **Validation** : Type MIME et extension
- **Noms de fichiers** : Génération automatique sécurisée

## 🧪 Tests

### **Script de test**
```bash
php test-cloudflare-r2.php
```

### **Test via cURL**
```bash
# Test d'upload
curl -X POST http://localhost:8000/api/cloudflare/upload-frontend \
  -F "file=@test.jpg" \
  -F "type=image" \
  -F "store_id=1"

# Test d'info
curl -X GET "http://localhost:8000/api/cloudflare/info?path=test/image.jpg"
```

## 📊 Monitoring

### **Logs Laravel**
```bash
tail -f storage/logs/laravel.log | grep "Cloudflare\|R2"
```

### **Dashboard Cloudflare**
- **URL** : https://dash.cloudflare.com/r2
- **Métriques** : Storage, Bandwidth, Requests

## 🚀 Intégration dans l'Application

### **1. Dans les formulaires de produits**
```tsx
// ProductForm.tsx
const [productImages, setProductImages] = useState<string[]>([]);

const handleImageUpload = (result) => {
  if (result.success) {
    setProductImages(prev => [...prev, result.urls.original]);
  }
};

<CloudflareUpload
  onUploadSuccess={handleImageUpload}
  directory={`stores/${storeId}/products`}
  type="product"
  storeId={storeId}
/>
```

### **2. Dans les profils utilisateurs**
```tsx
// UserProfile.tsx
const handleAvatarUpload = (result) => {
  if (result.success) {
    setAvatarUrl(result.urls.original);
  }
};

<CloudflareUpload
  onUploadSuccess={handleAvatarUpload}
  directory={`stores/${storeId}/avatars`}
  type="avatar"
  storeId={storeId}
  multiple={false}
/>
```

### **3. Dans les galeries**
```tsx
// Gallery.tsx
const handleGalleryUpload = (result) => {
  if (result.success) {
    addImageToGallery(result);
  }
};

<CloudflareUpload
  onUploadSuccess={handleGalleryUpload}
  directory={`stores/${storeId}/galleries`}
  type="image"
  storeId={storeId}
  multiple={true}
/>
```

## 🔧 Dépannage

### **Erreurs courantes**

1. **"Fichier trop volumineux"**
   - Vérifiez `CLOUDFLARE_MAX_FILE_SIZE` dans .env
   - Limite par défaut : 10MB

2. **"Type de fichier non autorisé"**
   - Vérifiez la configuration dans `config/cloudflare.php`
   - Ajoutez le type si nécessaire

3. **"Échec de l'upload vers Cloudflare R2"**
   - Vérifiez les clés API dans .env
   - Vérifiez la connectivité réseau
   - Consultez les logs Laravel

4. **"CORS Policy Blocked"**
   - Vérifiez la configuration CORS dans `config/cors.php`
   - Ajoutez votre domaine frontend

### **Commandes utiles**
```bash
# Vider le cache
php artisan config:clear
php artisan cache:clear

# Tester la configuration
php test-cloudflare-r2.php

# Vérifier les logs
tail -f storage/logs/laravel.log
```

## 📈 Performance

### **Avantages Cloudflare R2**
- **Latence** : < 50ms dans le monde entier
- **Bande passante** : Illimitée
- **Stockage** : 90% moins cher qu'AWS S3
- **CDN** : Distribution automatique

### **Optimisations recommandées**
1. **Compression** : Images automatiquement optimisées
2. **Cache** : Headers de cache appropriés
3. **Thumbnails** : Génération à la demande
4. **Lazy loading** : Chargement différé des images

## 🎉 Conclusion

Votre système d'upload Cloudflare R2 est maintenant opérationnel ! 

**Prochaines étapes :**
1. Intégrer le composant dans vos formulaires
2. Tester avec différents types de fichiers
3. Monitorer l'usage dans le dashboard Cloudflare
4. Optimiser selon vos besoins spécifiques

**Support :**
- Documentation Cloudflare R2 : https://developers.cloudflare.com/r2/
- Dashboard : https://dash.cloudflare.com/r2
- Logs : `storage/logs/laravel.log`
