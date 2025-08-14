# 🔑 Guide pour Obtenir les Credentials Mailtrap

## 🚨 Problème Actuel
Les credentials Mailtrap que vous avez fournis ne fonctionnent pas car ils sont pour Mailtrap Live, mais nous essayons d'utiliser Mailtrap Inbox.

## ✅ Solutions

### **Option 1 : Mailtrap Inbox (Recommandé pour le développement)**

1. **Allez sur [Mailtrap Inbox](https://mailtrap.io/inboxes)**
2. **Créez une nouvelle Inbox** ou utilisez une existante
3. **Cliquez sur "Show Credentials"**
4. **Copiez les informations SMTP**

Vous devriez voir quelque chose comme :
```
SMTP Settings
Host: smtp.mailtrap.io
Port: 2525
Username: abc123def456
Password: xyz789uvw012
```

### **Option 2 : Utiliser Mailtrap Live (Production)**

Si vous voulez utiliser Mailtrap Live, vous devez :

1. **Allez sur [Mailtrap Live](https://mailtrap.io/live)**
2. **Créez un nouveau domaine** ou utilisez un existant
3. **Configurez les DNS records** pour votre domaine
4. **Utilisez les credentials Live** avec le bon domaine

## 🔧 Configuration Actuelle

Votre configuration actuelle :
```bash
MAIL_MAILER=smtp
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=smtp@mailtrap.io
MAIL_PASSWORD=c368936fe291afb61199670a97562ab5
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS="noreply@example.com"
MAIL_FROM_NAME="Coovia"
```

## 🚨 Erreurs Rencontrées

### **1. Erreur 550 - Domaine non autorisé**
```
550 5.7.1 Sending from domain mailtrap.io is not allowed
```
**Cause** : Mailtrap Live avec mauvais domaine
**Solution** : Utilisez Mailtrap Inbox ou configurez un domaine autorisé

### **2. Erreur 535 - Credentials invalides**
```
535 5.7.0 Invalid credentials
```
**Cause** : Credentials Mailtrap Live utilisés avec Mailtrap Inbox
**Solution** : Utilisez les credentials Mailtrap Inbox

## 📋 Étapes pour Résoudre

### **Étape 1 : Obtenir les Credentials Mailtrap Inbox**
1. Allez sur [Mailtrap Inbox](https://mailtrap.io/inboxes)
2. Créez une nouvelle Inbox
3. Cliquez sur "Show Credentials"
4. Copiez Username et Password

### **Étape 2 : Mettre à Jour .env**
```bash
cd backend
# Éditez .env avec les nouvelles credentials
MAIL_USERNAME=votre_username_mailtrap_inbox
MAIL_PASSWORD=votre_password_mailtrap_inbox
```

### **Étape 3 : Tester**
```bash
php artisan config:clear
php test-email.php
```

### **Étape 4 : Vérifier**
- Allez sur [Mailtrap Inbox](https://mailtrap.io/inboxes)
- Vous devriez voir l'email de test

## 🎯 Résultat Attendu

Une fois configuré correctement :
- ✅ **Test d'email réussi**
- ✅ **Email visible dans Mailtrap Inbox**
- ✅ **Emails envoyés lors de création de boutique**

## 📞 Support

- **Mailtrap Inbox** : [https://mailtrap.io/inboxes](https://mailtrap.io/inboxes)
- **Mailtrap Live** : [https://mailtrap.io/live](https://mailtrap.io/live)
- **Documentation** : [https://mailtrap.io/docs/](https://mailtrap.io/docs/)
