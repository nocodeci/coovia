# 🚀 Résolution Rapide - Erreur Git Repository Forge

## ❌ Erreur
```
Tunnel exited with a non-zero code [128].
fatal: not a git repository (or any of the parent directories): .git
```

## ✅ Solution en 5 minutes

### Étape 1: Accéder à Forge
1. Allez sur **https://forge.laravel.com**
2. Connectez-vous à votre compte

### Étape 2: Sélectionner le serveur
1. Cliquez sur le serveur **`twilight-rain`**

### Étape 3: Accéder au site
1. Cliquez sur le site **`api.wozif.com`**

### Étape 4: Configurer Git Repository
1. Allez dans l'onglet **"Git Repository"**
2. Cliquez sur **"Install Repository"**
3. Configurez :
   - **Repository :** `https://github.com/votre-username/coovia.git`
   - **Branche :** `main`
   - **Répertoire :** `backend`
4. Cliquez sur **"Install Repository"**

### Étape 5: Déployer
1. Cliquez sur **"Deploy Now"**
2. Attendez que le déploiement se termine

## 🔧 Si le repository est privé

### Option A: Rendre public temporairement
1. Allez sur GitHub
2. Ouvrez votre repository
3. Allez dans Settings > General
4. Descendez jusqu'à "Danger Zone"
5. Cliquez sur "Change repository visibility"
6. Sélectionnez "Make public"

### Option B: Utiliser un token d'accès
1. Sur GitHub, allez dans Settings > Developer settings > Personal access tokens
2. Créez un nouveau token avec les permissions `repo`
3. Dans Forge, utilisez l'URL : `https://TOKEN@github.com/votre-username/coovia.git`

## 🚨 Vérifications importantes

- [ ] Le repository existe sur GitHub
- [ ] Le repository contient le dossier `backend`
- [ ] La branche `main` existe
- [ ] Le repository est accessible (public ou avec authentification)

## 🔄 Après configuration

```bash
# Redéployer via CLI
forge deploy api.wozif.com

# Ou via l'interface Forge
# Cliquez sur "Deploy Now"
```

## 📞 Si le problème persiste

1. Vérifiez les logs complets dans Forge
2. Consultez le guide détaillé : `FORGE_GIT_ERROR_FIX.md`
3. Contactez le support Forge

---

**✅ Une fois ces étapes terminées, votre déploiement devrait fonctionner !**
