#!/bin/bash

# Script de test pour vérifier le déploiement Forge
# À exécuter après le déploiement

echo "🧪 Test du déploiement Forge"
echo "============================"

# Variables
DOMAIN="api.coovia.com"
SITE_DIR="/home/forge/api.coovia.com"

# Couleurs
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Test 1: Vérifier que le site répond
echo "1. Test de réponse du site..."
if curl -s -f "https://$DOMAIN" > /dev/null; then
    print_success "Site accessible via HTTPS"
else
    print_error "Site inaccessible via HTTPS"
fi

# Test 2: Vérifier l'endpoint de santé
echo "2. Test de l'endpoint de santé..."
HEALTH_RESPONSE=$(curl -s "https://$DOMAIN/health")
if [ "$HEALTH_RESPONSE" = "healthy" ]; then
    print_success "Endpoint de santé fonctionnel"
else
    print_warning "Endpoint de santé ne répond pas correctement"
fi

# Test 3: Vérifier l'API
echo "3. Test de l'API..."
API_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "https://$DOMAIN/api")
if [ "$API_RESPONSE" = "200" ] || [ "$API_RESPONSE" = "401" ] || [ "$API_RESPONSE" = "404" ]; then
    print_success "API accessible (HTTP $API_RESPONSE)"
else
    print_warning "API inaccessible (HTTP $API_RESPONSE)"
fi

# Test 4: Vérifier la base de données
echo "4. Test de la base de données..."
cd "$SITE_DIR"
if php artisan migrate:status > /dev/null 2>&1; then
    print_success "Connexion à la base de données OK"
else
    print_error "Problème de connexion à la base de données"
fi

# Test 5: Vérifier les permissions
echo "5. Test des permissions..."
if [ -w "$SITE_DIR/storage" ] && [ -w "$SITE_DIR/bootstrap/cache" ]; then
    print_success "Permissions correctes"
else
    print_error "Problème de permissions"
fi

# Test 6: Vérifier les logs
echo "6. Test des logs..."
if [ -f "$SITE_DIR/storage/logs/laravel.log" ]; then
    print_success "Fichier de logs accessible"
    # Vérifier les erreurs récentes
    RECENT_ERRORS=$(tail -n 50 "$SITE_DIR/storage/logs/laravel.log" | grep -i error | wc -l)
    if [ "$RECENT_ERRORS" -eq 0 ]; then
        print_success "Aucune erreur récente dans les logs"
    else
        print_warning "$RECENT_ERRORS erreurs récentes dans les logs"
    fi
else
    print_warning "Fichier de logs non trouvé"
fi

# Test 7: Vérifier SSL
echo "7. Test du certificat SSL..."
SSL_INFO=$(echo | openssl s_client -servername "$DOMAIN" -connect "$DOMAIN:443" 2>/dev/null | openssl x509 -noout -dates)
if echo "$SSL_INFO" | grep -q "notAfter"; then
    print_success "Certificat SSL valide"
else
    print_error "Problème avec le certificat SSL"
fi

# Test 8: Vérifier les services
echo "8. Test des services..."
if systemctl is-active --quiet nginx; then
    print_success "Nginx actif"
else
    print_error "Nginx inactif"
fi

if systemctl is-active --quiet php8.2-fpm; then
    print_success "PHP-FPM actif"
else
    print_error "PHP-FPM inactif"
fi

echo ""
echo "🎯 Résumé des tests :"
echo "===================="
echo "✅ Tests terminés"
echo ""
echo "📋 Prochaines étapes :"
echo "1. Vérifier les variables d'environnement dans Forge"
echo "2. Configurer les daemons (queues)"
echo "3. Configurer les sauvegardes"
echo "4. Tester les fonctionnalités spécifiques de votre application"
echo ""
echo "🔧 Commandes utiles :"
echo "cd $SITE_DIR"
echo "php artisan config:cache"
echo "php artisan route:list"
echo "tail -f storage/logs/laravel.log"
