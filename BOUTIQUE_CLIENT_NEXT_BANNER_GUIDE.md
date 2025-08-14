# 🎨 Guide de la Bannière Boutique - boutique-client-next

## 🎯 Nouvelle Fonctionnalité : Bannière avec Photo de Profil

### **✨ Fonctionnalités Ajoutées :**

1. **Bannière de boutique** avec design moderne
2. **Photo de profil** de la boutique (logo)
3. **Informations détaillées** de la boutique
4. **Badge de statut** (Active/En attente)
5. **Actions rapides** (Suivre, Contacter)
6. **Métadonnées** (Date de création, évaluations)
7. **Barre d'informations** supplémentaires

## 🎨 Design de la Bannière

### **Structure :**
```
┌─────────────────────────────────────────────────────────┐
│                    BANNIÈRE PRINCIPALE                  │
│  ┌─────────────┐  ┌─────────────────────────────────┐   │
│  │   LOGO      │  │  Nom de la boutique             │   │
│  │  Boutique   │  │  Description                    │   │
│  │             │  │  Métadonnées (date, évaluations)│   │
│  └─────────────┘  └─────────────────────────────────┘   │
│                    [Suivre] [Contacter]                 │
└─────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────┐
│              BARRE D'INFORMATIONS                       │
│  Produits: 24 | Catégories: 6 | Livraison: Immédiate   │
└─────────────────────────────────────────────────────────┘
```

### **Composants :**

#### **1. Photo de Profil (Logo)**
- **Taille** : 24x24 (mobile) / 32x32 (desktop)
- **Style** : Rond avec bordure blanche
- **Fallback** : Icône ShoppingBag si pas de logo
- **Badge** : Statut de la boutique (Active/En attente)

#### **2. Informations de la Boutique**
- **Nom** : Titre principal en blanc
- **Description** : Sous-titre avec opacité
- **Métadonnées** : Date de création, évaluations, localisation

#### **3. Actions Rapides**
- **Suivre** : Bouton transparent avec effet hover
- **Contacter** : Bouton blanc avec texte sombre

#### **4. Barre d'Informations**
- **Produits** : Nombre de produits disponibles
- **Catégories** : Nombre de catégories
- **Livraison** : Type de livraison
- **Évaluations** : Note moyenne et nombre d'avis

## 🔧 Implémentation Technique

### **Composant StoreBanner :**
```tsx
// boutique-client-next/src/components/store-banner.tsx
export function StoreBanner({ store }: StoreBannerProps) {
  return (
    <div className="relative">
      {/* Bannière principale */}
      <div className="relative h-64 md:h-80 bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900">
        {/* Image de bannière (optionnelle) */}
        {store.banner && <img src={store.banner} alt="Bannière" />}
        
        {/* Photo de profil */}
        <div className="w-24 h-24 md:w-32 md:h-32 bg-white rounded-2xl">
          {store.logo ? (
            <img src={store.logo} alt="Logo" />
          ) : (
            <ShoppingBag className="w-12 h-12 text-white" />
          )}
        </div>
        
        {/* Informations et actions */}
      </div>
      
      {/* Barre d'informations */}
      <div className="bg-white border-b border-slate-200">
        {/* Métadonnées supplémentaires */}
      </div>
    </div>
  );
}
```

### **Intégration dans BoutiquePage :**
```tsx
// boutique-client-next/src/components/boutique-page.tsx
export function BoutiquePage({ storeId }: BoutiquePageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-primary/5">
      {/* Bannière de la boutique avec photo de profil */}
      {store && <StoreBanner store={store} />}
      
      {/* Contenu existant (recherche, produits) */}
    </div>
  );
}
```

## 🎨 Styles et Responsive

### **Mobile (< 768px) :**
- **Hauteur bannière** : 256px (h-64)
- **Logo** : 96x96px (w-24 h-24)
- **Layout** : Vertical (flex-col)
- **Actions** : Boutons empilés

### **Desktop (≥ 768px) :**
- **Hauteur bannière** : 320px (h-80)
- **Logo** : 128x128px (w-32 h-32)
- **Layout** : Horizontal (flex-row)
- **Actions** : Boutons côte à côte

### **Couleurs et Thème :**
```css
/* Bannière */
bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900

/* Overlay */
bg-black/30

/* Logo fallback */
bg-gradient-to-br from-slate-600 to-slate-800

/* Boutons */
bg-white/20 hover:bg-white/30 (Suivre)
bg-white hover:bg-white/90 (Contacter)
```

## 📱 Fonctionnalités Interactives

### **1. Badge de Statut**
- **Vert** : Boutique active
- **Jaune** : Boutique en attente
- **Position** : Coin supérieur droit du logo

### **2. Actions Rapides**
- **Suivre** : Ajouter aux favoris
- **Contacter** : Ouvrir formulaire de contact
- **Effets hover** : Transitions fluides

### **3. Métadonnées Dynamiques**
- **Date** : Format français (ex: "15 août 2024")
- **Évaluations** : Note moyenne + nombre d'avis
- **Localisation** : "Boutique en ligne"

## 🚀 Utilisation

### **1. Accès à la Bannière :**
```bash
# URL de test
http://localhost:3000/boutique-test
```

### **2. Données Requises :**
```typescript
interface Store {
  id: string;
  name: string;
  description?: string;
  logo?: string;        // URL de l'image de profil
  banner?: string;      // URL de l'image de bannière
  status: 'active' | 'pending';
  created_at: string;
}
```

### **3. Fallbacks :**
- **Pas de logo** : Icône ShoppingBag
- **Pas de bannière** : Gradient coloré
- **Pas de description** : Texte par défaut

## 🎯 Avantages

### **✅ UX Améliorée :**
- **Identité visuelle** claire de la boutique
- **Informations contextuelles** immédiatement visibles
- **Actions rapides** accessibles
- **Design moderne** et professionnel

### **✅ Responsive :**
- **Mobile-first** design
- **Adaptation automatique** selon la taille d'écran
- **Performance optimisée** avec lazy loading

### **✅ Accessibilité :**
- **Contraste** approprié pour la lisibilité
- **Alt text** pour les images
- **Navigation clavier** supportée

## 🎉 Résultat Final

**La page boutique a maintenant :**
- ✅ **Bannière moderne** avec photo de profil
- ✅ **Informations détaillées** de la boutique
- ✅ **Actions rapides** (Suivre, Contacter)
- ✅ **Design responsive** mobile/desktop
- ✅ **Intégration parfaite** avec l'existant

**La nouvelle bannière transforme l'expérience utilisateur et donne une identité visuelle forte à chaque boutique !** 🚀✨
