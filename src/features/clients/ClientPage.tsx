"use client"

import { useState, useMemo } from "react"
import {
  Users,
  Search,
  Download,
  Mail,
  Phone,
  MapPin,
  Calendar,
  ShoppingBag,
  TrendingUp,
  Eye,
  Edit,
  Trash2,
  Plus,
  MoreHorizontal,
  UserPlus,
  Clock,
  CreditCard,
  Tag,
  BarChart3,
  Gift,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { mockClients, type Client } from "@/data/mock-clients"

// Composant de statistiques
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4 text-[#032313]" />
            <div className="text-sm font-medium text-muted-foreground">Total Clients</div>
          </div>
          <div className="text-2xl font-bold text-[#032313]">{stats.totalClients}</div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-4 w-4 text-green-600" />
            <div className="text-sm font-medium text-muted-foreground">Clients Actifs</div>
          </div>
          <div className="text-2xl font-bold text-green-600">{stats.activeClients}</div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <CreditCard className="h-4 w-4 text-blue-600" />
            <div className="text-sm font-medium text-muted-foreground">Chiffre d'affaires</div>
          </div>
          <div className="text-2xl font-bold text-blue-600">{stats.totalRevenue.toLocaleString()} CFA</div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <ShoppingBag className="h-4 w-4 text-purple-600" />
            <div className="text-sm font-medium text-muted-foreground">Panier Moyen</div>
          </div>
          <div className="text-2xl font-bold text-purple-600">
            {Math.round(stats.avgOrderValue).toLocaleString()} CFA
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <UserPlus className="h-4 w-4 text-orange-600" />
            <div className="text-sm font-medium text-muted-foreground">Nouveaux ce mois</div>
          </div>
          <div className="text-2xl font-bold text-orange-600">{stats.newThisMonth}</div>
        </CardContent>
      </Card>
    </div>
  )
}

