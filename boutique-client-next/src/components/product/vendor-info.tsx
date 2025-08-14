'use client';

import { Store, ShoppingBag, Star, Clock, MessageCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, Button, Badge } from '@/components/ui';

interface VendorInfoProps {
  store: any;
}

export function VendorInfo({ store }: VendorInfoProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <ShoppingBag className="w-5 h-5" />
          À propos de la boutique
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Store Info */}
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
            <ShoppingBag className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-foreground">{store.name}</h3>
            <p className="text-sm text-muted-foreground">Digital Store</p>
          </div>
          <Badge variant="secondary">Vérifié</Badge>
        </div>

        {/* Store Description */}
        <p className="text-sm text-muted-foreground leading-relaxed">
          {store.description || 'Boutique en ligne spécialisée dans la vente de produits numériques de qualité. Nous proposons des formations, templates et ressources pour développer vos compétences.'}
        </p>

        {/* Store Stats */}
        <div className="grid grid-cols-3 gap-4 py-4 border-t border-b">
          <div className="text-center">
            <div className="text-lg font-semibold text-foreground">
              {Math.floor(Math.random() * 100) + 50}
            </div>
            <div className="text-xs text-muted-foreground">Produits</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-foreground">
              {Math.floor(Math.random() * 1000) + 500}
            </div>
            <div className="text-xs text-muted-foreground">Ventes</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center">
              <Star className="w-4 h-4 text-yellow-500 fill-current" />
              <span className="text-lg font-semibold text-foreground ml-1">
                {Math.floor(Math.random() * 2) + 4}.{Math.floor(Math.random() * 9)}
              </span>
            </div>
            <div className="text-xs text-muted-foreground">Note</div>
          </div>
        </div>

        {/* Store Features */}
        <div className="space-y-2">
          <div className="flex items-center text-sm">
            <Clock className="w-4 h-4 text-primary mr-2" />
            <span>Réponse rapide (moins de 2h)</span>
          </div>
          <div className="flex items-center text-sm">
            <MessageCircle className="w-4 h-4 text-primary mr-2" />
            <span>Support client disponible</span>
          </div>
          <div className="flex items-center text-sm">
            <ShoppingBag className="w-4 h-4 text-primary mr-2" />
            <span>Produits de qualité premium</span>
          </div>
        </div>

        {/* Contact Button */}
        <Button variant="outline" className="w-full">
          <MessageCircle className="w-4 h-4 mr-2" />
          Contacter la boutique
        </Button>
      </CardContent>
    </Card>
  );
}

