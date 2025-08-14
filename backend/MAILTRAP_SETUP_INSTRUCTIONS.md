# 📧 Configuration Mailtrap - Instructions Détaillées

## 🎯 **Objectif**
Configurer Mailtrap pour recevoir les emails OTP au lieu de les voir seulement dans les logs.

## 📋 **Étapes à suivre**

### **1. Accéder à votre compte Mailtrap**
1. Allez sur [mailtrap.io](https://mailtrap.io)
2. Connectez-vous à votre compte
3. Accédez à votre Inbox principale

### **2. Obtenir les informations SMTP**
1. Dans votre Inbox, cliquez sur **"Show Credentials"**
2. Sélectionnez l'onglet **"SMTP Settings"**
3. Copiez ces informations exactement :

```
Host: sandbox.smtp.mailtrap.io
Port: 2525
Username: [VOTRE_VRAI_USERNAME]
Password: [VOTRE_VRAI_PASSWORD]
```

### **3. Mettre à jour le fichier .env**
Remplacez les lignes suivantes dans `backend/.env` :

**AVANT :**
```env
MAIL_USERNAME=api
MAIL_PASSWORD=783efa0e0035c91f3f2eddc1d6ac6bd7
```

**APRÈS :**
```env
MAIL_USERNAME=votre_vrai_username_mailtrap
MAIL_PASSWORD=votre_vrai_password_mailtrap
```

### **4. Vérifier la configuration**
```bash
cd backend
php artisan config:clear
php test-mailtrap-smtp.php
```

### **5. Tester l'envoi d'email**
```bash
php artisan tinker --execute="use App\Mail\OtpMail; use Illuminate\Support\Facades\Mail; Mail::to('test@example.com')->send(new OtpMail('123456', 'test@example.com')); echo 'Email test envoyé';"
```

## 🔍 **Vérification**

### **Dans votre Inbox Mailtrap :**
- Vous devriez voir l'email avec le code OTP
- L'email aura un design professionnel
- Le code OTP sera clairement visible

### **Dans les logs Laravel :**
- Plus d'erreurs de connexion SMTP
- Messages de succès d'envoi d'email

## 🚨 **Problèmes courants**

### **Erreur "Invalid credentials"**
- Vérifiez que vous utilisez les vraies informations SMTP (pas le token API)
- Assurez-vous que username et password sont corrects

### **Erreur de connexion**
- Vérifiez que le port 2525 n'est pas bloqué
- Testez la connectivité : `telnet sandbox.smtp.mailtrap.io 2525`

### **Email non reçu**
- Vérifiez votre Inbox Mailtrap
- Vérifiez les logs : `tail -f storage/logs/laravel.log`

## ✅ **Configuration finale attendue**

```env
MAIL_MAILER=smtp
MAIL_HOST=sandbox.smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=votre_vrai_username_mailtrap
MAIL_PASSWORD=votre_vrai_password_mailtrap
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS="noreply@coovia.com"
MAIL_FROM_NAME="Coovia"
```

## 🎉 **Résultat attendu**

Une fois configuré correctement :
- ✅ Les OTP seront envoyés par email
- ✅ Vous les verrez dans votre Inbox Mailtrap
- ✅ Plus besoin de surveiller les logs
- ✅ Processus d'authentification complet

---

**⚠️ IMPORTANT :** Ne partagez jamais vos vraies credentials Mailtrap. Gardez-les privées !

