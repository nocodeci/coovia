"use client"
import { useState, useEffect } from "react"
import { MoreHorizontal, Edit, Trash2, Copy, Eye } from "lucide-react"
import { useProduct } from "@/hooks/useProduct"
import { useStore } from "@/context/store-context"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

type TabType = "tous" | "actifs" | "brouillons" | "archives"

interface FilterState {
  searchTerm: string
  category: string
}

interface ProductsTableProps {
  activeTab: TabType
  sortOrder: "asc" | "desc"
  filters: FilterState
  storeId?: string
}

export function ProductsTable({ activeTab, sortOrder, filters, storeId }: ProductsTableProps) {
  const { currentStore } = useStore()
  // Use the storeId prop if provided, otherwise fall back to currentStore?.id
  const effectiveStoreId = storeId || currentStore?.id || ""
  const { products, isLoading, deleteProduct, fetchProducts } = useProduct(effectiveStoreId)
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])
  const [selectAll, setSelectAll] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [productToDelete, setProductToDelete] = useState<string | null>(null)

  // Filtrer les produits selon l'onglet actif
  const tabFilteredProducts = products.filter((product) => {
    switch (activeTab) {
      case "actifs":
        return product.status === "active"
      case "brouillons":
        return product.status === "draft"
      case "archives":
        return product.status === "inactive"
      default:
        return true
    }
  })

  // Appliquer les filtres de recherche et catégorie
  const filteredProducts = tabFilteredProducts.filter((product) => {
    const matchesSearch =
      !filters.searchTerm ||
      product.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(filters.searchTerm.toLowerCase())

    const matchesCategory = !filters.category || product.category === filters.category

    return matchesSearch && matchesCategory
  })

  // Trier les produits
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const comparison = a.name.localeCompare(b.name)
    return sortOrder === "asc" ? comparison : -comparison
  })

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedProducts([])
    } else {
      setSelectedProducts(sortedProducts.map((p) => p.id))
    }
    setSelectAll(!selectAll)
  }

  const handleSelectProduct = (productId: string) => {
    if (selectedProducts.includes(productId)) {
      setSelectedProducts(selectedProducts.filter((id) => id !== productId))
    } else {
      setSelectedProducts([...selectedProducts, productId])
    }
  }

  const handleProductAction = async (action: string, productId: string) => {
    switch (action) {
      case "view":
        window.location.href = `/produits/${productId}`
        break
      case "edit":
        window.location.href = `/produits/edit/${productId}`
        break
      case "duplicate":
        // TODO: Implémenter la duplication
        console.log(`Dupliquer le produit ${productId}`)
        break
      case "delete":
        setProductToDelete(productId)
        setDeleteDialogOpen(true)
        break
      default:
        console.log(`Action non reconnue: ${action}`)
    }
  }

  const confirmDelete = async () => {
    if (productToDelete) {
      try {
        await deleteProduct(productToDelete)
        setDeleteDialogOpen(false)
        setProductToDelete(null)
      } catch (error) {
        console.error("Erreur lors de la suppression:", error)
      }
    }
  }

  const getBadgeClass = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "inactive":
        return "bg-gray-100 text-gray-800"
      case "draft":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "Actif"
      case "inactive":
        return "Inactif"
      case "draft":
        return "Brouillon"
      default:
        return status
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "XOF",
    }).format(price)
  }

  // Charger les produits au montage et quand le storeId change
  useEffect(() => {
    if (effectiveStoreId) {
      fetchProducts()
    }
  }, [effectiveStoreId, fetchProducts])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des produits...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left p-4">
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={handleSelectAll}
                  className="rounded border-gray-300"
                />
              </th>
              <th className="text-left p-4 font-medium">Produit</th>
              <th className="text-left p-4 font-medium">Prix</th>
              <th className="text-left p-4 font-medium">Stock</th>
              <th className="text-left p-4 font-medium">Statut</th>
              <th className="text-left p-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedProducts.map((product) => (
              <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="p-4">
                  <input
                    type="checkbox"
                    checked={selectedProducts.includes(product.id)}
                    onChange={() => handleSelectProduct(product.id)}
                    className="rounded border-gray-300"
                  />
                </td>
                <td className="p-4">
                  <div className="flex items-center space-x-3">
                    {product.images && product.images.length > 0 && (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-10 h-10 rounded object-cover"
                      />
                    )}
                    <div>
                      <div className="font-medium">{product.name}</div>
                      <div className="text-sm text-gray-500">{product.category}</div>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <div className="font-medium">{formatPrice(product.price)}</div>
                  {product.compare_price && (
                    <div className="text-sm text-gray-500 line-through">
                      {formatPrice(product.compare_price)}
                    </div>
                  )}
                </td>
                <td className="p-4">
                  <div className="text-sm">
                    {product.stock_quantity ?? product.inventory?.quantity ?? 0} en stock
                  </div>
                  {product.min_stock_level && (
                    <div className="text-xs text-gray-500">
                      Seuil: {product.min_stock_level}
                    </div>
                  )}
                </td>
                <td className="p-4">
                  <Badge className={getBadgeClass(product.status)}>
                    {getStatusText(product.status)}
                  </Badge>
                </td>
                <td className="p-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleProductAction("view", product.id)}>
                        <Eye className="h-4 w-4 mr-2" />
                        Voir
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleProductAction("edit", product.id)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Modifier
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleProductAction("duplicate", product.id)}>
                        <Copy className="h-4 w-4 mr-2" />
                        Dupliquer
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleProductAction("delete", product.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Supprimer
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action ne peut pas être annulée. Cela supprimera définitivement le produit.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
