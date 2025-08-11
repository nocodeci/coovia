import React, { useState, useEffect } from 'react';
import { productService } from '../../services/lunarService';
import { LunarProduct, ProductFilters } from '../../types/lunar';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Search, Filter, Download, Star, Eye, FileText, Video, Music, Image } from 'lucide-react';

interface ProductListProps {
  storeId?: string;
  onProductSelect?: (product: LunarProduct) => void;
}

export const ProductList: React.FC<ProductListProps> = ({ storeId, onProductSelect }) => {
  const [products, setProducts] = useState<LunarProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ProductFilters>({
    page: 1,
    per_page: 12,
    sort_by: 'created_at',
    sort_order: 'desc'
  });
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    total: 0
  });

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productService.getAll({
        ...filters,
        store_id: storeId
      });
      
      if (response.success) {
        setProducts(response.data);
        setPagination(response.pagination);
      }
    } catch (err) {
      setError('Erreur lors du chargement des produits');
      console.error('Erreur fetchProducts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [filters, storeId]);

  const handleFilterChange = (key: keyof ProductFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1 // Reset à la première page lors du changement de filtre
    }));
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  const handleSearch = (searchTerm: string) => {
    setFilters(prev => ({ ...prev, search: searchTerm, page: 1 }));
  };

  const getDigitalProductIcon = (productType: string) => {
    switch (productType?.toLowerCase()) {
      case 'ebook':
      case 'pdf':
      case 'document':
        return <FileText className="h-8 w-8" />;
      case 'video':
      case 'cours':
      case 'formation':
        return <Video className="h-8 w-8" />;
      case 'audio':
      case 'podcast':
      case 'musique':
        return <Music className="h-8 w-8" />;
      case 'image':
      case 'photo':
      case 'design':
        return <Image className="h-8 w-8" />;
      default:
        return <Download className="h-8 w-8" />;
    }
  };

  const getDigitalProductBadge = (productType: string) => {
    switch (productType?.toLowerCase()) {
      case 'ebook':
      case 'pdf':
        return <Badge variant="outline" className="border-blue-500 text-blue-700">Document</Badge>;
      case 'video':
      case 'cours':
        return <Badge variant="outline" className="border-purple-500 text-purple-700">Vidéo</Badge>;
      case 'audio':
      case 'podcast':
        return <Badge variant="outline" className="border-green-500 text-green-700">Audio</Badge>;
      case 'image':
      case 'design':
        return <Badge variant="outline" className="border-orange-500 text-orange-700">Design</Badge>;
      default:
        return <Badge variant="outline">Digital</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={fetchProducts}>Réessayer</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filtres et recherche */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Rechercher des produits digitaux..."
                className="pl-10"
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <Select
              value={filters.sort_by}
              onValueChange={(value) => handleFilterChange('sort_by', value)}
            >
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Trier par" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Nom</SelectItem>
                <SelectItem value="price">Prix</SelectItem>
                <SelectItem value="created_at">Date création</SelectItem>
                <SelectItem value="updated_at">Date modification</SelectItem>
              </SelectContent>
            </Select>
            
            <Select
              value={filters.sort_order}
              onValueChange={(value) => handleFilterChange('sort_order', value)}
            >
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="asc">↑</SelectItem>
                <SelectItem value="desc">↓</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Grille des produits */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <Card 
            key={product.id} 
            className="hover:shadow-lg transition-shadow cursor-pointer group border-2 hover:border-primary/20"
            onClick={() => onProductSelect?.(product)}
          >
            <div className="aspect-square bg-gradient-to-br from-blue-50 to-indigo-100 rounded-t-lg flex items-center justify-center p-6">
              {product.attribute_data?.image ? (
                <img 
                  src={product.attribute_data.image} 
                  alt={product.attribute_data.name || 'Produit digital'}
                  className="w-full h-full object-cover rounded-t-lg"
                />
              ) : (
                <div className="text-blue-600 flex flex-col items-center gap-2">
                  {getDigitalProductIcon(product.attribute_data?.type)}
                  <span className="text-xs text-center">Produit Digital</span>
                </div>
              )}
            </div>
            
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between mb-2">
                <CardTitle className="text-sm font-medium line-clamp-2">
                  {product.attribute_data?.name || 'Nom du produit'}
                </CardTitle>
                <Badge variant={product.status === 'published' ? 'default' : 'secondary'}>
                  {product.status === 'published' ? 'Publié' : 'Brouillon'}
                </Badge>
              </div>

              {/* Type de produit digital */}
              <div className="mb-2">
                {getDigitalProductBadge(product.attribute_data?.type)}
              </div>
              
              {/* Prix */}
              {product.attribute_data?.price && (
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-primary">
                    {new Intl.NumberFormat('fr-FR', {
                      style: 'currency',
                      currency: 'XOF'
                    }).format(product.attribute_data.price)}
                  </span>
                  {product.attribute_data.compare_price && (
                    <span className="text-sm text-gray-500 line-through">
                      {new Intl.NumberFormat('fr-FR', {
                        style: 'currency',
                        currency: 'XOF'
                      }).format(product.attribute_data.compare_price)}
                    </span>
                  )}
                </div>
              )}
            </CardHeader>
            
            <CardContent className="pt-0">
              {product.attribute_data?.description && (
                <CardDescription className="text-xs line-clamp-2 mb-3">
                  {product.attribute_data.description}
                </CardDescription>
              )}
              
              {/* Informations spécifiques aux produits digitaux */}
              <div className="space-y-2 mb-3">
                {product.attribute_data?.file_size && (
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <FileText className="h-3 w-3" />
                    <span>{product.attribute_data.file_size}</span>
                  </div>
                )}
                
                {product.attribute_data?.format && (
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Download className="h-3 w-3" />
                    <span>{product.attribute_data.format}</span>
                  </div>
                )}
                
                {product.attribute_data?.duration && (
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Video className="h-3 w-3" />
                    <span>{product.attribute_data.duration}</span>
                  </div>
                )}
              </div>
              
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>SKU: {product.attribute_data?.sku || 'N/A'}</span>
                <div className="flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  <span>Voir</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {pagination.last_page > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={pagination.current_page === 1}
            onClick={() => handlePageChange(pagination.current_page - 1)}
          >
            Précédent
          </Button>
          
          {Array.from({ length: pagination.last_page }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              variant={page === pagination.current_page ? 'default' : 'outline'}
              size="sm"
              onClick={() => handlePageChange(page)}
            >
              {page}
            </Button>
          ))}
          
          <Button
            variant="outline"
            size="sm"
            disabled={pagination.current_page === pagination.last_page}
            onClick={() => handlePageChange(pagination.current_page + 1)}
          >
            Suivant
          </Button>
        </div>
      )}

      {products.length === 0 && !loading && (
        <div className="text-center py-12">
          <Download className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun produit digital trouvé</h3>
          <p className="text-gray-500">Essayez de modifier vos filtres de recherche</p>
        </div>
      )}
    </div>
  );
};
