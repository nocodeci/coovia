# 🔍 Guide de Debug - Problème de Redirection

## 🚨 **Problème Identifié**

**La redirection automatique vers la page de connexion ne fonctionne pas !**

## 🔍 **Diagnostic Appliqué**

### **1. Script de Debug Créé**
- ✅ **`debug-auth.ts`** - Utilitaires de debug de l'authentification
- ✅ **`AuthDebug.tsx`** - Composant de debug en temps réel
- ✅ **Vérification complète** de l'état d'authentification

### **2. Redirection Immédiate**
- ✅ **Suppression du timeout** de 2 secondes
- ✅ **Redirection immédiate** avec `forceRedirectToLogin()`
- ✅ **Debug automatique** avant redirection

### **3. Composant de Debug**
- ✅ **Interface visuelle** pour tester l'authentification
- ✅ **Boutons de test** pour chaque fonction
- ✅ **Affichage en temps réel** du statut

## 🚀 **Comment Tester**

### **Étape 1: Ajouter le Composant de Debug**
```tsx
// Dans votre page store-selection ou layout principal
import { AuthDebug } from '@/components/AuthDebug'

// Ajouter en bas de page
<AuthDebug />
```

### **Étape 2: Vérifier la Console**
1. **Ouvrir la console** du navigateur (F12)
2. **Recharger la page** store-selection
3. **Vérifier les logs** de debug

### **Étape 3: Utiliser les Boutons de Debug**
- **🔍 Debug** - Lance le debug complet
- **🧪 Test Auth** - Teste la fonction isAuthenticated
- **🔄 Rediriger** - Force la redirection
- **🧹 Nettoyer** - Vide tous les caches

## 📋 **Informations de Debug**

### **Ce qui est vérifié :**
1. **🔑 Token** dans localStorage
2. **👤 Utilisateur** en cache
3. **🏪 Boutiques** en cache
4. **🔐 Statut d'authentification**
5. **📦 Clés localStorage**

### **Logs attendus :**
```
🔍 === DEBUG AUTHENTIFICATION ===
🔑 Token: AUCUN
👤 Utilisateur en cache: NON
🏪 Boutiques en cache: AUCUNE
🔐 Est authentifié: false
📦 Taille localStorage: 0
🔑 Clés localStorage: []
🔍 === FIN DEBUG ===
```

## 🎯 **Résolution du Problème**

### **Si isAuthenticated retourne true :**
- ❌ **Problème** : La fonction détecte un token/user inexistant
- ✅ **Solution** : Vérifier la logique de `isAuthenticated()`

### **Si isAuthenticated retourne false :**
- ❌ **Problème** : La redirection ne se déclenche pas
- ✅ **Solution** : Vérifier que `forceRedirectToLogin()` est appelé

### **Si la redirection ne fonctionne pas :**
- ❌ **Problème** : `window.location.href` ne fonctionne pas
- ✅ **Solution** : Utiliser Next.js router ou vérifier les restrictions

## 🔧 **Tests à Effectuer**

### **Test 1: Vérification Console**
```javascript
// Dans la console du navigateur
console.log('Token:', localStorage.getItem('sanctum_token'))
console.log('User:', localStorage.getItem('user'))
```

### **Test 2: Test de Redirection**
```javascript
// Dans la console du navigateur
window.location.href = '/sign-in'
```

### **Test 3: Nettoyage Complet**
```javascript
// Dans la console du navigateur
localStorage.clear()
sessionStorage.clear()
window.location.reload()
```

## 📝 **Notes Importantes**

- Le composant `AuthDebug` s'affiche en bas à droite
- Il se met à jour automatiquement au montage
- Utilisez les boutons pour tester chaque fonction
- Vérifiez la console pour les logs détaillés

## 🎉 **Résultat Attendu**

**Après correction :**
- ✅ **Debug complet** dans la console
- ✅ **Redirection immédiate** vers `/sign-in`
- ✅ **Plus de blocage** sur store-selection
- ✅ **Navigation fluide** vers la connexion
