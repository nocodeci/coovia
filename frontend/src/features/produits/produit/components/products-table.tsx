"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "@tanstack/react-router"
import { 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Eye, 
  Copy, 
  Archive, 
  RefreshCw,
  Search,
  Filter,
  Download,
  Upload,
  Plus,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  Clock,
  AlertCircle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useStore } from "@/context/store-context"
import apiService from "@/lib/api"
import { ProductImage } from "./product-image"

type TabType = "tous" | "actifs" | "brouillons" | "archives"

interface FilterState {
  searchTerm: string
  category: string
  status: string
  stock: string
}

interface ProductsTableProps {
  activeTab: TabType
  sortOrder: "asc" | "desc"
  filters: FilterState
}

interface PaginationState {
  currentPage: number
  perPage: number
  total: number
  totalPages: number
}

// Configuration des catégories avec icônes et couleurs
const categoryConfig = {
  'Accessories': { icon: '🎧', color: 'bg-red-100 text-red-600' },
  'Home Decor': { icon: '🏠', color: 'bg-blue-100 text-blue-600' },
  'Electronics': { icon: '💻', color: 'bg-green-100 text-green-600' },
  'Shoes': { icon: '👟', color: 'bg-purple-100 text-purple-600' },
  'Office': { icon: '💼', color: 'bg-orange-100 text-orange-600' },
  'Games': { icon: '🎮', color: 'bg-pink-100 text-pink-600' },
}

// Configuration des statuts
const statusConfig = {
  active: { 
    label: "Actif", 
    icon: CheckCircle, 
    color: "bg-green-100 text-green-800 border-green-200" 
  },
  draft: { 
    label: "Brouillon", 
    icon: Clock, 
    color: "bg-yellow-100 text-yellow-800 border-yellow-200" 
  },
  archived: { 
    label: "Archivé", 
    icon: AlertCircle, 
    color: "bg-gray-100 text-gray-800 border-gray-200" 
  },
}

