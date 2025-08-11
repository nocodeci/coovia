#!/bin/bash

# Script de déploiement Docker pour Wozif
# Usage: ./scripts/docker-deploy.sh [dev|prod]

set -e

ENVIRONMENT=${1:-dev}
echo "🐳 Déploiement Docker Wozif - Environnement: $ENVIRONMENT"

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonction pour afficher les messages
log() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Vérifier que Docker est installé
if ! command -v docker &> /dev/null; then
    error "Docker n'est pas installé. Veuillez l'installer d'abord."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    error "Docker Compose n'est pas installé. Veuillez l'installer d'abord."
    exit 1
fi

# Nettoyer les conteneurs existants
log "🧹 Nettoyage des conteneurs existants..."
docker-compose down --remove-orphans

# Supprimer les images si en mode production
if [ "$ENVIRONMENT" = "prod" ]; then
    log "🗑️ Suppression des images existantes..."
    docker-compose down --rmi all
fi

# Build des images
log "🔨 Build des images Docker..."
docker-compose build --no-cache

# Démarrer les services
log "🚀 Démarrage des services..."
docker-compose up -d

# Attendre que les services soient prêts
log "⏳ Attente que les services soient prêts..."
sleep 30

# Vérifier l'état des services
log "🔍 Vérification de l'état des services..."
docker-compose ps

# Exécuter les migrations Laravel
log "🗄️ Exécution des migrations Laravel..."
docker-compose exec backend php artisan migrate --force

# Optimiser Laravel pour la production
if [ "$ENVIRONMENT" = "prod" ]; then
    log "⚡ Optimisation de Laravel..."
    docker-compose exec backend php artisan config:cache
    docker-compose exec backend php artisan route:cache
    docker-compose exec backend php artisan view:cache
fi

# Vérifier les logs
log "📋 Vérification des logs..."
docker-compose logs --tail=20

# Afficher les URLs
log "🌐 URLs des services:"
echo -e "${BLUE}Backend API:${NC} http://localhost:8000"
echo -e "${BLUE}Admin Dashboard:${NC} http://localhost:3000"
echo -e "${BLUE}Public Store:${NC} http://localhost:3001"
echo -e "${BLUE}Nginx Proxy:${NC} http://localhost"

# Health check
log "🏥 Vérification de la santé des services..."
sleep 10

# Test de l'API
if curl -f http://localhost:8000/api/health &> /dev/null; then
    log "✅ Backend API fonctionne correctement"
else
    warn "⚠️ Backend API ne répond pas encore"
fi

log "✅ Déploiement terminé avec succès !"
log "💡 Utilisez 'docker-compose logs -f' pour voir les logs en temps réel"
log "💡 Utilisez 'docker-compose down' pour arrêter les services"
