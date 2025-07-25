"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { RiFilter3Line } from "@remixicon/react"
import type { Table } from "@tanstack/react-table"
import { useState } from "react"

interface AmountFilterProps<TData> {
  table: Table<TData>
  id: string
}

export function AmountFilter<TData>({ table, id }: AmountFilterProps<TData>) {
  const [min, setMin] = useState<string>("")
  const [max, setMax] = useState<string>("")
  const [isFiltering, setIsFiltering] = useState(false)

  const handleApplyFilter = () => {
    const minValue = min ? Number.parseFloat(min) : undefined
    const maxValue = max ? Number.parseFloat(max) : undefined

    if (minValue !== undefined || maxValue !== undefined) {
      table.getColumn("value")?.setFilterValue({ min: minValue, max: maxValue })
      setIsFiltering(true)
    } else {
      table.getColumn("value")?.setFilterValue(undefined)
      setIsFiltering(false)
    }
  }

  const handleResetFilter = () => {
    setMin("")
    setMax("")
    table.getColumn("value")?.setFilterValue(undefined)
    setIsFiltering(false)
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm">
          <RiFilter3Line className="size-4 -ms-1 text-muted-foreground/60" aria-hidden="true" />
          Montant
          {isFiltering && (
            <span className="-me-1 ms-2 inline-flex h-4 max-h-full items-center rounded border border-border bg-background px-1 font-[inherit] text-[0.625rem] font-medium text-muted-foreground/70">
              1
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto min-w-60 p-3" align="end">
        <div className="space-y-3">
          <div className="text-xs font-medium uppercase text-muted-foreground/60">Plage de montant</div>
          <div className="space-y-3">
            <div className="flex flex-col gap-2">
              <Label htmlFor={`${id}-min-amount`}>Montant minimum (CFA)</Label>
              <Input
                id={`${id}-min-amount`}
                type="number"
                placeholder="0"
                value={min}
                onChange={(e) => setMin(e.target.value)}
                className="h-8"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor={`${id}-max-amount`}>Montant maximum (CFA)</Label>
              <Input
                id={`${id}-max-amount`}
                type="number"
                placeholder="100000"
                value={max}
                onChange={(e) => setMax(e.target.value)}
                className="h-8"
              />
            </div>
            <div className="flex gap-2 pt-2">
              <Button size="sm" variant="outline" className="flex-1 bg-transparent" onClick={handleResetFilter}>
                Réinitialiser
              </Button>
              <Button size="sm" className="flex-1" onClick={handleApplyFilter}>
                Appliquer
              </Button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
