import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { UnifiedContentWrapper, UnifiedPageWrapper, UnifiedSectionWrapper } from '@/components/unified-content-wrapper'
import { ListLoadingSkeleton, DashboardLoadingSkeleton } from '@/components/optimized-loading'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { LoadingIndicator } from '@/components/data-loading-overlay'

// Exemple de données simulées
interface User {
  id: number
  name: string
  email: string
  role: string
}

interface Product {
  id: number
  name: string
  price: number
  category: string
}

// Service simulé pour les données
const fetchUsers = async (): Promise<User[]> => {
  await new Promise(resolve => setTimeout(resolve, 2000)) // Simulation d'un délai
  return [
    { id: 1, name: 'Jean Dupont', email: 'jean@example.com', role: 'Admin' },
    { id: 2, name: 'Marie Martin', email: 'marie@example.com', role: 'User' },
    { id: 3, name: 'Pierre Durand', email: 'pierre@example.com', role: 'User' }
  ]
}

const fetchProducts = async (): Promise<Product[]> => {
  await new Promise(resolve => setTimeout(resolve, 1500)) // Simulation d'un délai
  return [
    { id: 1, name: 'Produit A', price: 29.99, category: 'Électronique' },
    { id: 2, name: 'Produit B', price: 49.99, category: 'Vêtements' },
    { id: 3, name: 'Produit C', price: 19.99, category: 'Livres' }
  ]
}

// Exemple 1: Page avec chargement global
export function ExamplePage() {
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
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Liste des Utilisateurs</h1>
        <div className="grid gap-4">
          {users?.map(user => (
            <Card key={user.id}>
              <CardHeader>
                <CardTitle>{user.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Email: {user.email}</p>
                <p>Rôle: {user.role}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </UnifiedPageWrapper>
  )
}

// Exemple 2: Section avec overlay local
export function ExampleSection() {
  const { data: products, isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts
  })

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Produits</h2>
        <LoadingIndicator size="md" />
      </div>
      
      <UnifiedSectionWrapper
        data={products}
        isLoading={isLoading}
        error={error?.message || null}
        cacheKey="products-section"
        resourceKey="products"
        loadingMessage="Chargement des produits..."
        loadingType="spinner"
        skeleton={
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded animate-pulse" />
                    <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3" />
                    <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {products?.map(product => (
            <Card key={product.id}>
              <CardHeader>
                <CardTitle>{product.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Prix: {product.price}€</p>
                <p>Catégorie: {product.category}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </UnifiedSectionWrapper>
    </div>
  )
}

// Exemple 3: Contenu avec chargement global désactivé
export function ExampleContent() {
  const { data: users, isLoading, error } = useQuery({
    queryKey: ['users-list'],
    queryFn: fetchUsers
  })

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Utilisateurs (Chargement local)</h2>
      
      <UnifiedContentWrapper
        data={users}
        isLoading={isLoading}
        error={error?.message || null}
        cacheKey="users-list"
        resourceKey="users-list"
        showGlobalOverlay={false} // Désactive l'overlay global
        skeleton={<ListLoadingSkeleton />}
        type="list"
      >
        <div className="grid gap-4">
          {users?.map(user => (
            <Card key={user.id}>
              <CardContent className="p-4">
                <h3 className="font-semibold">{user.name}</h3>
                <p className="text-sm text-gray-600">{user.email}</p>
                <span className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                  {user.role}
                </span>
              </CardContent>
            </Card>
          ))}
        </div>
      </UnifiedContentWrapper>
    </div>
  )
}

// Exemple 4: Dashboard avec chargement multiple
export function ExampleDashboard() {
  const { data: users, isLoading: usersLoading, error: usersError } = useQuery({
    queryKey: ['dashboard-users'],
    queryFn: fetchUsers
  })

  const { data: products, isLoading: productsLoading, error: productsError } = useQuery({
    queryKey: ['dashboard-products'],
    queryFn: fetchProducts
  })

  const isLoading = usersLoading || productsLoading
  const error = usersError?.message || productsError?.message || null

  return (
    <UnifiedPageWrapper
      data={users && products ? { users, products } : null}
      isLoading={isLoading}
      error={error}
      cacheKey="dashboard"
      resourceKey="dashboard"
      loadingMessage="Chargement du tableau de bord..."
      loadingType="skeleton"
    >
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Tableau de Bord</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Section Utilisateurs */}
          <Card>
            <CardHeader>
              <CardTitle>Utilisateurs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {users?.map(user => (
                  <div key={user.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span>{user.name}</span>
                    <span className="text-sm text-gray-600">{user.role}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Section Produits */}
          <Card>
            <CardHeader>
              <CardTitle>Produits</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {products?.map(product => (
                  <div key={product.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span>{product.name}</span>
                    <span className="text-sm text-gray-600">{product.price}€</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </UnifiedPageWrapper>
  )
}
