<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Store;
use App\Models\User;

class CreateNewBoutiqueSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Créer un utilisateur de test s'il n'existe pas
        $user = User::firstOrCreate(
            ['email' => 'test@coovia.com'],
            [
                'name' => 'Test User',
                'password' => bcrypt('password'),
                'email_verified_at' => now(),
            ]
        );

        // Créer une nouvelle boutique avec un slug spécifique
        $store = Store::firstOrCreate(
            ['slug' => 'ma-boutique'],
            [
                'name' => 'Ma Boutique Personnalisée',
                'description' => 'Une boutique personnalisée pour les tests',
                'owner_id' => $user->id,
                'status' => 'active',
                'category' => 'Général',
                'address' => json_encode([
                    'street' => '456 Avenue des Tests',
                    'city' => 'Lyon',
                    'postal_code' => '69001',
                    'country' => 'France'
                ]),
                'contact' => json_encode([
                    'email' => 'contact@ma-boutique.com',
                    'phone' => '+33 4 56 78 90 12'
                ]),
                'settings' => json_encode([
                    'currency' => 'EUR',
                    'language' => 'fr'
                ]),
            ]
        );

        $this->command->info('Nouvelle boutique créée avec succès !');
        $this->command->info('Store ID: ' . $store->id);
        $this->command->info('Store Slug: ' . $store->slug);
        $this->command->info('URL: http://localhost:3000/' . $store->slug);
    }
} 