export function ProductsTable({ activeTab, sortOrder, filters }: ProductsTableProps) {
  const { currentStore } = useStore()
  const navigate = useNavigate()
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])
  const [pagination, setPagination] = useState<PaginationState>({
    currentPage: 1,
    perPage: 10,
    total: 0,
    totalPages: 0
  })

  useEffect(() => {
    const loadProducts = async () => {
      if (!currentStore?.id) {
        setLoading(false)
        setError('Aucune boutique sélectionnée')
        return
      }

      try {
        setLoading(true)
        setError(null)
        
        const response = await apiService.getStoreProducts(
          currentStore.id, 
          pagination.currentPage, 
          pagination.perPage
        )
        
        if (response.success && response.data) {
          let filteredProducts = (response.data as any).data || response.data

          // Filtrer par onglet
          if (activeTab !== "tous") {
            const statusMap = {
              "actifs": "active",
              "brouillons": "draft", 
              "archives": "archived"
            }
            filteredProducts = filteredProducts.filter((product: any) => 
              product.status === statusMap[activeTab as keyof typeof statusMap]
            )
          }

          // Filtrer par recherche
          if (filters.searchTerm) {
            filteredProducts = filteredProducts.filter((product: any) =>
              product.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
              stripHtml(product.description)?.toLowerCase().includes(filters.searchTerm.toLowerCase())
            )
          }

          // Filtrer par catégorie
          if (filters.category) {
            filteredProducts = filteredProducts.filter((product: any) =>
              product.category === filters.category
            )
          }

          // Filtrer par statut
          if (filters.status) {
            filteredProducts = filteredProducts.filter((product: any) =>
              product.status === filters.status
            )
          }

          // Filtrer par stock
          if (filters.stock) {
            if (filters.stock === 'in_stock') {
              filteredProducts = filteredProducts.filter((product: any) =>
                (product.stock_quantity || 0) > 0
              )
            } else if (filters.stock === 'out_of_stock') {
              filteredProducts = filteredProducts.filter((product: any) =>
                (product.stock_quantity || 0) <= 0
              )
            }
          }

          // Trier
          filteredProducts.sort((a: any, b: any) => {
            const aName = a.name.toLowerCase()
            const bName = b.name.toLowerCase()
            return sortOrder === "asc" 
              ? aName.localeCompare(bName)
              : bName.localeCompare(aName)
          })

          setProducts(filteredProducts)
          
          if ((response.data as any).pagination) {
            setPagination(prev => ({
              ...prev,
              total: (response.data as any).pagination.total,
              totalPages: (response.data as any).pagination.last_page,
              currentPage: (response.data as any).pagination.current_page
            }))
          }
        } else {
          setError('Erreur lors du chargement des produits')
        }
      } catch (err: any) {
        console.error('Erreur lors du chargement des produits:', err)
        setError(err.message || 'Erreur de connexion')
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [currentStore?.id, activeTab, filters, sortOrder, pagination.currentPage, pagination.perPage])

  const getStatusBadge = (status: string) => {
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft
    const Icon = config.icon
    
    return (
      <Badge className={`${config.color} border`}>
        <Icon className="w-3 h-3 mr-1" />
        {config.label}
      </Badge>
    )
  }

  const getCategoryBadge = (category: string) => {
    const config = categoryConfig[category as keyof typeof categoryConfig] || {
      icon: '📦',
      color: 'bg-gray-100 text-gray-600'
    }
    
    return (
      <Badge className={config.color}>
        <span className="mr-1">{config.icon}</span>
        {category || "Non catégorisé"}
      </Badge>
    )
  }

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({
      ...prev,
      currentPage: newPage
    }))
  }

  const handlePerPageChange = (newPerPage: number) => {
    setPagination(prev => ({
      ...prev,
      perPage: newPerPage,
      currentPage: 1
    }))
  }

  const handleRefresh = () => {
    setPagination(prev => ({
      ...prev,
      currentPage: 1
    }))
  }

  const handleSelectAll = () => {
    if (selectedProducts.length === products.length) {
      setSelectedProducts([])
    } else {
      setSelectedProducts(products.map(p => p.id))
    }
  }

  const handleSelectProduct = (productId: string) => {
    setSelectedProducts(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    )
  }

  const stripHtml = (html: string) => {
    if (!html) return ''
    const tempDiv = document.createElement('div')
    tempDiv.innerHTML = html
    return tempDiv.textContent || tempDiv.innerText || ''
  }

  const handleAction = async (action: string, product: any) => {
    console.log(`${action} pour le produit:`, product.name)
    
    const originalProducts = [...products]
    
    switch (action) {
      case "view":
        navigate({ to: "/_authenticated/$storeId/produits/$productId" })
        break
      case "edit":
        navigate({ to: "/_authenticated/$storeId/produits/$productId/edit" })
        break
      case "duplicate":
        try {
          const duplicatedProduct = {
            ...product,
            name: `${product.name} (Copie)`,
            sku: `${product.sku}-copy-${Date.now()}`,
            status: 'draft'
          }
          delete duplicatedProduct.id
          delete duplicatedProduct.created_at
          delete duplicatedProduct.updated_at
          
          const response = await apiService.createProduct(currentStore?.id!, duplicatedProduct)
          if (response.success && response.data) {
            const newProduct = {
              ...(response.data as any),
              id: (response.data as any).id || `temp-${Date.now()}`,
              name: `${product.name} (Copie)`,
              status: 'draft'
            }
            setProducts(prevProducts => [newProduct, ...prevProducts])
            toast.success("Produit dupliqué avec succès")
          } else {
            toast.error("Erreur lors de la duplication")
          }
        } catch (error) {
          console.error("Erreur lors de la duplication:", error)
          toast.error("Erreur lors de la duplication")
        }
        break
      case "archive":
        try {
          const response = await apiService.updateProduct(product.id, {
            status: 'archived'
          })
          if (response.success) {
            setProducts(prevProducts => 
              prevProducts.map(p => 
                p.id === product.id 
                  ? { ...p, status: 'archived' }
                  : p
              )
            )
            toast.success("Produit archivé avec succès")
          } else {
            toast.error("Erreur lors de l'archivage")
          }
        } catch (error) {
          console.error("Erreur lors de l'archivage:", error)
          toast.error("Erreur lors de l'archivage")
        }
        break
      case "delete":
        if (confirm(`Êtes-vous sûr de vouloir supprimer "${product.name}" ? Cette action est irréversible.`)) {
          try {
            const response = await apiService.deleteProduct(product.id)
            if (response.success) {
              setProducts(prevProducts => 
                prevProducts.filter(p => p.id !== product.id)
              )
              toast.success("Produit supprimé avec succès")
            } else {
              toast.error("Erreur lors de la suppression")
            }
          } catch (error) {
            console.error("Erreur lors de la suppression:", error)
            toast.error("Erreur lors de la suppression")
          }
        }
        break
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center space-x-4 p-4 animate-pulse">
            <div className="h-12 w-12 bg-gray-200 rounded"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
            <div className="h-4 bg-gray-200 rounded w-16"></div>
            <div className="h-4 bg-gray-200 rounded w-20"></div>
          </div>
        ))}
      </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
        <div className="text-destructive text-lg font-semibold mb-2">Erreur</div>
        <div className="text-muted-foreground">{error}</div>
        </CardContent>
      </Card>
    )
  }

  if (products.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
        <div className="text-muted-foreground text-lg mb-4">
          {activeTab === "tous" 
            ? "Aucun produit disponible"
            : `Aucun produit ${activeTab} trouvé`
          }
        </div>
        <div className="flex items-center justify-center space-x-4">
          <Button 
            onClick={handleRefresh}
            variant="outline"
            className="flex items-center space-x-2"
          >
            <RefreshCw className="h-4 w-4" />
            Actualiser
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            Ajouter votre premier produit
          </Button>
        </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      {/* Header avec filtres et actions */}
      <CardHeader className="pb-4">
        <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
          {/* Recherche et filtres */}
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Rechercher un produit..."
                className="pl-10"
                value={filters.searchTerm}
                onChange={(e) => {/* Gérer la recherche */}}
              />
            </div>
            
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              Filtres
              {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
          </div>

          {/* Actions en lot */}
          <div className="flex items-center gap-2">
            {selectedProducts.length > 0 && (
              <Badge variant="secondary" className="mr-2">
                {selectedProducts.length} sélectionné(s)
              </Badge>
            )}
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Exporter
            </Button>
            <Button variant="outline" size="sm">
              <Upload className="w-4 h-4 mr-2" />
              Importer
            </Button>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Ajouter
            </Button>
          </div>
        </div>

        {/* Filtres avancés */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
            <select className="border rounded-md px-3 py-2 text-sm">
              <option value="">Tous les statuts</option>
              <option value="active">Actif</option>
              <option value="draft">Brouillon</option>
              <option value="archived">Archivé</option>
            </select>
            
            <select className="border rounded-md px-3 py-2 text-sm">
              <option value="">Toutes les catégories</option>
              {Object.keys(categoryConfig).map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            
            <select className="border rounded-md px-3 py-2 text-sm">
              <option value="">Tous les stocks</option>
              <option value="in_stock">En stock</option>
              <option value="out_of_stock">Rupture de stock</option>
            </select>
          </div>
        )}
      </CardHeader>

      <CardContent className="p-0">
        <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
                <TableHead className="w-12">
                  <input
                    type="checkbox"
                    checked={selectedProducts.length === products.length && products.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300"
                  />
                </TableHead>
            <TableHead>Produit</TableHead>
            <TableHead>Catégorie</TableHead>
            <TableHead>Prix</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
                <TableRow key={product.id} className="hover:bg-gray-50">
                  <TableCell>
                    <input
                      type="checkbox"
                      checked={selectedProducts.includes(product.id)}
                      onChange={() => handleSelectProduct(product.id)}
                      className="rounded border-gray-300"
                    />
                  </TableCell>
              <TableCell>
                <div className="flex items-center space-x-3">
                  <ProductImage 
                    images={product.images} 
                    productName={product.name}
                        className="h-10 w-10 rounded-lg"
                  />
                  <div>
                        <div className="font-medium text-gray-900">{product.name}</div>
                        <div className="text-sm text-gray-500">
                      {stripHtml(product.description)?.substring(0, 50)}
                      {stripHtml(product.description)?.length > 50 && "..."}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                    {getCategoryBadge(product.category)}
              </TableCell>
              <TableCell>
                    <div className="font-medium text-gray-900">
                  {product.price ? `${product.price} FCFA` : "Non défini"}
                </div>
                {product.sale_price && product.sale_price !== product.price && (
                      <div className="text-sm text-gray-500 line-through">
                    {product.sale_price} FCFA
                  </div>
                )}
              </TableCell>
              <TableCell>
                    <div className="font-medium text-gray-900">
                  {product.stock_quantity || 0}
                </div>
                {product.stock_quantity <= (product.min_stock_level || 0) && (
                  <div className="text-sm text-red-600">
                    Stock faible
                  </div>
                )}
              </TableCell>
              <TableCell>
                {getStatusBadge(product.status)}
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleAction("view", product)}>
                      <Eye className="mr-2 h-4 w-4" />
                      Voir
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleAction("edit", product)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Modifier
                    </DropdownMenuItem>
                        <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleAction("duplicate", product)}>
                      <Copy className="mr-2 h-4 w-4" />
                      Dupliquer
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleAction("archive", product)}>
                      <Archive className="mr-2 h-4 w-4" />
                      Archiver
                    </DropdownMenuItem>
                        <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={() => handleAction("delete", product)}
                      className="text-red-600"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Supprimer
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
        </div>
      
      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between px-6 py-4 border-t">
          <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">
              Affichage de {((pagination.currentPage - 1) * pagination.perPage) + 1} à {Math.min(pagination.currentPage * pagination.perPage, pagination.total)} sur {pagination.total} produits
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage <= 1}
            >
              Précédent
            </Button>
            
            <div className="flex items-center space-x-1">
              {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                const page = i + 1
                return (
                  <Button
                    key={page}
                    variant={pagination.currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(page)}
                    className="w-8 h-8 p-0"
                  >
                    {page}
                  </Button>
                )
              })}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(pagination.currentPage + 1)}
              disabled={pagination.currentPage >= pagination.totalPages}
            >
              Suivant
            </Button>
          </div>
          
          <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">Par page:</span>
            <select
              value={pagination.perPage}
              onChange={(e) => handlePerPageChange(Number(e.target.value))}
              className="border rounded px-2 py-1 text-sm"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>
      )}
      </CardContent>
    </Card>
  )
}
