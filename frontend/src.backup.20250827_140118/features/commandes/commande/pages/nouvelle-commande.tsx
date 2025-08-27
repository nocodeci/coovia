"use client"

import { useState, useEffect } from "react"
import { useParams } from "@tanstack/react-router"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { 
  ArrowLeft, 
  Plus, 
  Trash2, 
  User, 
  Mail, 
  Phone, 
  MapPin,
  ShoppingCart,
  CreditCard,
  Save,
  X
} from "lucide-react"
import { useAuth } from "@/hooks/useAuthQuery"
import { useStores } from "@/hooks/useStores"
import { CircleLoader } from "@/components/ui/circle-loader"
import { toast } from "sonner"
import apiService from "@/lib/api"

interface Product {
  id: string
  name: string
  price: number
  description: string
  image?: string
  status?: string
}

interface OrderItem {
  productId: string
  product: Product
  quantity: number
  price: number
  total: number
}

interface Customer {
  name: string
  email: string
  phone: string
  address: string
}

export function NouvelleCommandePage() {
  const { storeId } = useParams({ from: "/_authenticated/$storeId/commandes/nouvelle" })
  
  // Hooks React Query
  const { data: user, isLoading: authLoading, isError: authError } = useAuth()
  const { data: stores, isLoading: storesLoading, isError: storesError } = useStores()
  
  // Trouver la boutique actuelle
  const currentStore = stores?.find(store => store.id === storeId)
  
  // États du formulaire
  const [customer, setCustomer] = useState<Customer>({
    name: "",
    email: "",
    phone: "",
    address: ""
  })
  
  const [orderItems, setOrderItems] = useState<OrderItem[]>([])
  const [selectedProduct, setSelectedProduct] = useState<string>("")
  const [quantity, setQuantity] = useState<number>(1)
  const [paymentMethod, setPaymentMethod] = useState<string>("card")
  const [orderStatus, setOrderStatus] = useState<string>("pending")
  const [notes, setNotes] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [productsLoading, setProductsLoading] = useState(false)
  const [availableProducts, setAvailableProducts] = useState<Product[]>([])
  const [includeTax, setIncludeTax] = useState<boolean>(true)
  const [taxRate, setTaxRate] = useState<number>(18) // 18% par défaut
  
  // Charger les produits de la boutique
  useEffect(() => {
    const loadProducts = async () => {
      if (!currentStore?.id) return

      try {
        setProductsLoading(true)
        
        // Vérifier si l'utilisateur est authentifié
        const token = localStorage.getItem('auth_token')
        if (!token) {
          console.warn("Utilisateur non authentifié, utilisation des données de démonstration")
          const fallbackProducts: Product[] = [
            {
              id: "1",
              name: "Formation React Avancé",
              price: 25000,
              description: "Formation complète sur React et ses écosystèmes",
              status: "active"
            },
            {
              id: "2", 
              name: "Template E-commerce",
              price: 15000,
              description: "Template complet pour site e-commerce",
              status: "active"
            },
            {
              id: "3",
              name: "Pack Design System",
              price: 30000,
              description: "Système de design complet avec composants",
              status: "active"
            },
            {
              id: "4",
              name: "Cours JavaScript ES6+",
              price: 18000,
              description: "Formation sur les nouvelles fonctionnalités JavaScript",
              status: "active"
            }
          ]
          setAvailableProducts(fallbackProducts)
          return
        }

        const response = await apiService.getStoreProducts(currentStore.id)
        
        if (response.success && response.data) {
          let productsData = (response.data as any).data || response.data
          // Filtrer seulement les produits actifs
          const activeProducts = productsData.filter((product: Product) => 
            product.status === 'active' || !product.status
          )
          setAvailableProducts(activeProducts)
        } else {
          // Fallback avec des données de démonstration si l'API échoue
          console.warn("Impossible de charger les produits, utilisation des données de démonstration")
          const fallbackProducts: Product[] = [
            {
              id: "1",
              name: "Formation React Avancé",
              price: 25000,
              description: "Formation complète sur React et ses écosystèmes",
              status: "active"
            },
            {
              id: "2", 
              name: "Template E-commerce",
              price: 15000,
              description: "Template complet pour site e-commerce",
              status: "active"
            },
            {
              id: "3",
              name: "Pack Design System",
              price: 30000,
              description: "Système de design complet avec composants",
              status: "active"
            },
            {
              id: "4",
              name: "Cours JavaScript ES6+",
              price: 18000,
              description: "Formation sur les nouvelles fonctionnalités JavaScript",
              status: "active"
            }
          ]
          setAvailableProducts(fallbackProducts)
        }
      } catch (error) {
        console.error('Erreur lors du chargement des produits:', error)
        // Fallback avec des données de démonstration en cas d'erreur
        const fallbackProducts: Product[] = [
          {
            id: "1",
            name: "Formation React Avancé",
            price: 25000,
            description: "Formation complète sur React et ses écosystèmes",
            status: "active"
          },
          {
            id: "2", 
            name: "Template E-commerce",
            price: 15000,
            description: "Template complet pour site e-commerce",
            status: "active"
          },
          {
            id: "3",
            name: "Pack Design System",
            price: 30000,
            description: "Système de design complet avec composants",
            status: "active"
          },
          {
            id: "4",
            name: "Cours JavaScript ES6+",
            price: 18000,
            description: "Formation sur les nouvelles fonctionnalités JavaScript",
            status: "active"
          }
        ]
        setAvailableProducts(fallbackProducts)
        toast.error("Erreur lors du chargement des produits, utilisation des données de démonstration")
      } finally {
        setProductsLoading(false)
      }
    }

    loadProducts()
  }, [currentStore?.id])

  const handleAddItem = () => {
    if (!selectedProduct || quantity <= 0) {
      toast.error("Veuillez sélectionner un produit et une quantité")
      return
    }

    const product = availableProducts.find(p => p.id === selectedProduct)
    if (!product) return

    // Vérifier si le produit est déjà dans la commande
    const existingItemIndex = orderItems.findIndex(item => item.productId === selectedProduct)
    
    if (existingItemIndex !== -1) {
      // Mettre à jour la quantité du produit existant
      setOrderItems(prev => prev.map((item, index) => 
        index === existingItemIndex 
          ? { ...item, quantity: item.quantity + quantity, total: item.price * (item.quantity + quantity) }
          : item
      ))
      toast.success("Quantité mise à jour")
    } else {
      // Ajouter un nouveau produit
      const newItem: OrderItem = {
        productId: selectedProduct,
        product,
        quantity,
        price: product.price,
        total: product.price * quantity
      }

      setOrderItems(prev => [...prev, newItem])
      toast.success("Produit ajouté à la commande")
    }
    
    setSelectedProduct("")
    setQuantity(1)
  }

  const handleRemoveItem = (index: number) => {
    setOrderItems(prev => prev.filter((_, i) => i !== index))
    toast.success("Produit retiré de la commande")
  }

  const handleUpdateQuantity = (index: number, newQuantity: number) => {
    if (newQuantity <= 0) return
    
    setOrderItems(prev => prev.map((item, i) => 
      i === index 
        ? { ...item, quantity: newQuantity, total: item.price * newQuantity }
        : item
    ))
  }

  const calculateSubtotal = () => {
    return orderItems.reduce((sum, item) => sum + item.total, 0)
  }

  const calculateTax = () => {
    if (!includeTax) return 0
    return calculateSubtotal() * (taxRate / 100)
  }

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax()
  }

  const handleSubmit = async () => {
    if (!customer.name || !customer.email) {
      toast.error("Veuillez remplir les informations du client")
      return
    }

    if (orderItems.length === 0) {
      toast.error("Veuillez ajouter au moins un produit")
      return
    }

    setLoading(true)

    try {
      // Simulation de création de commande
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const orderData = {
        customer,
        items: orderItems,
        paymentMethod,
        status: orderStatus,
        notes,
        subtotal: calculateSubtotal(),
        tax: calculateTax(),
        total: calculateTotal(),
        includeTax,
        taxRate,
        storeId
      }

      console.log("Nouvelle commande créée:", orderData)
      toast.success("Commande créée avec succès !")
      
      // Redirection vers la liste des commandes
      window.location.href = `/${storeId}/commandes`
    } catch (error) {
      console.error("Erreur lors de la création de la commande:", error)
      toast.error("Erreur lors de la création de la commande")
    } finally {
      setLoading(false)
    }
  }

  const handleBack = () => {
    window.location.href = `/${storeId}/commandes`
  }

  // États de chargement et d'erreur
  const isLoading = authLoading || storesLoading
  const isError = authError || storesError

  // Vérifications avant affichage
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <CircleLoader 
          size="lg" 
          message="Chargement..." 
        />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-destructive text-lg font-semibold mb-2">Erreur</div>
          <div className="text-muted-foreground">
            {authError ? "Erreur d'authentification" : "Erreur de chargement des boutiques"}
          </div>
          <Button 
            onClick={() => window.location.reload()}
            className="mt-4"
          >
            Réessayer
          </Button>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-destructive text-lg font-semibold mb-2">Accès refusé</div>
          <div className="text-muted-foreground">Vous devez être connecté pour accéder à cette page.</div>
        </div>
      </div>
    )
  }

  if (!currentStore) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-destructive text-lg font-semibold mb-2">Aucune boutique sélectionnée</div>
          <div className="text-muted-foreground">Veuillez sélectionner une boutique pour continuer.</div>
          <Button 
            onClick={() => window.location.href = "/store-selection"}
            className="mt-4"
          >
            Sélectionner une boutique
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBack}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Retour
              </Button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Nouvelle Commande</h1>
                <p className="text-sm text-gray-500">Créer une nouvelle commande pour {currentStore.name}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                onClick={handleBack}
              >
                Annuler
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={loading || orderItems.length === 0}
                className="flex items-center space-x-2"
              >
                {loading ? (
                  <CircleLoader size="sm" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                Créer la commande
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Colonne principale */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Informations client */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>Informations client</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="customerName">Nom complet *</Label>
                    <Input
                      id="customerName"
                      value={customer.name}
                      onChange={(e) => setCustomer(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Nom et prénom du client"
                    />
                  </div>
                  <div>
                    <Label htmlFor="customerEmail">Email *</Label>
                    <Input
                      id="customerEmail"
                      type="email"
                      value={customer.email}
                      onChange={(e) => setCustomer(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="email@exemple.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="customerPhone">Téléphone</Label>
                    <Input
                      id="customerPhone"
                      value={customer.phone}
                      onChange={(e) => setCustomer(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="+225 0123456789"
                    />
                  </div>
                  <div>
                    <Label htmlFor="customerAddress">Adresse</Label>
                    <Input
                      id="customerAddress"
                      value={customer.address}
                      onChange={(e) => setCustomer(prev => ({ ...prev, address: e.target.value }))}
                      placeholder="Adresse de livraison"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Produits de la commande */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <ShoppingCart className="h-5 w-5" />
                  <span>Produits de la commande</span>
                  {productsLoading && (
                    <Badge variant="secondary" className="ml-2">
                      <CircleLoader size="sm" />
                      Chargement...
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                
                {/* Ajouter un produit */}
                <div className="border rounded-lg p-4 bg-gray-50">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="productSelect">Produit</Label>
                      <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un produit" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableProducts.length === 0 ? (
                            <SelectItem value="no-products" disabled>
                              {productsLoading ? "Chargement..." : "Aucun produit disponible"}
                            </SelectItem>
                          ) : (
                            availableProducts.map((product) => (
                              <SelectItem key={product.id} value={product.id}>
                                {product.name} - {product.price.toLocaleString()} FCFA
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="quantity">Quantité</Label>
                      <Input
                        id="quantity"
                        type="number"
                        min="1"
                        value={quantity}
                        onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                      />
                    </div>
                    <div className="flex items-end">
                      <Button 
                        onClick={handleAddItem} 
                        className="w-full"
                        disabled={!selectedProduct || productsLoading}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Ajouter
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Liste des produits */}
                {orderItems.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-900">Produits ajoutés</h4>
                    {orderItems.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg bg-white">
                        <div className="flex-1">
                          <h5 className="font-medium text-gray-900">{item.product.name}</h5>
                          <p className="text-sm text-gray-500">{item.product.description}</p>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            <Label htmlFor={`quantity-${index}`} className="text-sm">Qté:</Label>
                            <Input
                              id={`quantity-${index}`}
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) => handleUpdateQuantity(index, parseInt(e.target.value) || 1)}
                              className="w-20"
                            />
                          </div>
                          <div className="text-right">
                            <div className="font-medium">{item.price.toLocaleString()} FCFA</div>
                            <div className="text-sm text-gray-500">Total: {item.total.toLocaleString()} FCFA</div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveItem(index)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Notes */}
            <Card>
              <CardHeader>
                <CardTitle>Notes de commande</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ajoutez des notes ou instructions spéciales pour cette commande..."
                  rows={4}
                />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Résumé de la commande */}
            <Card>
              <CardHeader>
                <CardTitle>Résumé de la commande</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                
                {/* Méthode de paiement */}
                <div>
                  <Label htmlFor="paymentMethod">Méthode de paiement</Label>
                  <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="card">Carte bancaire</SelectItem>
                      <SelectItem value="cash">Espèces</SelectItem>
                      <SelectItem value="mobile_money">Mobile Money</SelectItem>
                      <SelectItem value="bank_transfer">Virement bancaire</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Statut de la commande */}
                <div>
                  <Label htmlFor="orderStatus">Statut de la commande</Label>
                  <Select value={orderStatus} onValueChange={setOrderStatus}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">En attente</SelectItem>
                      <SelectItem value="processing">En traitement</SelectItem>
                      <SelectItem value="shipped">Expédiée</SelectItem>
                      <SelectItem value="delivered">Livrée</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Options TVA */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="includeTax">Inclure la TVA</Label>
                    <Switch
                      id="includeTax"
                      checked={includeTax}
                      onCheckedChange={setIncludeTax}
                    />
                  </div>
                  
                  {includeTax && (
                    <div>
                      <Label htmlFor="taxRate">Taux de TVA (%)</Label>
                      <Input
                        id="taxRate"
                        type="number"
                        min="0"
                        max="100"
                        step="0.1"
                        value={taxRate}
                        onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
                        className="w-full"
                      />
                    </div>
                  )}
                </div>

                <Separator />

                {/* Calculs */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sous-total:</span>
                    <span>{calculateSubtotal().toLocaleString()} FCFA</span>
                  </div>
                  
                  {includeTax && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">TVA ({taxRate}%):</span>
                      <span>{calculateTax().toLocaleString()} FCFA</span>
                    </div>
                  )}
                  
                  <Separator />
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total:</span>
                    <span>{calculateTotal().toLocaleString()} FCFA</span>
                  </div>
                </div>

                {/* Informations supplémentaires */}
                <div className="text-sm text-gray-500 space-y-1">
                  <div>• {orderItems.length} produit(s) sélectionné(s)</div>
                  <div>• Commande pour {currentStore.name}</div>
                  <div>• Client: {customer.name || "Non renseigné"}</div>
                  {includeTax && (
                    <div>• TVA incluse ({taxRate}%)</div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Actions rapides */}
            <Card>
              <CardHeader>
                <CardTitle>Actions rapides</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Paiement en ligne
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Mail className="h-4 w-4 mr-2" />
                  Envoyer par email
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <MapPin className="h-4 w-4 mr-2" />
                  Livraison
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
} 