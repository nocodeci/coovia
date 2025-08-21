#!/bin/bash

echo "🔧 Correction automatique des migrations Laravel"
echo "=============================================="

# Liste des migrations à corriger
MIGRATIONS=(
    "2025_07_31_235845_add_archived_status_to_products_table.php"
    "2025_08_02_234510_add_payment_id_to_orders_table.php"
    "2025_08_08_205440_add_address_contact_settings_to_stores_table.php"
    "2025_08_09_030827_add_auth0_id_to_users_table.php"
    "2025_08_10_184547_add_vendor_id_to_products_table.php"
    "2025_08_10_184604_add_vendor_id_to_stores_table.php"
    "2025_08_11_233302_add_deleted_at_to_products_table.php"
    "2025_08_12_043601_add_logo_and_banner_to_stores_table.php"
    "2025_08_14_194258_add_slug_to_products_table.php"
    "2025_08_19_234940_add_selected_store_id_to_users_table.php"
)

echo "📋 Migrations à vérifier et corriger :"
for migration in "${MIGRATIONS[@]}"; do
    echo "  - $migration"
done
echo ""

# Fonction pour corriger une migration
fix_migration() {
    local file="database/migrations/$1"
    local table_name=""
    local columns=()
    
    echo "🔍 Vérification de $1..."
    
    # Extraire le nom de la table
    if [[ $1 == *"stores"* ]]; then
        table_name="stores"
    elif [[ $1 == *"products"* ]]; then
        table_name="products"
    elif [[ $1 == *"users"* ]]; then
        table_name="users"
    elif [[ $1 == *"orders"* ]]; then
        table_name="orders"
    else
        echo "⚠️  Table non reconnue pour $1, skip"
        return
    fi
    
    # Extraire les colonnes à ajouter
    while IFS= read -r line; do
        if [[ $line =~ \$table->([a-zA-Z_]+)\( ]]; then
            columns+=("${BASH_REMATCH[1]}")
        fi
    done < "$file"
    
    # Créer la migration corrigée
    if [ ${#columns[@]} -gt 0 ]; then
        echo "  📝 Correction de $1 pour la table $table_name"
        echo "  📋 Colonnes détectées: ${columns[*]}"
        
        # Créer le contenu corrigé
        cat > "$file.tmp" << EOF
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('$table_name', function (Blueprint \$table) {
EOF
        
        # Ajouter les vérifications pour chaque colonne
        for column in "${columns[@]}"; do
            echo "            // Vérifier si la colonne $column existe déjà" >> "$file.tmp"
            echo "            if (!Schema::hasColumn('$table_name', '$column')) {" >> "$file.tmp"
            echo "                \$table->$column();" >> "$file.tmp"
            echo "            }" >> "$file.tmp"
            echo "" >> "$file.tmp"
        done
        
        cat >> "$file.tmp" << EOF
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('$table_name', function (Blueprint \$table) {
            \$table->dropColumn([${columns[*]}]);
        });
    }
};
EOF
        
        # Remplacer le fichier original
        mv "$file.tmp" "$file"
        echo "  ✅ Migration $1 corrigée"
    else
        echo "  ⚠️  Aucune colonne détectée dans $1"
    fi
}

# Corriger chaque migration
for migration in "${MIGRATIONS[@]}"; do
    if [ -f "database/migrations/$migration" ]; then
        fix_migration "$migration"
    else
        echo "❌ Fichier $migration non trouvé"
    fi
done

echo ""
echo "🎉 Correction des migrations terminée !"
echo "📋 Prochaines étapes :"
echo "  1. Commit des changements"
echo "  2. Push vers GitHub"
echo "  3. Redéploiement sur Forge"
