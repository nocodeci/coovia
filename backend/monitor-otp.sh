#!/bin/bash

echo "🔍 Surveillance des OTP en temps réel"
echo "====================================="
echo "Appuyez sur Ctrl+C pour arrêter"
echo ""

# Surveiller les logs Laravel pour les OTP
tail -f storage/logs/laravel.log | grep --line-buffered "OTP pour"

