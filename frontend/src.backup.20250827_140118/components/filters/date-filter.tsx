"use client"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { RiFilter3Line, RiCalendarLine } from "@remixicon/react"
import type { Table } from "@tanstack/react-table"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { useState } from "react"

interface DateFilterProps<TData> {
  table: Table<TData>
  id: string
}

export function DateFilter<TData>({ table, id }: DateFilterProps<TData>) {
  const [startDate, setStartDate] = useState<Date | undefined>(undefined)
  const [endDate, setEndDate] = useState<Date | undefined>(undefined)
  const [isFiltering, setIsFiltering] = useState(false)

  const handleApplyFilter = () => {
    if (startDate || endDate) {
      table.getColumn("joinDate")?.setFilterValue({
        start: startDate ? format(startDate, "yyyy-MM-dd") : undefined,
        end: endDate ? format(endDate, "yyyy-MM-dd") : undefined,
      })
      setIsFiltering(true)
    } else {
      table.getColumn("joinDate")?.setFilterValue(undefined)
      setIsFiltering(false)
    }
  }

  const handleResetFilter = () => {
    setStartDate(undefined)
    setEndDate(undefined)
    table.getColumn("joinDate")?.setFilterValue(undefined)
    setIsFiltering(false)
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm">
          <RiFilter3Line className="size-4 -ms-1 text-muted-foreground/60" aria-hidden="true" />
          Date
          {isFiltering && (
            <span className="-me-1 ms-2 inline-flex h-4 max-h-full items-center rounded border border-border bg-background px-1 font-[inherit] text-[0.625rem] font-medium text-muted-foreground/70">
              1
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-3" align="end">
        <div className="space-y-3">
          <div className="text-xs font-medium uppercase text-muted-foreground/60">Plage de dates</div>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor={`${id}-start-date`} className="flex items-center gap-2">
                <RiCalendarLine size={14} />
                Date de début
              </Label>
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={setStartDate}
                locale={fr}
                className="border rounded-md p-3"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor={`${id}-end-date`} className="flex items-center gap-2">
                <RiCalendarLine size={14} />
                Date de fin
              </Label>
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={setEndDate}
                locale={fr}
                className="border rounded-md p-3"
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
