'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, ShoppingBag, Heart, Star } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { storeService } from '@/services/api';
import { BoutiquePageProps, Store, Product } from '@/types/store';
import { StoreBanner } from './store-banner';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Badge,
  Separator,
  Alert,
  AlertDescription,
} from '@/components/ui';

export function BoutiquePage({ storeId, store }: BoutiquePageProps & { store?: Store }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [favoriteProducts, setFavoriteProducts] = useState<string[]>([]);

  // Données de test pour la boutique test-store
  const testStore: Store = {
    id: '9f9e1c83-e453-49c5-8f32-f756f866b8de',
    name: 'Test Store',
    slug: 'test-store',
    description: 'Boutique de test pour les sous-domaines',
    logo: undefined,
    status: 'active',
    created_at: '2025-08-12T15:58:40.000000Z',
    updated_at: '2025-08-12T15:58:40.000000Z',
  };

  // Utiliser les données passées en props ou les données de test
  const finalStore = storeId === 'test-store' ? testStore : store;
  

  // Produits de test pour test-store
  const testProducts: Product[] = [
    {
      id: '1',
      name: 'Produit Test 1',
      description: 'Description du produit test 1',
      price: 5000,
      image: undefined,
      category: 'Test',
      store_id: '9f9e1c83-e453-49c5-8f32-f756f866b8de',
      created_at: '2025-08-12T15:58:40.000000Z',
      updated_at: '2025-08-12T15:58:40.000000Z',
    },
    {
      id: '2',
      name: 'Produit Test 2',
      description: 'Description du produit test 2',
      price: 7500,
      image: undefined,
      category: 'Test',
      store_id: '9f9e1c83-e453-49c5-8f32-f756f866b8de',
      created_at: '2025-08-12T15:58:40.000000Z',
      updated_at: '2025-08-12T15:58:40.000000Z',
    },
  ];

  // Produits de test pour yohan-eric-koffi (basés sur les vrais produits)
  const yohanProducts: Product[] = [
    {
      id: 'y1',
      name: 'Cisco',
      slug: 'cisco',
      description: 'Produit Cisco de qualité professionnelle',
      price: 2000,
      image: 'https://pub-f24a39478f6a41e7ab82e6f4291ed5ae.r2.dev/uploads/thumbnails/img-1228_1757000786_IOiHO7Vd_medium.JPG',
      category: 'Templates',
      store_id: '9fc12874-b85f-42a7-972a-f1d22554d464',
      created_at: '2025-08-30T02:06:02.000000Z',
      updated_at: '2025-08-30T02:06:02.000000Z',
    },
    {
      id: 'y2',
      name: 'dbfv',
      slug: 'dbfv',
      description: 'Produit dbfv de qualité professionnelle',
      price: 2000,
      image: 'https://pub-f24a39478f6a41e7ab82e6f4291ed5ae.r2.dev/uploads/thumbnails/img-1228_1757000786_IOiHO7Vd_medium.JPG',
      category: 'Documents',
      store_id: '9fc12874-b85f-42a7-972a-f1d22554d464',
      created_at: '2025-08-30T02:06:02.000000Z',
      updated_at: '2025-08-30T02:06:02.000000Z',
    },
    {
      id: 'y3',
      name: 'Cisco Audio',
      slug: 'cisco-audio',
      description: 'Produit Cisco Audio de qualité professionnelle',
      price: 2000,
      image: 'https://pub-f24a39478f6a41e7ab82e6f4291ed5ae.r2.dev/uploads/thumbnails/img-1228_1757000786_IOiHO7Vd_medium.JPG',
      category: 'Audio',
      store_id: '9fc12874-b85f-42a7-972a-f1d22554d464',
      created_at: '2025-08-30T02:06:02.000000Z',
      updated_at: '2025-08-30T02:06:02.000000Z',
    },
  ];

  // Récupérer les produits de la boutique (désactivé pour test-store seulement)
  const { data: products = [], isLoading: productsLoading } = useQuery({
    queryKey: ['products', storeId],
    queryFn: () => storeService.getStoreProducts(storeId),
    enabled: !!storeId && storeId !== 'test-store',
  });

  // Utiliser les produits de test selon le storeId
  const finalProducts = storeId === 'test-store' ? testProducts : 
                       storeId === 'yohan-eric-koffi' ? yohanProducts : 
                       products;
  

  // Récupérer les catégories (désactivé pour test-store seulement)
  const { data: categories = [] } = useQuery({
    queryKey: ['categories', storeId],
    queryFn: () => storeService.getStoreCategories(storeId),
    enabled: !!storeId && storeId !== 'test-store',
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Utiliser les catégories de test selon le storeId
  const finalCategories = storeId === 'test-store' ? ['Test', 'Demo'] : 
                         storeId === 'yohan-eric-koffi' ? ['Templates', 'Documents', 'Audio'] : 
                         categories;

  // Filtrer les produits
  const filteredProducts = finalProducts.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Formater le prix
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Toggle favori
  const toggleFavorite = (productId: string) => {
    setFavoriteProducts(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  // Vérifier si on a les données de la boutique
  if (!finalStore) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Chargement de la boutique...</p>
        </div>
      </div>
    );
  }

  // Afficher un loader pendant le chargement des produits
  if (productsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-primary/5">
        {finalStore && <StoreBanner store={finalStore} />}
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Chargement des produits...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-primary/5">
      {/* Bannière de la boutique avec photo de profil */}
      {finalStore && <StoreBanner store={finalStore} />}

      {/* Search and Filters */}
      <section className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Search Bar */}
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Rechercher un produit..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
                    />
                  </div>
                </div>

                {/* Category Filter */}
                <div className="flex flex-col sm:flex-row gap-4 lg:max-w-md">
                  <div className="flex-1">
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full px-4 py-3 bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
                    >
                      <option value="">Toutes les catégories</option>
                      {finalCategories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results Count */}
          <div className="flex items-center justify-between mb-8">
            <div className="text-muted-foreground">
              <span className="font-medium text-foreground">{filteredProducts.length}</span> produit{filteredProducts.length > 1 ? 's' : ''} trouvé{filteredProducts.length > 1 ? 's' : ''}
            </div>
          </div>

          {/* Products Grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {filteredProducts.map((product) => (
                <Link key={product.id} href={`/${storeId}/product/${product.slug || product.id}`} className="block">
                  <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
                  <CardHeader className="pb-4">
                    <div className="aspect-video bg-muted rounded-lg mb-4 flex items-center justify-center overflow-hidden relative">
                      {product.image ? (
                        <Image 
                          src={product.image} 
                          alt={product.name}
                          width={400}
                          height={225}
                          className="w-full h-full object-cover rounded-lg"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.nextElementSibling.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      <div className={`w-full h-full flex items-center justify-center absolute inset-0 ${product.image ? 'hidden' : ''}`}>
                        <ShoppingBag className="w-12 h-12 text-muted-foreground" />
                      </div>
                    </div>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg font-semibold line-clamp-2 mb-2">
                          {product.name}
                        </CardTitle>
                        <CardDescription className="line-clamp-2 mb-3">
                          {product.description}
                        </CardDescription>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleFavorite(product.id);
                        }}
                        className={`ml-2 ${favoriteProducts.includes(product.id) ? 'text-red-500' : 'text-muted-foreground'}`}
                      >
                        <Heart className={`w-5 h-5 ${favoriteProducts.includes(product.id) ? 'fill-current' : ''}`} />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary">{product.category}</Badge>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-medium">{product.rating || 4.5}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-primary">
                        {formatPrice(product.price)}
                      </span>
                      <div className="text-sm text-muted-foreground">
                        Cliquez pour voir les détails
                      </div>
                    </div>
                  </CardContent>
                </Card>
                </Link>
              ))}
            </div>
          ) : (
            <Card className="text-center py-16">
              <CardContent>
                <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="w-12 h-12 text-muted-foreground" />
                </div>
                <CardTitle className="text-xl font-semibold mb-2">
                  Aucun produit trouvé
                </CardTitle>
                <CardDescription className="max-w-md mx-auto">
                  Essayez de modifier vos critères de recherche ou parcourez toutes nos catégories.
                </CardDescription>
              </CardContent>
            </Card>
          )}
        </div>
      </section>
    </div>
  );
}
