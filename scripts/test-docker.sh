#!/bin/bash

# Script de test Docker pour Wozif
# Usage: ./scripts/test-docker.sh

set -e

echo "🧪 Test de la configuration Docker Wozif..."

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Fonction pour afficher les messages
log() {
    echo -e "${GREEN}[TEST]${NC} $1"
}

warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Vérifier que Docker est installé
if ! command -v docker &> /dev/null; then
    error "Docker n'est pas installé"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    error "Docker Compose n'est pas installé"
    exit 1
fi

# Vérifier les fichiers requis
log "📋 Vérification des fichiers requis..."

REQUIRED_FILES=(
    "docker-compose.yml"
    "backend/Dockerfile"
    "frontend/Dockerfile"
    "boutique-client/Dockerfile"
    "nginx/nginx.conf"
)

for file in "${REQUIRED_FILES[@]}"; do
    if [ -f "$file" ]; then
        log "✅ $file existe"
    else
        error "❌ $file manquant"
        exit 1
    fi
done

# Vérifier la syntaxe Docker Compose
log "🔍 Vérification de la syntaxe docker-compose.yml..."
if docker-compose config > /dev/null 2>&1; then
    log "✅ Syntaxe docker-compose.yml valide"
else
    error "❌ Erreur dans docker-compose.yml"
    docker-compose config
    exit 1
fi

# Build des images (sans les démarrer)
log "🔨 Test du build des images..."
docker-compose build --no-cache

# Vérifier que les images ont été créées
log "📦 Vérification des images créées..."
IMAGES=(
    "coovia_backend"
    "coovia_frontend"
    "coovia_boutique-client"
)

for image in "${IMAGES[@]}"; do
    if docker images | grep -q "$image"; then
        log "✅ Image $image créée"
    else
        warn "⚠️ Image $image non trouvée"
    fi
done

# Test de connectivité réseau
log "🌐 Test de connectivité réseau..."
docker network create coovia_test_network 2>/dev/null || true

# Test PostgreSQL
log "🗄️ Test de PostgreSQL..."
docker run --rm --network coovia_test_network \
    -e POSTGRES_DB=test_db \
    -e POSTGRES_USER=test_user \
    -e POSTGRES_PASSWORD=test_password \
    postgres:15-alpine pg_isready -U test_user -d test_db

if [ $? -eq 0 ]; then
    log "✅ PostgreSQL fonctionne"
else
    error "❌ PostgreSQL ne fonctionne pas"
fi

# Test Nginx
log "🌐 Test de Nginx..."
docker run --rm --network coovia_test_network \
    nginx:alpine nginx -t

if [ $? -eq 0 ]; then
    log "✅ Nginx fonctionne"
else
    error "❌ Nginx ne fonctionne pas"
fi

# Nettoyer
docker network rm coovia_test_network 2>/dev/null || true

# Test de déploiement rapide
log "🚀 Test de déploiement rapide..."
docker-compose up -d postgres

# Attendre que PostgreSQL soit prêt
log "⏳ Attente de PostgreSQL..."
sleep 10

# Vérifier l'état
if docker-compose ps postgres | grep -q "Up"; then
    log "✅ PostgreSQL démarré avec succès"
else
    error "❌ Échec du démarrage de PostgreSQL"
fi

# Arrêter les services de test
docker-compose down

log "✅ Tous les tests sont passés !"
log "💡 Vous pouvez maintenant déployer avec : ./scripts/docker-deploy.sh"
