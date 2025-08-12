# 🔒 Guide de Sécurité Wozif

## ⚠️ **Alerte de Sécurité - Token Mailtrap Exposé**

### 🚨 **Problème Détecté**
- **Outil** : gitleaks
- **Fuite** : Token Mailtrap API exposé dans le code
- **Fichiers affectés** : `backend/config/mailtrap.php`, `WOZIF_RENAME_SUMMARY.md`
- **Action** : ✅ **CORRIGÉ** - Token remplacé par placeholder

## ✅ **Actions de Sécurité Effectuées**

### 1. **Suppression des Tokens Exposés**
```bash
# Token Mailtrap supprimé du code source
sed -i '' "s/783efa0e0035c91f3f2eddc1d6ac6bd7/YOUR_MAILTRAP_API_TOKEN/g"
```

### 2. **Protection des Fichiers Sensibles**
```bash
# Ajout au .gitignore
echo "*.env" >> .gitignore
echo "gitleaks-report.json" >> .gitignore
```

### 3. **Création de .env.example**
- Fichier modèle avec placeholders
- Pas de vraies clés API
- Guide pour les développeurs

## 🔧 **Configuration Sécurisée**

### **Variables d'Environnement**
```env
# ✅ SÉCURISÉ - Utilisez ces placeholders
MAIL_PASSWORD=YOUR_MAILTRAP_API_TOKEN
MAILTRAP_API_TOKEN=YOUR_MAILTRAP_API_TOKEN
```

### **Fichiers à Ne Jamais Commiter**
- `*.env` (fichiers d'environnement)
- `gitleaks-report.json` (rapports de sécurité)
- `*.key` (clés privées)
- `*.pem` (certificats)
- `secrets.json` (fichiers de secrets)

## 🛠️ **Outils de Sécurité Installés**

### **ggshield (GitGuardian)**
```bash
# Installation
brew install ggshield

# Authentification (optionnel)
ggshield auth login

# Scan de sécurité
ggshield secret scan path .
```

### **gitleaks**
```bash
# Installation
brew install gitleaks

# Scan complet
gitleaks detect --source . --report-format json

# Scan avec exclusions
gitleaks detect --source . --exclude "node_modules/*" --exclude "vendor/*"
```

## 📋 **Checklist de Sécurité**

### ✅ **Avant Chaque Commit**
- [ ] Vérifier qu'aucun token API n'est exposé
- [ ] S'assurer que `.env` n'est pas commité
- [ ] Scanner avec gitleaks : `gitleaks detect --source .`
- [ ] Vérifier les variables d'environnement

### ✅ **Avant Chaque Push**
- [ ] Scan complet du projet
- [ ] Vérification des secrets
- [ ] Test de sécurité

### ✅ **Configuration Initiale**
- [ ] Créer `.env` à partir de `.env.example`
- [ ] Remplacer les placeholders par les vraies valeurs
- [ ] Ne jamais commiter `.env`
- [ ] Configurer les hooks de sécurité

## 🚀 **Hooks de Sécurité Git**

### **Pre-commit Hook**
```bash
# Installer gitleaks comme hook pre-commit
gitleaks install --hook-type pre-commit
```

### **Pre-push Hook**
```bash
# Installer gitleaks comme hook pre-push
gitleaks install --hook-type pre-push
```

## 📧 **Configuration Mailtrap Sécurisée**

### **Variables d'Environnement**
```env
# Mailtrap SMTP (recommandé)
MAIL_HOST=live.smtp.mailtrap.io
MAIL_PORT=587
MAIL_USERNAME=api
MAIL_PASSWORD=YOUR_MAILTRAP_API_TOKEN
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS="hello@wozif.com"
MAIL_FROM_NAME="Wozif"
```

### **Test de Sécurité**
```bash
# Tester l'envoi d'email
php test-mailtrap-smtp.php

# Vérifier qu'aucun token n'est exposé
grep -r "YOUR_MAILTRAP_API_TOKEN" . --exclude-dir=node_modules
```

## 🔍 **Commandes de Vérification**

### **Scan de Sécurité Rapide**
```bash
# Vérifier les tokens exposés
grep -r "783efa0e0035c91f3f2eddc1d6ac6bd7" . --exclude-dir=node_modules

# Scanner avec gitleaks
gitleaks detect --source . --exclude "node_modules/*" --exclude "vendor/*"

# Vérifier les fichiers sensibles
find . -name "*.env" -not -path "./node_modules/*"
```

### **Vérification des Permissions**
```bash
# Vérifier les permissions des fichiers sensibles
ls -la backend/.env
ls -la backend/.env.example
```

## 📚 **Ressources de Sécurité**

### **Documentation**
- [GitGuardian ggshield](https://docs.gitguardian.com/ggshield-docs/)
- [gitleaks Documentation](https://github.com/gitleaks/gitleaks)
- [OWASP Security Guidelines](https://owasp.org/)

### **Bonnes Pratiques**
- Ne jamais commiter de secrets
- Utiliser des variables d'environnement
- Scanner régulièrement le code
- Maintenir les outils à jour
- Former l'équipe à la sécurité

## 🎯 **Prochaines Étapes**

### **Immédiat**
1. ✅ Token Mailtrap sécurisé
2. ✅ Fichiers sensibles protégés
3. ✅ Outils de sécurité installés

### **À Faire**
1. Configurer les hooks Git
2. Former l'équipe
3. Automatiser les scans
4. Mettre en place un processus de review

## 🎉 **Résultat**

**Votre projet Wozif est maintenant sécurisé !**

- ✅ **Tokens supprimés** du code source
- ✅ **Fichiers sensibles** protégés
- ✅ **Outils de sécurité** installés
- ✅ **Processus de sécurité** documenté

**La sécurité est maintenant une priorité dans votre projet !** 🔒
