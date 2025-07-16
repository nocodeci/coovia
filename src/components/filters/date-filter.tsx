"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { RiCalendarLine } from "@remixicon/react"
import type { Table } from "@tanstack/react-table"
import type { PaymentTransaction } from "../../app/types/payment"

interface DateFilterProps {
  table: Table<PaymentTransaction>
  id: string
}

export function DateFilter({ table, id }: DateFilterProps) {
  const dateColumn = table.getColumn("joinDate")
  const dateFilterValue = dateColumn?.getFilterValue() as { start?: string; end?: string } | undefined

  const [startDate, setStartDate] = useState<string>(dateFilterValue?.start || "")
  const [endDate, setEndDate] = useState<string>(dateFilterValue?.end || "")

  const handleApplyFilter = () => {
    if (startDate || endDate) {
      dateColumn?.setFilterValue({
        start: startDate || undefined,
        end: endDate || undefined,
      })
    } else {
      dateColumn?.setFilterValue(undefined)
    }
  }

  const handleClearFilter = () => {
    setStartDate("")
    setEndDate("")
    dateColumn?.setFilterValue(undefined)
  }

  const isActive = dateFilterValue?.start !== undefined || dateFilterValue?.end !== undefined

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm">
          <RiCalendarLine className="size-4 -ms-1 text-muted-foreground/60" aria-hidden="true" />
          Date
          {isActive && (
            <span className="-me-1 ms-2 inline-flex h-4 max-h-full items-center rounded border border-border bg-background px-1 font-[inherit] text-[0.625rem] font-medium text-muted-foreground/70">
              1
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4" align="end">
        <div className="space-y-4">
          <div className="text-xs font-medium uppercase text-muted-foreground/60">Filtrer par période</div>

          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor={`${id}-start-date`} className="text-sm">
                Date de début
              </Label>
              <Input
                id={`${id}-start-date`}
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="h-9"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`${id}-end-date`} className="text-sm">
                Date de fin
              </Label>
              <Input
                id={`${id}-end-date`}
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
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
