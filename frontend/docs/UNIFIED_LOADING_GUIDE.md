# Guide du Système de Chargement Unifié

## Vue d'ensemble

Le nouveau système de chargement unifié permet de gérer de manière centralisée l'affichage des états de chargement des données de votre base de données, tout en gardant les autres éléments de l'interface visibles.

## Avantages

✅ **Chargement centralisé** : Un seul endroit pour afficher le chargement des données  
✅ **Interface non bloquante** : Les autres éléments restent visibles pendant le chargement  
✅ **Cohérence visuelle** : Tous les chargements se ressemblent  
✅ **Flexibilité** : Support pour différents types de chargement (spinner, skeleton)  
✅ **Performance** : Cache intégré et délais optimisés  

## Architecture

### 1. DataLoadingProvider
Le contexte global qui gère tous les états de chargement.

### 2. DataLoadingOverlay
L'overlay qui affiche le chargement des données sans masquer l'interface.

### 3. Hooks unifiés
- `useUnifiedDataLoading` : Pour les données simples
- `useUnifiedListLoading` : Pour les listes
- `useMultipleResourceLoading` : Pour plusieurs ressources

### 4. Wrappers de contenu
- `UnifiedPageWrapper` : Pour les pages complètes
- `UnifiedContentWrapper` : Pour le contenu général
- `UnifiedSectionWrapper` : Pour les sections avec overlay local

## Utilisation

### 1. Configuration initiale

Le `DataLoadingProvider` est déjà configuré dans `main.tsx` :

```tsx
<DataLoadingProvider>
  {/* Votre application */}
</DataLoadingProvider>
```

### 2. Page avec chargement global

```tsx
import { UnifiedPageWrapper } from '@/components/unified-content-wrapper'
import { useQuery } from '@tanstack/react-query'

function UserListPage() {
  const { data: users, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers
  })

  return (
    <UnifiedPageWrapper
      data={users}
      isLoading={isLoading}
      error={error?.message || null}
      cacheKey="users-page"
      resourceKey="users"
      loadingMessage="Chargement des utilisateurs..."
      loadingType="skeleton"
    >
      {/* Votre contenu */}
      <div className="p-6">
        <h1>Liste des utilisateurs</h1>
        {users?.map(user => (
          <div key={user.id}>{user.name}</div>
        ))}
      </div>
    </UnifiedPageWrapper>
  )
}
```

### 3. Section avec overlay local

```tsx
import { UnifiedSectionWrapper } from '@/components/unified-content-wrapper'

function ProductSection() {
  const { data: products, isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts
  })

  return (
    <UnifiedSectionWrapper
      data={products}
      isLoading={isLoading}
      error={error?.message || null}
      cacheKey="products-section"
      resourceKey="products"
      loadingMessage="Chargement des produits..."
      loadingType="spinner"
      skeleton={<ProductSkeleton />}
    >
      {/* Votre contenu */}
      <div className="grid grid-cols-3 gap-4">
        {products?.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </UnifiedSectionWrapper>
  )
}
```

### 4. Contenu avec chargement global désactivé

```tsx
import { UnifiedContentWrapper } from '@/components/unified-content-wrapper'

function SidebarContent() {
  const { data: categories, isLoading, error } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories
  })

  return (
    <UnifiedContentWrapper
      data={categories}
      isLoading={isLoading}
      error={error?.message || null}
      cacheKey="categories"
      resourceKey="categories"
      showGlobalOverlay={false} // Désactive l'overlay global
      skeleton={<CategorySkeleton />}
      type="list"
    >
      {/* Votre contenu */}
      <nav>
        {categories?.map(category => (
          <CategoryLink key={category.id} category={category} />
        ))}
      </nav>
    </UnifiedContentWrapper>
  )
}
```

### 5. Utilisation directe des hooks

```tsx
import { useUnifiedDataLoading } from '@/hooks/useUnifiedDataLoading'

function CustomComponent() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['custom-data'],
    queryFn: fetchCustomData
  })

  const { showSkeleton, shouldShowContent, shouldShowError } = useUnifiedDataLoading({
    data,
    isLoading,
    error: error?.message || null,
    cacheKey: 'custom-data',
    resourceKey: 'custom-data',
    loadingMessage: 'Chargement...',
    loadingType: 'spinner'
  })

  if (showSkeleton) return <CustomSkeleton />
  if (shouldShowError) return <ErrorMessage error={error} />
  if (shouldShowContent) return <CustomContent data={data} />

  return null
}
```

## Types de chargement

### Spinner
Chargement avec animation circulaire, idéal pour les actions rapides.

```tsx
loadingType="spinner"
```

### Skeleton
Chargement avec squelette, idéal pour les pages et contenus complexes.

```tsx
loadingType="skeleton"
```

## Indicateurs de chargement

### LoadingIndicator
Indicateur discret pour montrer qu'un chargement est en cours :

```tsx
import { LoadingIndicator } from '@/components/data-loading-overlay'

function Header() {
  return (
    <header className="flex items-center justify-between">
      <h1>Mon Application</h1>
      <LoadingIndicator size="md" />
    </header>
  )
}
```

## Gestion du cache

Le système utilise automatiquement le cache existant :

```tsx
// Cache automatique avec TTL de 5 minutes (par défaut)
cacheTtl={5 * 60 * 1000}

// Cache de 10 minutes pour les listes
cacheTtl={10 * 60 * 1000}
```

## Messages personnalisés

Vous pouvez personnaliser les messages de chargement :

```tsx
loadingMessage="Récupération de vos données..."
loadingMessage="Synchronisation en cours..."
loadingMessage="Mise à jour..."
```

## Migration depuis l'ancien système

### Avant (ancien système)
```tsx
function OldComponent() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['data'],
    queryFn: fetchData
  })

  if (isLoading) return <Loading />
  if (error) return <Error error={error} />
  if (!data) return <Empty />

  return <Content data={data} />
}
```

### Après (nouveau système)
```tsx
function NewComponent() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['data'],
    queryFn: fetchData
  })

  return (
    <UnifiedContentWrapper
      data={data}
      isLoading={isLoading}
      error={error?.message || null}
      cacheKey="data"
      resourceKey="data"
      skeleton={<ContentSkeleton />}
    >
      <Content data={data} />
    </UnifiedContentWrapper>
  )
}
```

## Bonnes pratiques

1. **Utilisez des clés uniques** pour `resourceKey` et `cacheKey`
2. **Choisissez le bon type de chargement** selon le contexte
3. **Personnalisez les messages** pour une meilleure UX
4. **Utilisez les skeletons** pour les contenus complexes
5. **Désactivez l'overlay global** pour les éléments secondaires

## Exemples complets

Consultez le fichier `src/components/examples/unified-loading-example.tsx` pour des exemples complets d'utilisation.

## Support

Pour toute question ou problème, consultez la documentation ou contactez l'équipe de développement.
