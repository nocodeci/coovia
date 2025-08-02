# 🛍️ Guide d'utilisation des applications boutique Coovia

## 📋 Vue d'ensemble

Ce projet contient maintenant **deux applications séparées** :

1. **Frontend principal** (`frontend/`) - Interface d'administration
2. **Boutique client** (`boutique-client/`) - Interface publique des boutiques

## 🚀 Démarrage rapide

### Option 1 : Script automatique
```bash
./start-boutique-apps.sh
```

### Option 2 : Démarrage manuel

#### 1. Serveur Laravel (API)
```bash
cd backend
php artisan serve
```
**URL :** http://localhost:8000

#### 2. Application boutique-client
```bash
cd boutique-client
npm start
```
**URL :** http://localhost:3000

#### 3. Frontend principal (optionnel)
```bash
cd frontend
npm run dev
```
**URL :** http://localhost:5173

## 🔗 Flux d'utilisation

### 1. Depuis le frontend principal
1. Allez sur http://localhost:5173
2. Connectez-vous à votre compte
3. Dans le dashboard, cliquez sur **"Voir la boutique"**
4. Cela ouvrira automatiquement http://localhost:3000/store-123

### 2. Accès direct à une boutique
- **URL :** http://localhost:3000/{slug-de-la-boutique}
- **Exemple :** http://localhost:3000/store-123

## 📊 Données de test

### Boutique de test
- **Slug :** `store-123`
- **Nom :** "Boutique Test Coovia"
- **URL :** http://localhost:3000/store-123

### Produits disponibles
- 📱 Smartphone Galaxy S23 (899.99€)
- 👕 T-shirt Premium (29.99€)
- 📚 Livre "Le Guide du Développeur" (49.99€)
- 🎧 Écouteurs Sans Fil (199.99€)
- 👖 Jeans Classique (79.99€)

## 🔧 Configuration

### API Laravel
- **Base URL :** http://localhost:8000
- **Endpoints boutique :**
  - `GET /api/boutique/{slug}` - Détails de la boutique
  - `GET /api/boutique/{slug}/products` - Produits de la boutique
  - `GET /api/boutique/{slug}/products/{id}` - Détail d'un produit

### CORS
Le serveur Laravel est configuré pour accepter les requêtes depuis :
- http://localhost:3000 (boutique-client)
- http://localhost:5173 (frontend principal)

## 🛠️ Développement

### Ajouter une nouvelle boutique
1. Créez une boutique via le frontend principal
2. Le slug sera automatiquement généré
3. Accédez via : http://localhost:3000/{votre-slug}

### Modifier les données de test
```bash
cd backend
php artisan db:seed --class=BoutiqueTestDataSeeder
```

## 🐛 Dépannage

### Erreur 500 sur l'API
- Vérifiez que le serveur Laravel est démarré
- Vérifiez que la base de données est configurée
- Vérifiez les logs : `tail -f backend/storage/logs/laravel.log`

### Erreur CORS
- Vérifiez que `backend/config/cors.php` autorise les origines
- Redémarrez le serveur Laravel

### Boutique-client ne charge pas
- Vérifiez que l'API Laravel répond
- Vérifiez les logs du navigateur (F12)
- Vérifiez que le slug de la boutique existe

## 📝 Prochaines étapes

- [ ] Page détail produit avec galerie
- [ ] Panier persistant
- [ ] Checkout en 3 étapes
- [ ] Système de filtres
- [ ] Design responsive mobile-first
- [ ] Authentification client
- [ ] Système de commandes
- [ ] Notifications en temps réel 