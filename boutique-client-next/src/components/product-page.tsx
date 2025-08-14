'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';
import { storeService } from '@/services/api';
import { Product, Store } from '@/types/store';
import { Button, Card, CardContent } from '@/components/ui';
import { Breadcrumb } from '@/components/breadcrumb';
import {
  ProductGallery,
  ProductInfo,
  VendorInfo,
  PurchaseOptions,
  ReviewSection,
  RelatedProducts
} from '@/components/product';

interface ProductPageProps {
  storeId: string;
  productId: string;
}

export function ProductPage({ storeId, productId }: ProductPageProps) {
  const [selectedTab, setSelectedTab] = useState('description');

  // Récupérer les données de la boutique
  const { data: store, isLoading: storeLoading } = useQuery({
    queryKey: ['store', storeId],
    queryFn: () => storeService.getStoreBySlug(storeId),
  });

  // Récupérer les détails du produit
  const { data: product, isLoading: productLoading } = useQuery({
    queryKey: ['product', storeId, productId],
    queryFn: () => storeService.getProductById(productId),
    enabled: !!storeId && !!productId,
  });

  // Formater le prix
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Gérer l'achat immédiat
  const handlePurchase = () => {
    if (!product) return;
    
    const checkoutData = {
      productId: product.id,
      productName: product.name,
      price: product.price,
      storeId: storeId
    };
    
    sessionStorage.setItem('checkoutData', JSON.stringify(checkoutData));
    window.location.href = `/${storeId}/checkout`;
  };

  // Gérer l'ajout au panier
  const handleAddToCart = () => {
    if (!product) return;
    
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

  // Gérer le partage
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product?.name,
        text: product?.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Lien copié dans le presse-papiers !');
    }
  };

  // Gérer la wishlist
  const handleWishlist = () => {
    alert('Fonctionnalité wishlist à implémenter');
  };

  if (storeLoading || productLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Chargement du produit...</p>
        </div>
      </div>
    );
  }

  if (!product || !store) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-primary/5">
        <div className="flex items-center justify-center min-h-screen">
          <Card className="text-center p-8">
            <CardContent>
              <h1 className="text-2xl font-bold text-foreground mb-4">Produit non trouvé</h1>
              <p className="text-muted-foreground mb-8">
                Le produit que vous recherchez n'existe pas ou a été supprimé.
              </p>
              <Button onClick={() => window.history.back()} className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Retour
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-primary/5">
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-secondary z-[60] shadow-lg"></div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 pt-20">
        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { label: store?.name || 'Boutique', href: `/${storeId}` },
            { label: product?.name || 'Produit' }
          ]}
        />
        
        {/* Product Main Section */}
        <div className="flex flex-col lg:flex-row gap-8 mb-12">
          {/* Left Side - Product Gallery & Details */}
          <div className="w-full lg:w-3/5 space-y-8">
            <ProductGallery product={product} />
            
            {/* Product Details Tabs */}
            <div className="space-y-6">
              <div className="flex space-x-8 border-b">
                <button
                  className={`py-2 px-1 font-medium text-sm border-b-2 transition-colors ${
                    selectedTab === 'description' 
                      ? 'text-primary border-primary' 
                      : 'text-muted-foreground border-transparent hover:text-foreground'
                  }`}
                  onClick={() => setSelectedTab('description')}
                >
                  Description
                </button>
                <button
                  className={`py-2 px-1 font-medium text-sm border-b-2 transition-colors ${
                    selectedTab === 'specifications' 
                      ? 'text-primary border-primary' 
                      : 'text-muted-foreground border-transparent hover:text-foreground'
                  }`}
                  onClick={() => setSelectedTab('specifications')}
                >
                  Spécifications
                </button>
                <button
                  className={`py-2 px-1 font-medium text-sm border-b-2 transition-colors ${
                    selectedTab === 'reviews' 
                      ? 'text-primary border-primary' 
                      : 'text-muted-foreground border-transparent hover:text-foreground'
                  }`}
                  onClick={() => setSelectedTab('reviews')}
                >
                  Avis
                </button>
              </div>
              
              <div className="py-6">
                {selectedTab === 'description' && (
                  <div className="space-y-4">
                    <p className="text-muted-foreground leading-relaxed">
                      {product.description}
                    </p>
                    <ul className="space-y-2">
                      <li className="flex items-center">
                        <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                        <span>Produit de qualité premium</span>
                      </li>
                      <li className="flex items-center">
                        <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                        <span>Support client disponible</span>
                      </li>
                      <li className="flex items-center">
                        <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                        <span>Mises à jour gratuites</span>
                      </li>
                      <li className="flex items-center">
                        <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                        <span>Téléchargement instantané</span>
                      </li>
                    </ul>
                  </div>
                )}
                {selectedTab === 'specifications' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-medium text-foreground">Catégorie</h3>
                      <p className="text-muted-foreground mt-1">{product.category}</p>
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground">Note</h3>
                      <div className="flex items-center mt-1">
                        <span className="text-muted-foreground">
                          {product.rating || 4.5}/5
                        </span>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground">Prix</h3>
                      <p className="text-muted-foreground mt-1">{formatPrice(product.price)}</p>
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground">Type</h3>
                      <p className="text-muted-foreground mt-1">{product.type || 'Digital'}</p>
                    </div>
                  </div>
                )}
                {selectedTab === 'reviews' && <ReviewSection />}
              </div>
            </div>
          </div>

          {/* Right Side - Product Info & Actions */}
          <div className="w-full lg:w-2/5 lg:sticky lg:top-8 lg:self-start space-y-6">
            <ProductInfo 
              product={product} 
              onShare={handleShare}
              onWishlist={handleWishlist}
              onAddToCart={handlePurchase}
            />
            
            <VendorInfo store={store} />
            
            <PurchaseOptions 
              product={product}
              onPurchase={handlePurchase}
              onAddToCart={handleAddToCart}
            />
          </div>
        </div>

        {/* Related Products */}
        <RelatedProducts 
          category={product.category}
          currentProductId={product.id}
          storeId={storeId}
        />
      </main>
    </div>
  );
}
