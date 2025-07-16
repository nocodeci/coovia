"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { RiMoneyDollarCircleLine } from "@remixicon/react"
import type { Table } from "@tanstack/react-table"
import type { PaymentTransaction } from "../../app/types/payment"

interface AmountFilterProps {
  table: Table<PaymentTransaction>
  id: string
}

export function AmountFilter({ table, id }: AmountFilterProps) {
  const amountColumn = table.getColumn("value")
  const amountFilterValue = amountColumn?.getFilterValue() as { min?: number; max?: number } | undefined

  const [minAmount, setMinAmount] = useState<string>(amountFilterValue?.min?.toString() || "")
  const [maxAmount, setMaxAmount] = useState<string>(amountFilterValue?.max?.toString() || "")

  const handleApplyFilter = () => {
    const min = minAmount ? Number.parseFloat(minAmount) : undefined
    const max = maxAmount ? Number.parseFloat(maxAmount) : undefined

    if (min !== undefined || max !== undefined) {
      amountColumn?.setFilterValue({ min, max })
    } else {
      amountColumn?.setFilterValue(undefined)
    }
  }

  const handleClearFilter = () => {
    setMinAmount("")
    setMaxAmount("")
    amountColumn?.setFilterValue(undefined)
  }

  const isActive = amountFilterValue?.min !== undefined || amountFilterValue?.max !== undefined

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm">
          <RiMoneyDollarCircleLine className="size-4 -ms-1 text-muted-foreground/60" aria-hidden="true" />
          Montant
          {isActive && (
            <span className="-me-1 ms-2 inline-flex h-4 max-h-full items-center rounded border border-border bg-background px-1 font-[inherit] text-[0.625rem] font-medium text-muted-foreground/70">
              1
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4" align="end">
        <div className="space-y-4">
          <div className="text-xs font-medium uppercase text-muted-foreground/60">Filtrer par montant (CFA)</div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor={`${id}-min-amount`} className="text-sm">
                Minimum
              </Label>
              <Input
                id={`${id}-min-amount`}
                type="number"
                placeholder="0"
                value={minAmount}
                onChange={(e) => setMinAmount(e.target.value)}
                className="h-9"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`${id}-max-amount`} className="text-sm">
                Maximum
              </Label>
              <Input
                id={`${id}-max-amount`}
                type="number"
                placeholder="1000"
                value={maxAmount}
                onChange={(e) => setMaxAmount(e.target.value)}
                className="h-9"
              />
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Button size="sm" onClick={handleApplyFilter} className="flex-1">
              Appliquer
            </Button>
            <Button size="sm" variant="outline" onClick={handleClearFilter}>
              Effacer
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
