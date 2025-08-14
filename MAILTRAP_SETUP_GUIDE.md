# 📧 Guide de Configuration Mailtrap

## 🚨 Problème Actuel
Les emails de confirmation de création de boutique ne sont pas envoyés à cause d'une mauvaise configuration Mailtrap.

## ✅ Solutions

### **Option 1 : Mailtrap Inbox (Recommandé pour le développement)**

1. **Allez sur [Mailtrap Inbox](https://mailtrap.io/inboxes)**
2. **Créez une nouvelle Inbox** ou utilisez une existante
3. **Cliquez sur "Show Credentials"**
4. **Copiez les informations SMTP**

Mettez à jour votre fichier `.env` :

```bash
# Mailtrap Inbox (Développement)
MAIL_MAILER=smtp
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=votre_username_mailtrap
MAIL_PASSWORD=votre_password_mailtrap
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS="noreply@example.com"
MAIL_FROM_NAME="Coovia"
```

### **Option 2 : Mailtrap Live (Production)**

Si vous voulez utiliser Mailtrap Live pour la production :

1. **Allez sur [Mailtrap Live](https://mailtrap.io/live)**
2. **Créez un nouveau domaine** ou utilisez un existant
3. **Configurez les DNS records**
4. **Utilisez les credentials Live**

```bash
# Mailtrap Live (Production)
MAIL_MAILER=smtp
MAIL_HOST=live.smtp.mailtrap.io
MAIL_PORT=587
MAIL_USERNAME=votre_username_live
MAIL_PASSWORD=votre_password_live
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS="noreply@votre-domaine.com"
MAIL_FROM_NAME="Coovia"
```

### **Option 3 : Gmail SMTP (Alternative)**

```bash
# Gmail SMTP
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=votre_email@gmail.com
MAIL_PASSWORD=votre_app_password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS="votre_email@gmail.com"
MAIL_FROM_NAME="Coovia"
```

## 🔧 Test de Configuration

### **1. Mettre à jour les variables**
```bash
cd backend
# Éditez .env avec vos vraies valeurs Mailtrap
nano .env
```

### **2. Nettoyer le cache**
```bash
php artisan config:clear
```

### **3. Tester l'envoi**
```bash
php test-email.php
```

### **4. Vérifier dans Mailtrap**
- Allez sur [Mailtrap Inbox](https://mailtrap.io/inboxes)
- Vous devriez voir l'email de test

## 📋 Configuration Actuelle

Votre configuration actuelle :
```bash
MAIL_MAILER=smtp
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=your_mailtrap_username
MAIL_PASSWORD=your_mailtrap_password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS="noreply@example.com"
MAIL_FROM_NAME="Coovia"
```

## 🚨 Problèmes Courants

### **1. Erreur 550 - Domaine non autorisé**
```
550 5.7.1 Sending from domain example.com is not allowed
```
**Solution** : Utilisez Mailtrap Inbox au lieu de Mailtrap Live

### **2. Erreur d'authentification**
```
535 5.7.8 Username and Password not accepted
```
**Solution** : Vérifiez vos credentials Mailtrap

### **3. Erreur de port**
```
Connection refused
```
**Solution** : Utilisez le port 2525 pour Mailtrap Inbox

## 🎯 Résultat Attendu

Une fois configuré correctement :
- ✅ **Emails envoyés** lors de la création de boutique
- ✅ **Emails visibles** dans Mailtrap Inbox
- ✅ **Template HTML** correctement affiché
- ✅ **Informations de boutique** incluses

## 📞 Support

- **Mailtrap Documentation** : [Mailtrap Docs](https://mailtrap.io/docs/)
- **Mailtrap Inbox** : [Mailtrap Inbox](https://mailtrap.io/inboxes)
- **Mailtrap Live** : [Mailtrap Live](https://mailtrap.io/live)
