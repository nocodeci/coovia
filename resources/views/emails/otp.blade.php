<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Code de vérification Wozif</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 600;
        }
        .content {
            padding: 40px 30px;
            text-align: center;
        }
        .otp-code {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            font-size: 32px;
            font-weight: bold;
            padding: 20px;
            border-radius: 10px;
            margin: 30px 0;
            letter-spacing: 8px;
            display: inline-block;
            min-width: 200px;
        }
        .message {
            font-size: 16px;
            color: #666;
            margin-bottom: 20px;
        }
        .warning {
            background-color: #fff3cd;
            border: 1px solid #ffeaa7;
            border-radius: 5px;
            padding: 15px;
            margin: 20px 0;
            color: #856404;
        }
        .footer {
            background-color: #f8f9fa;
            padding: 20px 30px;
            text-align: center;
            color: #666;
            font-size: 14px;
        }
        .logo {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 10px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">🛒 Wozif</div>
            <h1>Code de vérification</h1>
        </div>
        
        <div class="content">
            <p class="message">
                Bonjour !<br>
                Vous avez demandé un code de vérification pour votre compte Wozif.
            </p>
            
            <div class="otp-code">
                {{ $otp }}
            </div>
            
            <p class="message">
                Ce code est valable pendant 5 minutes.<br>
                Si vous n'avez pas demandé ce code, ignorez cet email.
            </p>
            
            <div class="warning">
                <strong>⚠️ Sécurité :</strong><br>
                Ne partagez jamais ce code avec qui que ce soit.<br>
                L'équipe Wozif ne vous demandera jamais votre code de vérification.
            </div>
        </div>
        
        <div class="footer">
            <p>
                Cet email a été envoyé à <strong>{{ $userEmail }}</strong><br>
                © {{ date('Y') }} Wozif. Tous droits réservés.
            </p>
        </div>
    </div>
</body>
</html>
