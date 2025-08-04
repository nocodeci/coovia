import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/ui/card'
import CurrencySelector from './CurrencySelector'
import CountrySelector from './CountrySelector'
import { useCurrency } from '../contexts/CurrencyContext'

const CurrencyDemo: React.FC = () => {
  const { formatPrice } = useCurrency()

  const sampleProducts = [
    { name: 'Produit Premium', price: 25000 },
    { name: 'Service Standard', price: 15000 },
    { name: 'Pack Basique', price: 5000 }
  ]

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Sélecteur de Devise */}
        <Card>
          <CardHeader>
            <CardTitle>Sélecteur de Devise</CardTitle>
            <CardDescription>
              Changez la devise pour voir les prix se mettre à jour
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium">Devise :</span>
              <CurrencySelector />
            </div>
            
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Prix en temps réel :</h4>
              {sampleProducts.map((product, index) => (
                <div key={index} className="flex justify-between items-center p-2 bg-muted rounded">
                  <span className="text-sm">{product.name}</span>
                  <span className="font-medium">{formatPrice(product.price)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Sélecteur de Pays */}
        <Card>
          <CardHeader>
            <CardTitle>Sélecteur de Pays</CardTitle>
            <CardDescription>
              Sélectionnez un pays pour voir sa devise et son drapeau
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CountrySelector 
              onCountrySelect={(country) => {
                console.log('Pays sélectionné:', country)
              }}
            />
          </CardContent>
        </Card>
      </div>

      {/* Informations sur les composants */}
      <Card>
        <CardHeader>
          <CardTitle>Composants Installés</CardTitle>
          <CardDescription>
            Liste des composants shadcn/ui et dépendances ajoutés
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-3 bg-muted rounded">
              <h4 className="font-medium text-sm">shadcn/ui</h4>
              <ul className="text-xs text-muted-foreground mt-1">
                <li>• Button</li>
                <li>• Command</li>
                <li>• Popover</li>
                <li>• Card</li>
                <li>• DropdownMenu</li>
                <li>• Select</li>
              </ul>
            </div>
            
            <div className="p-3 bg-muted rounded">
              <h4 className="font-medium text-sm">Drapeaux</h4>
              <ul className="text-xs text-muted-foreground mt-1">
                <li>• react-circle-flags</li>
                <li>• Drapeaux de pays</li>
                <li>• Format SVG</li>
                <li>• Haute qualité</li>
              </ul>
            </div>
            
            <div className="p-3 bg-muted rounded">
              <h4 className="font-medium text-sm">Données Pays</h4>
              <ul className="text-xs text-muted-foreground mt-1">
                <li>• country-data-list</li>
                <li>• 250+ pays</li>
                <li>• Devises officielles</li>
                <li>• Codes ISO</li>
              </ul>
            </div>
            
            <div className="p-3 bg-muted rounded">
              <h4 className="font-medium text-sm">Fonctionnalités</h4>
              <ul className="text-xs text-muted-foreground mt-1">
                <li>• Recherche</li>
                <li>• Filtrage</li>
                <li>• Accessibilité</li>
                <li>• Responsive</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default CurrencyDemo 