# Configuration des Sous-domaines Dynamiques

## Vue d'ensemble

Cette configuration permet à chaque boutique d'avoir son propre sous-domaine au format :
`{slug-de-la-boutique}.my.wozif.com`

## Architecture

### Format des URLs
- **Boutique principale** : `my.wozif.com`
- **Boutiques clients** : `{slug}.my.wozif.com`
- **Exemples** :
  - `boutique123.my.wozif.com`
  - `ma-boutique.my.wozif.com`
  - `store-abc.my.wozif.com`

### Flux de redirection
1. Utilisateur visite `boutique123.my.wozif.com`
2. Vercel détecte le sous-domaine
3. Redirection vers `my.wozif.com/boutique123`
4. Application React charge la boutique correspondante

## Configuration DNS

### 1. Configuration Vercel

Le domaine `my.wozif.com` est déjà configuré avec les nameservers Vercel :
- `ns1.vercel-dns.com`
- `ns2.vercel-dns.com`

### 2. Configuration des sous-domaines

Vercel gère automatiquement les sous-domaines. Aucune configuration DNS supplémentaire n'est nécessaire.

### 3. Configuration dans le dashboard Vercel

1. Allez sur https://vercel.com/dashboard
2. Sélectionnez votre projet `coovia`
3. Allez dans "Settings" > "Domains"
4. Vérifiez que `my.wozif.com` est configuré
5. Les sous-domaines seront automatiquement gérés

## Configuration de l'Application

### 1. Fonction Vercel (`api/rewrite.js`)

Cette fonction gère la redirection des sous-domaines :

```javascript
export default function handler(req, res) {
  const { hostname } = req.headers;
  const subdomain = hostname.split('.')[0];
  
  // Redirection vers l'application React
  const targetUrl = `https://my.wozif.com/${subdomain}${req.url}`;
  return res.redirect(301, targetUrl);
}
```

### 2. Configuration Vercel (`vercel.json`)

```json
{
  "functions": {
    "api/rewrite.js": {
      "runtime": "nodejs18.x"
    }
  }
}
```

## Gestion des Boutiques

### 1. Création d'une boutique

Quand une nouvelle boutique est créée dans le backend :

1. Un slug unique est généré (ex: `boutique123`)
2. La boutique est accessible via `boutique123.my.wozif.com`
3. L'URL redirige automatiquement vers `my.wozif.com/boutique123`

### 2. Validation des slugs

Les slugs doivent respecter ces règles :
- Caractères autorisés : lettres, chiffres, tirets
- Longueur : 3-50 caractères
- Unique dans la base de données
- Pas de caractères spéciaux

### 3. Gestion des erreurs

- **Boutique inexistante** : Page 404 personnalisée
- **Slug invalide** : Redirection vers la page d'accueil
- **Sous-domaine réservé** : Page d'erreur

## Exemples d'utilisation

### URLs valides
```
✅ boutique123.my.wozif.com
✅ ma-boutique.my.wozif.com
✅ store-abc.my.wozif.com
✅ boutique-2024.my.wozif.com
```

### URLs invalides
```
❌ www.my.wozif.com (réservé)
❌ api.my.wozif.com (réservé)
❌ my.my.wozif.com (réservé)
```

## Sécurité

### 1. Validation des sous-domaines
- Vérification que le slug existe en base
- Protection contre les attaques par énumération
- Rate limiting sur les redirections

### 2. Headers de sécurité
- HSTS activé pour tous les sous-domaines
- Protection XSS et Clickjacking
- CSP configuré

## Monitoring

### 1. Logs Vercel
- Accès aux logs de redirection
- Monitoring des erreurs 404
- Analytics par sous-domaine

### 2. Métriques
- Nombre de visites par boutique
- Temps de redirection
- Taux d'erreur

## Commandes utiles

```bash
# Tester une redirection
curl -I https://boutique123.my.wozif.com

# Vérifier les domaines configurés
vercel domains ls

# Déployer avec la nouvelle configuration
vercel --prod
```

## Dépannage

### Problème : Sous-domaine ne fonctionne pas
1. Vérifier que le slug existe en base
2. Vérifier les logs Vercel
3. Tester la redirection manuellement

### Problème : Erreur 404
1. Vérifier la configuration DNS
2. Vérifier que la fonction rewrite est déployée
3. Vérifier les logs de l'application

### Problème : Redirection en boucle
1. Vérifier la logique de redirection
2. Vérifier les conditions dans la fonction rewrite
3. Tester avec différents sous-domaines
