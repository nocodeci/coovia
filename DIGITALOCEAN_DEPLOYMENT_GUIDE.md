# 🚀 Guide de Déploiement DigitalOcean App Platform

## 📋 Prérequis

1. **Compte DigitalOcean** : Créez un compte sur [digitalocean.com](https://digitalocean.com)
2. **doctl CLI** : Installez l'outil en ligne de commande DigitalOcean
3. **Token API** : Générez un token API dans votre dashboard DigitalOcean

## 🔧 Installation de doctl

### macOS
```bash
brew install doctl
```

### Linux
```bash
snap install doctl
```

### Windows
```bash
# Téléchargez depuis https://github.com/digitalocean/doctl/releases
```

## 🔐 Authentification

```bash
# Initialiser l'authentification
doctl auth init

# Entrez votre token API quand demandé
```

## �� Déploiement Automatique

### Option 1 : Script Automatique
```bash
./deploy-digitalocean.sh
```

### Option 2 : Déploiement Manuel

1. **Créer l'application**
```bash
doctl apps create --spec .do/app.yaml
```

2. **Vérifier le statut**
```bash
doctl apps list
```

3. **Voir les logs**
```bash
doctl apps logs <app-id>
```

## 📊 Configuration de l'Application

### Structure du Projet
```
coovia/
├── .do/
│   └── app.yaml          # Configuration DigitalOcean
├── backend/
│   ├── Dockerfile        # Image Docker
│   └── docker/
│       └── start.sh      # Script de démarrage
└── deploy-digitalocean.sh # Script de déploiement
```

### Variables d'Environnement

L'application utilise ces variables automatiquement :
- `APP_ENV=production`
- `APP_DEBUG=false`
- `DB_CONNECTION=pgsql`
- `DB_HOST=${db.DATABASE_HOST}`
- `DB_PORT=${db.DATABASE_PORT}`
- `DB_DATABASE=${db.DATABASE_NAME}`
- `DB_USERNAME=${db.DATABASE_USER}`
- `DB_PASSWORD=${db.DATABASE_PASSWORD}`

## 🔍 Monitoring et Logs

### Voir les Logs
```bash
doctl apps logs <app-id> --follow
```

### Vérifier le Statut
```bash
doctl apps list
doctl apps get <app-id>
```

### Health Check
L'application expose un endpoint de santé :
```
GET /api/health
```

## 🛠️ Maintenance

### Redéployer
```bash
doctl apps create --spec .do/app.yaml
```

### Mettre à Jour
```bash
doctl apps update <app-id> --spec .do/app.yaml
```

### Supprimer
```bash
doctl apps delete <app-id>
```

## 💰 Coûts

- **Instance Basic XXS** : ~$5/mois
- **Base de données PostgreSQL** : ~$7/mois
- **Total estimé** : ~$12/mois

## 🔒 Sécurité

1. **Variables d'environnement** : Configurées automatiquement
2. **SSL** : Activé automatiquement
3. **Base de données** : Isolée et sécurisée
4. **Health checks** : Surveillance automatique

## 🚨 Dépannage

### Problèmes Courants

1. **Erreur d'authentification**
```bash
doctl auth init
```

2. **Application ne démarre pas**
```bash
doctl apps logs <app-id>
```

3. **Base de données non accessible**
```bash
doctl databases list
doctl databases get <db-id>
```

## 📞 Support

- **Documentation** : [docs.digitalocean.com](https://docs.digitalocean.com)
- **Support** : Via le dashboard DigitalOcean
- **Community** : [DigitalOcean Community](https://www.digitalocean.com/community)

## 🎯 Prochaines Étapes

1. **Déployer le frontend** sur Vercel
2. **Configurer le domaine personnalisé**
3. **Mettre en place le monitoring**
4. **Configurer les sauvegardes**
