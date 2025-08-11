# 🔧 Guide de résolution des problèmes CORS

## 🚨 Problème identifié
Votre application frontend (port 3000) essaie de se connecter à `http://localhost:8000/api/auth/login` au lieu d'utiliser Auth0.

## ✅ Solutions appliquées

### 1. **Migration vers Auth0 complète**
- ✅ Suppression de l'ancien système d'authentification (`useAuth.tsx`)
- ✅ Mise à jour de tous les composants pour utiliser Auth0
- ✅ Configuration centralisée dans `src/config/app.ts`

### 2. **Configuration du backend**
- ✅ Script de démarrage sur le port 8001 : `backend/start-dev-server.sh`
- ✅ Configuration serveur personnalisée : `backend/server.php`
- ✅ Script artisan personnalisé : `backend/artisan-serve`

## 🚀 Démarrage du backend

### Option 1 : Script automatique
```bash
cd backend
./start-dev-server.sh
```

### Option 2 : Commande artisan
```bash
cd backend
php artisan serve --host=0.0.0.0 --port=8001
```

### Option 3 : Script personnalisé
```bash
cd backend
./artisan-serve
```

## 🔍 Vérification

### 1. **Backend démarré**
```bash
curl http://localhost:8001/api/health
# Devrait retourner une réponse (même une erreur 404 est OK)
```

### 2. **Frontend fonctionne**
```bash
# Dans le navigateur, vérifiez que :
# - http://localhost:3000 se charge
# - Le bouton "Se connecter avec Auth0" fonctionne
# - Pas d'erreurs CORS dans la console
```

## 🐛 Problèmes courants

### **Port 8001 déjà utilisé**
```bash
# Vérifier les processus sur le port 8001
lsof -i :8001

# Tuer le processus si nécessaire
kill -9 <PID>
```

### **Dépendances manquantes**
```bash
cd backend
composer install
php artisan key:generate
```

### **Base de données non accessible**
```bash
# Vérifier la configuration dans .env
# Le serveur peut démarrer sans base de données pour les tests
```

## 📱 Test de l'authentification

1. **Démarrer le frontend** : `npm run dev` (port 3000)
2. **Démarrer le backend** : `./start-dev-server.sh` (port 8001)
3. **Tester la connexion** : Cliquer sur "Se connecter avec Auth0"
4. **Vérifier la redirection** : Auth0 devrait rediriger vers votre application

## 🔗 URLs de test

- **Frontend** : http://localhost:3000
- **Backend** : http://localhost:8001
- **API** : http://localhost:8001/api
- **Auth0** : https://dev-elezzy7xq17fr6kp.us.auth0.com

## 📞 Support

Si les problèmes persistent :
1. Vérifiez les logs du backend dans le terminal
2. Vérifiez la console du navigateur pour les erreurs
3. Assurez-vous que les deux serveurs sont démarrés
4. Vérifiez que Auth0 est configuré avec les bonnes URLs de callback

---

**Note** : L'ancien système d'authentification a été complètement remplacé par Auth0. Tous les composants utilisent maintenant le contexte Auth0 unifié.
