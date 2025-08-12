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

    'api_token' => env('MAILTRAP_API_TOKEN', 'YOUR_MAILTRAP_API_TOKEN'),
    'api_url' => env('MAILTRAP_API_URL', 'https://send.api.mailtrap.io/api/send'),
    'from_email' => env('MAIL_FROM_ADDRESS', 'noreply@coovia.com'),
    'from_name' => env('MAIL_FROM_NAME', 'Wozif'),
];
