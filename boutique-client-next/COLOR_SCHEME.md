# 🎨 Schéma de Couleurs Appliqué

## Couleurs Principales

### Mode Clair
- **Primary**: `oklch(0.2274 0.0492 157.66)` - Vert principal
- **Primary Foreground**: `oklch(0.984 0.003 247.858)` - Texte sur primary
- **Background**: `oklch(1 0 0)` - Blanc pur
- **Foreground**: `oklch(0.129 0.042 264.695)` - Texte principal

### Mode Sombre
- **Primary**: `oklch(0.208 0.042 265.755)` - Bleu principal
- **Primary Foreground**: `oklch(0.984 0.003 247.858)` - Texte sur primary
- **Background**: `oklch(0.129 0.042 264.695)` - Fond sombre
- **Foreground**: `oklch(0.984 0.003 247.858)` - Texte clair

## Palette Complète

### Couleurs de Base
```css
--background: oklch(1 0 0)                    /* Blanc pur */
--foreground: oklch(0.129 0.042 264.695)      /* Texte principal */
--card: oklch(1 0 0)                          /* Cartes */
--card-foreground: oklch(0.129 0.042 264.695) /* Texte des cartes */
```

### Couleurs Principales
```css
--primary: oklch(0.2274 0.0492 157.66)        /* Vert principal */
--primary-foreground: oklch(0.984 0.003 247.858) /* Texte sur primary */
--secondary: oklch(0.968 0.007 247.896)       /* Couleur secondaire */
--secondary-foreground: oklch(0.208 0.042 265.755) /* Texte sur secondary */
```

### Couleurs d'Accent
```css
--accent: oklch(0.968 0.007 247.896)          /* Accent */
--accent-foreground: oklch(0.208 0.042 265.755) /* Texte sur accent */
--muted: oklch(0.968 0.007 247.896)           /* Couleur muette */
--muted-foreground: oklch(0.554 0.046 257.417) /* Texte muet */
```

### Couleurs de Bordure
```css
--border: oklch(0.929 0.013 255.508)          /* Bordures */
--input: oklch(0.929 0.013 255.508)           /* Champs de saisie */
--ring: oklch(0.704 0.04 256.788)             /* Anneaux de focus */
```

## Mode Sombre

### Couleurs de Base (Sombre)
```css
--background: oklch(0.129 0.042 264.695)      /* Fond sombre */
--foreground: oklch(0.984 0.003 247.858)      /* Texte clair */
--card: oklch(0.14 0.04 259.21)               /* Cartes sombres */
--card-foreground: oklch(0.984 0.003 247.858) /* Texte des cartes */
```

### Couleurs Principales (Sombre)
```css
--primary: oklch(0.208 0.042 265.755)         /* Bleu principal */
--primary-foreground: oklch(0.984 0.003 247.858) /* Texte sur primary */
--secondary: oklch(0.279 0.041 260.031)       /* Couleur secondaire */
--secondary-foreground: oklch(0.984 0.003 247.858) /* Texte sur secondary */
```

## Utilisation

### Dans les Composants
```tsx
// Bouton principal
<Button className="bg-primary text-primary-foreground">
  Mon Bouton
</Button>

// Carte
<Card className="bg-card text-card-foreground">
  Contenu de la carte
</Card>

// Texte muet
<p className="text-muted-foreground">
  Texte secondaire
</p>
```

### Classes Tailwind
- `bg-primary` - Fond principal
- `text-primary-foreground` - Texte sur fond principal
- `border-border` - Bordure standard
- `bg-muted` - Fond muet
- `text-muted-foreground` - Texte muet

## Avantages

✅ **Cohérence** - Même palette dans toute l'application
✅ **Accessibilité** - Contraste optimal
✅ **Mode sombre** - Support automatique
✅ **Flexibilité** - Facile à personnaliser
✅ **Performance** - Variables CSS optimisées

