# 🚀 Coovia API - Backend Laravel

Ce repository contient uniquement le backend Laravel de l'application Coovia, optimisé pour le déploiement sur Laravel Cloud.

## 📁 Structure du Projet

```
backend/                    # Application Laravel principale
├── app/                   # Logique métier
├── config/               # Configuration
├── database/             # Migrations et seeders
├── routes/               # Routes API
├── storage/              # Stockage des fichiers
└── .laravel-cloud/       # Configuration Laravel Cloud
```

## 🛠️ Technologies

- **Laravel 10** - Framework PHP
- **PostgreSQL** - Base de données
- **Laravel Sanctum** - Authentification API
- **Cloudflare R2** - Stockage de fichiers
- **Laravel Scout** - Recherche (Algolia)

## 🚀 Déploiement Laravel Cloud

### Prérequis

1. Compte Laravel Cloud actif
2. Variables d'environnement configurées
3. Base de données PostgreSQL

### Étapes de Déploiement

1. **Connecter le Repository** :
   - Repository : `nocodeci/coovia`
   - Branche : `backend-deploy`
   - Répertoire : `/` (racine)

2. **Variables d'Environnement** :
   ```env
   APP_NAME=Coovia API
   APP_ENV=production
   APP_DEBUG=false
   DB_CONNECTION=pgsql
   CLOUDFLARE_R2_ACCESS_KEY_ID=your_key
   CLOUDFLARE_R2_SECRET_ACCESS_KEY=your_secret
   ```

3. **Services** :
   - Base de données : PostgreSQL
   - Cache : Redis (optionnel)
   - Stockage : Cloudflare R2

### Configuration Post-Déploiement

```bash
# Migrations
php artisan migrate --force

# Permissions
chmod -R 755 storage bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache

# Lien symbolique
php artisan storage:link

# Clé d'application
php artisan key:generate
```

## 🔧 API Endpoints

### Endpoints Publics
- `GET /api/health` - Santé de l'API
- `GET /api/boutique/{slug}` - Informations boutique
- `GET /api/boutique/{slug}/products` - Produits de la boutique
- `GET /api/boutique/{slug}/categories` - Catégories de la boutique

### Endpoints Protégés
- `GET /api/stores` - Liste des boutiques (authentifié)
- `POST /api/stores/{store}/products` - Créer un produit
- `PUT /api/stores/{store}/products/{product}` - Modifier un produit
- `DELETE /api/stores/{store}/products/{product}` - Supprimer un produit

## 🧪 Tests

### Test de Santé
```bash
curl -X GET "https://votre-app.laravelcloud.com/api/health"
```

### Test Boutique Publique
```bash
curl -X GET "https://votre-app.laravelcloud.com/api/boutique/boutique-test"
```

## 📊 Monitoring

- **Logs** : Accessibles via Laravel Cloud Dashboard
- **Métriques** : Performance et utilisation des ressources
- **Base de données** : Connexions et requêtes

## 🔄 Mises à Jour

1. Faire les modifications dans la branche `backend-deploy`
2. Committer et pousser vers GitHub
3. Déployer automatiquement via Laravel Cloud

## 📞 Support

- **Documentation Laravel Cloud** : https://cloud.laravel.com/docs
- **Support** : https://cloud.laravel.com/support

---

**Version** : 1.0.0  
**Dernière mise à jour** : Août 2025  
**Statut** : Prêt pour production 🚀
