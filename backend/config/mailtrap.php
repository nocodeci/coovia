<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Mailtrap API Configuration
    |--------------------------------------------------------------------------
    |
    | Configuration pour l'API Mailtrap
    |
    */

    'api_token' => env('MAILTRAP_API_TOKEN', '783efa0e0035c91f3f2eddc1d6ac6bd7'),
    'api_url' => env('MAILTRAP_API_URL', 'https://send.api.mailtrap.io/api/send'),
    'from_email' => env('MAIL_FROM_ADDRESS', 'noreply@coovia.com'),
    'from_name' => env('MAIL_FROM_NAME', 'Wozif'),
];
