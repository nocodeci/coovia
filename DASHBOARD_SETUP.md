# Dashboard Unique par Boutique - Configuration et Utilisation

## 🎯 Vue d'ensemble

Ce système permet d'avoir un dashboard unique pour chaque boutique avec les vraies informations de la boutique sélectionnée, connecté à votre backend Laravel.

## 🚀 Fonctionnalités

### ✅ Dashboard par Boutique
- **Sélecteur de boutique** : Changez facilement entre vos boutiques
- **Statistiques en temps réel** : Revenus, commandes, ventes, activité
- **Données spécifiques** : Chaque boutique affiche ses propres données
- **Navigation intelligente** : URLs spécifiques pour chaque boutique

### ✅ Intégration Backend
- **API Laravel** : Communication complète avec votre backend
- **Authentification** : Gestion des tokens et sessions
- **Données réelles** : Statistiques calculées depuis la base de données
- **Gestion d'erreurs** : Gestion robuste des erreurs API

## 📋 Configuration

### 1. Variables d'Environnement

Créez un fichier `.env` dans le dossier `frontend/` :

```env
# API Configuration
VITE_API_URL=http://localhost:8000/api

# Authentication
VITE_AUTH_TOKEN_KEY=auth_token

# App Configuration
VITE_APP_NAME=Coovia
VITE_APP_VERSION=1.0.0
```

### 2. Backend Laravel

Assurez-vous que votre backend Laravel est configuré avec :

- **Authentification Sanctum** activée
- **CORS** configuré pour le frontend
- **Base de données** avec les tables nécessaires

### 3. Routes API

Les routes suivantes doivent être disponibles dans votre backend :

```php
// Dashboard routes
GET /api/dashboard/stores/{store}/stats
GET /api/dashboard/stores/{store}/recent-orders
GET /api/dashboard/stores/{store}/sales-chart

// Store routes
GET /api/stores
GET /api/stores/{store}
POST /api/stores
PUT /api/stores/{store}
DELETE /api/stores/{store}
```

## 🔧 Utilisation

### Accès au Dashboard

1. **Dashboard principal** : `/` (sélection automatique de la première boutique active)
2. **Dashboard spécifique** : `/stores/{storeId}/dashboard`
3. **Gestion des boutiques** : `/stores`

### Navigation

- **Sélecteur de boutique** : En haut à droite du dashboard
- **Bouton "Gérer"** : Dans la liste des boutiques
- **Navigation directe** : URLs spécifiques pour chaque boutique

### Fonctionnalités

#### Vue d'ensemble
- Statistiques en temps réel
- Graphiques de performance
- Commandes récentes
- Indicateurs de croissance

#### Informations boutique
- Détails de la boutique
- Statistiques globales
- Informations de contact
- Paramètres de configuration

## 🗄️ Structure des Données

### Modèle Store (Backend)
```php
class Store extends Model
{
    protected $fillable = [
        'name', 'slug', 'description', 'logo', 'banner',
        'status', 'category', 'address', 'contact', 'settings', 'owner_id'
    ];
}
```

### Type Store (Frontend)
```typescript
interface Store {
  id: string;
  name: string;
  description: string;
  logo?: string;
  status: "active" | "pending" | "suspended" | "inactive";
  plan: "starter" | "professional" | "enterprise";
  settings: StoreSettings;
  stats: StoreStats;
  contact: StoreContact;
}
```

## 🔌 API Endpoints

### Dashboard Controller
```php
class DashboardController extends Controller
{
    public function storeStats(Request $request, Store $store)
    public function recentOrders(Request $request, Store $store)
    public function salesChart(Request $request, Store $store)
}
```

### Réponse API
```json
{
  "success": true,
  "message": "Statistiques récupérées avec succès",
  "data": {
    "store": { ... },
    "stats": {
      "revenue": { "current": 150000, "growth": 12.5 },
      "orders": { "current": 45, "growth": 8.2 },
      "sales": { "current": 38, "growth": 15.3 },
      "active": { "current": 5, "recent": 2 }
    },
    "overview": {
      "totalProducts": 156,
      "totalOrders": 1247,
      "totalRevenue": 2850000,
      "totalCustomers": 892,
      "conversionRate": 3.2,
      "averageOrderValue": 28500
    }
  }
}
```

## 🎨 Interface Utilisateur

### Composants Principaux
- `StoreSelector` : Sélecteur de boutique
- `StoreInfo` : Informations détaillées de la boutique
- `Dashboard` : Vue principale avec statistiques
- `StoreDashboard` : Wrapper pour les routes spécifiques

### États de Chargement
- Indicateurs de chargement pour les données
- Gestion des erreurs avec retry
- États vides pour les données manquantes

## 🔒 Sécurité

### Authentification
- Tokens JWT/Sanctum
- Vérification des permissions par boutique
- Protection des routes API

### Autorisation
- Vérification du propriétaire de la boutique
- Accès restreint aux données
- Validation des permissions

## 🚨 Gestion d'Erreurs

### Frontend
- Affichage des erreurs utilisateur
- Retry automatique pour les erreurs réseau
- Fallback vers les données mock si nécessaire

### Backend
- Logs détaillés des erreurs
- Réponses d'erreur standardisées
- Validation des données d'entrée

## 📊 Performance

### Optimisations
- Chargement asynchrone des données
- Mise en cache des statistiques
- Pagination pour les grandes listes
- Lazy loading des composants

### Monitoring
- Métriques de performance
- Temps de réponse API
- Utilisation des ressources

## 🔄 Maintenance

### Mises à jour
- Synchronisation des données
- Migration des schémas
- Mise à jour des dépendances

### Sauvegarde
- Sauvegarde des données
- Versioning des configurations
- Rollback en cas de problème

## 📞 Support

Pour toute question ou problème :
1. Vérifiez les logs d'erreur
2. Testez la connectivité API
3. Validez la configuration
4. Consultez la documentation

---

**Note** : Ce système est conçu pour être évolutif et peut être étendu avec de nouvelles fonctionnalités selon vos besoins.