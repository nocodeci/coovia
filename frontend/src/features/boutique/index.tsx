import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from '@tanstack/react-router'
import { Search, Filter, Grid, List, ShoppingCart, Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useCart } from './hooks/useCart'
import { ProductCard } from './components/ProductCard'
import { FilterSidebar } from './components/FilterSidebar'
import { CartDrawer } from './components/CartDrawer'

interface Product {
  id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  images: string[]
  category: string
  tags: string[]
  inStock: boolean
  rating: number
  reviewCount: number
}

export default function BoutiquePage() {
  const navigate = useNavigate()
  const { storeId } = useParams({ from: '/boutique/$storeId' })
  const { cartItems, addToCart, removeFromCart, updateQuantity, cartTotal } = useCart()
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState('name')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(false)
  const [showCart, setShowCart] = useState(false)

  // Mock data - à remplacer par une vraie API
  useEffect(() => {
    const mockProducts: Product[] = [
      {
        id: '1',
        name: 'Smartphone Galaxy S23',
        description: 'Le dernier smartphone Samsung avec des performances exceptionnelles',
        price: 899.99,
        originalPrice: 999.99,
        images: ['/assets/images/products/phone1.jpg', '/assets/images/products/phone2.jpg'],
        category: 'Electronics',
        tags: ['smartphone', 'samsung', '5G'],
        inStock: true,
        rating: 4.5,
        reviewCount: 128
      },
      {
        id: '2',
        name: 'Laptop MacBook Pro',
        description: 'Ordinateur portable Apple avec puce M2',
        price: 1499.99,
        images: ['/assets/images/products/laptop1.jpg'],
        category: 'Electronics',
        tags: ['laptop', 'apple', 'macbook'],
        inStock: true,
        rating: 4.8,
        reviewCount: 89
      },
      {
        id: '3',
        name: 'Casque Audio Sony',
        description: 'Casque sans fil avec réduction de bruit',
        price: 299.99,
        originalPrice: 349.99,
        images: ['/assets/images/products/headphones1.jpg'],
        category: 'Electronics',
        tags: ['audio', 'wireless', 'noise-cancelling'],
        inStock: true,
        rating: 4.3,
        reviewCount: 156
      }
    ]
    
    setProducts(mockProducts)
    setFilteredProducts(mockProducts)
    setLoading(false)
  }, [])

  // Filtrage et tri des produits
  useEffect(() => {
    let filtered = products

    // Filtre par recherche
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    // Filtre par catégorie
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory)
    }

    // Tri
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':
          return a.price - b.price
        case 'price-desc':
          return b.price - a.price
        case 'rating':
          return b.rating - a.rating
        case 'name':
        default:
          return a.name.localeCompare(b.name)
      }
    })

    setFilteredProducts(filtered)
  }, [products, searchTerm, selectedCategory, sortBy])

  const categories = ['all', ...Array.from(new Set(products.map(p => p.category)))]

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden"
              >
                <Filter className="h-4 w-4" />
              </Button>
              <h1 className="text-xl font-semibold text-gray-900">Boutique</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowCart(true)}
                className="relative"
              >
                <ShoppingCart className="h-5 w-5" />
                {cartItems.length > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                    {cartItems.length}
                  </Badge>
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <FilterSidebar
            showFilters={showFilters}
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            onClose={() => setShowFilters(false)}
          />

          {/* Main Content */}
          <div className="flex-1">
            {/* Search and Sort */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Rechercher des produits..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Nom A-Z</SelectItem>
                    <SelectItem value="price-asc">Prix croissant</SelectItem>
                    <SelectItem value="price-desc">Prix décroissant</SelectItem>
                    <SelectItem value="rating">Meilleures notes</SelectItem>
                  </SelectContent>
                </Select>
                
                <div className="flex border rounded-md">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className="rounded-r-none"
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className="rounded-l-none"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Results Count */}
            <div className="mb-4">
              <p className="text-sm text-gray-600">
                {filteredProducts.length} produit{filteredProducts.length !== 1 ? 's' : ''} trouvé{filteredProducts.length !== 1 ? 's' : ''}
              </p>
            </div>

            {/* Products Grid */}
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">Aucun produit trouvé</p>
              </div>
            ) : (
              <div className={viewMode === 'grid' 
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                : "space-y-4"
              }>
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    viewMode={viewMode}
                    onAddToCart={() => addToCart(product)}
                    onViewProduct={() => navigate({ to: `/${storeId}/boutique/produit/${product.id}` })}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Cart Drawer */}
      <CartDrawer
        open={showCart}
        onClose={() => setShowCart(false)}
        cartItems={cartItems}
        onRemoveItem={removeFromCart}
        onUpdateQuantity={updateQuantity}
        cartTotal={cartTotal}
        onCheckout={() => navigate({ to: `/${storeId}/boutique/checkout` })}
      />
    </div>
  )
} 