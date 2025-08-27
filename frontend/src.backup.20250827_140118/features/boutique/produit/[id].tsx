import { useState, useEffect } from 'react'
import { useParams, useNavigate } from '@tanstack/react-router'
import { ArrowLeft, Star, Heart, Share2, Truck, Shield, RotateCcw, ShoppingCart, Minus, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { useCart } from '../hooks/useCart'

interface Product {
  id: string
  name: string
  description: string
  longDescription: string
  price: number
  originalPrice?: number
  images: string[]
  category: string
  tags: string[]
  inStock: boolean
  rating: number
  reviewCount: number
  specifications: Record<string, string>
  reviews: Array<{
    id: string
    author: string
    rating: number
    comment: string
    date: string
  }>
}

export default function ProductDetailPage() {
  const { id, storeId } = useParams({ from: '/_authenticated/$storeId/produits/$id' })
  const navigate = useNavigate()
  const { addToCart, getItemQuantity } = useCart()
  
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState('description')

  // Mock data - à remplacer par une vraie API
  useEffect(() => {
    const mockProduct: Product = {
      id: id || '1',
      name: 'Smartphone Galaxy S23',
      description: 'Le dernier smartphone Samsung avec des performances exceptionnelles',
      longDescription: `
        Le Samsung Galaxy S23 représente l'excellence en matière de smartphone. 
        Doté du processeur Snapdragon 8 Gen 2, il offre des performances exceptionnelles 
        pour tous vos besoins quotidiens et vos jeux les plus exigeants.
        
        L'écran Dynamic AMOLED 2X de 6.1 pouces avec une résolution Full HD+ 
        et un taux de rafraîchissement adaptatif jusqu'à 120Hz vous garantit 
        une expérience visuelle immersive et fluide.
        
        Le système photo triple objectif avec capteur principal de 50MP, 
        ultra grand-angle de 12MP et téléobjectif de 10MP vous permet de 
        capturer des moments parfaits dans toutes les situations.
      `,
      price: 899.99,
      originalPrice: 999.99,
      images: [
        '/assets/images/products/phone1.jpg',
        '/assets/images/products/phone2.jpg',
        '/assets/images/products/phone3.jpg',
        '/assets/images/products/phone4.jpg'
      ],
      category: 'Electronics',
      tags: ['smartphone', 'samsung', '5G', 'android'],
      inStock: true,
      rating: 4.5,
      reviewCount: 128,
      specifications: {
        'Écran': '6.1" Dynamic AMOLED 2X',
        'Processeur': 'Snapdragon 8 Gen 2',
        'RAM': '8GB',
        'Stockage': '128GB',
        'Caméra principale': '50MP',
        'Batterie': '3900mAh',
        'Système': 'Android 13'
      },
      reviews: [
        {
          id: '1',
          author: 'Jean D.',
          rating: 5,
          comment: 'Excellent smartphone, très rapide et l\'appareil photo est incroyable !',
          date: '2024-01-15'
        },
        {
          id: '2',
          author: 'Marie L.',
          rating: 4,
          comment: 'Très bon produit, juste un peu cher mais la qualité est au rendez-vous.',
          date: '2024-01-10'
        }
      ]
    }
    
    setProduct(mockProduct)
    setLoading(false)
  }, [id])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Produit non trouvé</p>
      </div>
    )
  }

  const discount = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  const handleAddToCart = () => {
    addToCart(product)
  }

  const currentQuantity = getItemQuantity(product.id)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate({ to: `/${storeId}/boutique` })}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
            
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm">
                <Share2 className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Heart className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Galerie d'images */}
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-lg bg-white">
              <img
                src={product.images[selectedImage] || '/assets/images/placeholder.jpg'}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Miniatures */}
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square overflow-hidden rounded-md border-2 transition-colors ${
                    selectedImage === index 
                      ? 'border-green-600' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Informations produit */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
              
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center space-x-1">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{product.rating}</span>
                  <span className="text-gray-500">({product.reviewCount} avis)</span>
                </div>
                
                <Badge variant={product.inStock ? "default" : "secondary"}>
                  {product.inStock ? "En stock" : "Rupture"}
                </Badge>
              </div>

              <div className="flex items-center space-x-4 mb-6">
                {product.originalPrice && (
                  <span className="text-2xl text-gray-500 line-through">
                    {product.originalPrice.toFixed(2)} €
                  </span>
                )}
                <span className="text-3xl font-bold text-green-600">
                  {product.price.toFixed(2)} €
                </span>
                {discount > 0 && (
                  <Badge variant="destructive" className="text-sm">
                    -{discount}%
                  </Badge>
                )}
              </div>

              <p className="text-gray-600 mb-6">{product.description}</p>
            </div>

            {/* Quantité et ajout au panier */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <span className="font-medium">Quantité:</span>
                <div className="flex items-center space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex space-x-4">
                <Button 
                  size="lg" 
                  className="flex-1"
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Ajouter au panier
                  {currentQuantity > 0 && (
                    <Badge variant="secondary" className="ml-2">
                      {currentQuantity}
                    </Badge>
                  )}
                </Button>
              </div>
            </div>

            {/* Garanties */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-6 border-t border-gray-200">
              <div className="flex items-center space-x-2">
                <Truck className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium text-sm">Livraison gratuite</p>
                  <p className="text-xs text-gray-500">À partir de 50€</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium text-sm">Garantie 2 ans</p>
                  <p className="text-xs text-gray-500">Protection complète</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <RotateCcw className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium text-sm">Retour 30 jours</p>
                  <p className="text-xs text-gray-500">Satisfait ou remboursé</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Onglets détaillés */}
        <div className="mt-12">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="specifications">Spécifications</TabsTrigger>
              <TabsTrigger value="reviews">Avis ({product.reviews.length})</TabsTrigger>
            </TabsList>
            
            <TabsContent value="description" className="mt-6">
              <div className="bg-white rounded-lg p-6">
                <p className="text-gray-700 whitespace-pre-line">{product.longDescription}</p>
              </div>
            </TabsContent>
            
            <TabsContent value="specifications" className="mt-6">
              <div className="bg-white rounded-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-2 border-b border-gray-100">
                      <span className="font-medium text-gray-700">{key}</span>
                      <span className="text-gray-600">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="reviews" className="mt-6">
              <div className="bg-white rounded-lg p-6">
                <div className="space-y-6">
                  {product.reviews.map((review) => (
                    <div key={review.id} className="border-b border-gray-100 pb-4 last:border-b-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{review.author}</span>
                          <div className="flex items-center space-x-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < review.rating 
                                    ? 'fill-yellow-400 text-yellow-400' 
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <span className="text-sm text-gray-500">{review.date}</span>
                      </div>
                      <p className="text-gray-700">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
} 