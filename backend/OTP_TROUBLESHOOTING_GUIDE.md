# 🔧 Guide de Dépannage OTP - Coovia

## 🚨 **Problème Identifié**

Vous ne recevez plus d'emails OTP de connexion à cause d'une configuration email incorrecte.

## ✅ **Solution Temporaire (Immédiate)**

Le système est maintenant configuré pour afficher les OTP dans les logs. Voici comment procéder :

### **1. Surveiller les OTP en temps réel**
```bash
cd backend
./monitor-otp.sh
```

### **2. Tester la connexion**
1. Allez sur votre application frontend
2. Essayez de vous connecter
3. Le code OTP apparaîtra dans le terminal

**Exemple de sortie :**
```
[2025-08-13 00:24:16] local.INFO: OTP pour koffiyohaneric225@gmail.com: 883700
```

## 🔧 **Solution Définitive (Configuration Mailtrap)**

### **Étape 1 : Créer un compte Mailtrap**
1. Allez sur [mailtrap.io](https://mailtrap.io)
2. Créez un compte gratuit
3. Accédez à votre Inbox

### **Étape 2 : Obtenir les vraies informations SMTP**
1. Dans votre Inbox, cliquez sur **"Show Credentials"**
2. Sélectionnez **"SMTP Settings"**
3. Copiez les informations :
   - **Host**: `sandbox.smtp.mailtrap.io`
   - **Port**: `2525`
   - **Username**: Votre vrai username (ex: `abc123def456`)
   - **Password**: Votre vrai password (ex: `xyz789uvw012`)

### **Étape 3 : Mettre à jour la configuration**
```bash
cd backend
```

Modifiez le fichier `.env` :
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

### **Étape 4 : Tester la configuration**
```bash
php artisan config:clear
php test-mailtrap-smtp.php
```

## 🧪 **Tests de Validation**

### **Test 1 : Vérifier la configuration**
```bash
php artisan tinker --execute="echo 'Mail driver: ' . config('mail.default'); echo 'Mail host: ' . config('mail.mailers.smtp.host');"
```

### **Test 2 : Envoyer un email de test**
```bash
php artisan tinker --execute="use App\Mail\OtpMail; use Illuminate\Support\Facades\Mail; Mail::to('test@example.com')->send(new OtpMail('123456', 'test@example.com')); echo 'Test envoyé';"
```

### **Test 3 : Test complet d'authentification**
```bash
# Démarrer le serveur
php artisan serve --host=0.0.0.0 --port=8000

# Dans un autre terminal, tester l'API
curl -X POST -H "Content-Type: application/json" \
  -d '{"email":"votre_email@example.com"}' \
  http://localhost:8000/api/auth/validate-email
```

## 📋 **Configuration Actuelle**

### **Mode Développement (Logs)**
- ✅ OTP affichés dans les logs
- ✅ Pas de configuration email requise
- ✅ Fonctionne immédiatement

### **Mode Production (Mailtrap)**
- ⚠️ Nécessite configuration Mailtrap
- ✅ Emails envoyés via SMTP
- ✅ Interface web pour voir les emails

## 🔍 **Dépannage Avancé**

### **Erreur "Invalid credentials"**
```bash
# Vérifier les credentials
php artisan tinker --execute="echo 'Username: ' . config('mail.mailers.smtp.username'); echo 'Password: ' . substr(config('mail.mailers.smtp.password'), 0, 8) . '...';"
```

### **Erreur de connexion SMTP**
```bash
# Vérifier la connectivité
telnet sandbox.smtp.mailtrap.io 2525
```

### **Logs détaillés**
```bash
# Surveiller tous les logs
tail -f storage/logs/laravel.log

# Filtrer les erreurs email
tail -f storage/logs/laravel.log | grep -i "mail\|smtp\|otp"
```

## 🎯 **Prochaines Étapes**

1. **Immédiat** : Utilisez `./monitor-otp.sh` pour voir les OTP
2. **Court terme** : Configurez Mailtrap correctement
3. **Long terme** : Passez à un service email de production (SendGrid, Mailgun, etc.)

## 📞 **Support**

Si vous avez des problèmes :
1. Vérifiez les logs : `tail -f storage/logs/laravel.log`
2. Testez la configuration : `php test-mailtrap-smtp.php`
3. Consultez ce guide de dépannage

---

**✅ Le problème est maintenant résolu temporairement. Vous pouvez vous connecter en surveillant les OTP dans les logs !**
