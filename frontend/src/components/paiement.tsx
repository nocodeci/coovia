"use client"

import { useNavigate } from "@tanstack/react-router"
import type React from "react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Pagination, PaginationContent, PaginationItem } from "@/components/ui/pagination"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  type ColumnDef,
  type FilterFn,
  flexRender,
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  getFacetedUniqueValues,
} from "@tanstack/react-table"
import {
  RiArrowDownSLine,
  RiArrowUpSLine,
  RiCloseCircleLine,
  RiFilter3Line,
  RiSearch2Line,
  RiCheckLine,
  RiTimeLine,
  RiLoader4Line,
  RiCloseLine,
  RiBankCardLine,
  RiSmartphoneLine,
  RiGlobalLine,
  RiEyeLine,
  RiFileCopyLine,
  RiDownloadLine,
  RiPrinterLine,
} from "@remixicon/react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { type ReactElement, useState, useMemo, useEffect, useRef } from "react"
import { useId } from "react"
import type { ColumnFiltersState, VisibilityState, PaginationState, SortingState } from "@tanstack/react-table"

// Ajouter l'import du Sheet
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Progress } from "@/components/ui/progress"

// Import des composants et données
import type { PaymentTransaction } from "../types/payment"
import { Avatar } from "@/components/avatar"
import { mockTransactions } from "../data/mock-transactions"
import { PaymentConnectionAnimation } from "@/components/payment-connection-animation"

// Ajouter ces imports après les imports existants
import { GatewayFilter } from "@/components/filters/gateway-filter"
import { PaymentMethodFilter } from "@/components/filters/payment-method-filter"
import { AmountFilter } from "@/components/filters/amount-filter"
import { DateFilter } from "@/components/filters/date-filter"
import { LocationFilter } from "@/components/filters/location-filter"
import { IdFilter } from "@/components/filters/id-filter"

const statusFilterFn: FilterFn<PaymentTransaction> = (row, columnId, filterValue: string[]) => {
  if (!filterValue?.length) return true
  const status = row.getValue(columnId) as string
  return filterValue.includes(status)
}

const gatewayFilterFn: FilterFn<PaymentTransaction> = (row, columnId, filterValue: string[]) => {
  if (!filterValue?.length) return true
  const gateway = row.original.paymentGateway.name
  return filterValue.includes(gateway)
}

const paymentMethodFilterFn: FilterFn<PaymentTransaction> = (row, columnId, filterValue: string[]) => {
  if (!filterValue?.length) return true
  const method = row.original.paymentMethod.type
  return filterValue.includes(method)
}

const amountFilterFn: FilterFn<PaymentTransaction> = (row, columnId, filterValue: { min?: number; max?: number }) => {
  if (!filterValue) return true
  const amount = row.getValue(columnId) as number
  const { min, max } = filterValue
  if (min !== undefined && amount < min) return false
  if (max !== undefined && amount > max) return false
  return true
}

const dateFilterFn: FilterFn<PaymentTransaction> = (row, columnId, filterValue: { start?: string; end?: string }) => {
  if (!filterValue) return true
  const date = new Date(row.getValue(columnId) as string)
  const { start, end } = filterValue
  if (start && date < new Date(start)) return false
  if (end && date > new Date(end + "T23:59:59")) return false
  return true
}

const locationFilterFn: FilterFn<PaymentTransaction> = (row, columnId, filterValue: string[]) => {
  if (!filterValue?.length) return true
  const location = row.getValue(columnId) as string
  return filterValue.includes(location)
}

const idFilterFn: FilterFn<PaymentTransaction> = (row, columnId, filterValue: string) => {
  if (!filterValue) return true
  const id = row.getValue(columnId) as string
  return id.toLowerCase().includes(filterValue.toLowerCase())
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "Initié":
      return <RiTimeLine className="text-blue-500" size={14} aria-hidden="true" />
    case "En Attente":
      return <RiLoader4Line className="text-yellow-500 animate-spin" size={14} aria-hidden="true" />
    case "Succès":
      return <RiCheckLine className="text-emerald-500" size={14} aria-hidden="true" />
    case "Échec":
      return <RiCloseLine className="text-red-500" size={14} aria-hidden="true" />
    default:
      return null
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "Initié":
      return "border-blue-200 bg-blue-50 text-blue-700"
    case "En Attente":
      return "border-yellow-200 bg-yellow-50 text-yellow-700"
    case "Succès":
      return "border-emerald-200 bg-emerald-50 text-emerald-700"
    case "Échec":
      return "border-red-200 bg-red-50 text-red-700"
    default:
      return "border-gray-200 bg-gray-50 text-gray-700"
  }
}

