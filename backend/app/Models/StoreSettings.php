<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Cache;

class StoreSettings extends Model
{
    use HasFactory;

    protected $fillable = [
        'store_id',
        'key',
        'value',
        'type',
        'group',
        'description',
    ];

    /**
     * Get the store that owns the settings.
     */
    public function store(): BelongsTo
    {
        return $this->belongsTo(Store::class);
    }

    /**
     * Get a store setting value by key
     */
    public static function get($storeId, $key, $default = null)
    {
        $cacheKey = "store_setting_{$storeId}_{$key}";
        
        return Cache::remember($cacheKey, 3600, function () use ($storeId, $key, $default) {
            $setting = self::where('store_id', $storeId)
                          ->where('key', $key)
                          ->first();
            
            if (!$setting) {
                return $default;
            }
            
            return self::castValue($setting->value, $setting->type);
        });
    }

    /**
     * Set a store setting value
     */
    public static function set($storeId, $key, $value, $type = 'string', $group = 'general', $description = null)
    {
        $setting = self::updateOrCreate(
            ['store_id' => $storeId, 'key' => $key],
            [
                'value' => $value,
                'type' => $type,
                'group' => $group,
                'description' => $description,
            ]
        );
        
        // Clear cache
        Cache::forget("store_setting_{$storeId}_{$key}");
        
        return $setting;
    }

    /**
     * Get all store settings by group
     */
    public static function getByGroup($storeId, $group)
    {
        return self::where('store_id', $storeId)
                  ->where('group', $group)
                  ->get()
                  ->mapWithKeys(function ($setting) {
                      return [$setting->key => self::castValue($setting->value, $setting->type)];
                  });
    }

    /**
     * Get all store settings
     */
    public static function getAll($storeId)
    {
        return self::where('store_id', $storeId)
                  ->get()
                  ->mapWithKeys(function ($setting) {
                      return [$setting->key => self::castValue($setting->value, $setting->type)];
                  });
    }

    /**
     * Delete a store setting
     */
    public static function delete($storeId, $key)
    {
        $setting = self::where('store_id', $storeId)
                      ->where('key', $key)
                      ->first();
        
        if ($setting) {
            $setting->delete();
            Cache::forget("store_setting_{$storeId}_{$key}");
        }
        
        return $setting;
    }

    /**
     * Cast value based on type
     */
    private static function castValue($value, $type)
    {
        if ($value === null) {
            return null;
        }

        switch ($type) {
            case 'boolean':
                return filter_var($value, FILTER_VALIDATE_BOOLEAN);
            case 'integer':
                return (int) $value;
            case 'float':
                return (float) $value;
            case 'json':
            case 'array':
                return json_decode($value, true);
            default:
                return $value;
        }
    }

    /**
     * Clear all store settings cache
     */
    public static function clearCache($storeId = null)
    {
        if ($storeId) {
            $settings = self::where('store_id', $storeId)->get();
        } else {
            $settings = self::all();
        }
        
        foreach ($settings as $setting) {
            Cache::forget("store_setting_{$setting->store_id}_{$setting->key}");
        }
    }

    /**
     * Get default store settings
     */
    public static function getDefaults(): array
    {
        return [
            // General settings
            'store_name' => ['value' => '', 'type' => 'string', 'group' => 'general'],
            'store_description' => ['value' => '', 'type' => 'string', 'group' => 'general'],
            'store_logo' => ['value' => '', 'type' => 'string', 'group' => 'general'],
            'store_banner' => ['value' => '', 'type' => 'string', 'group' => 'general'],
            'store_theme' => ['value' => 'default', 'type' => 'string', 'group' => 'general'],
            'store_currency' => ['value' => 'XOF', 'type' => 'string', 'group' => 'general'],
            'store_language' => ['value' => 'fr', 'type' => 'string', 'group' => 'general'],
            'store_timezone' => ['value' => 'Africa/Abidjan', 'type' => 'string', 'group' => 'general'],
            
            // Payment settings
            'payment_methods' => ['value' => '["orange_money", "moov_money", "mtn_money"]', 'type' => 'json', 'group' => 'payment'],
            'payment_currency' => ['value' => 'XOF', 'type' => 'string', 'group' => 'payment'],
            'payment_auto_capture' => ['value' => 'true', 'type' => 'boolean', 'group' => 'payment'],
            'payment_webhook_url' => ['value' => '', 'type' => 'string', 'group' => 'payment'],
            
            // Shipping settings
            'shipping_enabled' => ['value' => 'false', 'type' => 'boolean', 'group' => 'shipping'],
            'shipping_methods' => ['value' => '[]', 'type' => 'json', 'group' => 'shipping'],
            'shipping_free_threshold' => ['value' => '0', 'type' => 'integer', 'group' => 'shipping'],
            'shipping_default_cost' => ['value' => '0', 'type' => 'integer', 'group' => 'shipping'],
            
            // Notification settings
            'notifications_email' => ['value' => 'true', 'type' => 'boolean', 'group' => 'notifications'],
            'notifications_sms' => ['value' => 'false', 'type' => 'boolean', 'group' => 'notifications'],
            'notifications_push' => ['value' => 'true', 'type' => 'boolean', 'group' => 'notifications'],
            'notifications_new_order' => ['value' => 'true', 'type' => 'boolean', 'group' => 'notifications'],
            'notifications_payment_received' => ['value' => 'true', 'type' => 'boolean', 'group' => 'notifications'],
            
            // Security settings
            'security_mfa_required' => ['value' => 'false', 'type' => 'boolean', 'group' => 'security'],
            'security_session_timeout' => ['value' => '3600', 'type' => 'integer', 'group' => 'security'],
            'security_max_login_attempts' => ['value' => '5', 'type' => 'integer', 'group' => 'security'],
            
            // SEO settings
            'seo_title' => ['value' => '', 'type' => 'string', 'group' => 'seo'],
            'seo_description' => ['value' => '', 'type' => 'string', 'group' => 'seo'],
            'seo_keywords' => ['value' => '', 'type' => 'string', 'group' => 'seo'],
            'seo_og_image' => ['value' => '', 'type' => 'string', 'group' => 'seo'],
        ];
    }

    /**
     * Initialize default settings for a store
     */
    public static function initializeDefaults($storeId): void
    {
        $defaults = self::getDefaults();
        
        foreach ($defaults as $key => $setting) {
            self::set(
                $storeId,
                $key,
                $setting['value'],
                $setting['type'],
                $setting['group'],
                "Default setting for {$key}"
            );
        }
    }
}
