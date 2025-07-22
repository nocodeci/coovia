"use client"

import { useState, useMemo } from "react"
import {
  Users,
  Download,
  Mail,
  Phone,
  MapPin,
  Calendar,
  TrendingUp,
  Eye,
  Edit,
  Trash2,
  Plus,
  MoreHorizontal,
  UserPlus,
  Gift,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { mockClients, type Client } from "@/data/mock-clients"
import { ClientsTopBar } from "./components/client-top-bar"

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ")
}

// Composant de statistiques simplifiée
function ClientStats({ clients }: { clients: Client[] }) {
  const stats = useMemo(() => {
    const totalClients = clients.length
    const activeClients = clients.filter((c) => c.status === "active").length
    const totalRevenue = clients.reduce((sum, client) => sum + client.totalSpent, 0)
    const avgOrderValue = totalRevenue / clients.reduce((sum, client) => sum + client.totalOrders, 0) || 0

    return {
      totalClients,
      activeClients,
      totalRevenue,
      avgOrderValue,
      newThisMonth: clients.filter((c) => {
        const joinDate = new Date(c.joinDate)
        const now = new Date()
        return joinDate.getMonth() === now.getMonth() && joinDate.getFullYear() === now.getFullYear()
      }).length,
    }
  }, [clients])

  const summary = [
    {
      name: "Total Clients",
      value: stats.totalClients.toString(),
      change: "+23",
      percentageChange: "+4.9%",
      changeType: "positive",
      icon: Users,
      bgColor: "bg-emerald-50",
      iconColor: "text-emerald-600",
    },
    {
      name: "Clients Actifs",
      value: stats.activeClients.toString(),
      change: "+18",
      percentageChange: "+4.8%",
      changeType: "positive",
      icon: TrendingUp,
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
    },
    {
      name: "Nouveaux ce mois",
      value: stats.newThisMonth.toString(),
      change: "+0",
      percentageChange: "0%",
      changeType: "neutral",
      icon: UserPlus,
      bgColor: "bg-orange-50",
      iconColor: "text-orange-600",
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-8" >
      {summary.map((item) => {
        const IconComponent = item.icon
        return (
          <Card key={item.name} className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
            <CardContent className="p-0">
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-sm font-medium text-gray-600">{item.name}</div>
                  <div className={cn("p-2 rounded-lg", item.bgColor)}>
                    <IconComponent className={cn("h-4 w-4", item.iconColor)} />
                  </div>
                </div>
                <div className="flex items-baseline justify-between mb-3">
                  <div className="text-2xl font-bold text-gray-900">{item.value}</div>
                  <div className="flex items-center space-x-1 text-sm">
                    <span className="font-medium text-gray-900">{item.change}</span>
                    <span
                      className={classNames(
                        item.changeType === "positive"
                          ? "text-emerald-700"
                          : item.changeType === "negative"
                            ? "text-red-700"
                            : "text-gray-500",
                      )}
                    >
                      ({item.percentageChange})
                    </span>
                  </div>
                </div>
                {/* Mini graphique simulé avec des barres */}
                <div className="flex items-end space-x-1 h-8">
                  {Array.from({ length: 12 }, (_, i) => {
                    const height = Math.random() * 100 + 20
                    return (
                      <div
                        key={i}
                        className={cn(
                          "flex-1 rounded-sm",
                          item.changeType === "positive"
                            ? "bg-emerald-200"
                            : item.changeType === "negative"
                              ? "bg-red-200"
                              : "bg-gray-200",
                        )}
                        style={{ height: `${height}%` }}
                      />
                    )
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

// Composant de détails client amélioré
function ClientDetailsSheet({ client }: { client: Client }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="text-[#032313] hover:bg-[#032313]/10">
          <Eye className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[500px] sm:w-[600px] overflow-y-auto">
        <div className="space-y-6">
          {/* Header du client */}
          <div className="flex items-start space-x-4 pb-4 border-b">
            <Avatar className="h-16 w-16 ring-2 ring-gray-100">
              <AvatarImage src={client.avatar || "/placeholder.svg"} />
              <AvatarFallback className="bg-[#032313] text-white text-lg">
                {client.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-semibold text-gray-900 truncate">{client.name}</h2>
              <p className="text-sm text-gray-500 truncate">{client.email}</p>
              <div className="flex items-center space-x-2 mt-2">
                <Badge
                  variant="outline"
                  className={cn(
                    "text-xs",
                    client.segment === "VIP" && "border-purple-200 bg-purple-50 text-purple-700",
                    client.segment === "Premium" && "border-blue-200 bg-blue-50 text-blue-700",
                    client.segment === "Standard" && "border-green-200 bg-green-50 text-green-700",
                    client.segment === "Nouveau" && "border-orange-200 bg-orange-50 text-orange-700",
                  )}
                >
                  {client.segment}
                </Badge>
                <Badge
                  variant="outline"
                  className={cn(
                    "text-xs",
                    client.status === "active" && "border-green-200 bg-green-50 text-green-700",
                    client.status === "inactive" && "border-gray-200 bg-gray-50 text-gray-700",
                    client.status === "blocked" && "border-red-200 bg-red-50 text-red-700",
                  )}
                >
                  {client.status === "active" ? "Actif" : client.status === "inactive" ? "Inactif" : "Bloqué"}
                </Badge>
              </div>
            </div>
          </div>

          {/* Informations de contact */}
          <div className="space-y-3">
            <h3 className="text-lg font-medium text-gray-900">Informations de contact</h3>
            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <Phone className="h-4 w-4 text-[#032313]" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Téléphone</p>
                  <p className="text-sm text-gray-600">{client.phone}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <MapPin className="h-4 w-4 text-[#032313]" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Localisation</p>
                  <p className="text-sm text-gray-600">{client.location}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <Calendar className="h-4 w-4 text-[#032313]" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Client depuis</p>
                  <p className="text-sm text-gray-600">
                    {new Date(client.joinDate).toLocaleDateString("fr-FR", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Statistiques d'achat */}
          <div className="space-y-3">
            <h3 className="text-lg font-medium text-gray-900">Statistiques d'achat</h3>
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-xl font-bold text-blue-600">{client.totalOrders}</div>
                <div className="text-xs text-blue-600">Commandes</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-xl font-bold text-green-600">{(client.totalSpent / 1000000).toFixed(1)}M</div>
                <div className="text-xs text-green-600">Total CFA</div>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <div className="text-xl font-bold text-purple-600">
                  {Math.round(client.totalSpent / client.totalOrders / 1000)}K
                </div>
                <div className="text-xs text-purple-600">Panier moy.</div>
              </div>
            </div>
          </div>

          {/* Actions rapides */}
          <div className="space-y-2 pt-4 border-t">
            <Button className="w-full bg-[#032313] hover:bg-[#032313]/90 text-white">
              <Mail className="h-4 w-4 mr-2" />
              Envoyer un email
            </Button>
            <Button
              variant="outline"
              className="w-full border-[#032313]/20 text-[#032313] hover:bg-[#032313]/5 bg-transparent"
            >
              <Gift className="h-4 w-4 mr-2" />
              Offrir une réduction
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

// Composant principal
export default function ClientsPageClient() {
  const [clients, setClients] = useState<Client[]>(mockClients)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedClients, setSelectedClients] = useState<string[]>([])
  const [filters, setFilters] = useState<any>({})

  // Filtrage des clients
  const filteredClients = useMemo(() => {
    return clients.filter((client) => {
      const matchesSearch =
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.location.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesFilters = Object.entries(filters).every(([key, value]) => {
        if (!value) return true
        if (key === "segment") return client.segment.toLowerCase() === value
        if (key === "filter") return client.status === value
        return true
      })

      return matchesSearch && matchesFilters
    })
  }, [clients, searchTerm, filters])

  const handleSelectClient = (clientId: string) => {
    setSelectedClients((prev) => (prev.includes(clientId) ? prev.filter((id) => id !== clientId) : [...prev, clientId]))
  }

  const handleSelectAll = () => {
    setSelectedClients(
      selectedClients.length === filteredClients.length ? [] : filteredClients.map((client) => client.id),
    )
  }

  const handleBack = () => {
    window.location.href = "/"
  }

  const handleExport = () => {
    console.log("Export des clients")
  }

  const handleAddClient = () => {
    console.log("Ajouter un client")
  }

  const handleBulkAction = (action: string) => {
    console.log("Action en lot:", action, selectedClients)
  }

  const handleFilterChange = (newFilters: any) => {
    setFilters((prev: any) => ({ ...prev, ...newFilters }))
  }

  const handleClearFilters = () => {
    setFilters({})
    setSearchTerm("")
    setSelectedClients([])
  }

  return (
    <>
      {/* ClientsTopBar avec recherche dynamique */}
      <ClientsTopBar
        searchTerm={searchTerm}
        selectedClients={selectedClients}
        totalClients={clients.length}
        onSearchChange={setSearchTerm}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        onBack={handleBack}
        onExport={handleExport}
        onAddClient={handleAddClient}
        onBulkAction={handleBulkAction}
      />

      {/* Contenu principal */}
      <div className="min-h-screen bg-gray-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 space-y-4 lg:space-y-0" style={{ paddingTop: "6rem" }}>
            <div>
              <h1 className="text-3xl font-bold text-[#032313]">Gestion des Clients</h1>
              <p className="text-gray-600 mt-1">Gérez vos clients et leurs informations</p>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                className="border-[#032313]/20 text-[#032313] hover:bg-[#032313]/5 bg-transparent"
                onClick={handleExport}
              >
                <Download className="h-4 w-4 mr-2" />
                Exporter
              </Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-[#032313] hover:bg-[#032313]/90 text-white">
                    <Plus className="h-4 w-4 mr-2" />
                    Nouveau client
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Ajouter un nouveau client</DialogTitle>
                    <DialogDescription>Créez un nouveau profil client avec les informations de base.</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Nom complet</Label>
                        <Input placeholder="Jean Dupont" />
                      </div>
                      <div className="space-y-2">
                        <Label>Email</Label>
                        <Input type="email" placeholder="jean@example.com" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Téléphone</Label>
                        <Input placeholder="+221 77 123 45 67" />
                      </div>
                      <div className="space-y-2">
                        <Label>Localisation</Label>
                        <Input placeholder="Dakar, Sénégal" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Segment</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un segment" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="nouveau">Nouveau</SelectItem>
                          <SelectItem value="standard">Standard</SelectItem>
                          <SelectItem value="premium">Premium</SelectItem>
                          <SelectItem value="vip">VIP</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex justify-end space-x-2 pt-4">
                      <Button variant="outline">Annuler</Button>
                      <Button className="bg-[#032313] hover:bg-[#032313]/90 text-white">Créer le client</Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Statistiques */}
          <ClientStats clients={clients} />

          {/* Indicateurs de filtres actifs */}
          {(searchTerm || Object.keys(filters).length > 0 || selectedClients.length > 0) && (
            <Card className="mb-6">
              <CardContent className="p-4">
                <div className="flex items-center gap-4 flex-wrap">
                  <span className="text-sm text-gray-600">Filtres actifs:</span>
                  {searchTerm && (
                    <Badge variant="outline" className="border-blue-200 bg-blue-50 text-blue-700">
                      Recherche: "{searchTerm}"
                    </Badge>
                  )}
                  {Object.entries(filters).map(([key, value]) => (
                    <Badge key={key} variant="outline" className="border-green-200 bg-green-50 text-green-700">
                      {key}: {String(value)}
                    </Badge>
                  ))}
                  {selectedClients.length > 0 && (
                    <Badge variant="outline" className="border-purple-200 bg-purple-50 text-purple-700">
                      {selectedClients.length} sélectionné(s)
                    </Badge>
                  )}
                  <Button variant="ghost" size="sm" onClick={handleClearFilters} className="text-gray-500">
                    Effacer tout
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Tableau des clients */}
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="w-12">
                        <input
                          type="checkbox"
                          checked={selectedClients.length === filteredClients.length && filteredClients.length > 0}
                          onChange={handleSelectAll}
                          className="rounded border-gray-300"
                        />
                      </TableHead>
                      <TableHead>Client</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead className="hidden md:table-cell">Localisation</TableHead>
                      <TableHead className="text-center">Commandes</TableHead>
                      <TableHead className="text-right">Total dépensé</TableHead>
                      <TableHead className="w-12">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredClients.map((client) => (
                      <TableRow key={client.id} className="hover:bg-gray-50/50">
                        <TableCell>
                          <input
                            type="checkbox"
                            checked={selectedClients.includes(client.id)}
                            onChange={() => handleSelectClient(client.id)}
                            className="rounded border-gray-300"
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={client.avatar || "/placeholder.svg"} />
                              <AvatarFallback className="bg-[#032313] text-white">
                                {client.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0">
                              <div className="font-medium text-gray-900 truncate">{client.name}</div>
                              <div className="text-sm text-gray-500">
                                {client.segment} •{" "}
                                {client.status === "active"
                                  ? "Actif"
                                  : client.status === "inactive"
                                    ? "Inactif"
                                    : "Bloqué"}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="text-sm text-gray-900 truncate">{client.email}</div>
                            <div className="text-sm text-gray-500">{client.phone}</div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0" />
                            <span className="text-sm text-gray-700 truncate">{client.location}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="font-medium text-gray-900">{client.totalOrders}</div>
                          <div className="text-xs text-gray-500">commandes</div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="font-medium text-gray-900">
                            {(client.totalSpent / 1000000).toFixed(1)}M CFA
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            <ClientDetailsSheet client={client} />
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="text-[#032313] hover:bg-[#032313]/10">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Modifier
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Mail className="h-4 w-4 mr-2" />
                                  Envoyer un email
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Gift className="h-4 w-4 mr-2" />
                                  Offrir une réduction
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-red-600">
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Supprimer
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {filteredClients.length === 0 && (
                  <div className="text-center py-12">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun client trouvé</h3>
                    <p className="text-sm text-gray-500 mb-4">
                      Essayez de modifier votre recherche ou ajoutez un nouveau client.
                    </p>
                    <Button className="bg-[#032313] hover:bg-[#032313]/90 text-white" onClick={handleAddClient}>
                      <Plus className="h-4 w-4 mr-2" />
                      Ajouter un client
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
