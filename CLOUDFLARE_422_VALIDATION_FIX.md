# 🔧 Résolution Erreur 422 - Upload Cloudflare

## 🚨 **Problème Identifié**

L'endpoint `/api/cloudflare/upload` retourne une erreur **422 (Unprocessable Content)** lors de l'upload de fichiers.

## 🔍 **Cause du Problème**

### **Validation Incorrecte**
Le contrôleur `CloudflareController` validait le `store_id` comme un **entier** :
```php
// AVANT (incorrect)
'store_id' => 'integer|exists:stores,id',
```

Mais votre application utilise des **UUIDs** (chaînes de caractères) :
```
9fbbeec1-6aab-4de3-a152-9cf8ae719f62
```

### **Conflit de Types**
- **Validation attendue** : `integer` (nombre entier)
- **Données envoyées** : `string` (UUID)
- **Résultat** : Erreur 422 - Validation échoue

## ✅ **Solution Appliquée**

### **1. Correction de la Validation**
```php
// APRÈS (correct)
'store_id' => 'required|string|exists:stores,id',
```

### **2. Fichier Modifié**
- **`app/Http/Controllers/Api/CloudflareController.php`**
- **Méthode** : `uploadFromFrontend()`
- **Ligne** : ~130

## 🚀 **Étapes de Déploiement**

### **1. Redémarrer le Serveur Forge**
Les modifications ont été poussées sur GitHub, mais le serveur Forge doit être redémarré :

```bash
# Sur le serveur Forge
sudo systemctl restart php8.2-fpm
sudo systemctl restart nginx
```

### **2. Test de Validation**
Après le redémarrage, testez avec le script automatique :

```bash
./test-cloudflare-upload-fixed.sh
```

## 🧪 **Test Manuel**

### **Test d'Upload avec UUID**
```bash
curl -X POST https://api.wozif.com/api/cloudflare/upload \
  -F "file=@test-file.txt" \
  -F "type=document" \
  -F "store_id=9fbbeec1-6aab-4de3-a152-9cf8ae719f62" \
  -H "Origin: https://app.wozif.store"
```

### **Résultat Attendu**
```json
{
  "success": true,
  "message": "Fichier uploadé avec succès",
  "data": {
    "path": "stores/9fbbeec1-6aab-4de3-a152-9cf8ae719f62/documents/...",
    "filename": "...",
    "urls": {
      "original": "https://...",
      "cdn": "https://..."
    }
  }
}
```

## 📋 **Validation des Données**

### **Champs Requis**
- ✅ **`file`** : Fichier à uploader (max 10MB)
- ✅ **`store_id`** : UUID du store (maintenant accepté)
- ⚠️ **`type`** : Type de fichier (optionnel, valeurs autorisées)

### **Types de Fichiers Supportés**
```php
'type' => 'string|in:image,video,document,avatar,product'
```

### **Taille Maximale**
- **Limite** : 10MB (10,240 KB)
- **Validation** : `max:10240`

## 🔧 **Dépannage Supplémentaire**

### **Si l'erreur 422 persiste :**

1. **Vérifier les logs Laravel** :
   ```bash
   tail -f /var/www/coovia/storage/logs/laravel.log
   ```

2. **Vérifier la validation en temps réel** :
   ```bash
   php artisan tinker
   Validator::make(['store_id' => '9fbbeec1-6aab-4de3-a152-9cf8ae719f62'], ['store_id' => 'required|string|exists:stores,id']);
   ```

3. **Tester la connexion R2** :
   ```bash
   php artisan tinker
   Storage::disk('r2')->listContents('/', false);
   ```

## 📝 **Notes Importantes**

- **Redémarrage obligatoire** : Les modifications de code ne prennent effet qu'après redémarrage du serveur
- **UUIDs supportés** : Tous les IDs de store au format UUID sont maintenant acceptés
- **Validation robuste** : Le contrôleur vérifie toujours l'existence du store dans la base de données

## 🎯 **Résultat Attendu**

Après application de la correction et redémarrage du serveur :
- ✅ Upload de fichiers vers Cloudflare R2 fonctionnel
- ✅ Support des UUIDs pour l'identification des stores
- ✅ Validation des données robuste et cohérente
- ✅ Intégration complète avec le frontend

---

**Dernière mise à jour** : $(date)
**Statut** : ✅ Correction appliquée, en attente de redémarrage serveur
**Prochaine action** : Redémarrer Forge et tester l'upload
