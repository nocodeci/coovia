"use client"

import { useState, useEffect, useMemo } from "react"
import { 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Eye, 
  Copy, 
  Archive, 
  Download,
  Upload,
  Plus,
  Search,
  Filter,
  ChevronUp,
  ChevronDown,
  CheckCircle,
  Clock,
  AlertCircle,
  Headphones,
  Home,
  Laptop,
  Footprints,
  Briefcase,
  Gamepad2,
  EyeOff
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
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
import { useStore } from "@/context/store-context"
import apiService from "@/lib/api"
import { ProductImage } from "./product-image"
import { toast } from "sonner"

// Configuration des catégories avec icônes et couleurs
const productCategoryObj = {
  'Accessories': { icon: Headphones, color: 'bg-red-100 text-red-600' },
  'Home Decor': { icon: Home, color: 'bg-blue-100 text-blue-600' },
  'Electronics': { icon: Laptop, color: 'bg-green-100 text-green-600' },
  'Shoes': { icon: Footprints, color: 'bg-purple-100 text-purple-600' },
  'Office': { icon: Briefcase, color: 'bg-orange-100 text-orange-600' },
  'Games': { icon: Gamepad2, color: 'bg-pink-100 text-pink-600' },
}

// Configuration des statuts
const productStatusObj = {
  'Scheduled': { title: 'Programmé', color: 'bg-yellow-100 text-yellow-800' },
  'Published': { title: 'Publié', color: 'bg-green-100 text-green-800' },
  'Inactive': { title: 'Inactif', color: 'bg-red-100 text-red-800' },
  'active': { title: 'Actif', color: 'bg-green-100 text-green-800' },
  'draft': { title: 'Brouillon', color: 'bg-yellow-100 text-yellow-800' },
  'archived': { title: 'Archivé', color: 'bg-gray-100 text-gray-800' },
}

interface ProductListTableProps {
  productData?: any[]
}

export function ProductListTable({ productData }: ProductListTableProps) {
  const { currentStore } = useStore()
  const [data, setData] = useState<any[]>(productData || [])
  const [filteredData, setFilteredData] = useState<any[]>(data)
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({})
  const [globalFilter, setGlobalFilter] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [stockStates, setStockStates] = useState<Record<string, boolean>>({})
  const [filters, setFilters] = useState({
    status: '',
    category: '',
    stock: ''
  })

  // Mettre à jour les données quand productData change
  useEffect(() => {
    if (productData) {
      setData(productData)
      setFilteredData(productData)
    }
  }, [productData])

  // Filtrer les données
  useEffect(() => {
    let filtered = [...data]

    // Filtre global
    if (globalFilter) {
      filtered = filtered.filter(product =>
        product.name?.toLowerCase().includes(globalFilter.toLowerCase()) ||
        product.description?.toLowerCase().includes(globalFilter.toLowerCase()) ||
        product.category?.toLowerCase().includes(globalFilter.toLowerCase())
      )
    }

    // Filtres spécifiques
    if (filters.status) {
      filtered = filtered.filter(product => product.status === filters.status)
    }

    if (filters.category) {
      filtered = filtered.filter(product => product.category === filters.category)
    }

    if (filters.stock) {
      if (filters.stock === 'in_stock') {
        filtered = filtered.filter(product => (product.stock_quantity || 0) > 0)
      } else if (filters.stock === 'out_of_stock') {
        filtered = filtered.filter(product => (product.stock_quantity || 0) <= 0)
      }
    }

    setFilteredData(filtered)
  }, [data, globalFilter, filters])

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const newSelection: Record<string, boolean> = {}
      filteredData.forEach(product => {
        newSelection[product.id] = true
      })
      setRowSelection(newSelection)
    } else {
      setRowSelection({})
    }
  }

  const handleSelectRow = (productId: string, checked: boolean) => {
    setRowSelection(prev => ({
      ...prev,
      [productId]: checked
    }))
  }

  const handleStockToggle = async (productId: string, checked: boolean) => {
    try {
      // Mettre à jour l'état local immédiatement pour une réponse UI rapide
      setStockStates(prev => ({
        ...prev,
        [productId]: checked
      }))

      // Appeler l'API pour mettre à jour le stock
      const response = await apiService.updateProduct(productId, {
        stock_quantity: checked ? 1 : 0
      })

      if (response.success) {
        // Mettre à jour les données locales
        setData(prev => 
          prev.map(product => 
            product.id === productId 
              ? { ...product, stock_quantity: checked ? 1 : 0 }
              : product
          )
        )
        toast.success(checked ? "Produit mis en stock" : "Produit retiré du stock")
      } else {
        // Revenir à l'état précédent si l'API échoue
        setStockStates(prev => ({
          ...prev,
          [productId]: !checked
        }))
        toast.error("Erreur lors de la mise à jour du stock")
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour du stock:", error)
      // Revenir à l'état précédent
      setStockStates(prev => ({
        ...prev,
        [productId]: !checked
      }))
      toast.error("Erreur lors de la mise à jour du stock")
    }
  }

  const handleAction = async (action: string, product: any) => {
    console.log(`${action} pour le produit:`, product.name)
    
    switch (action) {
      case "view":
        window.location.href = `/${currentStore?.id}/produits/${product.id}`
        break
      case "edit":
        window.location.href = `/${currentStore?.id}/produits/${product.id}/edit`
        break
      case "duplicate":
        try {
          const duplicatedProduct = {
            ...product,
            name: `${product.name} (Copie)`,
            sku: `${product.sku || 'SKU'}-copy-${Date.now()}`,
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
            setData(prev => [newProduct, ...prev])
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
            setData(prev => 
              prev.map(p => 
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
              setData(prev => 
                prev.filter(p => p.id !== product.id)
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

  const getCategoryBadge = (category: string) => {
    const config = productCategoryObj[category as keyof typeof productCategoryObj] || {
      icon: Home,
      color: 'bg-gray-100 text-gray-600'
    }
    const Icon = config.icon
    
    return (
      <div className="flex items-center gap-2">
        <div className={`p-2 rounded-lg ${config.color}`}>
          <Icon className="w-4 h-4" />
        </div>
        <span className="text-sm font-medium">{category || "Non catégorisé"}</span>
      </div>
    )
  }

  const getStatusBadge = (status: string) => {
    const config = productStatusObj[status as keyof typeof productStatusObj] || {
      title: 'Inconnu',
      color: 'bg-gray-100 text-gray-800'
    }
    
    return (
      <Badge className={config.color}>
        {config.title}
      </Badge>
    )
  }

  const stripHtml = (html: string) => {
    if (!html) return ''
    const tempDiv = document.createElement('div')
    tempDiv.innerHTML = html
    return tempDiv.textContent || tempDiv.innerText || ''
  }

  const selectedCount = Object.keys(rowSelection).filter(key => rowSelection[key]).length
  const allSelected = filteredData.length > 0 && selectedCount === filteredData.length
  const someSelected = selectedCount > 0 && selectedCount < filteredData.length

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
                value={globalFilter}
                onChange={(e) => setGlobalFilter(e.target.value)}
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
            {selectedCount > 0 && (
              <Badge variant="secondary" className="mr-2">
                {selectedCount} sélectionné(s)
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
            <select 
              className="border rounded-md px-3 py-2 text-sm"
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
            >
              <option value="">Tous les statuts</option>
              <option value="active">Actif</option>
              <option value="draft">Brouillon</option>
              <option value="archived">Archivé</option>
            </select>
            
            <select 
              className="border rounded-md px-3 py-2 text-sm"
              value={filters.category}
              onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
            >
              <option value="">Toutes les catégories</option>
              {Object.keys(productCategoryObj).map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            
            <select 
              className="border rounded-md px-3 py-2 text-sm"
              value={filters.stock}
              onChange={(e) => setFilters(prev => ({ ...prev, stock: e.target.value }))}
            >
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
                  <Checkbox
                    checked={allSelected}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead>Produit</TableHead>
                <TableHead>Catégorie</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Prix</TableHead>
                <TableHead>Quantité</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    <div className="text-gray-500">
                      {globalFilter || Object.values(filters).some(f => f) 
                        ? "Aucun produit ne correspond aux critères de recherche"
                        : "Aucun produit disponible"
                      }
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((product) => (
                  <TableRow key={product.id} className="hover:bg-gray-50">
                    <TableCell>
                      <Checkbox
                        checked={rowSelection[product.id] || false}
                        onCheckedChange={(checked) => handleSelectRow(product.id, checked as boolean)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-4">
                        <ProductImage 
                          images={product.images} 
                          productName={product.name}
                          className="h-10 w-10 rounded-lg"
                        />
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-900">{product.name}</span>
                          <span className="text-sm text-gray-500">{product.brand || 'Marque'}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getCategoryBadge(product.category)}
                    </TableCell>
                    <TableCell>
                      <Switch 
                        checked={stockStates[product.id] ?? (product.stock_quantity || 0) > 0}
                        onCheckedChange={(checked) => handleStockToggle(product.id, checked)}
                      />
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">
                        {product.price ? `${product.price} FCFA` : "Non défini"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">{product.stock_quantity || 0}</span>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(product.status)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
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
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
} 