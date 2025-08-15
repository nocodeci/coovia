# 🚀 Déploiement Railway - Coovia Backend

## Déploiement Rapide

### Option 1: Script Automatique (Recommandé)

```bash
# Dans le dossier backend/
./deploy-railway.sh
```

### Option 2: Manuel

1. **Préparer le code**
   ```bash
   cd backend/
   git add .
   git commit -m "🚀 Préparation Railway"
   git push
   ```

2. **Créer le projet Railway**
   - Allez sur [Railway.app](https://railway.app)
   - "New Project" → "Deploy from GitHub repo"
   - Sélectionnez votre repo et le dossier `backend`

3. **Configurer les variables d'environnement**
   - Copiez les variables depuis `railway.env`
   - Générez une clé APP_KEY : `php artisan key:generate --show`

## Variables d'Environnement Essentielles

```env
APP_NAME=Coovia
APP_ENV=production
APP_DEBUG=false
APP_URL=https://votre-app.railway.app
APP_KEY=base64:votre_clé_générée

# Base de données Supabase
DB_CONNECTION=pgsql
DB_HOST=db.xxxxxxxxxxxxx.supabase.co
DB_PORT=5432
DB_DATABASE=postgres
DB_USERNAME=postgres
DB_PASSWORD=votre_mot_de_passe

# Cloudflare R2
FILESYSTEM_DISK=r2
CLOUDFLARE_R2_ACCESS_KEY_ID=d8bd4ac4100f9d1af000d8b59c0d5810
CLOUDFLARE_R2_SECRET_ACCESS_KEY=67482928c8d1093677ad71131d0d63dcbf886d4e7385f1b904e7958af159ac1c
CLOUDFLARE_R2_BUCKET=coovia-files
CLOUDFLARE_R2_URL=https://coovia-files.abf701097f61a1d3954f38fcc6b41e83.r2.cloudflarestorage.com
CLOUDFLARE_R2_ENDPOINT=https://abf701097f61a1d3954f38fcc6b41e83.r2.cloudflarestorage.com
```

## Test du Déploiement

```bash
# Test de santé
curl https://votre-app.railway.app/api/health

# Test de statut complet
curl https://votre-app.railway.app/api/status
```

## Dépannage

- **Logs** : Interface Railway → Deployments → Logs
- **Variables** : Vérifiez toutes les variables d'environnement
- **Base de données** : Testez la connexion Supabase

## Documentation Complète

Voir `RAILWAY_DEPLOYMENT_GUIDE.md` pour le guide détaillé.

---

**Status** : ✅ Prêt pour le déploiement
