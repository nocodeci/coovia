# 📧 Guide de Configuration Email pour Wozif

## 🎯 **Configuration Actuelle (Développement)**

### **Adresse d'Expédition :**
- **Email** : `wozif@wozif.com`
- **Nom** : `Wozif`
- **Service** : Mailtrap (pour les tests)

### **Variables d'environnement (.env) :**
```env
MAIL_MAILER=smtp
MAIL_HOST=sandbox.smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=api
MAIL_PASSWORD=783efa0e0035c91f3f2eddc1d6ac6bd7
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS="wozif@wozif.com"
MAIL_FROM_NAME="Wozif"
```

## 🚀 **Configuration Production**

### **Option 1 : SendGrid (Recommandé)**

1. **Créer un compte SendGrid**
2. **Configurer l'authentification par domaine**
3. **Variables d'environnement :**
```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.sendgrid.net
MAIL_PORT=587
MAIL_USERNAME=apikey
MAIL_PASSWORD=your_sendgrid_api_key
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS="wozif@wozif.com"
MAIL_FROM_NAME="Wozif"
```

### **Option 2 : Mailgun**

1. **Créer un compte Mailgun**
2. **Configurer le domaine wozif.com**
3. **Variables d'environnement :**
```env
MAIL_MAILER=mailgun
MAILGUN_DOMAIN=wozif.com
MAILGUN_SECRET=your_mailgun_secret
MAIL_FROM_ADDRESS="wozif@wozif.com"
MAIL_FROM_NAME="Wozif"
```

### **Option 3 : Amazon SES**

1. **Configurer Amazon SES**
2. **Vérifier le domaine wozif.com**
3. **Variables d'environnement :**
```env
MAIL_MAILER=ses
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
AWS_DEFAULT_REGION=us-east-1
MAIL_FROM_ADDRESS="wozif@wozif.com"
MAIL_FROM_NAME="Wozif"
```

## 🔧 **Configuration du Domaine**

### **DNS Records nécessaires :**

#### **Pour SendGrid :**
```
Type: CNAME
Name: s1._domainkey
Value: s1.domainkey.u12345678.wl123.sendgrid.net

Type: CNAME
Name: s2._domainkey
Value: s2.domainkey.u12345678.wl123.sendgrid.net
```

#### **Pour Mailgun :**
```
Type: TXT
Name: @
Value: v=spf1 include:mailgun.org ~all

Type: CNAME
Name: email
Value: mxa.mailgun.org
```

#### **Pour Amazon SES :**
```
Type: TXT
Name: _amazonses
Value: [vérification_token]

Type: MX
Name: @
Value: 10 inbound-smtp.us-east-1.amazonaws.com
```

## 🧪 **Tests de Configuration**

### **Test en Développement :**
```bash
cd backend
php test-store-email.php
```

### **Test en Production :**
```bash
# Tester l'envoi d'email
php artisan tinker
```

```php
use App\Mail\StoreCreatedMail;
use Illuminate\Support\Facades\Mail;

Mail::to('test@example.com')->send(new StoreCreatedMail(
    'Boutique Test',
    'boutique-test',
    ['wozif'],
    'Utilisateur Test'
));
```

## 📊 **Monitoring et Logs**

### **Logs à Surveiller :**
```bash
# Logs Laravel
tail -f storage/logs/laravel.log | grep -i mail

# Logs d'erreur email
grep "Erreur lors de l'envoi" storage/logs/laravel.log
```

### **Métriques Importantes :**
- ✅ **Taux de livraison** : > 95%
- ✅ **Taux d'ouverture** : > 20%
- ✅ **Taux de clic** : > 5%
- ❌ **Taux de rebond** : < 5%

## 🔒 **Sécurité**

### **Bonnes Pratiques :**
- ✅ **Authentification SPF/DKIM** configurée
- ✅ **Adresse d'expédition vérifiée**
- ✅ **Rate limiting** activé
- ✅ **Logs sécurisés** (pas de données sensibles)

### **Protection contre le Spam :**
- ✅ **Headers d'email** appropriés
- ✅ **Contenu HTML** valide
- ✅ **Liens de désabonnement** (optionnel)
- ✅ **Authentification SMTP** sécurisée

## 🎨 **Personnalisation**

### **Modifier l'Adresse d'Expédition :**
```bash
# Changer l'adresse email
sed -i 's/wozif@wozif.com/nouvelle@wozif.com/g' .env

# Changer le nom d'affichage
sed -i 's/MAIL_FROM_NAME="Wozif"/MAIL_FROM_NAME="Nouveau Nom"/g' .env
```

### **Modifier le Template d'Email :**
1. Éditer `resources/views/emails/store-created.blade.php`
2. Ajuster les styles CSS
3. Modifier le contenu
4. Tester avec `php test-store-email.php`

## 📈 **Améliorations Futures**

### **Fonctionnalités Avancées :**
- 📊 **Dashboard de statistiques** d'email
- 🔄 **Système de retry** automatique
- 📧 **Templates multiples** par type de boutique
- 🎯 **Emails personnalisés** selon les préférences utilisateur
- 📱 **Notifications push** en complément des emails

### **Intégrations :**
- 📊 **Google Analytics** pour le tracking
- 📈 **Mixpanel** pour les analytics
- 🔔 **Slack** pour les notifications d'erreur
- 📧 **Zapier** pour l'automatisation

## ✅ **Statut Actuel**

- ✅ **Adresse d'expédition** : `wozif@wozif.com` (au lieu de `hello@wozif.com`)
- ✅ **Nom d'affichage** : `Wozif`
- ✅ **Configuration Mailtrap** : Fonctionnelle pour les tests
- ✅ **Template d'email** : Moderne et responsive
- ✅ **Gestion d'erreurs** : Logs détaillés
- ✅ **Tests** : Script de test fonctionnel

## 🚀 **Prochaines Étapes Production**

1. **Choisir un service SMTP** (SendGrid recommandé)
2. **Configurer l'authentification par domaine**
3. **Tester l'envoi d'emails en production**
4. **Monitorer les métriques de livraison**
5. **Configurer les alertes d'erreur**

Le système d'email est maintenant configuré avec l'adresse `wozif@wozif.com` ! 🎉
