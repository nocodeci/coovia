<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class MailtrapService
{
    private $apiToken;
    private $apiUrl;
    private $fromEmail;
    private $fromName;

    public function __construct()
    {
        // Utiliser la configuration dédiée Mailtrap
        $this->apiToken = config('mailtrap.api_token');
        $this->apiUrl = config('mailtrap.api_url');
        $this->fromEmail = config('mailtrap.from_email');
        $this->fromName = config('mailtrap.from_name');
    }

    /**
     * Envoyer un email via l'API Mailtrap
     */
    public function sendEmail($to, $subject, $htmlContent, $fromEmail = null, $fromName = null)
    {
        try {
            $fromEmail = $fromEmail ?? $this->fromEmail;
            $fromName = $fromName ?? $this->fromName;

            $payload = [
                'from' => [
                    'email' => $fromEmail,
                    'name' => $fromName
                ],
                'to' => [
                    [
                        'email' => $to
                    ]
                ],
                'subject' => $subject,
                'html' => $htmlContent,
                'category' => 'OTP Verification'
            ];

            Log::info("Tentative d'envoi d'email via Mailtrap API", [
                'to' => $to,
                'subject' => $subject,
                'token' => substr($this->apiToken, 0, 8) . '...',
                'url' => $this->apiUrl
            ]);

            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->apiToken,
                'Content-Type' => 'application/json',
            ])->post($this->apiUrl, $payload);

            Log::info("Réponse Mailtrap API", [
                'status' => $response->status(),
                'body' => $response->body()
            ]);

            if ($response->successful()) {
                Log::info("Email envoyé avec succès à {$to} via Mailtrap API");
                return true;
            } else {
                Log::error("Erreur Mailtrap API", [
                    'status' => $response->status(),
                    'body' => $response->body(),
                    'headers' => $response->headers()
                ]);
                return false;
            }

        } catch (\Exception $e) {
            Log::error("Erreur lors de l'envoi d'email via Mailtrap", [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return false;
        }
    }

    /**
     * Envoyer un email OTP
     */
    public function sendOtpEmail($to, $otp)
    {
        $subject = 'Code de vérification Coovia';
        
        // Générer le contenu HTML de l'email
        $htmlContent = view('emails.otp', [
            'otp' => $otp,
            'userEmail' => $to
        ])->render();

        return $this->sendEmail($to, $subject, $htmlContent);
    }
}
