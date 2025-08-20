# Système Universel de Boutiques

## Vue d'ensemble

Le système est maintenant configuré pour que **toutes les boutiques créées** utilisent automatiquement la vraie page de boutique au lieu de la page d'accueil générale.

## Fonctionnement

### 1. Création de Sous-domaines

Quand une nouvelle boutique est créée avec le slug `ma-boutique`, elle sera automatiquement accessible via :
```
https://ma-boutique.wozif.store
```

### 2. Middleware de Routage

Le middleware dans `src/middleware.ts` :
- ✅ Détecte automatiquement tous les sous-domaines `*.wozif.store`
- ✅ Extrait le slug de la boutique du sous-domaine
- ✅ Redirige vers la route `/[storeId]` correspondante

```typescript
// Exemple : boutique.wozif.store → /boutique
// Exemple : ma-boutique.wozif.store → /ma-boutique
```

### 3. Page de Boutique Universelle

La page `src/app/[storeId]/page.tsx` :
- ✅ Utilise l'API pour récupérer les données de la boutique
- ✅ Affiche la vraie page de boutique avec tous les composants
- ✅ Gère les erreurs si la boutique n'existe pas

### 4. Composant BoutiquePage

Le composant `src/components/boutique-page.tsx` :
- ✅ Récupère les produits de la boutique via l'API
- ✅ Affiche la bannière, les produits, la recherche
- ✅ Gère toutes les fonctionnalités de la boutique

## API Endpoints Utilisés

### Boutique
```
GET /api/boutique/{slug}
```

### Produits
```
GET /api/boutique/{slug}/products
```

### Catégories
```
GET /api/boutique/{slug}/categories
```

### Produit Spécifique
```
GET /api/boutique/{slug}/products/{productId}
```

## Exemples d'Utilisation

### Boutique Existante
Si vous avez une boutique avec le slug `electronique` :
- **URL** : `https://electronique.wozif.store`
- **Route** : `/electronique`
- **API** : `/api/boutique/electronique`

### Nouvelle Boutique
Si vous créez une boutique avec le slug `vetements` :
- **URL** : `https://vetements.wozif.store`
- **Route** : `/vetements`
- **API** : `/api/boutique/vetements`

## Gestion des Erreurs

### Boutique Inexistante
Si une boutique n'existe pas dans l'API :
- ✅ Affiche une page d'erreur "Boutique non trouvée"
- ✅ Propose de retourner à l'accueil
- ✅ Log les erreurs pour le débogage

### Erreur API
Si l'API est indisponible :
- ✅ Affiche un message d'erreur approprié
- ✅ Permet de réessayer
- ✅ Gère les timeouts et erreurs réseau

## Configuration

### Variables d'Environnement
```env
NEXT_PUBLIC_API_URL=https://api.wozif.store
```

### Domaine Principal
```
wozif.store
```

### Sous-domaines
```
*.wozif.store
```

## Test et Validation

### Test d'une Boutique
1. Créer une boutique dans l'API avec un slug
2. Accéder à `https://{slug}.wozif.store`
3. Vérifier que la page de boutique s'affiche
4. Tester les fonctionnalités (recherche, produits, etc.)

### Test d'Erreur
1. Accéder à `https://boutique-inexistante.wozif.store`
2. Vérifier que la page d'erreur s'affiche
3. Vérifier que le bouton "Retour à l'accueil" fonctionne

## Avantages du Système

### ✅ Automatique
- Aucune configuration manuelle nécessaire
- Les sous-domaines se créent automatiquement

### ✅ Scalable
- Fonctionne pour un nombre illimité de boutiques
- Performance optimisée avec du cache

### ✅ Maintenable
- Code centralisé et réutilisable
- Gestion d'erreurs uniforme

### ✅ Flexible
- Chaque boutique peut avoir ses propres produits
- Interface personnalisable par boutique

## Prochaines Étapes

1. **Connecter à l'API de Production**
   - Configurer l'URL de l'API pour la production
   - Tester avec de vraies boutiques

2. **Optimiser les Performances**
   - Ajouter du cache pour les boutiques populaires
   - Optimiser les images et les assets

3. **Ajouter des Fonctionnalités**
   - Système de favoris
   - Historique des achats
   - Notifications

4. **Améliorer le SEO**
   - Meta tags dynamiques par boutique
   - Sitemap automatique
   - Optimisation pour les moteurs de recherche
