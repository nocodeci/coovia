# 🚀 Guide de Configuration des Sous-domaines Automatiques

## ✅ Problème résolu

Maintenant, quand une boutique est créée, le sous-domaine est automatiquement créé au format :
`{slug}.wozif.store`

## 🔧 Configuration requise

### 1. Variables d'environnement

Ajoutez ces variables dans votre fichier `.env` :

```env
# Configuration Vercel pour les sous-domaines
VERCEL_TOKEN=your_vercel_token_here
VERCEL_PROJECT_ID=your_project_id_here
VERCEL_DOMAIN=wozif.store
```

### 2. Obtenir le token Vercel

1. Allez sur https://vercel.com/account/tokens
2. Cliquez sur "Create Token"
3. Donnez un nom (ex: "Subdomain Management")
4. Sélectionnez "Full Account" pour les permissions
5. Copiez le token généré

### 3. Obtenir le Project ID

1. Allez sur https://vercel.com/dashboard
2. Sélectionnez votre projet `boutique-client` (ou le projet qui gère wozif.store)
3. Allez dans "Settings" > "General"
4. Copiez le "Project ID"

## 🚀 Fonctionnalités implémentées

### ✅ Création automatique
- Quand une boutique est créée, le sous-domaine est automatiquement créé
- Format : `{slug}.wozif.store`
- Validation du slug (longueur, caractères autorisés, mots réservés)

### ✅ Suppression automatique
- Quand une boutique est supprimée, le sous-domaine est automatiquement supprimé
- Nettoyage complet des ressources

### ✅ Validation
- Vérification de la longueur (3-63 caractères)
- Caractères autorisés : lettres minuscules, chiffres, tirets
- Mots réservés : www, api, admin, my, etc.

### ✅ Gestion d'erreurs
- Les erreurs de sous-domaine n'empêchent pas la création de boutique
- Logs détaillés pour le débogage
- Fallback gracieux

## 📋 Exemples d'utilisation

### Création d'une boutique
```php
// Le slug "ma-boutique" génère automatiquement :
// https://ma-boutique.wozif.store
```

### Validation des slugs
```php
$subdomainService = new SubdomainService();
$validation = $subdomainService->validateSlug('ma-boutique');

if ($validation['valid']) {
    // Slug valide
} else {
    // Erreurs dans $validation['errors']
}
```

## 🔍 Logs de débogage

Les logs suivants sont générés :

### Création réussie
```
[INFO] Création du sous-domaine pour le slug: ma-boutique
[INFO] Sous-domaine créé avec succès: ma-boutique.wozif.store
```

### Création échouée
```
[ERROR] Erreur lors de la création du sous-domaine: API error message
```

### Suppression
```
[INFO] Sous-domaine supprimé avec succès: ma-boutique.wozif.store
```

## 🧪 Tests

### Test de création
1. Créez une nouvelle boutique via l'API
2. Vérifiez les logs pour la création du sous-domaine
3. Testez l'accès : `https://{slug}.my.wozif.com`

### Test de suppression
1. Supprimez une boutique via l'API
2. Vérifiez les logs pour la suppression du sous-domaine
3. Confirmez que le sous-domaine n'est plus accessible

## 🚨 Dépannage

### Problème : Token Vercel invalide
```
[ERROR] Erreur lors de la création du sous-domaine: 401 Unauthorized
```
**Solution** : Vérifiez que le token Vercel est correct et a les bonnes permissions

### Problème : Project ID incorrect
```
[ERROR] Erreur lors de la création du sous-domaine: 404 Not Found
```
**Solution** : Vérifiez que le Project ID correspond au bon projet Vercel

### Problème : Slug invalide
```
[WARNING] Slug invalide pour sous-domaine: Le slug ne peut contenir que des lettres minuscules, chiffres et tirets
```
**Solution** : Utilisez un slug conforme aux règles de validation

## 📞 Support

### Vercel API
- **Documentation** : https://vercel.com/docs/rest-api
- **Tokens** : https://vercel.com/account/tokens
- **Projects** : https://vercel.com/dashboard

### Logs Laravel
```bash
# Voir les logs en temps réel
tail -f storage/logs/laravel.log

# Filtrer les logs de sous-domaines
grep "sous-domaine" storage/logs/laravel.log
```

---

## 🎉 Configuration finale

Avec cette configuration, vous aurez :

1. ✅ **Création automatique** des sous-domaines
2. ✅ **Suppression automatique** des sous-domaines
3. ✅ **Validation** des slugs
4. ✅ **Gestion d'erreurs** robuste
5. ✅ **Logs détaillés** pour le débogage

**Votre système de sous-domaines est maintenant entièrement automatisé !** 🚀
