import React from 'react'
import { Star, ShoppingCart, Heart, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

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

interface ProductCardProps {
  product: Product
  viewMode: 'grid' | 'list'
  onAddToCart: () => void
  onViewProduct: () => void
}

export function ProductCard({ product, viewMode, onAddToCart, onViewProduct }: ProductCardProps) {
  const discount = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  if (viewMode === 'list') {
    return (
      <Card className="flex flex-row overflow-hidden">
        <div className="w-32 h-32 flex-shrink-0">
          <img
            src={product.images[0] || '/assets/images/placeholder.jpg'}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="flex-1 p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
              
              <div className="flex items-center space-x-4 mb-3">
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm text-gray-600">{product.rating}</span>
                  <span className="text-sm text-gray-500">({product.reviewCount})</span>
                </div>
                
                <Badge variant={product.inStock ? "default" : "secondary"}>
                  {product.inStock ? "En stock" : "Rupture"}
                </Badge>
              </div>
            </div>
            
            <div className="text-right ml-4">
              <div className="mb-2">
                {product.originalPrice && (
                  <span className="text-sm text-gray-500 line-through">
                    {product.originalPrice.toFixed(2)} €
                  </span>
                )}
                <div className="text-xl font-bold text-green-600">
                  {product.price.toFixed(2)} €
                </div>
                {discount > 0 && (
                  <Badge variant="destructive" className="text-xs">
                    -{discount}%
                  </Badge>
                )}
              </div>
              
              <div className="flex space-x-2">
                <Button size="sm" onClick={onViewProduct} variant="outline">
                  <Eye className="h-4 w-4" />
                </Button>
                <Button size="sm" onClick={onAddToCart} disabled={!product.inStock}>
                  <ShoppingCart className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card className="group hover:shadow-lg transition-shadow duration-200 overflow-hidden">
      <CardHeader className="p-0 relative">
        <div className="relative aspect-square overflow-hidden">
          <img
            src={product.images[0] || '/assets/images/placeholder.jpg'}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          />
          
          {/* Overlay avec actions */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-2">
              <Button size="sm" variant="secondary" onClick={onViewProduct}>
                <Eye className="h-4 w-4" />
              </Button>
              <Button size="sm" onClick={onAddToCart} disabled={!product.inStock}>
                <ShoppingCart className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col space-y-1">
            {discount > 0 && (
              <Badge variant="destructive" className="text-xs">
                -{discount}%
              </Badge>
            )}
            {!product.inStock && (
              <Badge variant="secondary" className="text-xs">
                Rupture
              </Badge>
            )}
          </div>
          
          <Button
            size="sm"
            variant="ghost"
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          >
            <Heart className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="p-4">
        <div className="mb-2">
          <h3 className="font-semibold text-sm mb-1 line-clamp-1">{product.name}</h3>
          <p className="text-gray-600 text-xs line-clamp-2">{product.description}</p>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            <span className="text-xs text-gray-600">{product.rating}</span>
            <span className="text-xs text-gray-500">({product.reviewCount})</span>
          </div>
          
          <div className="text-right">
            {product.originalPrice && (
              <span className="text-xs text-gray-500 line-through block">
                {product.originalPrice.toFixed(2)} €
              </span>
            )}
            <span className="font-bold text-green-600">
              {product.price.toFixed(2)} €
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 