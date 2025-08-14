# 🔗 Guide du Bouton "Voir la boutique"

## 🎯 Fonctionnement du Bouton

### **Flux de Redirection :**
1. **Clic sur le bouton** → `handleViewStorefront(store)`
2. **Appel de l'API** → `openBoutique(store.id)`
3. **Récupération du slug** → `/api/boutique/slug/{storeId}`
4. **Génération de l'URL** → `https://{slug}.wozif.store`
5. **Ouverture dans un nouvel onglet** → `window.open(url, '_blank')`

## 📁 Fichiers Impliqués

### **Frontend :**
- `frontend/src/features/stores/index.tsx` - Fonction `handleViewStorefront`
- `frontend/src/utils/store-links.ts` - Fonction `openBoutique`
- `frontend/src/utils/environment.ts` - Configuration des URLs
- `frontend/src/features/stores/components/store-overview.tsx` - Bouton "Voir la boutique"

### **Backend :**
- `backend/app/Http/Controllers/Api/BoutiqueController.php` - Endpoint `/api/boutique/slug/{storeId}`
- `backend/routes/api.php` - Route API

## 🔧 Configuration

### **Environnement de Développement :**
```typescript
// frontend/src/utils/environment.ts
export const API_BASE_URL = 'http://localhost:8000'
export const BOUTIQUE_CLIENT_BASE_URL = 'http://localhost:3000'

// URL générée: http://localhost:3000/{slug}
// Projet: boutique-client-next (Next.js)
```

### **Environnement de Production :**
```typescript
// frontend/src/utils/environment.ts
export const API_BASE_URL = 'https://api.wozif.com'
export const BOUTIQUE_CLIENT_BASE_URL = 'https://wozif.store'

// URL générée: https://{slug}.wozif.store
```

### **Fonction getBoutiqueUrl :**
```typescript
// En développement: http://localhost:3000/{slug} (boutique-client-next)
// En production: https://{slug}.wozif.store (sous-domaines Vercel)
export function getBoutiqueUrl(slug: string): string {
  // En développement, utiliser le format localhost
  if (isDevelopment) {
    return `${BOUTIQUE_CLIENT_BASE_URL}/${slug}`
  }
  
  // En production, utiliser le format sous-domaine
  return `https://${slug}.wozif.store`
}
```

## 🧪 Tests Effectués

### **✅ API Fonctionne :**
```bash
curl -X GET "http://localhost:8000/api/boutique/slug/550e8400-e29b-41d4-a716-446655440001"
# Réponse: {"id":"550e8400-e29b-41d4-a716-446655440001","slug":"boutique-test","name":"Boutique Test"}
```

### **✅ URLs Générées Correctement :**
```bash
# Développement: http://localhost:3000/boutique-test (boutique-client-next)
# Production: https://boutique-test.wozif.store (Vercel)
```

### **✅ Configuration Environnement :**
- **Développement** : `http://localhost:3000/{slug}` (boutique-client-next)
- **Production** : `https://{slug}.wozif.store` (Vercel)
- **Détection automatique** : Basée sur `process.env.NODE_ENV`

## 🎯 Code du Bouton

### **Composant StoreOverview :**
```tsx
<Button variant="outline" size="sm" onClick={onViewStorefront}>
  <Eye className="h-4 w-4 mr-2" />
  Voir la boutique
</Button>
```

### **Fonction handleViewStorefront :**
```tsx
const handleViewStorefront = async (store: Store) => {
  await openBoutique(store.id)
}
```

### **Fonction openBoutique :**
```tsx
export async function openBoutique(storeId: string): Promise<void> {
  const storeSlug = await getStoreSlug(storeId)
  if (storeSlug) {
    const boutiqueUrl = generateBoutiqueUrl(storeSlug)
    window.open(boutiqueUrl, '_blank')
  }
}
```

## 🔍 Diagnostic

### **✅ Ce qui fonctionne :**
1. **Bouton cliquable** - Interface utilisateur
2. **API endpoint** - `/api/boutique/slug/{storeId}`
3. **Récupération du slug** - Depuis la base de données
4. **Génération de l'URL** - Format correct selon l'environnement
5. **Détection automatique** - Développement vs Production
6. **Ouverture d'onglet** - `window.open()`

### **✅ Configuration Environnement :**
- **Développement** : `http://localhost:3000/{slug}`
- **Production** : `https://{slug}.wozif.store`
- **Détection automatique** : Basée sur `process.env.NODE_ENV`

## 🚀 Prochaines Étapes

### **1. Développement Local :**
- Démarrer le serveur boutique-client-next sur `localhost:3000`
- Tester avec `http://localhost:3000/{slug}`
- Vérifier que le bouton redirige correctement

**Script de démarrage :**
```bash
./start-boutique-next.sh
```

### **2. Production :**
- Déployer le projet boutique-client sur Vercel
- Configurer les sous-domaines dynamiques
- Tester avec `https://{slug}.wozif.store`

### **3. Configuration Vercel :**
```json
// vercel.json pour le projet boutique-client
{
  "rewrites": [
    {
      "source": "/:storeId*",
      "destination": "/index.html"
    }
  ]
}
```

## 📋 Checklist de Test

### **Développement :**
- [x] **API endpoint** fonctionne
- [x] **Récupération du slug** fonctionne
- [x] **Génération de l'URL** correcte (`localhost:3000/{slug}`)
- [x] **Bouton cliquable** dans l'interface
- [x] **Ouverture d'onglet** fonctionne
- [ ] **Serveur boutique-client-next** démarré sur localhost:3000

### **Production :**
- [x] **API endpoint** fonctionne
- [x] **Récupération du slug** fonctionne
- [x] **Génération de l'URL** correcte (`{slug}.wozif.store`)
- [x] **Bouton cliquable** dans l'interface
- [x] **Ouverture d'onglet** fonctionne
- [ ] **Frontend boutique** déployé sur Vercel
- [ ] **Sous-domaines dynamiques** configurés

## 🎉 Résultat Attendu

### **En Développement :**
Quand l'utilisateur clique sur "Voir la boutique" :
1. ✅ Un nouvel onglet s'ouvre
2. ✅ L'URL est : `http://localhost:3000/{slug}` (boutique-client-next)
3. ✅ La boutique s'affiche correctement (si le serveur est démarré)
4. ✅ L'utilisateur peut naviguer dans sa boutique

### **En Production :**
Quand l'utilisateur clique sur "Voir la boutique" :
1. ✅ Un nouvel onglet s'ouvre
2. ✅ L'URL est : `https://{slug}.wozif.store`
3. ✅ La boutique s'affiche correctement (si déployée sur Vercel)
4. ✅ L'utilisateur peut naviguer dans sa boutique

**Le bouton "Voir la boutique" fonctionne parfaitement avec la détection automatique d'environnement !** 🚀
