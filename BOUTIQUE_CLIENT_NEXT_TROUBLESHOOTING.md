# 🔧 Guide de Dépannage - Boutique Client Next.js

## 🚨 Erreurs Courantes et Solutions

### **1. Erreur "Invalid hook call"**

**Symptôme :**
```
Invalid hook call. Hooks can only be called inside of the body of a function component.
```

**Cause :** Utilisation de hooks dans un composant async ou en dehors d'un contexte React.

**Solution :**
```tsx
// ❌ Incorrect
export default async function StorePage({ params }: StorePageProps) {
  const { storeId } = await params;
  const { data } = useQuery(...); // Erreur !
}

// ✅ Correct
export default function StorePage({ params }: StorePageProps) {
  const { storeId } = params;
  const { data } = useQuery(...); // OK !
}
```

### **2. Erreur "Cannot read properties of null (reading 'useContext')"**

**Symptôme :**
```
TypeError: Cannot read properties of null (reading 'useContext')
```

**Cause :** TanStack Query n'est pas correctement initialisé ou React n'est pas encore hydraté.

**Solution :**
1. Vérifier que `QueryProvider` est bien configuré dans `layout.tsx`
2. Utiliser le composant `HydrationSafe` pour éviter les erreurs d'hydratation
3. Ajouter des options de retry et staleTime à useQuery

### **3. Erreur "params is now a Promise" (Next.js 15)**

**Symptôme :**
```
A param property was accessed directly with `params.storeId`. `params` is now a Promise and should be unwrapped with `React.use()` before accessing properties of the underlying params object.
```

**Cause :** Dans Next.js 15, les `params` sont maintenant des Promises.

**Solution :**
```tsx
// ❌ Incorrect (Next.js 15)
export default function StorePage({ params }: StorePageProps) {
  const { storeId } = params; // Erreur !
}

// ✅ Correct (Next.js 15)
import { use } from 'react';

interface StorePageProps {
  params: Promise<{
    storeId: string;
  }>;
}

export default function StorePage({ params }: StorePageProps) {
  const { storeId } = use(params); // OK !
}
```

### **4. Erreur "API not found"**

**Symptôme :**
```
GET /nocoddci 500 in 417ms
```

**Cause :** L'API n'est pas accessible ou l'endpoint n'existe pas.

**Solution :**
1. Vérifier que le backend Laravel est démarré sur `localhost:8000`
2. Vérifier la configuration API dans `.env.local`
3. Tester l'endpoint manuellement :

```bash
curl -X GET "http://localhost:8000/api/stores/boutique-test"
```

### **5. Erreur CORS**

**Symptôme :**
```
Access to XMLHttpRequest at 'https://api.wozif.store/api/stores/nocoddci' from origin 'http://localhost:3000' has been blocked by CORS policy
```

**Cause :** L'API utilise l'URL de production au lieu de l'URL locale.

**Solution :**
1. Créer le fichier `.env.local` :
```bash
cp env.development .env.local
```

2. Vérifier le contenu :
```bash
cat .env.local
# Doit contenir: NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

3. Redémarrer le serveur Next.js :
```bash
npm run dev
```

### **6. Erreur de Configuration d'Environnement**

**Symptôme :**
```
NEXT_PUBLIC_API_URL is undefined
```

**Cause :** Variables d'environnement non configurées.

**Solution :**
```bash
# Copier la configuration
cp env.development .env.local

# Vérifier le contenu
cat .env.local
```

## 🛠️ Scripts de Diagnostic

### **1. Test de l'API Backend :**
```bash
# Test de l'endpoint boutique
curl -X GET "http://localhost:8000/api/stores/boutique-test"

# Test de l'endpoint slug
curl -X GET "http://localhost:8000/api/boutique/slug/550e8400-e29b-41d4-a716-446655440001"
```

### **2. Test du Frontend Next.js :**
```bash
# Démarrer le serveur
./start-boutique-next.sh

# Tester l'URL
curl -X GET "http://localhost:3000/boutique-test"
```

### **3. Vérification des Dépendances :**
```bash
cd boutique-client-next
npm list @tanstack/react-query
npm list react
npm list next
```

## 🔧 Configuration Recommandée

### **1. Fichier .env.local :**
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_IMAGE_DOMAIN=localhost
NODE_ENV=development
```

### **2. QueryProvider :**
```tsx
export function QueryProvider({ children }: QueryProviderProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 1,
            refetchOnWindowFocus: false,
            staleTime: 5 * 60 * 1000, // 5 minutes
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
```

### **3. Composant Page :**
```tsx
export default function StorePage({ params }: StorePageProps) {
  const { storeId } = params;

  const { data: store, isLoading, error } = useQuery({
    queryKey: ['store', storeId],
    queryFn: () => storeService.getStoreBySlug(storeId),
    retry: 1,
    staleTime: 5 * 60 * 1000,
  });

  return (
    <HydrationSafe>
      {/* Contenu du composant */}
    </HydrationSafe>
  );
}
```

## 📋 Checklist de Diagnostic

### **Backend :**
- [ ] **Serveur Laravel** démarré sur `localhost:8000`
- [ ] **API endpoint** `/api/stores/{slug}` fonctionne
- [ ] **Base de données** accessible
- [ ] **CORS** configuré pour `localhost:3000`

### **Frontend :**
- [ ] **Variables d'environnement** configurées
- [ ] **QueryProvider** dans layout.tsx
- [ ] **HydrationSafe** utilisé pour les composants
- [ ] **Composants** non-async avec hooks

### **Réseau :**
- [ ] **Port 8000** libre pour le backend
- [ ] **Port 3000** libre pour le frontend
- [ ] **Firewall** autorise les connexions locales

## 🎯 Solutions Rapides

### **Redémarrer Tout :**
```bash
# 1. Arrêter tous les serveurs
# 2. Redémarrer le backend
cd backend && php artisan serve --host=0.0.0.0 --port=8000

# 3. Redémarrer le frontend
./start-boutique-next.sh
```

### **Nettoyer le Cache :**
```bash
cd boutique-client-next
rm -rf .next
rm -rf node_modules/.cache
npm run dev
```

### **Vérifier les Logs :**
```bash
# Backend
tail -f backend/storage/logs/laravel.log

# Frontend
# Vérifier la console du navigateur
```

## 🎉 Résolution des Problèmes

**Après avoir appliqué ces corrections :**
1. ✅ **Hooks React** fonctionnent correctement
2. ✅ **API calls** réussissent
3. ✅ **Hydratation** sans erreurs
4. ✅ **Bouton "Voir la boutique"** redirige correctement

**Le projet boutique-client-next devrait maintenant fonctionner parfaitement !** 🚀
