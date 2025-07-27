<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Créer des utilisateurs avec des mots de passe correctement hachés
        $users = [
            [
                'name' => 'Jean Kouassi',
                'email' => 'jean.kouassi@gmail.com',
                'password' => Hash::make('password123'),
                'phone' => '+225 07 12 34 56 78',
                'avatar' => '/avatars/jean.jpg',
                'is_active' => true,
                'email_verified_at' => now(),
            ],
            [
                'name' => 'Marie Diallo',
                'email' => 'marie.diallo@gmail.com',
                'password' => Hash::make('password123'),
                'phone' => '+221 77 123 45 67',
                'avatar' => '/avatars/marie.jpg',
                'is_active' => true,
                'email_verified_at' => now(),
            ],
            [
                'name' => 'Ibrahim Traoré',
                'email' => 'ibrahim.traore@gmail.com',
                'password' => Hash::make('password123'),
                'phone' => '+226 70 12 34 56',
                'avatar' => '/avatars/ibrahim.jpg',
                'is_active' => true,
                'email_verified_at' => now(),
            ],
            [
                'name' => 'Yohan Koffi',
                'email' => 'yohankoffik@gmail.com',
                'password' => Hash::make('12345678'),
                'phone' => '+225 07 08 09 10',
                'avatar' => '/avatars/yohan.jpg',
                'is_active' => true,
                'email_verified_at' => now(),
            ],
            [
                'name' => 'Koffi Yohan Eric',
                'email' => 'koffiyohaneric225@gmail.com',
                'password' => Hash::make('password123'),
                'phone' => '+225 05 06 07 08',
                'avatar' => '/avatars/koffi.jpg',
                'is_active' => true,
                'email_verified_at' => now(),
            ],
        ];

        foreach ($users as $userData) {
            User::updateOrCreate(
                ['email' => $userData['email']],
                $userData
            );
        }

        // Appeler les autres seeders
        $this->call([
            PaymentGatewaySeeder::class,
        ]);
    }
}
