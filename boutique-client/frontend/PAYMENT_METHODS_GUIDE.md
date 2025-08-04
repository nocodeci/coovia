# Guide des Méthodes de Paiement

## 📁 Structure des Images

### Dossier : `frontend/public/assets/images/payment-methods/`

## 🖼️ Images Disponibles

### ✅ Wave
- **Image** : Pingouin bleu avec texte "Wave"
- **Fichiers** : `wave-ci.png`, `wave-senegal.png`
- **Pays** : Côte d'Ivoire, Sénégal

### ✅ Orange Money
- **Image** : Logo avec flèches blanche et orange + texte "Orange Money"
- **Fichiers** : `orange-money-ci.png`, `orange-money-senegal.png`
- **Pays** : Côte d'Ivoire, Sénégal

### ✅ MTN
- **Image** : Logo "MTN" noir sur fond jaune
- **Fichiers** : `mtn-ci.png`, `mtn-benin.png`
- **Pays** : Côte d'Ivoire, Bénin

### ✅ Moov Money
- **Image** : Logo "Moov Africa" blanc sur fond bleu avec croissant orange
- **Fichiers** : `moov-ci.png`, `moov-senegal.png`, `moov-burkina.png`, `moov-benin.png`, `moov-togo.png`, `moov-mali.png`
- **Pays** : Côte d'Ivoire, Sénégal, Burkina Faso, Bénin, Togo, Mali

## 📋 Images Manquantes

### 🔄 En attente
- **Free Money** : `free-money-senegal.png`
- **Expresso** : `expresso-senegal.png`
- **Wizall** : `wizall-senegal.png`
- **T-Money** : `t-money-togo.png`
- **PayDunya** : `paydunya.png`
- **Carte bancaire** : `card.png`

## 🎯 Instructions d'Ajout

### 1. Format des Images
- **Taille recommandée** : 64x64px ou 48x48px
- **Format** : PNG avec fond transparent
- **Qualité** : Haute résolution pour l'affichage

### 2. Nommage des Fichiers
```
{method}-{country}.png
Exemples :
- wave-ci.png
- orange-money-senegal.png
- mtn-benin.png
- moov-ci.png
```

### 3. Ajout des Images
1. Sauvegardez l'image avec le bon nom
2. Placez-la dans `frontend/public/assets/images/payment-methods/`
3. Vérifiez que l'image s'affiche correctement

## 🔧 Configuration

### Fichier de Configuration
```typescript
// frontend/src/data/payment-methods.ts
// Toutes les méthodes sont déjà configurées
```

### Composant de Sélection
```typescript
// frontend/src/components/PaymentMethodSelector.tsx
// Interface pour sélectionner les méthodes
```

## 🚀 Utilisation

```typescript
import { PaymentMethodSelector } from '../components/PaymentMethodSelector';

<PaymentMethodSelector
  selectedCountry="Côte d'Ivoire"
  onMethodSelect={(method) => {
    console.log('Méthode sélectionnée:', method);
  }}
/>
```

## ✅ Progression

- [x] Wave CI & Sénégal
- [x] Orange Money CI & Sénégal  
- [x] MTN CI & Bénin
- [x] Moov Money (tous pays)
- [ ] Free Money Sénégal
- [ ] Expresso Sénégal
- [ ] Wizall Sénégal
- [ ] T-Money Togo
- [ ] PayDunya
- [ ] Carte bancaire

## 📊 Statistiques

### Méthodes par pays :
- **Côte d'Ivoire** : 4 méthodes (Wave, Orange Money, MTN, Moov)
- **Sénégal** : 5 méthodes (Wave, Orange Money, Free Money, Expresso, Wizall)
- **Burkina Faso** : 2 méthodes (Orange Money, Moov)
- **Bénin** : 2 méthodes (MTN, Moov)
- **Togo** : 2 méthodes (T-Money, Moov)
- **Mali** : 2 méthodes (Orange Money, Moov)
