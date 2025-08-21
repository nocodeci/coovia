# 🚀 Guide de Démarrage Rapide Cloudflare R2

## ✅ **Configuration Terminée !**

Votre système d'upload Cloudflare R2 est maintenant opérationnel. Voici comment l'utiliser :

## 🎯 **Démarrage Rapide**

### **1. Démarrer les serveurs**
```bash
# Backend (dans le dossier backend)
php artisan serve --port=8000

# Frontend (dans le dossier frontend)
npm run dev
```

### **2. Tester l'upload**
- Ouvrez votre application frontend
- Naviguez vers la page de test Cloudflare (si créée)
- Ou intégrez le composant `CloudflareUpload` dans vos formulaires

## 🔧 **Composant React Prêt à l'Emploi**

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

## 📡 **Routes API Disponibles**

### **Upload**
- `POST /api/cloudflare/upload` - Upload simple
- `POST /api/cloudflare/upload-multiple` - Upload multiple
- `POST /api/cloudflare/upload-frontend` - Upload depuis le frontend

### **Gestion**
- `DELETE /api/cloudflare/delete` - Supprimer un fichier
- `GET /api/cloudflare/info` - Informations sur un fichier

## 🎨 **Fonctionnalités**

- ✅ **Drag & Drop** - Interface moderne
- ✅ **Thumbnails automatiques** - 150px, 300px, 600px
- ✅ **Validation des fichiers** - Types et tailles
- ✅ **URLs CDN** - Performance optimale
- ✅ **Gestion d'erreurs** - Complète
- ✅ **Support multi-fichiers** - Upload en lot

## 📁 **Structure des Fichiers**

```
coovia-files/
├── stores/
│   ├── {store_id}/
│   │   ├── products/     # Images de produits
│   │   ├── avatars/      # Avatars utilisateurs
│   │   ├── galleries/    # Galeries photos
│   │   └── documents/    # Documents
├── global/               # Fichiers système
└── temp/                 # Fichiers temporaires
```

## 🔗 **URLs d'Accès**

Vos fichiers sont accessibles via :
```
https://coovia-files.abf701097f61a1d3954f38fcc6b41e83.r2.cloudflarestorage.com/
```

## 🧪 **Test Rapide**

```bash
# Test d'upload via cURL
curl -X POST http://localhost:8000/api/cloudflare/upload-frontend \
  -F "file=@test.jpg" \
  -F "type=image" \
  -F "store_id=1"

# Test d'info
curl -X GET "http://localhost:8000/api/cloudflare/info?path=test/image.jpg"
```

## 📊 **Monitoring**

- **Dashboard Cloudflare** : https://dash.cloudflare.com/r2
- **Logs Laravel** : `tail -f storage/logs/laravel.log`

## 🎉 **C'est tout !**

Votre système d'upload Cloudflare R2 est prêt à être utilisé. Les fichiers seront automatiquement stockés sur Cloudflare avec distribution CDN globale.

**Prochaines étapes :**
1. Intégrer le composant dans vos formulaires
2. Tester avec différents types de fichiers
3. Monitorer l'usage dans le dashboard Cloudflare
