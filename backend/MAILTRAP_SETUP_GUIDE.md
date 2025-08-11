# Guide de configuration Mailtrap pour Wozif

## 📧 Configuration Mailtrap SMTP

### 1. Créer un compte Mailtrap
1. Allez sur [mailtrap.io](https://mailtrap.io)
2. Créez un compte gratuit
3. Accédez à votre Inbox

### 2. Obtenir les informations SMTP
1. Dans votre Inbox, cliquez sur **"Show Credentials"**
2. Sélectionnez **"SMTP Settings"**
3. Copiez les informations suivantes :
   - **Host**: `sandbox.smtp.mailtrap.io`
   - **Port**: `2525`
   - **Username**: Votre nom d'utilisateur Mailtrap (ex: `abc123def456`)
   - **Password**: Votre mot de passe Mailtrap (ex: `xyz789uvw012`)

### 3. Configurer le fichier .env
Remplacez les valeurs dans votre fichier `.env` :

```env
MAIL_MAILER=smtp
MAIL_HOST=sandbox.smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=votre_vrai_username_mailtrap
MAIL_PASSWORD=votre_vrai_password_mailtrap
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS="noreply@coovia.com"
MAIL_FROM_NAME="Wozif"
```

**⚠️ IMPORTANT :** Ne pas utiliser le token API comme password. Utilisez les vraies informations SMTP.

### 4. Vérifier la configuration
```bash
php artisan config:clear
php test-mailtrap-smtp.php
```

## 🧪 Test de l'envoi d'emails

### Test manuel
```bash
php artisan tinker
```

```php
use App\Mail\OtpMail;
use Illuminate\Support\Facades\Mail;

Mail::to('test@example.com')->send(new OtpMail('123456', 'test@example.com'));
```

### Test via l'API
1. Démarrez le serveur Laravel :
```bash
php artisan serve --host=0.0.0.0 --port=8000
```

2. Testez l'authentification à 3 étapes :
```bash
# Étape 1: Validation email
curl -X POST -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}' \
  http://localhost:8000/api/auth/validate-email

# Étape 2: Validation mot de passe (OTP envoyé)
curl -X POST -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","temp_token":"TOKEN_FROM_ETAPE_1"}' \
  http://localhost:8000/api/auth/validate-password

# Étape 3: Connexion avec OTP
curl -X POST -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","otp":"123456","otp_token":"TOKEN_FROM_ETAPE_2"}' \
  http://localhost:8000/api/auth/login
```

## 📬 Vérification des emails

1. Allez sur votre Inbox Mailtrap
2. Vous devriez voir l'email avec le code OTP
3. L'email aura un design professionnel avec :
   - Logo Wozif
   - Code OTP en grand format
   - Messages de sécurité
   - Informations sur l'expiration

## 🔧 Dépannage

### Erreur "Invalid credentials"
- Vérifiez que vous utilisez les vraies informations SMTP (pas le token API)
- Assurez-vous que username et password sont corrects

### Erreur de connexion SMTP
```bash
# Vérifiez les logs Laravel
tail -f storage/logs/laravel.log
```

### Email non reçu
1. Vérifiez les credentials SMTP Mailtrap
2. Vérifiez que le port 2525 n'est pas bloqué
3. Testez avec `php test-mailtrap-smtp.php`

### Erreur de template
```bash
# Vérifiez que le template existe
ls resources/views/emails/otp.blade.php
```

## 🚀 Production

Pour la production, remplacez Mailtrap par un vrai service SMTP :
- Gmail SMTP
- SendGrid
- Amazon SES
- Mailgun

## 📋 Fonctionnalités implémentées

✅ **Configuration Mailtrap SMTP**  
✅ **Template d'email professionnel**  
✅ **Envoi automatique d'OTP**  
✅ **Gestion des erreurs**  
✅ **Logs pour le développement**  
✅ **Design responsive**  
✅ **Messages de sécurité**  

## 🎯 Utilisation

L'OTP est automatiquement envoyé lors de l'étape 2 de l'authentification (validation du mot de passe). L'utilisateur recevra un email avec :

- Code OTP à 6 chiffres
- Instructions de sécurité
- Expiration de 5 minutes
- Design professionnel Wozif

## ⚠️ Configuration actuelle

**Problème détecté :** Vous utilisez un token API comme password SMTP.
**Solution :** Remplacez par les vraies informations SMTP de votre Inbox Mailtrap.
