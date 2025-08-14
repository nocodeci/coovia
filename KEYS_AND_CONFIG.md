# 🔑 Clés et Configurations Importantes - Coovia

## 🚀 Déploiement Vercel

### **Compte Vercel :**
- **Email** : yohankoffik@gmail.com
- **Organisation** : nocodecis-projects
- **Projet Frontend** : woziff
- **URL de déploiement** : https://woziff-g9e3xspw2-nocodecis-projects.vercel.app

### **Domaine :**
- **Domaine principal** : wozif.store
- **Sous-domaines** : {slug}.wozif.store
- **Registrar** : Vercel
- **Expiration** : 12 Août 2026

### **Configuration Vercel :**
```json
{
  "version": 2,
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "env": {
    "NEXT_PUBLIC_API_URL": "https://api.wozif.store"
  }
}
```

## 🔧 Backend Laravel

### **URL de Production :**
- **API Backend** : https://api.wozif.store
- **Base URL** : https://api.wozif.store/api

### **Routes API Principales :**
```php
// Boutiques
GET /api/stores/{slug}                    // Récupérer une boutique par slug
GET /api/stores/{storeId}/products        // Produits d'une boutique

// Paiements
POST /api/smart-payment/initialize        // Initialiser un paiement
POST /api/payment/status                  // Vérifier le statut d'un paiement
```

## 💳 Configuration Paiements

### **PayDunya :**
- **Master Key** : [CONFIGURÉ DANS .ENV]
- **Private Key** : [CONFIGURÉ DANS .ENV]
- **Token** : [CONFIGURÉ DANS .ENV]
- **Mode** : Production

### **Méthodes de Paiement Supportées :**
- ✅ **MTN CI** : SMS validation
- ✅ **Orange Money CI** : OTP validation
- ✅ **Wave CI** : URL externe
- ✅ **Moov CI** : URL externe

## 🌐 Configuration DNS

### **Nameservers Vercel :**
```
ns1.vercel-dns.com
ns2.vercel-dns.com
```

### **Sous-domaines Configurés :**
- `*.wozif.store` → Frontend Next.js
- `api.wozif.store` → Backend Laravel

## 📁 Structure du Projet

### **Frontend (Next.js) :**
```
boutique-client-next/
├── src/
│   ├── app/
│   │   ├── [storeId]/           # Routes dynamiques
│   │   │   ├── page.tsx         # Page boutique
│   │   │   ├── checkout/        # Page paiement
│   │   │   └── product/[id]/    # Page produit
│   │   └── middleware.ts        # Gestion sous-domaines
│   ├── components/              # Composants UI
│   ├── services/               # Services API
│   └── types/                  # Types TypeScript
├── next.config.mjs             # Configuration Next.js
└── vercel.json                 # Configuration Vercel
```

### **Backend (Laravel) :**
```
backend/
├── app/
│   ├── Http/Controllers/Api/
│   │   ├── StoreController.php     # Gestion boutiques
│   │   └── PaymentController.php   # Gestion paiements
│   └── Services/
│       ├── PaydunyaOfficialService.php
│       └── SmartPaymentService.php
└── routes/api.php                  # Routes API
```

## 🔐 Variables d'Environnement

### **Frontend (.env.local) :**
```env
NEXT_PUBLIC_API_URL=https://api.wozif.store
NODE_ENV=production
```

### **Backend (.env) :**
```env
APP_URL=https://api.wozif.store
PAYDUNYA_MASTER_KEY=your_master_key
PAYDUNYA_PRIVATE_KEY=your_private_key
PAYDUNYA_TOKEN=your_token
PAYDUNYA_MODE=production
```

## 🧪 Tests et Développement

### **URLs de Test :**
- **Frontend Local** : http://localhost:3000
- **Backend Local** : http://localhost:8000
- **Frontend Production** : https://wozif.store
- **Backend Production** : https://api.wozif.store

### **Commandes de Développement :**
```bash
# Frontend
cd boutique-client-next
npm run dev

# Backend
cd backend
php artisan serve
```

## 📊 Monitoring

### **Vercel Analytics :**
- **Dashboard** : https://vercel.com/nocodecis-projects/woziff
- **Logs** : Dashboard → Project → Functions
- **Performance** : Monitoring automatique

### **Laravel Logs :**
- **Production** : /var/log/laravel.log
- **Debug** : `php artisan log:tail`

## 🆘 Support et Maintenance

### **Contacts :**
- **Email** : yohankoffik@gmail.com
- **GitHub** : https://github.com/nocodeci/coovia
- **Vercel Support** : https://support.vercel.com

### **Documentation :**
- **Déploiement** : boutique-client-next/DEPLOYMENT_SUCCESS.md
- **Dépannage** : boutique-client-next/TROUBLESHOOTING_404.md
- **Configuration** : boutique-client-next/DEPLOYMENT_STATUS.md

## 🔄 Mise à Jour

### **Frontend :**
```bash
cd boutique-client-next
git pull origin main
npm install
npm run build
vercel --prod
```

### **Backend :**
```bash
cd backend
git pull origin main
composer install
php artisan migrate
php artisan config:cache
```

---

## ⚠️ Notes Importantes

1. **Protection SSO** : Désactiver dans Vercel pour accès public
2. **Domaine** : wozif.store doit pointer vers le projet `wozif`
3. **API** : Backend doit être déployé sur api.wozif.store
4. **Sécurité** : Ne jamais commiter les clés API dans Git
5. **Backup** : Sauvegarder régulièrement la base de données

**🔑 Ce fichier contient toutes les informations essentielles pour maintenir et déployer le projet Coovia.**
