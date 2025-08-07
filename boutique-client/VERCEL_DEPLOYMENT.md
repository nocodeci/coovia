# Déploiement Vercel - Boutique Client

## Configuration actuelle

- **Domaine principal** : `wozif.com`
- **Sous-domaine** : `my.wozif.com`
- **Projet Vercel** : `coovia`
- **Framework** : Create React App avec CRACO

## Configuration DNS

Le domaine `wozif.com` est configuré avec les nameservers Vercel :
- `ns1.vercel-dns.com`
- `ns2.vercel-dns.com`

## Déploiement

### Commandes utiles

```bash
# Déploiement en production
vercel --prod

# Déploiement en preview
vercel

# Voir les domaines configurés
vercel domains ls

# Ajouter un nouveau domaine
vercel domains add my.wozif.com

# Voir les déploiements
vercel ls
```

### Configuration automatique

Le projet est configuré pour :
- Utiliser `npm install` pour l'installation
- Utiliser `npm run build` pour la construction
- Servir les fichiers depuis le dossier `build`
- Rediriger toutes les routes vers `index.html` (SPA)

## Sécurité

Les en-têtes de sécurité suivants sont configurés :
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Strict-Transport-Security: max-age=31536000; includeSubDomains`
- `Referrer-Policy: strict-origin-when-cross-origin`

## Cache

Les fichiers statiques sont mis en cache pendant 1 an :
- `Cache-Control: public, max-age=31536000, immutable`

## URLs d'accès

- **Production** : https://my.wozif.com
- **Vercel** : https://coovia-ap7jwc5v6-nocodecis-projects.vercel.app

## Redirections

- `/home` → `/` (redirection permanente)

## Région de déploiement

- **Région** : `cdg1` (Paris, France)
