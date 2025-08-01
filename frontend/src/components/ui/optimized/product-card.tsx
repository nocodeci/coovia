import React, { memo, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { ShoppingCart, Heart, Eye, Star } from 'lucide-react'
import { cn } from '@/lib/utils'

// Types optimisés
interface ProductCardProps {
  product: {
    id: string
    name: string
    description: string
    price: number
    originalPrice?: number
    images?: Array<{ url: string; thumbnail?: string }>
    rating?: number
    reviewCount?: number
    stock?: number
    status: 'active' | 'inactive' | 'draft' | 'archived'
    store?: { name: string }
  }
  onAddToCart?: (productId: string) => void
  onAddToWishlist?: (productId: string) => void
  onView?: (productId: string) => void
  className?: string
  variant?: 'default' | 'compact' | 'featured'
}

// Skeleton optimisé pour le loading
const ProductCardSkeleton = memo(() => (
  <Card className="overflow-hidden">
    <div className="aspect-square bg-gray-200 animate-pulse" />
    <CardContent className="p-4 space-y-2">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
      <Skeleton className="h-6 w-1/3" />
    </CardContent>
  </Card>
))

ProductCardSkeleton.displayName = 'ProductCardSkeleton'

// Composant principal optimisé
const ProductCard = memo<ProductCardProps>(({
  product,
  onAddToCart,
  onAddToWishlist,
  onView,
  className,
  variant = 'default'
}) => {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  // Callbacks optimisés avec useCallback
  const handleImageLoad = useCallback(() => {
    setImageLoaded(true)
  }, [])

  const handleImageError = useCallback(() => {
    setImageError(true)
    setImageLoaded(true)
  }, [])

  const handleAddToCart = useCallback(() => {
    onAddToCart?.(product.id)
  }, [product.id, onAddToCart])

  const handleAddToWishlist = useCallback(() => {
    onAddToWishlist?.(product.id)
  }, [product.id, onAddToWishlist])

  const handleView = useCallback(() => {
    onView?.(product.id)
  }, [product.id, onView])

  // Calculs optimisés
  const discount = product.originalPrice ? 
    Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0

  const mainImage = product.images?.[0]?.thumbnail || product.images?.[0]?.url
  const fallbackImage = '/placeholder-product.jpg'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={cn(
        'group relative',
        variant === 'compact' && 'col-span-1',
        variant === 'featured' && 'col-span-2',
        className
      )}
    >
      <Card className={cn(
        'overflow-hidden transition-all duration-300',
        'hover:shadow-lg hover:scale-[1.02]',
        'border-0 shadow-sm',
        variant === 'featured' && 'h-full'
      )}>
        {/* Image Container avec Lazy Loading */}
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          <AnimatePresence mode="wait">
            {!imageLoaded && (
              <motion.div
                key="skeleton"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0"
              >
                <Skeleton className="w-full h-full" />
              </motion.div>
            )}
          </AnimatePresence>

          <img
            src={imageError ? fallbackImage : mainImage}
            alt={product.name}
            className={cn(
              'w-full h-full object-cover transition-opacity duration-300',
              imageLoaded ? 'opacity-100' : 'opacity-0'
            )}
            loading="lazy"
            onLoad={handleImageLoad}
            onError={handleImageError}
          />

          {/* Badge de réduction */}
          {discount > 0 && (
            <Badge className="absolute top-2 left-2 bg-red-500 text-white">
              -{discount}%
            </Badge>
          )}

          {/* Actions au survol */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute inset-0 bg-black/20 flex items-center justify-center gap-2"
              >
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={handleView}
                  className="bg-white/90 hover:bg-white"
                >
                  <Eye className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={handleAddToWishlist}
                  className="bg-white/90 hover:bg-white"
                >
                  <Heart className="w-4 h-4" />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Contenu */}
        <CardContent className="p-4 space-y-2">
          {/* Nom du produit */}
          <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>

          {/* Store name */}
          {product.store && (
            <p className="text-xs text-muted-foreground">
              {product.store.name}
            </p>
          )}

          {/* Rating */}
          {product.rating && (
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              <span className="text-xs text-muted-foreground">
                {product.rating.toFixed(1)}
                {product.reviewCount && ` (${product.reviewCount})`}
              </span>
            </div>
          )}

          {/* Prix */}
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg">
              {product.price.toFixed(2)} €
            </span>
            {product.originalPrice && (
              <span className="text-sm text-muted-foreground line-through">
                {product.originalPrice.toFixed(2)} €
              </span>
            )}
          </div>

          {/* Stock */}
          {product.stock !== undefined && (
            <div className="text-xs text-muted-foreground">
              {product.stock > 0 ? `${product.stock} en stock` : 'Rupture de stock'}
            </div>
          )}
        </CardContent>

        {/* Footer avec actions */}
        <CardFooter className="p-4 pt-0">
          <Button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="w-full"
            size="sm"
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Ajouter au panier
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
})

ProductCard.displayName = 'ProductCard'

export { ProductCard, ProductCardSkeleton } 