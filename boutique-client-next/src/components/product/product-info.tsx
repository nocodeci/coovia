'use client';

import { Star, Heart, Share2, Download, ShoppingBag } from 'lucide-react';
import { Product } from '@/types/store';
import { Button, Badge } from '@/components/ui';

interface ProductInfoProps {
  product: Product;
  onShare: () => void;
  onWishlist: () => void;
  onAddToCart: () => void;
}

export function ProductInfo({ product, onShare, onWishlist, onAddToCart }: ProductInfoProps) {
  // Formater le prix
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Calculer la réduction
  const discount = product.original_price && product.original_price > product.price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* Product Header */}
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-foreground mb-2">
              {product.name}
            </h1>
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="secondary">{product.category}</Badge>
              {product.type && (
                <Badge variant="outline">{product.type}</Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <span className="text-sm text-muted-foreground ml-1">
                  {product.rating || 4.5}
                </span>
              </div>
              <span className="text-sm text-muted-foreground">
                ({Math.floor(Math.random() * 100) + 10} avis)
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={onShare}>
              <Share2 className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={onWishlist}>
              <Heart className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Price Section */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <span className="text-3xl font-bold text-primary">
            {formatPrice(product.price)}
          </span>
          {discount > 0 && (
            <Badge variant="destructive" className="text-xs">
              -{discount}%
            </Badge>
          )}
        </div>
        {product.original_price && product.original_price > product.price && (
          <div className="text-sm text-muted-foreground line-through">
            {formatPrice(product.original_price)}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <Button 
          className="w-full" 
          size="lg"
          onClick={onAddToCart}
        >
          <Download className="w-4 h-4 mr-2" />
          Acheter maintenant
        </Button>
        <Button 
          variant="outline" 
          className="w-full"
          onClick={onAddToCart}
        >
          <ShoppingBag className="w-4 h-4 mr-2" />
          Ajouter au panier
        </Button>
      </div>

      {/* Features */}
      <div className="space-y-3">
        <h3 className="font-semibold text-foreground">Ce qui est inclus :</h3>
        <div className="space-y-2">
          <div className="flex items-center text-sm">
            <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
            <span>Téléchargement instantané</span>
          </div>
          <div className="flex items-center text-sm">
            <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
            <span>Accès à vie</span>
          </div>
          <div className="flex items-center text-sm">
            <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
            <span>Support inclus</span>
          </div>
          <div className="flex items-center text-sm">
            <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
            <span>Mises à jour gratuites</span>
          </div>
        </div>
      </div>

      {/* Product Stats */}
      <div className="grid grid-cols-2 gap-4 pt-4 border-t">
        <div className="text-center">
          <div className="text-lg font-semibold text-foreground">
            {Math.floor(Math.random() * 1000) + 100}
          </div>
          <div className="text-sm text-muted-foreground">Téléchargements</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-foreground">
            {Math.floor(Math.random() * 50) + 10}
          </div>
          <div className="text-sm text-muted-foreground">Avis positifs</div>
        </div>
      </div>

      {/* Security Badge */}
      <div className="bg-muted/50 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-bold">✓</span>
          </div>
          <div>
            <div className="font-medium text-foreground">Achat sécurisé</div>
            <div className="text-sm text-muted-foreground">
              Paiement 100% sécurisé et support client disponible
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

