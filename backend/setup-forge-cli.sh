#!/bin/bash

# Script de configuration initial pour Forge CLI
# Ce script vous guide à travers la configuration initiale

echo "🔧 Configuration initiale Forge CLI"
echo "===================================="

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

# Vérifier que forge CLI est installé
check_forge_cli() {
    print_info "Vérification de Forge CLI..."
    
    if command -v forge &> /dev/null; then
        print_success "Forge CLI installé"
        forge --version
    else
        print_error "Forge CLI non installé"
        print_info "Installation en cours..."
        
        composer global require laravel/forge-cli
        
        if [ $? -eq 0 ]; then
            print_success "Forge CLI installé avec succès"
            
            # Ajouter au PATH
            echo 'export PATH="$HOME/.composer/vendor/bin:$PATH"' >> ~/.zshrc
            source ~/.zshrc
            
            print_info "Forge CLI ajouté au PATH"
        else
            print_error "Erreur lors de l'installation de Forge CLI"
            exit 1
        fi
    fi
}

# Vérifier l'authentification
check_authentication() {
    print_info "Vérification de l'authentification..."
    
    if forge server:list &> /dev/null; then
        print_success "Authentifié avec Forge"
        return 0
    else
        print_warning "Non authentifié avec Forge"
        return 1
    fi
}

# Guider l'utilisateur pour l'authentification
guide_authentication() {
    print_info "Guide d'authentification Forge"
    echo ""
    echo "📋 Étapes pour obtenir votre token API :"
    echo "========================================"
    echo "1. Allez sur https://forge.laravel.com"
    echo "2. Connectez-vous à votre compte"
    echo "3. Allez dans 'User Settings' (en haut à droite)"
    echo "4. Cliquez sur 'API Tokens'"
    echo "5. Cliquez sur 'Create Token'"
    echo "6. Donnez un nom à votre token (ex: 'CLI Access')"
    echo "7. Copiez le token généré"
    echo ""
    echo "🔑 Le token ressemble à :"
    echo "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9..."
    echo ""
    
    read -p "Avez-vous votre token API ? (y/N): " -n 1 -r
    echo
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_info "Authentification en cours..."
        forge login
        
        if check_authentication; then
            print_success "Authentification réussie !"
        else
            print_error "Échec de l'authentification"
            print_info "Vérifiez votre token et réessayez"
        fi
    else
        print_info "Obtenez votre token d'abord, puis relancez ce script"
    fi
}

# Vérifier les serveurs
check_servers() {
    print_info "Vérification des serveurs..."
    
    if check_authentication; then
        print_info "Serveurs disponibles :"
        forge server:list
        
        SERVER_COUNT=$(forge server:list | grep -c "Server" || echo "0")
        
        if [ "$SERVER_COUNT" -eq 0 ]; then
            print_warning "Aucun serveur trouvé"
            guide_server_creation
        else
            print_success "$SERVER_COUNT serveur(s) trouvé(s)"
        fi
    else
        print_error "Non authentifié - impossible de vérifier les serveurs"
    fi
}

# Guider la création de serveur
guide_server_creation() {
    print_info "Guide de création de serveur"
    echo ""
    echo "📋 Étapes pour créer un serveur :"
    echo "================================="
    echo "1. Allez sur https://forge.laravel.com"
    echo "2. Cliquez sur 'Create Server'"
    echo "3. Choisissez votre provider :"
    echo "   - DigitalOcean (recommandé)"
    echo "   - Linode"
    echo "   - Vultr"
    echo "   - AWS"
    echo "4. Sélectionnez la région (proche de vos utilisateurs)"
    echo "5. Choisissez la taille du serveur :"
    echo "   - 1GB RAM minimum pour Laravel"
    echo "   - 2GB RAM recommandé pour la production"
    echo "6. Sélectionnez PHP 8.2 ou supérieur"
    echo "7. Activez 'Install Redis' si nécessaire"
    echo "8. Cliquez sur 'Create Server'"
    echo ""
    echo "⏱️ La création prend 5-10 minutes"
    echo ""
    
    read -p "Avez-vous créé un serveur ? (y/N): " -n 1 -r
    echo
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_success "Serveur créé !"
        print_info "Vous pouvez maintenant utiliser le script de déploiement"
    else
        print_info "Créez un serveur d'abord, puis relancez ce script"
    fi
}

