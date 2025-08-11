<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;

class LunarUuidServiceProvider extends ServiceProvider
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
        // Configurer Lunar pour utiliser des UUID
        $this->configureLunarForUuid();
        
        // Publier les migrations Lunar personnalisées
        $this->publishLunarMigrations();
    }

    /**
     * Configure Lunar pour utiliser des UUID au lieu de bigint
     */
    protected function configureLunarForUuid(): void
    {
        // Modifier la configuration de la base de données Lunar
        config([
            'lunar.database.users_id_type' => 'uuid',
            'lunar.database.use_uuids' => true,
        ]);

        // Ajouter des macros pour les migrations Lunar
        $this->addLunarMigrationMacros();
    }

    /**
     * Ajouter des macros pour les migrations Lunar
     */
    protected function addLunarMigrationMacros(): void
    {
        // Macro pour créer des colonnes UUID avec contraintes
        Blueprint::macro('lunarUuid', function (string $column, bool $nullable = false) {
            $this->uuid($column);
            
            if (!$nullable) {
                $this->string($column)->nullable(false);
            }
            
            return $this;
        });

        // Macro pour créer des colonnes UUID avec contraintes de clé étrangère
        Blueprint::macro('lunarUuidForeign', function (string $column, string $table, string $foreignColumn = 'id', bool $nullable = false) {
            $this->lunarUuid($column, $nullable);
            $this->foreign($column)->references($foreignColumn)->on($table)->onDelete('cascade');
            
            return $this;
        });
    }

    /**
     * Publier les migrations Lunar personnalisées
     */
    protected function publishLunarMigrations(): void
    {
        // Créer un répertoire pour les migrations Lunar personnalisées
        $migrationsPath = database_path('migrations/lunar');
        
        if (!file_exists($migrationsPath)) {
            mkdir($migrationsPath, 0755, true);
        }

        // Copier et adapter les migrations Lunar pour utiliser des UUID
        $this->createCustomLunarMigrations();
    }

    /**
     * Créer des migrations Lunar personnalisées avec UUID
     */
    protected function createCustomLunarMigrations(): void
    {
        $migrationsPath = database_path('migrations/lunar');
        
        // Migration pour les channels avec UUID
        $this->createMigrationFile($migrationsPath, 'create_lunar_channels_table.php', $this->getChannelsMigration());
        
        // Migration pour les customers avec UUID
        $this->createMigrationFile($migrationsPath, 'create_lunar_customers_table.php', $this->getCustomersMigration());
        
        // Migration pour les products avec UUID
        $this->createMigrationFile($migrationsPath, 'create_lunar_products_table.php', $this->getProductsMigration());
        
        // Migration pour les orders avec UUID
        $this->createMigrationFile($migrationsPath, 'create_lunar_orders_table.php', $this->getOrdersMigration());
    }

    /**
     * Créer un fichier de migration
     */
    protected function createMigrationFile(string $path, string $filename, string $content): void
    {
        $filePath = $path . '/' . $filename;
        
        if (!file_exists($filePath)) {
            file_put_contents($filePath, $content);
        }
    }

    /**
     * Migration pour les channels
     */
    protected function getChannelsMigration(): string
    {
        return '<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create("lunar_channels", function (Blueprint $table) {
            $table->uuid("id")->primary();
            $table->string("name");
            $table->string("handle")->unique();
            $table->string("url")->nullable();
            $table->boolean("default")->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists("lunar_channels");
    }
};';
    }

    /**
     * Migration pour les customers
     */
    protected function getCustomersMigration(): string
    {
        return '<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create("lunar_customers", function (Blueprint $table) {
            $table->uuid("id")->primary();
            $table->uuid("user_id")->nullable();
            $table->string("first_name");
            $table->string("last_name");
            $table->string("email")->unique();
            $table->string("phone")->nullable();
            $table->json("meta")->nullable();
            $table->timestamps();
            
            $table->foreign("user_id")->references("id")->on("users")->onDelete("set null");
        });
    }

    public function down(): void
    {
        Schema::dropIfExists("lunar_customers");
    }
};';
    }

    /**
     * Migration pour les products
     */
    protected function getProductsMigration(): string
    {
        return '<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create("lunar_products", function (Blueprint $table) {
            $table->uuid("id")->primary();
            $table->uuid("store_id")->nullable();
            $table->string("name");
            $table->string("slug")->unique();
            $table->text("description")->nullable();
            $table->string("sku")->nullable();
            $table->decimal("price", 10, 2)->default(0);
            $table->decimal("compare_price", 10, 2)->nullable();
            $table->integer("stock_quantity")->default(0);
            $table->boolean("is_active")->default(true);
            $table->boolean("is_featured")->default(false);
            $table->json("meta")->nullable();
            $table->timestamps();
            
            $table->foreign("store_id")->references("id")->on("stores")->onDelete("cascade");
        });
    }

    public function down(): void
    {
        Schema::dropIfExists("lunar_products");
    }
};';
    }

    /**
     * Migration pour les orders
     */
    protected function getOrdersMigration(): string
    {
        return '<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create("lunar_orders", function (Blueprint $table) {
            $table->uuid("id")->primary();
            $table->uuid("user_id")->nullable();
            $table->uuid("store_id")->nullable();
            $table->string("order_number")->unique();
            $table->string("status")->default("pending");
            $table->decimal("sub_total", 10, 2)->default(0);
            $table->decimal("tax_total", 10, 2)->default(0);
            $table->decimal("shipping_total", 10, 2)->default(0);
            $table->decimal("discount_total", 10, 2)->default(0);
            $table->decimal("total", 10, 2)->default(0);
            $table->json("meta")->nullable();
            $table->timestamps();
            
            $table->foreign("user_id")->references("id")->on("users")->onDelete("set null");
            $table->foreign("store_id")->references("id")->on("stores")->onDelete("cascade");
        });
    }

    public function down(): void
    {
        Schema::dropIfExists("lunar_orders");
    }
};';
    }
}
