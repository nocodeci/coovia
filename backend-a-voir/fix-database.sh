#!/bin/bash

echo "🚀 Script de correction de la base de données Coovia"
echo "=================================================="

# Couleurs pour l'affichage
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonction pour afficher les messages
print_step() {
    echo -e "\n${BLUE}📋 $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Vérifier si nous sommes dans le bon répertoire
if [ ! -f "artisan" ]; then
    print_error "Ce script doit être exécuté depuis le répertoire racine de Laravel"
    exit 1
fi

print_step "1. Nettoyage du cache Laravel"
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear
print_success "Cache nettoyé"

print_step "2. Correction des mots de passe utilisateurs"
php artisan users:fix-passwords
print_success "Mots de passe corrigés"

print_step "3. Exécution des seeders mis à jour"
php artisan db:seed --class=DatabaseSeeder
print_success "Seeders exécutés"

print_step "4. Test de connexion"
echo -e "\n${YELLOW}📝 Vous pouvez maintenant tester la connexion avec:${NC}"
echo "Email: jean.kouassi@gmail.com"
echo "Mot de passe: password123"
echo ""
echo "Email: yohankoffik@gmail.com"
echo "Mot de passe: 12345678"
echo ""
echo "Email: koffiyohaneric225@gmail.com"
echo "Mot de passe: password123"

print_step "5. Redémarrage du serveur de développement"
print_warning "N'oubliez pas de redémarrer votre serveur avec: php artisan serve"

echo -e "\n${GREEN}🎉 Correction terminée avec succès!${NC}"
echo "Vous pouvez maintenant tester l'authentification."
