# 🔐 Dossier des Clés Sensibles

Ce dossier contient les clés et informations sensibles pour le projet Coovia.

## ⚠️ IMPORTANT - SÉCURITÉ

- **NE JAMAIS** commiter ce dossier sur GitHub
- **NE JAMAIS** partager ces clés publiquement
- **SAUVEGARDEZ** ces informations dans un endroit sécurisé
- **UTILISEZ** des variables d'environnement en production

## 📁 Fichiers inclus

### `cloudflare-r2-credentials.txt`
Contient les clés d'accès Cloudflare R2 et la configuration Mailtrap.

## 🔧 Configuration

### Pour le développement local
Copiez les variables du fichier `cloudflare-r2-credentials.txt` dans votre fichier `.env` :

```bash
# Cloudflare R2
CLOUDFLARE_ACCOUNT_ID=your_account_id
CLOUDFLARE_ACCESS_KEY_ID=your_access_key
CLOUDFLARE_SECRET_ACCESS_KEY=your_secret_key
CLOUDFLARE_R2_BUCKET=your_bucket_name
CLOUDFLARE_R2_REGION=auto
CLOUDFLARE_R2_ENDPOINT=your_endpoint
CLOUDFLARE_R2_PUBLIC_URL=your_public_url

# Mailtrap
MAIL_MAILER=smtp
MAIL_HOST=live.smtp.mailtrap.io
MAIL_PORT=587
MAIL_USERNAME=smtp@mailtrap.io
MAIL_PASSWORD=your_mailtrap_token
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=noreply@wozif.com
MAIL_FROM_NAME=Coovia
```

### Pour la production
Utilisez des variables d'environnement sécurisées sur votre serveur de production.

## 🚀 Fonctionnalités configurées

- ✅ **Cloudflare R2 Storage** : Upload de fichiers vers Cloudflare
- ✅ **Thumbnails automatiques** : Génération avec Intervention Image
- ✅ **Email OTP** : Envoi via Mailtrap
- ✅ **CORS configuré** : Communication frontend/backend

## 📞 Support

En cas de problème avec les clés, contactez l'administrateur du projet.

---
**Dernière mise à jour** : 2025-08-13  
**Version** : Cloudflare R2 + Intervention Image v3
