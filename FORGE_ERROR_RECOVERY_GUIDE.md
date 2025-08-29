# 🚨 Guide de Récupération - Erreur Forge

## ❌ **Erreur Rencontrée :**

```
/home/forge/.forge/provision-124938632.sh: line 3: syntax error near unexpected token `>'
/home/forge/.forge/provision-124938632.sh: line 3: `php artisan tinker >>> App\Models\User::first();'
```

## 🔍 **Cause de l'Erreur :**

**Les commandes Tinker ne peuvent pas être exécutées directement dans un script shell !**

- ❌ **Incorrect :** `php artisan tinker >>> App\Models\User::first();`
- ✅ **Correct :** Utiliser des scripts PHP temporaires ou des commandes artisan

## 🚀 **Solutions Immédiates :**

### **1. Utiliser le Script Corrigé :**

```bash
# Sur le serveur Forge
cd /home/forge/api.wozif.com

# Utiliser le script corrigé
php test-auth-with-token-fixed.php
```

### **2. Commande Artisan Directe :**

```bash
# Créer un token directement
php artisan tinker --execute="echo App\Models\User::first()->createToken('test-token')->plainTextToken;"
```

### **3. Script PHP Temporaire :**

```bash
# Créer un fichier temporaire
cat > /tmp/create_token.php << 'EOF'
<?php
require_once "vendor/autoload.php";
$app = require_once "bootstrap/app.php";
$app->make("Illuminate\Contracts\Console\Kernel")->bootstrap();

$user = App\Models\User::first();
if ($user) {
    $token = $user->createToken("test-token")->plainTextToken;
    echo $token;
} else {
    echo "AUCUN_UTILISATEUR";
}
EOF

# Exécuter le script
php /tmp/create_token.php

# Nettoyer
rm /tmp/create_token.php
```

## 🔧 **Prévention des Erreurs :**

### **❌ À ÉVITER :**
```bash
# Ne jamais faire ça dans un script shell
php artisan tinker >>> App\Models\User::first();
php artisan tinker >>> echo "test";
```

### **✅ À UTILISER :**
```bash
# Scripts PHP temporaires
php artisan tinker --execute="echo App\Models\User::first();"

# Commandes artisan directes
php artisan db:show
php artisan route:list
```

## 📋 **Checklist de Récupération :**

### **Immédiat :**
- [ ] **Arrêter** le script Forge défaillant
- [ ] **Utiliser** le script corrigé `test-auth-with-token-fixed.php`
- [ ] **Vérifier** que l'authentification fonctionne

### **Prévention :**
- [ ] **Tester** tous les scripts avant déploiement
- [ ] **Utiliser** des méthodes alternatives à Tinker
- [ ] **Vérifier** la syntaxe des commandes shell

## 🎯 **Résultat Attendu :**

**Après correction :**
- ✅ **Script Forge** s'exécute sans erreur
- ✅ **Authentification** testée avec succès
- ✅ **Token généré** automatiquement
- ✅ **Routes protégées** fonctionnent

## 🔍 **Diagnostic Complet :**

### **1. Vérifier l'État du Serveur :**
```bash
# Vérifier les processus PHP
ps aux | grep php

# Vérifier les logs Laravel
tail -f storage/logs/laravel.log

# Vérifier l'espace disque
df -h
```

### **2. Vérifier la Base de Données :**
```bash
# Utiliser le script corrigé
php test-auth-with-token-fixed.php

# Ou créer un token manuellement
php artisan tinker --execute="echo App\Models\User::first()->createToken('test-token')->plainTextToken;"
```

### **3. Tester l'API :**
```bash
# Avec le token généré
curl -H "Authorization: Bearer VOTRE_TOKEN" \
     -H "Accept: application/json" \
     "https://api.wozif.com/api/user/stores"
```

## 💡 **Conseils Importants :**

1. **Toujours tester** les scripts avant déploiement
2. **Utiliser des alternatives** à Tinker dans les scripts shell
3. **Vérifier la syntaxe** des commandes
4. **Garder des sauvegardes** des configurations

## 🎉 **Prochaines Étapes :**

1. **Utiliser** le script corrigé
2. **Tester** l'authentification
3. **Vérifier** que tout fonctionne
4. **Déployer** les corrections

---

**💡 Utilisez toujours `test-auth-with-token-fixed.php` au lieu de l'ancien script !**
