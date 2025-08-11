#!/bin/bash

# Script pour redémarrer le backend avec les nouvelles limites d'upload
echo "🚀 Redémarrage du backend avec les nouvelles limites d'upload..."

# Arrêter les conteneurs existants
echo "📦 Arrêt des conteneurs existants..."
docker-compose down

# Reconstruire l'image avec les nouvelles configurations
echo "🔨 Reconstruction de l'image Docker..."
docker-compose build --no-cache

# Démarrer les conteneurs
echo "▶️ Démarrage des conteneurs..."
docker-compose up -d

# Attendre que le backend soit prêt
echo "⏳ Attente du démarrage du backend..."
sleep 10

# Vérifier les limites d'upload
echo "🔍 Vérification des limites d'upload..."
docker-compose exec backend php check-upload-limits.php

# Afficher les logs
echo "📋 Logs du backend:"
docker-compose logs backend

echo "✅ Redémarrage terminé !"
echo "💡 Les nouvelles limites d'upload sont maintenant actives :"
echo "   - Taille max fichier: 50MB"
echo "   - Taille max totale: 100MB"
echo "   - Nombre max fichiers: 10"
