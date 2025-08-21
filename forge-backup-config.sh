#!/bin/bash

# Configuration des sauvegardes automatiques pour Laravel Forge
# Ce script configure les sauvegardes de la base de données et des fichiers

echo "💾 Configuration des sauvegardes automatiques..."

# Variables
SITE_DIR="/home/forge/api.coovia.com"
BACKUP_DIR="/home/forge/backups"
DB_NAME="coovia_production"
DB_USER="forge"
BACKUP_RETENTION_DAYS=7

# Créer le répertoire de sauvegarde
mkdir -p "$BACKUP_DIR"

# 1. Script de sauvegarde de la base de données
cat > "$BACKUP_DIR/backup-database.sh" << 'EOF'
#!/bin/bash

# Script de sauvegarde de la base de données
SITE_DIR="/home/forge/api.coovia.com"
BACKUP_DIR="/home/forge/backups"
DB_NAME="coovia_production"
DB_USER="forge"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/database_$DATE.sql"

# Créer la sauvegarde
cd $SITE_DIR
if [ -f ".env" ]; then
    # Extraire les informations de connexion depuis .env
    DB_HOST=$(grep DB_HOST .env | cut -d '=' -f2)
    DB_PORT=$(grep DB_PORT .env | cut -d '=' -f2)
    DB_DATABASE=$(grep DB_DATABASE .env | cut -d '=' -f2)
    DB_USERNAME=$(grep DB_USERNAME .env | cut -d '=' -f2)
    DB_PASSWORD=$(grep DB_PASSWORD .env | cut -d '=' -f2)
    
    # Créer la sauvegarde PostgreSQL
    PGPASSWORD="$DB_PASSWORD" pg_dump -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USERNAME" -d "$DB_DATABASE" > "$BACKUP_FILE"
    
    if [ $? -eq 0 ]; then
        echo "✅ Sauvegarde de la base de données créée: $BACKUP_FILE"
        # Compresser la sauvegarde
        gzip "$BACKUP_FILE"
        echo "✅ Sauvegarde compressée: $BACKUP_FILE.gz"
    else
        echo "❌ Erreur lors de la sauvegarde de la base de données"
        exit 1
    fi
else
    echo "❌ Fichier .env non trouvé"
    exit 1
fi
EOF

# 2. Script de sauvegarde des fichiers
cat > "$BACKUP_DIR/backup-files.sh" << 'EOF'
#!/bin/bash

# Script de sauvegarde des fichiers
SITE_DIR="/home/forge/api.coovia.com"
BACKUP_DIR="/home/forge/backups"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/files_$DATE.tar.gz"

# Créer la sauvegarde des fichiers importants
cd $SITE_DIR
tar -czf "$BACKUP_FILE" \
    --exclude='vendor' \
    --exclude='node_modules' \
    --exclude='storage/logs/*.log' \
    --exclude='storage/framework/cache/*' \
    --exclude='storage/framework/sessions/*' \
    --exclude='storage/framework/views/*' \
    --exclude='.git' \
    .

if [ $? -eq 0 ]; then
    echo "✅ Sauvegarde des fichiers créée: $BACKUP_FILE"
else
    echo "❌ Erreur lors de la sauvegarde des fichiers"
    exit 1
fi
EOF

# 3. Script de nettoyage des anciennes sauvegardes
cat > "$BACKUP_DIR/cleanup-backups.sh" << 'EOF'
#!/bin/bash

# Script de nettoyage des anciennes sauvegardes
BACKUP_DIR="/home/forge/backups"
RETENTION_DAYS=7

echo "🧹 Nettoyage des sauvegardes de plus de $RETENTION_DAYS jours..."

# Supprimer les anciennes sauvegardes de base de données
find "$BACKUP_DIR" -name "database_*.sql.gz" -mtime +$RETENTION_DAYS -delete

# Supprimer les anciennes sauvegardes de fichiers
find "$BACKUP_DIR" -name "files_*.tar.gz" -mtime +$RETENTION_DAYS -delete

echo "✅ Nettoyage terminé"
EOF

# 4. Script de restauration
cat > "$BACKUP_DIR/restore-database.sh" << 'EOF'
#!/bin/bash

# Script de restauration de la base de données
SITE_DIR="/home/forge/api.coovia.com"
BACKUP_DIR="/home/forge/backups"

if [ -z "$1" ]; then
    echo "Usage: $0 <fichier_sauvegarde>"
    echo "Exemple: $0 database_20231201_120000.sql.gz"
    exit 1
fi

BACKUP_FILE="$BACKUP_DIR/$1"

if [ ! -f "$BACKUP_FILE" ]; then
    echo "❌ Fichier de sauvegarde non trouvé: $BACKUP_FILE"
    exit 1
fi

cd $SITE_DIR
if [ -f ".env" ]; then
    # Extraire les informations de connexion depuis .env
    DB_HOST=$(grep DB_HOST .env | cut -d '=' -f2)
    DB_PORT=$(grep DB_PORT .env | cut -d '=' -f2)
    DB_DATABASE=$(grep DB_DATABASE .env | cut -d '=' -f2)
    DB_USERNAME=$(grep DB_USERNAME .env | cut -d '=' -f2)
    DB_PASSWORD=$(grep DB_PASSWORD .env | cut -d '=' -f2)
    
    echo "⚠️ ATTENTION: Cette opération va écraser la base de données actuelle!"
    read -p "Êtes-vous sûr? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        # Restaurer la sauvegarde
        if [[ "$BACKUP_FILE" == *.gz ]]; then
            gunzip -c "$BACKUP_FILE" | PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USERNAME" -d "$DB_DATABASE"
        else
            PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USERNAME" -d "$DB_DATABASE" < "$BACKUP_FILE"
        fi
        
        if [ $? -eq 0 ]; then
            echo "✅ Base de données restaurée avec succès"
        else
            echo "❌ Erreur lors de la restauration"
            exit 1
        fi
    else
        echo "❌ Restauration annulée"
    fi
