import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Header from '../components/Header';
import { StoreHeader } from './StoreHeader';
import SearchFilters from '../components/SearchFilters';
import ProductCard from '../components/ProductCard';
import Footer from '../components/Footer';
import LoadingSpinner from '../components/LoadingSpinner';
import { storeService } from '../services/api';
import { BoutiquePageProps } from '../types/store';
import { useSubdomain } from '../hooks/useSubdomain';

function BoutiquePage({ storeId }: BoutiquePageProps) {
  const { subdomain, isSubdomain } = useSubdomain();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [favoriteProducts, setFavoriteProducts] = useState<string[]>([]);

  // Récupérer les données de la boutique
  const { data: store, isLoading: storeLoading } = useQuery({
    queryKey: ['store', storeId],
    queryFn: () => storeService.getStoreBySlug(storeId),
  });

  // Récupérer les produits de la boutique
  const { data: products = [], isLoading: productsLoading } = useQuery({
    queryKey: ['products', storeId],
    queryFn: () => storeService.getStoreProducts(storeId),
    enabled: !!storeId,
  });

  // Récupérer les catégories
  const { data: categories = [] } = useQuery({
    queryKey: ['categories', storeId],
    queryFn: () => storeService.getStoreCategories(storeId),
    enabled: !!storeId,
  });

  // Filtrer les produits
  const filteredProducts = products.filter((product) => {
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

  if (storeLoading || productsLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Afficher l'en-tête de la boutique si on est sur un sous-domaine */}
      {isSubdomain && store && subdomain && (
        <StoreHeader store={store} subdomain={subdomain} />
      )}
      
      <Header 
        store={store}
        isMenuOpen={isMenuOpen}
        onMenuToggle={() => setIsMenuOpen(!isMenuOpen)}
      />

      {/* Main Content */}
      <main className={`${isSubdomain ? 'pt-4' : 'pt-20'} pb-16`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
                {store?.description || 'Découvrez notre collection de produits digitaux'}
              </h1>
              <p className="text-xl text-slate-600 leading-relaxed">
                Des formations, templates et ressources numériques de qualité pour développer vos compétences et votre business.
              </p>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="mb-12">
            <SearchFilters
              searchTerm={searchTerm}
              selectedCategory={selectedCategory}
              selectedType={selectedType}
              categories={categories}
              onSearchChange={setSearchTerm}
              onCategoryChange={setSelectedCategory}
              onTypeChange={setSelectedType}
            />
          </div>

          {/* Results Summary */}
          <div className="flex items-center justify-between mb-8">
            <div className="text-slate-600">
              <span className="font-medium text-slate-900">{filteredProducts.length}</span> produit{filteredProducts.length > 1 ? 's' : ''} trouvé{filteredProducts.length > 1 ? 's' : ''}
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isFavorite={favoriteProducts.includes(product.id)}
                onToggleFavorite={toggleFavorite}
                formatPrice={formatPrice}
                storeId={storeId}
              />
            ))}
          </div>

          {/* Empty State */}
          {filteredProducts.length === 0 && (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Aucun produit trouvé</h3>
              <p className="text-slate-600 max-w-md mx-auto">
                Essayez de modifier vos critères de recherche ou parcourez toutes nos catégories.
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer store={store} />
    </div>
  );
}

export default BoutiquePage; 