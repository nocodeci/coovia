<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Settings;

class SettingsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $settings = [
            // Paramètres généraux
            [
                'key' => 'app_name',
                'value' => 'Coovia',
                'type' => 'string',
                'group' => 'general',
                'description' => 'Nom de l\'application',
                'is_public' => true,
            ],
            [
                'key' => 'app_description',
                'value' => 'Plateforme de vente de produits digitaux en Afrique de l\'Ouest',
                'type' => 'string',
                'group' => 'general',
                'description' => 'Description de l\'application',
                'is_public' => true,
            ],
            [
                'key' => 'app_logo',
                'value' => '/assets/images/logo.svg',
                'type' => 'string',
                'group' => 'general',
                'description' => 'Logo de l\'application',
                'is_public' => true,
            ],
            [
                'key' => 'app_favicon',
                'value' => '/assets/images/favicon.ico',
                'type' => 'string',
                'group' => 'general',
                'description' => 'Favicon de l\'application',
                'is_public' => true,
            ],
            [
                'key' => 'app_timezone',
                'value' => 'Africa/Abidjan',
                'type' => 'string',
                'group' => 'general',
                'description' => 'Fuseau horaire par défaut',
                'is_public' => false,
            ],
            [
                'key' => 'app_locale',
                'value' => 'fr',
                'type' => 'string',
                'group' => 'general',
                'description' => 'Langue par défaut',
                'is_public' => false,
            ],
            [
                'key' => 'app_currency',
                'value' => 'XOF',
                'type' => 'string',
                'group' => 'general',
                'description' => 'Devise par défaut',
                'is_public' => false,
            ],

            // Paramètres de paiement
            [
                'key' => 'payment_gateways',
                'value' => json_encode(['orange_money', 'moov_money', 'mtn_money', 'wave', 'free_money']),
                'type' => 'json',
                'group' => 'payment',
                'description' => 'Passerelles de paiement disponibles',
                'is_public' => true,
            ],
            [
                'key' => 'payment_currency',
                'value' => 'XOF',
                'type' => 'string',
                'group' => 'payment',
                'description' => 'Devise de paiement par défaut',
                'is_public' => false,
            ],
            [
                'key' => 'payment_auto_capture',
                'value' => 'true',
                'type' => 'boolean',
                'group' => 'payment',
                'description' => 'Capture automatique des paiements',
                'is_public' => false,
            ],
            [
                'key' => 'payment_webhook_timeout',
                'value' => '30',
                'type' => 'integer',
                'group' => 'payment',
                'description' => 'Timeout des webhooks de paiement (secondes)',
                'is_public' => false,
            ],

            // Paramètres d'email
            [
                'key' => 'email_from_name',
                'value' => 'Coovia',
                'type' => 'string',
                'group' => 'email',
                'description' => 'Nom de l\'expéditeur des emails',
                'is_public' => false,
            ],
            [
                'key' => 'email_from_address',
                'value' => 'noreply@coovia.com',
                'type' => 'string',
                'group' => 'email',
                'description' => 'Adresse email de l\'expéditeur',
                'is_public' => false,
            ],
            [
                'key' => 'email_welcome_template',
                'value' => 'emails.welcome',
                'type' => 'string',
                'group' => 'email',
                'description' => 'Template d\'email de bienvenue',
                'is_public' => false,
            ],
            [
                'key' => 'email_order_confirmation_template',
                'value' => 'emails.order-confirmation',
                'type' => 'string',
                'group' => 'email',
                'description' => 'Template d\'email de confirmation de commande',
                'is_public' => false,
            ],

            // Paramètres SMS
            [
                'key' => 'sms_provider',
                'value' => 'twilio',
                'type' => 'string',
                'group' => 'sms',
                'description' => 'Fournisseur SMS par défaut',
                'is_public' => false,
            ],
            [
                'key' => 'sms_from_number',
                'value' => '+22500000000',
                'type' => 'string',
                'group' => 'sms',
                'description' => 'Numéro d\'envoi SMS par défaut',
                'is_public' => false,
            ],

            // Paramètres de sécurité
            [
                'key' => 'security_password_min_length',
                'value' => '8',
                'type' => 'integer',
                'group' => 'security',
                'description' => 'Longueur minimale des mots de passe',
                'is_public' => false,
            ],
            [
                'key' => 'security_password_require_special',
                'value' => 'true',
                'type' => 'boolean',
                'group' => 'security',
                'description' => 'Exiger des caractères spéciaux dans les mots de passe',
                'is_public' => false,
            ],
            [
                'key' => 'security_session_lifetime',
                'value' => '120',
                'type' => 'integer',
                'group' => 'security',
                'description' => 'Durée de vie des sessions (minutes)',
                'is_public' => false,
            ],
            [
                'key' => 'security_max_login_attempts',
                'value' => '5',
                'type' => 'integer',
                'group' => 'security',
                'description' => 'Nombre maximum de tentatives de connexion',
                'is_public' => false,
            ],
            [
                'key' => 'security_lockout_duration',
                'value' => '15',
                'type' => 'integer',
                'group' => 'security',
                'description' => 'Durée de verrouillage après échec (minutes)',
                'is_public' => false,
            ],

            // Paramètres de fichiers
            [
                'key' => 'file_max_size',
                'value' => '10485760',
                'type' => 'integer',
                'group' => 'files',
                'description' => 'Taille maximale des fichiers (10MB)',
                'is_public' => false,
            ],
            [
                'key' => 'file_allowed_types',
                'value' => json_encode(['jpg', 'jpeg', 'png', 'gif', 'webp', 'pdf', 'doc', 'docx', 'txt', 'mp4', 'avi', 'mov']),
                'type' => 'json',
                'group' => 'files',
                'description' => 'Types de fichiers autorisés',
                'is_public' => false,
            ],
            [
                'key' => 'file_storage_disk',
                'value' => 'cloudflare',
                'type' => 'string',
                'group' => 'files',
                'description' => 'Disque de stockage par défaut',
                'is_public' => false,
            ],

            // Paramètres de notifications
            [
                'key' => 'notifications_email_enabled',
                'value' => 'true',
                'type' => 'boolean',
                'group' => 'notifications',
                'description' => 'Activer les notifications par email',
                'is_public' => false,
            ],
            [
                'key' => 'notifications_sms_enabled',
                'value' => 'false',
                'type' => 'boolean',
                'group' => 'notifications',
                'description' => 'Activer les notifications par SMS',
                'is_public' => false,
            ],
            [
                'key' => 'notifications_push_enabled',
                'value' => 'true',
                'type' => 'boolean',
                'group' => 'notifications',
                'description' => 'Activer les notifications push',
                'is_public' => false,
            ],

            // Paramètres SEO
            [
                'key' => 'seo_default_title',
                'value' => 'Coovia - Vente de produits digitaux',
                'type' => 'string',
                'group' => 'seo',
                'description' => 'Titre SEO par défaut',
                'is_public' => true,
            ],
            [
                'key' => 'seo_default_description',
                'value' => 'Plateforme de vente de produits digitaux en Afrique de l\'Ouest. Formations, logiciels, contenus et plus encore.',
                'type' => 'string',
                'group' => 'seo',
                'description' => 'Description SEO par défaut',
                'is_public' => true,
            ],
            [
                'key' => 'seo_default_keywords',
                'value' => 'coovia, vente, produits digitaux, formation, logiciel, afrique, côte d\'ivoire',
                'type' => 'string',
                'group' => 'seo',
                'description' => 'Mots-clés SEO par défaut',
                'is_public' => true,
            ],
        ];

        foreach ($settings as $setting) {
            Settings::set(
                $setting['key'],
                $setting['value'],
                $setting['type'],
                $setting['group'],
                $setting['description'],
                $setting['is_public']
            );
        }
    }
}
