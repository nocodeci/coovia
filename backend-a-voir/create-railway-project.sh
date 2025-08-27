#!/bin/bash

echo "🚀 Création Automatique du Projet Railway"
echo "========================================"

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Vérifier si Railway CLI est installé
print_status "Vérification de Railway CLI..."
if ! command -v railway &> /dev/null; then
    print_warning "Railway CLI n'est pas installé"
    echo "Installation de Railway CLI..."
    
    # Installation de Railway CLI
    if command -v npm &> /dev/null; then
        npm install -g @railway/cli
    elif command -v yarn &> /dev/null; then
        yarn global add @railway/cli
    else
        print_error "npm ou yarn n'est pas installé. Installez Railway CLI manuellement:"
        echo "npm install -g @railway/cli"
        exit 1
    fi
fi

print_success "Railway CLI est installé"

# Vérifier si l'utilisateur est connecté
print_status "Vérification de la connexion Railway..."
if ! railway whoami &> /dev/null; then
    print_warning "Vous n'êtes pas connecté à Railway"
    echo "Connexion à Railway..."
    railway login
fi

print_success "Connecté à Railway"

# Créer le projet Railway
print_status "Création du projet Railway..."
PROJECT_NAME="coovia-backend"

# Vérifier si le projet existe déjà
if railway list | grep -q "$PROJECT_NAME"; then
    print_warning "Le projet $PROJECT_NAME existe déjà"
    read -p "Voulez-vous utiliser le projet existant ? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_status "Création d'un nouveau projet..."
        PROJECT_NAME="coovia-backend-$(date +%s)"
    fi
fi

# Créer le projet
print_status "Initialisation du projet Railway..."
if railway init --name "$PROJECT_NAME"; then
    print_success "Projet Railway créé: $PROJECT_NAME"
else
    print_error "Erreur lors de la création du projet"
    exit 1
fi

# Obtenir l'ID du projet
PROJECT_ID=$(railway list | grep "$PROJECT_NAME" | awk '{print $1}')
print_status "ID du projet: $PROJECT_ID"

# Configurer le déploiement depuis GitHub
print_status "Configuration du déploiement depuis GitHub..."
if railway service --name "backend"; then
    print_success "Service backend configuré"
else
    print_warning "Service backend déjà existant ou erreur"
fi

# Configurer les variables d'environnement
print_status "Configuration des variables d'environnement..."
if [ -f "railway.env" ]; then
    print_status "Application des variables depuis railway.env..."
    railway variables set --file railway.env
    print_success "Variables d'environnement configurées"
else
    print_warning "Fichier railway.env non trouvé"
    print_status "Configuration manuelle des variables requise"
fi

# Déployer le projet
print_status "Démarrage du déploiement..."
if railway up; then
    print_success "Déploiement lancé avec succès"
else
    print_warning "Erreur lors du déploiement"
fi

# Obtenir l'URL du projet
print_status "Récupération de l'URL du projet..."
PROJECT_URL=$(railway domain)
if [ ! -z "$PROJECT_URL" ]; then
    print_success "URL du projet: https://$PROJECT_URL"
    echo ""
    echo "🌐 Votre API sera accessible sur:"
    echo "   https://$PROJECT_URL"
    echo ""
    echo "📋 Endpoints de test:"
    echo "   https://$PROJECT_URL/api/health"
    echo "   https://$PROJECT_URL/api/status"
    echo "   https://$PROJECT_URL/api/test"
else
    print_warning "URL du projet non disponible"
fi

echo ""
print_success "Configuration Railway terminée !"
echo ""
echo "📋 Prochaines étapes:"
echo "1. Vérifiez les logs dans l'interface Railway"
echo "2. Testez les endpoints de l'API"
echo "3. Configurez un domaine personnalisé si nécessaire"
echo ""
echo "🔗 Interface Railway: https://railway.app/project/$PROJECT_ID"
