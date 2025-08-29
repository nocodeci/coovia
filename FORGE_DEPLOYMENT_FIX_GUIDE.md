# 🔧 Guide de Correction des Problèmes de Déploiement Forge

## 🚨 **PROBLÈME IDENTIFIÉ**

```
error: Your local changes to the following files would be overwritten by merge:
	app/Http/Controllers/Api/CloudflareController.php
Please commit your changes or stash them before you merge.
```

## 🛠️ **SOLUTION RAPIDE**

### **Option 1: Commandes Manuelles (SSH)**

```bash
# 1. Se connecter au serveur
ssh forge@your-server

# 2. Aller dans le répertoire du projet
cd /home/forge/api.wozif.com

# 3. Nettoyer l'état Git
git reset --hard HEAD
git clean -df

# 4. Récupérer les dernières modifications
git fetch origin
git pull origin backend-laravel-clean

# 5. Nettoyer les caches Laravel
php artisan config:clear
php artisan cache:clear
php artisan route:clear
php artisan view:clear

# 6. Redémarrer PHP-FPM
sudo systemctl restart php8.3-fpm
```

### **Option 2: Script Automatisé**

```bash
# Sur le serveur, exécuter le script
cd /home/forge/api.wozif.com
php fix-forge-deployment.php
```

## 📋 **ÉTAPES DÉTAILLÉES**

### **1. Diagnostic Initial**
```bash
pwd                    # Vérifier qu'on est dans /home/forge/api.wozif.com
git status            # Voir les conflits
git log --oneline -3  # Voir les derniers commits
```

### **2. Nettoyage Git**
```bash
# Annuler toutes les modifications locales
git reset --hard HEAD

# Supprimer les fichiers non trackés
git clean -df

# Vérifier que c'est propre
git status
```

### **3. Mise à Jour**
```bash
# Récupérer les dernières modifications
git fetch origin

# Appliquer les modifications
git pull origin backend-laravel-clean

# Vérifier le commit actuel
git log --oneline -3
```

### **4. Nettoyage Laravel**
```bash
php artisan config:clear    # Cache de configuration
php artisan cache:clear     # Cache application
php artisan route:clear     # Cache des routes
php artisan view:clear      # Cache des vues
```

### **5. Redémarrage Services**
```bash
sudo systemctl restart php8.3-fpm
sudo systemctl restart nginx  # Si nécessaire
```

## 🧪 **TESTS POST-DÉPLOIEMENT**

### **Test API de Base**
```bash
curl -s "https://api.wozif.com/api/user/stores" | jq
```

### **Test Upload Cloudflare**
```bash
curl -X POST "https://api.wozif.com/api/cloudflare/upload" \
  -F "file=@test-file.txt" \
  -F "store_id=9fbf121f-1496-4f97-ad7f-096b3866e813" \
  -F "type=document"
```

### **Vérifier les Logs**
```bash
tail -f storage/logs/laravel.log | grep "🔥"
```

## 🔍 **CAUSES COMMUNES DU PROBLÈME**

1. **Modifications manuelles** sur le serveur
2. **Fichiers générés automatiquement** (cache, logs)
3. **Permissions incorrectes**
4. **Conflit de merge** Git

## 💡 **PRÉVENTION FUTURE**

1. **Ne jamais modifier** les fichiers directement sur le serveur
2. **Utiliser .gitignore** pour les fichiers générés
3. **Tester en local** avant le push
4. **Vérifier les permissions** régulièrement

## 🚨 **SI LE PROBLÈME PERSISTE**

### **Reset Complet (Dernier Recours)**
```bash
# ATTENTION: Cela supprime TOUT l'historique local
rm -rf .git
git init
git remote add origin https://github.com/nocodeci/coovia.git
git fetch origin backend-laravel-clean
git checkout -b backend-laravel-clean origin/backend-laravel-clean
```

### **Vérification des Permissions**
```bash
# Corriger les permissions si nécessaire
sudo chown -R forge:forge /home/forge/api.wozif.com
sudo chmod -R 755 /home/forge/api.wozif.com
sudo chmod -R 775 storage bootstrap/cache
```

## 📞 **CONTACT D'URGENCE**

Si rien ne fonctionne:
1. Prendre un screenshot de l'erreur exacte
2. Copier le output complet de `git status`
3. Vérifier les logs: `tail -50 storage/logs/laravel.log`

---
*Guide créé le 29 août 2025 pour résoudre les problèmes de déploiement Forge*
