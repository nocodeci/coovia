# 🏪 Système de Sélection de Boutique

## Vue d'ensemble

Ce système permet aux utilisateurs de sélectionner une boutique après la connexion et d'accéder à un dashboard spécifique à cette boutique.

## 🔄 Flux d'Utilisateur

### 1. Connexion
- L'utilisateur se connecte via `/sign-in`
- Après connexion réussie, il est redirigé vers `/store-selection`

### 2. Sélection de Boutique
- Page `/store-selection` affiche toutes les boutiques de l'utilisateur
- Chaque carte de boutique montre :
  - Nom et description
  - Statut (Actif/Inactif)
  - Statistiques (produits, clients, commandes, taux de conversion)
  - Adresse

### 3. Dashboard Spécifique
- Après sélection, redirection vers `/dashboard/{storeId}`
- Dashboard affiche les données spécifiques à la boutique sélectionnée

## 🏗️ Architecture

### Composants Principaux

#### `StoreSelection` (`/features/auth/store-selection.tsx`)
- Page de sélection de boutique après connexion
- Affiche la grille des boutiques disponibles
- Gère la sélection et la redirection

#### `StoreSwitcher` (`/components/layout/store-switcher.tsx`)
- Menu déroulant dans le header
- Permet de changer de boutique rapidement
- Affiche la boutique actuelle

#### `StoreGuard` (`/components/layout/store-guard.tsx`)
- Protection des routes nécessitant une boutique sélectionnée
- Redirige automatiquement vers la sélection si nécessaire

#### `Dashboard` (`/features/dashboard/index.tsx`)
- Dashboard dynamique basé sur l'ID de la boutique dans l'URL
- Charge automatiquement les données spécifiques à la boutique

### Routes

```typescript
// Routes principales
/store-selection          // Sélection de boutique
/dashboard/{storeId}      // Dashboard spécifique à une boutique
/stores                   // Gestion des boutiques
```

### Context et État

#### `StoreContext` (`/context/store-context.tsx`)
- Gère l'état global des boutiques
- `currentStore`: Boutique actuellement sélectionnée
- `stores`: Liste de toutes les boutiques de l'utilisateur
- `loadStoreStats()`: Charge les statistiques d'une boutique

#### `AuthContext` (`/hooks/useAuth.tsx`)
- Gère l'authentification
- Redirige vers `/store-selection` après connexion

## 🔧 Fonctionnalités

### Sélection de Boutique
- ✅ Interface intuitive avec cartes de boutique
- ✅ Statistiques en temps réel
- ✅ Gestion des états de chargement
- ✅ Redirection automatique

### Navigation
- ✅ Menu de changement de boutique dans le header
- ✅ Protection des routes
- ✅ Redirection automatique si aucune boutique sélectionnée

### Dashboard Dynamique
- ✅ URL avec ID de boutique (`/dashboard/{storeId}`)
- ✅ Chargement automatique des données
- ✅ Statistiques spécifiques à la boutique
- ✅ Commandes récentes
- ✅ Vue d'ensemble complète

## 🎨 Interface Utilisateur

### Page de Sélection
- Design moderne avec gradient de fond
- Cartes interactives avec hover effects
- Statistiques visuelles avec icônes
- Bouton de création de nouvelle boutique

### Header avec StoreSwitcher
- Menu déroulant élégant
- Indication de la boutique actuelle
- Accès rapide à toutes les boutiques
- Option de création

### Dashboard
- Statistiques en temps réel
- Graphiques et métriques
- Commandes récentes
- Vue d'ensemble complète

## 🔒 Sécurité et Protection

### StoreGuard
- Vérifie qu'une boutique est sélectionnée
- Redirige automatiquement si nécessaire
- Protection contre l'accès direct aux dashboards

### Authentification
- Vérification du token à chaque requête
- Gestion des erreurs d'authentification
- Redirection vers la connexion si nécessaire

## 🚀 Utilisation

### Pour l'Utilisateur
1. Se connecter sur `/sign-in`
2. Sélectionner une boutique sur `/store-selection`
3. Accéder au dashboard spécifique
4. Changer de boutique via le menu du header

### Pour le Développeur
```typescript
// Utiliser le contexte de boutique
const { currentStore, stores, setCurrentStore } = useStore()

// Charger les statistiques d'une boutique
const { loadStoreStats } = useStore()
const stats = await loadStoreStats(storeId)

// Naviguer vers un dashboard
navigate({ to: `/dashboard/${storeId}` })
```

## 📊 Données et API

### Endpoints Utilisés
- `GET /api/stores` - Liste des boutiques
- `GET /api/dashboard/stores/{storeId}/stats` - Statistiques
- `GET /api/dashboard/stores/{storeId}/recent-orders` - Commandes récentes
- `GET /api/dashboard/stores/{storeId}/sales-chart` - Graphique des ventes

### Structure des Données
```typescript
interface Store {
  id: string
  name: string
  description?: string
  status: 'active' | 'inactive'
  address?: string
  totalProducts: number
  totalCustomers: number
  totalOrders: number
  conversionRate: number
}
```

## 🔄 État et Persistance

### Local Storage
- Token d'authentification
- État de la sidebar

### Context State
- Boutique actuellement sélectionnée
- Liste des boutiques
- Données du dashboard

## 🎯 Prochaines Étapes

- [ ] Ajouter des graphiques interactifs
- [ ] Implémenter des notifications en temps réel
- [ ] Ajouter des filtres de date pour les statistiques
- [ ] Créer des rapports exportables
- [ ] Ajouter des alertes et notifications 