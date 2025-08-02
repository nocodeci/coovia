import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  ShoppingBag, 
  Search, 
  Filter, 
  Heart, 
  Star, 
  ArrowRight,
  Zap,
  Menu,
  X,
  Globe,
  ChevronDown
} from 'lucide-react';
import { storeService } from '../services/api';
import ProductCard from './ProductCard';
import Header from './Header';

interface BoutiquePageProps {
  storeId: string;
}

function BoutiquePage({ storeId }: BoutiquePageProps) {
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

  // Calculer la remise
  const calculateDiscount = (product: any) => {
    if (product.original_price && product.original_price > product.price) {
      return Math.round(((product.original_price - product.price) / product.original_price) * 100);
    }
    return 0;
  };

  // Formater le prix
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Formater le prix original
  const formatOriginalPrice = (price: number) => {
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
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement de la boutique...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full pt-17">
      {/* CSS Variables */}
      <style>
        {`
          :root {
            --brand-color: #10b981;
            --brand-color-rgb: 16,185,129;
            --brand-contrast-color: #ffffff;
            --brand-contrast-color-rgb: 255,255,255;
          }
        `}
      </style>

      {/* Header */}
      <Header 
        store={store} 
        isMenuOpen={isMenuOpen} 
        onMenuToggle={() => setIsMenuOpen(!isMenuOpen)} 
      />

      {/* Main Content */}
      <main className="layout relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" style={{ minHeight: 'calc(100% - 160px)' }}>
        <div className="mt-8 mb-12 flex flex-col justify-between">
          {/* Title */}
          <h2 className="md:text-3xl text-2xl md:mb-12 mb-8 font-bold text-gray-900">
            {store?.description || 'Une boutique de vente des produits digitaux'}
          </h2>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="w-full group">
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <Search className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Rechercher"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-[12px] bg-neutral-50 border-none group-hover:border-solid focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>

            {/* Category and Type Filters */}
            <div className="flex flex-row gap-4 w-full md:max-w-80">
              <div className="w-full group">
                <div className="relative">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-4 py-3 rounded-[12px] bg-neutral-50 border-none group-hover:border-solid focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 appearance-none"
                  >
                    <option value="">Catégorie</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              </div>

              <div className="w-full group">
                <div className="relative">
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="w-full px-4 py-3 rounded-[12px] bg-neutral-50 border-none group-hover:border-solid focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 appearance-none"
                  >
                    <option value="">Type de produit</option>
                    <option value="digital">Produit numérique</option>
                    <option value="course">Formation</option>
                    <option value="template">Template</option>
                  </select>
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="my-10">
          <div className="grid gap-6 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 w-full relative">
            {filteredProducts.map((product) => {
              const discount = calculateDiscount(product);
              return (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  isFavorite={favoriteProducts.includes(product.id)}
                  onToggleFavorite={toggleFavorite}
                  formatPrice={formatPrice}
                />
              );
            })}
          </div>
        </div>
      </main>

      {/* Footer */}
      <div className="layout relative z-0 pb-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="pt-10 border-t border-neutral-100 flex flex-col md:flex-row gap-8 justify-between">
          {/* Brand */}
          <div className="flex flex-col gap-8">
            <a className="flex flex-row items-center" href="/">
              <div className="flex flex-row items-center mr-1 rounded-sm">
                <div className="mr-2 w-8 h-8 flex items-center justify-center text-white bg-black rounded-sm">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <div className="text-lg font-bold text-black truncate md:w-48 w-32">
                  {store?.name || 'Boutique'}
                </div>
              </div>
            </a>
            
            {/* Language Picker */}
            <button className="cursor-pointer hover:bg-neutral-100 z-0 flex items-center gap-2">
              <div className="flex items-center gap-2">
                🇫🇷<span className="text-sm">Français</span>
              </div>
              <ChevronDown className="w-4 h-4 text-neutral-600" />
            </button>
          </div>

          {/* Links */}
          <div className="flex flex-col gap-4">
            <span className="text-lg font-medium text-neutral-500">Liens</span>
            <div className="flex flex-col gap-2">
              <a className="flex flex-row items-center gap-2" target="_blank" href="#">
                <span className="text-black">
                  <ShoppingBag className="w-4 h-4" />
                </span>
                <span className="text-lg whitespace-nowrap font-medium">Mes achats</span>
              </a>
            </div>
          </div>

          {/* Legal */}
          <div className="flex flex-col gap-4">
            <span className="text-lg font-medium text-neutral-500">Légales</span>
            <div className="flex flex-col gap-2">
              <a className="text-lg" target="_blank" href="#">Politique de confidentialité</a>
              <a className="text-lg" target="_blank" href="#">Conditions d'utilisation</a>
              <a className="text-lg" target="_blank" href="#">Mentions légales</a>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="text-left text-neutral-400 text-md my-10">
          Ce site n'est en aucun cas affilié à Facebook ou Meta. Nous utilisons la publicité pour promouvoir nos contenus et produits/services auprès d'un public plus large. Les informations fournies sur ce site sont uniquement à titre informatif et ne constituent pas un conseil professionnel ou financier.
        </div>

        {/* Bottom Bar */}
        <div className="items-center gap-2 pt-4 border-t border-neutral-100 flex flex-col md:flex-row justify-between">
          <div className="text-neutral-900 md:mb-0 mb-2">
            <span className="md:text-center text-left text-md">
              {store?.name || 'Boutique'} ©<span className="mr-1"> 2025</span><span> All rights reserved.</span>
            </span>
          </div>
          <div className="flex flex-row items-center gap-2 bg-neutral-900 text-white py-1 px-4 rounded-full w-max">
            <span className="text-xs font-medium">Powered by</span>
            <a className="flex flex-row items-center justify-center" href="#" target="_blank">
              <span className="text-sm font-bold">Coovia</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BoutiquePage; 