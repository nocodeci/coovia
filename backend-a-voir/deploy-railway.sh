#!/bin/bash

echo "🚀 Script de Déploiement Railway pour Coovia Backend"
echo "=================================================="

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonction pour afficher les messages colorés
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

# Vérifier si nous sommes dans le bon répertoire
if [ ! -f "composer.json" ]; then
    print_error "Ce script doit être exécuté depuis le dossier backend/"
    exit 1
fi

print_status "Vérification de l'environnement..."

# Vérifier si Git est installé
if ! command -v git &> /dev/null; then
    print_error "Git n'est pas installé"
    exit 1
fi

# Vérifier si nous sommes dans un repository Git
if [ ! -d ".git" ]; then
    print_error "Ce dossier n'est pas un repository Git"
    exit 1
fi

# Vérifier le statut Git
print_status "Vérification du statut Git..."
if [ -n "$(git status --porcelain)" ]; then
    print_warning "Il y a des modifications non commitées"
    echo "Fichiers modifiés :"
    git status --porcelain
    echo ""
    read -p "Voulez-vous continuer ? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_status "Déploiement annulé"
        exit 0
    fi
fi

# Générer la clé d'application si elle n'existe pas
print_status "Vérification de la clé d'application..."
if [ ! -f ".env" ] || ! grep -q "APP_KEY=base64:" .env; then
    print_warning "Clé d'application non trouvée"
    print_status "Génération d'une nouvelle clé..."
    APP_KEY=$(php artisan key:generate --show)
    print_success "Clé générée: $APP_KEY"
    print_warning "N'oubliez pas d'ajouter cette clé dans les variables d'environnement Railway"
else
    print_success "Clé d'application déjà configurée"
fi

# Vérifier les fichiers de configuration
print_status "Vérification des fichiers de configuration..."

if [ ! -f "railway.json" ]; then
    print_error "railway.json manquant"
    exit 1
fi

if [ ! -f "Procfile" ]; then
    print_error "Procfile manquant"
    exit 1
fi

if [ ! -f "build.sh" ]; then
    print_error "build.sh manquant"
    exit 1
fi

print_success "Tous les fichiers de configuration sont présents"

# Rendre le script de build exécutable
chmod +x build.sh

# Commit des modifications si nécessaire
if [ -n "$(git status --porcelain)" ]; then
    print_status "Commit des modifications..."
    git add .
    git commit -m "🚀 Préparation du déploiement Railway - $(date)"
fi

# Push vers GitHub
print_status "Push vers GitHub..."
if git push; then
    print_success "Code poussé vers GitHub avec succès"
else
    print_error "Erreur lors du push vers GitHub"
    exit 1
fi

echo ""
echo "🎉 Déploiement préparé avec succès !"
echo ""
echo "📋 Prochaines étapes :"
echo "1. Allez sur https://railway.app"
echo "2. Créez un nouveau projet"
echo "3. Connectez votre repository GitHub"
echo "4. Sélectionnez le dossier 'backend'"
echo "5. Configurez les variables d'environnement (voir railway.env)"
echo "6. Déployez !"
echo ""
echo "🔗 Documentation complète : RAILWAY_DEPLOYMENT_GUIDE.md"
echo ""
print_success "Script terminé avec succès !"
