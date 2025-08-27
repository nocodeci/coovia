"use client"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { RiFilter3Line, RiBankCardLine, RiSmartphoneLine, RiGlobalLine } from "@remixicon/react"
import type { Table } from "@tanstack/react-table"
import { useState } from "react"

interface PaymentMethodFilterProps<TData> {
  table: Table<TData>
  id: string
}

export function PaymentMethodFilter<TData>({ table, id }: PaymentMethodFilterProps<TData>) {
  const paymentMethods = [
    { type: "card", name: "Carte bancaire", icon: <RiBankCardLine size={16} /> },
    { type: "mobile-money", name: "Mobile Money", icon: <RiSmartphoneLine size={16} /> },
    { type: "digital-wallet", name: "Portefeuille digital", icon: <RiGlobalLine size={16} /> },
    { type: "bank-transfer", name: "Virement bancaire", icon: <RiBankCardLine size={16} /> },
  ]

  const [selectedMethods, setSelectedMethods] = useState<string[]>([])

  const handleMethodChange = (checked: boolean, value: string) => {
    let newSelectedMethods = [...selectedMethods]

    if (checked) {
      newSelectedMethods.push(value)
    } else {
      newSelectedMethods = newSelectedMethods.filter((method) => method !== value)
    }

    setSelectedMethods(newSelectedMethods)
    table.getColumn("paymentMethod")?.setFilterValue(newSelectedMethods.length ? newSelectedMethods : undefined)
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm">
          <RiFilter3Line className="size-4 -ms-1 text-muted-foreground/60" aria-hidden="true" />
          Méthode
          {selectedMethods.length > 0 && (
            <span className="-me-1 ms-2 inline-flex h-4 max-h-full items-center rounded border border-border bg-background px-1 font-[inherit] text-[0.625rem] font-medium text-muted-foreground/70">
              {selectedMethods.length}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto min-w-48 p-3" align="end">
        <div className="space-y-3">
          <div className="text-xs font-medium uppercase text-muted-foreground/60">Méthode de paiement</div>
          <div className="space-y-3">
            {paymentMethods.map((method, i) => (
              <div key={method.type} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id={`${id}-method-${i}`}
                  checked={selectedMethods.includes(method.type)}
                  onChange={(e) => handleMethodChange(e.target.checked, method.type)}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <Label
                  htmlFor={`${id}-method-${i}`}
                  className="flex grow items-center justify-between gap-2 font-normal"
                >
                  <div className="flex items-center gap-2">
                    {method.icon}
                    {method.name}
                  </div>
                </Label>
              </div>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
