<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\StoreMediaFile;

class FixMediaTypes extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'media:fix-types';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Corriger automatiquement les types de fichiers média basés sur leurs extensions';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('🔧 Script de correction des types de fichiers média');
        $this->info('================================================');
        $this->newLine();

        try {
            // Récupérer tous les fichiers média
            $mediaFiles = StoreMediaFile::all();
            
            $this->info("📊 Nombre total de fichiers média trouvés : " . $mediaFiles->count());
            $this->newLine();
            
            $corrected = 0;
            $errors = 0;
            
            $progressBar = $this->output->createProgressBar($mediaFiles->count());
            $progressBar->start();
            
            foreach ($mediaFiles as $mediaFile) {
                $currentType = $mediaFile->type;
                $detectedType = $this->detectFileTypeFromFilename($mediaFile->name);
                
                if ($currentType !== $detectedType) {
                    try {
                        // Mettre à jour le type
                        $mediaFile->type = $detectedType;
                        $mediaFile->save();
                        
                        $this->line("✅ {$mediaFile->name}: '{$currentType}' → '{$detectedType}'");
                        $corrected++;
                        
                    } catch (\Exception $e) {
                        $this->error("❌ {$mediaFile->name}: " . $e->getMessage());
                        $errors++;
                    }
                }
                
                $progressBar->advance();
            }
            
            $progressBar->finish();
            $this->newLine(2);
            
            $this->info('🎯 RÉSUMÉ :');
            $this->line("   - Fichiers corrigés : {$corrected}");
            $this->line("   - Erreurs : {$errors}");
            $this->line("   - Total traité : " . $mediaFiles->count());
            $this->newLine();
            
            if ($corrected > 0) {
                $this->info('✅ Correction terminée avec succès !');
                $this->line('🔄 Redémarrez votre application pour voir les changements.');
            } else {
                $this->info('ℹ️  Aucune correction nécessaire.');
            }
            
        } catch (\Exception $e) {
            $this->error('❌ Erreur : ' . $e->getMessage());
            $this->error('Stack trace : ' . $e->getTraceAsString());
        }
    }

    /**
     * Détecter le type de fichier basé sur l'extension
     */
    protected function detectFileTypeFromFilename(string $filename): string
    {
        $extension = strtolower(pathinfo($filename, PATHINFO_EXTENSION));
        
        // Détection par extension
        $imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg'];
        $videoExtensions = ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm', 'mkv'];
        $audioExtensions = ['mp3', 'wav', 'ogg', 'aac', 'flac', 'wma'];
        
        if (in_array($extension, $imageExtensions)) {
            return 'image';
        }
        if (in_array($extension, $videoExtensions)) {
            return 'video';
        }
        if (in_array($extension, $audioExtensions)) {
            return 'audio';
        }
        
        return 'document';
    }
}
