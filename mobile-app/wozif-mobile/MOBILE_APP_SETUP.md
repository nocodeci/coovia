# 📱 Configuration de l'Application Mobile Wozif

## 🌐 Objectif

Créer une application mobile React Native avec Expo pour accéder aux fonctionnalités de Wozif depuis un smartphone.

## 🚀 Projet créé

### Structure du projet
```
mobile-app/wozif-mobile/
├── app/
├── components/
├── screens/
├── services/
│   └── api.ts (service API)
├── types/
├── assets/
├── App.tsx (écran principal)
├── app.json (configuration Expo)
├── package.json
└── MOBILE_APP_SETUP.md
```

### Technologies utilisées
- **Framework** : React Native avec Expo
- **Language** : TypeScript
- **Navigation** : Expo Router
- **UI** : React Native components
- **API** : Service personnalisé pour Wozif

## 📋 Fonctionnalités de l'application mobile

### Écran principal
1. **Header** : Logo Wozif et titre
2. **Hero Section** : Titre et description
3. **Action Buttons** : Liens vers les applications web
4. **Features Section** : 4 fonctionnalités principales
5. **Contact Section** : Support client
6. **Footer** : Copyright

### Liens vers les applications
- **Administration** : https://app.wozif.com
- **Créer une boutique** : https://my.wozif.com
- **Site web** : https://wozif.com

## 🧪 Tests

### Test local
```bash
# Développement local
npm start

# Test sur iOS
npm run ios

# Test sur Android
npm run android

# Test sur web
npm run web
```

### Test avec Expo Go
1. Installer Expo Go sur votre smartphone
2. Scanner le QR code affiché par `npm start`
3. L'application se charge automatiquement

## 🔧 Configuration requise

### Étape 1 : Configuration de l'API
Modifier l'URL de l'API dans `services/api.ts` :
```typescript
const API_BASE_URL = 'https://api.wozif.com'; // Votre vraie URL API
```

### Étape 2 : Configuration Expo
Modifier `app.json` pour personnaliser :
- Nom de l'application
- Identifiants de bundle
- Icônes et splash screen

### Étape 3 : Configuration EAS Build
```bash
# Installation d'EAS CLI
npm install -g @expo/eas-cli

# Connexion à Expo
eas login

# Configuration du projet
eas build:configure
```

## 📊 Structure des projets

### Applications Wozif
```
Projet 1: wozif-homepage (page d'accueil)
└── wozif.com (domaine principal)

Projet 2: coovia (frontend)
└── app.wozif.com (administration)

Projet 3: boutique-client (boutique publique)
└── my.wozif.com (boutique client)

Projet 4: wozif-mobile (application mobile)
└── App Store / Google Play
```

## 🎯 Avantages

### ✅ Application mobile native
- Interface optimisée pour mobile
- Performance native
- Accès hors ligne (avec cache)

### ✅ Multiplateforme
- iOS et Android
- Code partagé
- Maintenance simplifiée

### ✅ Intégration complète
- Liens vers les applications web
- Service API pour fonctionnalités avancées
- Cohérence avec la marque Wozif

### ✅ Expérience utilisateur
- Navigation intuitive
- Design moderne
- Performance optimisée

## 📱 Fonctionnalités avancées

### Service API
- Authentification
- Gestion des boutiques
- Gestion des produits
- Gestion des commandes
- Statistiques

### Navigation
- Écran principal
- Écrans de gestion (à développer)
- Profil utilisateur
- Paramètres

## 🚀 Déploiement

### Build pour production
```bash
# Build iOS
eas build --platform ios

# Build Android
eas build --platform android

# Build pour les deux plateformes
eas build --platform all
```

### Publication sur les stores
```bash
# Soumission iOS
eas submit --platform ios

# Soumission Android
eas submit --platform android
```

## 📞 Support

### Expo
- **Documentation** : https://docs.expo.dev
- **Dashboard** : https://expo.dev
- **Support** : https://expo.dev/support

### React Native
- **Documentation** : https://reactnative.dev
- **Community** : https://reactnative.dev/community

---

## 🎊 Configuration finale

Avec cette configuration, vous aurez :

```
wozif.com         → Page d'accueil (landing page)
app.wozif.com     → Frontend (administration)
my.wozif.com      → Boutique Client (public)
Mobile App        → Application mobile native
```

### 📋 Fichiers créés
- `MOBILE_APP_SETUP.md` - Ce guide
- `App.tsx` - Écran principal de l'application
- `services/api.ts` - Service API pour Wozif
- `app.json` - Configuration Expo

### 🚀 Commandes utiles
```bash
# Développement
npm start

# Build
npm run build

# Tests
npm run ios
npm run android
npm run web

# EAS Build
eas build --platform all
```

**Votre application mobile Wozif est prête !** 📱

### ⚠️ Actions requises

**Configuration finale :**
1. Configurer l'URL de l'API dans `services/api.ts`
2. Personnaliser les icônes et splash screen
3. Configurer EAS Build pour le déploiement
4. Tester sur appareils réels

Une fois cette configuration effectuée, votre application mobile sera prête pour la publication ! 🎉
