import React, { useState, useEffect } from 'react';
import { cartService } from '../../services/lunarService';
import { LunarCart, LunarCartLine } from '../../types/lunar';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Separator } from '../ui/separator';
import { Badge } from '../ui/badge';
import { 
  Trash2, 
  ShoppingCart, 
  Download, 
  FileText, 
  Video, 
  Music, 
  Image,
  Clock,
  HardDrive,
  Globe,
  CheckCircle,
  ArrowRight,
  CreditCard,
  Lock
} from 'lucide-react';

interface ShoppingCartComponentProps {
  onCheckout?: () => void;
  onUpdateQuantity?: (lineId: string, quantity: number) => void;
  onRemoveItem?: (lineId: string) => void;
}

export const ShoppingCartComponent: React.FC<ShoppingCartComponentProps> = ({
  onCheckout,
  onUpdateQuantity,
  onRemoveItem
}) => {
  const [cart, setCart] = useState<LunarCart | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingItems, setUpdatingItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await cartService.getCurrent();
      
      if (response.success) {
        setCart(response.data);
      }
    } catch (err) {
      setError('Erreur lors du chargement du panier');
      console.error('Erreur fetchCart:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = async (lineId: string, newQuantity: number) => {
    if (newQuantity < 1) return;

    try {
      setUpdatingItems(prev => new Set(prev).add(lineId));
      
      if (onUpdateQuantity) {
        onUpdateQuantity(lineId, newQuantity);
      } else {
        await cartService.updateItem(lineId, newQuantity);
        await fetchCart(); // Rafraîchir le panier
      }
    } catch (err) {
      console.error('Erreur mise à jour quantité:', err);
    } finally {
      setUpdatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(lineId);
        return newSet;
      });
    }
  };

  const handleRemoveItem = async (lineId: string) => {
    try {
      if (onRemoveItem) {
        onRemoveItem(lineId);
      } else {
        await cartService.removeItem(lineId);
        await fetchCart(); // Rafraîchir le panier
      }
    } catch (err) {
      console.error('Erreur suppression article:', err);
    }
  };

  const handleClearCart = async () => {
    try {
      await cartService.clear();
      await fetchCart(); // Rafraîchir le panier
    } catch (err) {
      console.error('Erreur vidage panier:', err);
    }
  };

  const getDigitalProductIcon = (productType: string) => {
    switch (productType?.toLowerCase()) {
      case 'ebook':
      case 'pdf':
      case 'document':
        return <FileText className="h-6 w-6" />;
      case 'video':
      case 'cours':
      case 'formation':
        return <Video className="h-6 w-6" />;
      case 'audio':
      case 'podcast':
      case 'musique':
        return <Music className="h-6 w-6" />;
      case 'image':
      case 'photo':
      case 'design':
        return <Image className="h-6 w-6" />;
      default:
        return <Download className="h-6 w-6" />;
    }
  };

  const getDigitalProductBadge = (productType: string) => {
    switch (productType?.toLowerCase()) {
      case 'ebook':
      case 'pdf':
        return <Badge variant="outline" className="border-blue-500 text-blue-700 text-xs">Document</Badge>;
      case 'video':
      case 'cours':
        return <Badge variant="outline" className="border-purple-500 text-purple-700 text-xs">Vidéo</Badge>;
      case 'audio':
      case 'podcast':
        return <Badge variant="outline" className="border-green-500 text-green-700 text-xs">Audio</Badge>;
      case 'image':
      case 'design':
        return <Badge variant="outline" className="border-orange-500 text-orange-700 text-xs">Design</Badge>;
      default:
        return <Badge variant="outline" className="text-xs">Digital</Badge>;
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF'
    }).format(price);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={fetchCart}>Réessayer</Button>
      </div>
    );
  }

  if (!cart || cart.lines.length === 0) {
    return (
      <div className="text-center py-12">
        <Download className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Votre panier est vide</h3>
        <p className="text-gray-500 mb-6">
          Ajoutez des produits digitaux à votre panier pour commencer vos achats
        </p>
        <Button onClick={() => window.location.href = '/'}>
          Parcourir les produits
        </Button>
      </div>
    );
  }

  const subtotal = cart.lines.reduce((sum, line) => sum + (line.unit_price * line.quantity), 0);
  const tax = subtotal * 0.18; // TVA 18% (à ajuster selon votre pays)
  const total = subtotal + tax;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Votre panier</h1>
        <p className="text-gray-600">
          {cart.lines.length} produit{cart.lines.length > 1 ? 's' : ''} digital{cart.lines.length > 1 ? 'aux' : ''} dans votre panier
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Liste des articles */}
        <div className="lg:col-span-2 space-y-4">
          {cart.lines.map((line) => (
            <Card key={line.id} className="overflow-hidden">
              <div className="flex">
                {/* Image du produit */}
                <div className="w-24 h-24 bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center flex-shrink-0">
                  {line.product?.attribute_data?.image ? (
                    <img
                      src={line.product.attribute_data.image}
                      alt={line.product.attribute_data.name || 'Produit digital'}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-blue-600">
                      {getDigitalProductIcon(line.product?.attribute_data?.type)}
                    </div>
                  )}
                </div>

                {/* Informations du produit */}
                <div className="flex-1 p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 mb-1">
                        {line.product?.attribute_data?.name || 'Nom du produit'}
                      </h3>
                      
                      {/* Type de produit digital */}
                      <div className="mb-2">
                        {getDigitalProductBadge(line.product?.attribute_data?.type)}
                      </div>
                      
                      {/* Informations spécifiques aux produits digitaux */}
                      <div className="flex items-center gap-4 text-xs text-gray-500 mb-2">
                        {line.product?.attribute_data?.file_size && (
                          <div className="flex items-center gap-1">
                            <HardDrive className="h-3 w-3" />
                            <span>{line.product.attribute_data.file_size}</span>
                          </div>
                        )}
                        
                        {line.product?.attribute_data?.format && (
                          <div className="flex items-center gap-1">
                            <Download className="h-3 w-3" />
                            <span>{line.product.attribute_data.format}</span>
                          </div>
                        )}
                        
                        {line.product?.attribute_data?.duration && (
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{line.product.attribute_data.duration}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Prix unitaire */}
                    <div className="text-right ml-4">
                      <p className="font-medium text-gray-900">
                        {formatPrice(line.unit_price)}
                      </p>
                      {line.product?.attribute_data?.compare_price && (
                        <p className="text-sm text-gray-500 line-through">
                          {formatPrice(line.product.attribute_data.compare_price)}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Contrôles de quantité et suppression */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuantityChange(line.id, line.quantity - 1)}
                        disabled={line.quantity <= 1 || updatingItems.has(line.id)}
                      >
                        -
                      </Button>
                      
                      <Input
                        type="number"
                        min="1"
                        value={line.quantity}
                        onChange={(e) => {
                          const newQuantity = parseInt(e.target.value) || 1;
                          handleQuantityChange(line.id, newQuantity);
                        }}
                        className="w-16 text-center"
                        disabled={updatingItems.has(line.id)}
                      />
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuantityChange(line.id, line.quantity + 1)}
                        disabled={updatingItems.has(line.id)}
                      >
                        +
                      </Button>
                    </div>

                    <div className="flex items-center gap-4">
                      {/* Prix total pour cet article */}
                      <p className="font-medium text-gray-900">
                        Total: {formatPrice(line.unit_price * line.quantity)}
                      </p>
                      
                      {/* Bouton suppression */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveItem(line.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}

          {/* Actions sur le panier */}
          <div className="flex justify-between items-center pt-4">
            <Button
              variant="outline"
              onClick={handleClearCart}
              className="text-red-600 border-red-200 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Vider le panier
            </Button>
            
            <Button
              variant="outline"
              onClick={() => window.location.href = '/'}
            >
              Continuer les achats
            </Button>
          </div>
        </div>

        {/* Résumé de la commande */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>Résumé de la commande</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Détails des prix */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Sous-total ({cart.lines.length} article{cart.lines.length > 1 ? 's' : ''})</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>TVA (18%)</span>
                  <span>{formatPrice(tax)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-medium text-lg">
                  <span>Total</span>
                  <span className="text-primary">{formatPrice(total)}</span>
                </div>
              </div>

              {/* Avantages des produits digitaux */}
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="font-medium text-blue-900 mb-3 text-sm">Avantages des produits digitaux</h4>
                <div className="space-y-2 text-xs text-blue-800">
                  <div className="flex items-center gap-2">
                    <Download className="h-3 w-3" />
                    <span>Téléchargement instantané</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3" />
                    <span>Accès illimité</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="h-3 w-3" />
                    <span>Disponible partout</span>
                  </div>
                </div>
              </div>

              {/* Bouton de commande */}
              <Button
                onClick={onCheckout}
                className="w-full"
                size="lg"
              >
                <CreditCard className="h-5 w-5 mr-2" />
                Procéder au paiement
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>

              {/* Sécurité */}
              <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                <Lock className="h-3 w-3" />
                <span>Paiement sécurisé</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
