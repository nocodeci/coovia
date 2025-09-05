# Guide de Test - Actions des Produits

## 🎯 Objectif
Tester toutes les actions disponibles sur les produits dans le dashboard frontend.

## 📋 Actions à Tester

### 1. **Modifier** 
- ✅ **Fonctionnalité** : Navigation vers la page d'édition
- 🔗 **Route** : `/{storeId}/produits/{productId}/edit`
- 📝 **Test** : Cliquer sur "Modifier" → Vérifier la navigation

### 2. **Dupliquer**
- ✅ **Fonctionnalité** : Créer une copie du produit
- 🔗 **API** : `POST /stores/{storeId}/products`
- 📝 **Test** : 
  1. Cliquer sur "Dupliquer"
  2. Vérifier que le produit est créé avec "(Copie)" dans le nom
  3. Vérifier que le statut est "draft"
  4. Vérifier le toast de succès

### 3. **Archiver**
- ✅ **Fonctionnalité** : Changer le statut vers "archived"
- 🔗 **API** : `PUT /public/products/{productId}`
- 📝 **Test** :
  1. Cliquer sur "Archiver"
  2. Vérifier que le statut change vers "archivé"
  3. Vérifier le toast de succès
  4. Vérifier que le produit apparaît dans l'onglet "Archives"

### 4. **Supprimer**
- ✅ **Fonctionnalité** : Supprimer définitivement le produit
- 🔗 **API** : `DELETE /public/products/{productId}`
- 📝 **Test** :
  1. Cliquer sur "Supprimer"
  2. Confirmer la suppression
  3. Vérifier que le produit disparaît de la liste
  4. Vérifier le toast de succès

### 5. **Changer le Statut**
- ✅ **Fonctionnalité** : Modifier le statut via le dropdown
- 🔗 **API** : `PUT /public/products/{productId}`
- 📝 **Test** :
  1. Ouvrir le dropdown "Statut"
  2. Sélectionner un nouveau statut
  3. Vérifier que le statut change
  4. Vérifier le toast de succès

## 🐛 Debug

### Logs Console
Tous les appels API sont loggés dans la console avec des emojis :
- 🔄 : Début de l'action
- 📡 : Appel API
- ✅ : Succès
- ❌ : Erreur
- 🚨 : Exception

### Erreurs Communes

1. **"Aucune boutique sélectionnée"**
   - Vérifier que `currentStore` est défini
   - Vérifier le contexte store

2. **Erreur API 404**
   - Vérifier que les routes backend sont correctes
   - Vérifier que le serveur backend fonctionne

3. **Erreur API 401/403**
   - Vérifier l'authentification
   - Vérifier les tokens

4. **Erreur de navigation**
   - Vérifier que les routes frontend existent
   - Vérifier la configuration du router

## 🔧 Configuration Backend

### Routes Vérifiées
```php
// Routes publiques pour les produits
Route::prefix('public')->group(function () {
    Route::get('/products/{product}', [ProductController::class, 'show']);
    Route::put('/products/{product}', [ProductController::class, 'updatePublic']);
    Route::delete('/products/{product}', [ProductController::class, 'destroyPublic']);
});

// Routes avec authentification
Route::get('stores/{store}/products', [ProductController::class, 'index']);
Route::post('stores/{store}/products', [ProductController::class, 'store']);
```

### Endpoints API
- `GET /api/stores/{storeId}/products` - Liste des produits
- `POST /api/stores/{storeId}/products` - Créer un produit
- `PUT /api/public/products/{productId}` - Modifier un produit
- `DELETE /api/public/products/{productId}` - Supprimer un produit

## 📊 Tests de Performance

### Cache
- ✅ Les produits sont mis en cache côté backend
- ✅ Invalidation automatique après modification
- ✅ Cache TTL de 10 minutes

### Optimisations
- ✅ Pagination des produits
- ✅ Sélection optimisée des champs
- ✅ Requêtes avec `select()` pour réduire la charge

## 🚀 Améliorations Futures

1. **Optimistic Updates** : Mettre à jour l'UI immédiatement sans recharger
2. **Undo Actions** : Possibilité d'annuler les actions
3. **Bulk Actions** : Actions sur plusieurs produits
4. **Keyboard Shortcuts** : Raccourcis clavier pour les actions
5. **Confirmation Avancée** : Modal de confirmation au lieu de `confirm()`

## 📝 Notes de Développement

- Les actions utilisent `window.location.reload()` pour simplifier
- Les erreurs sont affichées via `toast.error()`
- Les succès sont affichés via `toast.success()`
- Tous les appels API sont loggés pour le debug
- Le contexte store est utilisé pour l'ID de la boutique 