# Vérifier les sites
check_sites() {
    print_info "Vérification des sites..."
    
    if check_authentication; then
        print_info "Sites disponibles :"
        forge site:list
        
        SITE_COUNT=$(forge site:list | grep -c "Site" || echo "0")
        
        if [ "$SITE_COUNT" -eq 0 ]; then
            print_warning "Aucun site trouvé"
            guide_site_creation
        else
            print_success "$SITE_COUNT site(s) trouvé(s)"
        fi
    else
        print_error "Non authentifié - impossible de vérifier les sites"
    fi
}

# Guider la création de site
guide_site_creation() {
    print_info "Guide de création de site"
    echo ""
    echo "📋 Étapes pour créer un site :"
    echo "=============================="
    echo "1. Dans votre serveur Forge, cliquez sur 'Sites'"
    echo "2. Cliquez sur 'New Site'"
    echo "3. Entrez le nom du site :"
    echo "   - Exemple : api.coovia.com"
    echo "   - Ou : coovia-api.com"
    echo "4. Sélectionnez PHP 8.2"
    echo "5. Cliquez sur 'Add Site'"
    echo ""
    echo "🔧 Configuration du repository :"
    echo "1. Dans votre site, allez dans 'Git Repository'"
    echo "2. Entrez l'URL de votre repository Git"
    echo "3. Sélectionnez la branche (main ou master)"
    echo "4. Cliquez sur 'Install Repository'"
    echo ""
    echo "⚙️ Configuration de l'environnement :"
    echo "1. Dans votre site, allez dans 'Environment'"
    echo "2. Copiez le contenu de production.env"
    echo "3. Adaptez les variables selon votre configuration"
    echo "4. Sauvegardez"
    echo ""
    
    read -p "Avez-vous créé un site ? (y/N): " -n 1 -r
    echo
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_success "Site créé !"
        print_info "Vous pouvez maintenant déployer avec : ./forge-cli-deploy.sh"
    else
        print_info "Créez un site d'abord, puis relancez ce script"
    fi
}

# Menu principal
show_menu() {
    echo ""
    echo "🔧 Menu de configuration Forge CLI"
    echo "=================================="
    echo "1. Vérifier/Installer Forge CLI"
    echo "2. Authentification"
    echo "3. Vérifier les serveurs"
    echo "4. Vérifier les sites"
    echo "5. Configuration complète"
    echo "6. Quitter"
    echo ""
}

# Configuration complète
complete_setup() {
    print_info "Configuration complète en cours..."
    
    check_forge_cli
    echo ""
    
    if ! check_authentication; then
        guide_authentication
        echo ""
    fi
    
    check_servers
    echo ""
    
    check_sites
    echo ""
    
    print_success "Configuration terminée !"
    print_info "Vous pouvez maintenant utiliser : ./forge-cli-deploy.sh"
}

# Fonction principale
main() {
    echo "🔧 Configuration initiale Forge CLI"
    echo "===================================="
    echo ""
    
    # Menu interactif
    while true; do
        show_menu
        read -p "Choisissez une option (1-6): " choice
        
        case $choice in
            1)
                check_forge_cli
                ;;
            2)
                if ! check_authentication; then
                    guide_authentication
                else
                    print_success "Déjà authentifié"
                fi
                ;;
            3)
                check_servers
                ;;
            4)
                check_sites
                ;;
            5)
                complete_setup
                break
                ;;
            6)
                print_info "Au revoir!"
                exit 0
                ;;
            *)
                print_error "Option invalide"
                ;;
        esac
        
        echo ""
        read -p "Appuyez sur Entrée pour continuer..."
    done
}

# Exécuter la fonction principale
main
