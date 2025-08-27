"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { RiFilter3Line, RiSearchLine } from "@remixicon/react"
import type { Table } from "@tanstack/react-table"
import { useState } from "react"

interface IdFilterProps<TData> {
  table: Table<TData>
  id: string
}

export function IdFilter<TData>({ table, id }: IdFilterProps<TData>) {
  const [idSearch, setIdSearch] = useState<string>("")
  const [isFiltering, setIsFiltering] = useState(false)

  const handleApplyFilter = () => {
    if (idSearch.trim()) {
      table.getColumn("id")?.setFilterValue(idSearch.trim())
      setIsFiltering(true)
    } else {
      table.getColumn("id")?.setFilterValue(undefined)
      setIsFiltering(false)
    }
  }

  const handleResetFilter = () => {
    setIdSearch("")
    table.getColumn("id")?.setFilterValue(undefined)
    setIsFiltering(false)
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm">
          <RiFilter3Line className="size-4 -ms-1 text-muted-foreground/60" aria-hidden="true" />
          ID
          {isFiltering && (
            <span className="-me-1 ms-2 inline-flex h-4 max-h-full items-center rounded border border-border bg-background px-1 font-[inherit] text-[0.625rem] font-medium text-muted-foreground/70">
              1
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto min-w-60 p-3" align="end">
        <div className="space-y-3">
          <div className="text-xs font-medium uppercase text-muted-foreground/60">Recherche par ID</div>
          <div className="space-y-3">
            <div className="flex flex-col gap-2">
              <Label htmlFor={`${id}-id-search`} className="flex items-center gap-2">
                <RiSearchLine size={14} />
                ID de transaction
              </Label>
              <Input
                id={`${id}-id-search`}
                type="text"
                placeholder="Rechercher un ID..."
                value={idSearch}
                onChange={(e) => setIdSearch(e.target.value)}
                className="h-8"
              />
            </div>
            <div className="flex gap-2 pt-2">
              <Button size="sm" variant="outline" className="flex-1 bg-transparent" onClick={handleResetFilter}>
                Réinitialiser
              </Button>
              <Button size="sm" className="flex-1" onClick={handleApplyFilter}>
                Rechercher
              </Button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
