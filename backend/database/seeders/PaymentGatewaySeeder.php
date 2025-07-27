<?php

namespace Database\Seeders;

use App\Models\PaymentGateway;
use App\Models\PaymentMethod;
use Illuminate\Database\Seeder;

class PaymentGatewaySeeder extends Seeder
{
    public function run(): void
    {
        // PayDunya
        $paydunya = PaymentGateway::updateOrCreate(
            ['type' => 'paydunya'],
            [
                'name' => 'PayDunya',
                'type' => 'paydunya',
                'country' => 'Multi-pays',
                'country_code' => 'MULTI',
                'logo' => '/images/gateways/paydunya.png',
                'is_active' => true,
            ]
        );

        $paydunya->paymentMethods()->delete(); // Supprimer les anciennes méthodes
        $paydunya->paymentMethods()->createMany([
            [
                'name' => 'Orange Money CI',
                'type' => 'mobile-money',
                'country' => 'Côte d\'Ivoire',
                'country_code' => 'CI',
                'provider' => 'Orange',
                'details' => 'Paiement mobile Orange Money Côte d\'Ivoire',
                'logo' => '/images/orange-money.jpg',
                'is_active' => true,
            ],
            [
                'name' => 'Orange Money Sénégal',
                'type' => 'mobile-money',
                'country' => 'Sénégal',
                'country_code' => 'SN',
                'provider' => 'Orange',
                'details' => 'Paiement mobile Orange Money Sénégal',
                'logo' => '/images/orange-money.jpg',
                'is_active' => true,
            ],
            [
                'name' => 'MTN Mobile Money CI',
                'type' => 'mobile-money',
                'country' => 'Côte d\'Ivoire',
                'country_code' => 'CI',
                'provider' => 'MTN',
                'details' => 'Paiement mobile MTN Money Côte d\'Ivoire',
                'logo' => '/images/mtn-money.jpg',
                'is_active' => true,
            ],
        ]);

        // FedaPay
        $fedapay = PaymentGateway::updateOrCreate(
            ['type' => 'fedapay'],
            [
                'name' => 'FedaPay',
                'type' => 'fedapay',
                'country' => 'Bénin',
                'country_code' => 'BJ',
                'logo' => '/images/gateways/fedapay.png',
                'is_active' => true,
            ]
        );

        $fedapay->paymentMethods()->delete();
        $fedapay->paymentMethods()->createMany([
            [
                'name' => 'MTN Mobile Money Bénin',
                'type' => 'mobile-money',
                'country' => 'Bénin',
                'country_code' => 'BJ',
                'provider' => 'MTN',
                'details' => 'Paiement mobile MTN Money Bénin',
                'logo' => '/images/mtn-money.jpg',
                'is_active' => true,
            ],
            [
                'name' => 'Moov Money Bénin',
                'type' => 'mobile-money',
                'country' => 'Bénin',
                'country_code' => 'BJ',
                'provider' => 'Moov',
                'details' => 'Paiement mobile Moov Money Bénin',
                'logo' => '/images/moov-money.jpg',
                'is_active' => true,
            ],
        ]);

        // Paystack
        $paystack = PaymentGateway::updateOrCreate(
            ['type' => 'paystack'],
            [
                'name' => 'Paystack',
                'type' => 'paystack',
                'country' => 'Nigeria',
                'country_code' => 'NG',
                'logo' => '/images/gateways/paystack.png',
                'is_active' => true,
            ]
        );

        $paystack->paymentMethods()->delete();
        $paystack->paymentMethods()->createMany([
            [
                'name' => 'Visa Card',
                'type' => 'card',
                'country' => 'Nigeria',
                'country_code' => 'NG',
                'provider' => 'Visa',
                'details' => 'Paiement par carte Visa',
                'logo' => '/images/visa.png',
                'is_active' => true,
            ],
            [
                'name' => 'MasterCard',
                'type' => 'card',
                'country' => 'Nigeria',
                'country_code' => 'NG',
                'provider' => 'MasterCard',
                'details' => 'Paiement par carte MasterCard',
                'logo' => '/images/mastercard.png',
                'is_active' => true,
            ],
        ]);
    }
}
