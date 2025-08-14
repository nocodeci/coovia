# 🧪 Guide de test des composants shadcn/ui

## 🚀 Comment tester les composants

### **1. Démarrer l'application**
```bash
cd boutique-client
npm start
```

### **2. Accéder à la page de test**
Ouvrez votre navigateur et allez à :
```
http://localhost:3000/test
```

### **3. Vérifier les composants**

La page de test affiche tous les composants shadcn/ui avec leurs variantes :

#### **🎨 Boutons**
- Bouton par défaut (vert)
- Bouton secondaire
- Bouton contour
- Bouton destructif (rouge)
- Bouton fantôme
- Bouton lien

#### **📋 Cartes**
- Cartes avec titre et description
- Cartes avec badges et boutons
- Design cohérent avec le thème

#### **⏳ Indicateurs de chargement**
- Spinner (petit, moyen, grand)
- Points animés
- Pulse

#### **⚠️ Alertes**
- Alerte par défaut
- Alerte d'erreur (rouge)
- Alerte de succès (vert)
- Alerte d'avertissement (jaune)
- Alerte d'information (bleu)

#### **🏷️ Badges**
- Badge par défaut
- Badge secondaire
- Badge destructif
- Badge contour
- Badge succès
- Badge attention
- Badge info

#### **📊 Statuts**
- En ligne (vert)
- Hors ligne (gris)
- Succès
- Attention
- Information
- Erreur

## 🎨 Couleurs du thème

### **Mode clair**
- **Primaire** : Vert foncé (#12372a)
- **Secondaire** : Vert moyen (#1a4d35)
- **Accent** : Vert très clair
- **Muté** : Vert ultra clair

### **Mode sombre**
- **Primaire** : Vert clair
- **Secondaire** : Vert sombre
- **Accent** : Vert moyen sombre
- **Muté** : Vert très sombre

## 🔧 Utilisation dans le code

### **Importer les composants**
```tsx
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Loader,
  Alert,
  AlertDescription,
  Badge,
  Separator,
  Status,
} from './components/ui';
```

### **Exemples d'utilisation**

#### **Bouton**
```tsx
<Button variant="default">Cliquez-moi</Button>
<Button variant="secondary">Secondaire</Button>
<Button variant="destructive">Supprimer</Button>
```

#### **Carte**
```tsx
<Card>
  <CardHeader>
    <CardTitle>Titre</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>
    Contenu de la carte
  </CardContent>
</Card>
```

#### **Loader**
```tsx
<Loader size="lg" variant="spinner" />
<Loader size="md" variant="dots" />
<Loader size="sm" variant="pulse" />
```

#### **Alerte**
```tsx
<Alert variant="destructive">
  <AlertDescription>Message d'erreur</AlertDescription>
</Alert>
```

#### **Badge**
```tsx
<Badge variant="success">Succès</Badge>
<Badge variant="warning">Attention</Badge>
```

#### **Statut**
```tsx
<Status variant="online">En ligne</Status>
<Status variant="offline">Hors ligne</Status>
```

## 🎯 Fonctionnalités testées

- ✅ **Couleurs cohérentes** avec le thème Wozif
- ✅ **Responsive design** sur mobile et desktop
- ✅ **Accessibilité** avec les attributs ARIA
- ✅ **Animations** fluides et modernes
- ✅ **Variantes** pour chaque composant
- ✅ **Intégration** avec Tailwind CSS

## 🔄 Prochaines étapes

1. **Tester sur différents navigateurs**
2. **Vérifier l'accessibilité** avec des lecteurs d'écran
3. **Optimiser les performances**
4. **Ajouter des animations** plus avancées
5. **Créer des composants** supplémentaires

---

*Testez tous les composants pour vous assurer qu'ils fonctionnent parfaitement avec votre thème !*

