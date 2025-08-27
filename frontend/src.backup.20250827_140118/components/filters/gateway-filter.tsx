"use client"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { RiFilter3Line } from "@remixicon/react"
import type { Table } from "@tanstack/react-table"
import { useState, useEffect } from "react"

interface GatewayFilterProps<TData> {
  table: Table<TData>
  id: string
}

export function GatewayFilter<TData>({ table, id }: GatewayFilterProps<TData>) {
  const [gateways, setGateways] = useState<{ name: string; logo?: string }[]>([])
  const [selectedGateways, setSelectedGateways] = useState<string[]>([])

  useEffect(() => {
    // Dans un cas réel, ces données viendraient d'une API
    setGateways([
      { name: "CinetPay", logo: "/placeholder.svg?height=24&width=24&text=CP" },
      { name: "PayPal", logo: "/placeholder.svg?height=24&width=24&text=PP" },
      { name: "Stripe", logo: "/placeholder.svg?height=24&width=24&text=ST" },
      { name: "Orange Money", logo: "/placeholder.svg?height=24&width=24&text=OM" },
      { name: "MTN Mobile Money", logo: "/placeholder.svg?height=24&width=24&text=MTN" },
    ])
  }, [])

  const handleGatewayChange = (checked: boolean, value: string) => {
    let newSelectedGateways = [...selectedGateways]

    if (checked) {
      newSelectedGateways.push(value)
    } else {
      newSelectedGateways = newSelectedGateways.filter((gateway) => gateway !== value)
    }

    setSelectedGateways(newSelectedGateways)
    table.getColumn("paymentGateway")?.setFilterValue(newSelectedGateways.length ? newSelectedGateways : undefined)
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm">
          <RiFilter3Line className="size-4 -ms-1 text-muted-foreground/60" aria-hidden="true" />
          Passerelle
          {selectedGateways.length > 0 && (
            <span className="-me-1 ms-2 inline-flex h-4 max-h-full items-center rounded border border-border bg-background px-1 font-[inherit] text-[0.625rem] font-medium text-muted-foreground/70">
              {selectedGateways.length}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto min-w-48 p-3" align="end">
        <div className="space-y-3">
          <div className="text-xs font-medium uppercase text-muted-foreground/60">Passerelle de paiement</div>
          <div className="space-y-3">
            {gateways.map((gateway, i) => (
              <div key={gateway.name} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id={`${id}-gateway-${i}`}
                  checked={selectedGateways.includes(gateway.name)}
                  onChange={(e) => handleGatewayChange(e.target.checked, gateway.name)}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <Label
                  htmlFor={`${id}-gateway-${i}`}
                  className="flex grow items-center justify-between gap-2 font-normal"
                >
                  <div className="flex items-center gap-2">
                    {gateway.logo && (
                      <img
                        src={gateway.logo || "/placeholder.svg"}
                        alt={gateway.name}
                        className="h-5 w-5 rounded-full"
                      />
                    )}
                    {gateway.name}
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
