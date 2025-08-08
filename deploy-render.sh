#!/bin/bash

# 🚀 Script de Déploiement Render pour Coovia Backend
# Auteur: Assistant IA
# Date: $(date)

set -e  # Arrêter en cas d'erreur

echo "🚀 Démarrage du déploiement Render pour Coovia Backend..."

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

# Vérifier que nous sommes dans le bon répertoire
if [ ! -f "backend/composer.json" ]; then
    print_error "Ce script doit être exécuté depuis la racine du projet (où se trouve le dossier backend/)"
    exit 1
fi

print_step "1. Vérification de l'environnement..."

# Vérifier Git
if ! command -v git &> /dev/null; then
    print_error "Git n'est pas installé"
    exit 1
fi

# Vérifier que nous sommes dans un repository Git
if [ ! -d ".git" ]; then
    print_error "Ce répertoire n'est pas un repository Git"
    exit 1
fi

print_message "✅ Environnement vérifié"

print_step "2. Vérification des fichiers de configuration..."

# Vérifier les fichiers nécessaires
required_files=(
    "backend/render.yaml"
    "backend/deploy.sh"
    "backend/composer.json"
    "backend/env.example"
)

for file in "${required_files[@]}"; do
    if [ ! -f "$file" ]; then
        print_error "Fichier manquant: $file"
        exit 1
    fi
done

print_message "✅ Tous les fichiers de configuration sont présents"

print_step "3. Vérification du statut Git..."

# Vérifier s'il y a des changements non commités
if [ -n "$(git status --porcelain)" ]; then
    print_warning "Il y a des changements non commités"
    echo "Changements détectés:"
    git status --porcelain
    
    read -p "Voulez-vous commiter ces changements? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git add .
        git commit -m "Préparation pour déploiement Render - $(date)"
        print_message "✅ Changements commités"
    else
        print_error "Déploiement annulé - veuillez commiter les changements d'abord"
        exit 1
    fi
else
    print_message "✅ Aucun changement non commité"
fi

print_step "4. Vérification de la branche..."

# Vérifier que nous sommes sur la branche principale
current_branch=$(git branch --show-current)
if [ "$current_branch" != "main" ] && [ "$current_branch" != "master" ]; then
    print_warning "Vous êtes sur la branche '$current_branch' au lieu de main/master"
    read -p "Voulez-vous continuer? (y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_error "Déploiement annulé"
        exit 1
    fi
fi

print_message "✅ Branche vérifiée: $current_branch"

print_step "5. Push vers le repository distant..."

# Push vers le repository distant
if git push origin "$current_branch"; then
    print_message "✅ Code poussé vers le repository distant"
else
    print_error "❌ Erreur lors du push vers le repository distant"
    exit 1
fi

print_step "6. Instructions pour Render..."

echo ""
echo "🎯 Prochaines étapes pour déployer sur Render:"
echo ""
echo "1. Allez sur https://render.com"
echo "2. Connectez-vous avec votre compte GitHub"
echo "3. Cliquez sur 'New +' → 'Web Service'"
echo "4. Sélectionnez votre repository: $(basename $(pwd))"
echo "5. Configurez le service:"
echo "   - Name: coovia-backend"
echo "   - Environment: PHP"
echo "   - Root Directory: backend"
echo "   - Build Command: composer install --no-dev --optimize-autoloader"
echo "   - Start Command: chmod +x deploy.sh && ./deploy.sh && vendor/bin/heroku-php-apache2 public/"
echo ""
echo "6. Configurez les variables d'environnement:"
echo "   - APP_NAME=Coovia"
echo "   - APP_ENV=production"
echo "   - APP_DEBUG=false"
echo "   - DB_CONNECTION=pgsql"
echo "   - DB_HOST=votre-supabase-host.supabase.co"
echo "   - DB_DATABASE=postgres"
echo "   - DB_USERNAME=postgres"
echo "   - DB_PASSWORD=votre-supabase-password"
echo "   - PAYDUNYA_MASTER_KEY=votre-clé"
echo "   - MONEROO_PUBLIC_KEY=votre-clé"
echo ""
echo "7. Cliquez sur 'Create Web Service'"
echo ""

print_step "7. Vérification des variables d'environnement..."

echo ""
echo "⚠️  IMPORTANT: Assurez-vous d'avoir configuré ces variables dans Render:"
echo ""
echo "Variables Supabase:"
echo "- DB_HOST"
echo "- DB_DATABASE" 
echo "- DB_USERNAME"
echo "- DB_PASSWORD"
echo ""
echo "Variables Payment:"
echo "- PAYDUNYA_MASTER_KEY"
echo "- PAYDUNYA_PUBLIC_KEY"
echo "- PAYDUNYA_PRIVATE_KEY"
echo "- PAYDUNYA_TOKEN"
echo "- MONEROO_PUBLIC_KEY"
echo "- MONEROO_SECRET_KEY"
echo "- MONEROO_ENVIRONMENT"
echo ""

print_step "8. Test de l'API après déploiement..."

echo ""
echo "🔍 Après le déploiement, testez votre API:"
echo ""
echo "# Test de santé"
echo "curl https://coovia-backend.onrender.com/api/health"
echo ""
echo "# Test des stores"
echo "curl https://coovia-backend.onrender.com/api/stores"
echo ""
echo "# Test des produits"
echo "curl https://coovia-backend.onrender.com/api/products"
echo ""

print_message "✅ Script de déploiement terminé!"
echo ""
echo "📚 Documentation complète: RENDER_DEPLOYMENT_GUIDE.md"
echo "🔗 Dashboard Render: https://dashboard.render.com"
echo ""

# Afficher les URLs finales
echo "🎯 URLs finales après déploiement:"
echo "- Backend API: https://coovia-backend.onrender.com"
echo "- Frontend: https://votre-frontend.vercel.app"
echo "- Boutique: https://votre-boutique.vercel.app"
echo ""
