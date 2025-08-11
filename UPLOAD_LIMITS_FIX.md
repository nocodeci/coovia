# 🔧 Résolution de l'Erreur 413 (Content Too Large)

## 🚨 Problème
L'erreur **413 (Content Too Large)** indique que la taille des fichiers uploadés dépasse les limites configurées sur le serveur.

## ✅ Solution Implémentée

### 1. **Configuration PHP Améliorée**
- **Fichier** : `backend/php.ini`
- **Limites** :
  - `upload_max_filesize = 50M`
  - `post_max_size = 100M`
  - `max_file_uploads = 20`
  - `memory_limit = 256M`

### 2. **Configuration Laravel**
- **Fichier** : `backend/config/upload.php`
- **Limites** :
  - Taille max fichier : 50MB
  - Taille max totale : 100MB
  - Nombre max fichiers : 10

### 3. **Validation Frontend**
- **Fichier** : `frontend/src/services/mediaService.ts`
- **Vérifications** :
  - Taille individuelle des fichiers
  - Taille totale des fichiers
  - Messages d'erreur explicites

## 🚀 Application des Changements

### Option 1 : Redémarrage Automatique
```bash
cd backend
./restart-with-upload-limits.sh
```

### Option 2 : Redémarrage Manuel
```bash
# Arrêter les conteneurs
docker-compose down

# Reconstruire l'image
docker-compose build --no-cache

# Redémarrer
docker-compose up -d

# Vérifier les limites
docker-compose exec backend php check-upload-limits.php
```

## 🔍 Vérification

### Script de Vérification
```bash
cd backend
php check-upload-limits.php
```

### Résultat Attendu
```
🔍 Vérification des limites d'upload PHP
=====================================

📁 Limites d'upload :
- upload_max_filesize: 50M
- post_max_size: 100M
- max_file_uploads: 20
- max_input_vars: 1000

⏱️ Limites de performance :
- memory_limit: 256M
- max_execution_time: 300s
- max_input_time: 300s

🔧 Extensions PHP :
- pdo_pgsql: ✅
- intl: ✅
- fileinfo: ✅
- gd: ✅
- mbstring: ✅
- openssl: ✅
- zip: ✅

🎯 Configuration Laravel :
- Fichier de configuration upload.php: ✅
- Taille max fichier: 50MB
- Taille max totale: 100MB
- Nombre max fichiers: 10

✅ Vérification terminée !
```

## 📋 Nouvelles Limites

| Type | Limite | Description |
|------|--------|-------------|
| **Fichier individuel** | 50MB | Taille maximale par fichier |
| **Upload total** | 100MB | Taille maximale pour tous les fichiers |
| **Nombre de fichiers** | 10 | Nombre maximal de fichiers par upload |
| **Timeout** | 5 minutes | Délai maximal pour l'upload |
| **Mémoire** | 256MB | Limite de mémoire PHP |

## 🎯 Types de Fichiers Supportés

### Images
- JPG, JPEG, PNG, GIF, WebP, SVG

### Vidéos
- MP4, AVI, MOV, WMV, FLV, WebM

### Audio
- MP3, WAV, OGG, AAC, FLAC

### Documents
- PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, TXT

## 🔧 Gestion des Erreurs

### Erreurs Frontend
- **Fichier trop volumineux** : Message explicite avec la taille
- **Upload total dépassé** : Calcul et affichage de la taille totale
- **Timeout** : Message de vérification de connexion
- **Erreur 413** : Message spécifique pour les limites

### Erreurs Backend
- **Validation Laravel** : Messages d'erreur détaillés
- **Limites PHP** : Gestion automatique des dépassements
- **Logs** : Enregistrement des erreurs pour debug

## 🚀 Déploiement

### Local (Docker)
```bash
./backend/restart-with-upload-limits.sh
```

### Production
1. Copier `php.ini` dans le conteneur
2. Redémarrer le service
3. Vérifier avec `check-upload-limits.php`

## 📊 Monitoring

### Logs à Surveiller
- **Erreurs 413** : Fichiers trop volumineux
- **Timeouts** : Problèmes de connexion
- **Mémoire** : Utilisation excessive de RAM

### Métriques
- Taille moyenne des uploads
- Taux d'échec par type de fichier
- Temps d'upload moyen

## ✅ Test

### Test d'Upload
1. **Fichier < 50MB** : ✅ Doit fonctionner
2. **Fichier > 50MB** : ❌ Doit échouer avec message explicite
3. **Multiple fichiers < 100MB** : ✅ Doit fonctionner
4. **Multiple fichiers > 100MB** : ❌ Doit échouer

### Test de Performance
- Upload de 10 fichiers de 5MB chacun
- Upload d'un fichier de 40MB
- Upload avec connexion lente

## 🎉 Résultat

Après application de ces changements :
- ✅ **Erreur 413 résolue**
- ✅ **Limites claires et explicites**
- ✅ **Messages d'erreur informatifs**
- ✅ **Performance optimisée**
- ✅ **Support de gros fichiers**

Les utilisateurs peuvent maintenant uploader des fichiers jusqu'à 50MB individuellement et 100MB au total, avec des messages d'erreur clairs en cas de dépassement.
