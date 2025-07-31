# 🎯 Guide d'Utilisation - Sélecteur de Médias

## ✅ **Composants Créés**

### **1. MediaSelector**
Modal complet pour sélectionner et uploader des médias
- 🔍 **Recherche** et filtrage
- 📤 **Upload** de nouveaux fichiers
- ✅ **Sélection** unique ou multiple
- 🖼️ **Vue** grille ou liste

### **2. MediaDisplay**
Affichage des médias sélectionnés
- 📋 **Liste** des médias choisis
- 🗑️ **Suppression** individuelle
- 📊 **Compteur** pour les médias supplémentaires

### **3. MediaField**
Champ de formulaire intégré
- 🎯 **Intégration** facile dans les formulaires
- 📏 **Limites** configurables
- 🔄 **Gestion** automatique des sélections

## 🚀 **Utilisation dans les Formulaires**

### **Exemple : Formulaire de Produit**
```tsx
import React, { useState } from 'react'
import MediaField from '@/components/MediaField'
import { MediaItem } from '@/services/mediaService'

function ProductForm({ storeId }: { storeId: string }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    images: [] as MediaItem[],
    documents: [] as MediaItem[]
  })

  return (
    <form className="space-y-6">
      {/* Champs de base */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Nom du produit
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
        />
      </div>

      {/* Images du produit */}
      <MediaField
        label="Images du produit"
        value={formData.images}
        onChange={(images) => setFormData({...formData, images})}
        storeId={storeId}
        allowMultiple={true}
        maxItems={5}
        placeholder="Sélectionner des images"
      />

      {/* Documents associés */}
      <MediaField
        label="Documents associés"
        value={formData.documents}
        onChange={(documents) => setFormData({...formData, documents})}
        storeId={storeId}
        allowMultiple={true}
        maxItems={10}
        placeholder="Sélectionner des documents"
      />

      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        Créer le produit
      </button>
    </form>
  )
}
```

## 🎯 **Fonctionnalités Avancées**

### **1. Sélection Unique**
```tsx
<MediaField
  label="Image principale"
  value={[mainImage]}
  onChange={(images) => setMainImage(images[0])}
  storeId={storeId}
  allowMultiple={false}
  maxItems={1}
  placeholder="Sélectionner une image"
/>
```

### **2. Sélection Multiple avec Limite**
```tsx
<MediaField
  label="Galerie d'images"
  value={galleryImages}
  onChange={setGalleryImages}
  storeId={storeId}
  allowMultiple={true}
  maxItems={10}
  placeholder="Sélectionner jusqu'à 10 images"
/>
```

### **3. Filtrage par Type**
```tsx
// Dans MediaSelector, le filtre est automatiquement appliqué
// selon le contexte d'utilisation
```

## 📊 **Structure des Données**

### **MediaItem Interface**
```typescript
interface MediaItem {
  id: string
  store_id: string
  name: string
  type: 'image' | 'video' | 'document' | 'audio'
  size: number
  url: string
  thumbnail?: string
  mime_type: string
  metadata: any
  created_at: string
  updated_at: string
}
```

### **Envoi au Backend**
```typescript
// Lors de la soumission du formulaire
const productData = {
  name: formData.name,
  description: formData.description,
  price: formData.price,
  images: formData.images.map(img => img.id), // IDs des médias
  documents: formData.documents.map(doc => doc.id)
}
```

## 🎨 **Personnalisation**

### **1. Styles Personnalisés**
```tsx
<MediaField
  label="Images"
  value={images}
  onChange={setImages}
  storeId={storeId}
  className="custom-media-field"
  placeholder="Glissez vos images ici"
/>
```

### **2. Validation Avancée**
```tsx
const handleMediaChange = (media: MediaItem[]) => {
  // Validation personnalisée
  const imageFiles = media.filter(m => m.type === 'image')
  const documentFiles = media.filter(m => m.type === 'document')
  
  if (imageFiles.length > 5) {
    alert('Maximum 5 images autorisées')
    return
  }
  
  setFormData({...formData, images: imageFiles, documents: documentFiles})
}
```

## 🧪 **Tests d'Intégration**

### **Test 1 : Sélection d'Images**
1. **Cliquer** sur "Sélectionner des images"
2. **Ouvrir** le modal MediaSelector
3. **Rechercher** des images existantes
4. **Uploader** de nouvelles images
5. **Sélectionner** les images souhaitées
6. **Vérifier** que les images s'affichent dans le formulaire

### **Test 2 : Gestion des Limites**
1. **Sélectionner** le nombre maximum d'images
2. **Essayer** d'ajouter une image supplémentaire
3. **Vérifier** que l'alerte s'affiche
4. **Supprimer** une image
5. **Vérifier** qu'on peut ajouter une nouvelle image

### **Test 3 : Suppression**
1. **Sélectionner** plusieurs médias
2. **Cliquer** sur le bouton X d'un média
3. **Vérifier** que le média est supprimé
4. **Vérifier** que le compteur se met à jour

## 🚀 **Intégration dans l'Application**

### **1. Formulaire de Produit**
```tsx
// Dans le formulaire d'ajout de produit
<MediaField
  label="Images du produit"
  value={productImages}
  onChange={setProductImages}
  storeId={storeId}
  allowMultiple={true}
  maxItems={5}
/>
```

### **2. Formulaire de Catégorie**
```tsx
// Dans le formulaire de catégorie
<MediaField
  label="Image de la catégorie"
  value={categoryImage}
  onChange={setCategoryImage}
  storeId={storeId}
  allowMultiple={false}
  maxItems={1}
/>
```

### **3. Formulaire de Document**
```tsx
// Dans le formulaire de document
<MediaField
  label="Fichiers associés"
  value={attachments}
  onChange={setAttachments}
  storeId={storeId}
  allowMultiple={true}
  maxItems={10}
/>
```

## 🎉 **Avantages**

### **1. Réutilisabilité**
- ✅ **Composant** réutilisable dans toute l'application
- 🔧 **Configuration** flexible
- 🎯 **Intégration** facile

### **2. Expérience Utilisateur**
- 🖼️ **Prévisualisation** des médias
- 🔍 **Recherche** et filtrage
- 📤 **Upload** intégré
- 🗑️ **Suppression** intuitive

### **3. Performance**
- ⚡ **Chargement** optimisé
- 📊 **Pagination** automatique
- 🖼️ **Thumbnails** générés automatiquement

**Le sélecteur de médias est maintenant prêt à être intégré dans tous les formulaires !** 🚀 