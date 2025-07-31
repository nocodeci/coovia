"use client"

import { useState, useEffect } from "react"
import { MoreHorizontal, Edit, Trash2, Eye, Copy, Archive, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
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
import { useStore } from "@/context/store-context"
import apiService from "@/lib/api"
import { ProductImage } from "./product-image"
import { ProductImageDebug } from "./product-image-debug"

type TabType = "tous" | "actifs" | "brouillons" | "archives"

interface FilterState {
  searchTerm: string
  category: string
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

export function ProductsTable({ activeTab, sortOrder, filters }: ProductsTableProps) {
  const { currentStore } = useStore()
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState<PaginationState>({
    currentPage: 1,
    perPage: 20,
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
        
        // Charger les produits avec pagination
        const response = await apiService.getStoreProducts(
          currentStore.id, 
          pagination.currentPage, 
          pagination.perPage
        )
        
        if (response.success && response.data) {
          let filteredProducts = response.data.data || response.data // Support des deux formats
          
          // Debug: Afficher les données des produits (une seule fois)
          if (filteredProducts.length > 0) {
            console.log('=== DEBUG PRODUITS ===')
            console.log('Nombre de produits:', filteredProducts.length)
            console.log('Premier produit:', {
              id: filteredProducts[0].id,
              name: filteredProducts[0].name,
              images: filteredProducts[0].images,
              imagesLength: filteredProducts[0].images?.length || 0,
              hasImages: !!filteredProducts[0].images && filteredProducts[0].images.length > 0
            })
            console.log('=====================')
          }

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
              product.description?.toLowerCase().includes(filters.searchTerm.toLowerCase())
            )
          }

          // Filtrer par catégorie
          if (filters.category) {
            filteredProducts = filteredProducts.filter((product: any) =>
              product.category === filters.category
            )
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
          
          // Mettre à jour la pagination si disponible
          if (response.data.pagination) {
            setPagination(prev => ({
              ...prev,
              total: response.data.pagination.total,
              totalPages: response.data.pagination.last_page,
              currentPage: response.data.pagination.current_page
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
  }, [currentStore?.id, activeTab, filters.searchTerm, filters.category, sortOrder, pagination.currentPage, pagination.perPage])

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { label: "Actif", variant: "default", color: "bg-green-100 text-green-800" },
      draft: { label: "Brouillon", variant: "secondary", color: "bg-yellow-100 text-yellow-800" },
      archived: { label: "Archivé", variant: "outline", color: "bg-gray-100 text-gray-800" },
    }
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft
    return (
      <Badge className={config.color}>
        {config.label}
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
      currentPage: 1 // Retour à la première page
    }))
  }

  const handleRefresh = () => {
    // Forcer le rechargement en invalidant le cache
    setPagination(prev => ({
      ...prev,
      currentPage: 1
    }))
  }

  const handleAction = (action: string, product: any) => {
    console.log(`${action} pour le produit:`, product.name)
    
    switch (action) {
      case "view":
        // Naviguer vers la page de détail
        break
      case "edit":
        // Naviguer vers la page d'édition
        break
      case "duplicate":
        // Dupliquer le produit
        break
      case "archive":
        // Archiver le produit
        break
      case "delete":
        // Supprimer le produit
        if (confirm(`Êtes-vous sûr de vouloir supprimer "${product.name}" ?`)) {
          console.log("Suppression du produit:", product.id)
        }
        break
    }
  }

  if (loading) {
    return (
      <div className="space-y-3">
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
    )
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <div className="text-destructive text-lg font-semibold mb-2">Erreur</div>
        <div className="text-muted-foreground">{error}</div>
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="text-center p-8">
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
      </div>
    )
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
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
            <TableRow key={product.id}>
              <TableCell>
                <div className="flex items-center space-x-3">
                  <ProductImageDebug 
                    images={product.images} 
                    productName={product.name}
                    className="h-10 w-10"
                  />
                  <div>
                    <div className="font-medium">{product.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {product.description?.substring(0, 50)}
                      {product.description?.length > 50 && "..."}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline">
                  {product.category || "Non catégorisé"}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="font-medium">
                  {product.price ? `${product.price} FCFA` : "Non défini"}
                </div>
                {product.sale_price && product.sale_price !== product.price && (
                  <div className="text-sm text-muted-foreground line-through">
                    {product.sale_price} FCFA
                  </div>
                )}
              </TableCell>
              <TableCell>
                <div className="font-medium">
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
                    <DropdownMenuItem onClick={() => handleAction("duplicate", product)}>
                      <Copy className="mr-2 h-4 w-4" />
                      Dupliquer
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleAction("archive", product)}>
                      <Archive className="mr-2 h-4 w-4" />
                      Archiver
                    </DropdownMenuItem>
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
      
      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between px-6 py-4 border-t">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">
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
            <span className="text-sm text-muted-foreground">Par page:</span>
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
    </div>
  )
}
