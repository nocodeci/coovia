"use client"
import { useState } from "react"
import { MoreHorizontal, Edit, Trash2, Copy } from "lucide-react"

type TabType = "tous" | "actifs" | "brouillons" | "archives"

interface Product {
  id: string
  name: string
  image: string
  status: "Actif" | "Brouillon" | "Archivé"
  inventory: string
  category: string
  channels: number
}

interface FilterState {
  searchTerm: string
  category: string
}

const allProducts: Product[] = [
  {
    id: "1",
    name: "T-shirt Premium",
    image: "/placeholder.svg?height=40&width=40",
    status: "Actif",
    inventory: "25 en stock",
    category: "Vêtements",
    channels: 3,
  },
  {
    id: "2",
    name: "Œuvre d'art numérique",
    image: "/placeholder.svg?height=40&width=40",
    status: "Actif",
    inventory: "Illimité",
    category: "Œuvre d'art numérique",
    channels: 2,
  },
  {
    id: "3",
    name: "Produit en développement",
    image: "/placeholder.svg?height=40&width=40",
    status: "Brouillon",
    inventory: "0 en stock",
    category: "Accessoires",
    channels: 0,
  },
  {
    id: "4",
    name: "Ancien produit",
    image: "/placeholder.svg?height=40&width=40",
    status: "Archivé",
    inventory: "0 en stock",
    category: "Vêtements",
    channels: 0,
  },
  {
    id: "5",
    name: "Casquette Sport",
    image: "/placeholder.svg?height=40&width=40",
    status: "Actif",
    inventory: "15 en stock",
    category: "Accessoires",
    channels: 2,
  },
  {
    id: "6",
    name: "Poster Digital",
    image: "/placeholder.svg?height=40&width=40",
    status: "Actif",
    inventory: "Illimité",
    category: "Œuvre d'art numérique",
    channels: 1,
  },
]

interface ProductsTableProps {
  activeTab: TabType
  sortOrder: "asc" | "desc"
  filters: FilterState
}

export function ProductsTable({ activeTab, sortOrder, filters }: ProductsTableProps) {
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])
  const [selectAll, setSelectAll] = useState(false)
  const [showDropdown, setShowDropdown] = useState<string | null>(null)

  // Filtrer les produits selon l'onglet actif
  const tabFilteredProducts = allProducts.filter((product) => {
    switch (activeTab) {
      case "actifs":
        return product.status === "Actif"
      case "brouillons":
        return product.status === "Brouillon"
      case "archives":
        return product.status === "Archivé"
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

  const handleProductAction = (action: string, productId: string) => {
    console.log(`Action: ${action} sur le produit ${productId}`)
    setShowDropdown(null)

    switch (action) {
      case "edit":
        // Rediriger vers la page d'édition
        window.location.href = `/produits/edit/${productId}`
        break
      case "duplicate":
        alert(`Produit ${productId} dupliqué`)
        break
      case "delete":
        if (confirm("Êtes-vous sûr de vouloir supprimer ce produit ?")) {
          alert(`Produit ${productId} supprimé`)
        }
        break
    }
  }

  const getBadgeClass = (status: string) => {
    switch (status) {
      case "Actif":
        return "polaris-badge-success"
      case "Brouillon":
        return "polaris-badge-warning"
      case "Archivé":
        return "polaris-badge-neutral"
      default:
        return "polaris-badge-success"
    }
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
            <th>Inventaire</th>
            <th>Catégorie</th>
            <th style={{ textAlign: "right", paddingRight: "var(--p-space-400)" }}>Canaux</th>
            <th style={{ width: "3rem" }}></th>
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
                  src={product.image || "/placeholder.svg"}
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
                <a
                  href={`/produits/${product.id}`}
                  className="polaris-text-link hover:underline"
                  style={{ fontWeight: "var(--p-font-weight-medium)" }}
                >
                  {product.name}
                </a>
              </td>
              <td>
                <span className={getBadgeClass(product.status)}>{product.status}</span>
              </td>
              <td>
                <span className={product.inventory.includes("0 en stock") ? "polaris-text-critical" : ""}>
                  {product.inventory}
                </span>
              </td>
              <td style={{ color: "var(--p-color-text)" }}>{product.category}</td>
              <td style={{ textAlign: "right", paddingRight: "var(--p-space-400)" }}>
                <span className="text-sm font-medium">{product.channels}</span>
              </td>
              <td className="relative">
                <button
                  className="polaris-button-secondary flex items-center justify-center hover:bg-gray-100"
                  onClick={() => setShowDropdown(showDropdown === product.id ? null : product.id)}
                  style={{
                    width: "2rem",
                    height: "2rem",
                    padding: "0",
                    backgroundColor: "var(--p-color-bg-fill-transparent)",
                  }}
                >
                  <MoreHorizontal className="h-4 w-4" style={{ color: "var(--p-color-icon)" }} />
                </button>

                {showDropdown === product.id && (
                  <div
                    className="absolute right-0 top-8 bg-white border rounded-lg shadow-lg z-10 min-w-48"
                    style={{
                      backgroundColor: "var(--p-color-bg-surface)",
                      border: "var(--p-border-width-025) solid var(--p-color-border)",
                      borderRadius: "var(--p-border-radius-300)",
                      boxShadow: "var(--p-shadow-200)",
                    }}
                  >
                    <button
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2"
                      onClick={() => handleProductAction("edit", product.id)}
                    >
                      <Edit className="h-4 w-4" />
                      Modifier
                    </button>
                    <button
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2"
                      onClick={() => handleProductAction("duplicate", product.id)}
                    >
                      <Copy className="h-4 w-4" />
                      Dupliquer
                    </button>
                    <button
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2 text-red-600"
                      onClick={() => handleProductAction("delete", product.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                      Supprimer
                    </button>
                  </div>
                )}
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
    </div>
  )
}
