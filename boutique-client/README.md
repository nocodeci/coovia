# Application Boutique Client

Cette application React est conçue pour afficher les boutiques clientes avec des URLs de type `{storeId}.mondomaine.com`.

## Configuration

### Variables d'environnement

Créez un fichier `.env` à la racine du projet :

```env
REACT_APP_API_URL=http://localhost:8000/api
```

### Installation

```bash
npm install
```

### Démarrage en développement

```bash
npm start
```

L'application sera accessible sur `http://localhost:3000`.

## Structure des URLs

- `/{storeId}` - Page d'accueil de la boutique
- `/{storeId}/produit/{productId}` - Page de détail du produit
- `/{storeId}/panier` - Page du panier
- `/{storeId}/checkout` - Page de commande

## Configuration pour la production

Pour déployer cette application avec des sous-domaines, vous devrez :

1. **Configurer votre serveur web** (Nginx/Apache) pour rediriger les sous-domaines vers cette application
2. **Configurer votre DNS** pour pointer les sous-domaines vers votre serveur

### Exemple de configuration Nginx

```nginx
server {
    listen 80;
    server_name ~^(?<store_id>.+)\.votre-domaine\.com$;
    
    location / {
        root /path/to/boutique-client/build;
        try_files $uri $uri/ /index.html;
    }
    
    # Proxy vers l'API Laravel
    location /api {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## Intégration avec le backend Laravel

Cette application communique avec le backend Laravel via l'API REST. Assurez-vous que votre backend Laravel expose les endpoints suivants :

- `GET /api/stores/{slug}` - Récupérer les informations d'une boutique
- `GET /api/stores/{storeId}/products` - Récupérer les produits d'une boutique
- `GET /api/stores/{storeId}/products/{productId}` - Récupérer un produit spécifique

## Fonctionnalités

- ✅ Affichage des boutiques par storeId
- ✅ Liste des produits avec recherche
- ✅ Vue grille/liste des produits
- ✅ Panier persistant (localStorage)
- 🔄 Page de détail produit
- 🔄 Processus de commande
- 🔄 Système d'authentification client

## Développement

### Ajouter une nouvelle route

1. Créez un fichier dans `src/routes/`
2. Exportez une `Route` avec `createFileRoute`
3. Le routeur sera automatiquement mis à jour

### Ajouter un nouveau service API

1. Ajoutez les méthodes dans `src/services/api.ts`
2. Utilisez `useQuery` pour les requêtes dans les composants

## Build pour la production

```bash
npm run build
```

Les fichiers de production seront générés dans le dossier `build/`. 