"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { RiHashtag, RiCloseLine } from "@remixicon/react"
import type { Table } from "@tanstack/react-table"
import type { PaymentTransaction } from "../../app/types/payment"

interface IdFilterProps {
  table: Table<PaymentTransaction>
  id: string
}

export function IdFilter({ table, id }: IdFilterProps) {
  const idColumn = table.getColumn("id")
  const idFilterValue = idColumn?.getFilterValue() as string | undefined

  const [searchId, setSearchId] = useState<string>(idFilterValue || "")

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      idColumn?.setFilterValue(searchId || undefined)
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [searchId, idColumn])

  const handleClearFilter = () => {
    setSearchId("")
    idColumn?.setFilterValue(undefined)
  }

  const isActive = Boolean(idFilterValue)

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm">
          <RiHashtag className="size-4 -ms-1 text-muted-foreground/60" aria-hidden="true" />
          ID
          {isActive && (
            <span className="-me-1 ms-2 inline-flex h-4 max-h-full items-center rounded border border-border bg-background px-1 font-[inherit] text-[0.625rem] font-medium text-muted-foreground/70">
              1
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-4" align="end">
        <div className="space-y-4">
          <div className="text-xs font-medium uppercase text-muted-foreground/60">Rechercher par ID</div>

          <div className="relative">
            <Input
              placeholder="Tapez l'ID de transaction..."
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              className="pr-8"
            />
            {searchId && (
              <button
                onClick={handleClearFilter}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <RiCloseLine size={16} />
              </button>
            )}
          </div>

          <div className="text-xs text-muted-foreground">La recherche se fait en temps réel</div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
