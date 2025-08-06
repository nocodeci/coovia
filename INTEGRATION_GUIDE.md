# 🎯 Guide d'Intégration - Sélecteur de Paiement

## 📋 **Intégration Simple**

Le `PaymentMethodSelector` s'affiche automatiquement en dessous de votre sélecteur de pays existant.

---

## 🚀 **Étapes d'Intégration**

### **1. Ajouter les imports**
```typescript
import PaymentMethodSelector from './components/PaymentMethodSelector';
```

### **2. Gérer l'état**
```typescript
const [selectedCountry, setSelectedCountry] = useState('Côte d\'Ivoire');
const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
```

### **3. Placer le composant**
```typescript
return (
  <div>
    {/* Votre sélecteur de pays existant */}
    <div className="relative">
      <button type="button" className="flex items-center space-x-3 w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-lg hover:border-gray-300 transition-all duration-200">
        <img data-testid="circle-country-flag" className="w-5 h-5 rounded-full" title="ci" height="100" src="https://react-circle-flags.pages.dev/ci.svg">
        <span className="text-sm font-medium text-gray-900">Côte d'Ivoire</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-down w-4 h-4 text-gray-400 ml-auto" aria-hidden="true">
          <path d="m6 9 6 6 6-6"></path>
        </svg>
      </button>
    </div>

    {/* Sélecteur de méthodes de paiement - s'affiche automatiquement */}
    <PaymentMethodSelector
      selectedCountry={selectedCountry}
      onMethodSelect={setSelectedPaymentMethod}
      selectedMethod={selectedPaymentMethod}
    />
  </div>
);
```

---

## ✨ **Fonctionnalités Automatiques**

### **Affichage Conditionnel**
- ✅ **S'affiche** quand un pays est sélectionné
- ✅ **Se masque** quand aucun pays n'est sélectionné
- ✅ **S'adapte** selon les méthodes disponibles

### **Gestion d'État**
- ✅ **Réinitialise** la méthode quand le pays change
- ✅ **Mémorise** la sélection pour chaque pays
- ✅ **Valide** automatiquement les méthodes disponibles

### **Interface Responsive**
- ✅ **Mobile** : Scroll horizontal avec navigation
- ✅ **Desktop** : Affichage complet
- ✅ **Tablet** : Adaptation automatique

---

## 🎨 **Design Intégré**

### **Espacement**
- `mt-3` : Espacement optimal après le sélecteur de pays
- `py-3` : Padding vertical réduit pour un design compact
- `space-x-3` : Espacement horizontal entre les méthodes

### **Tailles**
- `w-8 h-8` : Icônes compactes (32px)
- `w-5 h-5` : Images des opérateurs (20px)
- `text-xs` : Texte petit pour les noms

### **États Visuels**
- **Normal** : Fond blanc, bordure grise
- **Hover** : Fond gris clair
- **Sélectionné** : Anneau bleu, fond bleu clair
- **Badge** : Icône de validation verte

---

## 🔧 **Configuration par Pays**

### **🇨🇮 Côte d'Ivoire**
- Wave CI
- Orange Money CI
- MTN MoMo CI
- Moov Money CI

### **🇧🇯 Bénin**
- MTN Bénin
- Moov Bénin

### **🇹🇬 Togo**
- T-Money Togo

### **🇲🇱 Mali**
- Orange Money Mali
- Moov Mali

### **🇸🇳 Sénégal**
- Wave Sénégal
- Orange Money Sénégal
- Free Money Sénégal
- Expresso Sénégal

### **🇧🇫 Burkina Faso**
- Orange Money Burkina
- Moov Burkina

---

## 📱 **Responsive Design**

### **Mobile (< 768px)**
- Scroll horizontal avec navigation
- Boutons de navigation visibles
- Espacement optimisé

### **Desktop (> 1024px)**
- Affichage complet
- Navigation masquée si peu d'options
- Hover effects

---

## ✅ **Avantages**

1. **Intégration Simple** : Un seul composant à ajouter
2. **Design Cohérent** : S'adapte à votre interface existante
3. **Fonctionnement Automatique** : Pas de configuration complexe
4. **Performance Optimisée** : Rendu conditionnel et lazy loading
5. **Accessibilité** : Support clavier et ARIA labels

---

## 🚀 **Prêt pour Production**

Le composant est **100% fonctionnel** et prêt pour l'intégration dans votre checkout !

**Intégration réussie !** 🎉 