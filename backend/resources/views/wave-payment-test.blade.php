<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Test Paiement Wave CI</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 600px;
            margin: 50px auto;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .container {
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        h1 {
            color: #333;
            text-align: center;
            margin-bottom: 30px;
        }
        .form-group {
            margin-bottom: 20px;
        }
        label {
            display: block;
            margin-bottom: 5px;
            font-weight: bold;
            color: #555;
        }
        input[type="text"], input[type="email"], input[type="number"] {
            width: 100%;
            padding: 12px;
            border: 1px solid #ddd;
            border-radius: 5px;
            font-size: 16px;
            box-sizing: border-box;
        }
        button {
            width: 100%;
            padding: 15px;
            background-color: #007bff;
            color: white;
            border: none;
            border-radius: 5px;
            font-size: 16px;
            cursor: pointer;
            transition: background-color 0.3s;
        }
        button:hover {
            background-color: #0056b3;
        }
        .alert {
            padding: 15px;
            margin-bottom: 20px;
            border-radius: 5px;
        }
        .alert-success {
            background-color: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
        }
        .alert-error {
            background-color: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🧪 Test Paiement Wave CI</h1>
        
        @if(session('error'))
            <div class="alert alert-error">
                {{ session('error') }}
            </div>
        @endif

        @if(session('success'))
            <div class="alert alert-success">
                {{ session('success') }}
            </div>
        @endif

        <form method="POST" action="{{ route('payment.initiate.wave_ci') }}">
            @csrf
            
            <div class="form-group">
                <label for="name">Nom complet *</label>
                <input type="text" id="name" name="name" value="{{ old('name', 'yohan eric * Payd') }}" required>
            </div>

            <div class="form-group">
                <label for="email">Email *</label>
                <input type="email" id="email" name="email" value="{{ old('email', 'test@example.com') }}" required>
            </div>

            <div class="form-group">
                <label for="phone">Numéro de téléphone Wave *</label>
                <input type="text" id="phone" name="phone" value="{{ old('phone', '0123456789') }}" required>
            </div>

            <div class="form-group">
                <label for="amount">Montant (XOF) *</label>
                <input type="number" id="amount" name="amount" value="{{ old('amount', '9800') }}" min="100" required>
            </div>

            <div class="form-group">
                <label for="description">Description</label>
                <input type="text" id="description" name="description" value="{{ old('description', 'Test paiement Wave CI') }}">
            </div>

            <button type="submit">🚀 Initier le paiement Wave CI</button>
        </form>

        <div style="margin-top: 30px; padding: 20px; background-color: #f8f9fa; border-radius: 5px;">
            <h3>📋 Instructions de test :</h3>
            <ol>
                <li>Remplissez le formulaire avec vos informations</li>
                <li>Cliquez sur "Initier le paiement Wave CI"</li>
                <li>Vous serez redirigé vers l'URL Wave personnalisée</li>
                <li>Testez le processus de paiement sur Wave</li>
            </ol>
            
            <h3>🔍 URL de test attendue :</h3>
            <code>https://pay.wave.com/c/cos-[ID]?a=[MONTANT]&c=XOF&m=[NOM_CLIENT]</code>
        </div>
    </div>
</body>
</html>
