# Guide de Déploiement Vapor pour Coovia Backend

## Prérequis

### 1. Compte Vapor
- Créez un compte sur [Laravel Vapor](https://vapor.laravel.com)
- Abonnez-vous à un plan Vapor (gratuit ou payant)

### 2. Configuration AWS
- Compte AWS avec les permissions nécessaires
- AWS CLI configuré avec les bonnes credentials

### 3. Permissions AWS Requises
Votre utilisateur AWS doit avoir les permissions suivantes :
- CloudFormation
- Lambda
- API Gateway
- S3
- RDS
- ElastiCache
- IAM (pour créer les rôles nécessaires)

## Étapes de Déploiement

### 1. Installation de Vapor CLI
```bash
composer global require laravel/vapor-cli
```

### 2. Connexion à Vapor
```bash
vapor login
```

### 3. Configuration AWS
```bash
aws configure
# Entrez vos credentials AWS
aws configure set region us-east-1
```

### 4. Création du Projet Vapor
Via l'interface web de Vapor :
1. Connectez-vous à [vapor.laravel.com](https://vapor.laravel.com)
2. Cliquez sur "New Project"
3. Nommez votre projet "coovia-backend"
4. Sélectionnez votre équipe

### 5. Configuration Locale
Le fichier `vapor.yml` est déjà configuré avec :
- Runtime PHP 8.2
- Base de données MySQL 8.0
- Cache Redis 7.0
- Stockage S3
- Variables d'environnement de production

### 6. Variables d'Environnement
Configurez les variables suivantes dans Vapor :
- `APP_KEY` (généré automatiquement)
- `APP_ENV=production`
- `APP_DEBUG=false`
- `DB_*` (configuré automatiquement par Vapor)
- `CACHE_DRIVER=redis`
- `QUEUE_CONNECTION=sq`
- `SESSION_DRIVER=cookie`

### 7. Déploiement
```bash
# Utilisez le script de déploiement
./deploy-vapor.sh

# Ou déployez manuellement
vapor deploy production
```

## Résolution des Problèmes

### Erreur de Permissions AWS
Si vous obtenez des erreurs de permissions :
1. Vérifiez que votre utilisateur AWS a les permissions nécessaires
2. Créez un utilisateur IAM dédié pour Vapor
3. Attachez la politique `VaporFullAccess` (si disponible)

### Erreur de Configuration Vapor
Si Vapor CLI ne fonctionne pas :
1. Créez le projet via l'interface web
2. Utilisez `vapor link` pour lier votre projet local
3. Puis déployez avec `vapor deploy production`

### Erreur de Base de Données
Si les migrations échouent :
1. Vérifiez que la base de données est créée
2. Vérifiez les variables d'environnement DB_*
3. Testez la connexion localement

## Commandes Utiles

```bash
# Voir les projets
vapor project:list

# Voir les environnements
vapor env:list

# Voir les logs
vapor logs production

# Ouvrir l'application
vapor open production

# Redéployer
vapor deploy production
```

## Configuration Post-Déploiement

### 1. Domaines Personnalisés
Dans l'interface Vapor :
1. Allez dans votre projet
2. Cliquez sur "Domains"
3. Ajoutez votre domaine personnalisé

### 2. SSL/TLS
Vapor configure automatiquement SSL pour vos domaines.

### 3. Monitoring
Vapor fournit des métriques automatiques :
- Requêtes par minute
- Latence
- Erreurs
- Utilisation des ressources

## Support

En cas de problème :
1. Consultez la [documentation Vapor](https://docs.vapor.build)
2. Vérifiez les logs avec `vapor logs production`
3. Contactez le support Vapor si nécessaire
