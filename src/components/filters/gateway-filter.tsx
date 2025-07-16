"use client"

import { useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { RiGlobalLine } from "@remixicon/react"
import type { Table } from "@tanstack/react-table"
import type { PaymentTransaction } from "../../app/types/payment"

interface GatewayFilterProps {
  table: Table<PaymentTransaction>
  id: string
}

export function GatewayFilter({ table, id }: GatewayFilterProps) {
  const gatewayColumn = table.getColumn("paymentGateway")
  const gatewayFacetedValues = gatewayColumn?.getFacetedUniqueValues()
  const gatewayFilterValue = gatewayColumn?.getFilterValue()

  const uniqueGateways = useMemo(() => {
    if (!gatewayColumn) return []
    const values = Array.from(gatewayFacetedValues?.keys() ?? [])
    return values.sort()
  }, [gatewayColumn, gatewayFacetedValues])

  const gatewayCounts = useMemo(() => {
    if (!gatewayColumn) return new Map()
    return gatewayFacetedValues ?? new Map()
  }, [gatewayColumn, gatewayFacetedValues])

  const selectedGateways = useMemo(() => {
    return (gatewayFilterValue as string[]) ?? []
  }, [gatewayFilterValue])

  const handleGatewayChange = (checked: boolean, value: string) => {
    const filterValue = gatewayColumn?.getFilterValue() as string[]
    const newFilterValue = filterValue ? [...filterValue] : []

    if (checked) {
      newFilterValue.push(value)
    } else {
      const index = newFilterValue.indexOf(value)
      if (index > -1) {
        newFilterValue.splice(index, 1)
      }
    }

    gatewayColumn?.setFilterValue(newFilterValue.length ? newFilterValue : undefined)
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm">
          <RiGlobalLine className="size-4 -ms-1 text-muted-foreground/60" aria-hidden="true" />
          Passerelle
          {selectedGateways.length > 0 && (
            <span className="-me-1 ms-2 inline-flex h-4 max-h-full items-center rounded border border-border bg-background px-1 font-[inherit] text-[0.625rem] font-medium text-muted-foreground/70">
              {selectedGateways.length}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto min-w-48 p-3" align="end">
        <div className="space-y-3">
          <div className="text-xs font-medium uppercase text-muted-foreground/60">Passerelles de paiement</div>
          <div className="space-y-3 max-h-60 overflow-y-auto">
            {uniqueGateways.map((value, i) => (
              <div key={value} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id={`${id}-gateway-${i}`}
                  checked={selectedGateways.includes(value)}
                  onChange={(e) => handleGatewayChange(e.target.checked, value)}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <Label htmlFor={`${id}-gateway-${i}`} className="flex grow justify-between gap-2 font-normal">
                  <span className="truncate">{value}</span>
                  <span className="ms-2 text-xs text-muted-foreground flex-shrink-0">{gatewayCounts.get(value)}</span>
                </Label>
              </div>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
