# 🐳 Dockerisation du Projet Coovia

Ce guide vous explique comment déployer le projet Coovia avec Docker.

## 📋 Prérequis

- Docker installé
- Docker Compose installé
- Git installé

## 🚀 Démarrage Rapide

### 1. Cloner le projet
```bash
git clone <votre-repo>
cd coovia
```

### 2. Configurer l'environnement
```bash
# Copier le fichier d'environnement
cp env.docker.example .env.docker

# Éditer les variables selon vos besoins
nano .env.docker
```

### 3. Lancer avec Docker
```bash
# Rendre le script exécutable
chmod +x scripts/docker-deploy.sh

# Déployer en mode développement
./scripts/docker-deploy.sh dev

# Ou en mode production
./scripts/docker-deploy.sh prod
```

## 🏗️ Architecture Docker

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Nginx Proxy   │    │  Frontend Admin │    │ Boutique Client │
│   Port: 80/443  │    │   Port: 3000    │    │   Port: 3001    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │  Backend Laravel│
                    │   Port: 8000    │
                    └─────────────────┘
                                 │
                    ┌─────────────────┐
                    │   PostgreSQL    │
                    │   Port: 5432    │
                    └─────────────────┘
```

## 📦 Services Docker

### 1. **Backend Laravel** (`backend/`)
- **Image**: PHP 8.2 + Nginx
- **Port**: 8000
- **Base de données**: PostgreSQL
- **Cache**: Redis (optionnel)

### 2. **Frontend Admin** (`frontend/`)
- **Image**: Node.js 18 + Nginx
- **Port**: 3000
- **Framework**: React + Vite
- **Fonction**: Dashboard administrateur

### 3. **Boutique Client** (`boutique-client/`)
- **Image**: Node.js 18 + Nginx
- **Port**: 3001
- **Framework**: React
- **Fonction**: Boutique publique

### 4. **PostgreSQL** (`postgres/`)
- **Image**: PostgreSQL 15
- **Port**: 5432
- **Base de données**: coovia_db

### 5. **Redis** (`redis/`)
- **Image**: Redis 7
- **Port**: 6379
- **Fonction**: Cache et sessions

### 6. **Nginx Proxy** (`nginx/`)
- **Image**: Nginx Alpine
- **Ports**: 80, 443
- **Fonction**: Reverse proxy

## 🔧 Commandes Utiles

### Démarrage
```bash
# Démarrer tous les services
docker-compose up -d

# Démarrer un service spécifique
docker-compose up -d backend

# Voir les logs
docker-compose logs -f

# Voir les logs d'un service
docker-compose logs -f backend
```

### Arrêt
```bash
# Arrêter tous les services
docker-compose down

# Arrêter et supprimer les volumes
docker-compose down -v

# Arrêter et supprimer les images
docker-compose down --rmi all
```

### Maintenance
```bash
# Rebuild une image
docker-compose build backend

# Rebuild toutes les images
docker-compose build --no-cache

# Exécuter une commande dans un conteneur
docker-compose exec backend php artisan migrate

# Accéder au shell d'un conteneur
docker-compose exec backend bash
```

### Base de données
```bash
# Exécuter les migrations
docker-compose exec backend php artisan migrate

# Créer un seeder
docker-compose exec backend php artisan db:seed

# Vider la base de données
docker-compose exec backend php artisan migrate:fresh

# Accéder à PostgreSQL
docker-compose exec postgres psql -U coovia_user -d coovia_db
```

## 🌐 URLs d'Accès

Une fois déployé, vous pouvez accéder à :

- **Backend API**: http://localhost:8000
- **Admin Dashboard**: http://localhost:3000
- **Public Store**: http://localhost:3001
- **Nginx Proxy**: http://localhost
- **Health Check**: http://localhost/health

## 🔒 Sécurité

### Variables d'Environnement
- Ne jamais commiter le fichier `.env.docker`
- Utiliser des mots de passe forts pour la production
- Changer les clés par défaut

### SSL/HTTPS
Pour activer HTTPS en production :

1. Ajouter vos certificats SSL dans `nginx/ssl/`
2. Décommenter les lignes SSL dans `nginx/nginx.conf`
3. Redémarrer le service nginx

## 📊 Monitoring

### Logs
```bash
# Voir tous les logs
docker-compose logs -f

# Logs d'un service spécifique
docker-compose logs -f backend

# Logs avec timestamps
docker-compose logs -f --timestamps
```

### Métriques
```bash
# Utilisation des ressources
docker stats

# Espace disque
docker system df

# Nettoyage
docker system prune
```

## 🚀 Déploiement en Production

### 1. Préparer l'environnement
```bash
# Copier les variables de production
cp env.docker.example .env.docker.prod

# Éditer les variables de production
nano .env.docker.prod
```

### 2. Déployer
```bash
# Déploiement en production
./scripts/docker-deploy.sh prod
```

### 3. Vérifier
```bash
# Vérifier l'état des services
docker-compose ps

# Tester l'API
curl http://localhost:8000/api/health

# Vérifier les logs
docker-compose logs --tail=50
```

## 🔧 Dépannage

### Problèmes Courants

#### 1. Port déjà utilisé
```bash
# Vérifier les ports utilisés
netstat -tulpn | grep :8000

# Changer le port dans docker-compose.yml
```

#### 2. Base de données non accessible
```bash
# Vérifier l'état de PostgreSQL
docker-compose exec postgres pg_isready

# Vérifier les logs
docker-compose logs postgres
```

#### 3. Permissions Laravel
```bash
# Corriger les permissions
docker-compose exec backend chown -R www-data:www-data /var/www/storage
docker-compose exec backend chmod -R 755 /var/www/storage
```

#### 4. Cache Laravel
```bash
# Vider le cache
docker-compose exec backend php artisan cache:clear
docker-compose exec backend php artisan config:clear
docker-compose exec backend php artisan route:clear
```

## 📝 Notes Importantes

1. **Volumes**: Les données PostgreSQL sont persistées dans le volume `postgres_data`
2. **Networks**: Tous les services communiquent via le réseau `coovia_network`
3. **Health Checks**: PostgreSQL a un health check configuré
4. **Restart Policy**: Tous les services redémarrent automatiquement sauf en cas d'arrêt manuel

## 🤝 Contribution

Pour contribuer au projet :

1. Fork le repository
2. Créer une branche feature
3. Tester avec Docker
4. Soumettre une pull request

## 📞 Support

En cas de problème :

1. Vérifier les logs : `docker-compose logs`
2. Consulter la documentation
3. Ouvrir une issue sur GitHub
