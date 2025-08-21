<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;

class FixUserPasswords extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'users:fix-passwords';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Fix user passwords that are not properly hashed with Bcrypt';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('🔧 Correction des mots de passe utilisateurs...');

        $users = User::all();
        $fixed = 0;

        foreach ($users as $user) {
            // Vérifier si le mot de passe n'est pas correctement haché
            if (!$this->isBcryptHash($user->password)) {
                $this->warn("Correction du mot de passe pour: {$user->email}");

                // Définir un mot de passe par défaut basé sur l'email
                $defaultPassword = $this->getDefaultPassword($user->email);

                $user->update([
                    'password' => Hash::make($defaultPassword)
                ]);

                $this->info("✅ Mot de passe corrigé pour {$user->email} -> {$defaultPassword}");
                $fixed++;
            }
        }

        if ($fixed > 0) {
            $this->info("🎉 {$fixed} mot(s) de passe corrigé(s) avec succès!");
            $this->info("📋 Mots de passe par défaut:");
            $this->table(['Email', 'Mot de passe'], [
                ['jean.kouassi@gmail.com', 'password123'],
                ['marie.diallo@gmail.com', 'password123'],
                ['ibrahim.traore@gmail.com', 'password123'],
                ['yohankoffik@gmail.com', '12345678'],
                ['koffiyohaneric225@gmail.com', 'password123'],
            ]);
        } else {
            $this->info("✅ Tous les mots de passe sont déjà correctement hachés!");
        }

        return 0;
    }

    /**
     * Vérifier si une chaîne est un hash Bcrypt valide
     */
    private function isBcryptHash($password)
    {
        return preg_match('/^\$2[ayb]\$.{56}$/', $password);
    }

    /**
     * Obtenir le mot de passe par défaut pour un email
     */
    private function getDefaultPassword($email)
    {
        $passwords = [
            'yohankoffik@gmail.com' => '12345678',
            'jean.kouassi@gmail.com' => 'password123',
            'marie.diallo@gmail.com' => 'password123',
            'ibrahim.traore@gmail.com' => 'password123',
            'koffiyohaneric225@gmail.com' => 'password123',
        ];

        return $passwords[$email] ?? 'password123';
    }
}
