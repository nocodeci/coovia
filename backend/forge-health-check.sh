#!/bin/bash

# Script de vérification de santé post-déploiement pour Laravel Forge
# Ce script vérifie que l'application fonctionne correctement après le déploiement

echo "🏥 Vérification de santé de l'application..."

# Variables
SITE_DIR="/home/forge/api.coovia.com"
DOMAIN="api.coovia.com"
HEALTH_ENDPOINT="https://$DOMAIN/health"
API_ENDPOINT="https://$DOMAIN/api"

# Couleurs pour l'affichage
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Fonction pour afficher les résultats
print_status() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅ $2${NC}"
    else
        echo -e "${RED}❌ $2${NC}"
    fi
}

print_warning() {
    echo -e "${YELLOW}⚠️ $1${NC}"
}

# 1. Vérifier que le répertoire existe
echo "📁 Vérification du répertoire..."
if [ -d "$SITE_DIR" ]; then
    print_status 0 "Répertoire du site trouvé"
else
    print_status 1 "Répertoire du site manquant"
    exit 1
fi

# 2. Vérifier que le fichier .env existe
echo "🔧 Vérification du fichier .env..."
if [ -f "$SITE_DIR/.env" ]; then
    print_status 0 "Fichier .env trouvé"
else
    print_status 1 "Fichier .env manquant"
fi

# 3. Vérifier les permissions
echo "🔐 Vérification des permissions..."
if [ -w "$SITE_DIR/storage" ] && [ -w "$SITE_DIR/bootstrap/cache" ]; then
    print_status 0 "Permissions correctes"
else
    print_status 1 "Problèmes de permissions détectés"
    print_warning "Exécutez: chmod -R 755 $SITE_DIR/storage $SITE_DIR/bootstrap/cache"
fi

# 4. Vérifier la configuration de la base de données
echo "🗄️ Vérification de la base de données..."
cd $SITE_DIR
if php artisan migrate:status > /dev/null 2>&1; then
    print_status 0 "Connexion à la base de données OK"
else
    print_status 1 "Problème de connexion à la base de données"
fi

# 5. Vérifier les services PHP-FPM et Nginx
echo "🔧 Vérification des services..."
if systemctl is-active --quiet php8.2-fpm; then
    print_status 0 "PHP-FPM actif"
else
    print_status 1 "PHP-FPM inactif"
fi

if systemctl is-active --quiet nginx; then
    print_status 0 "Nginx actif"
else
    print_status 1 "Nginx inactif"
fi

# 6. Vérifier l'endpoint de santé
echo "🏥 Test de l'endpoint de santé..."
if curl -s -f "$HEALTH_ENDPOINT" > /dev/null; then
    print_status 0 "Endpoint de santé accessible"
else
    print_status 1 "Endpoint de santé inaccessible"
fi

# 7. Vérifier l'API
echo "🌐 Test de l'API..."
API_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "$API_ENDPOINT")
if [ "$API_RESPONSE" = "200" ] || [ "$API_RESPONSE" = "401" ] || [ "$API_RESPONSE" = "404" ]; then
    print_status 0 "API accessible (HTTP $API_RESPONSE)"
else
    print_status 1 "API inaccessible (HTTP $API_RESPONSE)"
fi

# 8. Vérifier les logs d'erreur
echo "📋 Vérification des logs..."
if [ -f "$SITE_DIR/storage/logs/laravel.log" ]; then
    ERROR_COUNT=$(tail -n 100 "$SITE_DIR/storage/logs/laravel.log" | grep -c "ERROR\|CRITICAL\|EMERGENCY" || echo "0")
    if [ "$ERROR_COUNT" -eq 0 ]; then
        print_status 0 "Aucune erreur récente dans les logs"
    else
        print_warning "$ERROR_COUNT erreurs récentes dans les logs"
    fi
else
    print_warning "Fichier de log Laravel non trouvé"
fi

# 9. Vérifier l'espace disque
echo "💾 Vérification de l'espace disque..."
DISK_USAGE=$(df -h "$SITE_DIR" | tail -1 | awk '{print $5}' | sed 's/%//')
if [ "$DISK_USAGE" -lt 80 ]; then
    print_status 0 "Espace disque suffisant ($DISK_USAGE% utilisé)"
else
    print_warning "Espace disque faible ($DISK_USAGE% utilisé)"
fi

# 10. Vérifier la mémoire
echo "🧠 Vérification de la mémoire..."
MEMORY_USAGE=$(free | grep Mem | awk '{printf "%.0f", $3/$2 * 100.0}')
if [ "$MEMORY_USAGE" -lt 80 ]; then
    print_status 0 "Mémoire suffisante ($MEMORY_USAGE% utilisée)"
else
    print_warning "Mémoire faible ($MEMORY_USAGE% utilisée)"
fi

# 11. Vérifier les daemons
echo "🔄 Vérification des daemons..."
if pgrep -f "queue:work" > /dev/null; then
    print_status 0 "Queue worker actif"
else
    print_warning "Queue worker inactif"
fi

# 12. Vérifier la configuration SSL
echo "🔒 Vérification SSL..."
if curl -s -I "$HEALTH_ENDPOINT" | grep -q "HTTP/2 200"; then
    print_status 0 "SSL configuré et fonctionnel"
else
    print_warning "SSL non configuré ou problème détecté"
fi

# 13. Vérifier les variables d'environnement critiques
echo "⚙️ Vérification des variables d'environnement..."
cd $SITE_DIR
if grep -q "APP_KEY=base64:" .env; then
    print_status 0 "Clé d'application configurée"
else
    print_status 1 "Clé d'application manquante"
fi

if grep -q "APP_ENV=production" .env; then
    print_status 0 "Environnement de production configuré"
else
    print_warning "Environnement non configuré en production"
fi

if grep -q "APP_DEBUG=false" .env; then
    print_status 0 "Mode debug désactivé"
else
    print_warning "Mode debug activé en production"
fi

# 14. Test de performance basique
echo "⚡ Test de performance..."
START_TIME=$(date +%s.%N)
curl -s "$HEALTH_ENDPOINT" > /dev/null
END_TIME=$(date +%s.%N)
RESPONSE_TIME=$(echo "$END_TIME - $START_TIME" | bc -l)
RESPONSE_TIME_MS=$(echo "$RESPONSE_TIME * 1000" | bc -l | cut -d. -f1)

if [ "$RESPONSE_TIME_MS" -lt 1000 ]; then
    print_status 0 "Performance OK (${RESPONSE_TIME_MS}ms)"
else
    print_warning "Performance lente (${RESPONSE_TIME_MS}ms)"
fi

# Résumé final
echo ""
echo "📊 Résumé de la vérification de santé:"
echo "======================================"

# Compter les succès et échecs
SUCCESS_COUNT=$(grep -c "✅" <<< "$(tail -n 50 /dev/stdout)" || echo "0")
WARNING_COUNT=$(grep -c "⚠️" <<< "$(tail -n 50 /dev/stdout)" || echo "0")
ERROR_COUNT=$(grep -c "❌" <<< "$(tail -n 50 /dev/stdout)" || echo "0")

echo "✅ Succès: $SUCCESS_COUNT"
echo "⚠️ Avertissements: $WARNING_COUNT"
echo "❌ Erreurs: $ERROR_COUNT"

if [ "$ERROR_COUNT" -eq 0 ]; then
    echo -e "${GREEN}🎉 Application en bonne santé!${NC}"
    exit 0
else
    echo -e "${RED}⚠️ Problèmes détectés. Vérifiez les erreurs ci-dessus.${NC}"
    exit 1
fi
