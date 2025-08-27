# 🚀 Guide de Déploiement CORS sur Forge

## 📋 Problème Identifié
Votre frontend sur `https://app.wozif.store` ne peut pas accéder à votre API backend sur `https://api.wozif.com` à cause d'une erreur CORS.

## ✅ Solution Implémentée
1. **Middleware CORS mis à jour** pour autoriser `https://app.wozif.store`
2. **Configuration CORS Laravel** mise à jour
3. **En-têtes CORS** correctement définis pour les requêtes preflight et normales

## 🔧 Étapes de Déploiement sur Forge

### Étape 1: Vérifier les Modifications
Assurez-vous que les fichiers suivants ont été modifiés :
- `app/Http/Middleware/Cors.php` ✅
- `config/cors.php` ✅

### Étape 2: Déployer sur Forge
```bash
# Dans votre terminal local
cd backend
git add .
git commit -m "Fix CORS configuration for production domains"
git push origin backend-laravel-clean
```

### Étape 3: Redémarrer le Serveur sur Forge
1. Connectez-vous à votre dashboard Forge
2. Sélectionnez votre serveur
3. Allez dans l'onglet "Sites"
4. Cliquez sur votre site `api.wozif.com`
5. Cliquez sur "Restart PHP-FPM"
6. Cliquez sur "Restart Nginx"

### Étape 4: Vérifier la Configuration
Après le redémarrage, testez votre API :

```bash
# Test depuis votre serveur local
curl -H "Origin: https://app.wozif.store" \
     -H "Access-Control-Request-Method: GET" \
     -H "Access-Control-Request-Headers: Content-Type, Authorization" \
     -X OPTIONS \
     https://api.wozif.com/api/auth/check
```

Vous devriez voir les en-têtes CORS dans la réponse.

## 🧪 Tests de Vérification

### Test 1: Vérification CORS
Ouvrez la console de votre navigateur sur `https://app.wozif.store` et exécutez :

```javascript
// Test simple
fetch('https://api.wozif.com/api/health')
  .then(r => r.json())
  .then(console.log)
  .catch(console.error);

// Test avec authentification
fetch('https://api.wozif.com/api/auth/check', {
  method: 'GET',
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_TOKEN'
  }
})
.then(r => r.json())
.then(console.log)
.catch(console.error);
```

### Test 2: Vérification des En-têtes
```bash
# Test des en-têtes CORS
curl -I -H "Origin: https://app.wozif.store" \
     https://api.wozif.com/api/health
```

## 🔍 Dépannage

### Si CORS ne fonctionne toujours pas :

1. **Vérifiez les logs Nginx** :
   ```bash
   # Sur votre serveur Forge
   sudo tail -f /var/log/nginx/error.log
   ```

2. **Vérifiez les logs Laravel** :
   ```bash
   # Dans le dossier de votre projet
   tail -f storage/logs/laravel.log
   ```

3. **Vérifiez la configuration Nginx** :
   Assurez-vous qu'il n'y a pas de règles qui bloquent les en-têtes CORS.

4. **Testez en local** :
   ```bash
   # Testez d'abord en local
   php artisan serve
   curl -H "Origin: https://app.wozif.store" http://localhost:8000/api/health
   ```

### Problèmes Courants :

1. **Cache Laravel** : Videz le cache après déploiement
   ```bash
   php artisan config:clear
   php artisan cache:clear
   php artisan route:clear
   ```

2. **Cache Nginx** : Redémarrez Nginx après modifications
3. **Firewall** : Vérifiez que le port 443 est ouvert
4. **SSL** : Assurez-vous que votre certificat SSL est valide

## 📱 Test Final

Après le déploiement, testez votre application complète :

1. Ouvrez `https://app.wozif.store`
2. Essayez de vous connecter
3. Vérifiez que l'API répond sans erreur CORS
4. Vérifiez la console du navigateur pour les erreurs

## 🎯 Résultat Attendu

Après le déploiement, vous devriez voir dans la console du navigateur :
- ✅ Plus d'erreurs CORS
- ✅ L'API répond correctement
- ✅ L'authentification fonctionne
- ✅ Les requêtes cross-origin sont autorisées

## 📞 Support

Si le problème persiste après ces étapes :
1. Vérifiez les logs d'erreur
2. Testez avec l'outil de diagnostic CORS
3. Vérifiez la configuration de votre serveur Forge
4. Contactez le support Forge si nécessaire

---

**Note** : Ce guide suppose que votre serveur Forge est correctement configuré et que votre domaine `api.wozif.com` pointe vers le bon serveur.
