"use client"

import { useState, useEffect } from "react"
import { 
  MoreHorizontal, 
  Edit, 
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
  Package,
  Truck,
  CheckSquare,
  XCircle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
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
import { toast } from "sonner"

// Configuration des statuts de commande
const orderStatusObj = {
  'pending': { title: 'En attente', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
  'processing': { title: 'En traitement', color: 'bg-blue-100 text-blue-800', icon: Package },
  'shipped': { title: 'Expédiée', color: 'bg-purple-100 text-purple-800', icon: Truck },
  'delivered': { title: 'Livrée', color: 'bg-green-100 text-green-800', icon: CheckSquare },
  'cancelled': { title: 'Annulée', color: 'bg-red-100 text-red-800', icon: XCircle },
}

// Configuration des méthodes de paiement
const paymentMethodObj = {
  'card': { title: 'Carte bancaire', color: 'bg-blue-100 text-blue-600' },
  'cash': { title: 'Espèces', color: 'bg-green-100 text-green-600' },
  'mobile_money': { title: 'Mobile Money', color: 'bg-orange-100 text-orange-600' },
  'bank_transfer': { title: 'Virement bancaire', color: 'bg-purple-100 text-purple-600' },
}

interface OrderListTableProps {
  orderData?: any[]
}

export function OrderListTable({ orderData }: OrderListTableProps) {
  const { currentStore } = useStore()
  const [data, setData] = useState<any[]>(orderData || [])
  const [filteredData, setFilteredData] = useState<any[]>(data)
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({})
  const [globalFilter, setGlobalFilter] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    status: '',
    paymentMethod: '',
    dateRange: ''
  })

  // Mettre à jour les données quand orderData change
  useEffect(() => {
    if (orderData) {
      setData(orderData)
      setFilteredData(orderData)
    }
  }, [orderData])

  // Filtrer les données
  useEffect(() => {
    let filtered = [...data]

    // Filtre global
    if (globalFilter) {
      filtered = filtered.filter(order =>
        order.order_number?.toLowerCase().includes(globalFilter.toLowerCase()) ||
        order.customer_name?.toLowerCase().includes(globalFilter.toLowerCase()) ||
        order.customer_email?.toLowerCase().includes(globalFilter.toLowerCase())
      )
    }

    // Filtres spécifiques
    if (filters.status) {
      filtered = filtered.filter(order => order.status === filters.status)
    }

    if (filters.paymentMethod) {
      filtered = filtered.filter(order => order.payment_method === filters.paymentMethod)
    }

    setFilteredData(filtered)
  }, [data, globalFilter, filters])

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const newSelection: Record<string, boolean> = {}
      filteredData.forEach(order => {
        newSelection[order.id] = true
      })
      setRowSelection(newSelection)
    } else {
      setRowSelection({})
    }
  }

  const handleSelectRow = (orderId: string, checked: boolean) => {
    setRowSelection(prev => ({
      ...prev,
      [orderId]: checked
    }))
  }

  const handleAction = async (action: string, order: any) => {
    console.log(`${action} pour la commande:`, order.order_number)
    
    switch (action) {
      case "view":
        window.location.href = `/${currentStore?.id}/commandes/${order.id}`
        break
      case "edit":
        window.location.href = `/${currentStore?.id}/commandes/${order.id}/edit`
        break
      case "duplicate":
        toast.info("Fonctionnalité de duplication en cours de développement")
        break
      case "archive":
        try {
          const response = await apiService.updateOrder(order.id, {
            status: 'archived'
          })
          if (response.success) {
            setData(prev => 
              prev.map(o => 
                o.id === order.id 
                  ? { ...o, status: 'archived' }
                  : o
              )
            )
            toast.success("Commande archivée avec succès")
          } else {
            toast.error("Erreur lors de l'archivage")
          }
        } catch (error) {
          console.error("Erreur lors de l'archivage:", error)
          toast.error("Erreur lors de l'archivage")
        }
        break
    }
  }

  const getStatusBadge = (status: string) => {
    const config = orderStatusObj[status as keyof typeof orderStatusObj] || {
      title: 'Inconnu',
      color: 'bg-gray-100 text-gray-800',
      icon: Clock
    }
    const Icon = config.icon
    
    return (
      <Badge className={config.color}>
        <Icon className="w-3 h-3 mr-1" />
        {config.title}
      </Badge>
    )
  }

  const getPaymentMethodBadge = (method: string) => {
    const config = paymentMethodObj[method as keyof typeof paymentMethodObj] || {
      title: 'Inconnu',
      color: 'bg-gray-100 text-gray-600'
    }
    
    return (
      <Badge className={config.color}>
        {config.title}
      </Badge>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
    }).format(price)
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
                placeholder="Rechercher une commande..."
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
              Nouvelle commande
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
              <option value="pending">En attente</option>
              <option value="processing">En traitement</option>
              <option value="shipped">Expédiée</option>
              <option value="delivered">Livrée</option>
              <option value="cancelled">Annulée</option>
            </select>
            
            <select 
              className="border rounded-md px-3 py-2 text-sm"
              value={filters.paymentMethod}
              onChange={(e) => setFilters(prev => ({ ...prev, paymentMethod: e.target.value }))}
            >
              <option value="">Toutes les méthodes de paiement</option>
              <option value="card">Carte bancaire</option>
              <option value="cash">Espèces</option>
              <option value="mobile_money">Mobile Money</option>
              <option value="bank_transfer">Virement bancaire</option>
            </select>
            
            <select 
              className="border rounded-md px-3 py-2 text-sm"
              value={filters.dateRange}
              onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value }))}
            >
              <option value="">Toutes les dates</option>
              <option value="today">Aujourd'hui</option>
              <option value="week">Cette semaine</option>
              <option value="month">Ce mois</option>
              <option value="year">Cette année</option>
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
                <TableHead>Commande</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Paiement</TableHead>
                <TableHead>Montant</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    <div className="text-gray-500">
                      {globalFilter || Object.values(filters).some(f => f) 
                        ? "Aucune commande ne correspond aux critères de recherche"
                        : "Aucune commande disponible"
                      }
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((order) => (
                  <TableRow key={order.id} className="hover:bg-gray-50">
                    <TableCell>
                      <Checkbox
                        checked={rowSelection[order.id] || false}
                        onCheckedChange={(checked) => handleSelectRow(order.id, checked as boolean)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-900">#{order.order_number}</span>
                        <span className="text-sm text-gray-500">{order.items_count || 0} article(s)</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-900">{order.customer_name}</span>
                        <span className="text-sm text-gray-500">{order.customer_email}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(order.status)}
                    </TableCell>
                    <TableCell>
                      {getPaymentMethodBadge(order.payment_method)}
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">
                        {formatPrice(order.total_amount)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-600">
                        {formatDate(order.created_at)}
                      </span>
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
                            <DropdownMenuItem onClick={() => handleAction("view", order)}>
                              <Eye className="mr-2 h-4 w-4" />
                              Voir
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleAction("edit", order)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Modifier
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleAction("duplicate", order)}>
                              <Copy className="mr-2 h-4 w-4" />
                              Dupliquer
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleAction("archive", order)}>
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