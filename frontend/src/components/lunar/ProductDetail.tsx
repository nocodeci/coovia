import React, { useState, useEffect } from 'react';
import { productService } from '../../services/lunarService';
import { LunarProduct, LunarProductVariant } from '../../types/lunar';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Separator } from '../ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  Download, 
  Heart, 
  Share2, 
  Star, 
  ArrowLeft,
  Minus,
  Plus,
  FileText,
  Video,
  Music,
  Image,
  Clock,
  HardDrive,
  Globe,
  CheckCircle,
  Play,
  Eye
} from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';

interface ProductDetailProps {
  productId: string;
  onAddToCart?: (variantId: string, quantity: number) => void;
}

export const ProductDetail: React.FC<ProductDetailProps> = ({ productId, onAddToCart }) => {
  const [product, setProduct] = useState<LunarProduct | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<LunarProductVariant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await productService.getById(productId);
        
        if (response.success) {
          setProduct(response.data);
          // Sélectionner la première variante par défaut
          if (response.data.variants && response.data.variants.length > 0) {
            setSelectedVariant(response.data.variants[0]);
          }
        }
      } catch (err) {
        setError('Erreur lors du chargement du produit');
        console.error('Erreur fetchProduct:', err);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= (selectedVariant?.stock_quantity || 1)) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    if (selectedVariant && onAddToCart) {
      onAddToCart(selectedVariant.id, quantity);
    }
  };

  const handleVariantSelect = (variant: LunarProductVariant) => {
    setSelectedVariant(variant);
    setQuantity(1); // Reset quantity when variant changes
  };

  const getDigitalProductIcon = (productType: string) => {
    switch (productType?.toLowerCase()) {
      case 'ebook':
      case 'pdf':
      case 'document':
        return <FileText className="h-12 w-12" />;
      case 'video':
      case 'cours':
      case 'formation':
        return <Video className="h-12 w-12" />;
      case 'audio':
      case 'podcast':
      case 'musique':
        return <Music className="h-12 w-12" />;
      case 'image':
      case 'photo':
      case 'design':
        return <Image className="h-12 w-12" />;
      default:
        return <Download className="h-12 w-12" />;
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

  if (error || !product) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500 mb-4">{error || 'Produit non trouvé'}</p>
        <Button onClick={() => navigate({ to: '/' })}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF'
    }).format(price);
  };

  const isInStock = selectedVariant && selectedVariant.stock_quantity > 0;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Bouton retour */}
      <Button
        variant="ghost"
        onClick={() => navigate({ to: '/' })}
        className="mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Retour aux produits
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Images du produit */}
        <div className="space-y-4">
          <div className="aspect-square bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg overflow-hidden flex items-center justify-center">
            {product.attribute_data?.image ? (
              <img
                src={product.attribute_data.image}
                alt={product.attribute_data.name || 'Produit digital'}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-blue-600 flex flex-col items-center gap-4">
                {getDigitalProductIcon(product.attribute_data?.type)}
                <span className="text-lg font-medium">Produit Digital</span>
              </div>
            )}
          </div>
          
          {/* Galerie d'images (si disponible) */}
          {product.attribute_data?.gallery && product.attribute_data.gallery.length > 0 && (
            <div className="grid grid-cols-4 gap-2">
              {product.attribute_data.gallery.map((image: string, index: number) => (
                <div key={index} className="aspect-square bg-gray-100 rounded-md overflow-hidden">
                  <img
                    src={image}
                    alt={`${product.attribute_data.name} - Image ${index + 1}`}
                    className="w-full h-full object-cover cursor-pointer hover:opacity-80"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Informations du produit */}
        <div className="space-y-6">
          {/* En-tête */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant={product.status === 'published' ? 'default' : 'secondary'}>
                {product.status === 'published' ? 'Publié' : 'Brouillon'}
              </Badge>
              {product.attribute_data?.is_featured && (
                <Badge variant="outline" className="border-yellow-500 text-yellow-700">
                  <Star className="h-3 w-3 mr-1" />
                  En vedette
                </Badge>
              )}
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {product.attribute_data?.name || 'Nom du produit'}
            </h1>
            
            {/* Type de produit digital */}
            <div className="mb-4">
              {getDigitalProductBadge(product.attribute_data?.type)}
            </div>
            
            {product.attribute_data?.brand && (
              <p className="text-lg text-gray-600 mb-4">
                Créateur: {product.attribute_data.brand}
              </p>
            )}
          </div>

          {/* Prix */}
          {selectedVariant && (
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-primary">
                  {formatPrice(selectedVariant.price)}
                </span>
                {selectedVariant.compare_price && selectedVariant.compare_price > selectedVariant.price && (
                  <span className="text-xl text-gray-500 line-through">
                    {formatPrice(selectedVariant.compare_price)}
                  </span>
                )}
              </div>
              
              {selectedVariant.compare_price && selectedVariant.compare_price > selectedVariant.price && (
                <Badge variant="destructive" className="text-sm">
                  -{Math.round(((selectedVariant.compare_price - selectedVariant.price) / selectedVariant.compare_price) * 100)}% de réduction
                </Badge>
              )}
            </div>
          )}

          {/* Informations spécifiques aux produits digitaux */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h3 className="font-medium text-blue-900 mb-3">Caractéristiques du produit digital</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {product.attribute_data?.file_size && (
                <div className="flex items-center gap-2 text-sm">
                  <HardDrive className="h-4 w-4 text-blue-600" />
                  <span className="text-blue-800">Taille: {product.attribute_data.file_size}</span>
                </div>
              )}
              
              {product.attribute_data?.format && (
                <div className="flex items-center gap-2 text-sm">
                  <Download className="h-4 w-4 text-blue-600" />
                  <span className="text-blue-800">Format: {product.attribute_data.format}</span>
                </div>
              )}
              
              {product.attribute_data?.duration && (
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-blue-600" />
                  <span className="text-blue-800">Durée: {product.attribute_data.duration}</span>
                </div>
              )}
              
              {product.attribute_data?.language && (
                <div className="flex items-center gap-2 text-sm">
                  <Globe className="h-4 w-4 text-blue-600" />
                  <span className="text-blue-800">Langue: {product.attribute_data.language}</span>
                </div>
              )}
            </div>
          </div>

          {/* Sélection de variante */}
          {product.variants && product.variants.length > 1 && (
            <div className="space-y-3">
              <h3 className="font-medium text-gray-900">Versions disponibles</h3>
              <div className="grid grid-cols-2 gap-2">
                {product.variants.map((variant) => (
                  <Button
                    key={variant.id}
                    variant={selectedVariant?.id === variant.id ? 'default' : 'outline'}
                    className="justify-start"
                    onClick={() => handleVariantSelect(variant)}
                    disabled={variant.stock_quantity === 0}
                  >
                    <div className="text-left">
                      <div className="font-medium">{variant.sku}</div>
                      <div className="text-sm text-gray-600">
                        {formatPrice(variant.price)}
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Quantité et ajout au panier */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center border rounded-lg">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="px-4 py-2 min-w-[60px] text-center">
                  {quantity}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={quantity >= (selectedVariant?.stock_quantity || 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="text-sm text-gray-600">
                {selectedVariant ? (
                  isInStock ? (
                    `${selectedVariant.stock_quantity} licences disponibles`
                  ) : (
                    <span className="text-red-500">Rupture de stock</span>
                  )
                ) : (
                  'Sélectionnez une version'
                )}
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                size="lg"
                className="flex-1"
                onClick={handleAddToCart}
                disabled={!isInStock || !selectedVariant}
              >
                <Download className="h-5 w-5 mr-2" />
                {isInStock ? 'Ajouter au panier' : 'Indisponible'}
              </Button>
              
              <Button variant="outline" size="lg">
                <Heart className="h-5 w-5" />
              </Button>
              
              <Button variant="outline" size="lg">
                <Share2 className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Avantages des produits digitaux */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Download className="h-4 w-4" />
              <span>Téléchargement instantané</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <CheckCircle className="h-4 w-4" />
              <span>Accès illimité</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Globe className="h-4 w-4" />
              <span>Disponible partout</span>
            </div>
          </div>
        </div>
      </div>

      {/* Onglets détaillés */}
      <div className="mt-16">
        <Tabs defaultValue="description" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="specifications">Spécifications</TabsTrigger>
            <TabsTrigger value="preview">Aperçu</TabsTrigger>
            <TabsTrigger value="reviews">Avis</TabsTrigger>
          </TabsList>
          
          <TabsContent value="description" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Description du produit</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  {product.attribute_data?.description ? (
                    <div dangerouslySetInnerHTML={{ __html: product.attribute_data.description }} />
                  ) : (
                    <p className="text-gray-500">Aucune description disponible pour ce produit.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="specifications" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Spécifications techniques</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {selectedVariant && (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <span className="font-medium">SKU:</span>
                          <span className="ml-2 text-gray-600">{selectedVariant.sku}</span>
                        </div>
                        <div>
                          <span className="font-medium">Format:</span>
                          <span className="ml-2 text-gray-600">
                            {product.attribute_data?.format || 'N/A'}
                          </span>
                        </div>
                        <div>
                          <span className="font-medium">Taille:</span>
                          <span className="ml-2 text-gray-600">
                            {product.attribute_data?.file_size || 'N/A'}
                          </span>
                        </div>
                        {product.attribute_data?.duration && (
                          <div>
                            <span className="font-medium">Durée:</span>
                            <span className="ml-2 text-gray-600">
                              {product.attribute_data.duration}
                            </span>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                  
                  {product.attribute_data?.specifications && (
                    <div className="mt-4">
                      <h4 className="font-medium mb-2">Caractéristiques</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {Object.entries(product.attribute_data.specifications).map(([key, value]) => (
                          <div key={key} className="flex justify-between py-1 border-b border-gray-100">
                            <span className="font-medium capitalize">{key.replace(/_/g, ' ')}:</span>
                            <span className="text-gray-600">{value as string}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="preview" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Aperçu du produit</CardTitle>
              </CardHeader>
              <CardContent>
                {product.attribute_data?.preview_url ? (
                  <div className="space-y-4">
                    {product.attribute_data.type === 'video' ? (
                      <video 
                        controls 
                        className="w-full rounded-lg"
                        src={product.attribute_data.preview_url}
                      >
                        Votre navigateur ne supporte pas la lecture de vidéos.
                      </video>
                    ) : product.attribute_data.type === 'audio' ? (
                      <audio 
                        controls 
                        className="w-full"
                        src={product.attribute_data.preview_url}
                      >
                        Votre navigateur ne supporte pas la lecture audio.
                      </audio>
                    ) : (
                      <div className="text-center py-8">
                        <Eye className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">Aperçu disponible après achat</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Eye className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Aucun aperçu disponible pour ce produit.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="reviews" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Avis clients</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">Les avis clients ne sont pas encore disponibles pour ce produit.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
