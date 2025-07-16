"use client"

import { useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { RiSmartphoneLine, RiBankCardLine, RiGlobalLine } from "@remixicon/react"
import type { Table } from "@tanstack/react-table"
import type { PaymentTransaction } from "../../app/types/payment"

interface PaymentMethodFilterProps {
  table: Table<PaymentTransaction>
  id: string
}

const getPaymentMethodIcon = (type: string) => {
  const iconProps = { size: 14, className: "text-muted-foreground" }

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

const getPaymentMethodLabel = (type: string) => {
  switch (type) {
    case "card":
      return "Carte bancaire"
    case "mobile-money":
      return "Mobile Money"
    case "digital-wallet":
      return "Portefeuille numérique"
    case "bank-transfer":
      return "Virement bancaire"
    default:
      return type
  }
}

export function PaymentMethodFilter({ table, id }: PaymentMethodFilterProps) {
  const methodColumn = table.getColumn("paymentMethodType")
  const methodFacetedValues = methodColumn?.getFacetedUniqueValues()
  const methodFilterValue = methodColumn?.getFilterValue()

  const uniqueMethods = useMemo(() => {
    if (!methodColumn) return []
    const values = Array.from(methodFacetedValues?.keys() ?? [])
    return values.sort()
  }, [methodColumn, methodFacetedValues])

  const methodCounts = useMemo(() => {
    if (!methodColumn) return new Map()
    return methodFacetedValues ?? new Map()
  }, [methodColumn, methodFacetedValues])

  const selectedMethods = useMemo(() => {
    return (methodFilterValue as string[]) ?? []
  }, [methodFilterValue])

  const handleMethodChange = (checked: boolean, value: string) => {
    const filterValue = methodColumn?.getFilterValue() as string[]
    const newFilterValue = filterValue ? [...filterValue] : []

    if (checked) {
      newFilterValue.push(value)
    } else {
      const index = newFilterValue.indexOf(value)
      if (index > -1) {
        newFilterValue.splice(index, 1)
      }
    }

    methodColumn?.setFilterValue(newFilterValue.length ? newFilterValue : undefined)
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm">
          <RiSmartphoneLine className="size-4 -ms-1 text-muted-foreground/60" aria-hidden="true" />
          Moyen
          {selectedMethods.length > 0 && (
            <span className="-me-1 ms-2 inline-flex h-4 max-h-full items-center rounded border border-border bg-background px-1 font-[inherit] text-[0.625rem] font-medium text-muted-foreground/70">
              {selectedMethods.length}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto min-w-48 p-3" align="end">
        <div className="space-y-3">
          <div className="text-xs font-medium uppercase text-muted-foreground/60">Moyens de paiement</div>
          <div className="space-y-3">
            {uniqueMethods.map((value, i) => (
              <div key={value} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id={`${id}-method-${i}`}
                  checked={selectedMethods.includes(value)}
                  onChange={(e) => handleMethodChange(e.target.checked, value)}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <Label htmlFor={`${id}-method-${i}`} className="flex grow justify-between gap-2 font-normal">
                  <div className="flex items-center gap-2">
                    {getPaymentMethodIcon(value)}
                    <span className="truncate">{getPaymentMethodLabel(value)}</span>
                  </div>
                  <span className="ms-2 text-xs text-muted-foreground flex-shrink-0">{methodCounts.get(value)}</span>
                </Label>
              </div>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
