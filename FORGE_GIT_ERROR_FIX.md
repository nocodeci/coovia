# 🔧 Résolution de l'erreur Git Repository dans Forge

## ❌ Erreur rencontrée
```
Tunnel exited with a non-zero code [128].
fatal: not a git repository (or any of the parent directories): .git
```

## 🔍 Cause du problème
Le site Forge n'a pas de repository Git configuré ou la configuration est incorrecte.

## ✅ Solution étape par étape

### 1. Vérifier la configuration Git dans Forge

1. **Allez sur https://forge.laravel.com**
2. **Connectez-vous à votre compte**
3. **Sélectionnez le serveur :** `twilight-rain`
4. **Cliquez sur le site :** `api.wozif.com`
5. **Allez dans l'onglet "Git Repository"**

### 2. Configurer le repository Git

Si aucun repository n'est configuré :

1. **Cliquez sur "Install Repository"**
2. **Configurez les paramètres :**
   - **Repository :** `https://github.com/votre-username/coovia.git`
   - **Branche :** `main` (ou `master`)
   - **Répertoire :** `backend`
3. **Cliquez sur "Install Repository"**

### 3. Si un repository est déjà configuré

1. **Vérifiez l'URL du repository**
2. **Vérifiez la branche sélectionnée**
3. **Vérifiez le répertoire de déploiement**
4. **Si nécessaire, cliquez sur "Reinstall Repository"**

### 4. Vérifier les permissions Git

Si le repository est privé :

1. **Ajoutez votre clé SSH publique à GitHub**
2. **Ou utilisez un token d'accès personnel**
3. **Configurez l'authentification dans Forge**

### 5. Test de la configuration

Après configuration :

1. **Cliquez sur "Deploy Now"**
2. **Vérifiez les logs de déploiement**
3. **Assurez-vous qu'il n'y a plus d'erreur Git**

## 🔧 Commandes de diagnostic

### Via SSH Forge
```bash
# Se connecter au serveur
forge ssh

# Aller dans le répertoire du site
cd /home/forge/api.wozif.com

# Vérifier si c'est un repository Git
ls -la | grep .git

# Si pas de .git, réinstaller le repository
# Via l'interface Forge : Git Repository > Reinstall Repository
```

### Via CLI Forge
```bash
# Vérifier les logs de déploiement
forge deploy:logs api.wozif.com

# Voir les logs du site
forge site:logs api.wozif.com
```

## 📋 Checklist de vérification

- [ ] Repository Git configuré dans Forge
- [ ] URL du repository correcte
- [ ] Branche correcte sélectionnée
- [ ] Répertoire de déploiement correct
- [ ] Permissions d'accès au repository
- [ ] Repository accessible depuis Forge

## 🚨 Solutions alternatives

### Si le repository est privé
1. **Rendez le repository public temporairement**
2. **Ou configurez l'authentification SSH**
3. **Ou utilisez un token d'accès personnel**

### Si le repository n'existe pas
1. **Créez le repository sur GitHub**
2. **Poussez votre code vers le repository**
3. **Configurez le repository dans Forge**

### Si le répertoire est incorrect
1. **Vérifiez la structure de votre repository**
2. **Ajustez le répertoire de déploiement**
3. **Assurez-vous que le dossier `backend` existe**

## 📞 Support

Si le problème persiste :
1. **Vérifiez les logs complets de déploiement**
2. **Contactez le support Forge**
3. **Vérifiez la documentation Forge**

## 🔄 Redéploiement

Une fois le repository configuré :

```bash
# Redéployer via CLI
forge deploy api.wozif.com

# Ou via l'interface Forge
# Cliquez sur "Deploy Now"
```

---

**✅ Après avoir suivi ces étapes, votre déploiement devrait fonctionner correctement !**
