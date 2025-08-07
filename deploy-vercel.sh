#!/bin/bash

# Script de déploiement Vercel pour les projets frontend et boutique-client
# Usage: ./deploy-vercel.sh [frontend|boutique|both]

set -e

echo "🚀 Script de déploiement Vercel"
echo "================================"

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonction pour afficher les messages colorés
print_message() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_step() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

# Vérifier si Vercel CLI est installé
check_vercel_cli() {
    if ! command -v vercel &> /dev/null; then
        print_error "Vercel CLI n'est pas installé"
        echo "Installez-le avec: npm i -g vercel"
        exit 1
    fi
    print_message "Vercel CLI détecté"
}

# Déployer le projet frontend
deploy_frontend() {
    print_step "Déploiement du projet frontend (Dashboard)"
    
    cd frontend
    
    print_message "Installation des dépendances..."
    npm install
    
    print_message "Build du projet..."
    npm run build
    
    print_message "Déploiement sur Vercel..."
    vercel --prod --yes
    
    cd ..
    print_message "✅ Frontend déployé avec succès"
}

# Déployer le projet boutique-client
deploy_boutique() {
    print_step "Déploiement du projet boutique-client"
    
    cd boutique-client
    
    print_message "Installation des dépendances..."
    npm install
    
    print_message "Build du projet..."
    npm run build
    
    print_message "Déploiement sur Vercel..."
    vercel --prod --yes
    
    cd ..
    print_message "✅ Boutique-client déployé avec succès"
}

# Déployer les deux projets
deploy_both() {
    print_step "Déploiement des deux projets"
    
    deploy_frontend
    echo ""
    deploy_boutique
    
    print_message "🎉 Tous les projets ont été déployés avec succès"
}

# Fonction principale
main() {
    check_vercel_cli
    
    case "${1:-both}" in
        "frontend")
            deploy_frontend
            ;;
        "boutique")
            deploy_boutique
            ;;
        "both")
            deploy_both
            ;;
        *)
            print_error "Usage: $0 [frontend|boutique|both]"
            echo "  frontend  - Déployer seulement le dashboard"
            echo "  boutique  - Déployer seulement la boutique"
            echo "  both      - Déployer les deux projets (défaut)"
            exit 1
            ;;
    esac
}

# Exécuter le script
main "$@"
