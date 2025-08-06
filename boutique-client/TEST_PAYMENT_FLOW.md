# 🧪 Guide de Test - Flux de Paiement avec Numéro Pré-rempli

## 🎯 **Objectif du Test**

Vérifier que le numéro de téléphone saisi dans le checkout est automatiquement utilisé dans les formulaires de paiement, sans que le client ait à le saisir à nouveau.

## 📋 **Étapes de Test**

### **✅ Étape 1 : Accès au Checkout**
1. **Ouvrir** `http://localhost:3000/nocodeci/checkout`
2. **Vérifier** que le formulaire de checkout s'affiche correctement

### **✅ Étape 2 : Saisie des Coordonnées**
1. **Remplir** le formulaire avec des données valides :
   - **Email** : `test@example.com`
   - **Prénom** : `Test`
   - **Nom** : `User`
   - **Téléphone** : `0701234567`
   - **Pays** : `Côte d'Ivoire`

### **✅ Étape 3 : Sélection de la Méthode de Paiement**
1. **Sélectionner** une méthode de paiement (ex: Wave CI)
2. **Cliquer** sur "Continuer vers le paiement"
3. **Vérifier** que le token de paiement est généré

### **✅ Étape 4 : Vérification du Numéro Pré-rempli**
1. **Observer** le formulaire de paiement spécifique
2. **Vérifier** que le champ téléphone est pré-rempli avec `+2250701234567`
3. **Vérifier** la présence du message : "Numéro pré-rempli depuis le checkout"

### **✅ Étape 5 : Test de Modification**
1. **Modifier** le numéro de téléphone dans le formulaire de paiement
2. **Vérifier** que la modification est possible
3. **Soumettre** le formulaire avec le numéro modifié

## 🧪 **Tests par Méthode de Paiement**

### **🇨🇮 Côte d'Ivoire**
- ✅ **Wave CI** → Numéro pré-rempli +225
- ✅ **Orange Money CI** → Numéro pré-rempli +225
- ✅ **MTN MoMo CI** → Numéro pré-rempli +225
- ✅ **Moov Money CI** → Numéro pré-rempli +225

### **🇧🇯 Bénin**
- ✅ **MTN Bénin** → Numéro pré-rempli +229
- ✅ **Moov Bénin** → Numéro pré-rempli +229

### **🇹🇬 Togo**
- ✅ **T-Money Togo** → Numéro pré-rempli +228

### **🇲🇱 Mali**
- ✅ **Orange Money Mali** → Numéro pré-rempli +223
- ✅ **Moov Mali** → Numéro pré-rempli +223

### **🇸🇳 Sénégal**
- ✅ **Wave Sénégal** → Numéro pré-rempli +221
- ✅ **Orange Money Sénégal** → Numéro pré-rempli +221
- ✅ **Free Money Sénégal** → Numéro pré-rempli +221
- ✅ **Expresso Sénégal** → Numéro pré-rempli +221

## 🔍 **Points de Vérification**

### **✅ Interface Utilisateur**
- ✅ **Champ pré-rempli** avec le bon format international
- ✅ **Message informatif** sous le champ téléphone
- ✅ **Possibilité de modification** du numéro
- ✅ **Validation** du format du numéro

### **✅ Fonctionnalité**
- ✅ **Transmission correcte** du numéro au backend
- ✅ **API calls** avec le bon numéro de téléphone
- ✅ **Gestion d'erreur** si le numéro est invalide
- ✅ **Succès** du paiement avec le numéro fourni

### **✅ Expérience Utilisateur**
- ✅ **Pas de saisie répétée** du numéro de téléphone
- ✅ **Flux optimisé** et plus rapide
- ✅ **Réduction des erreurs** de saisie
- ✅ **Interface cohérente** entre les étapes

## 🐛 **Scénarios de Test d'Erreur**

### **❌ Numéro Invalide**
1. **Saisir** un numéro invalide dans le checkout
2. **Vérifier** que la validation fonctionne
3. **Corriger** le numéro et continuer

### **❌ Numéro Vide**
1. **Laisser** le champ téléphone vide
2. **Vérifier** que l'erreur s'affiche
3. **Saisir** un numéro valide

### **❌ Format Incorrect**
1. **Saisir** un numéro sans indicatif pays
2. **Vérifier** que le format est corrigé automatiquement
3. **Continuer** avec le bon format

## 📊 **Résultats Attendus**

### **✅ Succès**
- ✅ **Numéro pré-rempli** dans tous les formulaires
- ✅ **Format international** correct (+225, +229, etc.)
- ✅ **Message informatif** présent
- ✅ **Paiement réussi** avec le numéro fourni

### **❌ Échec**
- ❌ **Champ vide** dans les formulaires de paiement
- ❌ **Format incorrect** du numéro
- ❌ **Erreur API** due au numéro invalide
- ❌ **Interface incohérente** entre les étapes

## 🎉 **Validation Finale**

Si tous les tests passent, le système de numéro pré-rempli est **opérationnel** :

- ✅ **Expérience utilisateur optimisée**
- ✅ **Réduction des erreurs de saisie**
- ✅ **Flux de paiement accéléré**
- ✅ **Cohérence des données**

**Le système est prêt pour la production !** 🚀 