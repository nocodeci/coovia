'use client';

import { useState } from 'react';
import { Download, ShoppingBag, CreditCard, Shield, Clock } from 'lucide-react';
import { Product } from '@/types/store';
import { Button, Card, CardContent, CardHeader, CardTitle, Badge } from '@/components/ui';

interface PurchaseOptionsProps {
  product: Product;
  onPurchase: () => void;
  onAddToCart: () => void;
}

export function PurchaseOptions({ product, onPurchase, onAddToCart }: PurchaseOptionsProps) {
  const [selectedOption, setSelectedOption] = useState<'purchase' | 'cart'>('purchase');

  // Formater le prix
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Options d'achat</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Purchase Options */}
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Download className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="font-medium text-foreground">Achat immédiat</div>
                <div className="text-sm text-muted-foreground">Téléchargement instantané</div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-bold text-primary">{formatPrice(product.price)}</div>
              <div className="text-xs text-muted-foreground">Paiement sécurisé</div>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="font-medium text-foreground">Ajouter au panier</div>
                <div className="text-sm text-muted-foreground">Acheter plus tard</div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-bold text-secondary">{formatPrice(product.price)}</div>
              <div className="text-xs text-muted-foreground">Même prix</div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button 
            className="w-full" 
            size="lg"
            onClick={onPurchase}
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

        {/* Payment Methods */}
        <div className="pt-4 border-t">
          <h4 className="font-medium text-foreground mb-3">Méthodes de paiement acceptées</h4>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 px-2 py-1 bg-muted rounded text-xs">
              <CreditCard className="w-3 h-3" />
              <span>Carte bancaire</span>
            </div>
            <div className="flex items-center gap-1 px-2 py-1 bg-muted rounded text-xs">
              <span>Mobile Money</span>
            </div>
            <div className="flex items-center gap-1 px-2 py-1 bg-muted rounded text-xs">
              <span>Orange Money</span>
            </div>
          </div>
        </div>

        {/* Security & Guarantee */}
        <div className="space-y-3 pt-4 border-t">
          <div className="flex items-center gap-2 text-sm">
            <Shield className="w-4 h-4 text-green-500" />
            <span>Paiement 100% sécurisé</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Clock className="w-4 h-4 text-blue-500" />
            <span>Accès immédiat après paiement</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Download className="w-4 h-4 text-primary" />
            <span>Téléchargement illimité</span>
          </div>
        </div>

        {/* Money Back Guarantee */}
        <div className="bg-muted/50 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">✓</span>
            </div>
            <div>
              <div className="font-medium text-foreground">Garantie satisfait ou remboursé</div>
              <div className="text-sm text-muted-foreground">
                30 jours pour tester le produit
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

