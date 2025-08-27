<?php

namespace App\Services;

use App\Models\Settings;
use App\Models\StoreSettings;
use Illuminate\Support\Facades\Cache;

class SettingsService
{
    /**
     * Get a global setting value
     */
    public static function get(string $key, $default = null)
    {
        return Settings::get($key, $default);
    }

    /**
     * Set a global setting value
     */
    public static function set(string $key, $value, string $type = 'string', string $group = 'general', ?string $description = null, bool $isPublic = false)
    {
        return Settings::set($key, $value, $type, $group, $description, $isPublic);
    }

    /**
     * Get a store setting value
     */
    public static function getStoreSetting(string $storeId, string $key, $default = null)
    {
        return StoreSettings::get($storeId, $key, $default);
    }

    /**
     * Set a store setting value
     */
    public static function setStoreSetting(string $storeId, string $key, $value, string $type = 'string', string $group = 'general', ?string $description = null)
    {
        return StoreSettings::set($storeId, $key, $value, $type, $group, $description);
    }

    /**
     * Get all settings for a store
     */
    public static function getStoreSettings(string $storeId)
    {
        return StoreSettings::getAll($storeId);
    }

    /**
     * Get settings by group for a store
     */
    public static function getStoreSettingsByGroup(string $storeId, string $group)
    {
        return StoreSettings::getByGroup($storeId, $group);
    }

    /**
     * Initialize default settings for a store
     */
    public static function initializeStoreDefaults(string $storeId)
    {
        StoreSettings::initializeDefaults($storeId);
    }

    /**
     * Get application configuration
     */
    public static function getAppConfig(): array
    {
        return [
            'name' => self::get('app_name', 'Coovia'),
            'description' => self::get('app_description', 'Plateforme de vente de produits digitaux'),
            'logo' => self::get('app_logo', '/assets/images/logo.svg'),
            'favicon' => self::get('app_favicon', '/assets/images/favicon.ico'),
            'timezone' => self::get('app_timezone', 'Africa/Abidjan'),
            'locale' => self::get('app_locale', 'fr'),
            'currency' => self::get('app_currency', 'XOF'),
        ];
    }

    /**
     * Get payment configuration
     */
    public static function getPaymentConfig(): array
    {
        return [
            'gateways' => self::get('payment_gateways', ['orange_money', 'moov_money', 'mtn_money']),
            'currency' => self::get('payment_currency', 'XOF'),
            'auto_capture' => self::get('payment_auto_capture', true),
            'webhook_timeout' => self::get('payment_webhook_timeout', 30),
        ];
    }

    /**
     * Get email configuration
     */
    public static function getEmailConfig(): array
    {
        return [
            'from_name' => self::get('email_from_name', 'Coovia'),
            'from_address' => self::get('email_from_address', 'noreply@coovia.com'),
            'welcome_template' => self::get('email_welcome_template', 'emails.welcome'),
            'order_confirmation_template' => self::get('email_order_confirmation_template', 'emails.order-confirmation'),
        ];
    }

    /**
     * Get SMS configuration
     */
    public static function getSmsConfig(): array
    {
        return [
            'provider' => self::get('sms_provider', 'twilio'),
            'from_number' => self::get('sms_from_number', '+22500000000'),
        ];
    }

    /**
     * Get security configuration
     */
    public static function getSecurityConfig(): array
    {
        return [
            'password_min_length' => self::get('security_password_min_length', 8),
            'password_require_special' => self::get('security_password_require_special', true),
            'session_lifetime' => self::get('security_session_lifetime', 120),
            'max_login_attempts' => self::get('security_max_login_attempts', 5),
            'lockout_duration' => self::get('security_lockout_duration', 15),
        ];
    }

    /**
     * Get file upload configuration
     */
    public static function getFileConfig(): array
    {
        return [
            'max_size' => self::get('file_max_size', 10485760), // 10MB
            'allowed_types' => self::get('file_allowed_types', ['jpg', 'jpeg', 'png', 'gif', 'webp', 'pdf', 'doc', 'docx', 'txt', 'mp4', 'avi', 'mov']),
            'storage_disk' => self::get('file_storage_disk', 'cloudflare'),
        ];
    }

    /**
     * Get notification configuration
     */
    public static function getNotificationConfig(): array
    {
        return [
            'email_enabled' => self::get('notifications_email_enabled', true),
            'sms_enabled' => self::get('notifications_sms_enabled', false),
            'push_enabled' => self::get('notifications_push_enabled', true),
        ];
    }

    /**
     * Get SEO configuration
     */
    public static function getSeoConfig(): array
    {
        return [
            'default_title' => self::get('seo_default_title', 'Coovia - Vente de produits digitaux'),
            'default_description' => self::get('seo_default_description', 'Plateforme de vente de produits digitaux en Afrique de l\'Ouest'),
            'default_keywords' => self::get('seo_default_keywords', 'coovia, vente, produits digitaux, formation, logiciel, afrique'),
        ];
    }

    /**
     * Get store configuration
     */
    public static function getStoreConfig(string $storeId): array
    {
        return [
            'general' => self::getStoreSettingsByGroup($storeId, 'general'),
            'payment' => self::getStoreSettingsByGroup($storeId, 'payment'),
            'shipping' => self::getStoreSettingsByGroup($storeId, 'shipping'),
            'notifications' => self::getStoreSettingsByGroup($storeId, 'notifications'),
            'security' => self::getStoreSettingsByGroup($storeId, 'security'),
            'seo' => self::getStoreSettingsByGroup($storeId, 'seo'),
        ];
    }

    /**
     * Check if a feature is enabled
     */
    public static function isFeatureEnabled(string $feature): bool
    {
        return self::get("feature_{$feature}_enabled", false);
    }

    /**
     * Get feature configuration
     */
    public static function getFeatureConfig(string $feature): array
    {
        return self::get("feature_{$feature}_config", []);
    }

    /**
     * Clear all caches
     */
    public static function clearAllCaches(): void
    {
        Settings::clearCache();
        // Note: StoreSettings cache is cleared per store, not globally
    }

    /**
     * Get all public settings for frontend
     */
    public static function getPublicSettings(): array
    {
        return Settings::getPublic();
    }

    /**
     * Validate setting value based on type
     */
    public static function validateSettingValue($value, string $type): bool
    {
        switch ($type) {
            case 'string':
                return is_string($value);
            case 'integer':
                return is_numeric($value) && floor($value) == $value;
            case 'float':
                return is_numeric($value);
            case 'boolean':
                return is_bool($value) || in_array($value, ['true', 'false', '1', '0', 1, 0], true);
            case 'json':
            case 'array':
                return is_array($value) || (is_string($value) && json_decode($value) !== null);
            default:
                return true;
        }
    }

    /**
     * Format setting value for storage
     */
    public static function formatSettingValue($value, string $type)
    {
        switch ($type) {
            case 'boolean':
                return is_bool($value) ? $value : filter_var($value, FILTER_VALIDATE_BOOLEAN);
            case 'integer':
                return (int) $value;
            case 'float':
                return (float) $value;
            case 'json':
            case 'array':
                return is_array($value) ? json_encode($value) : $value;
            default:
                return (string) $value;
        }
    }
}
