# 🛍️ Boutique Client Next - Plateforme Multi-Boutiques

Plateforme e-commerce moderne construite avec Next.js 15, configurée pour fonctionner avec le système de sous-domaines `{slug}.wozif.store`.

## 🚀 Fonctionnalités

- ✅ **Sous-domaines dynamiques** : `{store-slug}.wozif.store`
- ✅ **Interface moderne** : Design responsive avec Tailwind CSS
- ✅ **Paiements intégrés** : MTN CI, Orange Money, Wave CI
- ✅ **Performance optimisée** : Next.js 15 avec optimisations
- ✅ **Déploiement Vercel** : Configuration automatique

## 🏗️ Architecture

```
{store-slug}.wozif.store
├── /                    # Page d'accueil de la boutique
├── /product/[id]        # Page produit
└── /checkout           # Page de paiement
```

## 🛠️ Installation

```bash
# Cloner le projet
git clone <repository-url>
cd boutique-client-next

# Installer les dépendances
npm install

# Variables d'environnement
cp .env.example .env.local
# Éditer .env.local avec vos configurations

# Démarrer en développement
npm run dev
```

## 🌐 Configuration des Sous-domaines

Le projet est configuré pour fonctionner automatiquement avec les sous-domaines :

- **test-store.wozif.store** → Boutique de test
- **demo.wozif.store** → Boutique de démonstration
- **votre-boutique.wozif.store** → Votre boutique personnalisée

## 🚀 Déploiement sur Vercel

1. **Connectez-vous à Vercel** et importez ce projet
2. **Configurez le domaine** `wozif.store` avec les sous-domaines wildcard
3. **Déployez** : `npm run deploy`

Voir [DEPLOYMENT.md](./DEPLOYMENT.md) pour les détails complets.

## 📁 Structure du Projet

```
src/
├── app/
│   ├── page.tsx                    # Page d'accueil (redirection)
│   ├── [storeId]/
│   │   ├── page.tsx               # Page de la boutique
│   │   ├── product/[id]/          # Pages produits
│   │   └── checkout/              # Pages de paiement
│   └── layout.tsx
├── components/                     # Composants réutilisables
├── services/                      # Services API
├── hooks/                         # Hooks personnalisés
└── middleware.ts                  # Gestion des sous-domaines
```

## 🔧 Configuration

### Variables d'Environnement

```env
NEXT_PUBLIC_API_URL=https://api.wozif.store
NODE_ENV=production
```

### API Backend

Le projet se connecte à l'API backend via `https://api.wozif.store` pour :
- Récupérer les données des boutiques
- Gérer les paiements
- Traiter les commandes

## 🎨 Design System

- **Framework CSS** : Tailwind CSS 4
- **Composants** : shadcn/ui
- **Icônes** : Lucide React
- **Animations** : CSS transitions et animations

## 📱 Responsive Design

- ✅ **Mobile First** : Optimisé pour mobile
- ✅ **Tablette** : Interface adaptée
- ✅ **Desktop** : Expérience complète
- ✅ **Accessibilité** : Standards WCAG

## 🔒 Sécurité

- ✅ **HTTPS** : Forcé sur tous les domaines
- ✅ **CORS** : Configuré pour les sous-domaines
- ✅ **Validation** : Données validées côté client et serveur
- ✅ **Paiements sécurisés** : Intégration PayDunya/Pawapay

## 📊 Performance

- ✅ **Next.js 15** : Optimisations automatiques
- ✅ **Image Optimization** : Next.js Image component
- ✅ **Code Splitting** : Chargement à la demande
- ✅ **Caching** : Stratégies de cache optimisées

## 🧪 Tests

```bash
# Tests de développement
npm run dev

# Build de production
npm run build

# Linting
npm run lint
```

## 📈 Monitoring

- **Vercel Analytics** : Métriques automatiques
- **Performance** : Monitoring des sous-domaines
- **Erreurs** : Tracking automatique
- **Logs** : Accessibles via dashboard Vercel

## 🤝 Contribution

1. Fork le projet
2. Créez une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 🆘 Support

- **Documentation** : [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Issues** : GitHub Issues
- **Email** : support@wozif.store

---

**Développé avec ❤️ pour Wozif Store**
