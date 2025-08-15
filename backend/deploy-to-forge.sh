#!/bin/bash

# Script principal de déploiement sur Laravel Forge
# Ce script automatise tout le processus de déploiement

echo "🚀 Script de déploiement Laravel Forge"
echo "======================================"

# Couleurs pour l'affichage
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonction pour afficher les messages
print_info() {
    echo -e "${BLUE}ℹ️ $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Variables configurables
SITE_DIR="/home/forge/api.coovia.com"
DOMAIN="api.coovia.com"
PHP_VERSION="8.2"
GIT_REPO="https://github.com/votre-username/coovia.git"
GIT_BRANCH="main"

# Vérifier que nous sommes sur le serveur Forge
if [ ! -d "/home/forge" ]; then
    print_error "Ce script doit être exécuté sur un serveur Laravel Forge"
    exit 1
fi

# Fonction pour vérifier les prérequis
check_prerequisites() {
    print_info "Vérification des prérequis..."
    
    # Vérifier PHP
    if command -v php &> /dev/null; then
        PHP_VER=$(php -v | head -1 | cut -d' ' -f2 | cut -d'.' -f1,2)
        if [ "$PHP_VER" = "$PHP_VERSION" ]; then
            print_success "PHP $PHP_VERSION installé"
        else
            print_warning "PHP $PHP_VER installé (attendu: $PHP_VERSION)"
        fi
    else
        print_error "PHP non installé"
        exit 1
    fi
    
    # Vérifier Composer
    if command -v composer &> /dev/null; then
        print_success "Composer installé"
    else
        print_error "Composer non installé"
        exit 1
    fi
    
    # Vérifier Git
    if command -v git &> /dev/null; then
        print_success "Git installé"
    else
        print_error "Git non installé"
        exit 1
    fi
    
    # Vérifier Nginx
    if systemctl is-active --quiet nginx; then
        print_success "Nginx actif"
    else
        print_error "Nginx inactif"
        exit 1
    fi
    
    # Vérifier PHP-FPM
    if systemctl is-active --quiet php$PHP_VERSION-fpm; then
        print_success "PHP-FPM actif"
    else
        print_error "PHP-FPM inactif"
        exit 1
    fi
}

# Fonction pour créer le site
create_site() {
    print_info "Création du site..."
    
    if [ ! -d "$SITE_DIR" ]; then
        mkdir -p "$SITE_DIR"
        print_success "Répertoire du site créé"
    else
        print_warning "Répertoire du site existe déjà"
    fi
}

# Fonction pour cloner le repository
clone_repository() {
    print_info "Clonage du repository Git..."
    
    cd "$SITE_DIR"
    
    if [ ! -d ".git" ]; then
        git clone -b "$GIT_BRANCH" "$GIT_REPO" .
        if [ $? -eq 0 ]; then
            print_success "Repository cloné"
        else
            print_error "Erreur lors du clonage du repository"
            exit 1
        fi
    else
        print_warning "Repository Git déjà présent"
        git pull origin "$GIT_BRANCH"
    fi
}

# Fonction pour configurer l'environnement
setup_environment() {
    print_info "Configuration de l'environnement..."
    
    cd "$SITE_DIR"
    
    # Copier le fichier .env.example si .env n'existe pas
    if [ ! -f ".env" ]; then
        if [ -f ".env.example" ]; then
            cp .env.example .env
            print_success "Fichier .env créé depuis .env.example"
        else
            print_error "Fichier .env.example non trouvé"
            exit 1
        fi
    else
        print_warning "Fichier .env existe déjà"
    fi
    
    # Générer la clé d'application
    if ! grep -q "APP_KEY=base64:" .env; then
        php artisan key:generate --force
        print_success "Clé d'application générée"
    else
        print_warning "Clé d'application déjà configurée"
    fi
}

# Fonction pour installer les dépendances
install_dependencies() {
    print_info "Installation des dépendances..."
    
    cd "$SITE_DIR"
    
    # Installer les dépendances Composer
    composer install --no-interaction --prefer-dist --optimize-autoloader --no-dev
    
    if [ $? -eq 0 ]; then
        print_success "Dépendances Composer installées"
    else
        print_error "Erreur lors de l'installation des dépendances"
        exit 1
    fi
}

# Fonction pour configurer les permissions
setup_permissions() {
    print_info "Configuration des permissions..."
    
    cd "$SITE_DIR"
    
    # Définir les permissions correctes
    chmod -R 755 storage bootstrap/cache
    chown -R forge:forge storage bootstrap/cache
    
    print_success "Permissions configurées"
}

# Fonction pour exécuter les migrations
run_migrations() {
    print_info "Exécution des migrations..."
    
    cd "$SITE_DIR"
    
    # Vérifier la connexion à la base de données
    if php artisan migrate:status > /dev/null 2>&1; then
        php artisan migrate --force
        print_success "Migrations exécutées"
    else
        print_warning "Impossible de se connecter à la base de données"
        print_info "Vérifiez les variables d'environnement DB_* dans .env"
    fi
}

# Fonction pour optimiser l'application
optimize_application() {
    print_info "Optimisation de l'application..."
    
    cd "$SITE_DIR"
    
    # Nettoyer et recréer les caches
    php artisan config:clear
    php artisan config:cache
    php artisan route:clear
    php artisan route:cache
    php artisan view:clear
    php artisan view:cache
    
    # Créer le lien symbolique pour le stockage
    php artisan storage:link
    
    # Optimiser l'application
    php artisan optimize
    
    print_success "Application optimisée"
}

# Fonction pour configurer Nginx
setup_nginx() {
    print_info "Configuration de Nginx..."
    
    # Le fichier de configuration Nginx est déjà créé
    # Il suffit de le copier dans le bon répertoire si nécessaire
    
    if [ -f "nginx-forge.conf" ]; then
        print_info "Fichier de configuration Nginx trouvé"
        print_warning "Copiez manuellement le contenu de nginx-forge.conf dans Forge"
    fi
    
    # Redémarrer Nginx
    sudo systemctl reload nginx
    print_success "Nginx rechargé"
}

# Fonction pour configurer les daemons
setup_daemons() {
    print_info "Configuration des daemons..."
    
    print_warning "Configurez manuellement les daemons dans Forge:"
    print_info "- Queue Worker: php /home/forge/api.coovia.com/artisan queue:work --sleep=3 --tries=3 --max-time=3600"
    print_info "- Schedule Runner: php /home/forge/api.coovia.com/artisan schedule:run"
}

# Fonction pour configurer les sauvegardes
setup_backups() {
    print_info "Configuration des sauvegardes..."
    
    if [ -f "forge-backup-config.sh" ]; then
        chmod +x forge-backup-config.sh
        ./forge-backup-config.sh
        print_success "Sauvegardes configurées"
    else
        print_warning "Script de configuration des sauvegardes non trouvé"
    fi
}

# Fonction pour configurer SSL
setup_ssl() {
    print_info "Configuration SSL..."
    
    print_warning "Configurez SSL manuellement dans Forge:"
    print_info "1. Allez dans votre site dans Forge"
    print_info "2. Cliquez sur 'SSL'"
    print_info "3. Cliquez sur 'LetsEncrypt'"
    print_info "4. Entrez votre domaine: $DOMAIN"
    print_info "5. Cliquez sur 'Obtain Certificate'"
}

# Fonction pour tester l'application
test_application() {
    print_info "Test de l'application..."
    
    # Tester l'endpoint de santé
    if curl -s -f "https://$DOMAIN/health" > /dev/null; then
        print_success "Endpoint de santé accessible"
    else
        print_warning "Endpoint de santé inaccessible"
    fi
    
    # Tester l'API
    API_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "https://$DOMAIN/api")
    if [ "$API_RESPONSE" = "200" ] || [ "$API_RESPONSE" = "401" ] || [ "$API_RESPONSE" = "404" ]; then
        print_success "API accessible (HTTP $API_RESPONSE)"
    else
        print_warning "API inaccessible (HTTP $API_RESPONSE)"
    fi
}

