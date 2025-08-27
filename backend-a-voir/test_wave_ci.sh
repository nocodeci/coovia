#!/bin/bash

# Script de test pour l'intégration Wave CI
echo "🌊 Test d'intégration Wave CI - Paydunya SOFTPAY"
echo "=================================================="

# Variables
API_URL="http://localhost:8000"
TEST_STORE="test-store"
TEST_PRODUCT="test-product-123"
TEST_AMOUNT=5000

echo ""
echo "1. Test de création de facture Wave CI..."
echo "----------------------------------------"

# Créer une facture
RESPONSE=$(curl -s -X POST "$API_URL/api/payment/initialize" \
  -H "Content-Type: application/json" \
  -d "{
    \"storeId\": \"$TEST_STORE\",
    \"productId\": \"$TEST_PRODUCT\",
    \"productName\": \"Produit de Test Wave CI\",
    \"amount\": $TEST_AMOUNT,
    \"currency\": \"XOF\",
    \"customer\": {
      \"email\": \"test@example.com\",
      \"firstName\": \"Test\",
      \"lastName\": \"User\",
      \"phone\": \"+2250703324674\"
    },
    \"paymentMethod\": \"wave-ci\",
    \"paymentCountry\": \"Côte d'\''Ivoire\"
  }")

echo "Réponse création facture:"
echo "$RESPONSE"

# Extraire le token
TOKEN=$(echo "$RESPONSE" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
    echo "❌ Erreur: Impossible d'extraire le token de paiement"
    echo "Vérifiez que la facture a été créée avec succès"
    exit 1
fi

echo ""
echo "✅ Token extrait: $TOKEN"
echo ""

echo "2. Test de paiement Wave CI SOFTPAY..."
echo "--------------------------------------"

# Tester le paiement Wave CI
PAYMENT_RESPONSE=$(curl -s -X POST "$API_URL/api/process-wave-ci-payment" \
  -H "Content-Type: application/json" \
  -d "{
    \"phone_number\": \"0703324674\",
    \"payment_token\": \"$TOKEN\",
    \"customer_name\": \"Test User\",
    \"customer_email\": \"test@example.com\"
  }")

echo "Réponse paiement Wave CI:"
echo "$PAYMENT_RESPONSE"

echo ""
echo "3. Vérification des logs..."
echo "---------------------------"

# Afficher les dernières lignes des logs
echo "Dernières lignes des logs Laravel:"
tail -n 10 storage/logs/laravel.log

echo ""
echo "🌊 Test d'intégration Wave CI terminé !"
echo "========================================" 