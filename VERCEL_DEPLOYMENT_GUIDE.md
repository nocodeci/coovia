# Guide de Déploiement Vercel - Projets Frontend et Boutique

## 📋 Vue d'ensemble

Ce guide explique comment déployer séparément les deux projets React sur Vercel :

1. **Frontend** : Dashboard d'administration (Vite + React)
2. **Boutique-client** : Interface de checkout (Create React App)

## 🚀 Déploiement Rapide

### Option 1 : Script automatisé

```bash
# Installer Vercel CLI
npm i -g vercel

# Déployer les deux projets
./deploy-vercel.sh both

# Ou déployer individuellement
./deploy-vercel.sh frontend
./deploy-vercel.sh boutique
```

### Option 2 : Déploiement manuel

#### Étape 1 : Préparer les projets

```bash
# Frontend (Dashboard)
cd frontend
npm install
npm run build

# Boutique-client
cd ../boutique-client
npm install
npm run build
```

#### Étape 2 : Déployer sur Vercel

1. Allez sur [vercel.com](https://vercel.com)
2. Connectez-vous avec GitHub
3. Cliquez sur "New Project"
4. Importez votre repository
5. Configurez chaque projet séparément

## 📁 Structure des projets

```
coovia/
├── frontend/                 # Dashboard d'administration
│   ├── src/
│   ├── package.json
│   ├── vercel.json          # Configuration Vercel
│   └── README-VERCEL.md     # Guide spécifique
├── boutique-client/          # Interface de checkout
│   ├── src/
│   ├── package.json
│   ├── vercel.json          # Configuration Vercel
│   └── README-VERCEL.md     # Guide spécifique
├── backend/                  # API Laravel (déployé séparément)
├── deploy-vercel.sh         # Script de déploiement
└── VERCEL_DEPLOYMENT_GUIDE.md
```

## ⚙️ Configuration Vercel

### Frontend (Dashboard)

- **Framework** : Vite
- **Build Command** : `npm run build`
- **Output Directory** : `dist`
- **Node Version** : 18.x

### Boutique-client

- **Framework** : Create React App
- **Build Command** : `npm run build`
- **Output Directory** : `build`
- **Node Version** : 18.x

## 🔧 Variables d'environnement

### Frontend (Dashboard)

```env
VITE_API_URL=https://votre-backend.vercel.app
VITE_CLERK_PUBLISHABLE_KEY=votre_clé_clerk
```

### Boutique-client

```env
REACT_APP_API_URL=https://votre-backend.vercel.app
REACT_APP_PAYMENT_API_URL=https://votre-backend.vercel.app/api
```

## 🌐 Domaines et URLs

### URLs de déploiement

- **Frontend** : `https://votre-projet-frontend.vercel.app`
- **Boutique** : `https://votre-projet-boutique.vercel.app`

### Domaines personnalisés

1. Allez dans Vercel Dashboard > Domains
2. Ajoutez vos domaines personnalisés
3. Configurez les DNS selon les instructions

## 📱 Fonctionnalités déployées

### Frontend (Dashboard)
- ✅ Interface d'administration
- ✅ Gestion des produits
- ✅ Tableaux de bord
- ✅ Authentification
- ✅ Design responsive

### Boutique-client
- ✅ Système de checkout
- ✅ Intégration des méthodes de paiement
- ✅ Validation des numéros de téléphone
- ✅ Support multi-pays
- ✅ Interface responsive

## 🔄 Déploiement continu

### GitHub Integration

1. Connectez votre repository GitHub à Vercel
2. Chaque push sur `main` déclenche un déploiement automatique
3. Les branches créent des previews automatiques

### Branches de développement

- `main` → Production
- `develop` → Staging
- `feature/*` → Preview automatique

## 🛠️ Commandes utiles

```bash
# Vérifier le statut des déploiements
vercel ls

# Voir les logs d'un déploiement
vercel logs [deployment-url]

# Redéployer un projet
vercel --prod

# Configurer les variables d'environnement
vercel env add
```

## 🚨 Dépannage

### Erreurs courantes

1. **Build échoue**
   - Vérifiez les dépendances : `npm install`
   - Vérifiez les variables d'environnement
   - Consultez les logs de build

2. **Routes ne fonctionnent pas**
   - Vérifiez la configuration `vercel.json`
   - Assurez-vous que les rewrites sont corrects

3. **API ne répond pas**
   - Vérifiez l'URL de l'API dans les variables d'environnement
   - Assurez-vous que le backend est déployé

### Logs et debugging

```bash
# Voir les logs en temps réel
vercel logs --follow

# Debug local
vercel dev
```

## 📞 Support

- **Documentation Vercel** : [vercel.com/docs](https://vercel.com/docs)
- **Support Vercel** : [vercel.com/support](https://vercel.com/support)
- **GitHub Issues** : Créez une issue dans votre repository

## 🎯 Prochaines étapes

1. ✅ Configurer les domaines personnalisés
2. ✅ Mettre en place les variables d'environnement
3. ✅ Tester les déploiements
4. ✅ Configurer les webhooks pour les mises à jour automatiques
5. ✅ Mettre en place le monitoring et les alertes

---

**Note** : Ce guide suppose que votre backend Laravel est déjà déployé. Si ce n'est pas le cas, déployez d'abord le backend avant de configurer les variables d'environnement des frontends.
