"use client"

import { useState } from "react"
import { Check, ChevronDown, Plus, StoreIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
import { cn } from "@/lib/utils"
import type { Store } from "@/types/store"

interface StoreSelectorProps {
  stores: Store[]
  selectedStore: Store | null
  onStoreChange: (store: Store | null) => void
  compact?: boolean
}

export function StoreSelector({ stores, selectedStore, onStoreChange, compact = false }: StoreSelectorProps) {
  const [open, setOpen] = useState(false)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "inactive":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "Active"
      case "pending":
        return "En attente"
      case "inactive":
        return "Inactive"
      default:
        return status
    }
  }

  if (compact) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" role="combobox" aria-expanded={open} className="w-[200px] justify-between bg-white">
            {selectedStore ? (
              <div className="flex items-center gap-2">
                <Avatar className="h-5 w-5">
                  <AvatarImage src={selectedStore.logo || "/placeholder.svg"} alt={selectedStore.name} />
                  <AvatarFallback className="text-xs">
                    {selectedStore.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="truncate">{selectedStore.name}</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <StoreIcon className="h-4 w-4" />
                <span>Sélectionner une boutique</span>
              </div>
            )}
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0">
          <Command>
            <CommandInput placeholder="Rechercher une boutique..." />
            <CommandList>
              <CommandEmpty>Aucune boutique trouvée.</CommandEmpty>
              <CommandGroup>
                {stores.map((store) => (
                  <CommandItem
                    key={store.id}
                    value={store.name}
                    onSelect={() => {
                      onStoreChange(store.id === selectedStore?.id ? null : store)
                      setOpen(false)
                    }}
                  >
                    <div className="flex items-center gap-3 w-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={store.logo || "/placeholder.svg"} alt={store.name} />
                        <AvatarFallback className="text-xs">{store.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium truncate">{store.name}</span>
                          <Badge className={cn("text-xs", getStatusColor(store.status))}>
                            {getStatusText(store.status)}
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {store.stats.totalProducts} produits • {store.stats.totalOrders} commandes
                        </div>
                      </div>
                      <Check
                        className={cn("ml-auto h-4 w-4", selectedStore?.id === store.id ? "opacity-100" : "opacity-0")}
                      />
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
              <CommandSeparator />
              <CommandGroup>
                <CommandItem onSelect={() => setOpen(false)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Créer une nouvelle boutique
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    )
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between bg-transparent"
        >
          {selectedStore ? (
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={selectedStore.logo || "/placeholder.svg"} alt={selectedStore.name} />
                <AvatarFallback>{selectedStore.name.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="text-left">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{selectedStore.name}</span>
                  <Badge className={getStatusColor(selectedStore.status)}>{getStatusText(selectedStore.status)}</Badge>
                </div>
                <div className="text-xs text-muted-foreground">
                  {selectedStore.stats.totalProducts} produits • {selectedStore.stats.totalOrders} commandes
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <StoreIcon className="h-4 w-4" />
              <span>Sélectionner une boutique</span>
            </div>
          )}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0">
        <Command>
          <CommandInput placeholder="Rechercher une boutique..." />
          <CommandList>
            <CommandEmpty>Aucune boutique trouvée.</CommandEmpty>
            <CommandGroup>
              {stores.map((store) => (
                <CommandItem
                  key={store.id}
                  value={store.name}
                  onSelect={() => {
                    onStoreChange(store.id === selectedStore?.id ? null : store)
                    setOpen(false)
                  }}
                >
                  <div className="flex items-center gap-3 w-full">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={store.logo || "/placeholder.svg"} alt={store.name} />
                      <AvatarFallback>{store.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{store.name}</span>
                        <Badge className={getStatusColor(store.status)}>{getStatusText(store.status)}</Badge>
                      </div>
                      <div className="text-sm text-muted-foreground truncate">{store.description}</div>
                      <div className="text-xs text-muted-foreground">
                        {store.stats.totalProducts} produits • {store.stats.totalOrders} commandes •{" "}
                        {store.stats.totalRevenue.toLocaleString()} FCFA
                      </div>
                    </div>
                    <Check
                      className={cn("ml-auto h-4 w-4", selectedStore?.id === store.id ? "opacity-100" : "opacity-0")}
                    />
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup>
              <CommandItem onSelect={() => setOpen(false)}>
                <Plus className="mr-2 h-4 w-4" />
                Créer une nouvelle boutique
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
