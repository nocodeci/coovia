<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Moneroo API Configuration
    |--------------------------------------------------------------------------
    |
    | Here you can configure your Moneroo API settings.
    |
    */

    'api_key' => env('MONEROO_API_KEY'),
    'secret_key' => env('MONEROO_SECRET_KEY'),
    'webhook_secret' => env('MONEROO_WEBHOOK_SECRET', 'your_webhook_signing_secret'),
    'environment' => env('MONEROO_ENVIRONMENT', 'sandbox'), // sandbox or live
]; 