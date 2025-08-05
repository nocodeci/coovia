# 🌊 Configuration Wave CI - Paydunya SOFTPAY

## 📋 **Vue d'ensemble**

Configuration de l'intégration Wave CI pour les paiements mobiles en Côte d'Ivoire via l'API Paydunya SOFTPAY.

## 🔗 **Endpoint API**

```
POST https://app.paydunya.com/api/v1/softpay/wave-ci
```

## 📊 **Format des Données**

### **Headers Requis**
```http
Content-Type: application/json
PAYDUNYA-MASTER-KEY: your_master_key
PAYDUNYA-PRIVATE-KEY: your_private_key
PAYDUNYA-TOKEN: your_token
```

### **Payload Attendu**
```json
{
  "phone_number": "0703324674",
  "payment_token": "token_from_invoice",
  "customer_name": "John Doe",
  "customer_email": "john@example.com"
}
```

## 🚀 **Intégration Backend**

### **1. Service PaydunyaOfficialService**

```php
/**
 * Paiement SOFTPAY Wave CI
 * Utilise l'endpoint: https://app.paydunya.com/api/v1/softpay/wave-ci
 */
public function processWaveCISoftpay(array $data): array
{
    // Créer d'abord une facture pour obtenir le token
    $invoiceResult = $this->createWaveCIInvoice($data);
    
    if (!$invoiceResult['success']) {
        return $invoiceResult;
    }

    $paymentToken = $invoiceResult['token'];

    // Préparer les données pour l'API SOFTPAY Wave CI
    $softpayData = [
        'phone_number' => $data['phoneNumber'] ?? '',
        'payment_token' => $paymentToken,
        'customer_name' => $data['customerName'] ?? '',
        'customer_email' => $data['customerEmail'] ?? ''
    ];

    // Appel à l'API SOFTPAY Wave CI
    $response = Http::withHeaders([
        'Content-Type' => 'application/json',
        'PAYDUNYA-MASTER-KEY' => $this->config['master_key'],
        'PAYDUNYA-PRIVATE-KEY' => $this->config['private_key'],
        'PAYDUNYA-TOKEN' => $this->config['token'],
    ])->post('https://app.paydunya.com/api/v1/softpay/wave-ci', $softpayData);

    return $this->processResponse($response, $paymentToken, $invoiceResult['url']);
}
```

### **2. Contrôleur PaymentController**

```php
/**
 * Gérer le paiement SOFTPAY Wave CI
 */
public function handleWaveCIPayment(Request $request): JsonResponse
{
    $validatedData = $request->validate([
        'phone_number' => 'required|string|min:10',
        'payment_token' => 'required|string',
        'customer_name' => 'required|string',
        'customer_email' => 'required|email',
    ]);

    $payload = [
        "phone_number" => $validatedData['phone_number'],
        "payment_token" => $validatedData['payment_token'],
        "customer_name" => $validatedData['customer_name'],
        "customer_email" => $validatedData['customer_email']
    ];

    // Appel à l'API Paydunya
    $response = Http::withHeaders([
        'Content-Type' => 'application/json',
        'PAYDUNYA-MASTER-KEY' => config('paydunya.master_key'),
        'PAYDUNYA-PRIVATE-KEY' => config('paydunya.private_key'),
        'PAYDUNYA-TOKEN' => config('paydunya.token'),
    ])->post('https://app.paydunya.com/api/v1/softpay/wave-ci', $payload);

    return $this->processPaydunyaResponse($response);
}
```

### **3. Route API**

```php
// Route SOFTPAY Wave CI
Route::post('/process-wave-ci-payment', [PaymentController::class, 'handleWaveCIPayment']);
```

## 🎨 **Interface Frontend**

### **Composant WaveCIForm**

```tsx
const WaveCIForm: React.FC<WaveCIFormProps> = ({
  paymentToken,
  customerName,
  customerEmail,
  amount,
  currency,
  onSuccess,
  onError
}) => {
  const handleSubmit = async (event: React.FormEvent) => {
    const response = await axios.post('/api/process-wave-ci-payment', {
      phone_number: phone,
      payment_token: paymentToken,
      customer_name: customerName,
      customer_email: customerEmail
    });
  };
};
```

## 🔧 **Configuration Environnement**

### **Variables d'Environnement**

```env
PAYDUNYA_ENVIRONMENT=live
PAYDUNYA_MASTER_KEY=your_master_key
PAYDUNYA_PRIVATE_KEY=your_private_key
PAYDUNYA_PUBLIC_KEY=your_public_key
PAYDUNYA_TOKEN=your_token
```

### **Configuration Laravel**

```php
// config/paydunya.php
return [
    'environment' => env('PAYDUNYA_ENVIRONMENT', 'test'),
    'master_key' => env('PAYDUNYA_MASTER_KEY'),
    'private_key' => env('PAYDUNYA_PRIVATE_KEY'),
    'public_key' => env('PAYDUNYA_PUBLIC_KEY'),
    'token' => env('PAYDUNYA_TOKEN'),
];
```

## 🧪 **Tests**

### **Test de Création de Facture**

```bash
curl -X POST http://localhost:8000/api/payment/initialize \
  -H "Content-Type: application/json" \
  -d '{
    "storeId": "test-store",
    "productId": "test-product-123",
    "productName": "Produit de Test",
    "amount": 5000,
    "currency": "XOF",
    "customer": {
      "email": "test@example.com",
      "firstName": "Test",
      "lastName": "User",
      "phone": "+2250703324674"
    },
    "paymentMethod": "wave-ci",
    "paymentCountry": "Côte d'\''Ivoire"
  }'
```

### **Test de Paiement Wave CI**

```bash
curl -X POST http://localhost:8000/api/process-wave-ci-payment \
  -H "Content-Type: application/json" \
  -d '{
    "phone_number": "0703324674",
    "payment_token": "token_from_invoice",
    "customer_name": "Test User",
    "customer_email": "test@example.com"
  }'
```

## 📱 **Instructions Utilisateur**

### **Pour Wave CI**
1. Assurez-vous d'avoir l'application Wave installée
2. Vérifiez que votre compte Wave a suffisamment de fonds
3. Entrez votre numéro de téléphone Wave
4. Une notification s'affichera sur votre téléphone
5. Confirmez le paiement dans l'application Wave

## 🚨 **Gestion d'Erreurs**

### **Erreurs Communes**

1. **"Votre requete est malformée"**
   - Vérifiez le format des données envoyées
   - Assurez-vous que tous les champs requis sont présents

2. **"Token invalide"**
   - Vérifiez que le token de paiement est valide
   - Assurez-vous que la facture a été créée correctement

3. **"Numéro de téléphone invalide"**
   - Vérifiez le format du numéro (+225XXXXXXXX)
   - Assurez-vous que le numéro est actif

### **Logs de Débogage**

```php
Log::info('Wave CI Payment', [
    'payload' => $payload,
    'response' => $response->json()
]);
```

## 📊 **Monitoring**

### **Métriques à Surveiller**
- Taux de succès des paiements Wave CI
- Temps de réponse de l'API
- Erreurs par type
- Volume de transactions

### **Alertes**
- Échecs de paiement > 5%
- Temps de réponse > 10 secondes
- Erreurs d'authentification

## 🔄 **Mise à Jour**

### **Versions API**
- **v1** : Version actuelle
- **v2** : Version future (si disponible)

### **Changements de Format**
- Surveillez les changements dans la documentation Paydunya
- Testez les nouvelles versions en environnement de développement
- Mettez à jour les formats de données si nécessaire

---

**🌊 Configuration Wave CI terminée et prête pour la production !** 