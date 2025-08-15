#!/bin/bash
set -e

echo "🚀 Building Laravel Octane application..."

# Install dependencies
composer install --no-dev --optimize-autoloader

# Create necessary directories
mkdir -p storage/framework/cache
mkdir -p storage/framework/sessions
mkdir -p storage/framework/views
mkdir -p bootstrap/cache

# Set permissions
chmod -R 775 storage
chmod -R 775 bootstrap/cache

# Generate application key if not exists
php artisan key:generate --no-interaction || true

# Clear and cache config
php artisan config:clear
php artisan config:cache

# Clear and cache routes
php artisan route:clear
php artisan route:cache

# Clear and cache views
php artisan view:clear
php artisan view:cache

# Run migrations
php artisan migrate --force || true

# Create storage link
php artisan storage:link || true

echo "✅ Build completed successfully!"

