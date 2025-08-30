# 🔧 Solution Définitive aux Conflits de Déploiement Forge

## 🚨 **PROBLÈME RÉCURRENT**

**À chaque commit, Forge affiche :**
```
error: Your local changes to the following files would be overwritten by merge:
	app/Http/Controllers/Api/CloudflareController.php
Please commit your changes or stash them before you merge.
```

## 🔍 **CAUSE RACINE**

Le serveur Forge a des **modifications locales** qui entrent en conflit avec chaque `git pull`. Ces modifications viennent de :

1. **Fichiers générés automatiquement** (cache, logs, vues)
2. **Modifications manuelles** sur le serveur
3. **Fichiers temporaires** créés pendant les tests
4. **Permissions incorrectes** qui empêchent Git de fonctionner

## 🛠️ **SOLUTIONS APPLIQUÉES**

### **1. .gitignore Amélioré**
```bash
# Fichiers Forge à ignorer
bootstrap/cache/*.php
storage/framework/views/*.php
storage/framework/cache/*.php
storage/logs/*.log
test-*.txt
test-*.php
```

### **2. Script de Déploiement Automatique**
```bash
# Sur le serveur, exécuter :
chmod +x forge-auto-deploy.sh
./forge-auto-deploy.sh
```

## 🚀 **SOLUTION IMMÉDIATE (Maintenant)**

**Sur le serveur Forge :**
```bash
cd /home/forge/api.wozif.com

# Nettoyer l'état Git
git reset --hard HEAD
git clean -df

# Récupérer les modifications
git pull origin backend-laravel-clean

# Nettoyer les caches
php artisan config:clear
php artisan cache:clear

# Redémarrer PHP-FPM
sudo systemctl restart php8.3-fpm
```

## 🔄 **SOLUTION PERMANENTE (Pour l'avenir)**

### **Option 1: Script Automatique (Recommandé)**
```bash
# Sur le serveur, avant chaque déploiement
cd /home/forge/api.wozif.com
./forge-auto-deploy.sh
```

### **Option 2: Hook Git Pre-Pull**
```bash
# Créer un hook Git qui s'exécute automatiquement
mkdir -p .git/hooks
cp forge-auto-deploy.sh .git/hooks/pre-pull
chmod +x .git/hooks/pre-pull
```

### **Option 3: Cron Job Automatique**
```bash
# Ajouter dans crontab pour nettoyer automatiquement
# Toutes les 5 minutes
*/5 * * * * cd /home/forge/api.wozif.com && git clean -df >/dev/null 2>&1
```

## 🧪 **TEST POST-CORRECTION**

```bash
# 1. Vérifier que l'upload fonctionne
curl -X POST "https://api.wozif.com/api/cloudflare/upload" \
  -F "file=@test-upload.txt" \
  -F "store_id=9fbf121f-1496-4f97-ad7f-096b3866e813" \
  -F "type=document"

# 2. Vérifier les logs saveMediaRecord
tail -f storage/logs/laravel.log | grep "🔥"

# 3. Vérifier la base de données
php artisan tinker --execute="
\$count = \App\Models\StoreMediaFile::where('store_id', '9fbf121f-1496-4f97-ad7f-096b3866e813')->count();
echo 'Fichiers en base: ' . \$count . PHP_EOL;
"
```

## 📋 **CHECKLIST DE DÉPLOIEMENT**

- [ ] **Nettoyer l'état Git** : `git reset --hard HEAD && git clean -df`
- [ ] **Récupérer les modifications** : `git pull origin backend-laravel-clean`
- [ ] **Nettoyer les caches** : `php artisan config:clear`
- [ ] **Redémarrer PHP-FPM** : `sudo systemctl restart php8.3-fpm`
- [ ] **Tester l'API** : Upload d'un fichier test
- [ ] **Vérifier les logs** : Présence des logs 🔥
- [ ] **Vérifier la base** : Fichiers sauvegardés

## 🎯 **POURQUOI ÇA SE PRODUIT**

1. **Forge fait un `git pull`** sur le serveur
2. **Le serveur a des modifications locales** (cache, logs, tests)
3. **Git refuse de faire le merge** pour éviter de perdre des données
4. **Le déploiement échoue** avec l'erreur de conflit

## 💡 **BONNES PRATIQUES**

1. **Ne jamais modifier** les fichiers directement sur le serveur
2. **Utiliser le script** `forge-auto-deploy.sh` avant chaque déploiement
3. **Tester en local** avant de pousser sur GitHub
4. **Vérifier .gitignore** pour les nouveaux types de fichiers
5. **Nettoyer régulièrement** les fichiers temporaires

## 🆘 **EN CAS D'URGENCE**

Si rien ne fonctionne :
```bash
# Reset complet (DERNIER RECOURS)
cd /home/forge/api.wozif.com
rm -rf .git
git init
git remote add origin https://github.com/nocodeci/coovia.git
git fetch origin backend-laravel-clean
git checkout -b backend-laravel-clean origin/backend-laravel-clean
```

---
*Guide créé le 30 août 2025 pour résoudre définitivement les conflits de déploiement Forge*
