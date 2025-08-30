<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\StoreMediaFile;
use App\Services\CloudflareUploadService;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class RegenerateThumbnails extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'media:regenerate-thumbnails {--force : Forcer la régénération même si les thumbnails existent}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Régénérer les thumbnails pour toutes les images existantes';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('🖼️  Régénération des thumbnails pour les images existantes');
        $this->info('========================================================');
        $this->newLine();

        try {
            // Récupérer toutes les images
            $imageFiles = StoreMediaFile::where('type', 'image')->get();
            
            if ($imageFiles->isEmpty()) {
                $this->warn('Aucune image trouvée dans la base de données.');
                return;
            }
            
            $this->info("📊 Nombre d'images trouvées : " . $imageFiles->count());
            $this->newLine();
            
            $processed = 0;
            $errors = 0;
            $skipped = 0;
            
            $progressBar = $this->output->createProgressBar($imageFiles->count());
            $progressBar->start();
            
            foreach ($imageFiles as $mediaFile) {
                try {
                    $result = $this->processImage($mediaFile);
                    
                    if ($result === 'processed') {
                        $processed++;
                    } elseif ($result === 'skipped') {
                        $skipped++;
                    }
                    
                } catch (\Exception $e) {
                    $this->error("❌ {$mediaFile->name}: " . $e->getMessage());
                    $errors++;
                }
                
                $progressBar->advance();
            }
            
            $progressBar->finish();
            $this->newLine(2);
            
            $this->info('🎯 RÉSUMÉ :');
            $this->line("   - Images traitées : {$processed}");
            $this->line("   - Images ignorées : {$skipped}");
            $this->line("   - Erreurs : {$errors}");
            $this->line("   - Total : " . $imageFiles->count());
            $this->newLine();
            
            if ($processed > 0) {
                $this->info('✅ Régénération terminée avec succès !');
                $this->line('🔄 Redémarrez votre application pour voir les changements.');
            } else {
                $this->info('ℹ️  Aucune image traitée.');
            }
            
        } catch (\Exception $e) {
            $this->error('❌ Erreur : ' . $e->getMessage());
            $this->error('Stack trace : ' . $e->getTraceAsString());
        }
    }

    /**
     * Traiter une image individuelle
     */
    protected function processImage(StoreMediaFile $mediaFile): string
    {
        // Vérifier si l'image existe sur le disque
        if (!Storage::disk('r2')->exists($mediaFile->cloudflare_path)) {
            Log::warning("Image non trouvée sur le disque: {$mediaFile->cloudflare_path}");
            return 'skipped';
        }
        
        // Vérifier si les thumbnails existent déjà
        if (!$this->option('force') && $mediaFile->thumbnail_url) {
            $this->line("⏭️  {$mediaFile->name}: Thumbnails existants, ignoré");
            return 'skipped';
        }
        
        try {
            // Créer un fichier temporaire pour l'image
            $tempPath = storage_path('app/temp_' . $mediaFile->name);
            $imageContent = Storage::disk('r2')->get($mediaFile->cloudflare_path);
            file_put_contents($tempPath, $imageContent);
            
            // Créer un UploadedFile simulé
            $uploadedFile = new \Illuminate\Http\UploadedFile(
                $tempPath,
                $mediaFile->name,
                $mediaFile->mime_type,
                null,
                true
            );
            
            // Générer les thumbnails
            $cloudflareService = new CloudflareUploadService();
            $thumbnails = $cloudflareService->generateThumbnails(
                $uploadedFile,
                dirname($mediaFile->cloudflare_path),
                $mediaFile->name
            );
            
            // Mettre à jour l'URL du thumbnail dans la base de données
            if (!empty($thumbnails) && isset($thumbnails['medium']['url'])) {
                $mediaFile->thumbnail_url = $thumbnails['medium']['url'];
                $mediaFile->save();
                
                $this->line("✅ {$mediaFile->name}: Thumbnails régénérés");
                
                // Nettoyer le fichier temporaire
                unlink($tempPath);
                
                return 'processed';
            } else {
                $this->warn("⚠️  {$mediaFile->name}: Aucun thumbnail généré");
                return 'skipped';
            }
            
        } catch (\Exception $e) {
            // Nettoyer le fichier temporaire en cas d'erreur
            if (file_exists($tempPath)) {
                unlink($tempPath);
            }
            throw $e;
        }
    }
}
