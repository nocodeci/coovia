# 🧪 Tests du Backend Laravel sur Forge

Ce dossier contient une suite complète de tests pour vérifier le bon fonctionnement de votre backend Laravel déployé sur Forge.

## 📋 Scripts de test disponibles

### 1. `test-forge-all.php` - Script principal
**Script interactif qui permet de choisir et lancer tous les tests disponibles.**

```bash
php test-forge-all.php
```

**Fonctionnalités :**
- Menu interactif pour choisir les tests
- Exécution de tous les tests en séquence
- Résumé complet des résultats

### 2. `test-forge-quick.php` - Test rapide
**Test essentiel en moins de 30 secondes pour vérifier la connectivité de base.**

```bash
php test-forge-quick.php
```

**Ce qui est testé :**
- ✅ Connectivité au serveur
- ✅ Endpoints critiques (/health, /ping, /status)
- ✅ Performance rapide

### 3. `test-forge-backend.php` - Test complet
**Test exhaustif de tous les aspects du backend (2-3 minutes).**

```bash
php test-forge-backend.php
```

**Ce qui est testé :**
- 🔍 Connectivité de base
- 🏥 Endpoints de santé
- 🗄️ Base de données
- ⚡ Performance
- 🔒 Certificat SSL
- 🛡️ En-têtes de sécurité
- 🔗 Routes d'API principales
- 🚨 Gestion des erreurs

### 4. `test-forge-auth.php` - Test d'authentification
**Test spécifique de l'authentification et des fonctionnalités protégées.**

```bash
php test-forge-auth.php
```

**Ce qui est testé :**
- 📡 Endpoints publics
- 🗄️ Statut de la base de données
- 🔒 Routes protégées (sans token)
- 👤 Création d'utilisateur de test
- 🔑 Connexion et génération de token
- 🔓 Accès aux routes protégées avec token

### 5. `test-forge-features.php` - Test des fonctionnalités
**Test des fonctionnalités spécifiques de l'application Coovia.**

```bash
php test-forge-features.php
```

**Ce qui est testé :**
- 📊 Données publiques (utilisateurs, produits)
- 💰 Fonctionnalités Moneroo (paiements, webhooks)
- 🏪 Fonctionnalités de boutique
- 📸 Fonctionnalités de média
- 💸 Fonctionnalités de paiement
- 📦 Fonctionnalités de commande
- 📊 Fonctionnalités de tableau de bord
- 👥 Fonctionnalités de client
- ☁️ Fonctionnalités Cloudflare
- ⚙️ Fonctionnalités de configuration

### 6. `test-forge-database.php` - Test de la base de données
**Test approfondi de la base de données et des migrations.**

```bash
php test-forge-database.php
```

**Ce qui est testé :**
- 🔍 Endpoint de statut
- 🗄️ Connexion à la base de données
- 📋 Tables principales
- 🔗 Relations entre tables
- 🔒 Contraintes de base de données
- ⚡ Performances
- 🔍 Cohérence des données

## 🚀 Comment utiliser

### Prérequis
- PHP 7.4+ installé
- Extension cURL activée
- Accès en ligne de commande

### Exécution simple
```bash
# Test rapide (recommandé pour commencer)
php test-forge-quick.php

# Test complet
php test-forge-backend.php

# Script principal avec menu
php test-forge-all.php
```

### Exécution avec options
```bash
# Test spécifique
php test-forge-auth.php
php test-forge-features.php
php test-forge-database.php
```

## 📊 Interprétation des résultats

### ✅ Succès
- **Excellent** : Tous les tests passent
- **Bien** : 75-90% des tests passent
- **Acceptable** : 50-75% des tests passent

### ❌ Échecs
- **Critique** : Moins de 50% des tests passent
- **Problèmes identifiés** : Détails des échecs affichés

### ⚠️ Avertissements
- **Réponses inattendues** : Fonctionne mais pas comme prévu
- **Performances lentes** : Fonctionne mais peut être optimisé

## 🔧 Configuration

### URL du backend
Tous les scripts pointent vers `https://api.wozif.com` par défaut.

Pour modifier l'URL, éditez la variable `$baseUrl` dans chaque script :

```php
$baseUrl = 'https://votre-nouvelle-url.com';
```

### Timeout des requêtes
Les timeouts sont configurés pour être tolérants :
- Test rapide : 10 secondes
- Tests normaux : 15-20 secondes
- Test complet : 30 secondes

## 🐛 Dépannage

### Erreurs courantes

#### ❌ Erreur de connexion
```
❌ Erreur: Could not resolve host
```
**Solution :** Vérifiez que l'URL est correcte et accessible.

#### ❌ Erreur SSL
```
❌ Erreur: SSL certificate problem
```
**Solution :** Les scripts ignorent déjà la vérification SSL pour les tests.

#### ❌ Timeout
```
❌ Erreur: Operation timed out
```
**Solution :** Augmentez le timeout dans le script ou vérifiez la connectivité réseau.

#### ❌ Erreur 500
```
❌ HTTP 500
```
**Solution :** Vérifiez les logs Laravel sur Forge pour identifier l'erreur.

### Vérifications manuelles

#### Test de connectivité basique
```bash
curl -I https://api.wozif.com
```

#### Test d'un endpoint spécifique
```bash
curl https://api.wozif.com/health
```

#### Test avec authentification
```bash
curl -H "Authorization: Bearer VOTRE_TOKEN" https://api.wozif.com/api/stores
```

## 📈 Surveillance continue

### Tests automatisés
Vous pouvez intégrer ces scripts dans votre pipeline CI/CD :

```bash
# Exemple pour GitHub Actions
- name: Test Backend Forge
  run: php test-forge-quick.php
```

### Tests programmés
Utilisez cron pour des tests réguliers :

```bash
# Test toutes les heures
0 * * * * cd /path/to/coovia && php test-forge-quick.php >> logs/backend-tests.log 2>&1

# Test complet quotidien
0 2 * * * cd /path/to/coovia && php test-forge-backend.php >> logs/backend-tests-full.log 2>&1
```

## 🎯 Cas d'usage

### 🔍 Vérification post-déploiement
```bash
# Après un déploiement sur Forge
php test-forge-quick.php
```

### 🧪 Tests de développement
```bash
# Pendant le développement
php test-forge-features.php
```

### 📊 Audit de sécurité
```bash
# Vérification de la sécurité
php test-forge-backend.php
```

### 🗄️ Diagnostic de base de données
```bash
# En cas de problème de base de données
php test-forge-database.php
```

## 📞 Support

Si vous rencontrez des problèmes avec ces tests :

1. **Vérifiez les logs** de votre application Laravel
2. **Testez manuellement** avec curl ou Postman
3. **Vérifiez la configuration** de votre serveur Forge
4. **Consultez la documentation** Laravel et Forge

## 🔄 Mise à jour

Ces scripts sont conçus pour être maintenus et mis à jour avec votre application. N'oubliez pas de :

- ✅ Adapter les URLs si vous changez de domaine
- ✅ Mettre à jour les endpoints testés
- ✅ Ajouter de nouveaux tests pour les nouvelles fonctionnalités
- ✅ Vérifier la compatibilité avec les nouvelles versions de PHP

---

**🚀 Bon test de votre backend Forge !**
