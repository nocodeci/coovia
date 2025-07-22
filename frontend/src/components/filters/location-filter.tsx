"use client"

import { useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { RiMapPinLine } from "@remixicon/react"
import type { Table } from "@tanstack/react-table"
import type { PaymentTransaction } from "../../app/types/payment"

interface LocationFilterProps {
  table: Table<PaymentTransaction>
  id: string
}

export function LocationFilter({ table, id }: LocationFilterProps) {
  const locationColumn = table.getColumn("location")
  const locationFacetedValues = locationColumn?.getFacetedUniqueValues()
  const locationFilterValue = locationColumn?.getFilterValue()

  const uniqueLocations = useMemo(() => {
    if (!locationColumn) return []
    const values = Array.from(locationFacetedValues?.keys() ?? [])
    return values.sort()
  }, [locationColumn, locationFacetedValues])

  const locationCounts = useMemo(() => {
    if (!locationColumn) return new Map()
    return locationFacetedValues ?? new Map()
  }, [locationColumn, locationFacetedValues])

  const selectedLocations = useMemo(() => {
    return (locationFilterValue as string[]) ?? []
  }, [locationFilterValue])

  const handleLocationChange = (checked: boolean, value: string) => {
    const filterValue = locationColumn?.getFilterValue() as string[]
    const newFilterValue = filterValue ? [...filterValue] : []

    if (checked) {
      newFilterValue.push(value)
    } else {
      const index = newFilterValue.indexOf(value)
      if (index > -1) {
        newFilterValue.splice(index, 1)
      }
    }

    locationColumn?.setFilterValue(newFilterValue.length ? newFilterValue : undefined)
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm">
          <RiMapPinLine className="size-4 -ms-1 text-muted-foreground/60" aria-hidden="true" />
          Lieu
          {selectedLocations.length > 0 && (
            <span className="-me-1 ms-2 inline-flex h-4 max-h-full items-center rounded border border-border bg-background px-1 font-[inherit] text-[0.625rem] font-medium text-muted-foreground/70">
              {selectedLocations.length}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto min-w-48 p-3" align="end">
        <div className="space-y-3">
          <div className="text-xs font-medium uppercase text-muted-foreground/60">Localisations</div>
          <div className="space-y-3 max-h-60 overflow-y-auto">
            {uniqueLocations.map((value, i) => (
              <div key={value} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id={`${id}-location-${i}`}
                  checked={selectedLocations.includes(value)}
                  onChange={(e) => handleLocationChange(e.target.checked, value)}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <Label htmlFor={`${id}-location-${i}`} className="flex grow justify-between gap-2 font-normal">
                  <span className="truncate">{value}</span>
                  <span className="ms-2 text-xs text-muted-foreground flex-shrink-0">{locationCounts.get(value)}</span>
                </Label>
              </div>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
