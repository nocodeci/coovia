# 🌐 Configuration du Domaine wozif.store

## ✅ Déploiement Vercel Réussi

Votre application a été déployée avec succès sur Vercel :
- **URL de déploiement** : `https://coovia-fbcna9zm3-nocodecis-projects.vercel.app`
- **Projet** : `nocodecis-projects/coovia`

## 🔧 Configuration du Domaine wozif.store

### **Étape 1 : Accès au Dashboard Vercel**

1. Connectez-vous à [vercel.com](https://vercel.com)
2. Allez dans votre projet `coovia`
3. Cliquez sur l'onglet **"Settings"**

### **Étape 2 : Ajout du Domaine**

1. Dans la section **"Domains"**
2. Cliquez sur **"Add Domain"**
3. Entrez : `wozif.store`
4. Cliquez sur **"Add"**

### **Étape 3 : Configuration DNS**

Vercel vous fournira des instructions DNS. Configurez votre domaine avec :

```
Type: CNAME
Name: @
Value: cname.vercel-dns.com
```

### **Étape 4 : Configuration des Sous-domaines**

Pour activer les sous-domaines wildcard `*.wozif.store` :

1. Dans Vercel, ajoutez également : `*.wozif.store`
2. Ou configurez dans votre DNS :
   ```
   Type: CNAME
   Name: *
   Value: cname.vercel-dns.com
   ```

## 🧪 Test des Sous-domaines

Une fois configuré, testez avec :

- **Page d'accueil** : `https://wozif.store`
- **Boutique de test** : `https://test-store.wozif.store`
- **Boutique demo** : `https://demo.wozif.store`

## 🔗 Connexion Backend

Assurez-vous que votre backend Laravel est accessible sur :
- **API URL** : `https://api.wozif.store`

## 📋 Checklist de Déploiement

- ✅ **Frontend déployé** sur Vercel
- ✅ **Configuration sous-domaines** dans Next.js
- ✅ **Middleware** configuré pour `{slug}.wozif.store`
- ⏳ **Domaine wozif.store** à configurer
- ⏳ **Sous-domaines wildcard** à activer
- ⏳ **Backend Laravel** à déployer sur `api.wozif.store`

## 🆘 Support

Si vous rencontrez des problèmes :

1. **Vérifiez les logs** dans le dashboard Vercel
2. **Testez l'API** : `https://api.wozif.store/api/health`
3. **Vérifiez DNS** : Utilisez des outils comme `nslookup` ou `dig`

---

**🎉 Votre plateforme multi-boutiques sera bientôt accessible sur wozif.store !**
