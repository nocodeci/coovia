# Coovia Backend API

Backend Laravel pour l'application Coovia - Plateforme de création de boutiques en ligne.

## 🚀 Technologies

- **Laravel 11** - Framework PHP
- **Supabase** - Base de données PostgreSQL
- **Auth0** - Authentification
- **Cloudflare R2** - Stockage de fichiers
- **Laravel Sanctum** - API Authentication

## 📋 Prérequis

- PHP 8.2+
- Composer
- Node.js (pour les assets frontend)

## 🛠️ Installation

1. **Cloner le repository**
```bash
git clone <repository-url>
cd coovia-backend
```

2. **Installer les dépendances**
```bash
composer install
```

3. **Configuration de l'environnement**
```bash
cp .env.example .env
php artisan key:generate
```

4. **Configuration de la base de données**
- Configurer les variables d'environnement Supabase dans `.env`
- Exécuter les migrations : `php artisan migrate`

5. **Configuration des services**
- Auth0 : Configurer les variables d'environnement Auth0
- Cloudflare R2 : Configurer les variables d'environnement R2

## 🚀 Démarrage

```bash
php artisan serve
```

L'API sera disponible sur `http://localhost:8000`

## 📚 Documentation API

### Endpoints principaux

- `POST /api/auth/login` - Connexion utilisateur
- `POST /api/auth/register` - Inscription utilisateur
- `GET /api/stores` - Liste des boutiques
- `POST /api/stores` - Créer une boutique
- `GET /api/products` - Liste des produits
- `POST /api/products` - Créer un produit

## 🔧 Configuration

### Variables d'environnement requises

```env
# Base de données
DB_CONNECTION=pgsql
DB_HOST=your-supabase-host
DB_PORT=5432
DB_DATABASE=your-database
DB_USERNAME=your-username
DB_PASSWORD=your-password

# Auth0
AUTH0_DOMAIN=your-auth0-domain
AUTH0_CLIENT_ID=your-client-id
AUTH0_CLIENT_SECRET=your-client-secret

# Cloudflare R2
R2_ACCESS_KEY_ID=your-access-key
R2_SECRET_ACCESS_KEY=your-secret-key
R2_BUCKET=your-bucket-name
R2_ENDPOINT=your-endpoint
```

## 🚀 Déploiement

### Laravel Vapor (Recommandé)
```bash
composer require laravel/vapor-cli --update-with-dependencies
vapor deploy production
```

### Autres plateformes
- **Railway** : Utiliser `railway.json`
- **Render** : Utiliser `render.yaml`
- **Forge** : Utiliser les scripts de déploiement

## 📝 Structure du projet

```
├── app/
│   ├── Http/Controllers/    # Contrôleurs API
│   ├── Models/             # Modèles Eloquent
│   ├── Services/           # Services métier
│   └── Mail/               # Templates d'emails
├── config/                 # Configuration
├── database/
│   ├── migrations/         # Migrations
│   └── seeders/           # Seeders
├── routes/
│   └── api.php            # Routes API
└── storage/               # Stockage des fichiers
```

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.
