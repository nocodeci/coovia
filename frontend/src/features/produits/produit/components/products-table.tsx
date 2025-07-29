"use client"
import { useState, useEffect } from "react"
import { MoreHorizontal, Edit, Trash2, Copy, Eye } from "lucide-react"
import { useProducts } from "@/hooks/useProduct"
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
}

export function ProductsTable({ activeTab, sortOrder, filters }: ProductsTableProps) {
  const { currentStore } = useStore()
  const { products, isLoading, deleteProduct, fetchProducts } = useProducts(currentStore?.id || "")
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
        return "bg-green-100 text-green-800 border-green-200"
      case "draft":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "inactive":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "Actif"
      case "draft":
        return "Brouillon"
      case "inactive":
        return "Archivé"
      default:
        return status
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "XOF",
      minimumFractionDigits: 0,
    })
      .format(price)
      .replace("XOF", "FCFA")
  }

  useEffect(() => {
    if (currentStore?.id) {
      fetchProducts({
        search: filters.searchTerm,
        category: filters.category,
        status:
          activeTab === "tous"
            ? undefined
            : activeTab === "actifs"
              ? "active"
              : activeTab === "brouillons"
                ? "draft"
                : "inactive",
      })
    }
  }, [currentStore?.id, filters, activeTab, fetchProducts])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement des produits...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      {/* Affichage du nombre de résultats */}
      <div className="px-4 py-2 text-sm text-gray-600 border-b">
        {sortedProducts.length} produit{sortedProducts.length > 1 ? "s" : ""} trouvé
        {sortedProducts.length > 1 ? "s" : ""}
        {(filters.searchTerm || filters.category) && <span> avec les filtres appliqués</span>}
      </div>

      <table className="polaris-table">
        <thead>
          <tr>
            <th style={{ width: "3rem" }}>
              <input
                type="checkbox"
                checked={selectAll}
                onChange={handleSelectAll}
                style={{
                  accentColor: "var(--p-color-bg-fill-highlight)",
                  width: "1rem",
                  height: "1rem",
                }}
              />
            </th>
            <th style={{ width: "4rem" }}></th>
            <th>Produit</th>
            <th>Statut</th>
            <th>Prix</th>
            <th>Stock</th>
            <th>Catégorie</th>
            <th style={{ textAlign: "right", paddingRight: "var(--p-space-400)" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedProducts.map((product) => (
            <tr key={product.id} className="hover:bg-gray-50">
              <td>
                <input
                  type="checkbox"
                  checked={selectedProducts.includes(product.id)}
                  onChange={() => handleSelectProduct(product.id)}
                  style={{
                    accentColor: "var(--p-color-bg-fill-highlight)",
                    width: "1rem",
                    height: "1rem",
                  }}
                />
              </td>
              <td>
                <img
                  src={product.images[0] || "/placeholder.svg?height=40&width=40"}
                  alt={product.name}
                  style={{
                    width: "2.5rem",
                    height: "2.5rem",
                    borderRadius: "var(--p-border-radius-200)",
                    objectFit: "cover",
                  }}
                />
              </td>
              <td>
                <div>
                  <a
                    href={`/produits/${product.id}`}
                    className="polaris-text-link hover:underline"
                    style={{ fontWeight: "var(--p-font-weight-medium)" }}
                  >
                    {product.name}
                  </a>
                  {product.sku && <div className="text-xs text-gray-500 mt-1">SKU: {product.sku}</div>}
                </div>
              </td>
              <td>
                <Badge className={getBadgeClass(product.status)}>{getStatusText(product.status)}</Badge>
              </td>
              <td>
                <div>
                  {product.sale_price && product.sale_price < product.price ? (
                    <div>
                      <span className="font-medium text-green-600">{formatPrice(product.sale_price)}</span>
                      <div className="text-xs text-gray-500 line-through">{formatPrice(product.price)}</div>
                    </div>
                  ) : (
                    <span className="font-medium">{product.price > 0 ? formatPrice(product.price) : "Gratuit"}</span>
                  )}
                </div>
              </td>
              <td>
                <span
                  className={product.stock_quantity <= (product.min_stock_level || 0) ? "text-red-600 font-medium" : ""}
                >
                  {product.stock_quantity} en stock
                </span>
                {product.stock_quantity <= (product.min_stock_level || 0) && (
                  <div className="text-xs text-red-500">Stock faible</div>
                )}
              </td>
              <td style={{ color: "var(--p-color-text)" }}>{product.category}</td>
              <td className="relative" style={{ textAlign: "right", paddingRight: "var(--p-space-400)" }}>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleProductAction("view", product.id)}>
                      <Eye className="mr-2 h-4 w-4" />
                      Voir
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleProductAction("edit", product.id)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Modifier
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleProductAction("duplicate", product.id)}>
                      <Copy className="mr-2 h-4 w-4" />
                      Dupliquer
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleProductAction("delete", product.id)}
                      className="text-red-600"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Supprimer
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {sortedProducts.length === 0 && (
        <div className="text-center py-8">
          <p style={{ color: "var(--p-color-text-secondary)" }}>
            {filters.searchTerm || filters.category
              ? "Aucun produit ne correspond aux critères de recherche."
              : "Aucun produit trouvé pour cette catégorie."}
          </p>
          {(filters.searchTerm || filters.category) && (
            <button className="mt-2 polaris-text-link" onClick={() => window.location.reload()}>
              Effacer tous les filtres
            </button>
          )}
        </div>
      )}

      {selectedProducts.length > 0 && (
        <div className="p-4 bg-blue-50 border-t flex items-center justify-between">
          <span>{selectedProducts.length} produit(s) sélectionné(s)</span>
          <div className="flex gap-2">
            <button className="polaris-button-secondary">Modifier en lot</button>
            <button className="polaris-button-secondary text-red-600">Supprimer</button>
          </div>
        </div>
      )}

      {/* Dialog de confirmation de suppression */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer ce produit ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action ne peut pas être annulée. Le produit sera définitivement supprimé de votre magasin.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
