#!/bin/bash

# Script de déploiement via CLI Forge
# Ce script automatise le déploiement une fois que le serveur est créé dans Forge

echo "🚀 Déploiement via CLI Forge"
echo "============================"

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
SITE_NAME="api.coovia.com"
SERVER_NAME="coovia-server"
GIT_REPO="https://github.com/votre-username/coovia.git"
GIT_BRANCH="main"

# Vérifier que forge CLI est installé
if ! command -v forge &> /dev/null; then
    print_error "Forge CLI n'est pas installé"
    print_info "Installez-le avec: composer global require laravel/forge-cli"
    exit 1
fi

# Vérifier l'authentification
print_info "Vérification de l'authentification Forge..."
if ! forge server:list &> /dev/null; then
    print_error "Non authentifié avec Forge"
    print_info "Exécutez: forge login"
    exit 1
fi

print_success "Authentifié avec Forge"

# Lister les serveurs disponibles
print_info "Serveurs disponibles:"
forge server:list

# Demander à l'utilisateur de sélectionner un serveur
echo ""
print_info "Si aucun serveur n'est listé, créez-en un d'abord sur forge.laravel.com"
print_info "Une fois le serveur créé, notez son nom et continuez ce script"
echo ""

read -p "Nom du serveur à utiliser (ou appuyez sur Entrée pour continuer): " SELECTED_SERVER

if [ -n "$SELECTED_SERVER" ]; then
    SERVER_NAME="$SELECTED_SERVER"
    print_info "Utilisation du serveur: $SERVER_NAME"
    
    # Basculer vers le serveur sélectionné
    forge server:switch "$SERVER_NAME"
    print_success "Basculé vers le serveur $SERVER_NAME"
fi

# Lister les sites disponibles
print_info "Sites disponibles sur le serveur:"
forge site:list

# Vérifier si le site existe déjà
SITE_EXISTS=false
if forge site:list | grep -q "$SITE_NAME"; then
    SITE_EXISTS=true
    print_warning "Le site $SITE_NAME existe déjà"
else
    print_info "Le site $SITE_NAME n'existe pas encore"
    print_info "Créez-le d'abord sur forge.laravel.com"
    print_info "Puis configurez le repository Git et les variables d'environnement"
fi

# Fonction pour configurer l'environnement
configure_environment() {
    print_info "Configuration de l'environnement..."
    
    # Télécharger le fichier .env actuel
    if [ "$SITE_EXISTS" = true ]; then
        print_info "Téléchargement du fichier .env actuel..."
        forge env:pull "$SITE_NAME"
        
        if [ -f ".env" ]; then
            print_success "Fichier .env téléchargé"
            
            # Vérifier les variables critiques
            if ! grep -q "APP_KEY=base64:" .env; then
                print_warning "Clé d'application manquante"
            fi
            
            if ! grep -q "APP_ENV=production" .env; then
                print_warning "Environnement non configuré en production"
            fi
            
            if ! grep -q "DB_CONNECTION=pgsql" .env; then
                print_warning "Configuration base de données PostgreSQL manquante"
            fi
            
            if ! grep -q "CLOUDFLARE_R2" .env; then
                print_warning "Configuration Cloudflare R2 manquante"
            fi
        else
            print_error "Impossible de télécharger le fichier .env"
        fi
    else
        print_info "Création d'un nouveau fichier .env..."
        if [ -f "production.env" ]; then
            cp production.env .env
            print_success "Fichier .env créé depuis production.env"
        else
            print_error "Fichier production.env non trouvé"
            exit 1
        fi
    fi
}

# Fonction pour déployer
deploy_site() {
    print_info "Déploiement du site..."
    
    if [ "$SITE_EXISTS" = true ]; then
        # Déployer le site existant
        print_info "Déploiement du site existant $SITE_NAME..."
        forge deploy "$SITE_NAME"
        
        if [ $? -eq 0 ]; then
            print_success "Déploiement terminé avec succès"
        else
            print_error "Erreur lors du déploiement"
            exit 1
        fi
    else
        print_warning "Le site n'existe pas encore"
        print_info "Créez-le d'abord sur forge.laravel.com"
    fi
}

# Fonction pour vérifier les logs
check_logs() {
    print_info "Vérification des logs..."
    
    if [ "$SITE_EXISTS" = true ]; then
        print_info "Logs du site:"
        forge site:logs "$SITE_NAME"
        
        print_info "Logs de déploiement:"
        forge deploy:logs "$SITE_NAME"
        
        print_info "Logs Nginx:"
        forge nginx:logs
        
        print_info "Logs PHP:"
        forge php:logs
    fi
}

