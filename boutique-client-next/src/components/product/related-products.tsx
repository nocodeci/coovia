'use client';

import { useQuery } from '@tanstack/react-query';
import { Star, Heart, ShoppingBag } from 'lucide-react';
import { storeService } from '@/services/api';
import { Product } from '@/types/store';
import { Card, CardContent, CardHeader, CardTitle, Button, Badge } from '@/components/ui';

interface RelatedProductsProps {
  category: string;
  currentProductId: string;
  storeId: string;
}

export function RelatedProducts({ category, currentProductId, storeId }: RelatedProductsProps) {
  // Récupérer les produits de la même catégorie
  const { data: products = [] } = useQuery({
    queryKey: ['products', storeId],
    queryFn: () => storeService.getStoreProducts(storeId),
  });

  // Filtrer les produits de la même catégorie et exclure le produit actuel
  const relatedProducts = products
    .filter((product: Product) => 
      product.category === category && product.id !== currentProductId
    )
    .slice(0, 4);

  // Formater le prix
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Gérer l'ajout au panier
  const handleAddToCart = (product: Product) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = cart.find((item: any) => item.product.id === product.id);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({
        product,
        quantity: 1
      });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    alert('Produit ajouté au panier !');
  };

  if (relatedProducts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Produits similaires</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              Aucun produit similaire trouvé dans cette catégorie.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Produits similaires</CardTitle>
        <p className="text-sm text-muted-foreground">
          Découvrez d'autres produits de la catégorie {category}
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {relatedProducts.map((product: Product) => (
            <Card key={product.id} className="group hover:shadow-lg transition-all duration-300">
              <CardContent className="p-4">
                {/* Product Image */}
                <div className="aspect-video bg-muted rounded-lg mb-4 flex items-center justify-center">
                  <ShoppingBag className="w-12 h-12 text-muted-foreground" />
                </div>

                {/* Product Info */}
                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold text-foreground line-clamp-2 mb-2">
                      {product.name}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {product.description}
                    </p>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {Array.from({ length: 5 }, (_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${
                            i < (product.rating || 4.5) 
                              ? 'text-yellow-500 fill-current' 
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {product.rating || 4.5}
                    </span>
                  </div>

                  {/* Category Badge */}
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="text-xs">
                      {product.category}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Heart className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Price and Action */}
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-primary">
                      {formatPrice(product.price)}
                    </span>
                    <Button 
                      size="sm"
                      onClick={() => handleAddToCart(product)}
                    >
                      <ShoppingBag className="w-4 h-4 mr-1" />
                      Ajouter
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-6">
          <Button variant="outline">
            Voir tous les produits de cette catégorie
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

