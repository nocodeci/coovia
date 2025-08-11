# 🚀 Guide d'Intégration Pawapay - Wozif

## 📋 Table des Matières

1. [Vue d'ensemble](#vue-densemble)
2. [Configuration](#configuration)
3. [API Endpoints](#api-endpoints)
4. [Création de Paiements](#création-de-paiements)
5. [Vérification de Statuts](#vérification-de-statuts)
6. [Gestion des Callbacks](#gestion-des-callbacks)
7. [Pays et Méthodes Supportés](#pays-et-méthodes-supportés)
8. [Gestion des Erreurs](#gestion-des-erreurs)
9. [Exemples d'Utilisation](#exemples-dutilisation)
10. [Dépannage](#dépannage)

## 🎯 Vue d'ensemble

Pawapay est une plateforme de paiement mobile money qui supporte plusieurs pays africains. Cette intégration permet de traiter des paiements via différentes méthodes de paiement mobile selon le pays.

### **Fonctionnalités Principales**
- ✅ Création de dépôts de paiement
- ✅ Vérification de statuts en temps réel
- ✅ Renvoi de callbacks
- ✅ Support multi-pays
- ✅ Gestion robuste des erreurs
- ✅ Interface utilisateur moderne

## ⚙️ Configuration

### **Variables d'Environnement**

```env
# Pawapay Configuration
PAWAPAY_TOKEN=eyJraWQiOiIxIiwiYWxnIjoiRVMyNTYifQ...
PAWAPAY_SANDBOX=true
```

### **Configuration Laravel**

```php
// config/services.php
'pawapay' => [
    'token' => env('PAWAPAY_TOKEN'),
    'sandbox' => env('PAWAPAY_SANDBOX', true),
],
```

## 🔌 API Endpoints

### **Backend Laravel**

| Endpoint | Méthode | Description |
|----------|---------|-------------|
| `/api/pawapay/initialize` | POST | Initialiser un paiement |
| `/api/pawapay/check-status` | POST | Vérifier le statut d'un paiement |
| `/api/pawapay/resend-callback` | POST | Renvoyer un callback |
| `/api/pawapay/process/{country}/{method}` | POST | Traiter un paiement spécifique |

### **API Directe Pawapay**

| Endpoint | Méthode | Description |
|----------|---------|-------------|
| `https://api.pawapay.io/v2/deposits` | POST | Créer un dépôt |
| `https://api.pawapay.io/v2/deposits/{depositId}` | GET | Vérifier le statut |
| `https://api.pawapay.io/v2/deposits/resend-callback/{depositId}` | POST | Renvoyer un callback |

## 💳 Création de Paiements

### **Exemple de Requête**

```bash
curl -X POST "http://127.0.0.1:8000/api/pawapay/process/ZMB/mtn-momo-zambia" \
  -H "Content-Type: application/json" \
  -d '{
    "phone_number": "260763456789",
    "amount": 123.00,
    "customer_name": "John Doe",
    "customer_email": "john@example.com",
    "order_id": "ORD-123456"
  }'
```

### **Réponse de Succès**

```json
{
  "success": true,
  "message": "Paiement mtn-momo-zambia pour ZMB traité avec succès",
  "data": {
    "deposit_id": "8917c345-4791-4285-a416-62f24b6982db",
    "status": "pending",
    "amount": 123.00
  }
}
```

## 🔍 Vérification de Statuts

### **Via API Laravel**

```bash
curl -X POST "http://127.0.0.1:8000/api/pawapay/check-status" \
  -H "Content-Type: application/json" \
  -d '{"deposit_id": "8917c345-4791-4285-a416-62f24b6982db"}'
```

### **Via API Directe Pawapay (Recommandé)**

```bash
curl -X GET "https://api.pawapay.io/v2/deposits/8917c345-4791-4285-a416-62f24b6982db" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### **Réponse de Statut**

```json
{
  "status": "FOUND",
  "data": {
    "depositId": "8917c345-4791-4285-a416-62f24b6982db",
    "status": "COMPLETED",
    "amount": "123.00",
    "currency": "ZMW",
    "country": "ZMB",
    "payer": {
      "type": "MMO",
      "accountDetails": {
        "phoneNumber": "260763456789",
        "provider": "MTN_MOMO_ZMB"
      }
    },
    "customerMessage": "To ACME company",
    "clientReferenceId": "REF-987654321",
    "created": "2020-10-19T08:17:01Z",
    "providerTransactionId": "12356789",
    "metadata": {
      "orderId": "ORD-123456789",
      "customerId": "customer@email.com"
    }
  }
}
```

## 🔄 Gestion des Callbacks

### **Renvoi de Callback**

```bash
curl -X POST "https://api.pawapay.io/v2/deposits/resend-callback/8917c345-4791-4285-a416-62f24b6982db" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### **Via API Laravel**

```bash
curl -X POST "http://127.0.0.1:8000/api/pawapay/resend-callback" \
  -H "Content-Type: application/json" \
  -d '{"deposit_id": "8917c345-4791-4285-a416-62f24b6982db"}'
```

## 🌍 Pays et Méthodes Supportés

### **Zambie (ZMB)**
- **MTN MoMo Zambia** : `mtn-momo-zambia`
- **Airtel Money Zambia** : `airtel-money-zambia`
- **Zamtel Money Zambia** : `zamtel-money-zambia`

### **Ouganda (UG)**
- **MTN MoMo Uganda** : `mtn-momo-uganda`

### **Tanzanie (TZ)**
- **M-Pesa Tanzania** : `m-pesa-tanzania`
- **Airtel Money Tanzania** : `airtel-money-tanzania`
- **Tigo Pesa Tanzania** : `tigo-pesa-tanzania`

### **Kenya (KE)**
- **M-Pesa Kenya** : `m-pesa-kenya`
- **Airtel Money Kenya** : `airtel-money-kenya`

### **Nigeria (NG)**
- **MTN MoMo Nigeria** : `mtn-momo-nigeria`
- **Airtel Money Nigeria** : `airtel-money-nigeria`

## 📊 Statuts de Paiement

| Statut | Description | Couleur | Action |
|--------|-------------|---------|--------|
| **ACCEPTED** | Paiement accepté et en cours | Bleu | Attendre |
| **PENDING** | Paiement en attente | Jaune | Vérifier plus tard |
| **COMPLETED** | Paiement complété | Vert | Confirmer |
| **FAILED** | Paiement échoué | Rouge | Réessayer |
| **REJECTED** | Paiement rejeté | Rouge | Contacter le client |
| **CANCELLED** | Paiement annulé | Gris | Ignorer |

## ⚠️ Gestion des Erreurs

### **Erreurs Communes**

#### **1. Erreur de Validation**
```json
{
  "failureCode": "INVALID_PARAMETER",
  "failureMessage": "Deposit ID length must be equal to 36"
}
```

#### **2. Erreur de Format de Téléphone**
```json
{
  "failureCode": "INVALID_PAYER_FORMAT",
  "failureMessage": "Only numbers are accepted. No whitespaces, separators or prefixes like + or 0 are allowed"
}
```

#### **3. Erreur de Solde Insuffisant**
```json
{
  "failureCode": "INSUFFICIENT_BALANCE",
  "failureMessage": "The customer does not have enough funds to complete the payment."
}
```

### **Codes d'Erreur Pawapay**

| Code | Description | Solution |
|------|-------------|----------|
| `INVALID_PARAMETER` | Paramètre invalide | Vérifier le format des données |
| `INVALID_PAYER_FORMAT` | Format de téléphone invalide | Nettoyer le numéro |
| `INSUFFICIENT_BALANCE` | Solde insuffisant | Informer le client |
| `UNKNOWN_ERROR` | Erreur inconnue | Réessayer plus tard |

## 💻 Exemples d'Utilisation

### **Frontend React**

```tsx
import React, { useState } from 'react'
import { useToast } from '../hooks/use-toast'

export default function PawapayPaymentForm() {
  const [phone, setPhone] = useState('')
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handlePayment = async () => {
    setLoading(true)
    
    try {
      const response = await fetch('/api/pawapay/process/ZMB/mtn-momo-zambia', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone_number: phone,
          amount: parseFloat(amount),
          customer_name: 'John Doe',
          customer_email: 'john@example.com'
        })
      })

      const data = await response.json()
      
      if (data.success) {
        toast({
          title: "Succès",
          description: "Paiement initié avec succès",
        })
      } else {
        toast({
          title: "Erreur",
          description: data.message,
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur de communication",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-xl font-semibold mb-4">Paiement Pawapay</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Numéro de téléphone</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="260763456789"
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Montant</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="123.00"
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
        
        <button
          onClick={handlePayment}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? 'Traitement...' : 'Payer'}
        </button>
      </div>
    </div>
  )
}
```

### **Vérification de Statut**

```tsx
import React, { useState, useEffect } from 'react'
import PaymentStatusDisplay from './PaymentStatusDisplay'

export default function PaymentStatusChecker({ depositId }) {
  const [status, setStatus] = useState(null)
  const [loading, setLoading] = useState(false)

  const checkStatus = async () => {
    setLoading(true)
    
    try {
      const response = await fetch('https://api.pawapay.io/v2/deposits/' + depositId, {
        headers: {
          'Authorization': 'Bearer YOUR_TOKEN'
        }
      })
      
      const data = await response.json()
      setStatus(data)
    } catch (error) {
      console.error('Erreur:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (depositId) {
      checkStatus()
    }
  }, [depositId])

  if (loading) {
    return <div>Vérification en cours...</div>
  }

  if (!status) {
    return <div>Aucun statut disponible</div>
  }

  return (
    <PaymentStatusDisplay
      status={status.data?.status}
      statusInfo={status.data?.status_info}
      amount={status.data?.amount}
      currency={status.data?.currency}
      transactionId={status.data?.depositId}
      providerTransactionId={status.data?.providerTransactionId}
      createdAt={status.data?.created}
    />
  )
}
```

## 🔧 Dépannage

### **Problème 1: Erreur 500 lors de la vérification de statut**

**Symptôme :**
```json
{
  "success": false,
  "error": {
    "failureCode": "UNKNOWN_ERROR",
    "failureMessage": "Unable to process request due to an unknown problem."
  }
}
```

**Solution :**
- Utiliser l'API directe Pawapay pour la vérification de statut
- Vérifier que le `deposit_id` est correct
- Attendre quelques minutes avant de réessayer

### **Problème 2: Erreur de format de téléphone**

**Symptôme :**
```json
{
  "failureCode": "INVALID_PAYER_FORMAT",
  "failureMessage": "Only numbers are accepted. No whitespaces, separators or prefixes like + or 0 are allowed"
}
```

**Solution :**
- Nettoyer le numéro de téléphone (supprimer +, espaces, tirets)
- S'assurer que le préfixe pays est inclus
- Vérifier le format selon le pays

### **Problème 3: Solde insuffisant**

**Symptôme :**
```json
{
  "failureCode": "INSUFFICIENT_BALANCE",
  "failureMessage": "The customer does not have enough funds to complete the payment."
}
```

**Solution :**
- Informer le client de recharger son compte
- Proposer un montant inférieur
- Suggérer une autre méthode de paiement

## 📞 Support

Pour toute question ou problème :

1. **Vérifier les logs Laravel** : `storage/logs/laravel.log`
2. **Tester l'API directe Pawapay** : Utiliser les exemples curl
3. **Consulter la documentation Pawapay** : https://docs.pawapay.io
4. **Contacter le support** : support@pawapay.io

## 🎉 Conclusion

L'intégration Pawapay est maintenant complète et prête pour la production. Elle supporte :

- ✅ Création de paiements pour tous les pays supportés
- ✅ Vérification de statuts en temps réel
- ✅ Gestion robuste des erreurs
- ✅ Interface utilisateur moderne
- ✅ Documentation complète

**L'intégration est prête pour la production ! 🚀** 