// Composant de détails client
function ClientDetailsSheet({ client }: { client: Client }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="text-[#032313] hover:bg-[#032313]/10">
          <Eye className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[600px] sm:w-[800px]">
        <SheetHeader>
          <SheetTitle className="flex items-center space-x-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={client.avatar || "/placeholder.svg"} />
              <AvatarFallback className="bg-[#032313] text-white">
                {client.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="text-xl font-semibold">{client.name}</div>
              <div className="text-sm text-muted-foreground">{client.email}</div>
            </div>
          </SheetTitle>
          <SheetDescription>Informations détaillées et historique du client</SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Informations générales */}
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Phone className="h-4 w-4 text-[#032313]" />
                  <span className="text-sm font-medium">Téléphone</span>
                </div>
                <div className="text-sm text-muted-foreground">{client.phone}</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <MapPin className="h-4 w-4 text-[#032313]" />
                  <span className="text-sm font-medium">Localisation</span>
                </div>
                <div className="text-sm text-muted-foreground">{client.location}</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Calendar className="h-4 w-4 text-[#032313]" />
                  <span className="text-sm font-medium">Client depuis</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  {new Date(client.joinDate).toLocaleDateString("fr-FR")}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Tag className="h-4 w-4 text-[#032313]" />
                  <span className="text-sm font-medium">Segment</span>
                </div>
                <Badge variant="outline" className="border-[#032313]/20 text-[#032313]">
                  {client.segment}
                </Badge>
              </CardContent>
            </Card>
          </div>

          {/* Statistiques d'achat */}
          <Card>
            <CardHeader>
              <CardTitle className="text-[#032313] flex items-center space-x-2">
                <BarChart3 className="h-5 w-5" />
                <span>Statistiques d'achat</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#032313]">{client.totalOrders}</div>
                  <div className="text-sm text-muted-foreground">Commandes</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#032313]">{client.totalSpent.toLocaleString()} CFA</div>
                  <div className="text-sm text-muted-foreground">Total dépensé</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#032313]">
                    {Math.round(client.totalSpent / client.totalOrders).toLocaleString()} CFA
                  </div>
                  <div className="text-sm text-muted-foreground">Panier moyen</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Historique des commandes */}
          <Card>
            <CardHeader>
              <CardTitle className="text-[#032313] flex items-center space-x-2">
                <ShoppingBag className="h-5 w-5" />
                <span>Dernières commandes</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {client.recentOrders?.map((order, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-[#032313] rounded-full"></div>
                      <div>
                        <div className="font-medium">{order.product}</div>
                        <div className="text-sm text-muted-foreground">{order.date}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{order.amount.toLocaleString()} CFA</div>
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-xs",
                          order.status === "completed" && "border-green-200 text-green-700 bg-green-50",
                          order.status === "pending" && "border-yellow-200 text-yellow-700 bg-yellow-50",
                          order.status === "cancelled" && "border-red-200 text-red-700 bg-red-50",
                        )}
                      >
                        {order.status}
                      </Badge>
                    </div>
                  </div>
                )) || <div className="text-center text-muted-foreground py-4">Aucune commande récente</div>}
              </div>
            </CardContent>
          </Card>

          {/* Actions rapides */}
          <div className="flex space-x-2">
            <Button className="flex-1 bg-[#032313] hover:bg-[#032313]/90 text-white">
              <Mail className="h-4 w-4 mr-2" />
              Envoyer un email
            </Button>
            <Button
              variant="outline"
              className="flex-1 border-[#032313]/20 text-[#032313] hover:bg-[#032313]/5 bg-transparent"
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
  const [statusFilter, setStatusFilter] = useState("all")
  const [segmentFilter, setSegmentFilter] = useState("all")
  const [selectedClients, setSelectedClients] = useState<string[]>([])

  // Filtrage des clients
  const filteredClients = useMemo(() => {
    return clients.filter((client) => {
      const matchesSearch =
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.location.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = statusFilter === "all" || client.status === statusFilter
      const matchesSegment = segmentFilter === "all" || client.segment === segmentFilter

      return matchesSearch && matchesStatus && matchesSegment
    })
  }, [clients, searchTerm, statusFilter, segmentFilter])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "border-green-200 bg-green-50 text-green-700"
      case "inactive":
        return "border-gray-200 bg-gray-50 text-gray-700"
      case "blocked":
        return "border-red-200 bg-red-50 text-red-700"
      default:
        return "border-gray-200 bg-gray-50 text-gray-700"
    }
  }

  const getSegmentColor = (segment: string) => {
    switch (segment) {
      case "VIP":
        return "border-purple-200 bg-purple-50 text-purple-700"
      case "Premium":
        return "border-blue-200 bg-blue-50 text-blue-700"
      case "Standard":
        return "border-green-200 bg-green-50 text-green-700"
      case "Nouveau":
        return "border-orange-200 bg-orange-50 text-orange-700"
      default:
        return "border-gray-200 bg-gray-50 text-gray-700"
    }
  }

  const handleSelectClient = (clientId: string) => {
    setSelectedClients((prev) => (prev.includes(clientId) ? prev.filter((id) => id !== clientId) : [...prev, clientId]))
  }

  const handleSelectAll = () => {
    setSelectedClients(
      selectedClients.length === filteredClients.length ? [] : filteredClients.map((client) => client.id),
    )
  }

  return (
    <div className="container mx-auto py-8 px-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-[#032313]">Clients</h1>
          <p className="text-muted-foreground">Gérez vos clients et leurs informations</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" className="border-[#032313]/20 text-[#032313] hover:bg-[#032313]/5 bg-transparent">
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
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Ajouter un nouveau client</DialogTitle>
                <DialogDescription>Créez un nouveau profil client avec les informations de base.</DialogDescription>
              </DialogHeader>
              {/* Formulaire d'ajout de client */}
              <div className="space-y-4">
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
                <div className="flex justify-end space-x-2">
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

      {/* Filtres et recherche */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-[300px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher par nom, email ou localisation..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="active">Actif</SelectItem>
                <SelectItem value="inactive">Inactif</SelectItem>
                <SelectItem value="blocked">Bloqué</SelectItem>
              </SelectContent>
            </Select>

            <Select value={segmentFilter} onValueChange={setSegmentFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Segment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les segments</SelectItem>
                <SelectItem value="VIP">VIP</SelectItem>
                <SelectItem value="Premium">Premium</SelectItem>
                <SelectItem value="Standard">Standard</SelectItem>
                <SelectItem value="Nouveau">Nouveau</SelectItem>
              </SelectContent>
            </Select>

            {selectedClients.length > 0 && (
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="border-[#032313]/20 text-[#032313]">
                  {selectedClients.length} sélectionné(s)
                </Badge>
                <Button variant="outline" size="sm" className="text-[#032313] hover:bg-[#032313]/5 bg-transparent">
                  <Mail className="h-4 w-4 mr-2" />
                  Email groupé
                </Button>
                <Button variant="outline" size="sm" className="text-[#032313] hover:bg-[#032313]/5 bg-transparent">
                  <Tag className="h-4 w-4 mr-2" />
                  Changer segment
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Tableau des clients */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
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
                <TableHead>Localisation</TableHead>
                <TableHead>Segment</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Commandes</TableHead>
                <TableHead>Total dépensé</TableHead>
                <TableHead>Dernière activité</TableHead>
                <TableHead className="w-12">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClients.map((client) => (
                <TableRow key={client.id} className="hover:bg-muted/50">
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
                      <div>
                        <div className="font-medium">{client.name}</div>
                        <div className="text-sm text-muted-foreground">
                          Client depuis {new Date(client.joinDate).toLocaleDateString("fr-FR")}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="text-sm">{client.email}</div>
                      <div className="text-sm text-muted-foreground">{client.phone}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{client.location}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn("border", getSegmentColor(client.segment))}>
                      {client.segment}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn("border", getStatusColor(client.status))}>
                      {client.status === "active" ? "Actif" : client.status === "inactive" ? "Inactif" : "Bloqué"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-center">
                      <div className="font-medium">{client.totalOrders}</div>
                      <div className="text-xs text-muted-foreground">commandes</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{client.totalSpent.toLocaleString()} CFA</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{client.lastActivity}</span>
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
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground mb-2">Aucun client trouvé</h3>
              <p className="text-sm text-muted-foreground">
                Essayez de modifier vos filtres ou ajoutez un nouveau client.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
