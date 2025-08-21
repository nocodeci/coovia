# 🚀 Guide d'Intégration MTN Money Côte d'Ivoire

## 📋 Vue d'Ensemble

MTN Money Côte d'Ivoire est maintenant intégré avec succès dans le système de paiement intelligent via l'API Softpay PayDunya.

## 🔧 Configuration Technique

### **1. Endpoint API**
```
POST https://app.paydunya.com/api/v1/softpay/mtn-ci
```

### **2. Headers Requis**
```json
{
  "Content-Type": "application/json",
  "PAYDUNYA-MASTER-KEY": "votre_master_key",
  "PAYDUNYA-PUBLIC-KEY": "votre_public_key", 
  "PAYDUNYA-PRIVATE-KEY": "votre_private_key",
  "PAYDUNYA-TOKEN": "votre_token"
}
```

### **3. Payload Requis**
```json
{
  "mtn_ci_customer_fullname": "John Doe",
  "mtn_ci_email": "test@gmail.com",
  "mtn_ci_phone_number": "0701234567",
  "mtn_ci_wallet_provider": "MTNCI",
  "payment_token": "token_de_facture_paydunya"
}
```

### **4. Réponse Attendue**
```json
{
  "success": true,
  "message": "Votre paiement est en cours de traitement. Merci de valider le paiement après reception de sms pour le compléter.",
  "fees": 100,
  "currency": "XOF"
}
```

## 🏗️ Architecture Implémentée

### **1. Service PayDunya (`PaydunyaOfficialService.php`)**

#### **Méthode `payWithMTNCI()`**
- Crée une facture PayDunya pour obtenir un `payment_token`
- Appelle l'API Softpay MTN CI avec le token
- Gère le fallback vers la facture standard si l'API échoue

#### **Méthode `payWithMTNCIAPI()`**
- Appelle directement l'endpoint Softpay MTN CI
- Gère les erreurs et les réponses
- Retourne les frais et la devise si disponibles

### **2. Service Intelligent (`SmartPaymentService.php`)**
- Détecte automatiquement les paiements MTN CI
- Utilise la méthode spécialisée `payWithMTNCI()`
- Gère le fallback intelligent

### **3. Contrôleur (`PaymentController.php`)**
- Route `/api/process-mtn-ci-payment` pour les tests directs
- Validation des données d'entrée
- Gestion des erreurs et réponses

## 📱 Format des Numéros de Téléphone

### **Numéros MTN CI Valides**
- **Format**: `05XXXXXXXX` (10 chiffres)
- **Exemples**:
  - `0554038858` ✅ (Exemple fourni par l'utilisateur)
  - `0501234567` ✅
  - `0512345678` ✅

### **Numéros Invalides**
- `664142312` ❌ (Format incorrect)
- `0123456789` ❌ (Ne commence pas par 05)
- `0701234567` ❌ (Format incorrect pour MTN CI - Orange Money)

## 🧪 Tests et Validation

### **Test Manuel**
```bash
# Tester le flux complet
php artisan payment:test-complete mtn-ci --amount=500 --phone=0554038858

# Tester la méthode spécifique
curl -X POST http://localhost:8000/api/process-mtn-ci-payment \
  -H "Content-Type: application/json" \
  -d '{
    "phone_number": "0554038858",
    "payment_token": "votre_token",
    "customer_name": "John Doe",
    "customer_email": "test@gmail.com"
  }'
```

### **Test Frontend**
1. Aller sur la page de checkout
2. Sélectionner "Côte d'Ivoire"
3. Choisir "MTN Money"
4. Entrer un numéro MTN CI valide (05XXXXXXXX)
5. Procéder au paiement

## 🔄 Flux de Paiement

### **1. Initialisation**
```
Frontend → SmartPaymentService → PaydunyaOfficialService → API PayDunya
```

### **2. Création de Facture**
- Création d'une facture PayDunya standard
- Obtention d'un `payment_token` unique

### **3. Appel API Softpay**
- Utilisation du `payment_token` pour appeler l'API MTN CI
- Envoi des données client (nom, email, téléphone)

### **4. Traitement MTN**
- MTN traite le paiement
- Envoi d'un SMS de confirmation au client
- Le client valide le paiement via SMS

### **5. Confirmation**
- Retour du statut de paiement
- Mise à jour de la commande

## ⚠️ Points d'Attention

### **1. Validation Numéro de Téléphone**
- **Obligatoire**: Le numéro doit être un vrai numéro MTN CI
- **Format**: Doit commencer par `05` et contenir 10 chiffres
- **Test**: Utiliser des numéros de test valides

### **2. Gestion des Erreurs**
- **403**: Numéro de téléphone invalide
- **400**: Données manquantes ou incorrectes
- **500**: Erreur serveur PayDunya

### **3. Fallback**
- Si l'API Softpay échoue, utilisation de la facture standard
- Redirection vers l'interface PayDunya classique

## 🎯 Statut Actuel

### **✅ Fonctionnalités Opérationnelles**
- ✅ Intégration API Softpay MTN CI
- ✅ Validation des numéros de téléphone
- ✅ Gestion des erreurs
- ✅ Fallback vers facture standard
- ✅ Tests automatisés
- ✅ Frontend intégré

### **✅ Tests Réussis**
- ✅ Création de facture PayDunya
- ✅ Appel API Softpay MTN CI
- ✅ Validation numéro MTN CI
- ✅ Réponse API correcte

## 🚀 Utilisation en Production

### **1. Configuration Environnement**
```env
PAYDUNYA_ENVIRONMENT=live
PAYDUNYA_MASTER_KEY=votre_master_key_live
PAYDUNYA_PUBLIC_KEY=votre_public_key_live
PAYDUNYA_PRIVATE_KEY=votre_private_key_live
PAYDUNYA_TOKEN=votre_token_live
```

### **2. URLs de Production**
```
Frontend: https://votre-domaine.com/checkout
API: https://votre-domaine.com/api/smart-payment/initialize
MTN CI: https://votre-domaine.com/api/process-mtn-ci-payment
```

### **3. Monitoring**
- Surveiller les logs Laravel pour les erreurs
- Vérifier les réponses API PayDunya
- Tester régulièrement avec des numéros valides

## 📞 Support

Pour toute question ou problème :
1. Vérifier les logs Laravel (`storage/logs/laravel.log`)
2. Tester avec la commande Artisan
3. Vérifier la configuration des clés API
4. Contacter l'équipe technique

---

**🎉 MTN Money Côte d'Ivoire est maintenant opérationnel !**
