<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Boutique créée avec succès</title>
    
    <!-- Métadonnées pour l'avatar de profil -->
    <meta property="og:image" content="<?php echo e(asset('images/wozif-avatar.svg')); ?>">
    <meta property="og:image:width" content="200">
    <meta property="og:image:height" content="200">
    <meta property="og:image:alt" content="Wozif Logo">
    
    <!-- Métadonnées pour les clients email -->
    <meta name="x-avatar" content="<?php echo e(asset('images/wozif-avatar.svg')); ?>">
    <meta name="x-profile-image" content="<?php echo e(asset('images/wozif-avatar.svg')); ?>">
    
    <!-- Métadonnées pour Gmail -->
    <meta name="google-site-verification" content="">
    <meta name="format-detection" content="telephone=no">
    
    <!-- Métadonnées pour Outlook -->
    <meta name="x-ua-compatible" content="IE=edge">
    <meta name="x-apple-disable-message-reformatting">
    
    <!-- Métadonnées pour Apple Mail -->
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black">
    
    <!-- Métadonnées pour l'avatar de profil -->
    <meta name="author" content="Wozif">
    <meta name="author-image" content="<?php echo e(asset('images/wozif-avatar.svg')); ?>">
    <meta name="sender-avatar" content="<?php echo e(asset('images/wozif-avatar.svg')); ?>">
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8f9fa;
        }
        .container {
            background-color: #ffffff;
            border-radius: 12px;
            padding: 40px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }

        .success-icon {
            font-size: 48px;
            margin-bottom: 20px;
        }
        .title {
            font-size: 24px;
            font-weight: bold;
            color: #059669;
            margin-bottom: 10px;
        }
        .subtitle {
            font-size: 16px;
            color: #6b7280;
            margin-bottom: 30px;
        }
        .store-info {
            background-color: #f0f9ff;
            border: 1px solid #0ea5e9;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 30px;
        }
        .store-name {
            font-size: 20px;
            font-weight: bold;
            color: #0c4a6e;
            margin-bottom: 10px;
        }
        .store-domain {
            font-size: 18px;
            color: #0369a1;
            margin-bottom: 15px;
            word-break: break-all;
        }
        .payment-methods {
            background-color: #fef3c7;
            border: 1px solid #f59e0b;
            border-radius: 8px;
            padding: 15px;
            margin-bottom: 30px;
        }
        .payment-title {
            font-weight: bold;
            color: #92400e;
            margin-bottom: 10px;
        }
        .payment-list {
            list-style: none;
            padding: 0;
            margin: 0;
        }
        .payment-item {
            display: inline-block;
            background-color: #fbbf24;
            color: #92400e;
            padding: 4px 12px;
            border-radius: 20px;
            margin: 2px;
            font-size: 14px;
            font-weight: 500;
        }
        .cta-button {
            display: inline-block;
            background-color: #2563eb;
            color: #ffffff;
            text-decoration: none;
            padding: 12px 24px;
            border-radius: 8px;
            font-weight: bold;
            margin: 20px 0;
        }
        .footer {
            text-align: center;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            color: #6b7280;
            font-size: 14px;
        }
        .highlight {
            background-color: #fef3c7;
            padding: 2px 6px;
            border-radius: 4px;
            font-weight: 500;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="success-icon">🎉</div>
            <div class="title">Boutique créée avec succès !</div>
            <div class="subtitle">Félicitations <?php echo e($userName); ?>, votre boutique est maintenant en ligne</div>
        </div>

        <div class="store-info">
            <div class="store-name"><?php echo e($storeName); ?></div>
            <div class="store-domain">🌐 <?php echo e($storeDomain); ?></div>
            <p>Votre boutique est accessible à l'adresse ci-dessus et prête à recevoir vos premiers clients !</p>
        </div>

        <div class="payment-methods">
            <div class="payment-title">💳 Méthodes de paiement configurées :</div>
            <ul class="payment-list">
                <?php if(in_array('wozif', $paymentMethods)): ?>
                    <li class="payment-item">Wozif (par défaut)</li>
                <?php endif; ?>
                <?php if(isset($paymentMethods['monneroo']) && $paymentMethods['monneroo']['enabled']): ?>
                    <li class="payment-item">Monneroo</li>
                <?php endif; ?>
            </ul>
        </div>

        <div style="text-align: center;">
            <a href="https://<?php echo e($storeDomain); ?>" class="cta-button">
                🚀 Accéder à ma boutique
            </a>
        </div>

        <div style="background-color: #f0fdf4; border: 1px solid #16a34a; border-radius: 8px; padding: 20px; margin: 30px 0;">
            <h3 style="color: #15803d; margin-top: 0;">📋 Prochaines étapes :</h3>
            <ul style="color: #166534; padding-left: 20px;">
                <li>Ajoutez vos premiers produits</li>
                <li>Personnalisez le design de votre boutique</li>
                <li>Configurez vos informations de livraison</li>
                <li>Testez le processus de paiement</li>
            </ul>
        </div>

        <div style="background-color: #fef2f2; border: 1px solid #dc2626; border-radius: 8px; padding: 15px; margin: 20px 0;">
            <p style="color: #991b1b; margin: 0; font-size: 14px;">
                <strong>🔒 Sécurité :</strong> Votre boutique est sécurisée avec des certificats SSL et des paiements cryptés.
            </p>
        </div>

        <div class="footer">
            <p>Merci d'avoir choisi <span class="highlight">Wozif</span> pour votre boutique en ligne !</p>
            <p>Si vous avez des questions, n'hésitez pas à nous contacter à support@wozif.store</p>
            <p style="font-size: 12px; margin-top: 20px;">
                Cet email a été envoyé automatiquement. Veuillez ne pas y répondre.
            </p>
        </div>
    </div>
</body>
</html>
<?php /**PATH /Users/koffiyohanerickouakou/Documents/wozif/backend/resources/views/emails/store-created.blade.php ENDPATH**/ ?>