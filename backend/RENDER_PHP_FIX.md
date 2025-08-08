# 🔧 Correction du Problème Node.js vs PHP sur Render

## 🚨 Problème Détecté

Render détecte automatiquement Node.js au lieu de PHP à cause de la présence de `package.json` dans le projet.

## ✅ Solutions Appliquées

### 1. Fichier `.render-buildpacks`
```
https://github.com/heroku/heroku-buildpack-php
```

### 2. Package.json Modifié
```json
{
  "name": "coovia-backend",
  "version": "1.0.0",
  "description": "Coovia Laravel Backend",
  "engines": {
    "node": "22.16.0"
  },
  "scripts": {
    "build": "echo 'PHP application - no build required'",
    "start": "echo 'Starting PHP application'"
  },
  "render": {
    "env": "php"
  }
}
```

### 3. Render.yaml Configuré
```yaml
services:
  - type: web
    name: coovia-backend
    env: php  # Force l'environnement PHP
    plan: free
    buildCommand: |
      composer install --no-dev --optimize-autoloader
      php artisan config:cache
      php artisan route:cache
      php artisan view:cache
    startCommand: |
      chmod +x deploy.sh
      ./deploy.sh
      vendor/bin/heroku-php-apache2 public/
```

## 🎯 Étapes de Correction

### 1. Redéployer avec la Configuration Corrigée
```bash
cd backend
git add .
git commit -m "Fix PHP environment detection on Render"
git push origin main
```

### 2. Dans l'Interface Render
1. Aller dans votre service web
2. **Settings** → **Environment**
3. Vérifier que **Environment** est défini sur `PHP`
4. **Manual Deploy** → **Deploy latest commit**

### 3. Vérifier les Logs
Dans les logs de build, vous devriez voir :
```
==> Using PHP version 8.2
==> Installing Composer dependencies...
==> Running build command...
```

## 🚨 Si le Problème Persiste

### Option 1: Supprimer package.json
```bash
# Si vous n'utilisez pas Node.js dans le backend
rm package.json
rm package-lock.json
```

### Option 2: Créer un Dossier Séparé
```bash
# Créer un dossier spécifique pour le déploiement
mkdir render-deploy
cp -r app render-deploy/
cp -r config render-deploy/
cp -r database render-deploy/
cp -r resources render-deploy/
cp -r routes render-deploy/
cp -r storage render-deploy/
cp -r vendor render-deploy/
cp composer.json render-deploy/
cp composer.lock render-deploy/
cp artisan render-deploy/
cp render.yaml render-deploy/
cp Procfile render-deploy/
cp deploy.sh render-deploy/
```

### Option 3: Configuration Manuelle
Dans l'interface Render :
1. **Settings** → **Build & Deploy**
2. **Build Command**: `composer install --no-dev --optimize-autoloader`
3. **Start Command**: `vendor/bin/heroku-php-apache2 public/`

## 📊 Vérification

### Logs de Build Corrects
```
==> Using PHP version 8.2
==> Installing Composer dependencies...
==> Running build command...
==> Build completed successfully
```

### Logs de Runtime Corrects
```
==> Starting PHP application...
==> Running deploy.sh...
==> Starting Apache server...
```

## 🔧 Dépannage Avancé

### Vérifier les Buildpacks
```bash
# Dans les logs Render
heroku buildpacks:set https://github.com/heroku/heroku-buildpack-php
```

### Forcer l'Environnement PHP
```bash
# Dans render.yaml
env: php
buildCommand: composer install --no-dev --optimize-autoloader
startCommand: vendor/bin/heroku-php-apache2 public/
```

## 📞 Support

- **Render Documentation**: https://render.com/docs/deploy-php
- **Heroku Buildpack PHP**: https://github.com/heroku/heroku-buildpack-php
- **Logs Render**: Interface web de Render