const getPaymentMethodIcon = (type: string) => {
  const iconProps = { size: 16, className: "text-muted-foreground" }

  switch (type) {
    case "card":
      return <RiBankCardLine {...iconProps} />
    case "mobile-money":
      return <RiSmartphoneLine {...iconProps} />
    case "digital-wallet":
      return <RiGlobalLine {...iconProps} />
    case "bank-transfer":
      return <RiBankCardLine {...iconProps} />
    default:
      return <RiGlobalLine {...iconProps} />
  }
}

// Composant TransactionDetailsSheet avec couleur #032313
function TransactionDetailsSheet({ transaction }: { transaction: PaymentTransaction }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          size="sm"
          variant="ghost"
          className="w-10 h-10 p-0 text-[#032313] hover:text-[#032313] hover:bg-[#032313]/10 rounded-full transition-all duration-200 hover:scale-105"
        >
          <RiEyeLine size={18} />
        </Button>
      </SheetTrigger>
      <SheetContent className="bg-white text-gray-900 w-[420px] p-0 [&>button]:hidden border-l border-gray-200 shadow-xl">
        <SheetHeader className="sr-only">
          <SheetTitle>Détails de la transaction</SheetTitle>
          <SheetDescription>Informations détaillées sur cette transaction de paiement.</SheetDescription>
        </SheetHeader>

        <div className="flex h-full w-full flex-col">
          {/* Header */}
          <div className="flex flex-col gap-3 p-6 border-b border-gray-100 bg-gradient-to-r from-[#032313]/5 to-white">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#032313] to-[#032313]/80 flex items-center justify-center shadow-lg">
                <RiEyeLine className="text-white" size={20} />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Transaction</h2>
                <p className="text-sm text-gray-500">#{transaction.id}</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex min-h-0 flex-1 flex-col gap-1 overflow-auto p-4">
            {/* Statut Group */}
            <div className="relative flex w-full min-w-0 flex-col p-3 bg-white rounded-xl border border-gray-100 shadow-sm">
              <div className="text-[#032313] flex h-6 shrink-0 items-center px-1 text-xs font-medium uppercase tracking-wide mb-3">
                Statut de la transaction
              </div>
              <div className="w-full text-sm space-y-3">
                <div className="flex w-full items-center gap-3 overflow-hidden rounded-lg p-3 text-left text-sm bg-[#032313]/5 border border-[#032313]/10">
                  <Badge
                    variant="outline"
                    className={cn("gap-2 py-1.5 px-3 text-sm border-2 font-medium", getStatusColor(transaction.status))}
                  >
                    {getStatusIcon(transaction.status)}
                    {transaction.status}
                  </Badge>
                </div>
                <div className="flex w-full items-center gap-3 overflow-hidden rounded-lg p-3 text-left text-sm">
                  <div className="flex-1 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Progression</span>
                      <span className="text-[#032313] font-medium">{transaction.progression}%</span>
                    </div>
                    <Progress className="h-2 bg-gray-100 [&>div]:bg-[#032313]" value={transaction.progression} />
                  </div>
                </div>
              </div>
            </div>

            {/* Client Group */}
            <div className="relative flex w-full min-w-0 flex-col p-3 bg-white rounded-xl border border-gray-100 shadow-sm mt-2">
              <div className="text-[#032313] flex h-6 shrink-0 items-center px-1 text-xs font-medium uppercase tracking-wide mb-3">
                Informations client
              </div>
              <div className="w-full text-sm">
                <div className="flex w-full items-center gap-3 overflow-hidden rounded-lg p-3 text-left text-sm hover:bg-[#032313]/5 transition-colors">
                  <Avatar name={transaction.clientName} size="md" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate text-gray-900">{transaction.clientName}</div>
                    <div className="text-sm text-gray-500 truncate">{transaction.location}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Montant Group */}
            <div className="relative flex w-full min-w-0 flex-col p-3 bg-white rounded-xl border border-gray-100 shadow-sm mt-2">
              <div className="text-[#032313] flex h-6 shrink-0 items-center px-1 text-xs font-medium uppercase tracking-wide mb-3">
                Montant
              </div>
              <div className="w-full text-sm">
                <div className="flex w-full items-center gap-3 overflow-hidden rounded-lg p-4 text-left text-sm bg-gradient-to-r from-[#032313]/10 to-[#032313]/5 border border-[#032313]/20">
                  <div className="w-10 h-10 bg-[#032313]/10 rounded-lg flex items-center justify-center">
                    <RiBankCardLine className="text-[#032313]" size={20} />
                  </div>
                  <div className="flex-1">
                    <div className="text-2xl font-bold text-[#032313]">{transaction.value.toLocaleString()} CFA</div>
                    <div className="text-sm text-[#032313]/70">Montant total</div>
                  </div>
                </div>
              </div>
            </div>

            {/* ID Transaction Group */}
            <div className="relative flex w-full min-w-0 flex-col p-3 bg-white rounded-xl border border-gray-100 shadow-sm mt-2">
              <div className="text-[#032313] flex h-6 shrink-0 items-center px-1 text-xs font-medium uppercase tracking-wide mb-3">
                ID de transaction
              </div>
              <div className="w-full text-sm">
                <div className="flex w-full items-center gap-3 overflow-hidden rounded-lg p-3 text-left text-sm hover:bg-[#032313]/5 transition-colors">
                  <code className="flex-1 text-sm font-mono bg-[#032313]/5 px-3 py-2 rounded-lg border border-[#032313]/10">
                    {transaction.id}
                  </code>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 hover:bg-[#032313]/10 text-[#032313] rounded-lg"
                    onClick={() => navigator.clipboard.writeText(transaction.id)}
                  >
                    <RiFileCopyLine size={14} />
                  </Button>
                </div>
              </div>
            </div>

            {/* Moyen de paiement Group */}
            <div className="relative flex w-full min-w-0 flex-col p-3 bg-white rounded-xl border border-gray-100 shadow-sm mt-2">
              <div className="text-[#032313] flex h-6 shrink-0 items-center px-1 text-xs font-medium uppercase tracking-wide mb-3">
                Moyen de paiement
              </div>
              <div className="w-full text-sm">
                <div className="flex w-full items-center gap-4 overflow-hidden rounded-lg p-3 text-left text-sm hover:bg-[#032313]/5 transition-colors">
                  <div className="w-12 h-12 bg-[#032313]/5 rounded-lg flex items-center justify-center border border-[#032313]/10 flex-shrink-0">
                    <img
                      src={transaction.paymentMethod.logo || "/placeholder.svg"}
                      alt={transaction.paymentMethod.name}
                      className="w-8 h-8 object-contain"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate text-gray-900">{transaction.paymentMethod.name}</div>
                    <div className="text-sm text-gray-500 truncate">{transaction.paymentMethod.details}</div>
                    <div className="flex items-center gap-2 mt-1">
                      {getPaymentMethodIcon(transaction.paymentMethod.type)}
                      <span className="text-xs text-gray-500">{transaction.paymentMethod.provider}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Passerelle Group */}
            <div className="relative flex w-full min-w-0 flex-col p-3 bg-white rounded-xl border border-gray-100 shadow-sm mt-2">
              <div className="text-[#032313] flex h-6 shrink-0 items-center px-1 text-xs font-medium uppercase tracking-wide mb-3">
                Passerelle de paiement
              </div>
              <div className="w-full text-sm">
                <div className="flex w-full items-center gap-4 overflow-hidden rounded-lg p-3 text-left text-sm hover:bg-[#032313]/5 transition-colors">
                  <div className="w-12 h-12 bg-[#032313]/5 rounded-lg flex items-center justify-center border border-[#032313]/10 flex-shrink-0">
                    <img
                      src={transaction.paymentGateway.logo || "/placeholder.svg"}
                      alt={transaction.paymentGateway.name}
                      className="w-8 h-8 object-contain"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate text-gray-900">{transaction.paymentGateway.name}</div>
                    <div className="text-sm text-gray-500">Passerelle de paiement</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Date et heure Group */}
            <div className="relative flex w-full min-w-0 flex-col p-3 bg-white rounded-xl border border-gray-100 shadow-sm mt-2 mb-4">
              <div className="text-[#032313] flex h-6 shrink-0 items-center px-1 text-xs font-medium uppercase tracking-wide mb-3">
                Date et heure
              </div>
              <div className="w-full text-sm space-y-1">
                <div className="flex w-full items-center justify-between gap-3 overflow-hidden rounded-lg p-3 text-left text-sm hover:bg-[#032313]/5 transition-colors">
                  <span className="text-gray-600 text-sm">Date</span>
                  <span className="font-medium text-sm text-[#032313]">
                    {new Date(transaction.joinDate).toLocaleDateString("fr-FR", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex w-full items-center justify-between gap-3 overflow-hidden rounded-lg p-3 text-left text-sm hover:bg-[#032313]/5 transition-colors">
                  <span className="text-gray-600 text-sm">Heure</span>
                  <span className="font-medium text-sm text-[#032313]">
                    {new Date(transaction.joinDate).toLocaleTimeString("fr-FR", {
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex flex-col gap-3 p-4 border-t border-gray-100 bg-[#032313]/5">
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 bg-white hover:bg-[#032313]/5 text-[#032313] text-sm border-[#032313]/20 hover:border-[#032313]/30"
              >
                <RiDownloadLine size={16} className="mr-2" />
                Exporter
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1 bg-white hover:bg-[#032313]/5 text-[#032313] text-sm border-[#032313]/20 hover:border-[#032313]/30"
              >
                <RiPrinterLine size={16} className="mr-2" />
                Imprimer
              </Button>
            </div>
            <SheetClose asChild>
              <Button size="sm" className="w-full text-sm bg-[#032313] hover:bg-[#032313]/90 text-white">
                Fermer
              </Button>
            </SheetClose>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

interface GetColumnsProps {
  data: PaymentTransaction[]
  setData: React.Dispatch<React.SetStateAction<PaymentTransaction[]>>
}

const getColumns = ({ data }: GetColumnsProps): ColumnDef<PaymentTransaction>[] => [
  {
    header: "Client",
    accessorKey: "clientName",
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <Avatar name={row.getValue("clientName")} size="md" />
        <div className="font-medium">{row.getValue("clientName")}</div>
      </div>
    ),
    size: 180,
    enableHiding: false,
  },
  {
    header: "ID",
    accessorKey: "id",
    cell: ({ row }) => <span className="text-muted-foreground font-mono text-sm">{row.getValue("id")}</span>,
    size: 110,
    filterFn: idFilterFn,
  },
  {
    header: "Statut",
    accessorKey: "status",
    cell: ({ row }) => (
      <div className="flex items-center h-full">
        <Badge
          variant="outline"
          className={cn("gap-1 py-0.5 px-2 text-sm border", getStatusColor(row.original.status))}
        >
          {getStatusIcon(row.original.status)}
          {row.original.status}
        </Badge>
      </div>
    ),
    size: 120,
    filterFn: statusFilterFn,
  },
  {
    header: "Localisation",
    accessorKey: "location",
    cell: ({ row }) => <span className="text-muted-foreground">{row.getValue("location")}</span>,
    size: 140,
    filterFn: locationFilterFn,
  },
  {
    header: "Flux de Paiement",
    accessorKey: "paymentFlow",
    cell: ({ row }) => (
      <div className="flex items-center justify-center py-2">
        <PaymentConnectionAnimation
          paymentMethodLogo={row.original.paymentMethod.logo || "/placeholder.svg?height=32&width=48&text=Payment"}
          paymentGatewayLogo={row.original.paymentGateway.logo || "/placeholder.svg"}
          paymentMethodName={row.original.paymentMethod.name}
          paymentGatewayName={row.original.paymentGateway.name}
          status={row.original.status}
        />
      </div>
    ),
    size: 200,
  },
  {
    header: "Montant",
    accessorKey: "value",
    cell: ({ row }) => {
      const value = row.getValue("value") as number
      return (
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex h-full w-full items-center">
                <span className="font-medium">{value} CFA</span>
              </div>
            </TooltipTrigger>
            <TooltipContent align="start" sideOffset={-8}>
              <p>Montant: {value} CFA</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )
    },
    size: 100,
    filterFn: amountFilterFn,
  },
  {
    header: "Date",
    accessorKey: "joinDate",
    cell: ({ row }) => {
      const date = new Date(row.getValue("joinDate"))
      return (
        <div className="text-muted-foreground">
          <div className="text-sm">
            {date.toLocaleDateString("fr-FR", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })}
          </div>
          <div className="text-xs opacity-70">
            {date.toLocaleTimeString("fr-FR", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        </div>
      )
    },
    size: 120,
    filterFn: dateFilterFn,
  },
  {
    id: "actions",
    header: () => <span className="sr-only">Actions</span>,
    cell: ({ row }) => (
      <div className="flex justify-end">
        <TransactionDetailsSheet transaction={row.original} />
      </div>
    ),
    size: 60,
    enableHiding: false,
  },
]

export default function Paiement(): ReactElement {
  const id = useId()
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })
  const inputRef = useRef<HTMLInputElement>(null)
  const [sorting, setSorting] = useState<SortingState>([
    {
      id: "clientName",
      desc: false,
    },
  ])
  const [data, setData] = useState<PaymentTransaction[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const columns = useMemo(() => getColumns({ data, setData }), [data])

  useEffect(() => {
    async function fetchTransactions() {
      try {
        // Simulation d'un délai de chargement
        await new Promise((resolve) => setTimeout(resolve, 1000))
        setData(mockTransactions)
      } catch (error) {
        console.error("Erreur lors de la récupération des données :", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchTransactions()
  }, [])

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    enableSortingRemoval: false,
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    state: {
      sorting,
      pagination,
      columnFilters,
      columnVisibility,
    },
  })

  // Extract complex expressions into separate variables
  const statusColumn = table.getColumn("status")
  const statusFacetedValues = statusColumn?.getFacetedUniqueValues()
  const statusFilterValue = statusColumn?.getFilterValue()

  // Update useMemo hooks with simplified dependencies
  const uniqueStatusValues = useMemo(() => {
    if (!statusColumn) return []
    const values = Array.from(statusFacetedValues?.keys() ?? [])
    return values.sort()
  }, [statusColumn, statusFacetedValues])

  const statusCounts = useMemo(() => {
    if (!statusColumn) return new Map()
    return statusFacetedValues ?? new Map()
  }, [statusColumn, statusFacetedValues])

  const selectedStatuses = useMemo(() => {
    return (statusFilterValue as string[]) ?? []
  }, [statusFilterValue])

  const handleStatusChange = (checked: boolean, value: string) => {
    const filterValue = table.getColumn("status")?.getFilterValue() as string[]
    const newFilterValue = filterValue ? [...filterValue] : []
    if (checked) {
      newFilterValue.push(value)
    } else {
      const index = newFilterValue.indexOf(value)
      if (index > -1) {
        newFilterValue.splice(index, 1)
      }
    }
    table.getColumn("status")?.setFilterValue(newFilterValue.length ? newFilterValue : undefined)
  }

  return (
    <div className="space-y-4">
      {/* Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Left side */}
        <div className="flex items-center gap-3">
          {/* Filter by name */}
          <div className="relative">
            <Input
              id={`${id}-input`}
              ref={inputRef}
              className={cn(
                "peer min-w-60 ps-9 bg-background bg-gradient-to-br from-accent/60 to-accent",
                Boolean(table.getColumn("clientName")?.getFilterValue()) && "pe-9",
              )}
              value={(table.getColumn("clientName")?.getFilterValue() ?? "") as string}
              onChange={(e) => table.getColumn("clientName")?.setFilterValue(e.target.value)}
              placeholder="Recherche par nom du client"
              type="text"
              aria-label="Rechercher par nom du client"
            />
            <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-2 text-muted-foreground/60 peer-disabled:opacity-50">
              <RiSearch2Line size={20} aria-hidden="true" />
            </div>
            {Boolean(table.getColumn("clientName")?.getFilterValue()) && (
              <button
                className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-lg text-muted-foreground/60 outline-offset-2 transition-colors hover:text-foreground focus:z-10 focus-visible:outline-2 focus-visible:outline-ring/70 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Effacer le filtre"
                onClick={() => {
                  table.getColumn("clientName")?.setFilterValue("")
                  if (inputRef.current) {
                    inputRef.current.focus()
                  }
                }}
              >
                <RiCloseCircleLine size={16} aria-hidden="true" />
              </button>
            )}
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Filter by status */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm">
                <RiFilter3Line className="size-4 -ms-1 text-muted-foreground/60" aria-hidden="true" />
                Statut
                {selectedStatuses.length > 0 && (
                  <span className="-me-1 ms-2 inline-flex h-4 max-h-full items-center rounded border border-border bg-background px-1 font-[inherit] text-[0.625rem] font-medium text-muted-foreground/70">
                    {selectedStatuses.length}
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto min-w-36 p-3" align="end">
              <div className="space-y-3">
                <div className="text-xs font-medium uppercase text-muted-foreground/60">Statut de paiement</div>
                <div className="space-y-3">
                  {uniqueStatusValues.map((value, i) => (
                    <div key={value} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id={`${id}-status-${i}`}
                        checked={selectedStatuses.includes(value)}
                        onChange={(e) => handleStatusChange(e.target.checked, value)}
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <Label htmlFor={`${id}-status-${i}`} className="flex grow justify-between gap-2 font-normal">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(value)}
                          {value}
                        </div>
                        <span className="ms-2 text-xs text-muted-foreground">{statusCounts.get(value)}</span>
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {/* Filter by gateway */}
          <GatewayFilter table={table} id={id} />

          {/* Filter by payment method */}
          <PaymentMethodFilter table={table} id={id} />

          {/* Filter by amount */}
          <AmountFilter table={table} id={id} />

          {/* Filter by date */}
          <DateFilter table={table} id={id} />

          {/* Filter by location */}
          <LocationFilter table={table} id={id} />

          {/* Filter by ID */}
          <IdFilter table={table} id={id} />

          {/* Clear all filters */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              table.resetColumnFilters()
            }}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <RiCloseLine className="size-4 -ms-1" />
            Effacer
          </Button>
        </div>
      </div>

      {/* Table */}
      <Table className="table-fixed border-separate border-spacing-0 [&_tr:not(:last-child)_td]:border-b">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="hover:bg-transparent">
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead
                    key={header.id}
                    style={{ width: `${header.getSize()}px` }}
                    className="relative h-9 select-none bg-header-sidebar border-y border-border first:border-l first:rounded-l-lg last:border-r last:rounded-r-lg"
                  >
                    {header.isPlaceholder ? null : header.column.getCanSort() ? (
                      <div
                        className={cn(
                          header.column.getCanSort() && "flex h-full cursor-pointer select-none items-center gap-2",
                        )}
                        onClick={header.column.getToggleSortingHandler()}
                        onKeyDown={(e) => {
                          // Enhanced keyboard handling for sorting
                          if (header.column.getCanSort() && (e.key === "Enter" || e.key === " ")) {
                            e.preventDefault()
                            header.column.getToggleSortingHandler()?.(e)
                          }
                        }}
                        tabIndex={header.column.getCanSort() ? 0 : undefined}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {{
                          asc: <RiArrowUpSLine className="shrink-0 opacity-60" size={16} aria-hidden="true" />,
                          desc: <RiArrowDownSLine className="shrink-0 opacity-60" size={16} aria-hidden="true" />,
                        }[header.column.getIsSorted() as string] ?? null}
                      </div>
                    ) : (
                      flexRender(header.column.columnDef.header, header.getContext())
                    )}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <tbody aria-hidden="true" className="table-row h-1"></tbody>
        <TableBody>
          {isLoading ? (
            <TableRow className="hover:bg-transparent [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg">
              <TableCell colSpan={columns.length} className="h-24 text-center">
                Chargement...
              </TableCell>
            </TableRow>
          ) : table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                className="border-0 [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg h-px hover:bg-accent/50"
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="last:py-0 h-[inherit]">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow className="hover:bg-transparent [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg">
              <TableCell colSpan={columns.length} className="h-24 text-center">
                Aucun résultat.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
        <tbody aria-hidden="true" className="table-row h-1"></tbody>
      </Table>

      {/* Pagination */}
      {table.getRowModel().rows.length > 0 && (
        <div className="flex items-center justify-between gap-3">
          <p className="flex-1 whitespace-nowrap text-sm text-muted-foreground" aria-live="polite">
            Page <span className="text-foreground">{table.getState().pagination.pageIndex + 1}</span> sur{" "}
            <span className="text-foreground">{table.getPageCount()}</span>
          </p>
          <Pagination className="w-auto">
            <PaginationContent className="gap-3">
              <PaginationItem>
                <Button
                  variant="outline"
                  className="aria-disabled:pointer-events-none aria-disabled:opacity-50 bg-transparent"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                  aria-label="Aller à la page précédente"
                >
                  Précédent
                </Button>
              </PaginationItem>
              <PaginationItem>
                <Button
                  variant="outline"
                  className="aria-disabled:pointer-events-none aria-disabled:opacity-50 bg-transparent"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                  aria-label="Aller à la page suivante"
                >
                  Suivant
                </Button>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  )
}

function ViewDetailsButton({ transactionId }: { transactionId: string }): ReactElement {
  const navigate = useNavigate()
  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex justify-end">
            <Button
              size="sm"
              variant="ghost"
              className="w-10 h-10 p-0 text-[#032313] hover:text-[#032313] hover:bg-[#032313]/10 rounded-full transition-all duration-200 hover:scale-105"
              onClick={() => navigate({ to: `/paiement/${transactionId}` })}
            >
              <RiEyeLine size={18} />
            </Button>
          </div>
        </TooltipTrigger>
        <TooltipContent side="left">
          <p>Voir les détails</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
