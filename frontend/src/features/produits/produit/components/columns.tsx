"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { DataTableColumnHeader } from "./data-table-column-header"
import { DataTableRowActions } from "./data-table-row-actions"
import { categories, statuses, types } from "../data/data"
import type { Produit } from "../data/schema"
import { DataTableFacetedFilter } from "./data-table-faceted-filter"
import { PriceRangeFilter } from "./price-range-filter"

// Fonction pour nettoyer le HTML et extraire le texte
const stripHtml = (html: string) => {
  if (!html) return ''
  // Créer un élément temporaire pour extraire le texte
  const tempDiv = document.createElement('div')
  tempDiv.innerHTML = html
  return tempDiv.textContent || tempDiv.innerText || ''
}

export const columns: ColumnDef<Produit>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "nom",
    header: ({ column }) => (
      <div className="flex items-center space-x-2">
        <span>Produit</span>
        <DataTableFacetedFilter column={column} title="Type" options={types} />
      </div>
    ),
    cell: ({ row }) => {
      const type = types.find((type) => type.value === row.original.type)
      const produit = row.original

      return (
        <div className="flex items-center space-x-3">
          <img
            src={produit.image || "/placeholder.svg?height=40&width=40&text=📦"}
            alt={produit.nom}
            className="w-10 h-10 rounded-lg object-cover flex-shrink-0 border"
          />
          <div className="flex flex-col min-w-0">
            <div className="flex items-center space-x-2">
              {type && (
                <Badge variant="outline" className="text-xs">
                  {type.label}
                </Badge>
              )}
            </div>
            <span className="font-medium text-sm truncate max-w-[300px]" title={produit.nom}>
              {produit.nom}
            </span>
            {produit.description && (
              <span className="text-xs text-muted-foreground truncate max-w-[300px]" title={stripHtml(produit.description)}>
                {stripHtml(produit.description)}
              </span>
            )}
          </div>
        </div>
      )
    },
    filterFn: (row, _id, value) => {
      return value.includes(row.original.type)
    },
    size: 350,
  },
  {
    accessorKey: "categorie",
    header: ({ column }) => (
      <div className="flex items-center space-x-2">
        <span>Catégorie</span>
        <DataTableFacetedFilter column={column} title="Catégorie" options={categories} />
      </div>
    ),
    cell: ({ row }) => {
      const categorie = categories.find((categorie) => categorie.value === row.getValue("categorie"))

      if (!categorie) {
        return null
      }

      return (
        <div className="flex w-[100px] items-center">
          {categorie.icon && <categorie.icon className="mr-2 h-4 w-4 text-muted-foreground" />}
          <span>{categorie.label}</span>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "prix",
    header: ({ column }) => (
      <div className="flex items-center space-x-2">
        <span>Prix</span>
        <PriceRangeFilter column={column} title="Prix" />
      </div>
    ),
    cell: ({ row }) => {
      const prix = Number.parseFloat(row.getValue("prix"))

      if (prix === 0) {
        return (
          <Badge variant="secondary" className="text-green-600 bg-green-50">
            Gratuit
          </Badge>
        )
      }

      const formatted = new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: "XOF",
        minimumFractionDigits: 0,
      }).format(prix)

      return <div className="font-medium">{formatted}</div>
    },
    filterFn: (row, id, filterValue: string[]) => {
      if (!filterValue?.length) return true

      const prix = Number.parseFloat(row.getValue(id))

      return filterValue.some((rangeValue) => {
        switch (rangeValue) {
          case "gratuit":
            return prix === 0
          case "0-25000":
            return prix > 0 && prix <= 25000
          case "25000-50000":
            return prix > 25000 && prix <= 50000
          case "50000-100000":
            return prix > 50000 && prix <= 100000
          case "100000+":
            return prix > 100000
          default:
            return false
        }
      })
    },
  },
  {
    accessorKey: "statut",
    header: ({ column }) => (
      <div className="flex items-center space-x-2">
        <span>Statut</span>
        <DataTableFacetedFilter column={column} title="Statut" options={statuses} />
      </div>
    ),
    cell: ({ row }) => {
      const statut = statuses.find((statut) => statut.value === row.getValue("statut"))

      if (!statut) {
        return null
      }

      return (
        <div className="flex w-[100px] items-center">
          {statut.icon && <statut.icon className="mr-2 h-4 w-4 text-muted-foreground" />}
          <span>{statut.label}</span>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "ventes",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Ventes" />,
    cell: ({ row }) => {
      const ventes = row.getValue("ventes") as number
      return (
        <div className="text-center">
          <div className="font-medium">{ventes || 0}</div>
          {row.original.vues && <div className="text-xs text-muted-foreground">{row.original.vues} vues</div>}
        </div>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]
