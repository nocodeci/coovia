"use client"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { RiFilter3Line } from "@remixicon/react"
import type { Table } from "@tanstack/react-table"
import { useState, useEffect } from "react"

interface LocationFilterProps<TData> {
  table: Table<TData>
  id: string
}

export function LocationFilter<TData>({ table, id }: LocationFilterProps<TData>) {
  const [locations, setLocations] = useState<string[]>([])
  const [selectedLocations, setSelectedLocations] = useState<string[]>([])

  useEffect(() => {
    // Dans un cas réel, ces données viendraient d'une API ou seraient extraites des données existantes
    setLocations(["Abidjan", "Bouaké", "Yamoussoukro", "Daloa", "Korhogo", "San-Pédro", "Divo", "Non spécifié"])
  }, [])

  const handleLocationChange = (checked: boolean, value: string) => {
    let newSelectedLocations = [...selectedLocations]

    if (checked) {
      newSelectedLocations.push(value)
    } else {
      newSelectedLocations = newSelectedLocations.filter((location) => location !== value)
    }

    setSelectedLocations(newSelectedLocations)
    table.getColumn("location")?.setFilterValue(newSelectedLocations.length ? newSelectedLocations : undefined)
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm">
          <RiFilter3Line className="size-4 -ms-1 text-muted-foreground/60" aria-hidden="true" />
          Localisation
          {selectedLocations.length > 0 && (
            <span className="-me-1 ms-2 inline-flex h-4 max-h-full items-center rounded border border-border bg-background px-1 font-[inherit] text-[0.625rem] font-medium text-muted-foreground/70">
              {selectedLocations.length}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto min-w-48 p-3" align="end">
        <div className="space-y-3">
          <div className="text-xs font-medium uppercase text-muted-foreground/60">Localisation</div>
          <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
            {locations.map((location, i) => (
              <div key={location} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id={`${id}-location-${i}`}
                  checked={selectedLocations.includes(location)}
                  onChange={(e) => handleLocationChange(e.target.checked, location)}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <Label htmlFor={`${id}-location-${i}`} className="flex grow justify-between gap-2 font-normal">
                  {location}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
