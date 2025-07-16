"use client"

import * as React from "react"
import { CheckIcon, PlusCircledIcon } from "@radix-ui/react-icons"
import type { Column } from "@tanstack/react-table"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"

interface PriceRangeFilterProps<TData, TValue> {
  column?: Column<TData, TValue>
  title?: string
}

const priceRanges = [
  { label: "Gratuit", value: "gratuit", min: 0, max: 0 },
  { label: "0 - 25 000 CFA", value: "0-25000", min: 1, max: 25000 },
  { label: "25 000 - 50 000 CFA", value: "25000-50000", min: 25001, max: 50000 },
  { label: "50 000 - 100 000 CFA", value: "50000-100000", min: 50001, max: 100000 },
  { label: "100 000+ CFA", value: "100000+", min: 100001, max: Number.POSITIVE_INFINITY },
]

export function PriceRangeFilter<TData, TValue>({ column, title = "Prix" }: PriceRangeFilterProps<TData, TValue>) {
  const [selectedValues, setSelectedValues] = React.useState<Set<string>>(new Set())

  const handleSelect = (rangeValue: string) => {
    const newSelectedValues = new Set(selectedValues)

    if (newSelectedValues.has(rangeValue)) {
      newSelectedValues.delete(rangeValue)
    } else {
      newSelectedValues.add(rangeValue)
    }

    setSelectedValues(newSelectedValues)

    // Appliquer le filtre
    if (newSelectedValues.size === 0) {
      column?.setFilterValue(undefined)
    } else {
      column?.setFilterValue(Array.from(newSelectedValues))
    }
  }

  const clearFilters = () => {
    setSelectedValues(new Set())
    column?.setFilterValue(undefined)
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 border-dashed bg-transparent">
          <PlusCircledIcon className="mr-2 h-4 w-4" />
          {title}
          {selectedValues.size > 0 && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />
              <Badge variant="secondary" className="rounded-sm px-1 font-normal lg:hidden">
                {selectedValues.size}
              </Badge>
              <div className="hidden space-x-1 lg:flex">
                {selectedValues.size > 2 ? (
                  <Badge variant="secondary" className="rounded-sm px-1 font-normal">
                    {selectedValues.size} sélectionnés
                  </Badge>
                ) : (
                  Array.from(selectedValues).map((value) => {
                    const range = priceRanges.find((r) => r.value === value)
                    return (
                      <Badge key={value} variant="secondary" className="rounded-sm px-1 font-normal">
                        {range?.label}
                      </Badge>
                    )
                  })
                )}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[250px] p-0" align="start">
        <Command>
          <CommandInput placeholder="Rechercher une gamme de prix..." />
          <CommandList>
            <CommandEmpty>Aucun résultat trouvé.</CommandEmpty>
            <CommandGroup>
              {priceRanges.map((range) => {
                const isSelected = selectedValues.has(range.value)
                return (
                  <CommandItem key={range.value} onSelect={() => handleSelect(range.value)}>
                    <div
                      className={cn(
                        "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                        isSelected ? "bg-primary text-primary-foreground" : "opacity-50 [&_svg]:invisible",
                      )}
                    >
                      <CheckIcon className="h-4 w-4" />
                    </div>
                    <span>{range.label}</span>
                  </CommandItem>
                )
              })}
            </CommandGroup>
            {selectedValues.size > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem onSelect={clearFilters} className="justify-center text-center">
                    Effacer les filtres
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
