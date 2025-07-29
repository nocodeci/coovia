import { useState } from "react"
import { useNavigate } from "@tanstack/react-router"
import { useStore } from "@/context/store-context"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Store, ChevronDown, Plus } from "lucide-react"

export function StoreSwitcher() {
  const navigate = useNavigate()
  const { currentStore, stores } = useStore()
  const [isOpen, setIsOpen] = useState(false)

  const handleStoreSelect = (storeId: string) => {
    setIsOpen(false)
    navigate({ to: `/${storeId}/dashboard` })
  }

  const handleCreateStore = () => {
    setIsOpen(false)
    navigate({ to: "/stores" })
  }

  if (!currentStore) {
    return null
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-[200px] justify-between">
          <div className="flex items-center space-x-2">
            <Store className="h-4 w-4" />
            <span className="truncate">{currentStore.name}</span>
          </div>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[200px]" align="start">
        <DropdownMenuLabel>Changer de boutique</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {stores.map((store) => (
          <DropdownMenuItem
            key={store.id}
            onClick={() => handleStoreSelect(store.id)}
            className="flex items-center justify-between"
          >
            <div className="flex items-center space-x-2">
              <Store className="h-4 w-4" />
              <span className="truncate">{store.name}</span>
            </div>
            {store.id === currentStore.id && (
              <Badge variant="secondary" className="text-xs">
                Actuel
              </Badge>
            )}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleCreateStore}>
          <Plus className="h-4 w-4 mr-2" />
          Créer une boutique
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 