# 🏪 Système de Liens vers les Boutiques

## 📋 Vue d'ensemble

Le système de liens vers les boutiques a été refactorisé pour supporter automatiquement les sous-domaines au format `{slug}.wozif.store` en production.

## 🌐 Formats d'URL

### Développement (localhost)
```
http://localhost:3000/{slug}
```
**Exemple :** `http://localhost:3000/ma-boutique`

### Production (sous-domaines)
```
https://{slug}.wozif.store
```
**Exemple :** `https://ma-boutique.wozif.store`

## 🔧 Configuration

### Fichiers de configuration

#### 1. `frontend/src/utils/environment.ts`
Gère les URLs de base selon l'environnement :
```typescript
export const BOUTIQUE_CLIENT_BASE_URL = isDevelopment 
  ? 'http://localhost:3000' 
  : 'https://wozif.store'

export function getBoutiqueUrl(slug: string): string {
  if (isDevelopment) {
    return `${BOUTIQUE_CLIENT_BASE_URL}/${slug}`
  }
  return `https://${slug}.wozif.store`
}
```

#### 2. `frontend/src/utils/store-links.ts`
Utilitaires pour gérer les liens vers les boutiques :
```typescript
export async function getStoreSlug(storeId: string): Promise<string | null>
export function generateBoutiqueUrl(storeSlug: string): string
export async function openBoutique(storeId: string): Promise<void>
```

#### 3. `frontend/src/components/ui/view-store-button.tsx`
Composant réutilisable pour le bouton "Voir la boutique" :
```typescript
<ViewStoreButton storeId={storeId} />
```

## 🚀 Utilisation

### 1. Dans le Dashboard
```typescript
import { ViewStoreButton } from "@/components/ui/view-store-button"

// Dans le composant
<ViewStoreButton storeId={storeId} />
```

### 2. Dans la gestion des boutiques
```typescript
import { openBoutique } from "@/utils/store-links"

const handleViewStorefront = async (store: Store) => {
  await openBoutique(store.id)
}
```

### 3. Génération d'URL manuelle
```typescript
import { generateBoutiqueUrl } from "@/utils/store-links"

const url = generateBoutiqueUrl('ma-boutique')
// En dev: http://localhost:3000/ma-boutique
// En prod: https://ma-boutique.wozif.store
```

## 🔄 Flux de fonctionnement

### 1. Récupération du slug
```typescript
const storeSlug = await getStoreSlug(storeId)
```

### 2. Génération de l'URL
```typescript
const url = generateBoutiqueUrl(storeSlug)
```

### 3. Ouverture de la boutique
```typescript
window.open(url, '_blank')
```

## 🧪 Test du système

### Composant de démonstration
```typescript
import { StoreLinkDemo } from "@/components/ui/store-link-demo"

<StoreLinkDemo storeId="123" storeSlug="ma-boutique" />
```

### Test manuel
1. Ouvrir la console du navigateur
2. Cliquer sur "Voir la boutique"
3. Vérifier les logs pour voir l'URL générée
4. Vérifier que la boutique s'ouvre correctement

## 📊 Avantages

### ✅ Automatique
- Détection automatique de l'environnement
- Génération d'URL appropriée selon le contexte

### ✅ Centralisé
- Logique centralisée dans les utilitaires
- Réutilisable dans tous les composants

### ✅ Maintenable
- Configuration centralisée
- Facile à modifier et étendre

### ✅ Compatible
- Fonctionne en développement et production
- Support des sous-domaines automatique

## 🔒 Sécurité

### Validation des slugs
- Vérification de l'existence du slug via l'API
- Fallback vers une URL par défaut en cas d'erreur

### Gestion des erreurs
- Try/catch sur toutes les opérations réseau
- Logs détaillés pour le débogage

## 📝 Exemples d'utilisation

### Bouton simple
```typescript
<ViewStoreButton storeId="store-123" />
```

### Bouton personnalisé
```typescript
<ViewStoreButton 
  storeId="store-123" 
  variant="default" 
  size="lg"
  className="w-full"
>
  Visiter ma boutique
</ViewStoreButton>
```

### Lien programmatique
```typescript
const handleClick = async () => {
  await openBoutique(storeId)
}
```

### URL directe
```typescript
const url = generateBoutiqueUrl('ma-boutique')
window.location.href = url
```

## 🚨 Dépannage

### Problème : URL incorrecte
1. Vérifier la variable d'environnement `NODE_ENV`
2. Vérifier la configuration dans `environment.ts`
3. Vérifier les logs de la console

### Problème : Boutique ne s'ouvre pas
1. Vérifier que le slug existe en base
2. Vérifier la réponse de l'API `/api/boutique/slug/{storeId}`
3. Vérifier que le domaine est configuré correctement

### Problème : Erreur de CORS
1. Vérifier la configuration CORS du backend
2. Vérifier que l'URL de l'API est correcte
3. Vérifier les headers de la requête

## 📞 Support

Pour toute question ou problème :
1. Vérifier les logs de la console
2. Tester avec le composant `StoreLinkDemo`
3. Vérifier la configuration d'environnement
4. Consulter la documentation de l'API backend
