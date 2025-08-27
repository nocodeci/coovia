"use client"

import { useState } from "react"
import { Check, ChevronsUpDown, Plus, Store } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { mockStores } from "@/data/mock-stores"

interface StoreSelectorProps {
  selectedStore?: any
  onStoreChange: (store: any) => void
  onCreateStore: () => void
}

export function StoreSelector({ selectedStore, onStoreChange, onCreateStore }: StoreSelectorProps) {
  const [open, setOpen] = useState(false)
  const stores = mockStores

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between h-auto p-3 bg-transparent"
        >
          {selectedStore ? (
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={selectedStore.logo || "/placeholder.svg"} alt={selectedStore.name} />
                <AvatarFallback>{selectedStore.name.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start">
                <span className="font-medium">{selectedStore.name}</span>
                <div className="flex items-center gap-2">
                  <Badge variant={selectedStore.status === "active" ? "default" : "secondary"} className="text-xs">
                    {selectedStore.status}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{selectedStore.stats.totalProducts} produits</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Store className="h-4 w-4" />
              <span>Sélectionner une boutique</span>
            </div>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
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
                    onStoreChange(store)
                    setOpen(false)
                  }}
                  className="p-3"
                >
                  <div className="flex items-center gap-3 w-full">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={store.logo || "/placeholder.svg"} alt={store.name} />
                      <AvatarFallback>{store.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{store.name}</span>
                        <Check
                          className={cn("h-4 w-4", selectedStore?.id === store.id ? "opacity-100" : "opacity-0")}
                        />
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant={store.status === "active" ? "default" : "secondary"} className="text-xs">
                          {store.status}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{store.stats.totalProducts} produits</span>
                        <span className="text-xs text-muted-foreground">{store.stats.totalOrders} commandes</span>
                      </div>
                    </div>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandGroup>
              <CommandItem onSelect={onCreateStore} className="p-3 border-t">
                <div className="flex items-center gap-3 w-full">
                  <div className="h-10 w-10 rounded-full border-2 border-dashed border-muted-foreground/25 flex items-center justify-center">
                    <Plus className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <span className="font-medium">Créer une nouvelle boutique</span>
                </div>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