# Fonction pour tester l'application
test_application() {
    print_info "Test de l'application..."
    
    if [ "$SITE_EXISTS" = true ]; then
        # Tester l'endpoint de santé
        HEALTH_URL="https://$SITE_NAME/health"
        print_info "Test de l'endpoint de santé: $HEALTH_URL"
        
        if curl -s -f "$HEALTH_URL" > /dev/null; then
            print_success "Endpoint de santé accessible"
        else
            print_warning "Endpoint de santé inaccessible"
        fi
        
        # Tester l'API
        API_URL="https://$SITE_NAME/api"
        print_info "Test de l'API: $API_URL"
        
        API_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL")
        if [ "$API_RESPONSE" = "200" ] || [ "$API_RESPONSE" = "401" ] || [ "$API_RESPONSE" = "404" ]; then
            print_success "API accessible (HTTP $API_RESPONSE)"
        else
            print_warning "API inaccessible (HTTP $API_RESPONSE)"
        fi
    fi
}

# Fonction pour configurer les daemons
configure_daemons() {
    print_info "Configuration des daemons..."
    
    if [ "$SITE_EXISTS" = true ]; then
        print_info "Daemons actuels:"
        forge daemon:list
        
        print_warning "Configurez manuellement les daemons dans Forge:"
        print_info "- Queue Worker: php /home/forge/$SITE_NAME/artisan queue:work --sleep=3 --tries=3 --max-time=3600"
        print_info "- Schedule Runner: php /home/forge/$SITE_NAME/artisan schedule:run"
    fi
}

# Fonction pour ouvrir le site dans Forge
open_in_forge() {
    print_info "Ouverture du site dans Forge..."
    
    if [ "$SITE_EXISTS" = true ]; then
        forge open "$SITE_NAME"
        print_success "Site ouvert dans Forge"
    else
        print_warning "Le site n'existe pas encore"
        print_info "Créez-le d'abord sur forge.laravel.com"
    fi
}

# Fonction pour afficher les informations finales
show_final_info() {
    echo ""
    echo "🎉 Déploiement via CLI terminé!"
    echo "==============================="
    echo ""
    echo "📋 Informations importantes:"
    echo "============================"
    echo "🌐 URL de l'application: https://$SITE_NAME"
    echo "🔧 Serveur: $SERVER_NAME"
    echo ""
    echo "📝 Prochaines étapes:"
    echo "===================="
    echo "1. Configurez SSL avec Let's Encrypt dans Forge"
    echo "2. Configurez les daemons (queues)"
    echo "3. Configurez les sauvegardes"
    echo "4. Testez l'application"
    echo ""
    echo "🔧 Commandes utiles:"
    echo "==================="
    echo "forge site:list                    # Lister les sites"
    echo "forge deploy $SITE_NAME            # Déployer le site"
    echo "forge site:logs $SITE_NAME         # Voir les logs du site"
    echo "forge deploy:logs $SITE_NAME       # Voir les logs de déploiement"
    echo "forge open $SITE_NAME              # Ouvrir dans Forge"
    echo "forge ssh                          # Se connecter en SSH"
    echo ""
    echo "📖 Documentation:"
    echo "================"
    echo "- Guide complet: FORGE_DEPLOYMENT_GUIDE.md"
    echo "- Script de santé: ./forge-health-check.sh"
    echo "- Configuration sauvegardes: ./forge-backup-config.sh"
}

# Menu principal
show_menu() {
    echo ""
    echo "🔧 Menu de déploiement Forge CLI"
    echo "================================"
    echo "1. Configurer l'environnement"
    echo "2. Déployer le site"
    echo "3. Vérifier les logs"
    echo "4. Tester l'application"
    echo "5. Configurer les daemons"
    echo "6. Ouvrir dans Forge"
    echo "7. Déploiement complet"
    echo "8. Quitter"
    echo ""
}

# Fonction principale
main() {
    echo "🚀 Début du déploiement via CLI Forge"
    echo "===================================="
    echo ""
    
    # Configuration de l'environnement
    configure_environment
    echo ""
    
    # Menu interactif
    while true; do
        show_menu
        read -p "Choisissez une option (1-8): " choice
        
        case $choice in
            1)
                configure_environment
                ;;
            2)
                deploy_site
                ;;
            3)
                check_logs
                ;;
            4)
                test_application
                ;;
            5)
                configure_daemons
                ;;
            6)
                open_in_forge
                ;;
            7)
                configure_environment
                deploy_site
                check_logs
                test_application
                configure_daemons
                show_final_info
                break
                ;;
            8)
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
