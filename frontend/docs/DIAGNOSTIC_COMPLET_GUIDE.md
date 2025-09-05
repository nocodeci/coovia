# 🔍 Guide de Diagnostic Complet - Problème d'Authentification

## 🚨 **Problème Identifié**

**Après connexion, le message "Vous devez vous connecter pour voir les boutiques" apparaît toujours !**

## 🔍 **Diagnostic Complet**

### **1. Vérification Backend**

#### **Test de la route `/api/user/stores` :**
```bash
# Sur le serveur Forge
cd /home/forge/api.wozif.com

# Tester avec un token valide
curl -H "Authorization: Bearer VOTRE_TOKEN" \
     -H "Accept: application/json" \
     "https://api.wozif.com/api/user/stores"
```

#### **Vérification des logs Laravel :**
```bash
# Voir les logs en temps réel
tail -f storage/logs/laravel.log

# Voir les erreurs d'authentification
grep -i "auth\|token\|user" storage/logs/laravel.log
```

#### **Vérification de la base de données :**
```bash
# Accéder à Tinker
php artisan tinker

# Vérifier les utilisateurs
>>> App\Models\User::count();
>>> App\Models\User::first();

# Vérifier les boutiques
>>> App\Models\Store::count();
>>> App\Models\Store::where('owner_id', '!=', null)->count();
```

### **2. Vérification Frontend**

#### **Ajouter le composant de debug :**
```tsx
// Dans votre page store-selection ou layout principal
import { RealTimeAuthDebug } from '@/components/RealTimeAuthDebug'

// Ajouter en bas de page
<RealTimeAuthDebug />
```

#### **Vérifier la console du navigateur :**
1. **Ouvrir F12** dans le navigateur
2. **Aller dans l'onglet Console**
3. **Recharger la page** store-selection
4. **Voir les logs** de debug

#### **Vérifier le localStorage :**
```javascript
// Dans la console du navigateur
console.log('sanctum_token:', localStorage.getItem('sanctum_token'))
console.log('auth-storage:', localStorage.getItem('auth-storage'))
console.log('auth-storage parsed:', JSON.parse(localStorage.getItem('auth-storage') || '{}'))
```

### **3. Points de Vérification Clés**

#### **A. Synchronisation Token :**
- ❌ **Problème potentiel :** Le service Sanctum et le store Zustand utilisent des clés différentes
- ✅ **Solution :** Vérifier que `sanctum_token` et `auth-storage` sont synchronisés

#### **B. État du Store Zustand :**
- ❌ **Problème potentiel :** Le store ne se met pas à jour après connexion
- ✅ **Solution :** Vérifier que `login()` est appelé avec les bonnes données

#### **C. Timing de l'Authentification :**
- ❌ **Problème potentiel :** La vérification se fait avant que le store soit mis à jour
- ✅ **Solution :** Ajouter un délai ou une vérification réactive

#### **D. Protection des Routes :**
- ❌ **Problème potentiel :** ProtectedRoute vérifie l'état avant qu'il soit correct
- ✅ **Solution :** Attendre que l'état soit stable avant vérification

## 🚀 **Solutions à Tester**

### **Solution 1: Vérification de Synchronisation**
```tsx
// Dans le composant de connexion, après login réussi
const handleLoginSuccess = (user: User, token: string) => {
  // Mettre à jour le store Zustand
  useAuthStore.getState().login(user, token)
  
  // Mettre à jour localStorage pour compatibilité
  localStorage.setItem('sanctum_token', token)
  
  // Rediriger
  navigate({ to: '/store-selector' })
}
```

### **Solution 2: Délai dans ProtectedRoute**
```tsx
// Dans ProtectedRoute, ajouter un délai
useEffect(() => {
  const timer = setTimeout(() => {
    // Vérification après délai
    if (!isAuthenticated || !user || !token) {
      navigate({ to: redirectTo })
    }
  }, 1000) // 1 seconde de délai
  
  return () => clearTimeout(timer)
}, [isAuthenticated, user, token, navigate, redirectTo])
```

### **Solution 3: Vérification Réactive**
```tsx
// Utiliser un état local pour éviter les re-renders
const [hasCheckedAuth, setHasCheckedAuth] = useState(false)

useEffect(() => {
  if (isAuthenticated && user && token && !hasCheckedAuth) {
    setHasCheckedAuth(true)
  }
}, [isAuthenticated, user, token, hasCheckedAuth])
```

## 📋 **Checklist de Diagnostic**

### **Backend :**
- [ ] Route `/api/user/stores` retourne 200 avec un token valide
- [ ] Logs Laravel ne montrent pas d'erreurs d'authentification
- [ ] Base de données contient des utilisateurs et boutiques

### **Frontend :**
- [ ] Composant `RealTimeAuthDebug` affiche l'état correct
- [ ] Console ne montre pas d'erreurs
- [ ] localStorage contient les bonnes données
- [ ] Store Zustand est à jour

### **Synchronisation :**
- [ ] Token Sanctum et Zustand sont identiques
- [ ] Login met à jour les deux systèmes
- [ ] ProtectedRoute reçoit les bonnes données

## 🎯 **Résultat Attendu**

**Après correction :**
- ✅ **Connexion réussie** met à jour le store Zustand
- ✅ **Token synchronisé** entre Sanctum et Zustand
- ✅ **ProtectedRoute** autorise l'accès
- ✅ **Store-selection** affiche les boutiques de l'utilisateur

## 📝 **Notes Importantes**

- Le composant `RealTimeAuthDebug` s'affiche en bas à gauche
- Il se met à jour automatiquement avec les changements du store
- Utilisez les boutons pour tester chaque fonction
- Vérifiez la console pour les logs détaillés

## 🔧 **Fichiers de Debug**

1. **`RealTimeAuthDebug.tsx`** - Debug en temps réel
2. **`test-auth-with-token.php`** - Test backend avec token
3. **`debug-auth.ts`** - Utilitaires de debug

## 🎉 **Prochaines Étapes**

1. **Déployer** le composant de debug
2. **Tester** la connexion et voir l'état en temps réel
3. **Identifier** le point de défaillance exact
4. **Appliquer** la solution appropriée
