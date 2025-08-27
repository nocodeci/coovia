import React from 'react'
import { useNavigate, useParams } from '@tanstack/react-router'
import { CheckCircle, Package, Truck, Home, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function CheckoutSuccessPage() {
  const navigate = useNavigate()
  const { storeId } = useParams({ from: '/_authenticated/$storeId/boutique/checkout/success' })
  
  // Générer un numéro de commande aléatoire
  const orderNumber = `CMD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="text-center">
          <CardHeader className="pb-8">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
              Commande confirmée !
            </CardTitle>
            <p className="text-gray-600">
              Merci pour votre commande. Nous avons bien reçu votre paiement et nous préparons votre colis.
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Numéro de commande */}
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Numéro de commande</p>
              <p className="text-lg font-mono font-bold text-gray-900">{orderNumber}</p>
            </div>

            {/* Étapes suivantes */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Prochaines étapes</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex flex-col items-center text-center space-y-2">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Package className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Préparation</p>
                    <p className="text-xs text-gray-500">1-2 jours</p>
                  </div>
                </div>
                
                <div className="flex flex-col items-center text-center space-y-2">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                    <Truck className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Expédition</p>
                    <p className="text-xs text-gray-500">3-5 jours</p>
                  </div>
                </div>
                
                <div className="flex flex-col items-center text-center space-y-2">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Livraison</p>
                    <p className="text-xs text-gray-500">À votre porte</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Informations importantes */}
            <div className="bg-blue-50 rounded-lg p-4 text-left">
              <h4 className="font-semibold text-blue-900 mb-2">Informations importantes</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Vous recevrez un email de confirmation avec les détails de votre commande</li>
                <li>• Un email de suivi vous sera envoyé dès l'expédition</li>
                <li>• Vous pouvez suivre votre commande avec le numéro ci-dessus</li>
                <li>• Pour toute question, contactez notre service client</li>
              </ul>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button 
                onClick={() => navigate({ to: `/${storeId}/boutique` })}
                className="flex-1"
              >
                <Home className="h-4 w-4 mr-2" />
                Retourner à la boutique
              </Button>
              
              <Button 
                variant="outline"
                className="flex-1"
              >
                <Download className="h-4 w-4 mr-2" />
                Télécharger la facture
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 