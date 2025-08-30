<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\StoreMediaFile;
use Illuminate\Support\Facades\DB;

class MigrateCloudflareUrls extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'media:migrate-urls {--dry-run : Afficher les changements sans les appliquer}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Migrer les anciennes URLs Cloudflare R2 vers les nouvelles URLs publiques';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('🔄 Migration des URLs Cloudflare R2');
        $this->info('====================================');
        $this->newLine();

        // Anciennes et nouvelles URLs
        $oldBaseUrl = 'https://coovia-files.abf701097f61a1d3954f38fcc6b41e83.r2.cloudflarestorage.com';
        $newBaseUrl = 'https://pub-f24a39478f6a41e7ab82e6f4291ed5ae.r2.dev';

        try {
            // Récupérer tous les fichiers média avec les anciennes URLs
            $mediaFiles = StoreMediaFile::where('url', 'like', $oldBaseUrl . '%')
                ->orWhere('thumbnail_url', 'like', $oldBaseUrl . '%')
                ->get();

            if ($mediaFiles->isEmpty()) {
                $this->info('✅ Aucune URL à migrer trouvée.');
                return;
            }

            $this->info("📊 Nombre de fichiers à migrer : " . $mediaFiles->count());
            $this->newLine();

            $updated = 0;
            $errors = 0;

            $progressBar = $this->output->createProgressBar($mediaFiles->count());
            $progressBar->start();

            foreach ($mediaFiles as $mediaFile) {
                try {
                    $changes = [];

                    // Migrer l'URL principale
                    if (str_contains($mediaFile->url, $oldBaseUrl)) {
                        $oldUrl = $mediaFile->url;
                        $newUrl = str_replace($oldBaseUrl, $newBaseUrl, $oldUrl);
                        $changes['url'] = ['old' => $oldUrl, 'new' => $newUrl];
                    }

                    // Migrer l'URL du thumbnail
                    if ($mediaFile->thumbnail_url && str_contains($mediaFile->thumbnail_url, $oldBaseUrl)) {
                        $oldThumbUrl = $mediaFile->thumbnail_url;
                        $newThumbUrl = str_replace($oldBaseUrl, $newBaseUrl, $oldThumbUrl);
                        $changes['thumbnail_url'] = ['old' => $oldThumbUrl, 'new' => $newThumbUrl];
                    }

                    if (!empty($changes)) {
                        if ($this->option('dry-run')) {
                            $this->line("📁 {$mediaFile->name}:");
                            foreach ($changes as $field => $change) {
                                $this->line("   {$field}: {$change['old']} → {$change['new']}");
                            }
                        } else {
                            // Appliquer les changements
                            foreach ($changes as $field => $change) {
                                $mediaFile->$field = $change['new'];
                            }
                            $mediaFile->save();
                        }
                        $updated++;
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
            $this->line("   - Fichiers traités : {$updated}");
            $this->line("   - Erreurs : {$errors}");
            $this->line("   - Total : " . $mediaFiles->count());
            $this->newLine();

            if ($this->option('dry-run')) {
                $this->warn('🔍 Mode DRY-RUN : Aucun changement appliqué');
                $this->line('Pour appliquer les changements, exécutez : php artisan media:migrate-urls');
            } else {
                $this->info('✅ Migration terminée avec succès !');
                $this->line('🔄 Redémarrez votre application pour voir les changements.');
            }

        } catch (\Exception $e) {
            $this->error('❌ Erreur : ' . $e->getMessage());
            $this->error('Stack trace : ' . $e->getTraceAsString());
        }
    }
}
