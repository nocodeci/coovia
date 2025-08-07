# Variables d'Environnement - Boutique Client

## Configuration requise

Pour configurer l'environnement de production sur Vercel, vous devez définir les variables suivantes dans le dashboard Vercel.

## Variables d'environnement

### API Backend
```
REACT_APP_API_URL=https://api.wozif.com
REACT_APP_API_VERSION=v1
```

### Configuration des paiements

#### Paydunya
```
REACT_APP_PAYDUNYA_PUBLIC_KEY=your_paydunya_public_key
REACT_APP_PAYDUNYA_PRIVATE_KEY=your_paydunya_private_key
REACT_APP_PAYDUNYA_TOKEN=your_paydunya_token
REACT_APP_PAYDUNYA_MODE=test
```

#### Moneroo
```
REACT_APP_MONEROO_PUBLIC_KEY=your_moneroo_public_key
REACT_APP_MONEROO_PRIVATE_KEY=your_moneroo_private_key
REACT_APP_MONEROO_MODE=test
```

#### Pawapay
```
REACT_APP_PAWAPAY_PUBLIC_KEY=your_pawapay_public_key
REACT_APP_PAWAPAY_PRIVATE_KEY=your_pawapay_private_key
REACT_APP_PAWAPAY_MODE=test
```

### Configuration générale
```
REACT_APP_ENVIRONMENT=production
REACT_APP_DEBUG=false
REACT_APP_ANALYTICS_ID=your_analytics_id
```

## Configuration dans Vercel

1. Allez sur le dashboard Vercel
2. Sélectionnez votre projet `coovia`
3. Allez dans "Settings" > "Environment Variables"
4. Ajoutez chaque variable avec sa valeur correspondante
5. Assurez-vous que les variables sont configurées pour l'environnement "Production"

## Variables locales

Pour le développement local, créez un fichier `.env.local` avec les mêmes variables.

## Sécurité

⚠️ **Important** : Ne jamais commiter les vraies clés API dans le code source.
Utilisez toujours les variables d'environnement pour les informations sensibles.
