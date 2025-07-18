"use client"

import { createFileRoute, Link } from "@tanstack/react-router"
import { Plus, Percent, Search, Filter, MoreHorizontal, Edit, Trash2, Copy, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Codes promo d'exemple avec références aux vrais produits
const promoCodes = [
  {
    id: 1,
    code: "WELCOME20",
    type: "percentage" as const,
    value: 20,
    description: "Code de bienvenue pour nouveaux clients",
    products: ["Tous les produits"],
    usageCount: 45,
    usageLimit: 100,
    status: "active" as const,
    validUntil: "2024-12-31",
    createdAt: "2024-01-15",
  },
  {
    id: 2,
    code: "FORMATION50",
    type: "fixed" as const,
    value: 5000,
    description: "Réduction sur les formations",
    products: ["Formation React Avancée", "Formation Next.js Complète"],
    usageCount: 12,
    usageLimit: 50,
    status: "active" as const,
    validUntil: "2024-06-30",
    createdAt: "2024-02-01",
  },
  {
    id: 3,
    code: "EBOOK30",
    type: "percentage" as const,
    value: 30,
    description: "Promotion sur les e-books",
    products: ["E-book JavaScript Avancé", "Guide Marketing Digital"],
    usageCount: 78,
    usageLimit: 100,
    status: "active" as const,
    validUntil: "2024-12-31",
    createdAt: "2024-11-01",
  },
  {
    id: 4,
    code: "TEMPLATE15",
    type: "percentage" as const,
    value: 15,
    description: "Réduction sur les templates",
    products: ["Dashboard Admin React", "Template E-commerce Shopify"],
    usageCount: 23,
    usageLimit: 75,
    status: "expired" as const,
    validUntil: "2024-11-30",
    createdAt: "2024-10-01",
  },
]

export function PromoCodesPage() {
  return (
    <div className="container mx-auto px-6 py-8">
      {/* En-tête avec titre et bouton créer */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Codes Promo</h1>
          <p className="text-muted-foreground mt-1">Gérez vos codes de réduction et promotions</p>
        </div>
        <Link to="/marketing/ajouter">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Créer un code promo
          </Button>
        </Link>
      </div>

      {/* Filtres et recherche */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Rechercher un code..." className="pl-10" />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filtres
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Liste des codes promo */}
      <div className="grid gap-4">
        {promoCodes.map((promo) => (
          <Card key={promo.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Percent className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-bold text-xl font-mono">{promo.code}</h3>
                      <Badge
                        variant={
                          promo.status === "active"
                            ? "default"
                            : promo.status === "expired"
                              ? "destructive"
                              : "secondary"
                        }
                      >
                        {promo.status === "active" ? "Actif" : promo.status === "expired" ? "Expiré" : "Inactif"}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2 text-xs"
                        onClick={() => navigator.clipboard.writeText(promo.code)}
                      >
                        <Copy className="h-3 w-3 mr-1" />
                        Copier
                      </Button>
                    </div>
                    <p className="text-muted-foreground mb-3">{promo.description}</p>
                    <div className="flex items-center gap-6 text-sm">
                      <div className="flex items-center gap-1">
                        <span className="font-medium">Réduction:</span>
                        <span className="text-primary font-semibold">
                          {promo.type === "percentage" ? `${promo.value}%` : `${promo.value.toLocaleString()} FCFA`}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="font-medium">Utilisé:</span>
                        <span>
                          {promo.usageCount}/{promo.usageLimit}
                        </span>
                        <div className="w-16 h-2 bg-muted rounded-full ml-2">
                          <div
                            className="h-full bg-primary rounded-full"
                            style={{ width: `${(promo.usageCount / promo.usageLimit) * 100}%` }}
                          />
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="font-medium">Expire le:</span>
                        <span>{new Date(promo.validUntil).toLocaleDateString("fr-FR")}</span>
                      </div>
                    </div>
                    <div className="mt-3">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <span className="font-medium">Produits concernés:</span>
                        <span>{promo.products.join(", ")}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    Voir
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Edit className="h-4 w-4 mr-2" />
                        Modifier
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Copy className="h-4 w-4 mr-2" />
                        Dupliquer
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Supprimer
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {promoCodes.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Percent className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Aucun code promo</h3>
            <p className="text-muted-foreground mb-4">Commencez par créer votre premier code de réduction</p>
            <Link to="/marketing/ajouter">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Créer un code promo
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export const Route = createFileRoute("/_authenticated/marketing/")({
  component: PromoCodesPage,
})
