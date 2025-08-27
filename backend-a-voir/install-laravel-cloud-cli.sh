#!/bin/bash

echo "Installation de Laravel Cloud CLI..."

# Créer le répertoire bin s'il n'existe pas
mkdir -p ~/.local/bin

# Télécharger Laravel Cloud CLI
echo "Téléchargement de Laravel Cloud CLI..."
curl -L https://github.com/laravel/cloud-cli/releases/latest/download/laravel-cloud-cli-darwin-amd64 -o ~/.local/bin/laravel-cloud

# Rendre le fichier exécutable
chmod +x ~/.local/bin/laravel-cloud

# Ajouter au PATH si pas déjà fait
if [[ ":$PATH:" != *":$HOME/.local/bin:"* ]]; then
    echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.zshrc
    export PATH="$HOME/.local/bin:$PATH"
fi

echo "Laravel Cloud CLI installé dans ~/.local/bin/laravel-cloud"
echo "Veuillez redémarrer votre terminal ou exécuter: source ~/.zshrc"

# Vérifier l'installation
if command -v laravel-cloud &> /dev/null; then
    echo "✅ Laravel Cloud CLI installé avec succès!"
    laravel-cloud --version
else
    echo "❌ Installation échouée. Veuillez redémarrer votre terminal."
fi
