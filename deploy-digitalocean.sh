#!/bin/bash

# Script de déploiement DigitalOcean App Platform
# Usage: ./deploy-digitalocean.sh

set -e

echo "🚀 Déploiement DigitalOcean App Platform pour Coovia Backend..."

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

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

# Vérifier que doctl est installé
if ! command -v doctl &> /dev/null; then
    error "doctl n'est pas installé. Veuillez l'installer d'abord."
    echo "Installation: https://docs.digitalocean.com/reference/doctl/how-to/install/"
    exit 1
fi

# Vérifier l'authentification
if ! doctl account get &> /dev/null; then
    error "Vous n'êtes pas connecté à DigitalOcean."
    echo "Connectez-vous avec: doctl auth init"
    exit 1
fi

# Vérifier que le fichier app.yaml existe
if [ ! -f ".do/app.yaml" ]; then
    error "Le fichier .do/app.yaml n'existe pas"
    exit 1
fi

log "📋 Configuration de l'application..."
log "🔍 Vérification de la configuration..."

# Valider la configuration
if doctl apps spec get .do/app.yaml &> /dev/null; then
    log "✅ Configuration valide"
else
    error "❌ Configuration invalide"
    exit 1
fi

# Déployer l'application
log "🚀 Déploiement de l'application..."
doctl apps create --spec .do/app.yaml

# Attendre que l'application soit prête
log "⏳ Attente que l'application soit prête..."
sleep 30

# Vérifier le statut
log "🔍 Vérification du statut..."
doctl apps list

log "✅ Déploiement terminé !"
log "💡 Vérifiez votre application dans le dashboard DigitalOcean"
log "🌐 URL: https://your-app.ondigitalocean.app"
