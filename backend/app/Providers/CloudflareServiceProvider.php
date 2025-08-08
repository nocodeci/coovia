<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Storage;
use Aws\S3\S3Client;
use League\Flysystem\AwsS3V3\AwsS3V3Adapter;
use League\Flysystem\Filesystem;

class CloudflareServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        // Configuration R2 personnalisée si nécessaire
        if (config('filesystems.default') === 'r2') {
            $this->configureR2();
        }
    }

    /**
     * Configure R2 filesystem
     */
    protected function configureR2(): void
    {
        // Configuration automatique pour R2
        config([
            'filesystems.disks.r2.endpoint' => 'https://' . config('filesystems.disks.r2.key') . '.r2.cloudflarestorage.com',
        ]);
    }
}