else
    echo "❌ Fichier .env non trouvé"
    exit 1
fi
EOF

# Rendre les scripts exécutables
chmod +x "$BACKUP_DIR/backup-database.sh"
chmod +x "$BACKUP_DIR/backup-files.sh"
chmod +x "$BACKUP_DIR/cleanup-backups.sh"
chmod +x "$BACKUP_DIR/restore-database.sh"

# 5. Configuration des tâches cron
echo "⏰ Configuration des tâches cron..."

# Sauvegarde quotidienne de la base de données à 2h du matin
(crontab -l 2>/dev/null; echo "0 2 * * * $BACKUP_DIR/backup-database.sh >> $BACKUP_DIR/backup.log 2>&1") | crontab -

# Sauvegarde hebdomadaire des fichiers le dimanche à 3h du matin
(crontab -l 2>/dev/null; echo "0 3 * * 0 $BACKUP_DIR/backup-files.sh >> $BACKUP_DIR/backup.log 2>&1") | crontab -

# Nettoyage quotidien des anciennes sauvegardes à 4h du matin
(crontab -l 2>/dev/null; echo "0 4 * * * $BACKUP_DIR/cleanup-backups.sh >> $BACKUP_DIR/backup.log 2>&1") | crontab -

# 6. Créer un script de test de sauvegarde
cat > "$BACKUP_DIR/test-backup.sh" << 'EOF'
#!/bin/bash

# Script de test des sauvegardes
BACKUP_DIR="/home/forge/backups"

echo "🧪 Test des sauvegardes..."

# Tester la sauvegarde de la base de données
echo "📊 Test de la sauvegarde de la base de données..."
$BACKUP_DIR/backup-database.sh

# Tester la sauvegarde des fichiers
echo "📁 Test de la sauvegarde des fichiers..."
$BACKUP_DIR/backup-files.sh

# Lister les sauvegardes
echo "📋 Sauvegardes disponibles:"
ls -la $BACKUP_DIR/*.gz 2>/dev/null || echo "Aucune sauvegarde trouvée"

echo "✅ Test terminé"
EOF

chmod +x "$BACKUP_DIR/test-backup.sh"

# 7. Créer un fichier de documentation
cat > "$BACKUP_DIR/README.md" << 'EOF'
# Configuration des Sauvegardes - Laravel Forge

## Scripts disponibles

### backup-database.sh
Sauvegarde la base de données PostgreSQL.
- **Exécution**: Quotidienne à 2h du matin
- **Format**: SQL compressé (.sql.gz)
- **Rétention**: 7 jours

### backup-files.sh
Sauvegarde les fichiers de l'application.
- **Exécution**: Hebdomadaire le dimanche à 3h du matin
- **Format**: Archive tar.gz
- **Rétention**: 7 jours

### cleanup-backups.sh
Nettoie les anciennes sauvegardes.
- **Exécution**: Quotidienne à 4h du matin
- **Supprime**: Sauvegardes de plus de 7 jours

### restore-database.sh
Restaure une sauvegarde de base de données.
- **Usage**: `./restore-database.sh database_20231201_120000.sql.gz`
- **Attention**: Écrase la base de données actuelle

### test-backup.sh
Teste tous les scripts de sauvegarde.

## Tâches cron configurées

```bash
# Sauvegarde quotidienne de la base de données
0 2 * * * /home/forge/backups/backup-database.sh

# Sauvegarde hebdomadaire des fichiers
0 3 * * 0 /home/forge/backups/backup-files.sh

# Nettoyage des anciennes sauvegardes
0 4 * * * /home/forge/backups/cleanup-backups.sh
```

## Logs

Les logs des sauvegardes sont disponibles dans `/home/forge/backups/backup.log`

## Restauration

Pour restaurer une sauvegarde :

1. Lister les sauvegardes disponibles :
   ```bash
   ls -la /home/forge/backups/
   ```

2. Restaurer une sauvegarde :
   ```bash
   cd /home/forge/backups/
   ./restore-database.sh database_20231201_120000.sql.gz
   ```

## Monitoring

Pour vérifier que les sauvegardes fonctionnent :

```bash
# Vérifier les logs
tail -f /home/forge/backups/backup.log

# Tester manuellement
cd /home/forge/backups/
./test-backup.sh
```
EOF

echo "✅ Configuration des sauvegardes terminée!"
echo ""
echo "📋 Résumé de la configuration:"
echo "================================"
echo "📁 Répertoire de sauvegarde: $BACKUP_DIR"
echo "⏰ Sauvegarde DB: Quotidienne à 2h"
echo "⏰ Sauvegarde fichiers: Hebdomadaire le dimanche à 3h"
echo "🧹 Nettoyage: Quotidien à 4h"
echo "📅 Rétention: $BACKUP_RETENTION_DAYS jours"
echo ""
echo "🧪 Pour tester les sauvegardes:"
echo "cd $BACKUP_DIR && ./test-backup.sh"
echo ""
echo "📖 Documentation: $BACKUP_DIR/README.md"