# Fonction pour afficher les informations finales
show_final_info() {
    echo ""
    echo "🎉 Déploiement terminé!"
    echo "======================"
    echo ""
    echo "📋 Informations importantes:"
    echo "============================"
    echo "🌐 URL de l'application: https://$DOMAIN"
    echo "📁 Répertoire: $SITE_DIR"
    echo "🔧 PHP version: $PHP_VERSION"
    echo ""
    echo "📝 Prochaines étapes:"
    echo "===================="
    echo "1. Configurez les variables d'environnement dans Forge"
    echo "2. Configurez SSL avec Let's Encrypt"
    echo "3. Configurez les daemons (queues)"
    echo "4. Testez l'application"
    echo "5. Configurez les sauvegardes"
    echo ""
    echo "🔧 Commandes utiles:"
    echo "==================="
    echo "cd $SITE_DIR"
    echo "php artisan migrate:status"
    echo "php artisan config:cache"
    echo "sudo systemctl restart nginx"
    echo "sudo systemctl restart php$PHP_VERSION-fpm"
    echo ""
    echo "📖 Documentation:"
    echo "================"
    echo "- Guide complet: FORGE_DEPLOYMENT_GUIDE.md"
    echo "- Script de santé: ./forge-health-check.sh"
    echo "- Configuration sauvegardes: ./forge-backup-config.sh"
}

# Fonction principale
main() {
    echo "🚀 Début du déploiement sur Laravel Forge"
    echo "========================================"
    echo ""
    
    # Vérifier les prérequis
    check_prerequisites
    echo ""
    
    # Créer le site
    create_site
    echo ""
    
    # Cloner le repository
    clone_repository
    echo ""
    
    # Configurer l'environnement
    setup_environment
    echo ""
    
    # Installer les dépendances
    install_dependencies
    echo ""
    
    # Configurer les permissions
    setup_permissions
    echo ""
    
    # Exécuter les migrations
    run_migrations
    echo ""
    
    # Optimiser l'application
    optimize_application
    echo ""
    
    # Configurer Nginx
    setup_nginx
    echo ""
    
    # Configurer les daemons
    setup_daemons
    echo ""
    
    # Configurer les sauvegardes
    setup_backups
    echo ""
    
    # Configurer SSL
    setup_ssl
    echo ""
    
    # Tester l'application
    test_application
    echo ""
    
    # Afficher les informations finales
    show_final_info
}

# Exécuter la fonction principale
main
