<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class StoreCreatedMail extends Mailable
{
    use Queueable, SerializesModels;

    public $storeName;
    public $storeSlug;
    public $storeDomain;
    public $paymentMethods;
    public $userName;

    /**
     * Create a new message instance.
     */
    public function __construct($storeName, $storeSlug, $paymentMethods, $userName)
    {
        $this->storeName = $storeName;
        $this->storeSlug = $storeSlug;
        $this->storeDomain = $storeSlug . '.wozif.store';
        $this->paymentMethods = $paymentMethods;
        $this->userName = $userName;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: '🎉 Votre boutique a été créée avec succès !',
            from: new \Illuminate\Mail\Mailables\Address(
                config('mail.from.address'),
                config('mail.from.name')
            ),
        );
    }



    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.store-created',
            with: [
                'storeName' => $this->storeName,
                'storeSlug' => $this->storeSlug,
                'storeDomain' => $this->storeDomain,
                'paymentMethods' => $this->paymentMethods,
                'userName' => $this->userName,
            ],
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
