# Test de Protection d'Authentification

## ✅ **Routes Protégées**

### **Routes dans `_authenticated/` (Protégées)**
- ✅ `/create-store` → Redirige vers `/sign-in` si non connecté
- ✅ `/store-selection` → Redirige vers `/sign-in` si non connecté
- ✅ `/dashboard` → Redirige vers `/sign-in` si non connecté
- ✅ `/$storeId/dashboard` → Redirige vers `/sign-in` si non connecté

### **Routes Publiques**
- ✅ `/sign-in` → Accessible sans authentification
- ✅ `/sign-up` → Accessible sans authentification
- ✅ `/` → Page d'accueil publique

## 🔒 **Mécanismes de Protection**

### **1. Route Guard (`_authenticated/route.tsx`)**
```typescript
beforeLoad: ({ context }) => {
  const token = localStorage.getItem("sanctum_token")
  if (!token) {
    throw redirect({ to: "/sign-in" })
  }
}
```

### **2. AuthenticatedLayout (`_authenticated/index.tsx`)**
```typescript
if (!isAuthenticated || !user) {
  hasRedirected.current = true
  window.location.href = "/sign-in"
  return
}
```

### **3. AuthGuard Component**
```typescript
if (requireAuth && !isAuthenticated) {
  navigate({ to: redirectTo })
}
```

## 🧪 **Tests à Effectuer**

### **Test 1: Accès Direct aux Routes Protégées**
1. Ouvrir une fenêtre de navigation privée
2. Aller directement sur `http://localhost:5173/create-store`
3. **Résultat attendu** : Redirection vers `/sign-in`

### **Test 2: Accès Direct à Store Selection**
1. Ouvrir une fenêtre de navigation privée
2. Aller directement sur `http://localhost:5173/store-selection`
3. **Résultat attendu** : Redirection vers `/sign-in`

### **Test 3: Accès Direct au Dashboard**
1. Ouvrir une fenêtre de navigation privée
2. Aller directement sur `http://localhost:5173/dashboard`
3. **Résultat attendu** : Redirection vers `/sign-in`

### **Test 4: Connexion et Accès**
1. Se connecter via `/sign-in`
2. Accéder aux routes protégées
3. **Résultat attendu** : Accès autorisé

## 🎯 **Points de Vérification**

- ✅ **Token Check** : Vérification du token dans localStorage
- ✅ **User State** : Vérification de l'état utilisateur
- ✅ **Redirect Logic** : Redirection automatique vers sign-in
- ✅ **Loading States** : Affichage des loaders pendant vérification
- ✅ **Error Handling** : Gestion des erreurs d'authentification

## 📝 **Notes Importantes**

1. **Double Protection** : Routes protégées au niveau route ET composant
2. **Graceful Degradation** : Redirection propre sans erreurs
3. **User Experience** : Messages clairs et loaders appropriés
4. **Security** : Vérification côté client ET serveur
