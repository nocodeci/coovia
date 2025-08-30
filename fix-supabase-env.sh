#!/bin/bash

echo "🔧 Correction de la Configuration Supabase PostgreSQL"
echo "=================================================="
echo ""

# Vérifier si le fichier .env existe
if [ ! -f ".env" ]; then
    echo "❌ Fichier .env non trouvé !"
    exit 1
fi

echo "📋 Configuration actuelle détectée :"
echo "-----------------------------------"
grep -E "DB_(CONNECTION|HOST|PORT|DATABASE|USERNAME)" .env
echo ""

echo "🔧 Application des corrections..."
echo "-------------------------------"

# Sauvegarder le fichier original
cp .env .env.backup.$(date +%Y%m%d_%H%M%S)
echo "✅ Fichier .env sauvegardé"

# Corriger le port (6543 -> 5432)
sed -i '' 's/DB_PORT=6543/DB_PORT=5432/' .env
echo "✅ Port corrigé : 6543 -> 5432"

# Commenter la ligne DB_URL problématique
sed -i '' 's/^DB_URL=/# DB_URL=/' .env
echo "✅ DB_URL commenté (pooler désactivé)"

echo ""
echo "📋 Nouvelle configuration :"
echo "-------------------------"
grep -E "DB_(CONNECTION|HOST|PORT|DATABASE|USERNAME)" .env
echo ""

echo "✅ Configuration Supabase corrigée !"
echo ""
echo "📋 Actions requises sur Forge :"
echo "1. Redémarrer PHP-FPM : sudo systemctl restart php8.2-fpm"
echo "2. Redémarrer Nginx : sudo systemctl restart nginx"
echo "3. Vider les caches : php artisan config:clear && php artisan cache:clear"
echo ""
echo "🎯 Résultat attendu :"
echo "- Plus d'erreur 'prepared statement does not exist'"
echo "- Authentification Sanctum fonctionne"
echo "- API complète opérationnelle"
